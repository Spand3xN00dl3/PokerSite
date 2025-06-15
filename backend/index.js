import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';


const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
    }
});

const rooms = {
    "test": {
        active: false,
        players: Array(8).fill(null),
        dealer_i: 0,
        current_i: 0,
        pot: 0.0,
    },
};

const players = {};

app.get('/', (req, res) => {
    res.send('root');
});

io.on('connection', (socket) => {
    console.log(`Socket: ${socket.id} has connected to the server`);

    socket.on('create-room', (name, callback) => {
        const roomID = generateUniqueId(20);
        // console.log(`current rooms: ${rooms}`)

        if(roomID in rooms) {
            callback({ error: `Error, room creation failed, try again` });
        }

        console.log(`Player "${socket.id}" creating room "${roomID}"`);
        players[socket.id] = {
            name: name
        };
        rooms[roomID] = {
            active: false,
            players: [{
                id: socket.id,
                stack: 1000.0
            }, ...Array(7).fill(undefined)],
            dealer_i: 0
        };
        socket.join(roomID);
        callback({ status: "success", roomID: roomID});
        // console.log('emitting')
        io.to(roomID).emit('player-joined');
    });

    socket.on('join-room', (name, roomID, callback) => {
        console.log(`Player "${socket.id}" attempting to join room "${roomID}"`);

        if(roomID in rooms) {
            let seat_i = 0;

            while(seat_i < rooms[roomID].players.length && rooms[roomID].players[seat_i]) {
                seat_i++;
            }

            if(seat_i == rooms[roomID].players.length) {
                console.log("Room is full");
                callback({ error: "Room is full" });
            } else {
                players[socket.id] = {
                    name: name
                };
                socket.join(roomID);
                rooms[roomID].players[seat_i] = {
                    id: socket.id,
                    stack: 1000.0
                };
                console.log("Successfully joined");
                callback({ status: "success" });
                io.to(roomID).emit('player-joined');
            }
        } else {
            console.log("Room doesn't exist");
            callback({ error: "Room doesn't exist" });
        }
    });

    const startRound = () => {
        
    };
    
    socket.on('start-room', (roomID) => {
        console.log(`starting room: ${roomID}`);
        rooms[roomID].active = true;
        io.to(roomID).emit('room-started');
        startRound();
    });

    socket.on('get-players', (roomID, callback) => {
        // console.log(`Rooms: ${JSON.stringify(rooms)}`);
        if(roomID in rooms) {
            callback({ players: rooms[roomID].players.map((player) => (
                player ? {
                    name: players[player.id].name,
                    stack: player.stack
                } :
                undefined
            ))});
        } else {
            // console.log(`roomid: ${roomID}`);
            callback({ error: "Room not found" });
        }
    });
});

server.listen(3000, () => {
    console.log('server running on port 3000');
});

function generateUniqueId(length = 21) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * chars.length);
    id += chars[rand];
  }
  return id;
}
