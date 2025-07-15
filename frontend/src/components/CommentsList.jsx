import { useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

export default function CommentsList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:3002/comments/post/${postId}`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentUpdated = (commentId, updatedComment) => {
    console.log("Updating comment:", commentId, updatedComment);
    
    const updateCommentInTree = (comments, targetId, updatedComment) => {
      return comments.map(comment => {
        if (comment._id === targetId) {
          return updatedComment;
        }
        // Recursively search in replies
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentInTree(comment.replies, targetId, updatedComment)
          };
        }
        return comment;
      });
    };
    
    setComments(prevComments => updateCommentInTree(prevComments, commentId, updatedComment));
  };

  const handleCommentDeleted = (commentId) => {
    console.log("Deleting comment:", commentId);
    
    const deleteCommentFromTree = (comments, targetId) => {
      return comments.filter(comment => {
        if (comment._id === targetId) {
          return false; // Remove this comment
        }
        // Recursively search in replies
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = deleteCommentFromTree(comment.replies, targetId);
        }
        return true;
      });
    };
    
    setComments(prevComments => deleteCommentFromTree(prevComments, commentId));
  };

  const handleCommentReply = (commentId, reply) => {
    console.log("Adding reply to comment:", commentId, reply);
    
    const addReplyToComment = (comments, targetId, newReply) => {
      return comments.map(comment => {
        if (comment._id === targetId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        // Recursively search in replies
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies, targetId, newReply)
          };
        }
        return comment;
      });
    };
    
    setComments(prevComments => addReplyToComment(prevComments, commentId, reply));
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
                onUpdate={handleCommentUpdated}
                onDelete={handleCommentDeleted}
                onReply={handleCommentReply}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 