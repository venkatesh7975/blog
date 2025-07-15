import { useState } from "react";
import axios from "axios";

export default function Comment({ 
  comment, 
  isReply = false, 
  onUpdate, 
  onDelete, 
  onReply,
  currentUserId 
}) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const isCommentAuthor = currentUserId === comment.userId?._id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    setEditContent(comment.content);
    setEditing(true);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3002/comments/${comment._id}`,
        { content: editContent.trim() },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      
      onUpdate(comment._id, response.data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3002/comments/${comment._id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      
      onDelete(comment._id);
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    setReplying(true);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3002/comments/${comment._id}/reply`,
        { content: replyContent.trim() },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      
      onReply(comment._id, response.data);
      setReplyContent("");
      setReplying(false);
    } catch (err) {
      console.error("Error posting reply:", err);
      alert("Failed to post reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border-b border-gray-100 pb-4 last:border-b-0 ${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {comment.userId?.username?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">
              @{comment.userId?.username || "Anonymous"}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
            {isReply && (
              <span className="text-xs text-gray-400">• reply</span>
            )}
          </div>
          
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{comment.content}</p>
          )}
          
          {!comment.isDeleted && (
            <div className="flex space-x-2 mt-2">
              {token && (
                <button
                  onClick={handleReply}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                >
                  Reply
                </button>
              )}
              {isCommentAuthor && !editing && (
                <>
                  <button
                    onClick={handleEdit}
                    className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 transition-colors text-xs"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
          
          {/* Reply form */}
          {replying && (
            <div className="mt-3 space-y-2">
              <textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {replyContent.length}/500 characters
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || loading}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-xs"
                  >
                    {loading ? "Posting..." : "Post Reply"}
                  </button>
                  <button
                    onClick={() => setReplying(false)}
                    className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.replies.map((reply, index) => (
                <Comment
                  key={reply._id || `reply-${comment._id}-${index}`}
                  comment={reply}
                  isReply={true}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onReply}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 