import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Mic, Heart, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

export default function ChefYummiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hey there! Chef Yummi at your service! 👨‍🍳 How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickActions = [
    { icon: '🍽', label: 'Order Suggestion', action: 'suggest' },
    { icon: '💪', label: 'Health Tips', action: 'health' },
    { icon: '🌱', label: 'Eco Mode', action: 'eco' },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: inputText }]);
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "That sounds delicious! Have you tried our Paneer Butter Masala?",
        "Great choice! I recommend pairing it with a fresh salad.",
        "Perfect! Don't forget to stay hydrated. Try our fresh fruit smoothies!",
        "Excellent! For your fitness goals, add more protein to your meals.",
        "Wonderful! Let me show you some eco-friendly meal options.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { type: 'bot', text: randomResponse }]);
    }, 1000);

    setInputText('');
  };

  const handleQuickAction = (action: string) => {
    let response = '';
    if (action === 'suggest') {
      response = "Based on your preferences, I suggest trying our Chicken Biryani or Healthy Buddha Bowl today! 🍲";
    } else if (action === 'health') {
      response = "Remember to include colorful vegetables in every meal and drink at least 8 glasses of water daily! 💧";
    } else if (action === 'eco') {
      response = "Great! Switching to eco mode. I'll prioritize restaurants using sustainable packaging! 🌱";
    }
    setMessages((prev) => [...prev, { type: 'bot', text: response }]);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#FF5200] to-[#FF7A33] rounded-full shadow-2xl flex items-center justify-center text-white z-40 hover:shadow-orange-500/50"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👨‍🍳
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border-2 border-[#FF5200]/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                  👨‍🍳
                </div>
                <div>
                  <h3 className="text-white">Chef Yummi</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-white/80">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-[#FFF3E6] border-b flex gap-2 overflow-x-auto">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex-shrink-0 px-3 py-2 bg-white rounded-full text-xs hover:bg-gradient-to-r hover:from-[#FF5200] hover:to-[#FF7A33] hover:text-white transition-all shadow-sm"
                >
                  <span className="mr-1">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white rounded-br-sm'
                          : 'bg-[#FFF3E6] text-[#1C1C1C] rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#FFF3E6] rounded-full transition-colors">
                  <Mic className="w-5 h-5 text-[#FF5200]" />
                </button>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border-[#FFF3E6] focus:border-[#FF5200]"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33] hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-center text-[#5E5E5E] mt-2">
                YummPort keeps every bite fair 🍽️
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
