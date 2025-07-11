import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const { id } = useParams();

  const token = localStorage.getItem("token");

  async function fetchPost() {
    setLoading(true);
    setError("");
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        axios.get(`http://localhost:3002/api/posts/${id}`),
        axios.get(`http://localhost:3002/api/comments/${id}`)
      ]);
      
      setPost(postResponse.data);
      setComments(commentsResponse.data);
      
      // Check if current user is the author
      if (token && postResponse.data.userId?._id) {
        // You might want to decode the token to get user ID
        // For now, we'll check by email
        const currentUserEmail = localStorage.getItem("userEmail");
        setIsAuthor(currentUserEmail === postResponse.data.userId?.email);
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      const response = await axios.post(
        `http://localhost:3002/api/comments/${id}`,
        { content: newComment.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await axios.delete(`http://localhost:3002/api/posts/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      window.location.href = "/posts";
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/posts" className="text-blue-600 hover:underline">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-8">
          {/* Post Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {post.userId?.email || "Anonymous"}
                </span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDeletePost}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h2>
        </div>

        {/* Add Comment Form */}
        {token && (
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">
                  {newComment.length}/500 characters
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submittingComment}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {submittingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments List */}
        <div className="p-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {comment.userId?.email?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.userId?.email || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
