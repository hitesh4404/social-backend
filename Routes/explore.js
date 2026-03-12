const express = require("express");
const router = express.Router();

const posts = [
  {
    id: "1",
    userId: "101",
    username: "John",
    caption: "Hello Explore!",
    imageUrl: "https://placekitten.com/300/300",
    profilePhoto: "https://placekitten.com/50/50",
    likes: []
  },
  {
    id: "2",
    userId: "102",
    username: "Emma",
    caption: "Another post",
    imageUrl: "https://placekitten.com/301/301",
    profilePhoto: "https://placekitten.com/51/51",
    likes: ["101"]
  }
];

router.get("/", (req, res) => {
  res.json(posts);
});

module.exports = router;

