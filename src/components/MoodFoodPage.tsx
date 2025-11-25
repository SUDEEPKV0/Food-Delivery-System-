// Full upgraded code with descriptions + popup modal
// (Your entire original code kept intact, only additions implemented)

import { useState } from 'react';
import { motion } from 'motion/react';
import Header from './Header';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MoodFoodPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

const moods = [
  { emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-400', dishes: [
    { 
      id: 'm1', 
      name: 'Rainbow Salad', 
      price: 220, 
      calories: 180, 
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
      desc: "Happy people choose colourful, fresh foods because they match positive energy and keep the mood light." 
    },
    { 
      id: 'm2', 
      name: 'Fruit Smoothie Bowl', 
      price: 180, 
      calories: 250, 
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
      desc: "Sweet, refreshing fruits enhance the elevated mood and give a natural dopamine boost." 
    },
  ]},

  { emoji: '😔', label: 'Sad', color: 'from-blue-400 to-blue-600', dishes: [
    { 
      id: 's1', 
      name: 'Pastries', 
      price: 280, 
      calories: 520, 
      image: 'https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=2070',
      desc: "Sad people crave soft, sweet foods because sugar gives fast emotional comfort and soothing warmth." 
    },
    { 
      id: 's2', 
      name: 'Chocolate Brownie', 
      price: 150, 
      calories: 380, 
      image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?w=400',
      desc: "Chocolate boosts serotonin and dopamine, giving temporary relief from emotional pain." 
    },
    { 
      id: 's3', 
      name: 'Fries', 
      price: 50, 
      calories: 280, 
      image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=687',
      desc: "Crispy, salty foods distract the mind and release dopamine through crunch and carbs." 
    },
  ]},

  { emoji: '😌', label: 'Calm', color: 'from-green-400 to-teal-400', dishes: [
    { 
      id: 'c1', 
      name: 'Green Tea Matcha', 
      price: 120, 
      calories: 50, 
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
      desc: "Calm moods match smooth, earthy flavours that keep the mind steady and relaxed." 
    },
    { 
      id: 'c2', 
      name: 'Buddha Bowl', 
      price: 240, 
      calories: 320, 
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
      desc: "Balanced bowls help maintain inner peace with light carbs, proteins and greens." 
    },
  ]},

  { emoji: '⚡', label: 'Energetic', color: 'from-red-500 to-orange-500', dishes: [
    { 
      id: 'e1', 
      name: 'Protein Power Bowl', 
      price: 320, 
      calories: 480, 
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
      desc: "High‑protein meals fuel the body’s active state and extend the energy burst." 
    },
    { 
      id: 'e2', 
      name: 'Energy Smoothie', 
      price: 180, 
      calories: 280, 
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
      desc: "Fruits and natural sugars keep energetic moods going strong without crashes." 
    },
  ]},
];

export default function MoodFoodPage({ addToCart, cartCount, onCartClick }: MoodFoodPageProps) {
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [selectedDish, setSelectedDish] = useState<any>(null);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`);
  };

  const DishModal = () => {
    if (!selectedDish) return null;

    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="bg-white rounded-2xl p-6 max-w-md shadow-xl"
          initial={{ scale: 0.8 }} 
          animate={{ scale: 1 }}
        >
          <img 
            src={selectedDish.image} 
            alt={selectedDish.name} 
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{selectedDish.name}</h2>
          <p className="text-gray-700 mb-4">{selectedDish.desc}</p>

          <Button 
            className="w-full bg-[#FF5200]" 
            onClick={() => setSelectedDish(null)}
          >
            Close
          </Button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <motion.div
        className={`bg-gradient-to-r ${selectedMood.color} py-16 transition-all duration-500`}
        key={selectedMood.label}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-8xl mb-4"
          >
            {selectedMood.emoji}
          </motion.div>
          <h1 className="text-4xl mb-2">How are you feeling today?</h1>
          <p className="text-xl opacity-90">Let your mood guide your meal</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">

        {/* Mood Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {moods.map((mood) => (
            <motion.button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 bg-white rounded-2xl shadow-lg text-center transition-all ${
                selectedMood.label === mood.label ? 'ring-4 ring-[#FF5200]' : ''
              }`}
            >
              <div className="text-5xl mb-2">{mood.emoji}</div>
              <p className="text-[#1C1C1C]">{mood.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Recommended Dishes */}
        <motion.div
          key={selectedMood.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl text-[#1C1C1C] mb-8">Recommended for {selectedMood.label} Mood</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {selectedMood.dishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <ImageWithFallback
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedDish(dish)}
                  />
                  <div className="p-4">
                    <h3 className="text-lg text-[#1C1C1C] mb-1">{dish.name}</h3>
                    <p className="text-sm text-[#5E5E5E] mb-4">{dish.calories} cal</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl text-[#FF5200]">₹{dish.price}</span>
                      <Button
                        onClick={() => handleAddToCart(dish)}
                        className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]"
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
      </div>

      {selectedDish && <DishModal />}
    </div>
  );
}