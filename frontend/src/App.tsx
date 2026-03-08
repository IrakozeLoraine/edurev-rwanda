import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Subjects from './pages/Subjects';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Quiz from './pages/Quiz';
import TopicForum from './pages/TopicForum';
import Login from './pages/Login';
import Register from './pages/Register';
import { logout } from './store/actions/authActions';
import type { RootState, AppDispatch } from './store/store';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-mongo-bg text-mongo-text">
      <header className="bg-mongo-card border-b border-mongo-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-14">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-mongo-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-mongo-heading font-semibold text-lg tracking-tight group-hover:text-mongo-green transition-colors">
              EduRev Rwanda
            </span>
          </Link>

          <nav className="ml-10 flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isHome
                  ? 'text-mongo-green bg-mongo-green-light'
                  : 'text-mongo-muted hover:text-mongo-heading hover:bg-mongo-bg'
              }`}
            >
              Subjects
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {token && user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-mongo-green-light rounded-full flex items-center justify-center">
                    <span className="text-mongo-green text-xs font-bold">
                      {user.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-sm text-mongo-heading font-medium hidden sm:inline">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-mongo-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-mongo-muted hover:text-mongo-heading hover:bg-mongo-bg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Subjects />} />
          <Route path="/subjects/:subjectId/topics" element={<Topics />} />
          <Route path="/subjects/:subjectId/topics/:topicId" element={<TopicDetail />} />
          <Route path="/subjects/:subjectId/topics/:topicId/quiz" element={<Quiz />} />
          <Route path="/subjects/:subjectId/topics/:topicId/forum" element={<TopicForum />} />
          <Route
            path="*"
            element={
              <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                <p className="text-mongo-muted text-sm">Page not found</p>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-mongo-border py-4 bg-mongo-card">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-mongo-muted">
          <span>EduRev Rwanda &mdash; Smart Revision for Rwandan Students</span>
          <span>O-Level &middot; A-Level</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
