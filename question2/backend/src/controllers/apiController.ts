import { Request, Response } from 'express';
import * as apiService from '../services/apiService';

// Get the top 5 users with the highest number of posts
export const getTopUsers = async (_req: Request, res: Response) => {
  try {
    const topUsers = await apiService.getTopUsers();
    return res.status(200).json({ users: topUsers });
  } catch (error) {
    console.error('Error in getTopUsers controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve top users' });
  }
};

// Get posts based on type (popular or latest)
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    
    if (!type || (type !== 'popular' && type !== 'latest')) {
      return res.status(400).json({ error: 'Invalid or missing type parameter' });
    }
    
    if (type === 'popular') {
      const popularPosts = await apiService.getPopularPosts();
      return res.status(200).json({ posts: popularPosts });
    } else {
      const latestPosts = await apiService.getLatestPosts();
      return res.status(200).json({ posts: latestPosts });
    }
  } catch (error) {
    console.error('Error in getPosts controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};