"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Search, Menu, X, Settings, LogOut, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cartApi } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { favorites } = useFavorites();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const fetchCartCount = async () => {
      try {
        const count = await cartApi.getItemCount();
        setItemCount(count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/98 backdrop-blur-md border-b border-primary/30 shadow-lg' 
        : 'bg-white/95 backdrop-blur-sm border-b border-primary/20'
    }`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/lovable-uploads/a2529611-64d3-4302-abae-084d4cd36ae2.png" 
              alt="Nawal Studios Logo" 
              className={`w-auto transition-all duration-500 group-hover:scale-105 ${
                isScrolled ? 'h-10' : 'h-12'
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-poppins text-sm font-medium transition-all duration-300 hover:text-primary relative overflow-hidden group ${
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-gray-700"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                  isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
            
            {/* Admin Link - Only show for admin users */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`font-poppins text-sm font-medium transition-all duration-300 hover:text-primary relative overflow-hidden group ${
                  pathname?.startsWith('/admin') 
                    ? "text-primary" 
                    : "text-gray-700"
                }`}
              >
                Admin
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                  pathname?.startsWith('/admin') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 group">
              <Search className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
            </Button>
            
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 relative group">
                <Heart className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform duration-300">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 group">
                    <User className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name} {user?.surname}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-gray-500">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 group">
                  <User className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                </Button>
              </Link>
            )}
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 relative group">
                <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform duration-300">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10 hover:scale-110 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                <X className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        } border-t border-primary/20`}>
          <nav className="flex flex-col space-y-4">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-poppins text-sm font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 ${
                  isActive(item.href) ? "text-primary" : "text-gray-700"
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`font-poppins text-sm font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 ${
                  pathname?.startsWith('/admin') ? "text-primary" : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            
            {/* Mobile User Actions */}
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  className="font-poppins text-sm font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-poppins text-sm font-medium transition-all duration-300 hover:text-red-600 hover:translate-x-2 text-gray-700 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-poppins text-sm font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

