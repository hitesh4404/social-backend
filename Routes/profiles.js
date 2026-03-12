const express = require("express");
const fs = require("fs");
const router = express.Router();




router.use(express.json());

const USERS_FILE = "./Database/users.json";




router.get("/all-users", (req, res) => {

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

    res.json({
        users
    });

});

/* helper functions */

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    }

    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

function writeUsers(data) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}


/* GET PROFILE */

router.get("/get-profile/:id", (req, res) => {

    const userId = parseInt(req.params.id);

    const users = readUsers();

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.json({
        success: true,
        user
    });

});


/* UPDATE PROFILE */

router.post("/update-profile", (req, res) => {

    const { id, username, name, bio, profilePhoto } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "User id required"
        });
    }

    const users = readUsers();

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    /* check username availability */

    const usernameExists = users.find(
        u => u.username === username && u.id !== id
    );

    if (usernameExists) {
        return res.json({
            success: false,
            message: "Username already taken"
        });
    }

    /* update fields (if not exist they will be added) */

    if (username) users[userIndex].username = username;
    if (name) users[userIndex].name = name;
    if (bio !== undefined) users[userIndex].bio = bio;
    if (profilePhoto) users[userIndex].profilePhoto = profilePhoto;

    writeUsers(users);

    res.json({
        success: true,
        message: "Profile updated successfully",
        user: users[userIndex]
    });

});

router.get("/search/:username", (req, res) => {
    const users = readUsers();
    const username = req.params.username.toLowerCase();

    const user = users.find(
        u => u.username.toLowerCase() === username
    );

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
});

router.get("/:id", (req, res) => {
    const users = readUsers();
    const id = parseInt(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
});






module.exports = router;