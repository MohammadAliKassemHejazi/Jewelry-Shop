
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-lightgrey border-t border-primary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <span className="font-playfair text-xl font-semibold text-gray-900">
                Shimmer Rose
              </span>
            </Link>
            <p className="text-gray-600 font-poppins text-sm max-w-md">
              Elegant jewelry and luxury accessories crafted with passion and precision. 
              Discover timeless pieces that celebrate your unique style and beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors font-poppins text-sm">
                  Care Instructions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 font-poppins text-sm">
              © 2024 Shimmer Rose Boutique. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.81 3.367 13.664 3.367 12.367c0-1.297.483-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.814.875 1.297 2.026 1.297 3.323 0 1.297-.483 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
