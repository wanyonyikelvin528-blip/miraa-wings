import { GameCanvas } from "@/components/GameCanvas";
import { GameOver } from "@/components/GameOver";
import { HUD } from "@/components/HUD";
import { MainMenu } from "@/components/MainMenu";
import { useGameLoop } from "@/hooks/useGameLoop";

export default function App() {
  useGameLoop();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <GameCanvas />
      <HUD />
      <MainMenu />
      <GameOver />
    </div>
  );
}
