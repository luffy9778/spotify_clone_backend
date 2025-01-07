const {
  updateOnlineStatus,
  updateOnlineStatusBySocketId,
  getAllUsers,
} = require("../controller/user/userController");

let connectedAdminCount = 0;

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected :", socket.id);

    socket.on("userOnline", async (userId) => {
      try {
        const user = await updateOnlineStatus(userId, true, socket.id);
        console.log(`User ${userId} is online`);

        if (connectedAdminCount > 0) {
          io.of("/admin").emit("userStatusChanged", { userId, isOnline: true });
        }
      } catch (error) {
        console.log("error handaling user online", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const user = await updateOnlineStatusBySocketId(socket.id, false);
        if (user) {
          console.log(`User ${user._id} is disconnected`);
          if (connectedAdminCount > 0) {
            io.of("/admin").emit("userStatusChanged", {
              userId: user._id,
              isOnline: false,
            });
          }
        }
      } catch (error) {
        console.log("error handaling user disconnected", error);
      }
    });
  });

  const adminNamespace = io.of("/admin");
  adminNamespace.on("connection", async (socket) => {
    connectedAdminCount++;
    console.log(
      `Admin connected (${connectedAdminCount} admins online):`,
      socket.id
    );

    try {
      const users = await getAllUsers();
      socket.emit("allUser", users);
    } catch (error) {
      console.log("error fetching user for admin", error);
    }

    socket.on("disconnect", () => {
      connectedAdminCount--;
      console.log(
        `Admin disconnected (${connectedAdminCount} admins online):`,
        socket.id
      );
    });
  });
};
module.exports = { socketHandler };
