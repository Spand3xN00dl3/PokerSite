import { useState } from "react";
import { io } from "socket.io-client";

const socket = io.connect('http://localhost:4000');

function HomePage({ createRoom }) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="size-5/6 bg-emerald-600 flex justify-center items-center rounded-xl">
        <div className="w-[1000px] h-[600px] bg-emerald-500 flex flex-col gap-5 justify-center items-center rounded-lg shadow-lg">
          <div className="w-90 h-40 pt-[20px] mb-[30px] text-center text-8xl font-bold text-sky-800">Poker Site</div>
          <input placeholder="Username" className="w-80 h-10 px-4 rounded-lg shadow-lg"/>
          <input placeholder="Game ID" className="w-80 h-10 px-4 rounded-lg shadow-lg"/>
          <div className="flex flex-row gap-8 mt-6 mb-[60px]">
            <button className="bg-slate-500 rounded-full w-40 h-12 hover:outline shadow-lg">
              Join Room
            </button>
            <button onClick={createRoom} className="bg-slate-500 w-40 h-12 px4 py2 rounded-full hover:outline shadow-lg">
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateRoomPage({ onClick, goToGame }) {
  const [id, setId] = useState("No id");

  const askForID = () => {
    socket.timeout(5000).emit("send message", "hi there");
    socket.timeout(5000).emit("create id");
  };

  const onClickSocket = () => {
    // socket.emit('send message', {message: 'hello'});
  }

  return (
    <div className="flex flex-col">
      <div>create room page</div>
      <button onClick={onClick} className="hover:outline">back</button>
      <button onClick={askForID} className="hover:outline">socketio test button</button>
      <div>{id}</div>
      <button onClick={goToGame} className="hover:outline">go to table page</button>
    </div>
  );
}


function App() {
  const [pageState, setPageState] = useState("home");

  const createRoom = () => {
    setPageState("create room");
  }

  const back = () => {
    setPageState("home");
  }

  const goToGame = () => {
    setPageState("game");
  }

  let page = (<div>error</div>);

  if(pageState === "home") {
    page = (<HomePage createRoom={createRoom} />);
  } else if(pageState === "create room") {
    page = (<CreateRoomPage onClick={back} goToGame={goToGame}/>);
  } else if(pageState === "game") {
    page = (<GamePage></GamePage>)
  }

  return (
    <div className="bg-sky-600 h-screen w-screen">
      {page}
    </div>
  );
}

export default App;


function PlayerIcon() {
  return (
    <div className="size-[50px] bg-sky-300 text-sm rounded-full flex justify-center items-center shadow-md shadow-slate-800">
      Player
    </div>
  )
}

function PlayerInfo() {
  return (
    <div className="h-[70px] w-[50px] justify-center">
      <PlayerIcon />
      <div className="font-sans font-black, text-white text-xs flex justify-center items-center subpixel-antialiased">
        $56,450
      </div>
    </div>
  )
}

function PokerTable() {
  return (
    <div className="w-[425px] h-[225px] bg-amber-900 rounded-full flex justify-center items-center shadow-lg shadow-amber-950">
      <div className="w-[400px] h-[200px] bg-green-500 rounded-full flex justify-center items-center shadow-inner">
        <div className="flex gap-[450px] flex-row">
          <PlayerInfo />
          <PlayerInfo />
        </div>
      </div>
    </div>
  )
}

function GameArea({ players }) {
  // assumes players.length <= the max allowed # of players
  return (<PokerTable />);
}

function GamePage() {
  return (
    // <main className="h-screen bg-gradient-to-r from-slate-500 to-teal-300 flex justify-center items-center">
    <main className="h-screen bg-slate-500 flex flex-col justify-center items-center gap-[100px]">
      <GameArea />
      <StartGame />
    </main>
  );
}

function StartGame({ startGame, test }) {
  let end = "didn't work";
  
  if(test) {
    end = "worked";
  }

  return (
    <div className="flex gap-[10px] items-center">
      $
      <input type="number" className="h-[25px] w-[75px] text-center" step={100} defaultValue={1000}/>
      <button onClick={startGame} className="h-[50px] w-[150px] bg-blue-400 px-4 py-2 hover:outline rounded-full text-center">Start Game</button>
      {end}
    </div>
  );
}
