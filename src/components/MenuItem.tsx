import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FoodItem } from "@/types/order";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const PRODUCT_TYPES = ['Dum', 'Fry Piece', 'Lolipop', 'Rambo', 'Wings', 'Tandoori', 'Mixed', 'Arabian'];

interface MenuItemProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

export const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [preparationType, setPreparationType] = useState("Dum");

  const handleAddToCart = () => {
    addToCart(item, quantity, preparationType);
    toast({
      title: "Added to Cart!",
      description: `${quantity}x ${item.name} (${preparationType}) added to cart.`,
    });
    setIsOpen(false);
    setQuantity(1);
    setPreparationType("Dum");
  };

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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                Add to Cart
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {item.name} to Cart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Preparation Style</Label>
                  <Select value={preparationType} onValueChange={setPreparationType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="font-semibold">Total: ₹{item.price * quantity}</p>
                </div>
                <Button onClick={handleAddToCart} className="w-full">
                  Add to Cart
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
