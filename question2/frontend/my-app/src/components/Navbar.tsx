import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Social Media Analytics</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Feed</Link>
        <Link to="/top-users" className="hover:underline">Top Users</Link>
        <Link to="/trending-posts" className="hover:underline">Trending Posts</Link>
      </div>
    </nav>
  );
};

export default Navbar;