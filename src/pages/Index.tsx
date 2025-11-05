import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MenuItem } from "@/components/MenuItem";
import { OrderForm } from "@/components/OrderForm";
import { OrderHistory } from "@/components/OrderHistory";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { FoodItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const { toast } = useToast();
  const [showOrders, setShowOrders] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  const foodItems: FoodItem[] = [
    { 
      id: 1, 
      name: 'Biriyanis', 
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
      description: 'Aromatic rice with tender meat and authentic spices',
      price: 250
    },
    { 
      id: 2, 
      name: 'Thalis', 
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
      description: 'Complete meal with rice, curries, and sides',
      price: 180
    },
    { 
      id: 3, 
      name: 'Mandis', 
      image: 'https://images.unsplash.com/photo-1633945274605-562d9e88008c?w=600',
      description: 'Traditional Arabian rice dish with roasted meat',
      price: 300
    }
  ];

  const handleAddToCart = (item: FoodItem) => {
    toast({
      title: "Added to selection!",
      description: `${item.name} can be ordered in the form below.`,
    });
    
    // Smooth scroll to order form
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />
      <Navigation onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-12">
        {/* Menu Section */}
        <section id="menu" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-foreground mb-3">Our Specialties</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Indulge in authentic flavors crafted with premium ingredients and traditional recipes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {foodItems.map(item => (
              <MenuItem 
                key={item.id} 
                item={item} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* Order Form Section */}
        <OrderForm foodItems={foodItems} />

        {/* Order History Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <Button 
              onClick={() => setShowOrders(!showOrders)}
              variant="outline"
              size="lg"
              className="font-semibold"
            >
              {showOrders ? "Hide Order History" : "View Order History"}
            </Button>
          </div>
          
          {showOrders && (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-foreground mb-3">Order History</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                <p className="text-muted-foreground mt-4">Track all your previous orders</p>
              </div>
              <OrderHistory />
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
