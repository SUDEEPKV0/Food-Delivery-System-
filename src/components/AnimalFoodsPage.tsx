import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import Header from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AnimalFoodsPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

type Product = {
  id: string;
  name: string;
  price: number;
  desc: string;
  tags: string[];
  image: string;
};

const animals: { id: string; name: string; emoji: string; info: string; products: Product[] }[] = [
  {
    id: 'cow', name: 'Cow', emoji: '🐄', info: 'Cow milk is calcium-rich and easy to digest for many people.', products: [
      { id: 'cow1', name: 'Fresh Milk', price: 60, desc: 'Locally sourced fresh milk, lightly pasteurised.', tags: ['High Protein','Rich in Calcium'], image: 'https://i.pinimg.com/originals/49/fe/60/49fe60cd9578aebbdbf95ca65f16162b.jpg' },
      { id: 'cow2', name: 'A2 Gir Cow Milk', price: 120, desc: 'A2 protein milk from Gir cows, gentler on digestion.', tags: ['A2 Certified','Lactose Friendly'], image: 'https://5.imimg.com/data5/SELLER/Default/2025/2/492294243/LC/BG/XQ/210581750/300ml-a2-natural-gir-cow-milk-1000x1000.jpg' },
      { id: 'cow3', name: 'Cow Ghee', price: 450, desc: 'Clarified butter made from cow milk, rich flavor.', tags: ['Rich in Calcium','Organic'], image: 'https://m.media-amazon.com/images/I/71suS7NX1VL._SL1500_.jpg' },
      { id: 'cow4', name: 'Organic Curd', price: 90, desc: 'Probiotic curd made from organic milk.', tags: ['Organic','Rich in Calcium'], image: 'https://m.media-amazon.com/images/I/71g4UcyzeDS._SL1500_.jpg' },
      { id: 'cow5', name: 'Cow Butter', price: 140, desc: 'Creamy butter from churned fresh cream.', tags: ['Rich in Calcium'], image: 'https://assets.iceland.co.uk/i/iceland/golden_cow_100_butter_227g_91209_T1.jpg' },
      { id: 'cow6', name: 'Farm Paneer', price: 220, desc: 'Soft cottage cheese, high in protein.', tags: ['High Protein','Organic'], image: 'https://5.imimg.com/data5/SELLER/Default/2022/2/LK/AJ/PM/95184180/paneer-1-1000x1000.png' },
    ]
  },
  {
    id: 'buffalo', name: 'Buffalo', emoji: '🐃', info: 'Buffalo milk has higher fat content and a creamy texture.', products: [
      { id: 'buf1', name: 'Buffalo Milk', price: 70, desc: 'Rich and creamy buffalo milk for full-bodied taste.', tags: ['Rich in Calcium'], image: 'https://th.bing.com/th/id/R.8fccde957c5120b10ec0f999e12deedc?rik=OoHBAxmsMoT%2b1A&riu=http%3a%2f%2famul.com%2ffiles%2fproducts%2famul-buffalo.png&ehk=ZYB%2fYP%2b6WUk1cTTcmm1ElLflVCO%2bp5jyWcfrWqju9qs%3d&risl=&pid=ImgRaw&r=0' },
      { id: 'buf2', name: 'Buffalo Ghee', price: 500, desc: 'Ghee with deep flavor, ideal for traditional cooking.', tags: ['Rich in Calcium','Organic'], image: 'https://m.media-amazon.com/images/I/61dP8pJKE7L._SL1500_.jpg' },
      { id: 'buf3', name: 'Malai Cream', price: 160, desc: 'Thick malai for desserts and rich recipes.', tags: ['High Protein'], image: 'https://www.priyascurrynation.com/wp-content/uploads/2017/08/DSC_0007.jpg' },
      { id: 'buf4', name: 'Buffalo Paneer', price: 260, desc: 'Dense paneer made from buffalo milk.', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1548943487-a2e4e1a3d571?w=800' },
    ]
  },
  {
    id: 'goat', name: 'Goat', emoji: '🐐', info: 'Goat milk is often easier to digest and naturally homogenized.', products: [
      { id: 'go1', name: 'Goat Milk', price: 90, desc: 'Light, slightly sweet goat milk.', tags: ['Lactose Friendly','High Protein'], image: 'https://images.unsplash.com/photo-1542444459-db3d1f0a6b36?w=800' },
      { id: 'go2', name: 'Goat Cheese', price: 280, desc: 'Tangy cheese perfect for salads.', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1542444459-db3d1f0a6b36?w=800' },
      { id: 'go3', name: 'Goat Yogurt', price: 110, desc: 'Probiotic yogurt gentle on stomach.', tags: ['Organic','Lactose Friendly'], image: 'https://images.unsplash.com/photo-1542444459-db3d1f0a6b36?w=800' },
    ]
  },
  {
    id: 'camel', name: 'Camel', emoji: '🐪', info: 'Camel milk is nutrient-dense and contains unique proteins.', products: [
      { id: 'cam1', name: 'Camel Milk', price: 120, desc: 'Light and nutritious camel milk.', tags: ['Rich in Calcium'], image: 'https://www.boldsky.com/img/2018/07/camel-milk-1531115110.jpg' },
      { id: 'cam2', name: 'Camel Milk Powder', price: 420, desc: 'Powdered camel milk for longer shelf life.', tags: ['Rich in Calcium'], image: 'https://5.imimg.com/data5/OE/RY/VH/SELLER-19301686/camel-milk-powder-500-gms-100-pure-natural-freeze-dried-pack-of-25-sachets-1000x1000.png' },
    ]
  },
  {
    id: 'sheep', name: 'Sheep', emoji: '🐑', info: 'Sheep milk is rich and flavorful, great for cheeses.', products: [
      { id: 'she1', name: 'Sheep Milk', price: 150, desc: 'Full-flavored sheep milk for specialty uses.', tags: ['Rich in Calcium'], image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800' },
      { id: 'she2', name: 'Sheep Cheese', price: 320, desc: 'Distinctive cheese with a creamy texture.', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800' },
    ]
  },
  {
    id: 'yak', name: 'Yak', emoji: '🦬', info: 'Yak milk is high in fat and perfect for high-energy diets.', products: [
      { id: 'yak1', name: 'Yak Butter', price: 280, desc: 'Rich butter made from yak milk.', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800' },
      { id: 'yak2', name: 'Yak Milk', price: 200, desc: 'Thick and nutritious yak milk.', tags: ['Rich in Calcium'], image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800' },
    ]
  },
  {
    id: 'donkey', name: 'Donkey', emoji: '🫏', info: 'Donkey milk is gentle and traditionally used for skincare.', products: [
      { id: 'don1', name: 'Donkey Milk', price: 220, desc: 'Mild-flavored milk often used in cosmetics.', tags: ['Lactose Friendly'], image: 'https://images.unsplash.com/photo-1556228453-2f7f38b7b1c8?w=800' },
      { id: 'don2', name: 'Donkey Milk Soap', price: 180, desc: 'Soap made with donkey milk for sensitive skin.', tags: ['Organic'], image: 'https://images.unsplash.com/photo-1556228453-2f7f38b7b1c8?w=800' },
    ]
  },
  {
    id: 'reindeer', name: 'Reindeer', emoji: '🦌', info: 'Reindeer milk is very rich and used in northern cultures.', products: [
      { id: 'rei1', name: 'Reindeer Milk', price: 300, desc: 'High-fat traditional milk used in cold climates.', tags: ['High Protein','Rich in Calcium'], image: 'https://images.unsplash.com/photo-1485963631004-f2f5695d2a2d?w=800' },
    ]
  },
  {
    id: 'a2-desi', name: 'A2 Desi Cow', emoji: '🐮', info: 'A2 Desi Cow milk is prized for its A2 protein.', products: [
      { id: 'a2-1', name: 'A2 Desi Milk', price: 140, desc: 'Authentic A2 milk from desi breeds.', tags: ['A2 Certified','Lactose Friendly'], image: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac2?w=800' },
      { id: 'a2-2', name: 'A2 Ghee', price: 480, desc: 'Ghee prepared from A2 milk with rich aroma.', tags: ['A2 Certified','Organic'], image: 'https://images.unsplash.com/photo-1548943487-a2e4e1a3d571?w=800' },
    ]
  },
  {
    id: 'organic', name: 'Organic Farm Mixed', emoji: '🏡', info: 'A mixed selection from certified organic farms.', products: [
      { id: 'org1', name: 'Organic Milk', price: 160, desc: 'Certified organic milk from mixed herds.', tags: ['Organic','Rich in Calcium'], image: 'https://images.unsplash.com/photo-1546086614-7c9e9a5fb2f0?w=800' },
      { id: 'org2', name: 'Organic Paneer', price: 260, desc: 'Handmade paneer from organic milk.', tags: ['Organic','High Protein'], image: 'https://images.unsplash.com/photo-1604908177522-9e5a6b8c7f5f?w=800' },
    ]
  },
];

export default function AnimalFoodsPage({ addToCart, cartCount, onCartClick }: AnimalFoodsPageProps) {
  const [selectedId, setSelectedId] = useState(animals[0].id);
  const [query, setQuery] = useState('');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<'low' | 'high' | 'none'>('none');

  const selected = animals.find(a => a.id === selectedId) || animals[0];

  const products = useMemo(() => {
    let list = selected.products.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    if (onlyOrganic) {
      list = list.filter(p => p.tags.includes('Organic') || p.tags.includes('A2 Certified'));
    }
    if (tagFilter) {
      list = list.filter(p => p.tags.includes(tagFilter));
    }
    if (sort === 'low') list = list.sort((a,b) => a.price - b.price);
    if (sort === 'high') list = list.sort((a,b) => b.price - a.price);
    return list;
  }, [selected, query, onlyOrganic, tagFilter, sort]);

  const handleAdd = (p: Product) => {
    addToCart(p);
    toast.success(`${p.name} added to cart 🛒🥛`);
  };

  const allTags = useMemo(() => {
    const s = new Set<string>();
    animals.forEach(a => a.products.forEach(p => p.tags.forEach(t=>s.add(t))));
    return Array.from(s);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="bg-gradient-to-r from-[#EDE0D4] to-[#FFF3E6] py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl text-[#1C1C1C] mb-2">Farm Fresh Animal Products</h1>
          <p className="text-[#5E5E5E]">Explore authentic dairy & specialty products from trusted sources</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 w-full sm:w-2/3">
            <input aria-label="Search products" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search milk, ghee, paneer..." className="flex-1 rounded-full border px-4 py-2 shadow-sm" />
            <div className="flex items-center gap-2">
              <select aria-label="Sort products" value={sort} onChange={(e)=>setSort(e.target.value as any)} className="rounded-md border px-3 py-2">
                <option value="none">Sort</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-[#5E5E5E]"><input type="checkbox" checked={onlyOrganic} onChange={(e)=>setOnlyOrganic(e.target.checked)} className="accent-[#FF5200]" /> Organic only</label>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {allTags.map(t => (
              <button key={t} onClick={()=>setTagFilter(tagFilter===t?null:t)} className={`px-3 py-1 rounded-full text-sm ${tagFilter===t?'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white':'bg-[#F4F4F4] text-[#1C1C1C]'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
          <div className="flex gap-4 px-4 sm:px-0 lg:grid lg:grid-cols-6">
            {animals.map(a => (
              <motion.button key={a.id} onClick={()=>{setSelectedId(a.id); setQuery(''); setTagFilter(null);}} whileHover={{ scale: 1.03 }} className={`min-w-[140px] sm:min-w-0 p-4 rounded-2xl shadow-lg text-center transition-all ${selectedId===a.id? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white ring-4 ring-[#FF5200]/30':'bg-white text-[#1C1C1C]'}`}>
                <div className="text-2xl sm:text-4xl mb-1">{a.emoji}</div>
                <div className="text-sm font-medium">{a.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{selected.emoji}</div>
              <div>
                <h2 className="text-lg text-[#1C1C1C] font-medium">{selected.name}</h2>
                <p className="text-sm text-[#5E5E5E]">{selected.info}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <Card key={p.id} className="rounded-2xl overflow-hidden border-0 shadow-lg">
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <ImageWithFallback src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                  <div className="absolute top-3 left-3 bg-white/80 rounded-full px-2 py-1 text-sm">{selected.emoji}</div>
                </motion.div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg text-[#1C1C1C]">{p.name}</h3>
                      <p className="text-sm text-[#5E5E5E] line-clamp-2">{p.desc}</p>
                    </div>
                    <div className="text-xl text-[#FF5200]">₹{p.price}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tags.map(t => <span key={t} className="px-2 py-0.5 text-xs bg-[#F4F4F4] rounded-full">{t}</span>)}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={()=>handleAdd(p)} size="sm" className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">Add to Cart</Button>
                    <Button onClick={()=>toast(`Saved ${p.name} (simulated)`)} size="sm" className="bg-white border text-[#1C1C1C]">Save</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
