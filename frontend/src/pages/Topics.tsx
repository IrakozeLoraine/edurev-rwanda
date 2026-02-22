import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import type { Topic } from "../types";

const Topics = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/topics/${subjectId}`)
      .then((res) => setTopics(res.data))
      .catch(() => setError("Failed to load topics"))
      .finally(() => setLoading(false));
  }, [subjectId]);

  if (loading) return <p className="p-6 text-slate-500">Loading topics...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const subjectName = topics.length > 0 ? topics[0].subject.name : "Subject";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-500 hover:underline text-sm">&larr; Back to Subjects</Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">{subjectName} Topics</h1>
      <p className="text-slate-500 mb-6">
        {topics.length} {topics.length === 1 ? "topic" : "topics"} available
      </p>

      {topics.length === 0 ? (
        <p className="text-slate-400">No topics found for this subject.</p>
      ) : (
        <div className="grid gap-4">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="p-4 bg-white rounded-lg border border-slate-200"
            >
              <h2 className="text-lg font-semibold">{topic.title}</h2>
              {topic.notes && (
                <p className="text-sm text-slate-600 mt-1">{topic.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Topics;
