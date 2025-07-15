import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function UserCard({ user, onFollowChange }) {
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const handleFollow = async () => {
    if (!token) {
      alert("Please login to follow users");
      return;
    }

    if (user._id === currentUserId) {
      alert("You cannot follow yourself");
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await axios.post(
          `http://localhost:3002/user/unfollow/${user._id}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setIsFollowing(false);
      } else {
        await axios.post(
          `http://localhost:3002/user/follow/${user._id}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setIsFollowing(true);
      }
      
      if (onFollowChange) {
        onFollowChange(user._id, isFollowing);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      alert(error.response?.data?.message || "Failed to follow/unfollow user");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
          {user.profilePicture ? (
            <img
              src={`http://localhost:3002${user.profilePicture}`}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            user.username?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <div>
          <Link
            to={`/user/${user._id}`}
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            @{user.username}
          </Link>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      
      {user._id !== currentUserId && token && (
        <button
          onClick={handleFollow}
          disabled={followLoading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isFollowing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } disabled:opacity-50`}
        >
          {followLoading 
            ? "Loading..." 
            : isFollowing 
              ? "Unfollow" 
              : "Follow"
          }
        </button>
      )}
    </div>
  );
} 