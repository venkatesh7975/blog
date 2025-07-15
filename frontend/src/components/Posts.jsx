import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import Pagination from "./Pagination";
import LoadingSpinner from "./LoadingSpinner";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          sort: sortBy,
          page: currentPage,
          limit: 6,
        });

        const response = await axios.get(`http://localhost:3002/posts?${params}`);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        setTotalPosts(response.data.totalPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, sortBy, currentPage]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePostDelete = useCallback((postId) => {
    // Remove the post from the current page
    const updatedPosts = posts.filter(post => post._id !== postId);
    setPosts(updatedPosts);
    
    // Update total posts count
    setTotalPosts(prev => prev - 1);
    
    // If we're on a page that becomes empty and it's not the first page, go to previous page
    if (updatedPosts.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [posts, currentPage]);

  const handlePostLike = useCallback((postId) => {
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, likes: [...(post.likes || []), localStorage.getItem("userId")] }
        : post
    ));
  }, [posts]);

  const handlePostUnlike = useCallback((postId) => {
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, likes: (post.likes || []).filter(id => id !== localStorage.getItem("userId")) }
        : post
    ));
  }, [posts]);

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Posts</h1>
        <p className="text-gray-600">Discover and share amazing stories</p>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchBar onSearch={handleSearch} />
        <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500">
            {searchTerm ? `No posts match "${searchTerm}"` : "Be the first to create a post!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handlePostDelete}
              onLike={handlePostLike}
              onUnlike={handlePostUnlike}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Loading Overlay */}
      {loading && posts.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
}
