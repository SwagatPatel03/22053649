interface UserProps {
    name: string;
    postCount: number;
  }
  
  const UserCard: React.FC<UserProps> = ({ name, postCount }) => {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-gray-600">Posts: {postCount}</p>
      </div>
    );
  };
  
  export default UserCard;  