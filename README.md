# AI Powered Code Review System

An AI-powered code review system that analyzes GitHub repositories and helps identify architecture problems, security risks, and code quality issues.

## Features

### Repository Analysis
- Analyze GitHub repositories
- AI-powered code review
- Architecture analysis
- Security analysis
- Scan reports
- Scan history

### GitHub Integration
- GitHub OAuth authentication
- View and select GitHub repositories
- Connect a repository
- Store connected repository information
- GitHub webhook integration

### Repository Analysis Settings
- Skip architecture analysis
- Skip security analysis
- Set minimum severity: Low, Medium, or High
- Save and retrieve repository analysis settings

## Technology Stack
- Next.js
- React
- TypeScript
- GitHub API
- Auth.js
- MongoDB and Mongoose
- OpenAI API
- Redis and BullMQ

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB
- Redis for scan queue processing
- GitHub OAuth credentials
- Required AI API credentials

### Installation

Install dependencies:

```bash
npm install
```

Configure the required environment variables in `.env.local`. Never commit or share API keys, OAuth secrets, or database credentials.

### Run Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Development Status

Repository authentication, connection, and analysis settings have been implemented. Scan execution, Redis queue availability, webhook processing, and end-to-end behavior require verification.

## Contributors

Developed collaboratively as an AI-powered code review project.