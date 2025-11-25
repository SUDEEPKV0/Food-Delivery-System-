import { motion } from 'motion/react';
import Header from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface TemplePrasadamPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

const temples = [
  { id: 't1', name: 'Tirupati Balaji', prasadam: 'Laddu', price: 150, location: 'Andhra Pradesh' },
  { id: 't2', name: 'ISKCON', prasadam: 'Peda', price: 180, location: 'Bengaluru' },
  { id: 't3', name: 'Kashi Vishwanath', prasadam: 'Jalebi', price: 130, location: 'Varanasi' },
  { id: 't4', name: 'Shirdi Sai', prasadam: 'Coconut Burfi', price: 200, location: 'Maharashtra' },
  { id: 't5', name: 'Udupi Krishna', prasadam: 'Pongal', price: 120, location: 'Karnataka' },
  { id: 't6', name: 'Madurai Meenakshi', prasadam: 'Sweet Rice', price: 140, location: 'Tamil Nadu' },
];

const spiritualItems = [
  { id: 's1', name: 'Dhoti & Panche Set', price: 350 },
  { id: 's2', name: 'Kumkum Box', price: 80 },
  { id: 's3', name: 'Tulsi Beads', price: 120 },
  { id: 's4', name: 'Brass Lamp', price: 450 },
];

export default function TemplePrasadamPage({ addToCart, cartCount, onCartClick }: TemplePrasadamPageProps) {
  const handleAddToCart = (item: any) => {
    addToCart({ ...item, image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400' });
    toast.success(`${item.name || item.prasadam} added to cart! 🙏`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#FFE0B2]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="bg-gradient-to-r from-[#FFD54F] to-[#F57C00] py-16 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl mb-4">🛕</div>
          <h1 className="text-4xl mb-2">Sacred Spaces Across India</h1>
          <p className="text-xl opacity-90">Order Prasadam & blessings directly from holy temples</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl text-[#1C1C1C] mb-8">Holy Prasadam 🍮🪔</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {temples.map((temple, index) => (
            <motion.div
              key={temple.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="p-6 border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl text-[#1C1C1C] mb-1">{temple.name}</h3>
                    <p className="text-sm text-[#5E5E5E]">{temple.location}</p>
                  </div>
                  <Badge className="bg-[#FFD54F] text-[#1C1C1C]">🕉 Certified</Badge>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-[#5E5E5E] mb-1">Prasadam</p>
                  <p className="text-lg text-[#1C1C1C]">{temple.prasadam}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-[#FF5200]">₹{temple.price}</span>
                  <Button
                    onClick={() => handleAddToCart(temple)}
                    className="bg-gradient-to-r from-[#FFD54F] to-[#F57C00] text-[#1C1C1C] hover:shadow-lg"
                  >
                    Order Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl text-[#1C1C1C] mb-8">Spiritual Essentials 🪔</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {spiritualItems.map((item) => (
            <Card key={item.id} className="p-6 border-0 shadow-lg bg-white text-center">
              <div className="text-4xl mb-4">🕉️</div>
              <h3 className="text-lg text-[#1C1C1C] mb-3">{item.name}</h3>
              <p className="text-xl text-[#FF5200] mb-4">₹{item.price}</p>
              <Button
                onClick={() => handleAddToCart(item)}
                variant="outline"
                className="w-full border-[#FFD54F] text-[#1C1C1C] hover:bg-[#FFF8E1]"
              >
                Buy Now
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
