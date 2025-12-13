# UniPrep Copilot

An AI-powered academic assistant for university students. Generate study notes, reports, PPTs, and prepare for exams with AI assistance tailored to your university, branch, and personal answer style.

## Features

- **University-Aware**: Specify your university, college, branch, semester, and subjects
- **Context-Driven**: Upload syllabus, past year papers, notes, and faculty resources
- **Style-Flexible**: Create custom answer style profiles or use presets
- **Content Generation**: 
  - Study Notes
  - Academic Reports
  - PPT Content
  - Exam Blueprints
  - Revision Planners
  - Rapid Revision Sheets
  - Mock Papers
- **Community**: Share and discover content from other students
- **Focus Mode**: Distraction-free study sessions with timer
- **Progress Tracking**: Track quiz attempts, study streaks, and analytics

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Atlas)
- **AI**: OpenRouter (supports OpenAI and other models)

For detailed guides, see:
- `backend/README.md` — API, env, endpoints, models
- `frontend/README.md` — app structure, env, scripts, auth

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd The-Great-Hackathon-Project
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:

Backend (`backend/.env`):
```
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=openai/gpt-oss-20b:free
NODE_ENV=development
CLIENT_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

**Important**: To use AI features, you need an OpenRouter API key:
1. Sign up at https://openrouter.ai/
2. Get your API key from https://openrouter.ai/keys
3. Add it to your `backend/.env` file as `OPENROUTER_API_KEY`

Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development servers:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000` (configurable via `PORT`)
- Frontend dev server on `http://localhost:3000`

## Project Structure

```
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic (AI orchestrator)
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   ├── store/       # State management
│   │   └── App.jsx      # Main app component
│   └── package.json
└── ARCHITECTURE.md      # Detailed architecture documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/progress` - Progress overview
- `GET /api/users/recent-content` - Recent items

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Context
- `GET /api/context/:subjectId` - Get contexts for subject
- `GET /api/context/:subjectId/search` - Search in subject context
- `POST /api/context` - Upload context (syllabus/PYQ/notes)
- `DELETE /api/context/:id` - Delete context
- `PUT /api/context/:id` - Update context

### Content Generation
- `POST /api/content/notes` - Generate study notes
- `POST /api/content/report` - Generate report
- `POST /api/content/ppt` - Generate PPT content
- `GET /api/content/:subjectId` - List generated content by subject
- `GET /api/content/item/:id` - Get a specific content item
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Exam Mode
- `POST /api/exam/blueprint` - Generate exam blueprint
- `POST /api/exam/planner` - Generate revision planner
- `POST /api/exam/rapid-sheets` - Generate rapid revision sheets
- `POST /api/exam/mock-paper` - Generate mock paper
- `GET /api/exam/plans/:subjectId` - Get saved plans for subject

### Quiz
- `GET /api/quiz/:subjectId` - List quizzes
- `POST /api/quiz` - Create quiz
- `POST /api/quiz/attempt` - Submit attempt
- `GET /api/quiz/analytics/:subjectId` - Subject analytics

### Sessions
- `POST /api/sessions/start` - Start focus session
- `PUT /api/sessions/:id/end` - End session
- `GET /api/sessions` - List sessions

### Community
- `GET /api/community/posts` - List posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/vote` - Vote on post
- `POST /api/community/posts/:id/comment` - Comment on post
- `GET /api/community/posts/:id` - Post details
- `GET /api/community/posts/:id/comments` - List comments
- `POST /api/community/posts/:id/clone` - Clone post to workspace
- `POST /api/community/posts/:id/report` - Report post

See `ARCHITECTURE.md` for complete API documentation.

## Usage

1. **Sign Up/Login**: Create an account with your university details
2. **Add Subjects**: Add your subjects for the current semester
3. **Upload Context**: Upload syllabus, PYQs, and notes for each subject
4. **Set Answer Style**: Choose or create an answer style profile
5. **Generate Content**: Use the workspace to generate notes, reports, PPTs
6. **Exam Mode**: Generate blueprints, planners, and mock papers
7. **Community**: Share your content and discover others' work

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## License
MIT

