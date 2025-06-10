import { Activity, Star, HelpCircle, DollarSign, Mail, Gift } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../mode-toggle/mode-toggle";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        // Show navbar when scrolling up, hide when scrolling down
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down & past 100px
          setIsVisible(false);
        } else {
          // Scrolling up or at top
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <>
      {/* Desktop Header - Top */}
      <header className="hidden md:flex px-4 lg:px-6 h-16 items-center border-b bg-transparent/95 backdrop-blur supports-[backdrop-filter]:bg-transparent/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center" to="/#">
          <Activity className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">SmartDoc</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/#benifits"
          >
            Benifits
          </a>
          <a
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/#contact"
          >
            Contact
          </a>
          <ModeToggle />
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="px-4 py-3">
          {/* Navigation Links with Icons */}
          <div className="grid grid-cols-5 gap-0">
            <a
              className="flex flex-col items-center gap-1 hover:text-primary transition-colors py-2"
              href="/#features"
            >
              <Star className="h-5 w-5" />
              <span className="text-xs text-center line-clamp-1">Features</span>
            </a>
            <a
              className="flex flex-col items-center gap-1 hover:text-primary transition-colors py-2"
              href="/#how-it-works"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="text-xs text-center line-clamp-1">
                How it Works
              </span>
            </a>

            {/* Mode Toggle in Center */}
            <div className="flex flex-col items-center gap-1 py-2">
              <ModeToggle align="center" />
            </div>

            <a
              className="flex flex-col items-center gap-1 hover:text-primary transition-colors py-2"
              href="/#benifits"
            >
              <Gift className="h-5 w-5" />
              <span className="text-xs text-center line-clamp-1">Benifits</span>
            </a>
            <a
              className="flex flex-col items-center gap-1 hover:text-primary transition-colors py-2"
              href="/#contact"
            >
              <Mail className="h-5 w-5" />
              <span className="text-xs text-center line-clamp-1">Contact</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
