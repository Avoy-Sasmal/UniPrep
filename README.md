<div align="center">
  <img src="frontend/public/logo.png" alt="UniPrep Logo" width="120" height="120">
  
  # UniPrep Copilot
  
  ### AI-Powered Academic Assistant for University Students
  
  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-blue?style=flat)](https://openrouter.ai/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
  
  [Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)
  
</div>

---

##  Overview

**UniPrep Copilot** is an intelligent academic companion that leverages AI to help university students excel in their studies. Upload your syllabus, past papers, and notes—then let AI generate personalized study materials, exam prep resources, and revision plans tailored to your university, branch, and answer style preferences.

##  Features

###  Academic Intelligence
- **University-Aware Context**: Specify university, college, branch, semester, and subjects
- **Smart Content Upload**: Upload syllabus PDFs, past year papers, notes, and reference materials
- **Context-Driven Generation**: AI analyzes your uploaded materials for accurate, relevant content

###  AI-Powered Content Generation
- **Study Notes**: Auto-generate comprehensive notes from topics
- **Academic Reports**: Create well-structured reports with proper formatting
- **PPT Content**: Generate presentation-ready slide content
- **Exam Blueprints**: Strategic exam preparation roadmaps
- **Revision Planners**: Time-based revision schedules aligned with exam dates
- **Rapid Revision Sheets**: Quick-reference study materials
- **Mock Papers**: AI-generated practice papers based on PYQs

###  Personalization
- **Answer Style Profiles**: Create custom writing styles (concise, detailed, academic, etc.)
- **Style Templates**: Choose from preset styles or build your own
- **Adaptive Formatting**: Tone, structure, and word count customization

###  Community Features
- **Content Sharing**: Share and discover study materials from peers
- **Discussion Forums**: Engage with fellow students
- **Upvote/Downvote System**: Community-curated content quality

###  Progress Tracking
- **Study Analytics**: Track study time, topics covered, and progress
- **Quiz System**: Test your knowledge with auto-generated quizzes
- **Focus Mode**: Distraction-free study sessions with timer
- **Study Streaks**: Maintain daily study momentum

##  Demo

### Landing Page
<div align="center">
  <img src="frontend/public/Home.png" alt="Landing Page" width="100%">
</div>

### Authentication
<div align="center">
  <img src="frontend/public/SignUp.png" alt="Sign Up Page" width="100%">
</div>

### Dashboard
<div align="center">
  <img src="frontend/public/Dashboard.png" alt="Dashboard" width="100%">
</div>

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas** account - [Sign up](https://www.mongodb.com/cloud/atlas)
- **OpenRouter API Key** - [Get API Key](https://openrouter.ai/keys)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uniprep-copilot.git
   cd uniprep-copilot
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   cd ..
   ```

3. **Configure Environment Variables**

   **Backend** - Create `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniprep?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # OpenRouter AI
   OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   OPENROUTER_MODEL=openai/gpt-4o-mini
   
   # URLs
   BACKEND_URL=http://localhost:5000
   CLIENT_URL=http://localhost:5173
   
   # Cloudinary (optional - for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Frontend** - Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start Development Servers**

   **Option 1: Run both servers separately**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

##  Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev/) | 19.2 | UI Framework |
| [Vite](https://vitejs.dev/) | 7.0 | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Styling |
| [React Router](https://reactrouter.com/) | 7.10 | Routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 | State Management |
| [Axios](https://axios-http.com/) | 1.13 | HTTP Client |
| [Lucide React](https://lucide.dev/) | 0.561 | Icons |
| [Recharts](https://recharts.org/) | 3.5 | Charts & Analytics |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| [Node.js](https://nodejs.org/) | 18+ | Runtime |
| [Express.js](https://expressjs.com/) | 4.18 | Web Framework |
| [MongoDB](https://www.mongodb.com/) | 8.0 | Database |
| [Mongoose](https://mongoosejs.com/) | 8.0 | ODM |
| [OpenRouter](https://openrouter.ai/) | SDK 0.2 | AI Integration |
| [JWT](https://jwt.io/) | 9.0 | Authentication |
| [Bcrypt](https://www.npmjs.com/package/bcryptjs) | 2.4 | Password Hashing |
| [Multer](https://www.npmjs.com/package/multer) | 1.4 | File Uploads |
| [PDF Parse](https://www.npmjs.com/package/pdf-parse) | 1.1 | PDF Extraction |

### AI & Services
- **OpenRouter**: Multi-model AI gateway (GPT-4, Claude, Gemini, etc.)
- **Cloudinary**: Media management (optional)

##  Project Structure

```
uniprep-copilot/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinaryConfig.js      # Cloudinary setup
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User management
│   │   ├── subjectController.js     # Subject CRUD
│   │   ├── contextController.js     # Context upload/management
│   │   ├── styleController.js       # Answer style profiles
│   │   ├── contentController.js     # Content generation
│   │   ├── examController.js        # Exam prep features
│   │   ├── quizController.js        # Quiz system
│   │   ├── sessionController.js     # Study sessions
│   │   └── communityController.js   # Community features
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Subject.js               # Subject schema
│   │   ├── Context.js               # Uploaded context schema
│   │   ├── AnswerStyle.js           # Style profile schema
│   │   ├── GeneratedContent.js      # AI content schema
│   │   ├── ExamPlan.js              # Exam blueprint schema
│   │   ├── Quiz.js                  # Quiz schema
│   │   ├── Session.js               # Study session schema
│   │   └── Community*.js            # Community schemas
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── users.js                 # User endpoints
│   │   ├── subjects.js              # Subject endpoints
│   │   ├── context.js               # Context endpoints
│   │   ├── styles.js                # Style endpoints
│   │   ├── content.js               # Content generation endpoints
│   │   ├── exam.js                  # Exam endpoints
│   │   ├── quiz.js                  # Quiz endpoints
│   │   ├── sessions.js              # Session endpoints
│   │   └── community.js             # Community endpoints
│   ├── services/
│   │   └── aiOrchestrator.js        # AI prompt engineering & API calls
│   ├── utils/
│   │   └── generateToken.js         # JWT utilities
│   ├── .env.sample                  # Environment template
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── frontend/
│   ├── public/
│   │   ├── logo.png                 # App logo
│   │   ├── Home.png                 # Landing page screenshot
│   │   ├── SignUp.png               # Auth screenshot
│   │   └── Dashboard.png            # Dashboard screenshot
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── PrivateRoute.jsx # Route protection
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx       # Top navigation
│   │   │   │   ├── Sidebar.jsx      # Side navigation
│   │   │   │   ├── Footer.jsx       # Footer component
│   │   │   │   └── Layout.jsx       # Layout wrapper
│   │   │   ├── content/
│   │   │   │   ├── ContextManager.jsx       # Upload/manage contexts
│   │   │   │   ├── NotesGenerator.jsx       # Notes generation UI
│   │   │   │   ├── ReportGenerator.jsx      # Report generation UI
│   │   │   │   ├── PPTGenerator.jsx         # PPT generation UI
│   │   │   │   └── ContentList.jsx          # List generated content
│   │   │   └── exam/
│   │   │       ├── ExamMode.jsx             # Exam prep hub
│   │   │       ├── BlueprintView.jsx        # Blueprint display
│   │   │       ├── PlannerView.jsx          # Planner display
│   │   │       ├── RapidSheetsGenerator.jsx # Rapid sheets
│   │   │       └── MockPaperGenerator.jsx   # Mock paper gen
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Landing page
│   │   │   ├── Login.jsx            # Auth page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Subjects.jsx         # Subject management
│   │   │   ├── SubjectWorkspace.jsx # Subject detail view
│   │   │   ├── Styles.jsx           # Style profiles
│   │   │   ├── Community.jsx        # Community feed
│   │   │   ├── PostDetail.jsx       # Post detail view
│   │   │   ├── FocusMode.jsx        # Focus study mode
│   │   │   ├── ContentView.jsx      # Content viewer
│   │   │   └── Profile.jsx          # User profile
│   │   ├── services/
│   │   │   └── api.js               # Axios instance & interceptors
│   │   ├── store/
│   │   │   └── authStore.js         # Zustand auth store
│   │   ├── App.jsx                  # App router
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── .env.sample
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── LICENSE.md
└── README.md
```

## Documentation

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

#### Subjects
- `GET /api/subjects` - List all subjects
- `POST /api/subjects` - Create subject
- `GET /api/subjects/:id` - Get subject details
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

#### Context Management
- `POST /api/context/upload` - Upload context files (PDF, text)
- `GET /api/context` - List all contexts
- `GET /api/context/search` - Search contexts
- `DELETE /api/context/:id` - Delete context

#### Content Generation
- `POST /api/content/notes` - Generate study notes
- `POST /api/content/report` - Generate academic report
- `POST /api/content/ppt` - Generate PPT content
- `GET /api/content` - List generated content
- `DELETE /api/content/:id` - Delete content

#### Exam Preparation
- `POST /api/exam/blueprint` - Generate exam blueprint
- `POST /api/exam/planner` - Create revision planner
- `POST /api/exam/rapid-sheets` - Generate rapid revision sheets
- `POST /api/exam/mock-paper` - Generate mock paper

#### Answer Styles
- `GET /api/styles` - List all styles
- `POST /api/styles` - Create new style
- `PUT /api/styles/:id` - Update style
- `DELETE /api/styles/:id` - Delete style
- `PUT /api/styles/:id/default` - Set default style

#### Community
- `GET /api/community/posts` - Get all posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/vote` - Vote on post
- `POST /api/community/posts/:id/comment` - Comment on post

### Database Models

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  university: String,
  college: String,
  branch: String,
  semester: Number,
  subjects: [ObjectId],
  activeStyle: ObjectId,
  examDates: [{ subject, date }],
  studyStreak: Number,
  createdAt: Date
}
```

#### Subject Model
```javascript
{
  user: ObjectId,
  name: String,
  code: String,
  semester: Number,
  credits: Number,
  examDate: Date,
  contexts: [ObjectId]
}
```

#### Context Model
```javascript
{
  user: ObjectId,
  subject: ObjectId,
  type: String, // 'syllabus', 'pyq', 'notes', 'reference'
  title: String,
  content: String,
  fileUrl: String,
  metadata: Object
}
```

#### GeneratedContent Model
```javascript
{
  user: ObjectId,
  subject: ObjectId,
  type: String, // 'notes', 'report', 'ppt', etc.
  title: String,
  content: String,
  style: ObjectId,
  contexts: [ObjectId],
  createdAt: Date
}
```

##  Usage Guide

### 1. Getting Started
1. **Sign up** and complete your profile
2. **Add subjects** for your current semester
3. **Upload contexts** (syllabus, PYQs, notes)
4. **Create or select** an answer style profile

### 2. Generating Study Materials
1. Navigate to a subject workspace
2. Select content type (Notes/Report/PPT)
3. Choose relevant contexts
4. Specify topics or let AI auto-extract
5. Generate and review content
6. Save or export for later use

### 3. Exam Preparation
1. Set exam dates in subject settings
2. Generate exam blueprint for strategic overview
3. Create revision planner with time allocation
4. Generate rapid revision sheets for quick review
5. Practice with AI-generated mock papers

### 4. Focus Mode
1. Select content to study
2. Set timer duration
3. Enter distraction-free full-screen mode
4. Track study time automatically

##  Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-secret-key` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `OPENROUTER_MODEL` | AI model to use | `openai/gpt-4o-mini` |
| `CLOUDINARY_*` | Cloudinary credentials | N/A |

##  Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```bash
Error: Could not connect to MongoDB
```
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

**2. OpenRouter API Errors**
```bash
Error: Invalid API key
```
- Verify API key is correct and active
- Check account credits on OpenRouter
- Ensure `OPENROUTER_API_KEY` is set in `.env`

**3. Frontend Can't Connect to Backend**
```bash
Error: Network Error
```
- Verify backend is running (`npm run dev` in backend folder)
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is configured correctly

**4. File Upload Issues**
```bash
Error: File too large
```
- Backend has 50MB upload limit
- Check file size and format (PDF recommended)
- Ensure `multer` middleware is properly configured

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

##  License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

##  Contributors

Thanks to these wonderful people who have contributed to this project:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/yourusername">
        <img src="https://github.com/yourusername.png" width="100px;" alt="Your Name"/>
        <br />
        <sub><b>Your Name</b></sub>
      </a>
      <br />
      <sub>Project Lead</sub>
    </td>
    <!-- Add more contributors here following the same format -->
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

### How to Add Your Name

1. Fork the repository
2. Add your details in the Contributors table above:
   ```html
   <td align="center">
     <a href="https://github.com/your-username">
       <img src="https://github.com/your-username.png" width="100px;" alt="Your Name"/>
       <br />
       <sub><b>Your Name</b></sub>
     </a>
     <br />
     <sub>Your Role/Contribution</sub>
   </td>
   ```
3. Create a Pull Request

##  Acknowledgments

- OpenRouter for AI infrastructure
- MongoDB for database solutions
- React and Vite teams for excellent tooling
- Tailwind CSS for styling framework
- All contributors and testers

<!-- ## 📞 Support

For support, email support@uniprep.com or join our Discord community. -->

<!-- ## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Offline mode with local storage
- [ ] Voice-to-text note taking
- [ ] Collaborative study groups
- [ ] Flashcard generation
- [ ] Spaced repetition system
- [ ] Integration with university LMS
- [ ] Video lecture summarization
- [ ] Multi-language support -->

---

<div align="center">
  <p>Made with ❤️ for students, by students</p>
  <p>
    <a href="#-overview">Back to Top</a>
  </p>
</div>
