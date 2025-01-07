import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Card } from "./components/Card.js";
// import Card from "./Components/Card.js";
// import { PlayerContext } from "./PlayerContext.js";

const socket = io.connect('http://localhost:4000');

// Player object
// player = {
//   name: string
//      
// }


function HomePage({ setUsername, setGameID, joinRoom, createRoom, msg }) {
  const updateUsername = (e) => {
    setUsername(e.target.value);
  }
  const updateGameID = (e) => {
    setGameID(e.target.value);
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="size-5/6 bg-emerald-600 flex justify-center items-center rounded-xl">
        <div className="w-[1000px] h-[600px] bg-emerald-500 flex flex-col gap-5 justify-center items-center rounded-lg shadow-lg">
          <div className="w-90 h-40 pt-[20px] mb-[30px] text-center text-8xl font-bold text-sky-800">Poker Site</div>
          <input onChange={updateUsername} placeholder="Username" className="w-80 h-10 px-4 rounded-lg shadow-lg"/>
          <input onChange={updateGameID} placeholder="Game ID" className="w-80 h-10 px-4 rounded-lg shadow-lg"/>
          <div className="flex flex-row gap-8 mt-6 mb-[10px]">
            <button onClick={joinRoom} className="bg-slate-500 rounded-full w-40 h-12 hover:outline shadow-lg">
              Join Room
            </button>
            <button onClick={createRoom} className="bg-slate-500 w-40 h-12 px4 py2 rounded-full hover:outline shadow-lg">
              Create Room
            </button>
          </div>
          <label className="text-red-700 text-xl font-semibold">{msg}</label>
        </div>
      </div>
    </div>
  );
}

// function CreateRoomPage({ onClick, goToGame }) {
//   const askForID = () => {
//     socket.timeout(5000).emit("send message", "hi there");
//     socket.timeout(5000).emit("create id");
//   };
  

//   return (
//     <div className="flex flex-col">
//       <div>create room page</div>
//       <button onClick={onClick} className="hover:outline">back</button>
//       <button onClick={askForID} className="hover:outline">socketio test button</button>
//       <button onClick={goToGame} className="hover:outline">go to table page (create game)</button>
//     </div>
//   );
// }


function App() {
  const [pageState, setPageState] = useState("home");
  const [msg, setMsg] = useState("");
  const [gameID, setGameID] = useState("initial");
  const [username, setUsername] = useState("");

  const joinRoom = () => {
    socket.timeout(5000).emit("join game", gameID, (err, res) => {
      if(err) {
        setMsg("error joining");
      } else if(res === "failed") {
        setMsg("Game ID Does Not Exist");
      } else if(username === "") {
        setMsg("No Username Given");
      } else {
        setPageState("game");
      }
    })
  }

  const createRoom = () => {
    socket.timeout(5000).emit("create game", (err, id) => {
      if(err) {
        setMsg("Error, Could Not Create Game");
      } else if(username === "") {
        setMsg("No Username Given");
      } else {
        setGameID(id);
        setPageState("game");
      }
    })
  }

  const back = () => {
    setPageState("home");
  }

  let page = (<div>error</div>);

  if(pageState === "home") {
    page = (<HomePage setUsername={setUsername} setGameID={setGameID} joinRoom={joinRoom} createRoom={createRoom} msg={msg} />);
  // } else if(pageState === "create room") {
  //   page = (<CreateRoomPage onClick={back} goToGame={createGame} />);
  } else if(pageState === "game") {
    page = (<GamePage gameID={gameID} username={username} />);
  }

  return (
    <div className="bg-sky-600 h-screen w-screen">
      {page}
    </div>
  );
}

export default App;

function PlayerIcon({ username="" }) {
  return (
    <div className="size-[50px] bg-sky-300 text-sm rounded-full flex justify-center items-center shadow-md shadow-slate-800">
      {username}
    </div>
  )
}

function PlayerInfo({ username="", cards}) {
  // const = 
  useEffect(() => {
    socket.on("new turn");
  })
  return (
    <div>
      
    </div>
  )
  // return (
  //   <div className="h-[70px] w-[50px] justify-center outline">
  //     <PlayerIcon username={username} />
  //     <div className="font-sans font-black, text-white text-xs flex justify-center items-center subpixel-antialiased">
  //       $56,450
  //     </div>
  //     <div className="flex flex-row gap-[10px]">
  //       <Card rank={"10"} suit={"C"} />
  //       <Card />
  //     </div>
  //   </div>
  // )
}

function PokerTable({ username="" }) {
  return (
    <div className="w-[425px] h-[225px] bg-amber-900 rounded-full flex justify-center items-center shadow-lg shadow-amber-950">
      <div className="w-[400px] h-[200px] bg-green-500 rounded-full flex justify-center items-center shadow-inner">
        <div className="flex gap-[450px] flex-row">
          <PlayerInfo username={username} />
          <PlayerInfo username={username} />
        </div>
      </div>
    </div>
  )
}

function GameArea({ players }) {
  // assumes players.length <= the max allowed # of players
  return (<PokerTable />);
}

function GamePage({ gameID, username }) {
  // const [players, setPlayers] = 
  const [bottom, setBottom] = useState((<StartGameArea gameID={gameID} />));
  useEffect(() => {
    socket.on("game started", () => {
      setBottom((<BettingInterface />));
      socket.emit("send msg", "test")
    });

    return () => {
      socket.off("game started");
    }
  }, []);

  return (
    // <main className="h-screen bg-gradient-to-r from-slate-500 to-teal-300 flex justify-center items-center">
    <main className="h-screen bg-slate-500 flex flex-col justify-center items-center gap-[100px]">
      <GameArea />
      <label>{bottom}</label>
    </main>
  );
}

function BettingInterface() {
  return ("bet here");
}

function StartGameArea({ gameID }) {
  const [status, setStatus] = useState("df");
  const startGame = () => {
    socket.timeout(5000).emit("start game", gameID);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex fles-row gap-[10px] justify-center items-center">
        <label>Buy In: $</label>
        <input type="number" className="h-[25px] w-[75px] text-center" step={100} defaultValue={1000}/>
        <button onClick={startGame} className="h-[50px] w-[150px] bg-blue-400 px-4 py-2 hover:outline rounded-full text-center">Start Game</button>
      </div>
      <label>{gameID}</label>
      <label>{status}d</label>
    </div>
  );
}
