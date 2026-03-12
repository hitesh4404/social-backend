const express = require("express");
const fs = require("fs");
const router = express.Router();

const USERS_FILE = "./Database/users.json";
const POSTS_FILE = "./Database/posts.json";

router.use(express.json());

function readUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function writeUsers(data) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

function readPosts() {
    return JSON.parse(fs.readFileSync(POSTS_FILE));
}

function writePosts(data) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2));
}

/* DELETE USER */

router.post("/delete-user", (req, res) => {

    const { username, password } = req.body;

    const users = readUsers();

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });
    }

    const userId = user.id;

    /* remove user */

    const updatedUsers = users.filter(u => u.id !== userId);
    writeUsers(updatedUsers);

    /* remove user's posts */

    const posts = readPosts();

    const updatedPosts = posts.filter(
        p => p.userId !== userId
    );

    writePosts(updatedPosts);

    res.json({
        success: true,
        message: "User and all posts deleted"
    });

});

module.exports = router;