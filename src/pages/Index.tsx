import CountdownTimer from "@/components/CountdownTimer";
import PaymentBanner from "@/components/PaymentBanner";
import ProductInfo from "@/components/ProductInfo";
import CheckoutForm from "@/components/CheckoutForm";
import PurchaseNotification from "@/components/PurchaseNotification";

const Index = () => {
  const product = {
    name: "Grupo secreto de vazados",
    description: "Grupo secreto de vazados",
    price: 250.0,
    currency: "MT",
    author: "Grupo secreto de vazados",
  };

  const handlePaymentSuccess = () => {
    console.log("Payment successful!");
  };

  return (
    <div className="min-h-screen bg-background">
      <CountdownTimer initialMinutes={5} />
      
      <main className="container mx-auto max-w-md px-4 py-6 space-y-6">
        <PaymentBanner />
        
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <ProductInfo
            productName={product.name}
            productDescription={product.description}
            price={product.price}
            currency={product.currency}
            author={product.author}
          />
          
          <div className="px-4 pb-6">
            <CheckoutForm
              productName={product.name}
              price={product.price}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
        
        <footer className="text-center py-4 space-y-1">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <span className="font-bold text-foreground">
              Dr Joa silva
            </span>{" "}
            © 2025 · Todos os direitos reservados ·
          </p>
          <a href="#" className="text-sm text-secondary hover:underline">
            Dúvidas sobre este produto
          </a>
        </footer>
      </main>
      
      <PurchaseNotification />
    </div>
  );
};

export default Index;
