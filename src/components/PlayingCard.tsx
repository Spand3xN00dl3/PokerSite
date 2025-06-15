export default function PlayingCard({ rank="", suit="" }: { rank?:  string, suit?: string }) {
  return (
    <>
      {(rank && suit) ?
        <img src="/cards/queen_of_diamonds.svg" className="h-20" /> :
        <div className="w-14.5 h-20 bg-white border border-black" />            
      }
    </>
  );
}
