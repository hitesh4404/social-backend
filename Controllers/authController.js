const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../database/users.json");

function getUsers() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;

    const users = getUsers();

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password
    };

    users.push(newUser);

    saveUsers(users);

    res.json({ message: "User registered successfully" });
};

exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    const users = getUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
};