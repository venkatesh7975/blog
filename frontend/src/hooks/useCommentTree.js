import { useState } from "react";

// Helper functions for recursive tree operations
function addReplyToComment(comments, targetId, newReply) {
  return comments.map(comment => {
    if (comment._id === targetId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newReply]
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToComment(comment.replies, targetId, newReply)
      };
    }
    return comment;
  });
}

function updateCommentInTree(comments, targetId, updatedComment) {
  return comments.map(comment => {
    if (comment._id === targetId) {
      return updatedComment;
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, targetId, updatedComment)
      };
    }
    return comment;
  });
}

function deleteCommentFromTree(comments, targetId) {
  return comments.filter(comment => {
    if (comment._id === targetId) {
      return false;
    }
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = deleteCommentFromTree(comment.replies, targetId);
    }
    return true;
  });
}

export default function useCommentTree(initialComments = []) {
  const [comments, setComments] = useState(initialComments);

  const addReply = (commentId, reply) => {
    setComments(prev => addReplyToComment(prev, commentId, reply));
  };

  const updateComment = (commentId, updatedComment) => {
    setComments(prev => updateCommentInTree(prev, commentId, updatedComment));
  };

  const deleteComment = (commentId) => {
    setComments(prev => deleteCommentFromTree(prev, commentId));
  };

  const setAllComments = (newComments) => {
    setComments(newComments);
  };

  return {
    comments,
    setAllComments,
    addReply,
    updateComment,
    deleteComment,
  };
} 