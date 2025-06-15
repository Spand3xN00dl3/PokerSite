import { useEffect, useState } from "react"
import { useParams } from "react-router"
import PlayingCard from "./components/PlayingCard";
import { socket } from "./socket";

export default function GamePage() {
  const { roomID } = useParams();
  const [players, setPlayers] = useState(Array(8).fill(undefined));
  const [started, setStarted] = useState(false);
  // console.log(`roomid: ${roomID}`);

  useEffect(() => {
    const getPlayers = async () => {
      try {
        const res = await socket.emitWithAck('get-players', roomID);

        if(res.error) {
          console.log(`Error: ${res.error}`)
        } else {
          setPlayers(res.players);
        }
      } catch(error) {
        console.log(`Connection Error: ${error}`);
      }
    };

    const setupRoom = () => {
      setStarted(true);
    }

    getPlayers();
    socket.on('player-joined', getPlayers);
    socket.on('room-started', setupRoom);

    return () => {
      socket.off('player-joined', getPlayers);
      socket.off('room-started', setupRoom);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-teal-600 flex items-center">
      <div className="relative outline outline-white w-350 h-200 flex items-center justify-center">
        {players.map((player, i) => (
          <Player key={i} pos={i} name={player ? player.name : undefined} />
        ))}
        <div className="w-200 h-100 rounded-full bg-[#80471C] flex items-center justify-center">
          <div className="w-190 h-90 rounded-full bg-green-700">
          </div>
        </div>
      </div>
      {started ?
        <BettingInterface /> :
        <OptionsBar roomID={roomID} />
      }
    </div>
  );
}

function BettingInterface() {
  return (
    <div className="h-full flex-1 bg-white">

    </div>
  );
}

function OptionsBar({ roomID }: { roomID?: string }) {
  return (
    <div className="h-full flex-1 flex items-center justify-center bg-emerald-700">
      <button
        onClick={() => socket.emit('start-room', roomID)}
        className="w-50 h-15 rounded-full bg-gray-500 border-1 border-black hover:border-white"
      >
        <p>Start Game</p>
      </button>
    </div>
  );
}

function Player({ pos=1, name }: {pos?: number, name?: string}) {
  const coordList = [[580, 30], [1035, 75], [1130, 320], [1035, 565], [580, 610], [125, 565], [30, 320], [125, 75]];
  // [1400, 800]
  const x = coordList[pos][0];
  const y = coordList[pos][1];
  // console.log(`name: ${!name}`);
  if(!name) {
    return (
      <div
        className="absolute w-60 h-40 border border-black flex items-center justify-center"
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        <p>Empty Seat</p>
      </div>
    );
  }

  return (
    <div
      className="absolute w-60 h-40 flex flex-col items-center"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="w-full h-30 flex flex-row">
        <div className="w-20 h-30 flex flex-col">
          <div className="size-20 rounded-full border-3 border-black flex items-center justify-center">
            <p className="text-md font-medium">
              Icon
            </p>
          </div>
          <div className="w-20 h-10 flex items-center justify-center ">
              <p className="text">{name}</p>
          </div>
        </div>

        <div className="w-full h-30 flex flex-row items-center justify-center gap-2 border border-red-500">
          <PlayingCard />
          <PlayingCard />
        </div>
      </div>
      <div className="w-full h-10 flex items-center justify-center">
        <div className="w-30 h-10 bg-white rounded-full flex items-center justify-center">
          <p className="text-lg font-medium">1000.00</p>
        </div>
      </div>
    </div>
  );
}
