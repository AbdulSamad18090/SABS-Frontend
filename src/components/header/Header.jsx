import {
  Activity,
  Star,
  HelpCircle,
  DollarSign,
  Mail,
  Gift,
  ArrowRight,
  Users,
  Menu,
  X,
  User,
  LogOut,
  ArrowLeftFromLine,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../mode-toggle/mode-toggle";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { handleLogout } from "@/lib/utils";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogined, setIsLogined] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsLogined(true);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.log(error);
        setIsLogined(false);
        setUserRole(null);
      }
    } else {
      setIsLogined(false);
      setUserRole(null);
    }
  }, [location.pathname]);

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

  // Default navigation items for non-logged-in users
  const defaultNavItems = [
    { label: "Features", href: "/#features", icon: Star },
    { label: "How It Works", href: "/#how-it-works", icon: HelpCircle },
    { label: "Benefits", href: "/#benefits", icon: Gift },
    { label: "Contact", href: "/#contact", icon: Mail },
  ];

  // Patient-specific navigation items
  const patientNavItems = [
    { label: "View Doctors", href: "/doctors", icon: Users },
    { label: "Manage Profile", href: "/profile", icon: User },
  ];

  // Doctor-specific navigation items
  const doctorNavItems = [
    { label: "Manage Profile", href: "/profile", icon: User },
  ];

  // Determine which navigation items to show
  const getNavItems = () => {
    if (!isLogined) {
      return defaultNavItems;
    }
    if (userRole === "doctor") {
      return doctorNavItems;
    }
    if (userRole === "patient") {
      return patientNavItems;
    }
    return defaultNavItems; // Fallback
  };

  const navItems = getNavItems();

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* Desktop Header - Top */}
      <header className="hidden md:flex px-4 lg:px-6 h-16 items-center border-b bg-transparent/95 backdrop-blur supports-[backdrop-filter]:bg-transparent/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center" to="/#">
          <Activity className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">SmartDoc</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
              to={item.href}
            >
              {item.label}
            </Link>
          ))}

          <ModeToggle />
          {isLogined ? (
            <>
              <Link to={"/dashboard"}>
                <Button>
                  <Activity />
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link to={"/auth"}>
              <Button>
                Get Started
                <ArrowRight />
              </Button>
            </Link>
          )}
        </nav>
      </header>

      {/* Mobile Header */}
      <header
        className={`md:hidden flex px-4 h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link className="flex items-center justify-center" to="/#">
          <Activity className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">SmartDoc</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />

          {/* Mobile Menu Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  SmartDoc Menu
                </SheetTitle>
                <SheetDescription>
                  {isLogined
                    ? `Welcome back! You're logged in as a ${userRole}.`
                    : "Navigate through SmartDoc features and services."}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-4">
                {/* Navigation Items */}
                {navItems.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Navigation
                    </h3>
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* User Info */}
                {isLogined && (
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Account
                    </h3>
                    <div className="px-3 py-2 bg-accent/50 rounded-md">
                      <p className="text-sm">
                        <span className="font-medium"></span>{" "}
                        <span className="capitalize text-primary">
                          {userRole}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </h3>
                  {isLogined ? (
                    <Link to="/dashboard" onClick={handleLinkClick}>
                      <Button
                        className="w-full justify-start"
                        variant="default"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth" onClick={handleLinkClick}>
                      <Button
                        className="w-full justify-start"
                        variant="default"
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                  {/* Logout Button */}
                  {isLogined && (
                    <div className="pt-4 border-t mt-auto">
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
};

export default Header;
