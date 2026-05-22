# Recipe App Backend

Backend API for Recipe Management Application

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret
3. Run development server:

```bash
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Health

- `GET /health` - Health check

## Testing with Postman

Import `postman/Recipe-App-API.postman_collection.json` into Postman.

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - Token expiration time
- `NODE_ENV` - Environment (development/production)
