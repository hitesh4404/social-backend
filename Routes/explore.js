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

// Fisher-Yates shuffle algorithm (better than sort with Math.random)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/* GET ALL POSTS RANDOMLY WITH USERNAME AND LIKES */
router.get("/", (req, res) => {
    try {
        const posts = readPosts();
        const users = readUsers();

        // Merge username into posts
        const mergedPosts = posts.map(post => {
            const user = users.find(u => u.id === post.userId);
            return {
                ...post,
                username: user ? user.username : "Unknown",
                likes: post.likes || [],
                profilePhoto: user?.profilePhoto || ""
            };
        });

        // Shuffle posts randomly using Fisher-Yates algorithm
        const shuffled = shuffleArray(mergedPosts);

        res.json(shuffled);
    } catch (error) {
        console.error("Error in GET /explore:", error.message);
        res.status(500).json({ error: "Failed to fetch posts", details: error.message });
    }
});

// GET posts by user ID
router.get("/user/:userId", (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = readPosts();

        const userPosts = posts.filter(post => post.userId == userId);

        res.json(userPosts);
    } catch (error) {
        console.error("Error in GET /user/:userId:", error.message);
        res.status(500).json({ error: "Failed to fetch user posts", details: error.message });
    }
});

module.exports = router;


