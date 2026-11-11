import Message from "../models/message.js";

const activeUsers = new Map();

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`⚡ A user connected: ${socket.id}`);

    socket.on("join-room", (data) => {
      const { room, sender } =
        typeof data === "object" ? data : { room: data, sender: "Anonymous" };
      socket.join(room);
      activeUsers.set(socket.id, { sender, room });
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

    socket.on("typing", (data) => {
      const { room, sender } = data;

      socket.to(room).emit("display-typing", { sender });
    });

    socket.on("stop-typing", (data) => {
      const { room } = data;

      socket.to(room).emit("hide-typing");
    });

    socket.on("disconnect", () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        console.log(
          `❌ User [${user.sender}] disconnected from room [${user.room}]`,
        );
        activeUsers.delete(socket.id);
      } else console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
