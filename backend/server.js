import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// game = {
//     gameID: (unique ID)
//     options: {
//         game settings (buy in, special rules, etc.)
//     }
//     players: {playerID: active}
//     active: boolean if game has been started
// }


const gameRooms = {};
// const waitingRooms = {};
const players = {} // clientID: socket connection

io.on("connection", (socket) => {
    socket.on("send message", (msg) => {
        console.log("message: " + msg);
    })
    socket.on("create game", (callback) => {
        const gameID = createID();
        gameRooms[gameID] = {
            gameID : gameID,
            players: {},
            active: false
        }
        gameRooms[gameID].players[socket.id] = false;
        socket.join(gameID);
        callback(gameID);
        console.log("game room created id: " + gameID + " by client: " + socket.id);
    })
    socket.on("join game", (gameID, callback) => {
        console.log("client attempting to join game: " + gameID);

        if(gameID in gameRooms) {
            gameRooms[gameID].players[socket.id] = false;
            socket.join(gameID);
            console.log("joined successfully");
            callback("success");
        } else {
            console.log("login failed"); 
            callback("failed");
        }
    })
    socket.on("start room", (gameID) => {
        console.log("start game msg recieved, game: " + gameID);
        gameRooms[gameID].active = true;
        Object.keys(gameRooms[gameID].players).forEach((playerID) => {
            gameRooms[gameID].players[playerID] = true;
            console.log("player: " + playerID + " set active");
        })
        socket.to(gameID).emit("game started");
    });
    socket.on("endTurn", (gameID, bet) => {
        // if lastBet - bet is negative, and bet is 0e
    })
    console.log('user connected id: ' + socket.id);
});

// io.on("create game room", (options, clientID) => {
//     // create new socketio room which will contain all clients in the game

//     // create a gameID
//     // update games with key gameID and`game info and user that created the game
// });

// io.on("test", () => {
//     let i = 0;

//     while(i < 10) {
//         console.log(guid());
//     }
// });

function createID() { // creates guid (unique ID code)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

httpServer.listen(4000, () => {
    console.log('Server running on port 4000');
});
