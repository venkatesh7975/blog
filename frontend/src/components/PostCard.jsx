import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function PostCard({ post, onDelete, onLike, onUnlike }) {
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const isAuthor = currentUserId === post.userId?._id;
  const isLiked = post.likes?.includes(currentUserId) || false;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async () => {
    if (!token) {
      alert('Please login to like posts');
      return;
    }
    
    setLiking(true);
    try {
      if (isLiked) {
        await axios.post(
          `http://localhost:3002/posts/${post._id}/unlike`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        onUnlike(post._id);
      } else {
        await axios.post(
          `http://localhost:3002/posts/${post._id}/like`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        onLike(post._id);
      }
    } catch (err) {
      console.error('Error liking/unliking post:', err);
      alert('Failed to like/unlike post. Please try again.');
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    console.log("Attempting to delete post:", post._id);
    setDeleting(true);
    try {
      const response = await axios.delete(`http://localhost:3002/posts/${post._id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log("Delete response:", response.data);
      onDelete(post._id);
    } catch (err) {
      console.error("Error deleting post:", err);
      console.error("Error response:", err.response?.data);
      alert(err.response?.data?.message || "Failed to delete post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      alert('Post link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Post link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {post.userId?.profilePicture ? (
                <img
                  src={`http://localhost:3002${post.userId.profilePicture}`}
                  alt={post.userId.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                post.userId?.username?.charAt(0).toUpperCase() || "A"
              )}
            </div>
            <div>
              <Link
                to={`/user/${post.userId?._id}`}
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                @{post.userId?.username || "Anonymous"}
              </Link>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{post.likes?.length || 0}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-sm transition-colors"
            >
              <span>📤</span>
              <span>Share</span>
            </button>
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-800 transition-colors text-sm disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <Link to={`/posts/${post._id}`} className="block">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-700 line-clamp-3 mb-4">
            {post.content}
          </p>
        </Link>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
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

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{post.likes?.length || 0} likes</span>
            <span>{post.commentCount || 0} comments</span>
          </div>
          
          <Link
            to={`/posts/${post._id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
} 