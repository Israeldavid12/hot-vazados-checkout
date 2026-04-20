import paymentBanner from "@/assets/payment-banner.png";

const PaymentBanner = () => {
  return (
    <div className="w-full bg-card rounded-xl overflow-hidden shadow-lg border border-border">
      <img 
        src={paymentBanner} 
        alt="Métodos de pagamento - e-Mola, M-Pesa, Banco de Moçambique, 100% Secure Payment" 
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default PaymentBanner;
