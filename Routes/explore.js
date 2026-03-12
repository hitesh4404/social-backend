const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");

const POSTS_FILE = path.join(__dirname, "../database/posts.json");
const USERS_FILE = path.join(__dirname, "../database/users.json");

/* helper functions */
function readPosts() {
    if (!fs.existsSync(POSTS_FILE)) fs.writeFileSync(POSTS_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(POSTS_FILE));
}

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

/* GET ALL POSTS RANDOMLY WITH USERNAME AND LIKES */
router.get("/", (req, res) => {
    const posts = readPosts();
    const users = readUsers();

    // Merge username into posts
    const mergedPosts = posts.map(post => {
        const user = users.find(u => u.id === post.userId);
        return {
            ...post,
            username: user ? user.username : "Unknown", // username of the post creator
            likes: post.likes || [],
            profilePhoto: user?.profilePhoto || ""
        };
    });

    // Shuffle posts randomly
    const shuffled = mergedPosts.sort(() => Math.random() - 0.5);

    res.json(shuffled);
});




router.get("/", (req, res) => {
    try {
        const posts = readPosts();
        const users = readUsers();

        const mergedPosts = posts.map(post => {
            const user = users.find(u => String(u.id) === String(post.userId));
            return {
                id: post.id || post._id || Math.random().toString(36).substring(2, 9),
                userId: post.userId,
                username: user ? user.username : "Unknown",
                caption: post.caption,
                imageUrl: post.imageUrl,
                profilePhoto: user?.profilePhoto || "",
                likes: post.likes || []
            };
        });

        const shuffled = mergedPosts.sort(() => Math.random() - 0.5);
        res.json(shuffled);

    } catch (err) {
        console.error("Error in /api/explore:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



function getPosts() {
    const data = fs.readFileSync(POSTS_FILE, "utf-8");
    return JSON.parse(data);
}

// GET posts by user ID
router.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;

    const posts = getPosts();

    const userPosts = posts.filter(
        (post) => post.userId == userId
    );

    res.json(userPosts);
});




module.exports = router;

