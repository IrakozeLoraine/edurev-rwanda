import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import type { Topic, TopicSection } from "../types";

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: "Beginner", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  intermediate: { label: "Intermediate", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  advanced: { label: "Advanced", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

/** Render a line of text, converting **bold** and *italic* markdown */
const renderInlineFormatting = (text: string): (string | ReactNode)[] => {
  const parts: (string | ReactNode)[] = [];
  // Match **bold** and *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++} className="font-semibold text-mongo-heading">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

/** Parse and render body text with markdown-like formatting */
const RichText = ({ text }: { text: string }) => {
  const blocks = text.split("\n\n");

  return (
    <div className="space-y-4">
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();

        // Table: lines starting with |
        if (trimmed.startsWith("|")) {
          const rows = trimmed.split("\n").filter((r) => r.trim().length > 0);
          const dataRows = rows.filter((r) => !/^\|[-\s|]+\|$/.test(r.trim()));
          if (dataRows.length === 0) return null;

          const parseRow = (row: string) =>
            row
              .split("|")
              .filter((_, i, arr) => i > 0 && i < arr.length - 1)
              .map((c) => c.trim());

          const headerCells = parseRow(dataRows[0]);
          const bodyRows = dataRows.slice(1);

          return (
            <div key={blockIdx} className="overflow-x-auto my-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {headerCells.map((cell, i) => (
                      <th
                        key={i}
                        className="text-left px-3 py-2 bg-mongo-bg border border-mongo-border text-mongo-heading font-semibold text-xs uppercase tracking-wide"
                      >
                        {renderInlineFormatting(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-mongo-bg/50"}>
                      {parseRow(row).map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 border border-mongo-border text-mongo-text">
                          {renderInlineFormatting(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // List block: lines starting with - or numbered
        const lines = trimmed.split("\n");
        const isUnorderedList = lines.every((l) => l.trimStart().startsWith("- "));
        const isOrderedList = lines.every((l) => /^\d+\.\s/.test(l.trimStart()));

        if (isUnorderedList) {
          return (
            <ul key={blockIdx} className="space-y-1.5 ml-1">
              {lines.map((line, li) => (
                <li key={li} className="flex items-start gap-2 text-sm leading-relaxed text-mongo-text">
                  <span className="text-mongo-green mt-1.5 shrink-0">•</span>
                  <span>{renderInlineFormatting(line.replace(/^-\s*/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (isOrderedList) {
          return (
            <ol key={blockIdx} className="space-y-1.5 ml-1">
              {lines.map((line, li) => (
                <li key={li} className="flex items-start gap-2 text-sm leading-relaxed text-mongo-text">
                  <span className="text-mongo-green font-semibold mt-0.5 shrink-0 w-5 text-right">
                    {li + 1}.
                  </span>
                  <span>{renderInlineFormatting(line.replace(/^\d+\.\s*/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Mixed block (paragraph with inline lists)
        if (lines.some((l) => l.trimStart().startsWith("- ")) && lines.length > 1) {
          return (
            <div key={blockIdx} className="space-y-1.5">
              {lines.map((line, li) => {
                if (line.trimStart().startsWith("- ")) {
                  return (
                    <div key={li} className="flex items-start gap-2 text-sm leading-relaxed text-mongo-text ml-1">
                      <span className="text-mongo-green mt-1.5 shrink-0">•</span>
                      <span>{renderInlineFormatting(line.replace(/^-\s*/, ""))}</span>
                    </div>
                  );
                }
                return (
                  <p key={li} className="text-sm leading-relaxed text-mongo-text">
                    {renderInlineFormatting(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        // Plain paragraph
        return (
          <p key={blockIdx} className="text-sm leading-relaxed text-mongo-text">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

/** Render a single content section */
const SectionBlock = ({ section, index }: { section: TopicSection; index: number }) => {
  return (
    <section className="scroll-mt-20" id={`section-${index}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-mongo-green rounded-full" />
        <h2 className="text-lg font-bold text-mongo-heading">{section.heading}</h2>
      </div>

      {section.body && <RichText text={section.body} />}

      {section.examples && section.examples.length > 0 && (
        <div className="mt-5 space-y-3">
          {section.examples.map((ex, ei) => (
            <div
              key={ei}
              className="bg-mongo-green-light/50 border border-mongo-green/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-mongo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm font-semibold text-mongo-green">
                  {ex.label || "Example"}
                </span>
              </div>
              <div className="pl-6">
                <RichText text={ex.content} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!topicId) return;

    api
      .get(`/topics/detail/${topicId}`)
      .then((res) => setTopic(res.data))
      .catch((err) => {
        console.error("Failed to load topic:", err);
        setError("Failed to load topic");
      })
      .finally(() => setLoading(false));
  }, [topicId]);

  // Validate required parameter
  if (!topicId)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">Topic not found</p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-mongo-green border-t-transparent rounded-full animate-spin" />
          <span className="text-mongo-muted text-sm">Loading topic...</span>
        </div>
      </div>
    );

  if (error || !topic)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error || "Topic not found"}</p>
        </div>
      </div>
    );

  const diffCfg = DIFFICULTY_CONFIG[topic.difficulty] ?? DIFFICULTY_CONFIG.beginner;
  const hasStructuredContent = topic.content && topic.content.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        <Link to="/" className="text-mongo-muted hover:text-mongo-green transition-colors">
          Subjects
        </Link>
        <ChevronIcon />
        <Link
          to={`/subjects/${topic.subject._id}/topics`}
          className="text-mongo-muted hover:text-mongo-green transition-colors"
        >
          {topic.subject.name}
        </Link>
        <ChevronIcon />
        <span className="text-mongo-heading font-medium">{topic.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between mb-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl font-bold text-mongo-heading tracking-tight">
              {topic.title}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${diffCfg.bg} ${diffCfg.color}`}>
              {diffCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-mongo-muted">
            <span>Chapter {topic.chapter}{topic.chapterTitle ? `: ${topic.chapterTitle}` : ""}</span>
            {hasStructuredContent && (
              <span>{topic.content!.length} {topic.content!.length === 1 ? "section" : "sections"}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-mongo-border flex items-center gap-3 flex-wrap">
          <Link
            to={`/subjects/${topic.subject._id}/topics/${topicId}/quiz`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Start Quiz
          </Link>
          <Link
            to={`/subjects/${topic.subject._id}/topics/${topicId}/forum`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-mongo-bg text-mongo-green border border-mongo-green hover:border-mongo-green/70 hover:text-mongo-green transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1m0-3V4a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2H9l-4 4V8z" />
            </svg>
            Discussion Forum
          </Link>
        </div>
      </div>

      {/* Summary / Learning Objectives */}
      {topic.summary && topic.summary.length > 0 && (
        <div className="bg-mongo-card border border-mongo-border rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-mongo-heading uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-mongo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learning Objectives
          </h2>
          <ul className="space-y-2">
            {topic.summary.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-mongo-text leading-relaxed">
                <span className="text-mongo-green mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Table of Contents (if multiple sections) */}
      {hasStructuredContent && topic.content!.length > 1 && (
        <nav className="bg-mongo-bg border border-mongo-border rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-mongo-heading uppercase tracking-wide mb-3">
            Contents
          </h2>
          <ol className="space-y-1">
            {topic.content!.map((section, i) => (
              <li key={i}>
                <a
                  href={`#section-${i}`}
                  className="flex items-center gap-2 text-sm text-mongo-muted hover:text-mongo-green transition-colors py-0.5"
                >
                  <span className="text-mongo-green font-semibold w-5 text-right">{i + 1}.</span>
                  <span>{section.heading}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Structured Content Sections */}
      {hasStructuredContent ? (
        <div className="space-y-10">
          {topic.content!.map((section, i) => (
            <SectionBlock key={i} section={section} index={i} />
          ))}
        </div>
      ) : (
        /* Fallback: plain notes */
        topic.notes && (
          <div className="bg-mongo-card border border-mongo-border rounded-xl p-6">
            <p className="text-sm leading-relaxed text-mongo-text whitespace-pre-line">
              {topic.notes}
            </p>
          </div>
        )
      )}

      {/* References */}
      {topic.references && topic.references.length > 0 && (
        <div className="mt-10 pt-6 border-t border-mongo-border">
          <h2 className="text-sm font-bold text-mongo-heading uppercase tracking-wide mb-3">
            References
          </h2>
          <ul className="space-y-1">
            {topic.references.map((ref, i) => (
              <li key={i} className="text-sm text-mongo-muted">{ref}</li>
            ))}
          </ul>
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

export default TopicDetail;
