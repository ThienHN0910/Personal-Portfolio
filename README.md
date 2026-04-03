# Personal Portfolio

A fullstack personal portfolio web application built with Vue 3, TypeScript, Node.js serverless functions, MongoDB, and deployed on Vercel.

## Tech Stack

### Frontend
- **Vue 3** (Composition API with `<script setup>`)
- **TypeScript** — fully typed
- **Pinia** — state management
- **Vue Router 4** — client-side routing
- **Vite** — build tool
- **Tailwind CSS** + **SCSS** — styling
- **@vueuse/core** — Vue composition utilities
- **Axios** — HTTP client

### Backend
- **Node.js Serverless Functions** (`/api` directory, Vercel)
- **MongoDB** + **Mongoose** — database & ODM
- **JWT** — authentication tokens
- **Google OAuth 2.0** — authentication provider
- **Cloudinary** — image upload & hosting

### Deployment
- **Vercel** — frontend + serverless API

---

## Folder Structure

```
personal-portfolio/
├── api/                          # Serverless API functions
│   ├── auth/
│   │   ├── google.ts             # Redirect to Google OAuth
│   │   └── callback.ts           # Handle OAuth callback, issue JWT
│   ├── blog/
│   │   └── [id].ts               # GET/PUT/DELETE single blog post
│   ├── lib/
│   │   ├── mongodb.ts            # MongoDB connection utility
│   │   ├── cloudinary.ts         # Cloudinary config
│   │   └── auth.ts               # JWT helpers & middleware
│   ├── models/
│   │   ├── Project.ts            # Mongoose Project model
│   │   ├── BlogPost.ts           # Mongoose BlogPost model
│   │   ├── Contact.ts            # Mongoose Contact model
│   │   ├── About.ts              # Mongoose About model
│   │   └── Home.ts               # Mongoose Home model
│   ├── projects/
│   │   └── [id].ts               # GET/PUT/DELETE single project
│   ├── about.ts                  # GET/PUT about data
│   ├── blog.ts                   # GET/POST blog posts
│   ├── contact.ts                # GET (admin)/POST contact messages
│   ├── home.ts                   # GET/PUT home page data
│   ├── projects.ts               # GET/POST projects
│   └── upload.ts                 # POST image to Cloudinary
├── src/
│   ├── assets/scss/              # SCSS styles
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── components/           # Component SCSS partials
│   │   └── main.scss             # Entry stylesheet
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   ├── sections/             # HeroSection, FeaturedProjects
│   │   └── ui/                   # ProjectCard, BlogCard, SkillBadge, LoadingSpinner
│   ├── router/index.ts           # Vue Router configuration
│   ├── stores/                   # Pinia stores
│   │   ├── auth.ts
│   │   ├── home.ts
│   │   ├── about.ts
│   │   ├── projects.ts
│   │   ├── blog.ts
│   │   └── contact.ts
│   ├── types/index.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── api.ts                # Axios instance with interceptors
│   │   └── auth.ts               # localStorage token helpers
│   └── views/
│       ├── HomeView.vue
│       ├── AboutView.vue
│       ├── ProjectsView.vue
│       ├── BlogView.vue
│       ├── BlogPostView.vue
│       ├── ContactView.vue
│       ├── AuthCallbackView.vue
│       └── admin/
│           ├── AdminDashboard.vue
│           ├── AdminProjects.vue
│           ├── AdminBlog.vue
│           ├── AdminMessages.vue
│           └── AdminAbout.vue
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or local MongoDB)
- Google Cloud project with OAuth 2.0 credentials
- Cloudinary account

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd personal-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
ADMIN_EMAIL=your-admin@email.com
VITE_API_BASE_URL=/api
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** For API functions locally, install the Vercel CLI:
> ```bash
> npm i -g vercel
> vercel dev
> ```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Secret for signing JWT tokens (min 32 chars) |
| `ADMIN_EMAIL` | Email address that gets admin role |
| `VITE_API_BASE_URL` | API base URL for frontend (default: `/api`) |

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Import your GitHub repository
3. Configure environment variables in the Vercel dashboard (all variables from `.env.example`)
4. Set `VERCEL_URL` is automatically set by Vercel

### 3. Google OAuth setup

In your Google Cloud Console:
- Add Authorized redirect URI: `https://your-vercel-domain.vercel.app/api/auth/callback`

### 4. Deploy

Vercel will automatically deploy on every push to `main`.

---

## API Endpoints

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | Public | List all projects |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Public | Get single project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |

### Blog
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blog` | Public | List published posts |
| POST | `/api/blog` | Admin | Create post |
| GET | `/api/blog/:id` | Public | Get single post |
| PUT | `/api/blog/:id` | Admin | Update post |
| DELETE | `/api/blog/:id` | Admin | Delete post |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/contact` | Admin | List all messages |
| POST | `/api/contact` | Public | Send contact message |

### Content
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/about` | Public | Get about data |
| PUT | `/api/about` | Admin | Update about data |
| GET | `/api/home` | Public | Get home page data |
| PUT | `/api/home` | Admin | Update home page data |

### Media
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | Admin | Upload image to Cloudinary |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/auth/google` | Public | Redirect to Google OAuth |
| GET | `/api/auth/callback` | Public | Handle OAuth callback |

---

## Admin Access

1. Navigate to the site and click **Admin Login** in the navbar
2. Sign in with the Google account that matches `ADMIN_EMAIL`
3. You will be redirected to `/admin` dashboard
4. From there you can manage projects, blog posts, messages, and page content

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Type-check and build for production
npm run preview   # Preview production build locally
```
