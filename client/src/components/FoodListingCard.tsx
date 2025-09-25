import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, ShoppingCart, Zap, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useCartActions } from "@/contexts/CartContext";
import { useState, useEffect } from "react";

interface FoodListingCardProps {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  expiryDate: string;
  store: string;
  category: string;
  image: string;
  stock: number;
  description?: string;
  onAddToCart?: (id: string) => void;
}

const FoodListingCard = ({
  id,
  name,
  originalPrice,
  discountedPrice,
  expiryDate,
  store,
  category,
  image,
  stock,
  description,
  onAddToCart
}: FoodListingCardProps) => {
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const { addToCart } = useCartActions();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [urgencyLevel, setUrgencyLevel] = useState<"critical" | "urgent" | "soon" | "normal">("normal");

  // Calculate urgency level and time left
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diffMs = expiry.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeLeft("EXPIRED");
        setUrgencyLevel("critical");
        return;
      }

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const remainingHours = diffHours % 24;

      if (diffDays === 0) {
        if (remainingHours <= 1) {
          setTimeLeft(`${remainingHours}h left`);
          setUrgencyLevel("critical");
        } else {
          setTimeLeft(`${remainingHours}h left`);
          setUrgencyLevel("urgent");
        }
      } else if (diffDays === 1) {
        setTimeLeft(`${diffDays}d ${remainingHours}h left`);
        setUrgencyLevel("urgent");
      } else if (diffDays <= 3) {
        setTimeLeft(`${diffDays}d left`);
        setUrgencyLevel("soon");
      } else {
        setTimeLeft(`${diffDays}d left`);
        setUrgencyLevel("normal");
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [expiryDate]);

  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case "critical":
        return "bg-red-500 text-white";
      case "urgent":
        return "bg-orange-500 text-white";
      case "soon":
        return "bg-yellow-500 text-black";
      case "normal":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getUrgencyIcon = () => {
    switch (urgencyLevel) {
      case "critical":
        return <AlertTriangle className="h-3 w-3" />;
      case "urgent":
        return <Zap className="h-3 w-3" />;
      case "soon":
        return <Clock className="h-3 w-3" />;
      case "normal":
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const isFlashSale = urgencyLevel === "critical" || (urgencyLevel === "urgent" && timeLeft.includes("h"));

  const handleAddToCart = () => {
    const cartItem = {
      id,
      name,
      originalPrice,
      discountedPrice,
      store,
      image,
      category,
      expiryDate,
      stock
    };

    addToCart(cartItem);

    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card animate-in fade-in-0 slide-in-from-bottom-4">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-bold animate-in zoom-in-50 duration-300">
            -{discount}%
          </Badge>
          
          {/* Flash Sale Badge */}
          {isFlashSale && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white font-bold animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              FLASH SALE
            </Badge>
          )}
          
          {/* Prominent Countdown Timer */}
          <div className={`absolute bottom-3 right-3 ${getUrgencyColor()} backdrop-blur-sm rounded-full px-3 py-2 text-sm font-bold flex items-center animate-in slide-in-from-right-2 duration-300`}>
            {getUrgencyIcon()}
            <span className="ml-1">{timeLeft}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {store}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-fresh">{formatCurrency(discountedPrice)}</span>
            <span className="text-sm text-muted-foreground line-through">{formatCurrency(originalPrice)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {stock} left
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-gradient-accent hover:shadow-soft transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodListingCard;
