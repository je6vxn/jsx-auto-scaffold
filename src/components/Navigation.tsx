import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cart } from "@/components/Cart";

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
            <Cart />
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
