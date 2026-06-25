import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGameStore } from "@/store/gameStore";
import {
  CircleDot,
  Gauge,
  Leaf,
  MapPin,
  Mountain,
  Plane,
  Timer,
} from "lucide-react";

export function HUD() {
  const state = useGameStore();

  if (state.phase === "menu") return null;

  const formatSpeed = (s: number) => Math.round(s * 3.6);
  const formatAltitude = (a: number) => Math.round(a);
  const formatDistance = (d: number) => Math.round(d / 10) / 100;
  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const _getFreshnessColor = (freshness: number) => {
    if (freshness > 70) return "bg-success";
    if (freshness > 40) return "bg-warning";
    return "bg-destructive";
  };

  const getFreshnessStatus = (freshness: number) => {
    if (freshness > 70) return "Fresh";
    if (freshness > 40) return "Spoiling";
    return "Spoiled";
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "playing":
        return "In Flight";
      case "landed":
        return "Landed";
      case "crashed":
        return "Crashed";
      case "delivered":
        return "Delivered";
      default:
        return phase;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "playing":
        return "bg-primary";
      case "landed":
        return "bg-success";
      case "crashed":
        return "bg-destructive";
      case "delivered":
        return "bg-success";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Top bar - Phase and basic info */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`${getPhaseColor(state.phase)} text-white border-0 px-3 py-1`}
            data-ocid="hud.phase_badge"
          >
            <Plane className="w-3 h-3 mr-1" />
            {getPhaseLabel(state.phase)}
          </Badge>
          <div className="flex items-center gap-1.5 text-foreground/80 text-sm font-mono">
            <Timer className="w-3.5 h-3.5" />
            {formatTime(state.gameTime)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {state.isBraking && (
            <Badge
              variant="outline"
              className="bg-destructive/20 text-destructive border-destructive/30"
              data-ocid="hud.brake_indicator"
            >
              <CircleDot className="w-3 h-3 mr-1" />
              Braking
            </Badge>
          )}
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Cargo</div>
            <div className="text-sm font-semibold text-foreground">
              {state.cargoName}
            </div>
          </div>
        </div>
      </div>

      {/* Left panel - Flight instruments */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {/* Speed */}
        <div
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 min-w-[140px]"
          data-ocid="hud.speed_panel"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Gauge className="w-3.5 h-3.5" />
            Speed
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            {formatSpeed(state.speed)}
            <span className="text-sm text-muted-foreground ml-1">km/h</span>
          </div>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${Math.min(100, (state.speed / 350) * 100)}%` }}
            />
          </div>
        </div>

        {/* Altitude */}
        <div
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 min-w-[140px]"
          data-ocid="hud.altitude_panel"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Mountain className="w-3.5 h-3.5" />
            Altitude
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            {formatAltitude(state.altitude)}
            <span className="text-sm text-muted-foreground ml-1">m</span>
          </div>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{
                width: `${Math.min(100, (state.altitude / 3000) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Distance */}
        <div
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 min-w-[140px]"
          data-ocid="hud.distance_panel"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <MapPin className="w-3.5 h-3.5" />
            Distance
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            {formatDistance(state.distanceRemaining)}
            <span className="text-sm text-muted-foreground ml-1">km</span>
          </div>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{
                width: `${((state.totalDistance - state.distanceRemaining) / state.totalDistance) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Right panel - Cargo freshness */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 min-w-[160px]"
          data-ocid="hud.freshness_panel"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <Leaf className="w-3.5 h-3.5" />
            Cargo Freshness
          </div>
          <div className="text-2xl font-mono font-bold text-foreground mb-2">
            {Math.round(state.cargoFreshness)}%
          </div>
          <Progress
            value={state.cargoFreshness}
            className="h-2"
            data-ocid="hud.freshness_bar"
          />
          <div className="mt-2 flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                state.cargoFreshness > 70
                  ? "text-success"
                  : state.cargoFreshness > 40
                    ? "text-warning"
                    : "text-destructive"
              }`}
            >
              {getFreshnessStatus(state.cargoFreshness)}
            </span>
            <span className="text-xs text-muted-foreground">
              {state.cargoWeight}kg
            </span>
          </div>
        </div>
      </div>

      {/* Bottom center - Score */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-6 py-2"
          data-ocid="hud.score_panel"
        >
          <div className="text-xs text-muted-foreground text-center">Score</div>
          <div className="text-2xl font-mono font-bold text-primary text-center">
            {state.score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Bottom right - Controls hint */}
      {state.phase === "playing" && state.gameTime < 5 && (
        <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 text-xs text-muted-foreground">
          <div className="font-semibold text-foreground mb-1">Controls</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <span>W / S</span>
            <span>Throttle</span>
            <span>↑ / ↓</span>
            <span>Pitch</span>
            <span>A / D</span>
            <span>Roll</span>
            <span>Space</span>
            <span>Brakes</span>
          </div>
        </div>
      )}
    </div>
  );
}
