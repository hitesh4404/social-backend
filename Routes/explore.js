const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const POSTS_FILE = path.join(process.cwd(), "database/posts.json");
const USERS_FILE = path.join(process.cwd(), "database/users.json");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

router.get("/", (req, res) => {
  try {
    const posts = readJson(POSTS_FILE);
    const users = readJson(USERS_FILE);

    const mergedPosts = posts.map(post => {
      const user = users.find(u => String(u.id) === String(post.userId));
      return {
        id: post.id,
        userId: post.userId,
        username: user ? user.username : "Unknown",
        caption: post.caption,
        imageUrl: post.imageUrl,
        profilePhoto: user?.profilePhoto || "",
        likes: post.likes || []
      };
    });

    res.json(mergedPosts);
  } catch (err) {
    console.error("Error reading posts.json:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = router;
