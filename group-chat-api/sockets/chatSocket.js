import Message from "../models/message.js";

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`⚡ A user connected: ${socket.id}`);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`user with ID : ${socket.id} joined room: ${room}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const { room, sender, message } = data;
        console.log(
          `Message Received in Room [${room}] from ${sender}: ${message}`,
        );

        const savedMessage = await Message.create({
          room,
          sender,
          message,
        });

        io.to(room).emit("received message", savedMessage);
      } catch (error) {
        console.log("Error Saving message ", error);
      }
    });
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
