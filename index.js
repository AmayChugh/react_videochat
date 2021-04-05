const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]    
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running.");
});

io.on('connection',(socket) => {
    socket.emit('me', socket.id);
    socket.on("disconnect",() =>{
        socket.broadcast.emit("Call Ended");
    });
    socket.on("Call User",({userToCall, signalData, from, name}) =>{
        io.to(userToCall).emit("Call User", { signal: signalData, from, name });
    });
    socket.on("answer call", (data) => {
        io.to(data.to).emit("Call Accepted", data.signal);
    });
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));