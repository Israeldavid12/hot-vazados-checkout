import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  initialMinutes?: number;
}

const CountdownTimer = ({ initialMinutes = 5 }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer-gradient py-3 px-4">
      <div className="container mx-auto flex items-center justify-between max-w-md">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 rounded-full p-2">
            <Clock className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-primary-foreground font-bold text-xl tracking-wider">
            00:{formatTime(timeLeft)}
          </span>
        </div>
        <div className="text-primary-foreground text-sm text-right leading-tight">
          <p className="font-medium">Garanta o preenchimento</p>
          <p className="text-primary-foreground/80 text-xs">dos seus dados dentro do tempo disponível.</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
