import React from 'react';
//import socketIO from "socket.io";


// const io = socketIO(3000);
var io = require('socket.io')(3000);
// io.on("connection", function() {
//     console.log("Server listening");

// })

const Sockets = () => {
   return (
		<div id="sockets-container">
		    <p>HELLO THIS IS SOCKETS</p>
		</div>
  );
}

export default Sockets;
