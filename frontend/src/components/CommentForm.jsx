import { useState } from "react";
import axios from "axios";

export default function CommentForm({ postId, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:3002/comments`,
        { content: comment.trim(), postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      onCommentAdded(response.data);
      setComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="p-6 border-b border-gray-200">
        <p className="text-gray-500 text-center">
          Please <a href="/login" className="text-blue-600 hover:underline">login</a> to comment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            {comment.length}/500 characters
          </span>
          <button
            type="submit"
            disabled={!comment.trim() || submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>
    </div>
  );
} 