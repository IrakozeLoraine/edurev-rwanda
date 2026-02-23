import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Subjects from './pages/Subjects';
import Topics from './pages/Topics';

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-mongo-bg text-mongo-text">
      {/* Navigation */}
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
            <div className="w-8 h-8 bg-mongo-green-light rounded-full flex items-center justify-center">
              <span className="text-mongo-green text-xs font-bold">RW</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Subjects />} />
          <Route path="/subjects/:subjectId/topics" element={<Topics />} />
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

      {/* Footer */}
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
