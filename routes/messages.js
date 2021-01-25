const express = require("express");
const router = express.Router();

const Messages = require("../models/messages");

const apiError = "Ошибка при запросе к API";
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', () =>{
    console.log('a user is connected')
});

router.get("/", async (req, res) => {
  try {
    const messages = await Messages.find();
    return res.json(messages);
  } catch (e) {
    const errors = { error: apiError };
    return res.status(400).json(errors);
  }
});

router.post("/",
    async (req, res) => {
        let message = new Messages(req.body);

        try {
            message = await message.save();
            io.emit('message', req.body);
            return res.json(message);
        } catch (err) {
            const errors = { error: "Ошибка при создании сообщения" };
            return res.status(400).json(errors);
        }
    }
);

module.exports = router;
