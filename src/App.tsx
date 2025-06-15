import LoginPage from "./LoginPage";
import GamePage from "./GamePage";
import { Routes, Route } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/:roomID" element={<GamePage />} />
    </Routes>
  );
}
