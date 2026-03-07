import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import type { Topic } from "../types";

type SortMode = "chapter" | "difficulty" | "title";
type GroupMode = "chapter" | "difficulty" | "none";

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  beginner: { label: "Beginner", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-600" },
  intermediate: { label: "Intermediate", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-600" },
  advanced: { label: "Advanced", color: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-600" },
};

const Topics = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjectName, setSubjectName] = useState("Subject");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("chapter");
  const [groupMode, setGroupMode] = useState<GroupMode>("chapter");

  useEffect(() => {
    if (!subjectId) return;

    api.get(`/subjects/${subjectId}`)
      .then((res) => {
        if (res.data?.name) setSubjectName(res.data.name);
      })
      .catch(() => {});

    api
      .get(`/topics/${subjectId}`, { params: { sortBy: sortMode } })
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
  }, [subjectId, sortMode]);

  // Group topics based on the selected grouping mode
  const groupedTopics = useMemo(() => {
    if (groupMode === "none") {
      return [{ key: "all", label: "", topics }];
    }

    const groups = new Map<string, { label: string; topics: Topic[] }>();

    for (const topic of topics) {
      let key: string;
      let label: string;

      if (groupMode === "chapter") {
        key = `ch-${topic.chapter}`;
        label = topic.chapterTitle
          ? `Chapter ${topic.chapter}: ${topic.chapterTitle}`
          : `Chapter ${topic.chapter}`;
      } else {
        key = topic.difficulty;
        label = DIFFICULTY_CONFIG[topic.difficulty]?.label ?? topic.difficulty;
      }

      if (!groups.has(key)) {
        groups.set(key, { label, topics: [] });
      }
      groups.get(key)!.topics.push(topic);
    }

    return Array.from(groups.entries()).map(([key, val]) => ({
      key,
      label: val.label,
      topics: val.topics,
    }));
  }, [topics, groupMode]);

  // Count topics per difficulty for the stats bar
  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0 };
    for (const t of topics) counts[t.difficulty] = (counts[t.difficulty] || 0) + 1;
    return counts;
  }, [topics]);

  // Validate required parameter
  if (!subjectId)
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">Subject not found</p>
        </div>
      </div>
    );

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
      <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-mongo-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-mongo-green rounded-full" />
          <span className="text-sm text-mongo-muted">
            <span className="text-mongo-heading font-medium">{topics.length}</span>{" "}
            {topics.length === 1 ? "topic" : "topics"} available
          </span>
        </div>
        {(["beginner", "intermediate", "advanced"] as const).map((d) => {
          const cfg = DIFFICULTY_CONFIG[d];
          return (
            <div key={d} className="flex items-center gap-1.5">
              <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className="text-sm text-mongo-muted">
                <span className="text-mongo-heading font-medium">{difficultyCounts[d] || 0}</span>{" "}
                {cfg.label.toLowerCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sort & Group Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="group-select" className="text-sm text-mongo-muted font-medium">Group by:</label>
          <select
            id="group-select"
            value={groupMode}
            onChange={(e) => setGroupMode(e.target.value as GroupMode)}
            className="text-sm bg-mongo-card border border-mongo-border rounded-lg px-3 py-1.5 text-mongo-heading focus:outline-none focus:ring-2 focus:ring-mongo-green/40"
          >
            <option value="chapter">Chapter</option>
            <option value="difficulty">Difficulty</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-mongo-muted font-medium">Sort by:</label>
          <select
            id="sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="text-sm bg-mongo-card border border-mongo-border rounded-lg px-3 py-1.5 text-mongo-heading focus:outline-none focus:ring-2 focus:ring-mongo-green/40"
          >
            <option value="chapter">Chapter order</option>
            <option value="difficulty">Difficulty</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Topics List */}
      {topics.length === 0 ? (
        <div className="bg-mongo-card border border-mongo-border rounded-xl p-8 text-center">
          <p className="text-mongo-muted text-sm">No topics found for this subject.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedTopics.map((group) => (
            <section key={group.key}>
              {group.label && (
                <div className="flex items-center gap-3 mb-3">
                  {groupMode === "chapter" && (
                    <div className="w-7 h-7 bg-mongo-green-light rounded-md flex items-center justify-center shrink-0">
                      <span className="text-mongo-green text-xs font-bold">
                        {group.key.replace("ch-", "")}
                      </span>
                    </div>
                  )}
                  {groupMode === "difficulty" && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        DIFFICULTY_CONFIG[group.key]?.dot ?? "bg-gray-400"
                      }`}
                    />
                  )}
                  <h2 className="text-base font-semibold text-mongo-heading">
                    {group.label}
                  </h2>
                  <span className="text-xs text-mongo-muted">
                    ({group.topics.length} {group.topics.length === 1 ? "topic" : "topics"})
                  </span>
                </div>
              )}

              <div className="grid gap-3">
                {group.topics.map((topic, index) => {
                  const diffCfg = DIFFICULTY_CONFIG[topic.difficulty];
                  return (
                    <Link
                      to={`/topics/${topic._id}`}
                      key={topic._id}
                      className="group bg-mongo-card border border-mongo-border rounded-xl p-5 hover:border-mongo-green/50 hover:shadow-md transition-all duration-200 block"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-mongo-green-light rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-mongo-green text-xs font-bold">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-mongo-heading group-hover:text-mongo-green transition-colors">
                              {topic.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${diffCfg.bg} ${diffCfg.color}`}
                            >
                              {diffCfg.label}
                            </span>
                          </div>
                          {topic.notes && (
                            <p className="text-sm text-mongo-muted mt-1.5 leading-relaxed line-clamp-2">
                              {topic.notes}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-mongo-muted">
                            <span>Chapter {topic.chapter}</span>
                            {topic.content && topic.content.length > 0 && (
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Detailed notes
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Topics;
