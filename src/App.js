import { useState } from "react";

function HomePage({ joinRoom, createRoom }) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-row gap-[50px]">
        <button onClick={joinRoom} className="hover:outline">
          Join Room
        </button>
        <button onClick={createRoom} className="hover:outline">
          Create Room
        </button>
      </div>
    </div>
  );
}

function JoinRoomPage({ onClick }) {
  return (
    <div className="flex flex-col">
      <div>join room page</div>
      <button onClick={onClick} className="hover:outline">back</button>
    </div>
  )
}

function CreateRoomPage({ onClick }) {
  return (
    <div className="flex flex-col">
      <div>create room page</div>
      <button onClick={onClick} className="hover:outline">back</button>
    </div>
  )
}

function App() {
  const [pageState, setPageState] = useState("home");

  const joinRoom = () => {
    console.log('join room button clicked')
    setPageState("join room");
  }

  const createRoom = () => {
    setPageState("create room");
  }

  const back = () => {
    setPageState("home");
  }

  let page = (<div>error</div>);

  if(pageState === "home") {
    page = (<HomePage joinRoom={joinRoom} createRoom={createRoom} />);
  } else if(pageState === "join room") {
    page = (<JoinRoomPage onClick={back} />);
  } else if(pageState === "create room") {
    page = (<CreateRoomPage onClick={back} />);
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
        <div className="flex gap-[125px] flex-row">
          <PlayerInfo />
          <PlayerIcon />
          <PlayerIcon />
          <PlayerIcon />
        </div>
      </div>
    </div>
  )
}

function Home() {
  return (
    // <main className="h-screen bg-gradient-to-r from-slate-500 to-teal-300 flex justify-center items-center">
    <main className="h-screen bg-slate-500 flex justify-center items-center">
      <PokerTable />
    </main>
  );
}
