import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../store/actions/authActions";
import type { RootState, AppDispatch } from "../store/store";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await (dispatch as unknown as (fn: ReturnType<typeof register>) => Promise<void>)(register(name, email, password));
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-mongo-card border border-mongo-border rounded-xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-mongo-heading tracking-tight">
            Create Account
          </h1>
          <p className="text-mongo-muted mt-1 text-sm">
            Join EduRev Rwanda and start revising smarter.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mongo-heading mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-mongo-bg border border-mongo-border rounded-lg text-sm text-mongo-text focus:outline-none focus:border-mongo-green transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mongo-heading mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-mongo-bg border border-mongo-border rounded-lg text-sm text-mongo-text focus:outline-none focus:border-mongo-green transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mongo-heading mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-mongo-bg border border-mongo-border rounded-lg text-sm text-mongo-text focus:outline-none focus:border-mongo-green transition-colors"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-mongo-green text-white text-sm font-medium rounded-lg hover:bg-mongo-green/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-mongo-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-mongo-green hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
