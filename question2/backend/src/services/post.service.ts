import { apiClient } from "../utils/api";

export const getPopularPosts = async () => {
  const { data } = await apiClient.get("/posts");
  let maxComments = 0;
  const popularPosts: any[] = [];

  for (const post of data.posts) {
    const comments = await apiClient.get(`/posts/${post.id}/comments`);
    if (comments.data.comments.length > maxComments) {
      maxComments = comments.data.comments.length;
      popularPosts.length = 0;
      popularPosts.push(post);
    } else if (comments.data.comments.length === maxComments) {
      popularPosts.push(post);
    }
  }

  return popularPosts;
};

export const getLatestPosts = async () => {
  const { data } = await apiClient.get("/posts");
  return data.posts.sort((a: any, b: any) => b.id - a.id).slice(0, 5);
};