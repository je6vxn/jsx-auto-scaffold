import { ChefHat, Phone, MapPin, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-foreground via-foreground/95 to-foreground text-background mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              Flavours of Biryani
            </h3>
            <p className="text-background/80 text-sm">
              Serving authentic biryani and traditional dishes near Vignan University since 2020.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-background/80">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Near Vignan University, Guntur
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Open: 10 AM - 11 PM
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#menu" className="block text-background/80 hover:text-background transition-colors">
                Menu
              </a>
              <a href="#order" className="block text-background/80 hover:text-background transition-colors">
                Order Now
              </a>
              <a href="#about" className="block text-background/80 hover:text-background transition-colors">
                About Us
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
          <p>&copy; 2025 Flavours of Biryani. All rights reserved. | Cash on Delivery Only</p>
        </div>
      </div>
    </footer>
  );
};
