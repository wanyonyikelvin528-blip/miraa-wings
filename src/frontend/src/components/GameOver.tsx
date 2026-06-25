import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/store/gameStore";
import {
  AlertTriangle,
  CheckCircle,
  Home,
  Leaf,
  MapPin,
  Plane,
  RotateCcw,
  Timer,
  Trophy,
} from "lucide-react";

export function GameOver() {
  const state = useGameStore();
  const resetGame = useGameStore((s) => s.resetGame);
  const startGame = useGameStore((s) => s.startGame);

  if (
    state.phase !== "landed" &&
    state.phase !== "crashed" &&
    state.phase !== "delivered"
  ) {
    return null;
  }

  const isSuccess = state.phase === "delivered" || state.phase === "landed";
  const isCrashed = state.phase === "crashed";

  const deliveryTime = state.endTime
    ? (state.endTime - state.startTime) / 1000
    : state.gameTime;
  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate score breakdown
  const timeBonus = Math.max(0, 300 - deliveryTime) * 2;
  const freshnessBonus = state.cargoFreshness * 5;
  const landingBonus = state.landedAtMogadishu ? 500 : 0;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-elevated border-border/50">
        <CardHeader className="text-center pb-2">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isSuccess
                ? "bg-success/20 shadow-[0_0_20px_oklch(0.6_0.16_150/0.3)]"
                : isCrashed
                  ? "bg-destructive/20 shadow-[0_0_20px_oklch(0.55_0.22_25/0.3)]"
                  : "bg-warning/20"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="w-8 h-8 text-success" />
            ) : isCrashed ? (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            ) : (
              <Plane className="w-8 h-8 text-warning" />
            )}
          </div>
          <CardTitle className="text-2xl font-display text-foreground">
            {isSuccess
              ? "Delivery Complete!"
              : isCrashed
                ? "Aircraft Lost"
                : "Flight Ended"}
          </CardTitle>
          <Badge
            variant="outline"
            className={`mx-auto mt-2 ${
              isSuccess
                ? "bg-success/20 text-success border-success/30"
                : isCrashed
                  ? "bg-destructive/20 text-destructive border-destructive/30"
                  : "bg-warning/20 text-warning border-warning/30"
            }`}
            data-ocid="gameover.status_badge"
          >
            {state.landedAtMogadishu
              ? "Landed at Mogadishu"
              : isCrashed
                ? "Crashed"
                : "Incomplete"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Timer className="w-4 h-4" />
                Delivery Time
              </div>
              <span className="font-mono font-semibold text-foreground">
                {formatTime(deliveryTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Leaf className="w-4 h-4" />
                Cargo Freshness
              </div>
              <span
                className={`font-mono font-semibold ${
                  state.cargoFreshness > 70
                    ? "text-success"
                    : state.cargoFreshness > 40
                      ? "text-warning"
                      : "text-destructive"
                }`}
              >
                {Math.round(state.cargoFreshness)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                Landed at Mogadishu
              </div>
              <span
                className={`font-semibold ${
                  state.landedAtMogadishu
                    ? "text-success"
                    : "text-muted-foreground"
                }`}
              >
                {state.landedAtMogadishu ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Score breakdown */}
          {isSuccess && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">
                Score Breakdown
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Bonus</span>
                  <span className="font-mono">+{Math.floor(timeBonus)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Freshness Bonus</span>
                  <span className="font-mono">
                    +{Math.floor(freshnessBonus)}
                  </span>
                </div>
                {state.landedAtMogadishu && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Landing Bonus</span>
                    <span className="font-mono text-success">
                      +{landingBonus}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-warning" />
                    Total Score
                  </span>
                  <span className="font-mono font-bold text-xl text-primary">
                    {state.score.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isCrashed && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" />
                Mission Failed
              </div>
              <p className="text-destructive/80">
                {state.altitude > 50
                  ? "Aircraft stalled at high altitude. Maintain speed above 45 km/h when flying."
                  : "Aircraft crashed on the ground. Reduce speed before landing."}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={resetGame}
              data-ocid="gameover.home_button"
            >
              <Home className="w-4 h-4 mr-2" />
              Main Menu
            </Button>
            <Button
              className="flex-1 gradient-primary text-primary-foreground hover:opacity-90"
              onClick={startGame}
              data-ocid="gameover.restart_button"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Fly Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
