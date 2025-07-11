import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3002/api/user/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setUser(response.data);
      
      // Fetch user's posts
      const postsResponse = await axios.get("http://localhost:3002/api/posts/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setUserPosts(postsResponse.data.posts);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/posts"
          className="text-gray-500 hover:text-gray-700 transition-colors flex items-center mb-4"
        >
          ← Back to Posts
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {user?.email}
              </h2>
              <p className="text-gray-600 mb-4">
                Member since {formatDate(user?.createdAt)}
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {userPosts.length} posts
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "posts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Posts ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "posts" && (
            <div>
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start sharing your thoughts with the community!
                  </p>
                  <Link
                    to="/posts/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div
                      key={post._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/posts/${post._id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-gray-600 text-sm mt-1">
                            {post.content.length > 100
                              ? post.content.substring(0, 100) + "..."
                              : post.content}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/posts/${post._id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Member Since</h4>
                  <p className="text-gray-600">{formatDate(user?.createdAt)}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Actions</h4>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 