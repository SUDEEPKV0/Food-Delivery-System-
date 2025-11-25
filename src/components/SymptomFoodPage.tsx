import { useState } from 'react';
import { motion } from 'motion/react';
import Header from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SymptomFoodPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

type Item = {
  id: string;
  name: string;
  price: number;
  type: 'food' | 'medicine';
  image: string;
  shortDesc: string;
  when: string;
  how?: string;
}

const symptoms: { id: string; icon: string; label: string; items: Item[] }[] = [
  {
    id: 's1', icon: '🤒', label: 'Cold & Fever', items: [
      { id: 'c1', name: 'Ginger Tea', price: 60, type: 'food', image: 'https://tse4.mm.bing.net/th/id/OIP.qs3Yuwi_Dc1PLfgE12LvyAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', shortDesc: 'Reduces inflammation and soothes throat.', when: 'Consume hot, 2-3 times daily' },
      { id: 'c2', name: 'Vitamin C', price: 120, type: 'medicine', image: 'https://5.imimg.com/data5/ANDROID/Default/2024/1/373801242/SD/GK/NW/186954350/product-jpeg-1000x1000.jpg', shortDesc: 'Boosts immunity and reduces symptom duration.', when: 'Once daily after food', how: 'Antioxidant that supports immune response' },
    ]
  },
  {
    id: 's2', icon: '🤢', label: 'Indigestion', items: [
      { id: 'i1', name: 'Curd Rice', price: 80, type: 'food', image: 'https://www.indianveggiedelight.com/wp-content/uploads/2022/08/curd-rice-featured.jpg', shortDesc: 'Cool, soothing and helps restore gut flora.', when: 'After spicy meals or at night' },
      { id: 'i2', name: 'Antacid', price: 40, type: 'medicine', image: 'https://i5.walmartimages.com/seo/Equate-Extra-Strength-Antacid-Chewable-Wintergreen-Tablets-over-the-Counter-750-mg-96-Ct_fa02be5c-6dda-4bb6-97a7-850ef80b5dc0_1.d639d50e82b99fa5ce7a6bdd0d6a4f64.jpeg', shortDesc: 'Neutralizes stomach acid quickly.', when: 'When symptoms appear', how: 'Neutralizes excess gastric acid' },
    ]
  },
  {
    id: 's3', icon: '😫', label: 'Headache', items: [
      { id: 'h1', name: 'Green Tea', price: 50, type: 'food', image: 'https://tse2.mm.bing.net/th/id/OIP.VxlfmYrVcKtbO0Z_ilsdTQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', shortDesc: 'Contains L-theanine to relax nerves.', when: 'Sip slowly when feeling tension' },
      { id: 'h2', name: 'Ibuprofen', price: 80, type: 'medicine', image: 'https://image.made-in-china.com/2f0j00qkdhRsrFZHfp/Ibuprofen-Tablets-GMP-Western-Medicines.jpg', shortDesc: 'Relieves pain and reduces inflammation.', when: 'As directed on label', how: 'Inhibits COX enzymes reducing prostaglandins' },
    ]
  },
  {
    id: 's4', icon: '😴', label: 'Fatigue', items: [
      { id: 'f1', name: 'Protein Smoothie', price: 150, type: 'food', image: 'https://tse2.mm.bing.net/th/id/OIP.wRfHbQeLT2Nl-5KcxIFebwHaLF?rs=1&pid=ImgDetMain&o=7&rm=3', shortDesc: 'Quick energy and muscle support.', when: 'Morning or post-workout' },
      { id: 'f2', name: 'Multivitamin', price: 180, type: 'medicine', image: 'https://i5.walmartimages.com/asr/0853a1f6-5e9d-4edc-9132-8f53c7be9cdc.339969433bbce48b90ae559619097389.jpeg', shortDesc: 'Supports overall nutrient needs.', when: 'Once daily with breakfast', how: 'Provides essential vitamins and minerals' },
    ]
  },
  {
    id: 's5', icon: '🤕', label: 'Body Pain', items: [
      { id: 'b1', name: 'Hot Soup', price: 130, type: 'food', image: 'https://tse2.mm.bing.net/th/id/OIP.GzIeN2Wv11i2uQSxMoyspAHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3', shortDesc: 'Warm fluids ease muscle tension.', when: 'Warm, during rest' },
      { id: 'b2', name: 'Paracetamol', price: 70, type: 'medicine', image: 'https://tse1.mm.bing.net/th/id/OIP.SNaa-lZIIsyVBsOkzQlirgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', shortDesc: 'Relieves mild to moderate pain.', when: 'As needed', how: 'Blocks pain signals in the brain' },
    ]
  },
  {
    id: 's6', icon: '🤧', label: 'Cough', items: [
      { id: 'co1', name: 'Honey Lemon Drink', price: 90, type: 'food', image: 'https://png.pngtree.com/thumb_back/fw800/background/20240712/pngtree-warm-water-honey-lemon-drink-image_15871993.jpg', shortDesc: 'Coats throat and soothes cough.', when: 'Warm, several times a day' },
      { id: 'co2', name: 'Cough Suppressant', price: 110, type: 'medicine', image: 'https://tse1.mm.bing.net/th/id/OIP.Itomqtc6QlE9QTPEuCovnQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', shortDesc: 'Reduces cough reflex.', when: 'As directed', how: 'Acts on cough center in the brain' },
    ]
  },
  {
    id: 's7', icon: '😟', label: 'Stress', items: [
      { id: 'st1', name: 'Dark Chocolate', price: 120, type: 'food', image: 'https://www.ehavene.com.bd/uploads/products/photos/jcaRKXyQ3iP3Z7icO2HSK6BaoQLYyehYo4aQ2wGn.jpg', shortDesc: 'Improves mood and reduces cortisol.', when: 'A small square as a treat' },
      { id: 'st2', name: 'Ashwagandha Tablet', price: 220, type: 'medicine', image: 'https://ayurvedaproducts.co.uk/wp-content/uploads/2021/10/Himalaya-Ashwagandha-Tablets.jpg', shortDesc: 'Adaptogen that reduces stress.', when: 'Once daily', how: 'Modulates HPA axis response' },
    ]
  },
  {
    id: 's8', icon: '🥱', label: 'Weakness', items: [
      { id: 'w1', name: 'Banana & Nut Bowl', price: 140, type: 'food', image: 'https://tse3.mm.bing.net/th/id/OIP.0h8BRFuexUtfBZZdZC6IjQHaLG?rs=1&pid=ImgDetMain&o=7&rm=3', shortDesc: 'Potassium and quick carbs restore energy.', when: 'Snack between meals' },
      { id: 'w2', name: 'Iron Supplement', price: 160, type: 'medicine', image: 'https://m.media-amazon.com/images/I/81Dn4QHXXJL.jpg', shortDesc: 'Helps correct iron deficiency.', when: 'With orange juice', how: 'Provides elemental iron for hemoglobin synthesis' },
    ]
  },
];

export default function SymptomFoodPage({ addToCart, cartCount, onCartClick }: SymptomFoodPageProps) {
  const [selectedId, setSelectedId] = useState(symptoms[0].id);
  const [animAdded, setAnimAdded] = useState<string | null>(null);

  const selected = symptoms.find(s => s.id === selectedId) || symptoms[0];

  const handleAddToCart = (item: Item) => {
    addToCart(item);
    setAnimAdded(item.id);
    toast.success(`${item.name} added to cart! 🛒`);
    // pulse animation state
    setTimeout(() => setAnimAdded(null), 800);
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl text-[#1C1C1C] font-medium mb-1">Feeling Unwell? Instant Dietary & Medicine Guidance</h1>
            <p className="text-sm sm:text-base text-[#5E5E5E]">Select a symptom to view curated foods and medicines recommended by YummPort</p>
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
            <div className="flex gap-4 px-4 sm:px-0 lg:grid lg:grid-cols-3">
              {symptoms.map(symptom => (
                <motion.button
                  key={symptom.id}
                  onClick={() => setSelectedId(symptom.id)}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`min-w-[160px] sm:min-w-0 flex-shrink-0 p-4 rounded-2xl shadow-lg text-center transition-all ${selectedId === symptom.id ? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white ring-4 ring-[#FF5200]/30' : 'bg-white text-[#1C1C1C]'}`}
                >
                  <div className="text-3xl sm:text-5xl mb-2">{symptom.icon}</div>
                  <p className="text-sm sm:text-lg font-medium">{symptom.label}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6">
            <h2 className="text-xl sm:text-2xl text-[#1C1C1C] mb-4">Recommended for {selected.label}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selected.items.map(item => (
                <Card key={item.id} className={`p-4 border-0 shadow-lg hover:shadow-xl transition-shadow transform-gpu ${animAdded === item.id ? 'animate-pulse' : ''}`}>
                  <motion.div whileHover={{ scale: 1.02 }} className="flex gap-4 items-start">
                    <div className="w-24 h-24 flex-none">
                      <ImageWithFallback src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg text-[#1C1C1C] font-medium">{item.name}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm text-[#5E5E5E]">{item.type === 'food' ? '🍲 Food' : '💊 Medicine'}</span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[#F4F4F4] text-[#1C1C1C]">₹{item.price}</span>
                          </div>
                        </div>
                        <div className="text-sm text-[#FF5200]"> </div>
                      </div>

                      <p className="text-sm text-[#5E5E5E] line-clamp-2 mb-2">{item.shortDesc}</p>
                      <p className="text-xs text-[#5E5E5E] mb-3"><strong>When:</strong> {item.when}</p>
                      {item.how && <p className="text-xs text-[#5E5E5E] mb-3"><strong>How:</strong> {item.how}</p>}

                      <div className="flex items-center gap-3">
                        <Button onClick={() => handleAddToCart(item)} size="sm" className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">Add to Cart</Button>
                        <Button onClick={() => toast(`Saved ${item.name} to favorites (simulated)`)} size="sm" className="bg-white border text-[#1C1C1C]">Save</Button>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
