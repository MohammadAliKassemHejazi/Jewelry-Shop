
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Account = () => {
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567"
  });

  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 1299,
      items: [
        { name: "Rose Gold Diamond Ring", price: 1299, quantity: 1 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "Shipped",
      total: 598,
      items: [
        { name: "Pearl Drop Earrings", price: 299, quantity: 2 }
      ]
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "Processing",
      total: 899,
      items: [
        { name: "Elegant Gold Necklace", price: 899, quantity: 1 }
      ]
    }
  ];

  const wishlist = [
    {
      id: 1,
      name: "Sapphire Engagement Ring",
      price: 3499,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300"
    },
    {
      id: 2,
      name: "Diamond Tennis Bracelet",
      price: 2199,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300"
    }
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-lightgrey py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-4xl font-bold text-gray-900 text-center">My Account</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="font-poppins">Profile</TabsTrigger>
            <TabsTrigger value="orders" className="font-poppins">Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="font-poppins">Wishlist</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="border-gray-300 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="border-gray-300 focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="border-gray-300 focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="border-gray-300 focus:border-primary"
                      />
                    </div>
                    
                    <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-poppins">
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start border-gray-300 font-poppins">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-300 font-poppins">
                      Notification Preferences
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-300 font-poppins">
                      Address Book
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-300 font-poppins">
                      Payment Methods
                    </Button>
                    <Button variant="destructive" className="w-full justify-start font-poppins">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Order History</h2>
                <p className="font-poppins text-gray-600">Track and manage your jewelry orders</p>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-playfair text-lg font-semibold text-gray-900">Order {order.id}</h3>
                          <p className="font-poppins text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} font-poppins`}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-poppins text-gray-900">{item.name} x {item.quantity}</span>
                            <span className="font-poppins font-semibold">${item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="font-playfair text-lg font-semibold text-gray-900">
                          Total: ${order.total.toLocaleString()}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white font-poppins">
                            View Details
                          </Button>
                          {order.status === "Delivered" && (
                            <Button variant="outline" size="sm" className="border-gray-300 font-poppins">
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-2">My Wishlist</h2>
                <p className="font-poppins text-gray-600">Save your favorite pieces for later</p>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="border-gray-200 group hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="font-poppins text-lg font-bold text-gray-900 mb-4">
                            ${item.price.toLocaleString()}
                          </p>
                          <div className="space-y-2">
                            <Button className="w-full bg-primary hover:bg-primary-dark text-white font-poppins">
                              Add to Cart
                            </Button>
                            <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 font-poppins">
                              Remove from Wishlist
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="font-poppins text-gray-600 mb-6">Start adding items you love to keep track of them</p>
                  <Button className="bg-primary hover:bg-primary-dark text-white font-poppins">
                    Browse Collection
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
