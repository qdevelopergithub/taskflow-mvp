# TaskFlow - MVP Plan

**One-liner:** A clean task management board for small teams to track work across To Do, In Progress, and Done columns.

## Target Users
- Small teams (2-10 people) who need a simple way to track tasks

## P0 Features (MVP)
- Dashboard with task stats (total, by status, completion rate)
- Task board view with 3 columns: To Do, In Progress, Done
- Create, edit, delete tasks
- Task has: title, description, priority (Low/Medium/High), status, due date
- Filter tasks by priority
- Move tasks between statuses

## P1 Features (NOT in MVP)
- User authentication / multiple users
- Comments on tasks
- File attachments
- Notifications

## Data Model
### Task
- id (INTEGER, PK, auto-increment)
- title (TEXT, NOT NULL)
- description (TEXT)
- status (TEXT: 'todo' | 'in_progress' | 'done')
- priority (TEXT: 'low' | 'medium' | 'high')
- due_date (TEXT, ISO date)
- created_at (TEXT, ISO datetime)
- updated_at (TEXT, ISO datetime)

## Pages
1. Dashboard (`/`) - Stats + recent tasks
2. Board (`/board`) - Kanban-style columns
3. Tasks list (`/tasks`) - Table view of all tasks
4. New Task (`/tasks/new`) - Create form
5. Edit Task (`/tasks/:id/edit`) - Edit form

## API Endpoints
- GET /api/health
- GET /api/tasks - List all tasks (query: ?status=&priority=)
- GET /api/tasks/stats - Dashboard stats
- GET /api/tasks/:id - Get single task
- POST /api/tasks - Create task
- PUT /api/tasks/:id - Update task
- PATCH /api/tasks/:id/status - Quick status change
- DELETE /api/tasks/:id - Delete task
