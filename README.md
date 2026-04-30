# Team Task Manager 📋

A full-stack web application for managing projects, tasks, and teams with role-based access control.

## Features

✅ **Authentication** - Secure signup/login with JWT
✅ **User Management** - Role-based access (Admin/Member)
✅ **Project Management** - Create, edit, and manage projects
✅ **Team Collaboration** - Add team members to projects
✅ **Task Management** - Create, assign, and track tasks
✅ **Status Tracking** - Track task progress (To Do, In Progress, Done)
✅ **Priority Levels** - Set task priorities (Low, Medium, High)
✅ **Dashboard** - View task statistics and recent tasks
✅ **Filters & Search** - Filter tasks by status and priority
✅ **Responsive Design** - Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for frontend communication

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for UI icons
- **CSS3** for styling

## Project Structure

```
team-task-manager/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── projects.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Tasks.jsx
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── styles/
│   │       ├── global.css
│   │       ├── auth.css
│   │       ├── navbar.css
│   │       ├── dashboard.css
│   │       ├── projects.css
│   │       ├── tasks.css
│   │       ├── forms.css
│   │       └── taskcard.css
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Tasks
- `GET /api/tasks` - Get all user's tasks (requires auth)
- `POST /api/tasks` - Create new task (requires auth)
- `GET /api/tasks/:id` - Get task by ID (requires auth)
- `PUT /api/tasks/:id` - Update task (requires auth)
- `DELETE /api/tasks/:id` - Delete task (requires auth)

### Projects
- `GET /api/projects` - Get user's projects (requires auth)
- `POST /api/projects` - Create new project (requires auth)
- `GET /api/projects/:id` - Get project details (requires auth)
- `PUT /api/projects/:id` - Update project (requires auth)
- `DELETE /api/projects/:id` - Delete project (requires auth)
- `POST /api/projects/:id/members` - Add team member (requires auth)
- `DELETE /api/projects/:id/members/:userId` - Remove team member (requires auth)

## Usage

1. **Sign Up** - Create a new account
2. **Login** - Access your dashboard
3. **Dashboard** - View task statistics and recent activities
4. **Projects** - Create projects and manage team members
5. **Tasks** - Create, assign, and track tasks
6. **Filters** - Filter tasks by status and priority

## Deployment

### Deploy to Railway

1. Push your code to GitHub

2. Go to [Railway.app](https://railway.app)

3. Connect your GitHub account and select the repository

4. Create MongoDB add-on from Railway marketplace

5. Set environment variables:
   - `MONGO_URI` - Railway MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key

6. Deploy the backend

7. For frontend, update API URL in code to your Railway backend URL

8. Deploy frontend to Vercel or Railway

## Demo Video

Create a 2-5 minute demo video showing:
1. User signup/login
2. Creating a project
3. Adding team members
4. Creating and assigning tasks
5. Filtering and tracking tasks
6. Dashboard statistics

## Future Enhancements

- Real-time notifications
- Task comments and activity logs
- File attachments
- Advanced analytics
- Export reports (PDF/Excel)
- Dark mode
- Mobile app

## License

MIT License - feel free to use this project for learning and development

## Support

For issues or questions, please create an issue in the GitHub repository
