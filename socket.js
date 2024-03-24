const { Server } = require("socket.io");
let IO;

module.exports.initIO = (httpServer) => {
  IO = new Server(httpServer);

  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      socket.user = callerId;
      next();
    }
  });

  IO.on("connection", (socket) => {
    console.log(socket.user, "Connected");
    socket.join(socket.user);


    socket.on("ICEcandidate", (data) => {
      let userFromId = data.fromId;
      let userToId = data.toId;

      let candidate = data.iceCandidate;
      console.log("ICEcandidate", "from " + userFromId + " to " + userToId + " type " + candidate);

      socket.to(userToId).emit("ICEcandidate", {
        fromId: userFromId,
        toId: userToId,
        iceCandidate: candidate
      });
    });

    socket.on("send", (data) => {
      let userFromId = data.fromId;
      let userToId = data.toId;
      console.log("send ", "from " + userFromId + " to " + userToId);
      socket.to(userToId).emit("send", {
        fromId: userFromId,
        toId: userToId,
      });
    });

    socket.on("cancel", (data) => {
      let userFromId = data.fromId;
      let userToId = data.toId;

      console.log("canncel ", "from " + userFromId + " to " + userToId);
      socket.to(userToId).emit("cancel", {
        fromId: userFromId,
        toId: userToId
      });
    });

    socket.on("accept", (data) => {
      let userFromId = data.fromId;
      let userToId = data.toId;

      console.log("accept ", "from " + userFromId + " to " + userToId);
      socket.to(userToId).emit("accept", {
        fromId: userFromId,
        toId: userToId,
      });

    });

    socket.on("sdpOffer", (data) => {
      let userFromId = data.fromId;
      let userToId = data.toId;
      let sdp = data.sdp;
      console.log("sdp Offer", sdp);
      socket.to(userToId).emit("sdpOffer", {
        fromId: userFromId,
        toId: userToId,
        sdp: sdp

      })
    });

    socket.on("sdpAnswer", (data) => {
      let userFromId = data.fromId;
      let userToId = data.toId;
      let sdp = data.sdp;
      console.log("sdp Answer", sdp);
      socket.to(userToId).emit("sdpAnswer", {
        fromId: userFromId,
        toId: userToId,
        sdp: sdp

      })
    });
  });
}

module.exports.getIO = () => {
  if (!IO) {
    throw Error("IO not initilized.");
  } else {
    return IO;
  }
};

