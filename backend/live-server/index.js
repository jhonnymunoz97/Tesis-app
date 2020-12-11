var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit("chat message", "Usuario conectado: " + socket.handshake.address);
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log("message: " + msg);
  });
  socket.on("disconnect", () => {
    console.log("Usuario desconectado: " + socket.handshake.address);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
