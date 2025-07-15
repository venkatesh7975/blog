import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import LoadingSpinner from "./LoadingSpinner";

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        searchUsers();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    console.log("Searching for users with query:", searchQuery.trim());
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:3002/user/search?q=${encodeURIComponent(searchQuery.trim())}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Search response:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.message || "Failed to search users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = (userId, isFollowing) => {
    console.log("Follow status changed for user:", userId, "isFollowing:", isFollowing);
    // Update the user's follow status in the list
    setUsers(users.map(user => 
      user._id === userId 
        ? { ...user, isFollowing: isFollowing }
        : user
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Users
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {loading && (
              <div className="absolute right-3 top-3">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button 
                onClick={searchUsers}
                className="mt-2 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : users.length === 0 && searchQuery.trim() && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <p>No users found matching "{searchQuery}"</p>
            </div>
          ) : users.length === 0 && !searchQuery.trim() ? (
            <div className="text-center py-8 text-gray-500">
              <p>Start typing to search for users</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onFollowChange={handleFollowChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 