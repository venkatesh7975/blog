import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching profile with token:", token ? "Token exists" : "No token");
      
      const response = await axios.get("http://localhost:3002/user/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log("Profile response:", response.data);
      setUser(response.data);
      
      // Fetch user's posts
      console.log("Fetching user posts...");
      const postsResponse = await axios.get("http://localhost:3002/posts/user/posts", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log("Posts response:", postsResponse.data);
      setUserPosts(postsResponse.data.posts);
    } catch (err) {
      console.error("Error fetching user data:", err);
      console.error("Error details:", err.response?.data);
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const response = await axios.post("http://localhost:3002/user/profile-picture", formData, {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user state with new profile picture
      setUser(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Clear file input
      const fileInput = document.getElementById('profile-picture-input');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:3002/user/profile-picture", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // Update user state to remove profile picture
      setUser(prev => ({ ...prev, profilePicture: null }));
    } catch (err) {
      console.error("Error deleting profile picture:", err);
      setError("Failed to delete profile picture. Please try again.");
    }
  };

  const handleEditProfile = () => {
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditing(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:3002/user/profile", {
        username: editUsername,
        email: editEmail,
      }, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setUser(prev => ({ ...prev, ...response.data.user }));
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
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
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={`http://localhost:3002${user.profilePicture}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              
              {/* Upload button */}
              <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                @{user?.username}
              </h2>
              <p className="text-gray-600 mb-1">{user?.email}</p>
              <p className="text-gray-500 text-sm mb-4">
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

          {/* Profile Picture Upload Section */}
          {(selectedFile || user?.profilePicture) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
              
              {previewUrl && (
                <div className="mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <p className="text-sm text-gray-600 mt-2">Preview of new profile picture</p>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                {selectedFile && (
                  <button
                    onClick={handleUploadProfilePicture}
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {uploading ? "Uploading..." : "Upload Picture"}
                  </button>
                )}
                
                {user?.profilePicture && !selectedFile && (
                  <button
                    onClick={handleDeleteProfilePicture}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Remove Picture
                  </button>
                )}
                
                {selectedFile && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      const fileInput = document.getElementById('profile-picture-input');
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
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
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength={3}
                        maxLength={30}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateProfile}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Username</h4>
                      <p className="text-gray-600">@{user?.username}</p>
                    </div>
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
                      <div className="space-y-2">
                        <button
                          onClick={handleEditProfile}
                          className="text-blue-600 hover:text-blue-800 transition-colors mr-4"
                        >
                          Edit Profile
                        </button>
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
          )}
        </div>
      </div>
    </div>
  );
} 