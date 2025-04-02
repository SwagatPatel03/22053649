// Authentication related types
export interface AuthCredentials {
    email: string;
    name: string;
    rollNo: string;
    accessCode: string;
    clientID: string;
    clientSecret: string;
  }
  
  export interface AuthResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
  }
  
  // API response types
  export interface UsersResponse {
    users: {
      [key: string]: string;
    };
  }
  
  export interface Post {
    id: number;
    userid: number;
    content: string;
    timestamp?: number; // Optional field we'll add for sorting
  }
  
  export interface PostsResponse {
    posts: Post[];
  }
  
  export interface Comment {
    id: number;
    postid: number;
    content: string;
    timestamp?: number;
  }
  
  export interface CommentsResponse {
    comments: Comment[];
  }
  
  // API service response types
  export interface UserPostCount {
    id: string;
    name: string;
    postCount: number;
  }
  
  export interface PostWithComments extends Post {
    commentCount: number;
    comments?: Comment[];
  }