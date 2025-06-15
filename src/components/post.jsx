import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
  faThumbsUp,
  faComment,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getComments,
  likePost,
  addComment,
  editComment,
  deleteComment,
  editPost,
  deletePost,
} from "../config/api";

const Post = ({ post, onDelete }) => {
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [commentsDropdownOpen, setCommentsDropdownOpen] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState(null);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState(post.content);

  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);

  // Save post edit handler
  const handleSavePostEdit = async () => {
    if (!editedPostContent.trim()) return;

    try {
      const res = await editPost(post.id, { content: editedPostContent.trim() });
      if (res?.data?.success) {
        post.content = editedPostContent.trim();
        setIsEditingPost(false);
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  // Confirm deletion of the post
  const confirmDeletePost = async () => {
    try {
      const res = await deletePost(post.id);
      if (res?.data?.success) {
        setShowDeletePostModal(false);
        if (onDelete) onDelete(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Comment edit handler
  const handleEditComment = async (id) => {
    if (!editingContent.trim()) return;
    try {
      await editComment(id, { content: editingContent });
      setEditingCommentId(null);
      await fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Confirm deletion of comment
  const confirmDeleteComment = async () => {
    if (!commentToDeleteId) return;
    try {
      await deleteComment(commentToDeleteId);
      await fetchComments();
      setCommentCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setCommentToDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await addComment(post.id, { content: newComment.trim() });
      if (res?.data?.success) {
        setNewComment("");
        setCommentCount((prev) => prev + 1);
        const refreshedComments = await getComments(post.id);
        setComments(refreshedComments.data.data || []);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await getComments(post.id);
      setComments(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setComments([]);
    }
  };

  // Like post handler
  const handleLikeClick = async () => {
    try {
      const res = await likePost(post.id);
      setIsLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const profileImage = localStorage.getItem("profile_url");

  const isCommentOwner = (comment) => {
    const userRole = localStorage.getItem("role")?.toLowerCase();
    const userId = parseInt(localStorage.getItem("id"), 10);
    return (
      comment.user_role?.toLowerCase() === userRole && comment.user_id === userId
    );
  };

  const isOwner = () => {
    const userRole = localStorage.getItem("role")?.toLowerCase();
    const userId = parseInt(localStorage.getItem("id"), 10);
    return post.user_role?.toLowerCase() === userRole && post.user_id === userId;
  };

  const createdAt = post.createdAt;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Modal to confirm comment deletion
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this comment?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteComment}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Modal to confirm post deletion
  const DeletePostConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Confirm Post Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this post?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDeletePostModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeletePost}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative max-w-lg bg-white rounded-lg flex flex-col shadow-md mb-5">
      <div className="flex justify-between p-4">
        <div className="flex gap-3">
          {post.user.profile_url ? (<img
                  src={`http://localhost:8080${post.user.profile_url}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-xl object-cover"
                />) : (<div className="rounded-xl bg-gray-200 w-16 h-16" />)}
          <div>
            <span className="text-lg font-semibold">
              {post.user.first_name} {post.user.last_name} {post.user.name}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className={isOwner() ? "flex justify-end" : "hidden"}>
            <FontAwesomeIcon
              icon={faEllipsis}
              onClick={() => setPostMenuOpen(!postMenuOpen)}
            />
          </span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>

      <div className="p-4">
        {isEditingPost ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editedPostContent}
              onChange={(e) => setEditedPostContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSavePostEdit}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingPost(false);
                  setEditedPostContent(post.content);
                }}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p>{post.content}</p>
        )}
      </div>

      {post.image_url && (
        <div className="mt-4 h-64 overflow-hidden rounded">
          <img
            src={`http://localhost:8080${post.image_url}`}
            alt="Post"
            className="object-cover w-full h-full"
          />
        </div>
      )}

           <div className="flex justify-between p-4 text-sm text-gray-600">
        <div className="flex gap-2 items-center">
          <div className="flex items-center justify-center rounded-full bg-green-500 h-5 w-5">
            <FontAwesomeIcon icon={faThumbsUp} className="text-white w-3 h-3" />
          </div>
          <span>
            {likeCount === 0
              ? "No likes"
              : `${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
          </span>
          <span>•</span>
          <span>
            {commentCount === 0
              ? "No comments"
              : `${commentCount} ${
                  commentCount === 1 ? "comment" : "comments"
                }`}
          </span>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t border-b text-sm font-semibold text-gray-600">
        <div className="flex gap-4">
          <button onClick={handleLikeClick} className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`h-5 w-5 ${isLiked ? "text-green-600" : ""}`}
            />
            <span className={`transition-colors duration-200 ${isLiked ? "text-green-600" : "text-gray-600"}`}>Like</span>

          </button>
          <button
            onClick={() => {
              fetchComments();
              setCommentsDropdownOpen(!commentsDropdownOpen);
            }}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faComment} className="h-5 w-5" />
            <span>Comment</span>
          </button>
        </div>
      </div>

      {postMenuOpen && (
        <ul className="absolute top-10 right-2 bg-white shadow-md rounded w-24 z-10">
          <li
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setIsEditingPost(true);
              setPostMenuOpen(false);
            }}
          >
            Edit
          </li>
          <li
            className="p-2 hover:bg-gray-100 cursor-pointer text-red-600"
            onClick={() => {
              setShowDeletePostModal(true);
              setPostMenuOpen(false);
            }}
          >
            Delete
          </li>
        </ul>
      )}

            {commentsDropdownOpen && (
        <div className="flex flex-col w-full gap-6 p-4">
          <div className="flex gap-4 items-start">
             {profileImage && profileImage !== "null" ? (
                <img
                  src={`http://localhost:8080${profileImage}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="bg-gray-200 border border-amber-50 w-12 h-12 rounded-lg"></div>
              )}
            <div className="flex border border-gray-300 w-5/6 rounded-lg bg-white overflow-hidden">
              <input
                type="text"
                placeholder="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                className="flex-grow p-2 outline-none"
              />
              <button
                onClick={handleAddComment}
                className="bg-green-500 text-white px-2 m-2 rounded"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>

          {comments.map((comment, index) => (
            <div key={index} className="relative flex gap-2">
               {comment.user.profile_url !== null ? (
                <img
                  src={`http://localhost:8080${comment.user.profile_url}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-xl">
                  {/*Image*/}
                </div>
              )}
              <div className="w-5/6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">
                    {comment.user.first_name && comment.user.last_name
                      ? `${comment.user.first_name} ${comment.user.last_name}`
                      : comment.user.name}
                  </span>
                  {isCommentOwner(comment) && (
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      onClick={() =>
                        setOpenCommentMenuId(
                          openCommentMenuId === index ? null : index
                        )
                      }
                    />
                  )}
                </div>
                {editingCommentId === comment.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="p-2 border rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingContent("");
                        }}
                        className="px-3 py-1 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="p-4 bg-green-50 rounded">{comment.content}</p>
                )}
                <div className="text-gray-500 text-sm">
                  {format(new Date(comment.createdAt), "EEEE h:mmaaa")}
                </div>
              </div>
              {openCommentMenuId === index && (
                <ul className="absolute top-8 right-0 bg-white w-24 rounded-lg shadow-lg">
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingContent(comment.content);
                      setOpenCommentMenuId(null);
                    }}
                  >
                    Edit
                  </li>
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCommentToDeleteId(comment.id);
                      setShowDeleteModal(true);
                      setOpenCommentMenuId(null);
                    }}
                  >
                    Delete
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && <DeleteConfirmModal />}
      {showDeletePostModal && <DeletePostConfirmModal />}
    </div>
  );
};

export default Post;
