# Aafi & Hani Backend

This is the backend API service for Aafi & Hani project, built using Node.js, Express, and standard practices.

## Folder Structure

```
├── src/
│   ├── config/          # Database & third-party configurations
│   ├── controllers/     # Route controllers (business logic)
│   ├── middlewares/     # Custom Express middlewares
│   ├── models/          # Database models (Mongoose/Sequelize)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Utility functions & helpers
│   ├── app.js           # Express App configuration
│   └── server.js        # Entry point for starting the server
├── .env                 # Environment variables (local-only)
├── .env.example         # Example Environment variables template
├── .gitignore           # Files to ignore in git version control
└── package.json         # Node.js project manifest and dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Run in production mode:
   ```bash
   npm start
   ```
