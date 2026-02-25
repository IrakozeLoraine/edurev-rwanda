import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register, clearAuthError } from "../store/actions/authActions";
import type { RootState, AppDispatch } from "../store/store";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return "All fields are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return "Password must contain at least one letter and one number";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");
    const validationError = validate();
    if (validationError) {
      setClientError(validationError);
      return;
    }
    dispatch(register(name.trim(), email.trim(), password) as never);
  };

  const displayError = clientError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-mongo-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mongo-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-mongo-heading font-semibold text-xl tracking-tight">
              EduRev Rwanda
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-mongo-card border border-mongo-border rounded-xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-mongo-heading text-center mb-1">
            Create an account
          </h1>
          <p className="text-mongo-muted text-sm text-center mb-6">
            Start your revision journey
          </p>

          {displayError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-mongo-heading mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 border border-mongo-border rounded-lg text-sm text-mongo-text bg-mongo-bg focus:outline-none focus:ring-2 focus:ring-mongo-green focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-mongo-heading mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 border border-mongo-border rounded-lg text-sm text-mongo-text bg-mongo-bg focus:outline-none focus:ring-2 focus:ring-mongo-green focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-mongo-heading mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars, letter + number"
                className="w-full px-3.5 py-2.5 border border-mongo-border rounded-lg text-sm text-mongo-text bg-mongo-bg focus:outline-none focus:ring-2 focus:ring-mongo-green focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-mongo-heading mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full px-3.5 py-2.5 border border-mongo-border rounded-lg text-sm text-mongo-text bg-mongo-bg focus:outline-none focus:ring-2 focus:ring-mongo-green focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mongo-green text-white font-medium py-2.5 rounded-lg text-sm hover:bg-mongo-green/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-mongo-muted mt-6">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-mongo-green font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
