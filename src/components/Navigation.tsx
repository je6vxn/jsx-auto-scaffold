import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex gap-6">
            <a 
              href="#menu" 
              className="text-foreground hover:text-primary font-semibold transition-colors"
            >
              Menu
            </a>
            <a 
              href="#order" 
              className="text-foreground hover:text-primary font-semibold transition-colors"
            >
              Order Now
            </a>
            <a 
              href="#about" 
              className="text-foreground hover:text-primary font-semibold transition-colors"
            >
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Free Delivery</span>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
