const express = require("express");
const fs = require("fs");
const router = express.Router();

const MESSAGES_FILE = "./Database/messages.json";

function readMessages() {
    if (!fs.existsSync(MESSAGES_FILE)) {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
    }

    return JSON.parse(fs.readFileSync(MESSAGES_FILE));
}

function writeMessages(data) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2));
}

router.use(express.json());

/* SEND MESSAGE */

router.post("/send", (req, res) => {

    const { senderId, receiverId, text } = req.body;

    const messages = readMessages();

    const newMessage = {
        id: Date.now(),
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        text,
        time: new Date().toISOString()
    };

    messages.push(newMessage);

    writeMessages(messages);

    res.json({
        success: true,
        message: newMessage
    });

});


/* GET CHAT BETWEEN TWO USERS */

router.get("/chat/:user1/:user2", (req, res) => {

    const user1 = parseInt(req.params.user1);
    const user2 = parseInt(req.params.user2);

    const messages = readMessages();

    const chat = messages.filter(
        m =>
            (m.senderId === user1 && m.receiverId === user2) ||
            (m.senderId === user2 && m.receiverId === user1)
    );

    res.json({
        messages: chat
    });

});

router.delete("/delete-chat/:user1/:user2", (req, res) => {

    const user1 = parseInt(req.params.user1);
    const user2 = parseInt(req.params.user2);

    const messages = readMessages();

    const filteredMessages = messages.filter(
        m =>
            !(
                (m.senderId === user1 && m.receiverId === user2) ||
                (m.senderId === user2 && m.receiverId === user1)
            )
    );

    writeMessages(filteredMessages);

    res.json({
        success: true,
        message: "Chat deleted successfully"
    });

});

module.exports = router;