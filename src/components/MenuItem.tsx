import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodItem } from "@/types/order";

interface MenuItemProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

export const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      <div className="relative overflow-hidden h-64">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
          ₹{item.price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-card-foreground mb-2">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-accent-foreground font-semibold flex items-center gap-1">
            <Clock className="w-4 h-4" />
            30-45 min
          </span>
          <Button 
            onClick={() => onAddToCart(item)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
