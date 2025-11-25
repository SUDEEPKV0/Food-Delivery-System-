import { useState } from 'react';
import { motion } from 'motion/react';
import { Filter, Star, Flame } from 'lucide-react';
import Header from './Header';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

const menuItems = {
  food: [
    { id: 'm1', name: 'Dal Makhani', price: 160, calories: 350, rating: 4.6, category: 'Indian', image: 'https://images.unsplash.com/photo-1714611626323-5ba6204453be?w=400' },
    { id: 'm2', name: 'Margherita Pizza', price: 320, calories: 530, rating: 4.5, category: 'Italian', image: 'https://images.unsplash.com/photo-1622883618971-97068745dc6c?w=400' },
    { id: 'm3', name: 'Caesar Salad', price: 180, calories: 220, rating: 4.4, category: 'Healthy', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' },
    { id: 'm4', name: 'Sushi Platter', price: 550, calories: 400, rating: 4.8, category: 'Japanese', image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=400' },
    { id: 'm5', name: 'Chicken Burger', price: 240, calories: 600, rating: 4.5, category: 'American', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400' },
    { id: 'm6', name: 'Pasta Alfredo', price: 280, calories: 480, rating: 4.7, category: 'Italian', image: 'https://images.unsplash.com/photo-1703258581842-31608ecd6528?w=400' },
  ],
  grocery: [
    { id: 'g1', name: 'Fresh Vegetables Pack', price: 120, calories: 0, rating: 4.5, category: 'Grocery', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' },
    { id: 'g2', name: 'Fruits Basket', price: 200, calories: 0, rating: 4.6, category: 'Grocery', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' },
    { id: 'g3', name: 'Dairy Essentials', price: 180, calories: 0, rating: 4.7, category: 'Grocery', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' },
  ],
  beverages: [
    { id: 'b1', name: 'Fresh Orange Juice', price: 80, calories: 110, rating: 4.7, category: 'Beverage', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' },
    { id: 'b2', name: 'Green Tea', price: 50, calories: 2, rating: 4.6, category: 'Beverage', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' },
    { id: 'b3', name: 'Smoothie Bowl', price: 150, calories: 280, rating: 4.8, category: 'Beverage', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' },
  ],
};

export default function MenuPage({ addToCart, cartCount, onCartClick }: MenuPageProps) {
  const [activeTab, setActiveTab] = useState('food');
  const [priceFilter, setPriceFilter] = useState('all');

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`);
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl text-[#1C1C1C] mb-2">Choose Your Mood 🍱</h1>
          <p className="text-[#5E5E5E] mb-8">Browse through our curated menu</p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-white border border-[#FFF3E6]">
              <TabsTrigger value="food" className="data-[state=active]:bg-[#FF5200] data-[state=active]:text-white">
                Food
              </TabsTrigger>
              <TabsTrigger value="grocery" className="data-[state=active]:bg-[#FF5200] data-[state=active]:text-white">
                Grocery
              </TabsTrigger>
              <TabsTrigger value="beverages" className="data-[state=active]:bg-[#FF5200] data-[state=active]:text-white">
                Beverages
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex gap-4 mt-6 flex-wrap">
              <Button variant="outline" size="sm" className="border-[#FF5200] text-[#FF5200]">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {['all', 'under200', 'under500'].map((filter) => (
                <Button
                  key={filter}
                  variant={priceFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriceFilter(filter)}
                  className={priceFilter === filter ? 'bg-[#FF5200]' : 'border-[#FFF3E6]'}
                >
                  {filter === 'all' ? 'All Prices' : filter === 'under200' ? 'Under ₹200' : 'Under ₹500'}
                </Button>
              ))}
            </div>

            <TabsContent value="food" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.food.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-white text-[#1C1C1C]">
                          <Star className="w-3 h-3 fill-[#FFD54F] text-[#FFD54F] mr-1" />
                          {item.rating}
                        </Badge>
                        <Badge className="absolute bottom-3 left-3 bg-[#FF5200]">
                          <Flame className="w-3 h-3 mr-1" />
                          {item.calories} cal
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg text-[#1C1C1C] mb-1">{item.name}</h3>
                        <p className="text-sm text-[#5E5E5E] mb-4">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl text-[#FF5200]">₹{item.price}</span>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="grocery" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.grocery.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-white text-[#1C1C1C]">
                          <Star className="w-3 h-3 fill-[#FFD54F] text-[#FFD54F] mr-1" />
                          {item.rating}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg text-[#1C1C1C] mb-1">{item.name}</h3>
                        <p className="text-sm text-[#5E5E5E] mb-4">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl text-[#FF5200]">₹{item.price}</span>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="beverages" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.beverages.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-white text-[#1C1C1C]">
                          <Star className="w-3 h-3 fill-[#FFD54F] text-[#FFD54F] mr-1" />
                          {item.rating}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg text-[#1C1C1C] mb-1">{item.name}</h3>
                        <p className="text-sm text-[#5E5E5E] mb-4">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl text-[#FF5200]">₹{item.price}</span>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
