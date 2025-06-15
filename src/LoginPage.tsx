import { useState } from "react";
import { useNavigate } from "react-router";
import UserIcon from "./components/icons/UserIcon";
import KeyIcon from "./components/icons/KeyIcon";
import { socket } from "./socket";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomIDStatus, setRoomIDStatus] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    let valid: boolean = true;

    if(username.length < 5 || username.length > 15) {
      valid = false;
      setUsernameStatus("Username must be in between 5 and 15 characters long");
    }

    if(roomID) {
      if(roomID.includes(" ")) {
        valid = false;
        setRoomIDStatus("RoomID can't have a space in it");
      }
    } else {
      valid = false;
      setRoomIDStatus("roomID can't be empty");
    }
    
    if(valid) {
      try {
        socket.connect();
        const res: any = await socket.emitWithAck('create-room', username);

        if(res.error) {
          console.log(`Error: ${res.error}`);
        } else {
          navigate(`/${res.roomID}`);
        }
      } catch(error) {
        console.log(`Connection Error: ${error}`);
      }
    }
  };

  const handleJoinGame = async () => {
    try {
      socket.connect();
      const res: any = await socket.emitWithAck('join-room', username, roomID);

      if(res.error) {
        console.log(`Error: ${res.error}`);
      } else {
        console.log(`Status: ${res.status}`);
        navigate(`/${roomID}`);
      }
    } catch(error) {
      console.log(`Connection Error: ${error}`);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#020000] flex items-center justify-center">
      <div className="w-1/3 h-3/5 border-3 border-gray-500 rounded-lg flex flex-col items-center justify-top">
        <TitleBar />
        
        {/* Input Fields */}
        <div className="w-full h-1/3 flex flex-col items-center justify-center gap-10">
          <UsernameInput username={username} setUsername={setUsername} status={usernameStatus} />
          <RoomIDInput roomID={roomID} setRoomID={setRoomID} status={roomIDStatus} />
        </div>

        {/* Buttons */}
        <div className="w-full h-1/3 flex flex-row items-center justify-center gap-5">
          <button
            onClick={handleCreateGame}
            className="w-50 h-20 rounded-full bg-gray-500 hover:border-2 border-white"
          >
            <p className="text-white text-lg">Create Game</p>
          </button>
          <p className="text-white text-lg font-medium">
            -  OR  -
          </p>
          <button
            onClick={handleJoinGame}
            className="w-50 h-20 rounded-full bg-gray-500 hover:border-2 border-white"
          >
            <p className="text-white text-lg">Join Game</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function TitleBar() {
  return (
    <div className="w-full h-1/3 p-15">
      <p className="text-white text-center text-5xl text-center">Join Game</p>
    </div>
  );
}

function UsernameInput({username, setUsername, status}: {username: string, setUsername: (name: string) => void, status: string}) {
  return (
    <div className="w-1/2 h-15 flex flex-col">
      <div className="w-full h-10 border-b-3 border-gray-500 flex flex-row">
        <div className="w-15 h-10 flex items-center justify-center">
          <UserIcon />
        </div>
        <input
          className="flex-1 text-white align-bottom text-xl px-7"
          placeholder="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <p className="text-red-500 px-2">{status}</p>
    </div>
  );
}

function RoomIDInput({roomID, setRoomID, status}: {roomID: string, setRoomID: (id: string) => void, status: string}) {
  return (
    <div className="w-1/2 h-15 flex flex-col">
      <div className="w-full h-10 border-b-3 border-gray-500 flex flex-row">
        <div className="w-15 h-10 flex items-center justify-center">
          <KeyIcon />
        </div>
        <input
          className="flex-1 text-white align-bottom text-xl px-7"
          placeholder="room id"
          value={roomID}
          onChange={(event) => setRoomID(event.target.value)}
        />
      </div>
      <p className="text-red-500 px-2">{status}</p>
    </div>
  );
}
