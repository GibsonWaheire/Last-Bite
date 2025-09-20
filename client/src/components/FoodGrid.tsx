import FoodCard from "./FoodCard";
import breadImage from "@/assets/bread.jpg";
import vegetablesImage from "@/assets/vegetables.jpg";
import dairyImage from "@/assets/dairy.jpg";

const FoodGrid = () => {
  const mockFoodItems = [
    {
      name: "Artisan Sourdough Bread",
      originalPrice: 8.99,
      discountedPrice: 3.99,
      expiryDate: "2024-12-22",
      store: "Baker's Corner",
      category: "Bakery",
      image: breadImage,
      stock: 12
    },
    {
      name: "Organic Mixed Vegetables",
      originalPrice: 12.99,
      discountedPrice: 5.99,
      expiryDate: "2024-12-23",
      store: "Green Grocer",
      category: "Produce",
      image: vegetablesImage,
      stock: 8
    },
    {
      name: "Premium Dairy Bundle",
      originalPrice: 15.99,
      discountedPrice: 7.99,
      expiryDate: "2024-12-25",
      store: "Farm Fresh",
      category: "Dairy",
      image: dairyImage,
      stock: 15
    },
    {
      name: "Whole Grain Pastries",
      originalPrice: 6.99,
      discountedPrice: 2.99,
      expiryDate: "2024-12-21",
      store: "Baker's Corner",
      category: "Bakery", 
      image: breadImage,
      stock: 6
    },
    {
      name: "Seasonal Fruit Mix",
      originalPrice: 9.99,
      discountedPrice: 4.99,
      expiryDate: "2024-12-24",
      store: "Green Grocer",
      category: "Produce",
      image: vegetablesImage,
      stock: 20
    },
    {
      name: "Gourmet Cheese Selection",
      originalPrice: 18.99,
      discountedPrice: 8.99,
      expiryDate: "2024-12-26",
      store: "Farm Fresh",
      category: "Dairy",
      image: dairyImage,
      stock: 4
    }
  ];

  return (
    <section className="py-16 bg-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Today's Food Rescues
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh, quality food at incredible prices. Help us reduce waste while you save money on your groceries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFoodItems.map((item, index) => (
            <FoodCard key={index} {...item} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="text-fresh font-semibold hover:underline">
            View All Available Food →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FoodGrid;