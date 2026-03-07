import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import type { Topic } from "../types";

const Topics = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subjectId) return;

    api
      .get(`/topics/${subjectId}`)
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        console.error("Failed to load topics:", err);
        setError("Failed to load topics");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [subjectId]);

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic._id}>{topic.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;