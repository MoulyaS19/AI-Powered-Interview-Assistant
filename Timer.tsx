import { useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  onTimeUp: () => void;
}

export function Timer({ timeLeft, totalTime, onTimeUp }: TimerProps) {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const percentage = (timeLeft / totalTime) * 100;
  const isWarning = percentage <= 30;
  const isDanger = percentage <= 10;

  return (
    <div className="mb-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isDanger ? "text-destructive" : isWarning ? "text-warning" : "text-muted-foreground"}`} />
          <span className="font-medium">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">{totalTime}s total</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isDanger ? "bg-destructive" : isWarning ? "bg-warning" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}