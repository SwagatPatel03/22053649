import { Request, Response } from "express";
import { getPopularPosts, getLatestPosts } from "../services/post.service";

export const getPostsHandler = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    if (type === "popular") {
      res.json(await getPopularPosts());
    } else {
      res.json(await getLatestPosts());
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};