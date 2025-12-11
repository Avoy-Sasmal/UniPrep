# UniPrep Copilot - Architecture Design

## 1. Database Schemas

### 1.1 Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  university: String (required),
  college: String (required),
  branch: String (required),
  semester: Number (required),
  subjects: [String], // Array of subject names/IDs
  activeStyleProfileId: ObjectId (ref: 'answerStyles'),
  examDates: [{
    subjectId: ObjectId,
    examDate: Date,
    examType: String // 'midterm', 'final', 'internal'
  }],
  timeAvailability: {
    hoursPerDay: Number,
    preferredStudyTimes: [String] // e.g., ['morning', 'evening']
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 1.2 Subjects Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  code: String (optional),
  userId: ObjectId (ref: 'users'),
  createdAt: Date
}
```

### 1.3 Contexts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  subjectId: ObjectId (ref: 'subjects', required),
  type: String (enum: ['syllabus', 'pyq', 'notes', 'reference'], required),
  title: String (required),
  content: String (required), // Extracted text content
  fileUrl: String (optional), // If file was uploaded
  metadata: {
    uploadDate: Date,
    topic: String (optional),
    keywords: [String] (optional)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 1.4 AnswerStyles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  name: String (required),
  isDefault: Boolean (default: false),
  isPublic: Boolean (default: false), // For community sharing
  sections: [String] (required), // e.g., ['Definition', 'Explanation', 'Key Points', 'Examples', 'Conclusion']
  tone: String (enum: ['formal_exam', 'conceptual', 'casual', 'academic'], required),
  maxWordCount: Number (optional),
  approximateLength: String (optional), // 'short', 'medium', 'detailed'
  instructions: String (optional), // Additional style instructions
  createdAt: Date,
  updatedAt: Date
}
```

### 1.5 GeneratedContents Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  subjectId: ObjectId (ref: 'subjects', required),
  type: String (enum: ['notes', 'report', 'ppt', 'revision_sheet', 'mock_paper'], required),
  title: String (required),
  topic: String (required),
  content: Object, // Structure varies by type
  // For notes/reports: { sections: [{ title: String, content: String }] }
  // For PPT: { slides: [{ title: String, bullets: [String], speakerNotes: String }] }
  // For revision sheet: { keyPoints: [String], formulae: [String], definitions: [String] }
  // For mock paper: { questions: [{ type: String, question: String, answer: String }] }
  styleProfileId: ObjectId (ref: 'answerStyles'),
  contextUsed: [ObjectId] (ref: 'contexts'), // Which contexts were used
  metadata: {
    depth: String (optional), // 'short', 'medium', 'detailed'
    wordCount: Number (optional),
    slideCount: Number (optional),
    generatedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 1.6 ExamPlans Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  subjectId: ObjectId (ref: 'subjects', required),
  examDate: Date (required),
  blueprint: {
    units: [{
      name: String,
      weightage: Number, // Percentage
      difficulty: String, // 'easy', 'medium', 'hard'
      frequency: Number, // Based on PYQ analysis
      importantTopics: [String]
    }]
  },
  revisionPlan: {
    days: [{
      date: Date,
      topics: [String],
      tasks: [String],
      hours: Number
    }],
    bufferDays: Number,
    mockTestDays: [Date]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 1.7 Quizzes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  subjectId: ObjectId (ref: 'subjects', required),
  topic: String (required),
  question: String (required),
  options: [String] (optional), // For MCQ
  correctAnswer: String (required),
  explanation: String (optional),
  difficulty: String (enum: ['easy', 'medium', 'hard'], default: 'medium'),
  type: String (enum: ['mcq', 'short', 'long'], default: 'short'),
  createdAt: Date
}
```

### 1.8 QuizAttempts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  quizId: ObjectId (ref: 'quizzes', required),
  subjectId: ObjectId (ref: 'subjects', required),
  topic: String (required),
  isCorrect: Boolean (required),
  timeTaken: Number (required), // milliseconds
  userAnswer: String (optional),
  timestamp: Date (default: Date.now)
}
```

### 1.9 Sessions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  subjectId: ObjectId (ref: 'subjects', optional),
  mode: String (enum: ['notes', 'quiz', 'exam', 'revision'], required),
  startTime: Date (required),
  endTime: Date (optional),
  duration: Number (optional), // milliseconds
  contentId: ObjectId (ref: 'generatedContents', optional),
  createdAt: Date
}
```

### 1.10 CommunityPosts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  contentId: ObjectId (ref: 'generatedContents', optional), // If cloned from generated content
  type: String (enum: ['notes', 'report', 'ppt', 'revision_sheet', 'mock_paper'], required),
  title: String (required),
  content: Object (required), // Same structure as GeneratedContents
  metadata: {
    university: String (required),
    branch: String (required),
    semester: Number (required),
    subject: String (required),
    topic: String (required),
    tags: [String]
  },
  upvotes: Number (default: 0),
  downvotes: Number (default: 0),
  viewCount: Number (default: 0),
  status: String (enum: ['active', 'reported', 'hidden'], default: 'active'),
  reportedCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 1.11 CommunityVotes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  postId: ObjectId (ref: 'communityPosts', required),
  voteType: String (enum: ['upvote', 'downvote'], required),
  createdAt: Date,
  unique: [userId, postId] // Compound index
}
```

### 1.12 CommunityComments Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  postId: ObjectId (ref: 'communityPosts', required),
  content: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 2. REST API Endpoints

### 2.1 Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### 2.2 User Profile (`/api/users`)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/progress` - Get user progress analytics

### 2.3 Subjects (`/api/subjects`)
- `GET /api/subjects` - Get all user subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### 2.4 Context (`/api/context`)
- `GET /api/context/:subjectId` - Get contexts for subject
- `POST /api/context` - Upload context (syllabus/PYQ/notes)
- `PUT /api/context/:id` - Update context
- `DELETE /api/context/:id` - Delete context
- `GET /api/context/:subjectId/search` - Search contexts by keyword

### 2.5 Answer Styles (`/api/styles`)
- `GET /api/styles` - Get user's style profiles
- `GET /api/styles/defaults` - Get default presets
- `POST /api/styles` - Create style profile
- `PUT /api/styles/:id` - Update style profile
- `DELETE /api/styles/:id` - Delete style profile
- `PUT /api/styles/:id/activate` - Set as active style

### 2.6 Content Generation (`/api/content`)
- `POST /api/content/notes` - Generate study notes
- `POST /api/content/report` - Generate report
- `POST /api/content/ppt` - Generate PPT content
- `GET /api/content/:subjectId` - Get generated content for subject
- `GET /api/content/:id` - Get specific content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### 2.7 Exam Mode (`/api/exam`)
- `POST /api/exam/blueprint` - Generate exam blueprint
- `POST /api/exam/planner` - Generate revision planner
- `POST /api/exam/rapid-sheets` - Generate rapid revision sheets
- `POST /api/exam/mock-paper` - Generate mock paper
- `GET /api/exam/plans/:subjectId` - Get exam plans for subject

### 2.8 Quiz (`/api/quiz`)
- `GET /api/quiz/:subjectId` - Get quizzes for subject
- `POST /api/quiz` - Create quiz question
- `POST /api/quiz/attempt` - Submit quiz attempt
- `GET /api/quiz/analytics/:subjectId` - Get quiz analytics

### 2.9 Sessions (`/api/sessions`)
- `POST /api/sessions/start` - Start study session
- `PUT /api/sessions/:id/end` - End study session
- `GET /api/sessions` - Get user sessions

### 2.10 Community (`/api/community`)
- `GET /api/community/posts` - List posts (with filters)
- `POST /api/community/posts` - Create post
- `GET /api/community/posts/:id` - Get post details
- `POST /api/community/posts/:id/vote` - Vote on post
- `POST /api/community/posts/:id/comment` - Comment on post
- `POST /api/community/posts/:id/clone` - Clone post to workspace
- `POST /api/community/posts/:id/report` - Report post

## 3. Frontend Structure

### 3.1 Pages/Routes
- `/` - Landing/Login
- `/dashboard` - Main dashboard
- `/subjects` - Subject management
- `/subjects/:id` - Subject workspace
  - `/subjects/:id/notes` - Study notes generator
  - `/subjects/:id/reports` - Report writer
  - `/subjects/:id/ppt` - PPT generator
  - `/subjects/:id/exam` - Exam preparation mode
  - `/subjects/:id/quiz` - Quiz mode
- `/styles` - Answer style profiles management
- `/community` - Community feed
- `/community/:id` - Post details
- `/focus/:mode/:contentId` - Focus mode (full-screen)
- `/profile` - User profile

### 3.2 Component Structure
```
src/
  components/
    common/ (Button, Input, Card, Modal, etc.)
    layout/ (Header, Sidebar, Footer)
    content/ (NotesViewer, PPTViewer, ReportViewer)
    exam/ (BlueprintView, PlannerView, MockPaperView)
    quiz/ (QuizCard, QuizAttempt)
    community/ (PostCard, CommentSection)
  pages/
  hooks/ (useAuth, useContent, useExam, etc.)
  services/ (api.js)
  utils/ (helpers, constants)
  store/ (state management - Context API or Zustand)
```

## 4. AI Orchestrator Prompt Structure

### 4.1 Base Prompt Template
```
You are an academic assistant helping university students prepare for exams and assignments.

User Context:
- University: {university}
- Branch: {branch}
- Semester: {semester}
- Subject: {subject}

Answer Style Profile:
- Sections: {sections}
- Tone: {tone}
- Max Word Count: {maxWordCount}
- Additional Instructions: {instructions}

Relevant Context:
{syllabusContext}
{notesContext}
{pyqContext}

Task: {taskDescription}
```

### 4.2 Notes Generation Prompt
```
{baseTemplate}

Generate comprehensive study notes on the topic: {topic}

Depth Level: {depth} (short/medium/detailed)

Requirements:
1. Follow the exact section structure: {sections}
2. Maintain {tone} tone throughout
3. Include relevant examples and key points
4. Ensure content aligns with the syllabus provided
5. Word count should be approximately {maxWordCount}

Output format:
{
  "sections": [
    {
      "title": "Section Name",
      "content": "Section content..."
    }
  ]
}
```

### 4.3 Report Generation Prompt
```
{baseTemplate}

Generate an academic report on: {topic}

Required Sections: {requiredSections}
Target Word Count: {wordCount}

Requirements:
1. Include Abstract, Introduction, Methodology, Analysis, Conclusion, References
2. Follow {tone} tone
3. Use academic citation style
4. Ensure methodology aligns with subject requirements

Output format:
{
  "sections": [
    {
      "title": "Abstract",
      "content": "..."
    },
    ...
  ],
  "references": ["..."]
}
```

### 4.4 PPT Generation Prompt
```
{baseTemplate}

Generate presentation content for: {topic}

Number of Slides: {slideCount}
Presentation Type: {presentationType} (seminar/viva/internal)

Requirements:
1. Each slide should have a clear title
2. Use bullet points (max 5-6 per slide)
3. Include speaker notes for each slide
4. Follow {tone} tone
5. Structure should be logical flow

Output format:
{
  "slides": [
    {
      "title": "Slide Title",
      "bullets": ["point 1", "point 2", ...],
      "speakerNotes": "Notes for presenter..."
    }
  ]
}
```

### 4.5 Exam Blueprint Prompt
```
{baseTemplate}

Analyze the syllabus and past year papers to create an exam blueprint.

Requirements:
1. Identify frequently asked topics from PYQs
2. Estimate weightage for each unit/topic
3. Assess difficulty level
4. Highlight important topics

Output format:
{
  "units": [
    {
      "name": "Unit Name",
      "weightage": 25,
      "difficulty": "medium",
      "frequency": 8,
      "importantTopics": ["topic1", "topic2"]
    }
  ]
}
```

### 4.6 Revision Planner Prompt
```
{baseTemplate}

Create a day-wise revision plan.

Exam Date: {examDate}
Hours Per Day: {hoursPerDay}
Current Date: {currentDate}

Use the exam blueprint to prioritize topics.

Requirements:
1. Distribute topics evenly across days
2. Include buffer days for revision
3. Schedule mock test days
4. Ensure realistic workload

Output format:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "topics": ["topic1", "topic2"],
      "tasks": ["task1", "task2"],
      "hours": 3
    }
  ],
  "bufferDays": 2,
  "mockTestDays": ["YYYY-MM-DD"]
}
```

### 4.7 Rapid Revision Sheets Prompt
```
{baseTemplate}

Generate rapid revision sheet for: {topics}

Requirements:
1. Key definitions (concise)
2. Important formulae
3. Bullet-point summaries
4. Follow {sections} structure
5. Keep it ultra-concise

Output format:
{
  "keyPoints": ["point1", "point2"],
  "formulae": ["formula1", "formula2"],
  "definitions": [
    {
      "term": "Term",
      "definition": "Definition"
    }
  ]
}
```

### 4.8 Mock Paper Prompt
```
{baseTemplate}

Generate a mock exam paper.

Pattern:
- Short Answer Questions: {shortCount}
- Long Answer Questions: {longCount}

Requirements:
1. Questions should align with syllabus
2. Follow patterns from PYQs
3. Include outline answers in {tone} tone
4. Follow {sections} structure for answers

Output format:
{
  "questions": [
    {
      "type": "short",
      "question": "Question text",
      "answer": "Answer outline..."
    },
    {
      "type": "long",
      "question": "Question text",
      "answer": "Detailed answer..."
    }
  ]
}
```

## 5. Implementation Notes

### 5.1 AI Provider Integration
- Use OpenAI GPT-4 or similar
- Implement token counting and truncation
- Add retry logic for API failures
- Cache common prompts where possible

### 5.2 File Upload Handling
- Use multer for file uploads
- Extract text from PDFs using pdf-parse or similar
- Store files in cloud storage (S3/Cloudinary) or local storage for v1

### 5.3 Authentication
- JWT tokens with refresh mechanism
- Password hashing using bcrypt
- Protected routes middleware

### 5.4 Error Handling
- Centralized error handling middleware
- Consistent error response format
- Logging for debugging

### 5.5 Performance
- Index MongoDB collections appropriately
- Pagination for large lists
- Lazy loading for frontend components

