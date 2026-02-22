import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import type { Subject } from "../types";

const subjectIcons: Record<string, string> = {
  Mathematics: "∑",
  Physics: "⚛",
  Biology: "🧬",
  English: "Aa",
  Chemistry: "⚗",
  Geography: "🌍",
};

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/subjects")
      .then((res) => setSubjects(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load subjects.")
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-mongo-green border-t-transparent rounded-full animate-spin" />
          <span className="text-mongo-muted text-sm">Loading subjects...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mongo-heading tracking-tight">
          Subjects
        </h1>
        <p className="text-mongo-muted mt-1">
          Choose a subject to explore its revision topics
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-mongo-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-mongo-green rounded-full" />
          <span className="text-sm text-mongo-muted">
            <span className="text-mongo-heading font-medium">{subjects.length}</span>{" "}
            subjects available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-mongo-green/40 rounded-full" />
          <span className="text-sm text-mongo-muted">
            <span className="text-mongo-heading font-medium">O-Level</span> curriculum
          </span>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Link
            key={subject._id}
            to={`/subjects/${subject._id}/topics`}
            className="group bg-mongo-card border border-mongo-border rounded-xl p-5 hover:border-mongo-green hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-mongo-green-light rounded-lg flex items-center justify-center text-lg">
                {subjectIcons[subject.name] || "📘"}
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-mongo-green-light text-mongo-green border border-mongo-green/20">
                {subject.level}
              </span>
            </div>

            <h2 className="text-base font-semibold text-mongo-heading group-hover:text-mongo-green transition-colors">
              {subject.name}
            </h2>

            <div className="flex items-center gap-1.5 mt-3 text-xs text-mongo-muted group-hover:text-mongo-green transition-colors">
              <span>View topics</span>
              <svg
                className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
