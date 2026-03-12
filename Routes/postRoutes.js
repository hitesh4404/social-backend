const express = require("express");
const router = express.Router();

const {
    createPost,
    getUserPosts,
    deletePost,
    toggleLike,
    addComment,
    deleteComment
} = require("../Controllers/postController");

router.post("/add-comment", addComment);
router.delete("/delete-comment/:postId/:commentId", deleteComment);

router.post("/toggle-like", toggleLike);

router.post("/create-post", createPost);

router.get("/user-posts/:userId", getUserPosts);

router.delete("/delete-post/:postId", deletePost);

module.exports = router;