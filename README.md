# Versiona

A GitHub-clone version control platform with a custom CLI-based VCS, REST API backend, and a React frontend styled to match GitHub's dark theme.

## Architecture

```
versiona/
├── backend/          # Express + MongoDB REST API + CLI VCS tool
│   ├── controllers/  # Business logic (user, repo, issue, VCS operations)
│   ├── models/       # Mongoose schemas (User, Repository, Issue)
│   ├── routes/       # Express route definitions
│   ├── config/       # AWS S3 client configuration
│   ├── middlewares/   # Auth & authorization placeholders
│   └── app.ts        # Entry point (CLI + HTTP server)
├── frontend/         # Vite + React 19 + Tailwind CSS v4
│   └── src/
│       ├── api/          # Axios instance with JWT interceptors
│       ├── components/   # UI pages and components
│       ├── context/      # Auth provider & context
│       └── utils/        # Route definitions
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (CommonJS) |
| **Backend** | Express 5, Mongoose 9, Socket.IO 4 |
| **Database** | MongoDB (Atlas) |
| **Auth** | JWT (`jsonwebtoken`) + bcryptjs |
| **Cloud Storage** | AWS S3 (commits storage) |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **HTTP** | Axios |
| **UI Theme** | GitHub Dark (custom Tailwind theme) |

## Features

### Backend API (19 endpoints)

#### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user/allUsers` | List all users |
| `POST` | `/user/signup` | Register a new user |
| `POST` | `/user/login` | Authenticate and get JWT |
| `GET` | `/user/:id` | Get user profile by ID |
| `PUT` | `/user/:id` | Update email/password |
| `DELETE` | `/user/:id` | Delete user account |

#### Repository Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/repository/create` | Create a new repository |
| `GET` | `/repository/all` | List all repositories |
| `GET` | `/repository/:id` | Get repository by ID |
| `GET` | `/repository/name/:name` | Get repository by name (case-insensitive) |
| `GET` | `/repository/user/:userId` | Get repositories owned by a user |
| `PUT` | `/repository/:id` | Update description/content |
| `DELETE` | `/repository/:id` | Delete a repository |
| `PATCH` | `/repository/:id/visibility` | Toggle public/private |

#### Issue Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/issue/create/:repoID` | Create an issue in a repository |
| `GET` | `/issue/all/:repoID` | List all issues for a repository |
| `GET` | `/issue/:id` | Get issue by ID |
| `PUT` | `/issue/:id` | Update title/description/status |
| `DELETE` | `/issue/:id` | Delete an issue |

### CLI Version Control System

| Command | Description |
|---------|-------------|
| `pnpm run start init` | Initialize `.versiona` repository |
| `pnpm run start add <file>` | Add file to staging area |
| `pnpm run start commit <message>` | Create a commit from staged files |
| `pnpm run start push` | Upload commits to AWS S3 |
| `pnpm run start pull` | Download commits from AWS S3 |
| `pnpm run start revert <commitID>` | Restore files from a specific commit |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anish-9387/Versiona.git
cd Versiona

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### Configuration

Create `backend/.env`:

```env
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/versiona
PORT=3000
JWT_SECRET=your_jwt_secret
AWS_REGION=eu-north-1
S3_BUCKET=versiona-bucket
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

### Running

```bash
# Start backend (terminal 1)
cd backend
pnpm run start start

# Start frontend (terminal 2)
cd frontend
pnpm dev
```

The frontend runs on `http://localhost:5173` and proxies `/user`, `/repository`, and `/issue` requests to `http://localhost:3000`.

### CLI Usage

```bash
cd backend

# Initialize a .versiona repository
pnpm run start init

# Add a file to staging
pnpm run start add hello.txt

# Commit staged files
pnpm run start commit "Initial commit"

# Push commits to AWS S3
pnpm run start push

# Pull commits from AWS S3
pnpm run start pull

# Revert to a specific commit
pnpm run start revert <commit-uuid>
```

## Project Structure

```
versiona/
├── backend/
│   ├── controllers/
│   │   ├── user.controller.ts      # Auth & profile CRUD
│   │   ├── repository.controller.ts # Repository CRUD & visibility
│   │   ├── issue.controller.ts      # Issue CRUD
│   │   ├── init.controller.ts       # .versiona directory init
│   │   ├── add.controller.ts        # Stage files
│   │   ├── commit.controller.ts     # Create commits with UUID
│   │   ├── push.controller.ts       # Upload to S3
│   │   ├── pull.controller.ts       # Download from S3
│   │   └── revert.controller.ts     # Restore commit files
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── repository.model.ts
│   │   └── issue.model.ts
│   ├── routes/
│   │   ├── index.router.ts          # Mounts sub-routers
│   │   ├── user.router.ts
│   │   ├── repository.router.ts
│   │   └── issue.router.ts
│   ├── config/
│   │   └── aws-config.ts            # S3 client
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # Placeholder
│   │   └── authorise.middleware.ts  # Placeholder
│   └── app.ts                       # Entry: CLI + Express + Socket.IO
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.ts             # Axios instance + JWT interceptors
│       ├── components/
│       │   ├── auth/                # Login, Signup
│       │   ├── home/                # Dashboard
│       │   ├── issue/               # IssueList, IssueDetail, NewIssue
│       │   ├── layout/              # Navbar, Footer
│       │   ├── repo/                # RepoPage, NewRepo, RepoSettings
│       │   ├── search/              # SearchResults
│       │   ├── user/                # Profile, UserSettings, HeatMap
│       │   └── common/              # PrivateRoute
│       ├── context/
│       │   ├── authContext.ts       # React context
│       │   ├── AuthProvider.tsx     # Auth state & login/logout
│       │   └── useAuth.ts          # Auth hook
│       ├── utils/
│       │   └── Routes.tsx           # All route definitions
│       ├── index.css                # Tailwind + GitHub theme
│       ├── main.tsx
│       └── App.tsx
└── README.md
```