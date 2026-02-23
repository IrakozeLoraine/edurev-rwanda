import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import type { Topic } from "../types";

const Topics = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjectName, setSubjectName] = useState("Subject");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subjectId) {
      setError("Subject not found");
      setLoading(false);
      return;
    }

    api.get(`/subjects/${subjectId}`)
      .then((res) => {
        if (res.data?.name) setSubjectName(res.data.name);
      })
      .catch(() => {});

    api
      .get(`/topics/${subjectId}`)
      .then((res) => {
        setTopics(res.data);
        if (res.data.length > 0 && res.data[0].subject?.name) {
          setSubjectName(res.data[0].subject.name);
        }
      })
      .catch((err) => {
        console.error("Failed to load topics:", err);
        setError("Failed to load topics");
      })
      .finally(() => setLoading(false));
  }, [subjectId]);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-mongo-green border-t-transparent rounded-full animate-spin" />
          <span className="text-mongo-muted text-sm">Loading topics...</span>
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/"
          className="text-mongo-muted hover:text-mongo-green transition-colors"
        >
          Subjects
        </Link>
        <svg className="w-3.5 h-3.5 text-mongo-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-mongo-heading font-medium">{subjectName}</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mongo-heading tracking-tight">
          {subjectName}
        </h1>
        <p className="text-mongo-muted mt-1">
          Explore topics and key concepts for revision
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-mongo-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-mongo-green rounded-full" />
          <span className="text-sm text-mongo-muted">
            <span className="text-mongo-heading font-medium">{topics.length}</span>{" "}
            {topics.length === 1 ? "topic" : "topics"} available
          </span>
        </div>
      </div>

      {/* Topics List */}
      {topics.length === 0 ? (
        <div className="bg-mongo-card border border-mongo-border rounded-xl p-8 text-center">
          <p className="text-mongo-muted text-sm">No topics found for this subject.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {topics.map((topic, index) => (
            <div
              key={topic._id}
              className="group bg-mongo-card border border-mongo-border rounded-xl p-5 hover:border-mongo-green/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-mongo-green-light rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-mongo-green text-xs font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-mongo-heading group-hover:text-mongo-green transition-colors">
                    {topic.title}
                  </h2>
                  {topic.notes && (
                    <p className="text-sm text-mongo-muted mt-1.5 leading-relaxed line-clamp-2">
                      {topic.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Topics;
