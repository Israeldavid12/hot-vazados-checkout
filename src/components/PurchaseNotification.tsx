import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const names = [
  "Rosa Chilengue",
  "João Macuácua",
  "Maria Tembe",
  "Carlos Mondlane",
  "Ana Sitoe",
  "Pedro Cossa",
  "Luísa Nhaca",
  "Fernando Mabjaia",
];

const PurchaseNotification = () => {
  const [currentName, setCurrentName] = useState(names[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentName(names[Math.floor(Math.random() * names.length)]);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 notification-slide">
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-success-foreground" />
        </div>
        <p className="text-sm text-foreground">
          <span className="font-semibold">{currentName}</span>{" "}
          <span className="text-muted-foreground">acabou de comprar</span>
        </p>
      </div>
    </div>
  );
};

export default PurchaseNotification;
