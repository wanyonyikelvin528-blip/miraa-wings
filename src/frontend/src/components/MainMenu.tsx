import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/store/gameStore";
import {
  ArrowDown,
  ArrowUp,
  Keyboard,
  Leaf,
  MapPin,
  Plane,
  Trophy,
} from "lucide-react";

export function MainMenu() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 shadow-elevated border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-glow">
            <Plane className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-display text-foreground">
            Miraa Air Express
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            East African cargo delivery simulation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mission brief */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-foreground text-sm">
                  Destination
                </div>
                <div className="text-muted-foreground text-sm">
                  Mogadishu Airport, Somalia
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-success mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-foreground text-sm">
                  Cargo
                </div>
                <div className="text-muted-foreground text-sm">
                  150kg of fresh Miraa (Khat) — highly perishable
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-warning mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-foreground text-sm">
                  Objective
                </div>
                <div className="text-muted-foreground text-sm">
                  Deliver before spoilage. Faster delivery = higher score. Land
                  at Mogadishu for bonus points.
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Keyboard className="w-4 h-4" />
              Flight Controls
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 bg-muted/30 rounded px-3 py-2">
                <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border">
                  W
                </span>
                <span className="text-muted-foreground">Throttle Up</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded px-3 py-2">
                <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border">
                  S
                </span>
                <span className="text-muted-foreground">Throttle Down</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded px-3 py-2">
                <ArrowUp className="w-3.5 h-3.5" />
                <span className="text-muted-foreground">Pitch Up</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded px-3 py-2">
                <ArrowDown className="w-3.5 h-3.5" />
                <span className="text-muted-foreground">Pitch Down</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded px-3 py-2">
                <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border">
                  A
                </span>
                <span className="text-muted-foreground">Roll Left</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded px-3 py-2">
                <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border">
                  D
                </span>
                <span className="text-muted-foreground">Roll Right</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded px-3 py-2 col-span-2">
                <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border">
                  Space
                </span>
                <span className="text-muted-foreground">Brakes</span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gradient-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-smooth shadow-glow"
            onClick={startGame}
            data-ocid="menu.start_button"
          >
            <Plane className="w-5 h-5 mr-2" />
            Start Delivery
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
