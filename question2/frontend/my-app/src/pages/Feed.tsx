import { useEffect, useState } from "react";
import { fetchLatestPosts } from "../services/api";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState<{ content: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestPosts().then(setPosts);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Feed</h1>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard key={index} content={post.content} />
        ))}
      </div>
    </div>
  );
};

export default Feed;