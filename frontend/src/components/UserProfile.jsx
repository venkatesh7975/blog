import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { userId } = useParams();

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const [userResponse, postsResponse] = await Promise.all([
        axios.get(`http://localhost:3002/user/${userId}`),
        axios.get(`http://localhost:3002/posts/user/${userId}`)
      ]);
      
      setUser(userResponse.data);
      setPosts(postsResponse.data.posts || []);
      
      // Check if current user is following this user
      if (currentUserId && userResponse.data.followers) {
        const isFollowingUser = userResponse.data.followers.some(
          follower => follower._id === currentUserId
        );
        setIsFollowing(isFollowingUser);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!token) {
      alert("Please login to follow users");
      return;
    }
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await axios.post(
          `http://localhost:3002/user/unfollow/${userId}`,
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
          `http://localhost:3002/user/follow/${userId}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setIsFollowing(true);
      }
      
      // Refresh user data to update follower counts
      fetchUserProfile();
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      alert(error.response?.data?.message || "Failed to follow/unfollow user");
    } finally {
      setFollowLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 text-lg">{error}</p>
          <Link to="/posts" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <Link to="/posts" className="text-blue-600 hover:underline">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/posts"
          className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
        >
          ← Back to Posts
        </Link>
      </div>

      {/* User Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.profilePicture ? (
                <img
                  src={`http://localhost:3002${user.profilePicture}`}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                user.username?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                @{user.username}
              </h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>{posts.length} posts</span>
                <span>{user.followers?.length || 0} followers</span>
                <span>{user.following?.length || 0} following</span>
              </div>
            </div>
            
            {!isOwnProfile && token && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
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
        </div>
      </div>

      {/* User's Posts */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Posts by @{user.username}
        </h2>
        
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <Link to={`/posts/${post._id}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 line-clamp-3">
                      {post.content}
                    </p>
                  </Link>
                  
                  {post.images && post.images.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {post.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:3002${image}`}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                        {post.images.length > 3 && (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">+{post.images.length - 3} more</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 