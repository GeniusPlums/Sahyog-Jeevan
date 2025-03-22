import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  log("Setting up Vite in development mode", "vite");
  
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit on error in development mode, just log it
        if (msg.includes('Pre-transform error')) {
          log(`Vite transform error: ${msg}`, "vite");
        } else {
          process.exit(1);
        }
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      // Ensure AWS hosts are allowed in development mode
      allowedHosts: [
        'hot-shanna-astrazen-ff947eb8.koyeb.app',
        '*.koyeb.app',
        'localhost',
        '.replit.dev',
        'ec2-*-*-*-*.*.compute.amazonaws.com', // Allow EC2 instances
        '*.amazonaws.com', // Allow all AWS domains
        '*.compute.amazonaws.com', // Allow AWS compute domains
        '*.compute-1.amazonaws.com', // Allow AWS compute domains
        '*.elasticbeanstalk.com' // Allow Elastic Beanstalk domains
      ]
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  log("Setting up static file serving for production mode", "express");
  
  // In production, the dist/public directory contains the built client files
  // This path is relative to where the compiled server code runs (dist folder)
  const distPath = path.resolve(__dirname, "public");
  const uploadsPath = path.resolve(process.cwd(), "uploads");

  log(`Serving static files from: ${distPath}`, "express");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  // Serve static files from the build directory
  app.use(express.static(distPath));

  // Serve uploads with caching and security headers
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '1d',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }));

  // For all other routes, serve the index.html file (SPA behavior)
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    try {
      const indexPath = path.resolve(distPath, 'index.html');
      log(`Serving index.html for path: ${req.path}`, "express");
      res.sendFile(indexPath);
    } catch (err) {
      log(`Error serving index.html: ${err}`, "express");
      res.status(500).send("Internal Server Error");
    }
  });
}
