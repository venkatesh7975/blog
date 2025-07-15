import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function PostActions({ post, onLike, onUnlike, onDelete }) {
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const isAuthor = currentUserId === post.userId?._id;
  const isLiked = post.likes?.some(likeId => likeId.toString() === currentUserId) || false;

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
    
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:3002/posts/${post._id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      onDelete(post._id);
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
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
    <div className="flex items-center space-x-4">
      {/* Like Button */}
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
      
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-sm transition-colors"
      >
        <span>📤</span>
        <span>Share</span>
      </button>
      
      {/* Edit/Delete for Author */}
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
  );
} 