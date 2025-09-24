import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const FoodCardSkeleton = () => {
  return (
    <Card className="bg-gradient-card">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  );
};

const PurchaseCardSkeleton = () => {
  return (
    <Card className="bg-gradient-card">
      <CardHeader className="p-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

const FormSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};

export { FoodCardSkeleton, PurchaseCardSkeleton, FormSkeleton };
