import { useEffect, useState } from "react";
import { fetchTrendingPosts } from "../services/api";
import PostCard from "../components/PostCard";

const TrendingPosts = () => {
  const [posts, setPosts] = useState<{ content: string; commentsCount: number }[]>([]);

  useEffect(() => {
    fetchTrendingPosts().then(setPosts);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard key={index} content={post.content} commentsCount={post.commentsCount} />
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;