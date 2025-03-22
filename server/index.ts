import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Setup logging directory for production
if (isProduction) {
  const logsDir = path.resolve(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log(`Created logs directory at: ${logsDir}`);
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // In production, don't log sensitive data like passwords
        if (isProduction && capturedJsonResponse.password) {
          const sanitized = { ...capturedJsonResponse };
          sanitized.password = "[REDACTED]";
          logLine += ` :: ${JSON.stringify(sanitized)}`;
        } else {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", environment: isProduction ? 'production' : 'development' });
});

(async () => {
  const server = registerRoutes(app);

  // Improved error handling middleware
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Log the error with stack trace in development, but not in production
    if (!isProduction) {
      console.error(`Error: ${message}`);
      console.error(err.stack);
    } else {
      // In production, log errors but with less detail to avoid leaking sensitive info
      log(`Error ${status}: ${message} - ${req.method} ${req.path}`, "error");
    }

    // Don't expose error stack in production
    const response = { 
      message,
      ...(isProduction ? {} : { stack: err.stack })
    };
    
    res.status(status).json(response);
  });
  
  log(`Running in ${isProduction ? 'production' : 'development'} mode`, "express");

  if (!isProduction) {
    // Development mode - use Vite's dev server
    await setupVite(app, server);
  } else {
    // Production mode - serve static files
    // Serve static files from the dist/public directory
    const distPath = path.resolve(__dirname, "public");
    log(`Serving static files from: ${distPath}`, "express");
    
    // Serve static assets with proper cache headers
    app.use(express.static(distPath, {
      maxAge: '7d',
      etag: true
    }));
    
    // Serve uploads directory if it exists
    const uploadsPath = path.resolve(process.cwd(), "uploads");
    if (fs.existsSync(uploadsPath)) {
      log(`Serving uploads from: ${uploadsPath}`, "express");
      app.use('/uploads', express.static(uploadsPath, {
        maxAge: '30d',
        etag: true
      }));
    } else {
      log(`Warning: Uploads directory not found at ${uploadsPath}`, "express");
    }
    
    // For all non-API routes, serve the index.html file (SPA behavior)
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Use PORT from environment variable or default to 5000
  // This ensures compatibility with AWS and other cloud providers
  const PORT = parseInt(process.env.PORT || '5000', 10);
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`, "express");
  });
})();
