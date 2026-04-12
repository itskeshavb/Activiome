# Activiome

A personal activity monitoring application that captures and organizes video clips of daily activities alongside accelerometer (wrist) sensor data. Users can browse clips by date and hour, view motion charts, and tag clips for organization and filtering.

## Features

- Browse video clips organized by date and hour
- View X and Z axis accelerometer waveforms for each clip
- Add and remove custom tags on clips
- Filter clips by tag
- Batch tag multiple clips at once
- Secure per-user data isolation via Auth0 authentication

## Tech Stack

**Frontend**
- React 19 + Vite
- TailwindCSS
- React Router
- TanStack React Query
- Plotly.js (motion charts)
- Auth0 (authentication)

**Backend**
- Node.js + Express
- MySQL / MariaDB
- AWS S3 (video storage, presigned URLs)
- Auth0 JWT validation

**Infrastructure**
- AWS EC2 (backend + database)
- AWS S3 (video files)
- IAM role-based S3 access (no hardcoded credentials)

## Project Structure

```
Activiome/
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # MainPage, ClipDetailPage, TagFilterPage, SettingsPage, LoginPage
│       ├── components/
│       ├── hooks/     # useClips, useAccel, useTags, useTagMutations, useApi
│       └── lib/
└── backend/           # Express API
    └── src/
        ├── routes/    # clips.js, tags.js
        ├── middleware/ # Auth0 JWT validation
        ├── lib/       # helpers.js (parsing), s3.js (presigned URLs)
        └── db/        # MySQL connection pool
```

## API Endpoints

All endpoints require a valid Auth0 Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clips?h=&d=&m=&y=` | Get clips for a given hour/day/month/year |
| GET | `/clips/:id` | Get a single clip by ID |
| GET | `/clips/:id/accel` | Get accelerometer data for a clip |
| POST | `/clips/:id/tags` | Add a tag to a clip |
| DELETE | `/clips/:id/tags/:tag` | Remove a tag from a clip |
| GET | `/tags` | Get all unique tags for the user |
| GET | `/tags/:tag` | Get all clips with a given tag |

## Environment Variables

### Backend (`backend/.env`)

```
PORT=3001
FRONTEND_URL=http://localhost:5173

AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=your-api-audience

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=activiome

AWS_REGION=us-east-2
S3_BUCKET=your-bucket-name
```

### Frontend (`frontend/.env`)

```
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
VITE_API_URL=http://localhost:3001
```

## Local Development

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Deployment

The backend runs on an AWS EC2 instance managed by pm2.

```bash
# Copy updated files to EC2
scp -i "activiome-key.pem" -r backend/src ec2-user@<EC2_IP>:~/backend/
scp -i "activiome-key.pem" backend/package.json ec2-user@<EC2_IP>:~/backend/
scp -i "activiome-key.pem" backend/package-lock.json ec2-user@<EC2_IP>:~/backend/

# On EC2
cd ~/backend && npm install && pm2 restart activiome-backend
```

S3 access is handled via an IAM role attached to the EC2 instance — no AWS credentials are stored in the codebase.
