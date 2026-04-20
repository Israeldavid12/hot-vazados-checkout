import { Shield } from "lucide-react";

interface ProductInfoProps {
  productName: string;
  productDescription?: string;
  price: number;
  currency?: string;
  author?: string;
  imageUrl?: string;
}

const ProductInfo = ({
  productName,
  productDescription,
  price,
  currency = "MT",
  author,
  imageUrl,
}: ProductInfoProps) => {
  return (
    <div className="flex items-start gap-4 p-4">
      {imageUrl && (
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <img 
            src={imageUrl} 
            alt={productName} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Está a pagar:</p>
        <h2 className="font-bold text-foreground text-lg leading-tight">
          {productName}
        </h2>
        {productDescription && (
          <p className="text-sm text-muted-foreground">{productDescription}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">COMPRA 100% SEGURA</span>
          <Shield className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-bold text-primary mt-2">
          {price.toFixed(2)} {currency}
        </p>
        {author && (
          <p className="text-xs text-muted-foreground">Author: {author}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
