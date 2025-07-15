import PropTypes from "prop-types";
import { useState } from "react";

export default function ReplyForm({ onSubmit, onCancel, loading }) {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onSubmit(replyContent.trim());
    setReplyContent("");
  };

  return (
    <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
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
            type="submit"
            disabled={!replyContent.trim() || loading}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-xs"
          >
            {loading ? "Posting..." : "Post Reply"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

ReplyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}; 