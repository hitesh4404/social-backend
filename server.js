const express = require("express");
const cors = require("cors");

const authRoutes = require("./Routes/authRoutes");
const profileRoutes = require("./Routes/profiles");
const postRoutes = require("./Routes/postRoutes");
const exploreRoutes = require("./Routes/explore");
const messageRoutes = require("./Routes/messages");
const deleteUser = require("./Routes/deleteUser");



const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/posts/user", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", deleteUser);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});




