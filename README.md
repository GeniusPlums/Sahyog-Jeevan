# Sahyog Jeevan

Sahyog Jeevan is a modern job platform specifically designed for blue-collar workers and employers in India. It bridges the gap between skilled workers and job opportunities, providing an intuitive and accessible interface in multiple Indian languages.

![Sahyog Jeevan Logo](./client/public/logo.png)

## 🚀 Features

### For Job Seekers
- 📱 Mobile-first, responsive design
- 🔍 Advanced job search with filters (location, job type, salary)
- 📝 Easy job application process with profile builder
- 📊 Application tracking dashboard
- 🌐 Multi-language support (English, Hindi)
- 💼 Quick apply with saved profiles
- 📍 Location-based job search
- 🕒 Flexible work type options (Regular, Gig)

### For Employers
- ⚡ Quick job posting with detailed descriptions
- 📈 Detailed analytics dashboard
- 👥 Applicant management system
- 🎯 Targeted job promotions
- 📱 Mobile app for on-the-go management
- 📊 Application tracking and status updates
- 🔍 Advanced candidate filtering
- 📅 Interview scheduling system

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **i18n**: react-i18next
- **Maps**: Mapbox for location services
- **Charts**: Recharts for analytics

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT + Cookie Sessions
- **File Storage**: AWS S3
- **Caching**: Redis
- **Search**: Elasticsearch
- **Job Queue**: Bull

## 🚢 Deployment Guide

### Koyeb Deployment

To deploy Sahyog Jeevan on Koyeb, follow these steps:

1. **Fork or clone this repository**

2. **Set up required environment variables in Koyeb:**
   - `NODE_ENV`: Set to `production`
   - `PORT`: Set to `5000` (Koyeb health checks use this port)
   - `DATABASE_URL`: Your PostgreSQL connection string

3. **Configure your Koyeb app:**
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
   - **Health Check Port**: `5000`

4. **Configure allowed hosts:**
   - The application is already configured to allow Koyeb domains in the Vite configuration
   - If you're using a custom domain, add it to the `allowedHosts` in both Vite config files

5. **Deploy your app:**
   - Connect your GitHub repository to Koyeb
   - Deploy the main branch

### Common Deployment Issues

- **Blank Screen**: Ensure `NODE_ENV` is set to `production`
- **Health Check Failures**: Verify the server is listening on port 5000
- **Blocked Requests**: Check that your domain is in the `allowedHosts` configuration

### AWS Deployment

Follow these steps to deploy the application on AWS Elastic Beanstalk:

#### Prerequisites

1. Install the AWS CLI and EB CLI:
   ```bash
   pip install awscli awsebcli
   ```

2. Configure AWS credentials:
   ```bash
   aws configure
   ```
   You'll need to enter your AWS Access Key ID, Secret Access Key, default region, and output format.

#### Deployment Steps

1. **Initialize Elastic Beanstalk in your project**:
   ```bash
   cd /path/to/your/project
   eb init
   ```
   - Select your region
   - Create a new application (or select existing)
   - Choose Node.js platform
   - Set up SSH for instance access (optional)

2. **Create an Elastic Beanstalk environment**:
   ```bash
   eb create sahyog-jeevan-env
   ```

3. **Set required environment variables**:
   ```bash
   eb setenv NODE_ENV=production PORT=5000 DATABASE_URL=your-database-connection-string
   ```

4. **Deploy your application**:
   ```bash
   eb deploy
   ```

5. **Open your application**:
   ```bash
   eb open
   ```

#### Database Setup

1. Create a PostgreSQL database using AWS RDS
2. Configure security groups to allow connections from your Elastic Beanstalk environment
3. Update the DATABASE_URL environment variable with your RDS endpoint

#### Troubleshooting AWS Deployments

If you encounter issues:

1. Check CloudWatch logs: `eb logs`
2. SSH into the instance: `eb ssh`
3. Verify environment variables: `eb printenv`
4. Test your build locally with: `NODE_ENV=production npm run build && npm start`

#### Important AWS Configuration Notes

1. **Security Groups**: Ensure your application can access your database
2. **Load Balancer**: Configure health checks to use the `/health` endpoint on port 5000
3. **Environment Variables**: Set all required environment variables
4. **Logs**: Check CloudWatch logs for troubleshooting
5. **Domain**: Set up a custom domain with Route 53 if needed

## 🌐 Internationalization

Sahyog Jeevan currently supports:
- English (en)
- Hindi (hi)

Key internationalization features:
- Complete UI translation
- RTL support ready
- Language detection
- Locale-specific formatting
- Easy language switching
- Fallback handling

To add a new language:
1. Add translations in `client/src/lib/i18n.ts`
2. Update language selector in `client/src/components/LanguageSelector.tsx`
3. Add locale-specific formatting in `client/src/utils/format.ts`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GeniusPlums/sahyog_jeevan.git
cd sahyog_jeevan
```

2. Install dependencies:
```bash
# Install root dependencies
pnpm install

# Install client dependencies
cd client
pnpm install

# Install server dependencies
cd ../server
pnpm install
```

3. Set up environment variables:
```bash
# In root directory
cp .env.example .env
```

4. Set up the database:
```bash
cd server
pnpm prisma migrate dev
```

5. Start the development servers:
```bash
# Start both client and server in development mode
pnpm dev
```

The application will be available at `http://localhost:5173`

## 📱 Mobile App

Download our mobile app from:
- [Google Play Store](https://play.google.com/store/apps/sahyogjeevan)
- [Apple App Store](https://apps.apple.com/app/sahyogjeevan)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- All our contributors and supporters

## 📞 Support

For support:
- Email: support@sahyogjeevan.com
- Discord: [Join our server](https://discord.gg/sahyogjeevan)
- GitHub Issues: [Report bugs](https://github.com/GeniusPlums/sahyog_jeevan/issues)

## 🔗 Links

- [Website](https://sahyogjeevan.com)
- [Documentation](https://docs.sahyogjeevan.com)
- [Blog](https://blog.sahyogjeevan.com)
- [Community Forum](https://community.sahyogjeevan.com)
