const fs = require("fs");
const path = require("path");

const postsPath = path.join(__dirname, "../Database/posts.json");


// CREATE POST
exports.createPost = (req, res) => {

    const { userId, imageUrl, caption } = req.body;

    const posts = JSON.parse(fs.readFileSync(postsPath));

    const newPost = {
        id: Date.now(),
        userId,
        imageUrl,
        caption
    };

    posts.push(newPost);

    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

    res.json({
        message: "Post uploaded successfully",
        post: newPost
    });

};


// GET USER POSTS
exports.getUserPosts = (req, res) => {

    const { userId } = req.params;

    const posts = JSON.parse(fs.readFileSync(postsPath));

    const userPosts = posts.filter(
        (post) => post.userId == userId
    );

    res.json({
        posts: userPosts
    });

};

exports.deletePost = (req, res) => {

    const { postId } = req.params;

    let posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));

    const newPosts = posts.filter(
        (post) => post.id.toString() !== postId.toString()
    );

    fs.writeFileSync(postsPath, JSON.stringify(newPosts, null, 2));

    res.json({
        message: "Post deleted successfully"
    });

};

exports.toggleLike = (req, res) => {

    const { postId, userId } = req.body;

    const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));

    const post = posts.find(
        (p) => p.id.toString() === postId.toString()
    );

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes) post.likes = [];

    const index = post.likes.findIndex(
        (id) => id.toString() === userId.toString()
    );

    if (index === -1) {
        post.likes.push(userId);
    } else {
        post.likes.splice(index, 1);
    }

    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), "utf8");

    res.json({
        likes: post.likes,
        likeCount: post.likes.length
    });

};

// Add comment
exports.addComment = (req, res) => {
    const { postId, userId, username, text } = req.body;

    const posts = JSON.parse(fs.readFileSync(postsPath));

    const post = posts.find(p => p.postId === postId);
    if (!post.comments) post.comments = [];

    const newComment = {
        commentId: Date.now(), // simple unique id
        userId,
        username,
        text,
        createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);

    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

    res.json({ comments: post.comments });
};


exports.deleteComment = (req, res) => {
    const { postId, commentId } = req.params;

    // 1️⃣ Read posts
    const posts = JSON.parse(fs.readFileSync(postsPath));

    // 2️⃣ Find post by `id` (your JSON uses `id`)
    const post = posts.find(p => p.id.toString() === postId.toString());
    if (!post) return res.status(404).json({ message: "Post not found" });

    // 3️⃣ Initialize comments if undefined
    if (!post.comments) post.comments = [];

    // 4️⃣ Filter out the comment
    const commentExists = post.comments.some(
        (c) => c.commentId.toString() === commentId.toString()
    );
    if (!commentExists)
        return res.status(404).json({ message: "Comment not found" });

    post.comments = post.comments.filter(
        (c) => c.commentId.toString() !== commentId.toString()
    );

    // 5️⃣ Write updated posts back to JSON
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

    // 6️⃣ Return updated comments
    res.json({ comments: post.comments });
};