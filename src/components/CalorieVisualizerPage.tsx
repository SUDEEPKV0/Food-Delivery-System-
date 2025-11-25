import { motion } from 'motion/react';
import { Flame, TrendingUp, Activity } from 'lucide-react';
import Header from './Header';
import { Card } from './ui/card';

interface CalorieVisualizerPageProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function CalorieVisualizerPage({ cartCount, onCartClick }: CalorieVisualizerPageProps) {
  const goal = 2200;
  const consumed = 1640;
  const remaining = goal - consumed;
  const percentage = (consumed / goal) * 100;

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl text-[#1C1C1C] mb-2">Holographic Calorie Visualizer 🔥</h1>
            <p className="text-[#5E5E5E]">Track your daily energy flow</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-to-br from-[#FFD54F]/20 to-white border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-6 h-6 text-[#FF5200]" />
                  <h3 className="text-xl text-[#1C1C1C]">Daily Calorie Goal</h3>
                </div>
                <p className="text-3xl text-[#FF5200]">{goal} kcal</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#FF5200]/10 to-white border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-[#FF5200]" />
                  <h3 className="text-xl text-[#1C1C1C]">Consumed</h3>
                </div>
                <p className="text-3xl text-[#FF5200]">{consumed} kcal</p>
                <p className="text-sm text-[#5E5E5E]">{percentage.toFixed(0)}% of goal reached</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-100 to-white border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl text-[#1C1C1C]">Remaining</h3>
                </div>
                <p className="text-3xl text-green-600">{remaining} kcal left</p>
                <p className="text-sm text-[#5E5E5E]">Light dinner recommended 🥗</p>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-br from-[#1C1C1C] to-[#FF5200]/20 border-0 shadow-2xl flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="20" />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="20"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - percentage / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - percentage / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5200" />
                      <stop offset="100%" stopColor="#FFD54F" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <p className="text-5xl mb-2">{percentage.toFixed(0)}%</p>
                  <p className="text-sm opacity-75">Daily Progress</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
