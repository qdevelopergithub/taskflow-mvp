function TaskModel(db) {
  return {
    getAll({ status, priority } = {}) {
      let sql = 'SELECT * FROM tasks WHERE 1=1';
      const params = [];

      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }
      if (priority) {
        sql += ' AND priority = ?';
        params.push(priority);
      }

      sql += " ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END, created_at DESC";
      return db.prepare(sql).all(...params);
    },

    getById(id) {
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    },

    getStats() {
      const total = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
      const todo = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'todo'").get().count;
      const inProgress = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'in_progress'").get().count;
      const done = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'done'").get().count;
      const highPriority = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE priority = 'high' AND status != 'done'").get().count;

      const overdue = db.prepare(
        "SELECT COUNT(*) as count FROM tasks WHERE due_date < date('now') AND status != 'done'"
      ).get().count;

      return {
        total,
        todo,
        in_progress: inProgress,
        done,
        high_priority: highPriority,
        overdue,
        completion_rate: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    },

    create({ title, description, status, priority, due_date }) {
      const now = new Date().toISOString();
      const result = db.prepare(`
        INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(title, description || '', status || 'todo', priority || 'medium', due_date || null, now, now);

      return this.getById(result.lastInsertRowid);
    },

    update(id, { title, description, status, priority, due_date }) {
      const existing = this.getById(id);
      if (!existing) return null;

      const now = new Date().toISOString();
      db.prepare(`
        UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = ?
        WHERE id = ?
      `).run(
        title ?? existing.title,
        description ?? existing.description,
        status ?? existing.status,
        priority ?? existing.priority,
        due_date ?? existing.due_date,
        now,
        id
      );

      return this.getById(id);
    },

    updateStatus(id, status) {
      const existing = this.getById(id);
      if (!existing) return null;

      const now = new Date().toISOString();
      db.prepare('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
      return this.getById(id);
    },

    delete(id) {
      const existing = this.getById(id);
      if (!existing) return false;

      db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
      return true;
    },
  };
}

module.exports = TaskModel;
