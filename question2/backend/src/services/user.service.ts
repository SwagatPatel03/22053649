import { apiClient } from "../utils/api";

export const getTopUsers = async () => {
  const { data } = await apiClient.get("/users");
  const userPostCounts: { [key: string]: number } = {};

  for (const userId in data.users) {
    const posts = await apiClient.get(`/users/${userId}/posts`);
    userPostCounts[userId] = posts.data.posts.length;
  }

  return Object.entries(userPostCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId]) => ({ id: userId, name: data.users[userId] }));
};