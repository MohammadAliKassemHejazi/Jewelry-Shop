"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, Shield } from 'lucide-react';
import { cartApi, paymentApi, ordersApi } from '@/services/api';
import { Product, OrderCreateRequest, Address } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [billingAddress, setBillingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
  });

  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.get();
      setCart(response);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const response = await cartApi.updateItem(itemId, quantity);
      setCart(response);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await cartApi.removeItem(itemId);
      setCart(response);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      toast.error('Please fill in customer information');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error('Please fill in shipping address');
      return;
    }

    try {
      setIsProcessing(true);

      // Create order
      const orderData: OrderCreateRequest = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
        })),
        total: cart.total,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        paymentMethod: 'card',
        notes: '',
      };

      const order = await ordersApi.create(orderData);

      // Create payment intent
      const paymentIntent = await paymentApi.createIntent(order.id, order.total, 'card');

      // In a real app, you would integrate with Stripe Elements here
      // For now, we'll simulate a successful payment
      await paymentApi.confirm(paymentIntent.clientSecret);

      // Clear cart
      await cartApi.clear();
      setCart(null);

      toast.success('Order placed successfully!');
      router.push(`/order/${order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsCheckoutOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to get started</p>
          <Button onClick={() => router.push('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">${item.product.price}</Badge>
                        {item.product.onSale && item.product.salePrice && (
                          <Badge variant="destructive">Sale: ${item.product.salePrice}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Checkout</DialogTitle>
                      <DialogDescription>
                        Complete your order
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Customer Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Name</label>
                            <Input
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              type="email"
                              value={customerInfo.email}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Street Address</label>
                            <Input
                              value={shippingAddress.street}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                              placeholder="123 Main St"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">City</label>
                              <Input
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                placeholder="New York"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">State</label>
                              <Input
                                value={shippingAddress.state}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                placeholder="NY"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">ZIP Code</label>
                              <Input
                                value={shippingAddress.zipCode}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                placeholder="10001"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Country</label>
                              <Input
                                value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                placeholder="United States"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Payment</h3>
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <span>Credit Card</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Payment will be processed securely through Stripe
                          </p>
                        </div>
                      </div>

                      {/* Security Notice */}
                      <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Secure Checkout</p>
                          <p className="text-xs text-green-600">
                            Your payment information is encrypted and secure
                          </p>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCheckout} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Place Order'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full" onClick={() => router.push('/shop')}>
                  Continue Shopping
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove all items from your cart?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearCart}>
                        Clear Cart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;