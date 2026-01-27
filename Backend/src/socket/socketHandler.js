import { SOCKET_EVENTS } from "./socketEvents.js";

const onlineUsers = new Map();

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("new Socket Connection", socket.id);

    // when user come online

    const user = socket.user;
    const userId = socket.userId;

    const userIdStr= String(userId)

    if (user && userId) {
      onlineUsers.set(userIdStr, {
        socketId: socket.id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        onLineAt: new Date(),
      });

      console.log("online user are ", user.fullName);
      console.log("online user email ", user.email);
      console.log("Total Online Users are ", onlineUsers.size);

      io.emit(SOCKET_EVENTS.USER_ONLINE, Array.from(onlineUsers.keys()));
    }

    socket.on("todoShared", async (data) => {
      try {
        data.sharedWith.forEach((email) => {
          let userSocket = null;
          for (let [userId, userData] of onlineUsers.entries()) {
            if (userData.email === email) {
              userSocket = userData;
              break;
            }
          }

          if (userSocket) {
            io.to(userSocket.socketId).emit("todoSharedNotification", {
              sharedBy: data.sharedBy,
              sharedById: data.sharedById,
              permission: data.permission,
              sharedAt: new Date(),
            });
            console.log(`Notification sent to ${email}`);
            console.log("data is ", data.todoName);
          }
        });
      } catch (error) {
        console.log("Error sending share notification:", error);
      }
    });

    socket.on("updateSharedTodo", async (data) => {
      try {
        console.log(data);

        const { todoId, updatedData, updatedBy, updatedById, createdBy } = data;

        const creatorIdStr = String(createdBy);
        const creatorData = onlineUsers.get(creatorIdStr);

        if(creatorData){
          
        io.to(creatorData.socketId).emit("updatedTodoNotification", {
          updatedBy: updatedBy,
          updatedData: updatedData,
          todoId: todoId,
        });
        console.log("user id are ", creatorData);
        console.log(
          "Updated todo Notification send successfully",
          creatorData.fullName 
        );
        }else{
           console.log("Creator is offline. CreatedBy ID:", creatorIdStr);
          console.log("Online users:", Array.from(onlineUsers.keys()));
        }

      } catch (error) {
        console.log("Error in todo notification send is ", error);
      }
    });

    socket.on("disconnect", () => {
      if (userId) {
        const userIdStr= String(userId)
        const userData = onlineUsers.get(userIdStr);
        
        onlineUsers.delete(userIdStr);

        console.log(" User Logged Out:", userData?.fullName);
        console.log("Total Online Users:", onlineUsers.size);

        io.emit(SOCKET_EVENTS.USER_ONLINE, Array.from(onlineUsers.keys()));
      }
    });
  });
};

export const getReceiverSocketId = (userId) => {
  const user = onlineUsers.get(userId);

  return user ? user.socketId : null;
};
