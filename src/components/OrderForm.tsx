import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderSchema, OrderFormData } from "@/lib/validations/order";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FoodItem } from "@/types/order";

const PRODUCT_TYPES = ['Dum', 'Fry Piece', 'Lolipop', 'Rambo', 'Wings', 'Tandoori', 'Mixed', 'Arabian'];

interface OrderFormProps {
  foodItems: FoodItem[];
}

export const OrderForm = ({ foodItems }: OrderFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      products: [],
      quantity: 1,
      type: "Dum",
    },
  });

  const quantity = watch("quantity");
  const preparationType = watch("type");

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedProducts(options);
    setValue("products", options);
  };

  const calculateTotal = () => {
    const selectedItems = foodItems.filter(item => selectedProducts.includes(item.name));
    return selectedItems.reduce((total, item) => total + item.price, 0) * (quantity || 1);
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      const selectedItems = foodItems
        .filter(item => data.products.includes(item.name))
        .map(item => ({
          ...item,
          quantity: data.quantity,
          preparationType: data.type,
        }));

      const { error } = await supabase.from("orders").insert({
        customer_name: data.name,
        customer_phone: data.phone,
        delivery_address: data.address,
        items: selectedItems,
        quantity: data.quantity,
        preparation_type: data.type,
        total_amount: calculateTotal(),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Your order of ${data.products.join(", ")} will be delivered in 30-45 minutes. Cash on delivery.`,
      });

      reset();
      setSelectedProducts([]);
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="order" className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-3">Place Your Order</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        <p className="text-muted-foreground mt-4">Fill in the details and get your food delivered hot and fresh</p>
      </div>

      <div className="bg-card rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-bold">Full Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your full name"
              className="mt-2"
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-bold">Delivery Address</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="Complete delivery address"
              className="mt-2"
            />
            {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-bold">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+91 XXXXX XXXXX"
              className="mt-2"
            />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="products" className="text-sm font-bold">Select Dishes</Label>
              <select
                id="products"
                multiple
                value={selectedProducts}
                onChange={handleProductSelect}
                className="w-full mt-2 px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none transition-colors min-h-[120px] bg-background"
              >
                {foodItems.map(item => (
                  <option key={item.id} value={item.name}>
                    {item.name} - ₹{item.price}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple</p>
              {errors.products && <p className="text-destructive text-sm mt-1">{errors.products.message}</p>}
            </div>

            <div>
              <Label htmlFor="quantity" className="text-sm font-bold">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                min="1"
                className="mt-2"
              />
              {errors.quantity && <p className="text-destructive text-sm mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="type" className="text-sm font-bold">Preparation Style</Label>
            <Select
              value={preparationType}
              onValueChange={(value) => setValue("type", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select preparation style" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-destructive text-sm mt-1">{errors.type.message}</p>}
          </div>

          {selectedProducts.length > 0 && (
            <div className="bg-muted rounded-xl p-4">
              <p className="font-semibold text-foreground">Total Amount: ₹{calculateTotal()}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-bold py-6 text-lg"
          >
            {isSubmitting ? "Placing Order..." : "Place Order • Cash on Delivery"}
          </Button>

          <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-4">
            <p className="text-sm text-foreground text-center">
              🚚 <strong>Free Delivery</strong> • 💵 Cash on Delivery Only • ⏰ Delivery in 30-45 minutes
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
