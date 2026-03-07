import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import type { Topic } from "../types";

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!topicId) return;

    api
      .get(`/topics/detail/${topicId}`)
      .then((res) => {
        setTopic(res.data);
      })
      .catch((err) => {
        console.error("Failed to load topic:", err);
        setError("Failed to load topic");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [topicId]);

  if (loading) return <p>Loading topic...</p>;
  if (error || !topic) return <p>{error || "Topic not found"}</p>;

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.notes}</p>
    </div>
  );
};

export default TopicDetail;