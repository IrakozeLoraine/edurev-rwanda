import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import type { Subject } from "../types";

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/subjects")
      .then((res) => setSubjects(res.data))
      .catch(() => setError("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-slate-500">Loading subjects...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Subjects</h1>
      <p className="text-slate-500 mb-6">Choose a subject to view its topics</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((subject) => (
          <Link
            key={subject._id}
            to={`/subjects/${subject._id}/topics`}
            className="block p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow transition"
          >
            <h2 className="text-lg font-semibold">{subject.name}</h2>
            <span className="text-sm text-slate-500">{subject.level}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
