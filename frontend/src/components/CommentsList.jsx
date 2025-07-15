import { useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import useCommentTree from "../hooks/useCommentTree";

export default function CommentsList({ postId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUserId = localStorage.getItem("userId");

  // Use the custom hook for comment tree management
  const {
    comments,
    setAllComments,
    addReply,
    updateComment,
    deleteComment,
  } = useCommentTree([]);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:3002/comments/post/${postId}`);
      setAllComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setAllComments([newComment, ...comments]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments
          </h2>
        </div>
        <div className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchComments}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

      <div className="p-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onUpdate={updateComment}
                onDelete={deleteComment}
                onReply={addReply}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 