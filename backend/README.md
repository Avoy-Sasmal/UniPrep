# UniPrep Copilot — Backend

Backend API for UniPrep Copilot. Implements authentication, subject/context management, AI-powered content generation, exam planning, quizzes, study sessions, and community features.

## Tech Stack

- Node.js, Express.js
- MongoDB via Mongoose
- JWT auth (access + refresh tokens)
- Multer (file uploads), CORS
- OpenRouter SDK (LLM orchestration)

## Quick Start

- Create `backend/.env` from `.env.sample`
- Install and run:

```bash
cd backend
npm install
npm run dev
```

- Default server: `http://localhost:5000`

## Environment Variables

- `PORT` — server port (default `5000`)
- `NODE_ENV` — `development` | `production`
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — access token secret
- `JWT_REFRESH_SECRET` — refresh token secret
- `JWT_ACCESS_EXPIRES_IN` — access token TTL (e.g., `15m`)
- `JWT_REFRESH_EXPIRES_IN` — refresh token TTL (e.g., `7d`)
- `OPENROUTER_API_KEY` — OpenRouter API key
- `OPENROUTER_MODEL` — model id (default `openai/gpt-oss-20b:free`)
- `CLIENT_URL` — comma-separated allowed origins for CORS (e.g., `http://localhost:3000`)
- `BACKEND_URL` — backend base URL used for periodic ping

## Commands

- `npm run dev` — start with nodemon
- `npm start` — start without nodemon

## Routes

- Base health:

  - `GET /` — welcome
  - `GET /api/health` — health check
  - `GET /api/test-ai-key` — OpenRouter key diagnostics
  - `GET /ping` — keep-alive endpoint

- Auth (`/api/auth`)

  - `POST /register` — create account
  - `POST /login` — returns access + refresh tokens
  - `POST /refresh` — refresh tokens
  - `GET /me` — current user (requires `Authorization: Bearer <accessToken>`)

- Users (`/api/users`)

  - `GET /profile` — get profile
  - `PUT /profile` — update profile
  - `GET /progress` — progress overview
  - `GET /recent-content` — recent generated items

- Subjects (`/api/subjects`)

  - `GET /` — list
  - `GET /:id` — detail
  - `POST /` — create
  - `PUT /:id` — update
  - `DELETE /:id` — delete

- Context (`/api/context`)

  - `GET /:subjectId` — list for subject
  - `GET /:subjectId/search` — search within subject context
  - `POST /` — upload context (`multipart/form-data` + `file`)
  - `PUT /:id` — update
  - `DELETE /:id` — delete

- Styles (`/api/styles`)

  - `GET /` — user styles
  - `GET /defaults` — default presets
  - `POST /` — create
  - `PUT /:id` — update
  - `DELETE /:id` — delete
  - `PUT /:id/activate` — set active style

- Content (`/api/content`)

  - `GET /item/:id` — content item by id
  - `GET /:subjectId` — list generated content for subject
  - `POST /notes` — generate study notes
  - `POST /report` — generate academic report
  - `POST /ppt` — generate presentation content
  - `PUT /:id` — update
  - `DELETE /:id` — delete

- Exam (`/api/exam`)

  - `POST /blueprint` — exam blueprint
  - `POST /planner` — revision planner
  - `POST /rapid-sheets` — rapid revision sheets
  - `POST /mock-paper` — mock paper
  - `GET /plans/:subjectId` — saved plans by subject

- Quiz (`/api/quiz`)

  - `GET /:subjectId` — list quizzes
  - `POST /` — create quiz
  - `POST /attempt` — submit attempt
  - `GET /analytics/:subjectId` — analytics

- Sessions (`/api/sessions`)

  - `POST /start` — start focus session
  - `PUT /:id/end` — end session
  - `GET /` — list sessions

- Community (`/api/community`)
  - `GET /posts` — list posts
  - `GET /posts/:id` — post details
  - `POST /posts` — create (supports `file` upload)
  - `POST /posts/:id/vote` — up/down vote
  - `POST /posts/:id/comment` — add comment
  - `GET /posts/:id/comments` — list comments
  - `POST /posts/:id/clone` — clone into workspace
  - `POST /posts/:id/report` — report post

## Auth

- Access token in `Authorization: Bearer <token>`
- Refresh token via `POST /api/auth/refresh` with `refreshToken`
- Expiry defaults: access `15m`, refresh `7d`

## Data Models

- `User` — account and profile
- `Subject` — subject metadata
- `Context` — uploaded syllabus/notes/PYQs
- `GeneratedContent` — notes/report/ppt metadata
- `AnswerStyle` — personalized style presets
- `ExamPlan` — blueprint/planner/sheets/mock paper
- `Quiz`, `QuizAttempt` — quizzes and attempts
- `Session` — focus-mode sessions
- `CommunityPost`, `CommunityComment`, `CommunityVote` — community entities

## AI Orchestration

- OpenRouter SDK with streaming responses
- Functions: notes, report, ppt, exam blueprint/planner/sheets/mock paper
- Diagnostic endpoint `GET /api/test-ai-key` verifies key and reports common issues

## Development Notes

- CORS: `CLIENT_URL` controls allowed origins
- File uploads: in-memory via Multer
- Error handling: final middleware returns JSON with `message` and `stack` in development
- Logging: enable as needed; `morgan` is available in dependencies

## Deployment

- Set `MONGO_URI`, JWT secrets, `OPENROUTER_API_KEY`
- Set `CLIENT_URL` to your frontend origins
- Use `PORT` as required by your platform
