import { useState } from 'react';
import { motion } from 'motion/react';
import Header from './Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface GiftPartyPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

const gifts = {
  boy: [
    { id: 'b1', name: 'Tech Gadget Pack', price: 1499, emoji: '🎮' },
    { id: 'b2', name: 'Game Night Pack', price: 899, emoji: '🎯' },
  ],
  girl: [
    { id: 'g1', name: 'Glow & Flow Box', price: 1299, emoji: '💐' },
    { id: 'g2', name: 'Wellness Hamper', price: 1499, emoji: '🌸' },
  ],
  parents: [
    { id: 'p1', name: 'Golden Moments Combo', price: 1899, emoji: '🌿' },
    { id: 'p2', name: 'Health & Wellness', price: 1699, emoji: '☕' },
  ],
  engagement: [
    { id: 'e1', name: 'Engagement Feast Pack', price: 2999, emoji: '💫' },
    { id: 'e2', name: 'Celebration Combo', price: 3499, emoji: '🥂' },
  ],
};

export default function GiftPartyPage({ addToCart, cartCount, onCartClick }: GiftPartyPageProps) {
  const [activeTab, setActiveTab] = useState('boy');

  const handleAddToCart = (item: any) => {
    addToCart({ ...item, image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' });
    toast.success(`${item.name} added to cart! 🎁`);
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="bg-gradient-to-r from-pink-400 to-purple-500 py-16 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-4xl mb-2">Gifts & Celebrations</h1>
          <p className="text-xl opacity-90">Share Joy with YummPort</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white">
            <TabsTrigger value="boy" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Boy 🎮
            </TabsTrigger>
            <TabsTrigger value="girl" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              Girl 💐
            </TabsTrigger>
            <TabsTrigger value="parents" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Parents 🌿
            </TabsTrigger>
            <TabsTrigger value="engagement" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Engagement 💫
            </TabsTrigger>
          </TabsList>

          {Object.entries(gifts).map(([key, items]) => (
            <TabsContent key={key} value={key}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="p-8 border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div className="text-6xl mb-4">{item.emoji}</div>
                    <h3 className="text-xl text-[#1C1C1C] mb-4">{item.name}</h3>
                    <p className="text-2xl text-[#FF5200] mb-6">₹{item.price}</p>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-gradient-to-r from-[#FF5200] to-[#FF7A33]"
                    >
                      Add to Cart
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
