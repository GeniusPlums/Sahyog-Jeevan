# BlueCollarConnect

BlueCollarConnect is a modern job platform specifically designed for blue-collar workers and employers. It bridges the gap between skilled workers and job opportunities, providing an intuitive and accessible interface for both job seekers and employers.

![BlueCollarConnect Logo](./client/public/logo.png)

## 🚀 Features

### For Job Seekers
- 📱 Mobile-first, responsive design
- 🔍 Advanced job search with filters
- 📝 Easy job application process
- 📊 Application tracking dashboard
- 👤 Professional profile builder
- 🌐 Multi-language support

### For Employers
- ⚡ Quick job posting
- 📈 Detailed analytics dashboard
- 👥 Applicant management system
- 🎯 Targeted job promotions
- 📱 Mobile app for on-the-go management

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **i18n**: react-i18next

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Storage**: AWS S3

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BlueCollarConnect.git
cd BlueCollarConnect
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
- [Google Play Store](https://play.google.com/store/apps/bluecollarconnect)
- [Apple App Store](https://apps.apple.com/app/bluecollarconnect)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
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

For support, email support@bluecollarconnect.com or join our Slack channel.

## 🔗 Links

- [Website](https://bluecollarconnect.com)
- [Documentation](https://docs.bluecollarconnect.com)
- [Blog](https://blog.bluecollarconnect.com)
- [Community Forum](https://community.bluecollarconnect.com)
