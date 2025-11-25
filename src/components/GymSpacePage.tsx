 
import { useState } from 'react';
import { motion } from 'motion/react';
import Header from './Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GymSpacePageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

const goals = {
  skinny: [
    { id: 'g1', name: 'Protein Shake', price: 180, calories: 380, protein: 25, image: 'https://www.eatwell101.com/wp-content/uploads/2022/06/quick-Protein-Shake-Recipe.jpg' },
    { id: 'g2', name: 'Peanut Butter ', price: 220, calories: 420, protein: 18, image: 'https://cheerfulchoices.com/wp-content/uploads/2021/05/Peanut-Butter-Smoothie-Bowl-3-1024x729.jpeg' },
    { id: 'g3', name: 'Dry Fruits Shake ', price: 85, calories: 120, protein: 50, image: 'https://cdn.grofers.com/assets/search/usecase/banner/dry_fruit_shake_01.png' },
    { id: 'g4', name: 'Tofu ', price: 155, calories: 320, protein: 38, image: 'https://sharethespice.com/wp-content/uploads/2022/05/Tofu-Featured.jpg' },
    { id: 'g5', name: 'Quinoa ', price: 166, calories: 220, protein: 35, image: 'https://greenbowl2soul.com/wp-content/uploads/2020/09/Healthy-quinoa-recipe-1024x1024.jpg' },
    { id: 'g6', name: 'Lentils ', price: 100, calories: 350, protein: 18, image: 'https://www.aheadofthyme.com/wp-content/uploads/2020/03/easy-one-pot-lentils.jpg' },
  ],
  fat: [
    { id: 'g3', name: 'Green Salad', price: 160, calories: 180, protein: 8, image: 'https://www.lecremedelacrumb.com/wp-content/uploads/2019/01/best-simple-green-salad-3.jpg' },
    { id: 'g4', name: 'Grilled Chicken', price: 280, calories: 220, protein: 32, image: 'https://www.themediterraneandish.com/wp-content/uploads/2023/06/Grilled-Chicken-0136.jpg' },
    { id: 'g5',name: "Oats Bowl",price: 140,calories: 150,protein: 12,image: 'https://tse4.mm.bing.net/th/id/OIP.JBHoDynDoNMHoplsIADUcwHaHa?w=720&h=720&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 'f2', name: 'Brown Rice', price: 180, calories: 200, protein: 9, image: 'https://glendaembree.com/wp-content/uploads/2022/09/Brown-Rice-FEATURE.jpg' },
    { id: 'f3', name: 'Roti Sabzi', price: 150, calories: 250, protein: 11, image: 'https://i.pinimg.com/736x/f3/c5/0b/f3c50bcb1cd2780a0b7c2cfbe9dec7c9.jpg' },
    { id: 'f4', name: 'Roasted Sweet Potatoes', price: 130, calories: 160, protein: 6, image: 'https://biteontheside.com/wp-content/uploads/2021/12/honey-roasted-sweet-potatoes-4-768x1024.jpg' }
  ],
  diet: [
    { id: 'g5', name: 'Balanced Bowl', price: 240, calories: 350, protein: 15, image: 'https://tse2.mm.bing.net/th/id/OIP.LypDza8fyi4BtmPZ89VimgHaHa?w=1500&h=1500&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 'g6', name: 'Quinoa Salad', price: 200, calories: 290, protein: 12, image: 'https://peasandcrayons.com/wp-content/uploads/2018/06/healthy-quinoa-salad-recipe-5.jpg' },
    { id: 'd1', name: 'Coconut Water', price: 60, calories: 45, protein: 0, image: 'https://www.healthifyme.com/blog/wp-content/uploads/2023/01/shutterstock_2149991827-1.jpg' },
    { id: 'd2', name: 'Green Tea', price: 70, calories: 2, protein: 0, image: 'https://cff2.earth.com/uploads/2022/07/29091859/Green-tea-scaled.jpg' },
    { id: 'd3', name: 'Spinach Juice', price: 90, calories: 30, protein: 3, image: 'https://buildyourbite.com/wp-content/uploads/2024/01/Spinach-Juice-53.jpg' },
    { id: 'd4', name: 'Sprouts Bowl', price: 120, calories: 100, protein: 8, image: 'https://thewonderfulworldofsprouts.com/wp-content/uploads/2024/02/Alfalfa-Sprout-2.jpg' }
  ],
};

export default function GymSpacePage({ addToCart, cartCount, onCartClick }: GymSpacePageProps) {
  const [activeGoal, setActiveGoal] = useState('skinny');

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to your nutrition plan! 💪`);
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 py-16 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl mb-4">💪</div>
          <h1 className="text-4xl mb-2">Your Gym Space</h1>
          <p className="text-xl opacity-90">Personalized Nutrition Plans for Every Goal</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeGoal} onValueChange={setActiveGoal}>
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white">
            <TabsTrigger value="skinny" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              🏃 Gain Weight
            </TabsTrigger>
            <TabsTrigger value="fat" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              🔥 Lose Fat
            </TabsTrigger>
            <TabsTrigger value="diet" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              ⚖️ Balanced Diet
            </TabsTrigger>
          </TabsList>

          {Object.entries(goals).map(([key, items]) => (
            <TabsContent key={key} value={key}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-0 shadow-lg">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg text-[#1C1C1C] mb-2">{item.name}</h3>
                      <div className="flex gap-4 text-sm text-[#5E5E5E] mb-3">
                        <span>{item.calories} cal</span>
                        <span>{item.protein}g protein</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl text-[#FF5200]">₹{item.price}</span>
                        <Button onClick={() => handleAddToCart(item)} className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">
                          Add
                        </Button>
                      </div>
                    </div>
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

