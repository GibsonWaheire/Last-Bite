import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star } from "lucide-react";

interface FoodCardProps {
  name: string;
  originalPrice: number;
  discountedPrice: number;
  expiryDate: string;
  store: string;
  category: string;
  image: string;
  stock: number;
}

const FoodCard = ({ 
  name, 
  originalPrice, 
  discountedPrice, 
  expiryDate, 
  store, 
  category, 
  image, 
  stock 
}: FoodCardProps) => {
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-bold">
            -{discount}%
          </Badge>
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center">
            <Clock className="h-3 w-3 mr-1 text-warm" />
            {daysUntilExpiry}d left
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
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-fresh">${discountedPrice}</span>
            <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {stock} left
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-gradient-accent hover:shadow-soft transition-all duration-300">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;