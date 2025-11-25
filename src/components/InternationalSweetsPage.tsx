import { useState } from 'react';
import { motion } from 'motion/react';
import Header from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface InternationalSweetsPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

const countries = [
  { 
    id: 'in', 
    name: 'India', 
    flag: '🇮🇳', 
    sweets: [
      { id: 's1', name: 'Gulab Jamun', price: 150, image: 'https://pipingpotcurry.com/wp-content/uploads/2023/12/Gulab-Jamun-Recipe-Piping-Pot-Curry.jpg' },
      { id: 's2', name: 'Rasgulla', price: 140, image: 'https://www.seema.com/wp-content/uploads/2022/08/Rasgulla.jpg' },
      { id: 's3', name: 'Jalebi', price: 120, image: 'https://blog.suvie.com/wp-content/uploads/2021/12/44993659814_b34517ae82_b.jpg' },
      { id: 's4', name: 'Kaju Katli', price: 280, image: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Kaju_katli_sweet.jpg' },
      { id: 's5', name: 'Mysore Pak', price: 200, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/mysore-pak-recipe.webp' },
      { id: 's6', name: 'Besan Barfi', price: 180, image: 'https://www.sanjanafeasts.co.uk/wp-content/uploads/2021/10/Perfect-Besan-Barfi-recipe.jpg' },
      { id: 's7', name: 'Kheer (Rice Pudding)', price: 130, image: 'https://www.cookwithmanali.com/wp-content/uploads/2017/06/Indian-Rice-Kheer.jpg' },
      { id: 's8', name: 'Ghevar', price: 220, image: 'https://cdn.tarladalal.com/media/recipe/mainphoto/2024/11/18/malai_ghevar.webp' },
      { id: 's9', name: 'Rasmalai', price: 160, image: 'https://www.cookwithmanali.com/wp-content/uploads/2016/04/Rasmalai-Recipe.jpg' },
      { id: 's10', name: 'Motichoor Ladoo', price: 190, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/motichoor-ladoo-recipe.webp' },
      { id: 's11', name: 'Soan Papdi', price: 170, image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Soan_papdi_on_plate.jpg' },
      { id: 's12', name: 'Sandesh', price: 150, image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2018/11/sandesh-recipe-1-500x500.jpg' },
      { id: 's13', name: 'Peda', price: 140, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/doodh-peda-recipe.jpg' },
      { id: 's14', name: 'Gajar Halwa', price: 160, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/gajar-halwa-recipe.webp' },
      { id: 's15', name: 'Malpua', price: 130, image: 'https://static.toiimg.com/photo/53244215.cms' },
      { id: 's16', name: 'Badam Halwa', price: 250, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/10/badam-halwa-recipe.webp' },
      { id: 's17', name: 'Besan Ladoo', price: 180, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/besan-ladoo-recipe.webp' },
      { id: 's18', name: 'Shrikhand', price: 170, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/shrikhand-recipe.webp' },
      { id: 's19', name: 'Cham Cham', price: 160, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/cham-cham-recipe.webp' },
      { id: 's20', name: 'Kalakand', price: 190, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/kalakand-recipe.webp' },
    ]
  },
  { 
    id: 'it', 
    name: 'Italy', 
    flag: '🇮🇹', 
    sweets: [
      { id: 's21', name: 'Tiramisu', price: 280, image: 'https://images.unsplash.com/photo-1571115764595-644467f3121b?w=600' },
      { id: 's22', name: 'Cannoli Siciliani', price: 240, image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd37e43?w=600' },
      { id: 's23', name: 'Sbrisolona', price: 220, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },
      { id: 's24', name: 'Panettone', price: 320, image: 'https://images.unsplash.com/photo-1571115764595-644467f3121b?w=600' },
      { id: 's25', name: 'Panna Cotta', price: 260, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291840?w=600' },
    ]
  },
  { 
    id: 'fr', 
    name: 'France', 
    flag: '🇫🇷', 
    sweets: [
      { id: 's26', name: 'Crème Brûlée', price: 300, image: 'https://images.unsplash.com/photo-1470599810765-0d8f00f3b3c7?w=600' },
      { id: 's27', name: 'Mille-Feuille', price: 280, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },
      { id: 's28', name: 'Macarons', price: 240, image: 'https://images.unsplash.com/photo-1558636508-e0db3814a69b?w=600' },
      { id: 's29', name: 'Tarte Tatin', price: 260, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600' },
      { id: 's30', name: 'Éclair', price: 220, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },
    ]
  },
  { 
    id: 'jp', 
    name: 'Japan', 
    flag: '🇯🇵', 
    sweets: [
      { id: 's31', name: 'Mochi', price: 180, image: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=600' },
      { id: 's32', name: 'Dorayaki', price: 160, image: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=600' },
      { id: 's33', name: 'Taiyaki', price: 150, image: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=600' },
    ]
  },
  { 
    id: 'tr', 
    name: 'Turkey', 
    flag: '🇹🇷', 
    sweets: [
      { id: 's34', name: 'Baklava', price: 240, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600' },
      { id: 's35', name: 'Turkish Delight', price: 200, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600' },
    ]
  },
  { 
    id: 'mx', 
    name: 'Mexico', 
    flag: '🇲🇽', 
    sweets: [
      { id: 's36', name: 'Tres Leches Cake', price: 280, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },
      { id: 's37', name: 'Churros', price: 180, image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=600' },
      { id: 's38', name: 'Flan', price: 220, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },
    ]
  },
];

export default function InternationalSweetsPage({ addToCart, cartCount, onCartClick }: InternationalSweetsPageProps) {
  const [selected, setSelected] = useState(countries[0]);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🍬`);
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33] py-16 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl mb-4">🍬</div>
          <h1 className="text-4xl mb-2">YummPort International Sweets</h1>
          <p className="text-xl opacity-90">Explore Global Sweet Traditions</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl text-[#1C1C1C] mb-8">Select Country 🌍</h2>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
          {countries.map((country) => (
            <motion.button
              key={country.id}
              onClick={() => setSelected(country)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl shadow-lg text-center transition-all ${
                selected.id === country.id
                  ? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white ring-4 ring-[#FF5200]/30'
                  : 'bg-white text-[#1C1C1C] hover:shadow-xl'
              }`}
            >
              <div className="text-4xl mb-2">{country.flag}</div>
              <p className="text-sm">{country.name}</p>
            </motion.button>
          ))}
        </div>

        <motion.div 
          key={selected.id} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-[#1C1C1C]">Sweets from {selected.name} {selected.flag}</h2>
            <Badge className="bg-[#FF5200] text-white">Free Shipping on Orders Above ₹500</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selected.sweets.map((sweet, index) => (
              <motion.div
                key={sweet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback 
                      src={sweet.image} 
                      alt={sweet.name} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-[#FF5200] shadow-md">
                        Popular
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-[#1C1C1C] mb-3 line-clamp-1">{sweet.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl text-[#FF5200]">₹{sweet.price}</span>
                      <Button
                        onClick={() => handleAddToCart(sweet)}
                        size="sm"
                        className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33] hover:shadow-lg transition-all"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Card className="mt-12 p-8 bg-gradient-to-r from-[#FFD54F] to-[#FF7A33] border-0 text-white shadow-xl">
          <h3 className="text-2xl mb-4">Delivery Guidelines ✈️</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="mb-2">📦 Packaging</p>
              <p className="text-white/90">Vacuum-sealed with temperature control</p>
            </div>
            <div>
              <p className="mb-2">🌍 Shipping</p>
              <p className="text-white/90">International delivery: 3-7 days</p>
            </div>
            <div>
              <p className="mb-2">💸 Customs</p>
              <p className="text-white/90">Express orders include customs fees</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
