import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  address: z.string().trim().min(10, "Please provide a complete delivery address"),
  phone: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, "Please enter a valid Indian phone number"),
  paymentMethod: z.enum(["cod", "online"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart, getTotalAmount, getCartCount } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormData) => {
    if (data.paymentMethod === "online") {
      setShowQR(true);
      return;
    }

    await placeOrder(data);
  };

  const placeOrder = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("orders").insert({
        customer_name: data.name,
        customer_phone: data.phone,
        delivery_address: data.address,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.cartQuantity,
          preparationType: item.preparationType,
        })),
        total_amount: getTotalAmount(),
        status: "pending",
        preparation_type: cartItems[0]?.preparationType || "Dum",
        quantity: getCartCount(),
      });

      if (error) throw error;

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Your order will be delivered in 30-45 minutes. ${data.paymentMethod === "cod" ? "Cash on delivery." : "Payment confirmed."}`,
      });

      clearCart();
      reset();
      setShowCheckout(false);
      setShowQR(false);
      setIsOpen(false);
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

  const handlePaymentComplete = async () => {
    const formData = watch();
    await placeOrder(formData as CheckoutFormData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        {!showCheckout ? (
          <div className="mt-6 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.preparationType}`} className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.preparationType}</p>
                        <p className="text-sm font-bold text-primary">₹{item.price}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Quantity:</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.cartQuantity}
                        onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <p className="text-sm font-semibold">Subtotal: ₹{item.price * item.cartQuantity}</p>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{getTotalAmount()}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </>
            )}
          </div>
        ) : !showQR ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Enter your full name" className="mt-2" />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input id="address" {...register("address")} placeholder="Complete delivery address" className="mt-2" />
              {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone")} placeholder="+91 XXXXX XXXXX" className="mt-2" />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <Label>Payment Method</Label>
              <RadioGroup {...register("paymentMethod")} defaultValue="cod" className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="cursor-pointer">PhonePe (Online Payment)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total Amount:</span>
                <span>₹{getTotalAmount()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCheckout(false)} className="w-full">
                Back to Cart
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-bold mb-2">Scan to Pay via PhonePe</h3>
              <div className="bg-muted p-8 rounded-lg inline-block">
                <img
                  src="https://images.unsplash.com/photo-1603791239531-c1c89ffd9988?w=300&h=300&fit=crop"
                  alt="PhonePe QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-muted-foreground mt-4">Amount: ₹{getTotalAmount()}</p>
              <p className="text-sm text-muted-foreground mt-2">Scan this QR code with PhonePe app to complete payment</p>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowQR(false)} className="w-full">
                Back
              </Button>
              <Button onClick={handlePaymentComplete} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Processing..." : "Payment Complete"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
