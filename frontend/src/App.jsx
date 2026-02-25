import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ToastContainer from './components/ui/Toast';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import TasksPage from './pages/TasksPage';
import TaskFormPage from './pages/TaskFormPage';

export default function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </>
  );
}
