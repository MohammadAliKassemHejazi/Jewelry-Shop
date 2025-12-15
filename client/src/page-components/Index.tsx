
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import ProductCard from "@/components/ProductCard";
import EnhancedProductCard from "@/components/EnhancedProductCard";
import { productsApi, testimonialsApi, newsletterApi } from "@/services/api";
import { Product, Testimonial } from "@/types";
import { toast } from "sonner";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured products and testimonials in parallel
        const [productsResponse, testimonialsResponse] = await Promise.allSettled([
          productsApi.getFeatured(6),
          testimonialsApi.getVerified()
        ]);

        // Handle products response
        if (productsResponse.status === 'fulfilled') {
          setFeaturedProducts(productsResponse.value);
        } else {
          console.error('Failed to fetch featured products:', productsResponse.reason);
          setFeaturedProducts([]);
        }

        // Handle testimonials response
        if (testimonialsResponse.status === 'fulfilled') {
          setTestimonials(testimonialsResponse.value);
        } else {
          console.error('Failed to fetch testimonials:', testimonialsResponse.reason);
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setFeaturedProducts([]);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setNewsletterLoading(true);
      const response = await newsletterApi.subscribe(newsletterEmail);
      
      if (response.success) {
        toast.success('Successfully subscribed to our newsletter!');
        setNewsletterEmail('');
      } else {
        toast.error(response.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-primary-light to-primary/30 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 " 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200')"
          }}
        ></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            Elegant Jewelry
            <br />
            <span className="text-primary inline-block transform translate-y-4 opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              For Every Moment
            </span>
          </h1>
          <p className="font-poppins text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
            Discover our curated collection of timeless pieces that celebrate your unique style and beauty
          </p>
          <div className="space-x-4 opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-poppins transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 font-poppins transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="font-poppins text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces from our latest collection, crafted with the finest materials and attention to detail
            </p>
          </AnimatedSection>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <AnimatedSection key={index} delay={index * 200}>
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">Showing sample products below</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <AnimatedSection key={product.id} delay={index * 200}>
                  <EnhancedProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          )}
          
          <AnimatedSection className="text-center mt-12" delay={600}>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white font-poppins transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <Link href="/shop">View All Products</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-lightgrey">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="font-poppins text-gray-600">
              Hear from our satisfied customers about their experience with Shimmer Rose
            </p>
          </AnimatedSection>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <AnimatedSection key={index} delay={index * 200}>
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-32 rounded-lg"></div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={testimonial.id || index} delay={index * 200}>
                  <Card className="border-gray-200 transform hover:scale-105 transition-all duration-300 hover:shadow-lg group">
                    <CardContent className="p-6">
                      <div className="flex mb-4 group-hover:scale-110 transition-transform duration-300">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 transform transition-all duration-300" fill="currentColor" viewBox="0 0 20 20" style={{ animationDelay: `${i * 100}ms` }}>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="font-poppins text-gray-600 mb-4 italic group-hover:text-gray-700 transition-colors duration-300">"{testimonial.text}"</p>
                      <p className="font-playfair font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">- {testimonial.name}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-16 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4 transform hover:scale-105 transition-transform duration-300">
              Join Our Exclusive Newsletter
            </h2>
            <p className="font-poppins text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Be the first to know about new collections, special offers, and jewelry care tips
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-white font-poppins transition-all duration-300 focus:scale-105"
                required
              />
              <Button 
                type="submit"
                disabled={newsletterLoading}
                className="bg-white text-primary hover:bg-gray-100 font-poppins px-8 transform hover:scale-105 transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default Index;
