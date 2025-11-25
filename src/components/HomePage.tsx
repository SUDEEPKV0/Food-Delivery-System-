import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Star, TrendingUp, Bike, Clock } from 'lucide-react';
import Header from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

const foodItems = [
  {
    id: 'f1',
    name: 'Paneer Butter Masala',
    price: 180,
    image: 'https://images.unsplash.com/photo-1714611626323-5ba6204453be?w=400',
    category: 'Indian',
    rating: 4.7,
    calories: 420,
  },
  {
    id: 'f2',
    name: 'Margherita Pizza',
    price: 320,
    image: 'https://images.unsplash.com/photo-1622883618971-97068745dc6c?w=400',
    category: 'Italian',
    rating: 4.5,
    calories: 530,
  },
  {
    id: 'f3',
    name: 'Healthy Buddha Bowl',
    price: 220,
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
    category: 'Healthy',
    rating: 4.8,
    calories: 280,
  },
  {
    id: 'f4',
    name: 'Classic Burger Meal',
    price: 280,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
    category: 'American',
    rating: 4.6,
    calories: 650,
  },
  {
    id: 'f5',
    name: 'Sushi Combo',
    price: 480,
    image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=400',
    category: 'Japanese',
    rating: 4.9,
    calories: 370,
  },
  {
    id: 'f6',
    name: 'Pasta Carbonara',
    price: 350,
    image: 'https://images.unsplash.com/photo-1703258581842-31608ecd6528?w=400',
    category: 'Italian',
    rating: 4.7,
    calories: 520,
  },
  {
    id: 'f7',
    name: 'Chocolate Cake',
    price: 150,
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?w=400',
    category: 'Dessert',
    rating: 4.8,
    calories: 380,
  },
  {
    id: 'f8',
    name: 'Chicken Biryani',
    price: 250,
    image: 'https://images.unsplash.com/photo-1714611626323-5ba6204453be?w=400',
    category: 'Indian',
    rating: 4.9,
    calories: 580,
  },
];

const restaurants = [
  {
    id: 'r1',
    name: 'Davangere Resto',
    cuisine: 'North Indian, Biryani',
    rating: 4.3,
    time: '30-35 mins',
    priceForTwo: '₹400',
    offer: '50% OFF up to ₹100',
    image: 'https://images.unsplash.com/photo-1714611626323-5ba6204453be?w=400',
  },
  {
    id: 'r2',
    name: 'Pizza Paradise',
    cuisine: 'Italian, Fast Food',
    rating: 4.5,
    time: '25-30 mins',
    priceForTwo: '₹500',
    offer: 'Free Delivery',
    image: 'https://images.unsplash.com/photo-1622883618971-97068745dc6c?w=400',
  },
  {
    id: 'r3',
    name: 'Sushi Station',
    cuisine: 'Japanese, Asian',
    rating: 4.7,
    time: '40-45 mins',
    priceForTwo: '₹800',
    offer: '20% OFF',
    image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=400',
  },
  {
    id: 'r4',
    name: 'Burger Bistro',
    cuisine: 'American, Burgers',
    rating: 4.4,
    time: '20-25 mins',
    priceForTwo: '₹350',
    offer: 'Buy 1 Get 1',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
  },
];

const cities = [
  { name: 'Bangalore', restaurants: 1200, image: 'bangalore skyline' },
  { name: 'Davanagere', restaurants: 180, image: 'davanagere city' },
  { name: 'Mumbai', restaurants: 1500, image: 'mumbai night' },
  { name: 'Delhi', restaurants: 1400, image: 'delhi monuments' },
  { name: 'Hyderabad', restaurants: 900, image: 'hyderabad biryani' },
  { name: 'Chennai', restaurants: 850, image: 'chennai beach' },
];

export default function HomePage({ addToCart, cartCount, onCartClick }: HomePageProps) {
  const [location, setLocation] = useState('Bangalore');
  const [searchQuery, setSearchQuery] = useState('');
  const [locSuggestions, setLocSuggestions] = useState<Array<any>>([]);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const locRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!location) return setLocSuggestions([]);
    const q = location.trim().toLowerCase();
    setLocSuggestions(cities.filter(c => c.name.toLowerCase().includes(q)));
  }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!locRef.current) return;
      if (!locRef.current.contains(e.target as Node)) setShowLocSuggestions(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const performSearch = () => {
    if (!searchQuery.trim() && !location.trim()) {
      toast.error('Please enter a location or a search term');
      return;
    }
    const q = encodeURIComponent(searchQuery.trim());
    const l = encodeURIComponent(location.trim());
    navigate(`/menu?query=${q}&location=${l}`);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`);
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FF5200] to-[#FF7A33] py-16 overflow-hidden">
        {/* Floating Food Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-10"
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {['🍕', '🍔', '🍜', '🍱', '🍰'][i % 5]}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl mb-4">
              Order food & groceries. Discover restaurants.
            </h1>
            <p className="text-xl md:text-2xl mb-8">YummPort it!</p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-full shadow-2xl p-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {/* Location input */}
                <div ref={locRef} className="flex items-center px-4 py-2 flex-1 rounded-full bg-white">
                  <MapPin className="w-5 h-5 text-[#FF5200] mr-2" />
                  <div className="relative flex-1">
                    <Input
                      value={location}
                      onChange={(e) => { setLocation(e.target.value); setShowLocSuggestions(true); }}
                      onFocus={() => setShowLocSuggestions(true)}
                      placeholder="Location"
                      className="border-0 focus-visible:ring-0 p-0"
                      aria-label="Location"
                    />
                    {showLocSuggestions && locSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                        {locSuggestions.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => { setLocation(c.name); setShowLocSuggestions(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-[#FFF3E6] text-[#1C1C1C]"
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider for large screens */}
                <div className="hidden sm:flex items-center h-10 px-2">
                  <div className="w-px h-6 bg-[#FF5200]/20" />
                </div>

                {/* Search input */}
                <div className="flex items-center px-4 py-2 flex-1 rounded-full bg-white">
                  <Search className="w-5 h-5 text-[#FF5200] mr-2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') performSearch(); }}
                    placeholder="Search for restaurant, cuisine or dish"
                    className="border-0 focus-visible:ring-0 p-0"
                    aria-label="Search"
                  />
                </div>

                {/* Search button */}
                <div className="flex-shrink-0">
                  <Button onClick={performSearch} className="h-12 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] rounded-full px-6">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { icon: '🤖', label: 'AI Recommend', path: '/ai-recommendation' },
            { icon: '😊', label: 'Mood Food', path: '/mood-food' },
            { icon: '📸', label: 'Food Scanner', path: '/food-scanner' },
            { icon: '🎤', label: 'Voice Search', path: '/voice-search' },
            { icon: '🔥', label: 'Calorie Visualizer', path: '/calorie-visualizer' },
            { icon: '👥', label: 'Group Order', path: '/group-order' },
            { icon: '💊', label: 'Symptom Food', path: '/symptom-food' },
            { icon: '🐄', label: 'Animal Foods', path: '/animal-foods' },
          ].map((item, i) => (
            <Link key={i} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="text-[#1C1C1C]">{item.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Food Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl text-[#1C1C1C] mb-2">Order Our Best Food Options</h2>
            <p className="text-[#5E5E5E]">Handpicked favorites from top restaurants</p>
          </div>
          <Link to="/menu">
            <Button variant="outline" className="border-[#FF5200] text-[#FF5200] hover:bg-[#FFF3E6]">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foodItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,82,0,0.3)' }}
            >
              <Card className="overflow-hidden cursor-pointer border-0 shadow-lg">
                <div className="relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white text-[#1C1C1C]">
                    <Star className="w-3 h-3 fill-[#FFD54F] text-[#FFD54F] mr-1" />
                    {item.rating}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-[#1C1C1C] mb-1">{item.name}</h3>
                  <p className="text-sm text-[#5E5E5E] mb-3">{item.calories} cal</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-[#FF5200]">₹{item.price}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33] hover:shadow-lg"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Discover Best Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl text-[#1C1C1C] mb-8">Discover Best Restaurants</h2>
        
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 w-80"
            >
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="relative">
                  <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {restaurant.offer && (
                    <Badge className="absolute bottom-2 left-2 bg-[#FF5200]">
                      {restaurant.offer}
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg text-[#1C1C1C]">{restaurant.name}</h3>
                      <p className="text-sm text-[#5E5E5E]">{restaurant.cuisine}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Star className="w-3 h-3 fill-green-800 mr-1" />
                      {restaurant.rating}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#5E5E5E]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {restaurant.time}
                    </span>
                    <span>{restaurant.priceForTwo}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cities Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-[#1C1C1C] mb-8 text-center">
            Active Cities with YummPort Delivery
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[#FFF3E6] to-white rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl text-[#1C1C1C] mb-2">{city.name}</h3>
                <p className="text-[#5E5E5E] mb-4">
                  {city.restaurants}+ restaurants delivering
                </p>
                <Button variant="outline" size="sm" className="border-[#FF5200] text-[#FF5200]">
                  Explore Restaurants
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Feature Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/gym-space">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-white border-0">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-xl text-[#1C1C1C] mb-2">Gym Space</h3>
              <p className="text-[#5E5E5E]">Personalized nutrition plans</p>
            </Card>
          </Link>

          <Link to="/temple-prasadam">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-yellow-50 to-white border-0">
              <div className="text-5xl mb-4">🛕</div>
              <h3 className="text-xl text-[#1C1C1C] mb-2">Temple Prasadam</h3>
              <p className="text-[#5E5E5E]">Divine blessings delivered</p>
            </Card>
          </Link>

          <Link to="/gift-party">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-pink-50 to-white border-0">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl text-[#1C1C1C] mb-2">Gifts & Celebrations</h3>
              <p className="text-[#5E5E5E]">Party halls and gift combos</p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
