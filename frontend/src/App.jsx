import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectWorkspace from './pages/SubjectWorkspace';
import Styles from './pages/Styles';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import FocusMode from './pages/FocusMode';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <PrivateRoute>
              <Layout>
                <Subjects />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/subjects/:id"
          element={
            <PrivateRoute>
              <Layout>
                <SubjectWorkspace />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/styles"
          element={
            <PrivateRoute>
              <Layout>
                <Styles />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/community"
          element={<Community />}
        />
        <Route
          path="/community/:id"
          element={<PostDetail />}
        />
        <Route
          path="/focus/:mode/:contentId"
          element={
            <PrivateRoute>
              <FocusMode />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

