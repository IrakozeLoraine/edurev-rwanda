import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../axios";
import type { ForumPost, Topic } from "../types";
import type { RootState } from "../store/store";

const TopicForum = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const { token } = useSelector((state: RootState) => state.auth);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!topicId) return;

    Promise.all([
      api.get(`/topics/detail/${topicId}`),
      api.get(`/forum/${topicId}`),
    ])
      .then(([topicRes, postsRes]) => {
        setTopic(topicRes.data);
        setPosts(postsRes.data);
      })
      .catch((err) => {
        console.error("Failed to load forum:", err);
        setError("Failed to load forum");
      })
      .finally(() => setLoading(false));
  }, [topicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError("Title and content are required");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res = await api.post(`/forum/${topicId}`, { title: title.trim(), content: content.trim() });
      setPosts((prev) => [res.data, ...prev]);
      setTitle("");
      setContent("");
      setShowForm(false);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setFormError(message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!topicId || !subjectId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">Invalid parameters</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-mongo-green border-t-transparent rounded-full animate-spin" />
          <span className="text-mongo-muted text-sm">Loading forum...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        <Link to="/" className="text-mongo-muted hover:text-mongo-green transition-colors">
          Subjects
        </Link>
        <ChevronIcon />
        <Link
          to={`/subjects/${subjectId}/topics`}
          className="text-mongo-muted hover:text-mongo-green transition-colors"
        >
          {topic?.subject?.name || "Topics"}
        </Link>
        <ChevronIcon />
        {topic && (
          <>
            <Link
              to={`/subjects/${subjectId}/topics/${topicId}`}
              className="text-mongo-muted hover:text-mongo-green transition-colors"
            >
              {topic.title}
            </Link>
            <ChevronIcon />
          </>
        )}
        <span className="text-mongo-heading font-medium">Forum</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-mongo-heading tracking-tight">
            Discussion Forum
          </h1>
          {topic && (
            <p className="text-sm text-mongo-muted mt-1">{topic.title}</p>
          )}
        </div>

        {token && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        )}
      </div>

      {/* New Post Form */}
      {showForm && token && (
        <div className="bg-mongo-card border border-mongo-border rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-mongo-heading uppercase tracking-wide mb-4">
            Create a New Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="post-title" className="block text-sm font-medium text-mongo-heading mb-1">
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question or topic?"
                className="w-full px-3 py-2 rounded-lg border border-mongo-border bg-white text-sm text-mongo-text placeholder-mongo-muted focus:outline-none focus:ring-2 focus:ring-mongo-green/40 focus:border-mongo-green transition-colors"
              />
            </div>
            <div>
              <label htmlFor="post-content" className="block text-sm font-medium text-mongo-heading mb-1">
                Content
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Describe your question or share your thoughts..."
                className="w-full px-3 py-2 rounded-lg border border-mongo-border bg-white text-sm text-mongo-text placeholder-mongo-muted focus:outline-none focus:ring-2 focus:ring-mongo-green/40 focus:border-mongo-green transition-colors resize-y"
              />
            </div>
            {formError && (
              <p className="text-red-600 text-sm">{formError}</p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(""); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-mongo-muted hover:text-mongo-heading hover:bg-mongo-bg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sign-in prompt */}
      {!token && (
        <div className="bg-mongo-bg border border-mongo-border rounded-xl p-5 mb-8 text-center">
          <p className="text-sm text-mongo-muted mb-3">
            Sign in to participate in the discussion.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-12 h-12 text-mongo-border mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-mongo-muted text-sm">No posts yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-mongo-card border border-mongo-border rounded-xl p-5 hover:border-mongo-green/30 transition-colors"
            >
              <h3 className="text-base font-semibold text-mongo-heading mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-mongo-text leading-relaxed whitespace-pre-line mb-4">
                {post.content}
              </p>
              <div className="flex items-center gap-3 text-xs text-mongo-muted">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-mongo-green-light rounded-full flex items-center justify-center">
                    <span className="text-mongo-green text-[10px] font-bold">
                      {post.user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "?"}
                    </span>
                  </div>
                  <span className="font-medium text-mongo-heading">
                    {post.user?.name || "Unknown"}
                  </span>
                </div>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ChevronIcon = () => (
  <svg className="w-3.5 h-3.5 text-mongo-border shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default TopicForum;