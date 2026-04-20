import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { set } from "date-fns";
import { useSearchParams } from "react-router-dom";


const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().trim().min(9, "Contacto inválido").max(9, "Máximo 9 dígitos"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  productName: string;
  price: number;
  onSuccess?: () => void;

}





const CheckoutForm = ({ productName, price, onSuccess }: CheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "emola" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const fbc = searchParams.get("fbc");
  const fbp = searchParams.get("fbp");


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const phone = watch("phone");

  useEffect(() => {
    if (phone && paymentMethod) {
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length >= 2) {
        if (paymentMethod === "mpesa" && !cleanPhone.startsWith("84") && !cleanPhone.startsWith("85")) {
          setPhoneError("M-Pesa: número deve começar com 84 ou 85");
        } else if (paymentMethod === "emola" && !cleanPhone.startsWith("86") && !cleanPhone.startsWith("87")) {
          setPhoneError("e-Mola: número deve começar com 86 ou 87");
        } else {
          setPhoneError(null);
        }
      } else {
        setPhoneError(null);
      }
    } else {
      setPhoneError(null);
    }
  }, [phone, paymentMethod]);

  const getMethodName = () => {
    if (paymentMethod === "mpesa") return "M-Pesa";
    if (paymentMethod === "emola") return "e-Mola";
    return "";
  };

  const getPhonePlaceholder = () => {
    if (paymentMethod === "mpesa") return "84XXXXXXX ou 85XXXXXXX";
    if (paymentMethod === "emola") return "86XXXXXXX ou 87XXXXXXX";
    return "Número de telefone";
  };

  const validatePhoneForMethod = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (paymentMethod === "mpesa") {
      return cleanPhone.startsWith("84") || cleanPhone.startsWith("85");
    }
    if (paymentMethod === "emola") {
      return cleanPhone.startsWith("86") || cleanPhone.startsWith("87");
    }
    return true;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!paymentMethod) {
      toast.error("Por favor, selecione um método de pagamento");
      return;
    }

    if (!validatePhoneForMethod(data.phone)) {
      if (paymentMethod === "mpesa") {
        toast.error("Para M-Pesa, o número deve começar com 84 ou 85");
      } else {
        toast.error("Para e-Mola, o número deve começar com 86 ou 87");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Payment request:", {
        ...data,
        amount: price,
        payment_number: `258${data.phone}`,
        reference: `ORDER-${Date.now()}`,
        product_name: productName,
        buyer_name: data.name,
        method: paymentMethod,
        product_id: 218
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Pagamento iniciado! Verifique seu telefone.");
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonStyles = () => {
    if (!paymentMethod) {
      return "bg-muted text-muted-foreground";
    }
    if (paymentMethod === "mpesa") {
      return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
    return "bg-secondary hover:bg-secondary/90 text-secondary-foreground";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    setValue("phone", value);
  };


  const MakePaymentRequest = async () => {
    try {
      setIsSubmitting(true);
      const token_request = await axios.post('https://payment.droopay.com/api/oauth/token', {
        client_id: 'c0f280e4-7e71-4711-ae4c-745dba742d17',
        client_secret: 'pY2c_jToRW4GXpK7B8HXM',
      })

      const token = token_request.data.access_token;

      const apiurl = paymentMethod === 'mpesa' ? 'https://payment.droopay.com/api/open/payment/mpesa/live' : 'https://payment.droopay.com/api/open/payment/v1/emola/live';

      const response = await axios.post(apiurl, {
        amount: 247,
        payment_number: phone,
        product_name: productName,
        buyer_name: watch("name"),
        buyer_email: watch("email"),
        product_id: 218,
        fbc,
        fbp
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(response)

      window.location.href = 'https://moz-offer.vercel.app/transforma/upsell1/index.html'
      return

    } catch (error) {
      console.error("Payment request failed:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground font-medium">
          Seu nome <span className="text-primary">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Insira seu nome"
          className="h-12 border-border focus:border-primary bg-card"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">
          E-mail <span className="text-primary">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Insira seu e-mail"
          className="h-12 border-border focus:border-primary bg-card"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-medium">
          Contacto <span className="text-primary">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Insira seu celular"
          className="h-12 border-border focus:border-primary bg-card"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <PaymentMethodSelector
        selected={paymentMethod}
        onSelect={setPaymentMethod}
      />

      {paymentMethod && (
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            Número {getMethodName()} <span className="text-primary">*</span>
          </Label>
          <div className="flex items-center h-12 border border-border rounded-lg overflow-hidden bg-card focus-within:ring-2 focus-within:ring-ring">
            <span className="px-3 text-foreground font-medium bg-muted h-full flex items-center border-r border-border">
              +258
            </span>
            <input
              type="tel"
              placeholder={getPhonePlaceholder()}
              value={phone || ""}
              onChange={handlePhoneChange}
              className="flex-1 h-full px-3 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              maxLength={9}
            />
          </div>
          {phoneError && (
            <p className="text-sm text-destructive">{phoneError}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !paymentMethod || !!phoneError}
        className={`w-full h-14 text-lg font-medium rounded-lg ${getButtonStyles()}`}
        onClick={MakePaymentRequest}
      >
        {isSubmitting
          ? "Processando..."
          : paymentMethod
            ? `Pagar com ${getMethodName()}`
            : "Selecione um método"
        }
      </Button>
    </form>
  );
};

export default CheckoutForm;
