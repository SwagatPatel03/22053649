import { useEffect, useState } from "react";
import { fetchTopUsers } from "../services/api";
import UserCard from "../components/UserCard";

const TopUsers = () => {
  const [users, setUsers] = useState<{ name: string; postCount: number }[]>([]);

  useEffect(() => {
    fetchTopUsers().then(setUsers);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user, index) => (
          <UserCard key={index} name={user.name} postCount={user.postCount} />
        ))}
      </div>
    </div>
  );
};

export default TopUsers;