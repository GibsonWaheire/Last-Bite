import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Package, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface PurchaseHistoryCardProps {
  id: string;
  foodName: string;
  store: string;
  quantity: number;
  price: number;
  purchaseDate: string;
  status: 'completed' | 'pending' | 'cancelled';
  image: string;
}

const PurchaseHistoryCard = ({ 
  id,
  foodName,
  store,
  quantity,
  price,
  purchaseDate,
  status,
  image
}: PurchaseHistoryCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-card transition-all duration-300 bg-gradient-card">
      <CardHeader className="p-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={image} 
              alt={foodName}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <Badge className={`absolute -top-2 -right-2 text-xs ${getStatusColor(status)}`}>
              {status}
            </Badge>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{foodName}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {store}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Package className="h-4 w-4 mr-1" />
                Qty: {quantity}
              </div>
              <div className="flex items-center text-lg font-bold text-fresh">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatCurrency(price)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Purchased: {formatDate(purchaseDate)}
          </div>
          <div className="text-xs">
            Order #{id.slice(-8)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseHistoryCard;
