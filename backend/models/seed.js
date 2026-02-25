function seedDatabase(db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM tasks').get().c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const tasks = [
    { title: 'Design landing page mockups', description: 'Create high-fidelity mockups for the main landing page including hero, features, and pricing sections.', status: 'done', priority: 'high', due_date: '2026-02-20' },
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment to staging environment.', status: 'done', priority: 'high', due_date: '2026-02-22' },
    { title: 'Implement user authentication', description: 'Add JWT-based auth with login, register, and password reset flows.', status: 'in_progress', priority: 'high', due_date: '2026-02-28' },
    { title: 'Build dashboard analytics', description: 'Create charts and metrics for task completion rates, team velocity, and overdue items.', status: 'in_progress', priority: 'medium', due_date: '2026-03-01' },
    { title: 'Write API documentation', description: 'Document all REST endpoints using OpenAPI/Swagger format.', status: 'in_progress', priority: 'low', due_date: '2026-03-05' },
    { title: 'Add email notifications', description: 'Send email alerts when tasks are assigned, due soon, or overdue.', status: 'todo', priority: 'medium', due_date: '2026-03-10' },
    { title: 'Mobile responsive audit', description: 'Test all pages at 375px, 768px, and 1280px breakpoints and fix layout issues.', status: 'todo', priority: 'high', due_date: '2026-03-08' },
    { title: 'Performance optimization', description: 'Audit bundle size, implement code splitting, and optimize database queries.', status: 'todo', priority: 'low', due_date: '2026-03-15' },
    { title: 'Set up error monitoring', description: 'Integrate Sentry or similar service for production error tracking.', status: 'todo', priority: 'medium', due_date: '2026-03-12' },
    { title: 'User onboarding flow', description: 'Create a guided tour for new users showing key features and workflow.', status: 'todo', priority: 'low', due_date: '2026-03-20' },
  ];

  const insertMany = db.transaction((items) => {
    for (const t of items) {
      insert.run(t.title, t.description, t.status, t.priority, t.due_date, now, now);
    }
  });

  insertMany(tasks);
  console.log(`Seeded ${tasks.length} tasks.`);
}

module.exports = { seedDatabase };
