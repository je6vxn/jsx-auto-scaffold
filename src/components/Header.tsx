import { ChefHat, Phone, Clock } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ChefHat className="w-10 h-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Flavours of Biryani</h1>
              <p className="text-primary-foreground/90 text-sm mt-1">Near Vignan University • Authentic Taste</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-sm">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">10 AM - 11 PM</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
