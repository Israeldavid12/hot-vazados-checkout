import { cn } from "@/lib/utils";

type PaymentMethod = "mpesa" | "emola";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ selected, onSelect }: PaymentMethodSelectorProps) => {
  const methods = [
    {
      id: "emola" as PaymentMethod,
      name: "e-Mola",
      bgColor: "bg-secondary",
      borderColor: "border-secondary",
      textColor: "text-secondary",
      hoverBg: "hover:bg-secondary/10",
    },
    {
      id: "mpesa" as PaymentMethod,
      name: "M-Pesa",
      bgColor: "bg-primary",
      borderColor: "border-primary",
      textColor: "text-primary",
      hoverBg: "hover:bg-primary/10",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Selecione um método de pagamento
      </p>
      <div className="flex gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 border-2",
              selected === method.id
                ? `${method.bgColor} text-white ${method.borderColor}`
                : `bg-card ${method.textColor} ${method.borderColor} ${method.hoverBg}`
            )}
          >
            {method.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
