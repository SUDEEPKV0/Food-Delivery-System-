import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Copy } from 'lucide-react';
import Header from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface DatasetVisualizerPageProps {
  cartCount: number;
  onCartClick: () => void;
}

const datasets = {
  food: [
    { id: 'F001', name: 'Paneer Curry', category: 'Indian', price: 180, rating: 4.7, calories: 420 },
    { id: 'F002', name: 'Pizza', category: 'Italian', price: 320, rating: 4.5, calories: 530 },
    { id: 'F003', name: 'Sushi Roll', category: 'Japanese', price: 480, rating: 4.8, calories: 370 },
  ],
  restaurant: [
    { id: 'R001', name: 'Davangere Resto', cuisine: 'Indian', rating: 4.3, priceForTwo: '₹400' },
    { id: 'R002', name: 'Pizza Paradise', cuisine: 'Italian', rating: 4.5, priceForTwo: '₹500' },
    { id: 'R003', name: 'Sushi Station', cuisine: 'Japanese', rating: 4.7, priceForTwo: '₹800' },
  ],
  user: [
    { id: 'U001', name: 'Rahul Kumar', email: 'rahul@example.com', orders: 12, totalSpent: '₹3,450' },
    { id: 'U002', name: 'Priya Sharma', email: 'priya@example.com', orders: 8, totalSpent: '₹2,120' },
    { id: 'U003', name: 'Amit Patel', email: 'amit@example.com', orders: 15, totalSpent: '₹4,890' },
  ],
  order: [
    { id: 'O001', user: 'Rahul Kumar', items: 3, total: '₹820', status: 'Delivered' },
    { id: 'O002', user: 'Priya Sharma', items: 2, total: '₹540', status: 'In Transit' },
    { id: 'O003', user: 'Amit Patel', items: 4, total: '₹1,120', status: 'Delivered' },
  ],
};

export default function DatasetVisualizerPage({ cartCount, onCartClick }: DatasetVisualizerPageProps) {
  const [activeDataset, setActiveDataset] = useState('food');

  const copyJSON = () => {
    const data = JSON.stringify(datasets[activeDataset as keyof typeof datasets], null, 2);
    navigator.clipboard.writeText(data);
    toast.success('JSON copied to clipboard! 📋');
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="bg-gradient-to-r from-[#1C1C1C] to-[#FF5200]/50 py-16 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Database className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl mb-2">Dataset Visualization 📊</h1>
          <p className="text-xl opacity-90">For Teachers & Evaluators</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Toggle Menu */}
          <Card className="p-6 border-0 shadow-lg h-fit">
            <h2 className="text-xl text-[#1C1C1C] mb-4">Explore Datasets 🔍</h2>
            <div className="space-y-2">
              {[
                { key: 'food', label: '🍲 Food Dataset', icon: '🍲' },
                { key: 'restaurant', label: '🍴 Restaurant Dataset', icon: '🍴' },
                { key: 'user', label: '👤 User Dataset', icon: '👤' },
                { key: 'order', label: '📦 Order Dataset', icon: '📦' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveDataset(item.key)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    activeDataset === item.key
                      ? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white'
                      : 'bg-white hover:bg-[#FFF3E6] text-[#1C1C1C]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Data Display */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6 border-0 shadow-lg bg-[#1C1C1C]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">JSON View</h3>
                <Button
                  onClick={copyJSON}
                  size="sm"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <pre className="text-sm text-green-400 overflow-x-auto p-4 bg-black/30 rounded-lg">
                {JSON.stringify(datasets[activeDataset as keyof typeof datasets], null, 2)}
              </pre>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-white/50 backdrop-blur">
              <h3 className="text-xl text-[#1C1C1C] mb-4">Table View</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#FF5200]">
                      {Object.keys(datasets[activeDataset as keyof typeof datasets][0]).map((key) => (
                        <th key={key} className="text-left p-3 text-[#FF5200]">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {datasets[activeDataset as keyof typeof datasets].map((row: any) => (
                      <tr key={row.id} className="border-b hover:bg-[#FFF3E6] transition-colors">
                        {Object.values(row).map((value: any, i) => (
                          <td key={i} className="p-3 text-[#1C1C1C]">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
