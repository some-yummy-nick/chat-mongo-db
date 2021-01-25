const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoURL = "mongodb+srv://marat:o9vDqp3uNDvBsrOh@cluster0-qfeqx.mongodb.net/chat?retryWrites=true&w=majority";
const apiError = "Ошибка при запросе к API";

const Messages = mongoose.model('messages',{
    name : String,
    message : String
});

app.get("/messages", async (req, res) => {
    try {
        const messages = await Messages.find();
        return res.json(messages);
    } catch (e) {
        const errors = { error: apiError };
        return res.status(400).json(errors);
    }
});

app.post("/messages",
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

io.on('connection', () =>{
    console.log('a user is connected')
});

mongoose
    .connect(
        mongoURL,
        {useNewUrlParser: true}
    )
    .then(() => {
        console.log("MongoDB ready");
    })
    .catch(err => {
        console.log("MongoDB error", err);
    });

const server = http.listen(80, () => {
    console.log('server is running on port', server.address().port);
});

