const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Absolute paths to JSON files
const POSTS_FILE = path.join(__dirname, "../database/posts.json");
const USERS_FILE = path.join(__dirname, "../database/users.json");

// Ensure folder exists
function ensureFolder(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Safe read JSON
function readJson(filePath) {
    ensureFolder(filePath);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}

// GET all posts for Explore
router.get("/", (req, res) => {
    try {
        const posts = readJson(POSTS_FILE);
        const users = readJson(USERS_FILE);

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

module.exports = router;


