import React from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { LoginForm } from './components/admin/LoginForm';
import { ProfileList } from './components/admin/ProfileList';
import { ProfileForm } from './components/admin/ProfileForm';
import { PublicProfilePage } from './components/profile/PublicProfilePage';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from './components/ui/sonner';
import { useProfile } from './hooks/useProfile';
import HomePage from './components/admin/Homepage';



const HomePagec: React.FC = () => {
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('profile');
  const { profile, loading, error } = useProfile(profileId || undefined);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      <ThemeToggle />
      <HomePage />
    </div>
  );
};
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePagec />} />
          <Route path="/u/:username" element={<PublicProfilePage />} />
          <Route path="/admin/login" element={<LoginForm />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ProfileList />} />
            <Route path="create" element={<ProfileForm />} />
            <Route path="edit/:id" element={<ProfileForm />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;