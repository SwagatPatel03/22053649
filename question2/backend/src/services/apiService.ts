import axios from 'axios';
import dotenv from 'dotenv';
import { 
  AuthCredentials, 
  AuthResponse,
  UsersResponse, 
  PostsResponse, 
  CommentsResponse,
  UserPostCount,
  Post,
  PostWithComments,
  Comment as CustomComment // Alias to avoid conflict with DOM's Comment type
} from '../types';

dotenv.config();

// Base URL for the test server
const BASE_URL = 'http://20.244.56.144/evaluation-service';

// In-memory cache with expiration times
let authToken: string | null = null;
let tokenExpiry: number = 0;
let userCache: UserPostCount[] | null = null;
let userCacheTimestamp: number = 0;
let postsCache: Map<number, Post[]> = new Map();
let postsCacheTimestamp: Map<number, number> = new Map();
let popularPostsCache: PostWithComments[] | null = null;
let popularPostsCacheTimestamp: number = 0;
let latestPostsCache: Post[] | null = null;
let latestPostsCacheTimestamp: number = 0;

// Cache expiration times (in milliseconds)
const USER_CACHE_EXPIRY = 60 * 1000; // 1 minute
const POSTS_CACHE_EXPIRY = 30 * 1000; // 30 seconds
const POPULAR_POSTS_CACHE_EXPIRY = 45 * 1000; // 45 seconds
const LATEST_POSTS_CACHE_EXPIRY = 15 * 1000; // 15 seconds

// Get or refresh the authentication token
const getAuthToken = async (): Promise<string> => {
  const now = Date.now();
  
  // If token exists and hasn't expired, return it
  if (authToken && now < tokenExpiry) {
    return authToken;
  }
  
  try {
    // Load credentials from environment variables
    const credentials: AuthCredentials = {
      email: process.env.EMAIL || '',
      name: process.env.NAME || '',
      rollNo: process.env.ROLL_NO || '',
      accessCode: process.env.ACCESS_CODE || '',
      clientID: process.env.CLIENT_ID || '',
      clientSecret: process.env.CLIENT_SECRET || ''
    };
    
    // Request new token
    const response = await axios.post<AuthResponse>(`${BASE_URL}/auth`, credentials);
    authToken = response.data.access_token;
    tokenExpiry = now + (response.data.expires_in * 1000);
    
    return authToken;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    throw new Error('Authentication failed');
  }
};

// Get all users with post counts
export const getTopUsers = async (): Promise<UserPostCount[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (userCache && now < userCacheTimestamp + USER_CACHE_EXPIRY) {
    return userCache.slice(0, 5);
  }
  
  try {
    const token = await getAuthToken();
    
    // Get all users
    const usersResponse = await axios.get<UsersResponse>(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const users = usersResponse.data.users;
    const userIds = Object.keys(users);
    
    // Get post counts for each user
    const userPostCounts: UserPostCount[] = [];
    
    // For speed and efficiency, process users in parallel
    await Promise.all(userIds.map(async (userId) => {
      try {
        const userPosts = await getUserPosts(parseInt(userId));
        userPostCounts.push({
          id: userId,
          name: users[userId],
          postCount: userPosts.length
        });
      } catch (error) {
        console.error(`Failed to get posts for user ${userId}:`, error);
      }
    }));
    
    // Sort by post count in descending order
    userPostCounts.sort((a, b) => b.postCount - a.postCount);
    
    // Cache the results
    userCache = userPostCounts;
    userCacheTimestamp = now;
    
    // Return the top 5 users
    return userPostCounts.slice(0, 5);
  } catch (error) {
    console.error('Failed to get top users:', error);
    throw new Error('Failed to retrieve user data');
  }
};

// Get posts for a specific user
export const getUserPosts = async (userId: number): Promise<Post[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (postsCache.has(userId) && postsCacheTimestamp.get(userId)! + POSTS_CACHE_EXPIRY > now) {
    return postsCache.get(userId) || [];
  }
  
  try {
    const token = await getAuthToken();
    
    const response = await axios.get<PostsResponse>(`${BASE_URL}/users/${userId}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Add a timestamp for sorting (we'll use the fetch time as a proxy since the API doesn't provide one)
    const posts = response.data.posts.map(post => ({
      ...post,
      timestamp: now - Math.floor(Math.random() * 1000000) // Simulating different timestamps
    }));
    
    // Cache the results
    postsCache.set(userId, posts);
    postsCacheTimestamp.set(userId, now);
    
    return posts;
  } catch (error) {
    console.error(`Failed to get posts for user ${userId}:`, error);
    return [];
  }
};

// Get comments for a specific post
export const getPostComments = async (postId: number): Promise<Comment[]> => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.get<CommentsResponse>(`${BASE_URL}/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.comments as CustomComment[];
    return response.data.comments as CustomComment[];
  } catch (error) {
    console.error(`Failed to get comments for post ${postId}:`, error);
    return [];
  }
};

// Get posts with the most comments
export const getPopularPosts = async (): Promise<PostWithComments[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (popularPostsCache && now < popularPostsCacheTimestamp + POPULAR_POSTS_CACHE_EXPIRY) {
    return popularPostsCache;
  }
  
  try {
    // Get all users first
    const usersResponse = await axios.get<UsersResponse>(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${await getAuthToken()}` }
    });
    
    const userIds = Object.keys(usersResponse.data.users).map(id => parseInt(id));
    
    // Get all posts from all users
    const allPostPromises = userIds.map(userId => getUserPosts(userId));
    const allPostResults = await Promise.all(allPostPromises);
    
    // Flatten the array of post arrays
    const allPosts = allPostResults.flat();
    
    // Get comment counts for each post
    const postsWithComments: PostWithComments[] = [];
    
    // For efficiency, process posts in parallel batches
    const batchSize = 10;
    for (let i = 0; i < allPosts.length; i += batchSize) {
      const batch = allPosts.slice(i, i + batchSize);
      await Promise.all(batch.map(async (post) => {
        try {
          const comments = await getPostComments(post.id);
          postsWithComments.push({
            ...post,
            commentCount: comments.length,
            comments: comments as unknown as import('../types').Comment[]
          });
        } catch (error) {
          console.error(`Failed to get comments for post ${post.id}:`, error);
        }
      }));
    }
    
    // Sort by comment count in descending order
    postsWithComments.sort((a, b) => b.commentCount - a.commentCount);
    
    // Find the maximum comment count
    const maxComments = postsWithComments.length > 0 ? postsWithComments[0].commentCount : 0;
    
    // Filter to only include posts with the maximum comment count
    const mostCommentedPosts = postsWithComments.filter(post => post.commentCount === maxComments);
    
    // Cache the results
    popularPostsCache = mostCommentedPosts;
    popularPostsCacheTimestamp = now;
    
    return mostCommentedPosts;
  } catch (error) {
    console.error('Failed to get popular posts:', error);
    throw new Error('Failed to retrieve popular posts');
  }
};

// Get the latest posts
export const getLatestPosts = async (): Promise<Post[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (latestPostsCache && now < latestPostsCacheTimestamp + LATEST_POSTS_CACHE_EXPIRY) {
    return latestPostsCache;
  }
  
  try {
    // Get all users first
    const usersResponse = await axios.get<UsersResponse>(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${await getAuthToken()}` }
    });
    
    const userIds = Object.keys(usersResponse.data.users).map(id => parseInt(id));
    
    // Get all posts from all users
    const allPostPromises = userIds.map(userId => getUserPosts(userId));
    const allPostResults = await Promise.all(allPostPromises);
    
    // Flatten the array of post arrays
    const allPosts = allPostResults.flat();
    
    // Sort by timestamp in descending order (newest first)
    allPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // Take the 5 most recent posts
    const latestPosts = allPosts.slice(0, 5);
    
    // Cache the results
    latestPostsCache = latestPosts;
    latestPostsCacheTimestamp = now;
    
    return latestPosts;
  } catch (error) {
    console.error('Failed to get latest posts:', error);
    throw new Error('Failed to retrieve latest posts');
  }
};