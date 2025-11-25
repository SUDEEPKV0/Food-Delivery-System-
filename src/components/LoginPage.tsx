import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Smartphone, Chrome, Facebook } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setShowOTP(true);
    toast.success('OTP sent to your email!');
  };

  const handleOTPVerify = () => {
    if (otp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }
    toast.success('Login successful! Welcome to YummPort 🚀');
    setTimeout(() => onLogin(), 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FF5200] via-[#FF7A33] to-[#FF5200]">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Logo */}
            <motion.div
              className="text-center mb-8"
              animate={{
                textShadow: [
                  '0 0 10px #FF5200',
                  '0 0 20px #FF7A33',
                  '0 0 10px #FF5200',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="inline-block">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FF5200] to-[#FF7A33] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-4xl">Y</span>
                </div>
                <h1 className="text-3xl text-[#FF5200] mb-2 font-orbitron">
                  YummPort
                </h1>
                <p className="text-[#5E5E5E]">Eat Smart. Live Futuristic.</p>
              </div>
            </motion.div>

            {!showOTP ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm text-[#1C1C1C]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5E5E] w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 border-[#FFF3E6] focus:border-[#FF5200]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#1C1C1C]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5E5E] w-5 h-5" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-2 border-[#FFF3E6] focus:border-[#FF5200]"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full h-12 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Login
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#FFF3E6]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#5E5E5E]">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 border-2 hover:border-[#FF5200] hover:bg-[#FFF3E6]"
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-2 hover:border-[#FF5200] hover:bg-[#FFF3E6]"
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FF5200] to-[#FF7A33] rounded-full flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl text-[#1C1C1C] mb-2">Enter OTP</h3>
                  <p className="text-sm text-[#5E5E5E]">
                    We've sent a 6-digit code to {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest h-14 border-2 border-[#FFF3E6] focus:border-[#FF5200]"
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={handleOTPVerify}
                  className="w-full h-12 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Verify & Continue
                </Button>

                <button
                  onClick={() => setShowOTP(false)}
                  className="w-full text-sm text-[#FF5200] hover:underline"
                >
                  Back to login
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
