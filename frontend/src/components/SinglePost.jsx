import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import PostActions from "./PostActions";
import CommentsList from "./CommentsList";
import LoadingSpinner from "./LoadingSpinner";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updating, setUpdating] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const { id } = useParams();

  const token = localStorage.getItem("token");

  async function fetchPost() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:3002/posts/${id}`);
      setPost(response.data);
      setLikeCount(response.data.likes?.length || 0);
      
      // Check if current user is the author
      if (token && response.data.userId?._id) {
        const currentUserEmail = localStorage.getItem("userEmail");
        setIsAuthor(currentUserEmail === response.data.userId?.email);
        
        // Check if user liked the post
        const currentUserId = localStorage.getItem("userId");
        setLiked(response.data.likes?.includes(currentUserId) || false);
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

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await axios.delete(`http://localhost:3002/posts/${id}`, {
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

  const handleEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length + selectedFiles.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });

    setError("");
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      return newUrls;
    });
  };

  const handleDeleteImage = async (imageIndex) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await axios.delete(`http://localhost:3002/posts/${id}/images/${imageIndex}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      
      // Update post state to remove the image
      setPost(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== imageIndex)
      }));
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);
      
      // Append new images
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      await axios.put(
        `http://localhost:3002/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setEditing(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
      fetchPost();
    } catch (err) {
      alert('Failed to update post.');
    } finally {
      setUpdating(false);
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert('Please login to like posts');
      return;
    }
    
    try {
      const endpoint = liked ? 'unlike' : 'like';
      await axios.post(
        `http://localhost:3002/posts/${id}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (err) {
      console.error('Error liking/unliking post:', err);
      alert('Failed to like/unlike post. Please try again.');
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
        <LoadingSpinner size="lg" className="h-64" />
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
                  @{post.userId?.username || "Anonymous"}
                </span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-4">
                <PostActions
                  post={post}
                  onLike={() => {
                    setLiked(true);
                    setLikeCount(likeCount + 1);
                  }}
                  onUnlike={() => {
                    setLiked(false);
                    setLikeCount(likeCount - 1);
                  }}
                  onDelete={handleDeletePost}
                />
                
                {/* Edit/Delete for Author */}
                {isAuthor && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleEdit}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
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
          </div>

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {post.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`http://localhost:3002${image}`}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    {isAuthor && (
                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="prose max-w-none">
            {editing ? (
              <form onSubmit={handleUpdatePost} className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  maxLength={100}
                  required
                />
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border rounded"
                  maxLength={5000}
                  required
                />
                
                {/* Image Upload in Edit Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add More Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label htmlFor="edit-image-upload" className="cursor-pointer">
                      <div className="text-gray-600">
                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm font-medium">Click to add images</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* New Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">New Images:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                  >
                    {updating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setSelectedFiles([]);
                      setPreviewUrls([]);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            )}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <CommentsList postId={id} />
    </div>
  );
}
