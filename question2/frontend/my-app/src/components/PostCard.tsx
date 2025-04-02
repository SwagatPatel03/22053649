interface PostProps {
    content: string;
    commentsCount?: number;
  }
  
  const PostCard: React.FC<PostProps> = ({ content, commentsCount }) => {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <p>{content}</p>
        {commentsCount !== undefined && (
          <p className="text-gray-600 mt-2">Comments: {commentsCount}</p>
        )}
      </div>
    );
  };
  
  export default PostCard;  