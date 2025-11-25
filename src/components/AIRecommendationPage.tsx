
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Mic, Plus, X, Trash2, Filter } from 'lucide-react';
import Header from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AIRecommendationPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

export default function AIRecommendationPage({
  addToCart,
  cartCount,
  onCartClick,
}: AIRecommendationPageProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🧠 Suggestion list
  const allSuggestions = [
    'tomato', 'onion', 'cheese', 'garlic', 'basil', 'chicken', 'rice', 'mushroom',
    'egg', 'paneer', 'milk', 'pepper', 'potato', 'carrot', 'spinach', 'bread',
    'flour', 'salt', 'butter', 'yogurt', 'chili', 'cucumber', 'ginger', 'mint',
  ];

  // 🍽 Mock Recommendations
  const mockRecommendations = [
    {
      id: 'ai1',
      name: 'Tomato Basil Pasta',
      calories: 420,
      price: 280,
      confidence: 95,
      image: 'https://images.unsplash.com/photo-1703258581842-31608ecd6528?w=400',
    },
    {
      id: 'ai2',
      name: 'Caprese Salad',
      calories: 180,
      price: 220,
      confidence: 88,
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?w=400',
    },
    {
      id: 'ai3',
      name: 'Margherita Pizza',
      calories: 530,
      price: 320,
      confidence: 92,
      image: 'https://images.unsplash.com/photo-1622883618971-97068745dc6c?w=400',
    },
  ];

  // 🧩 Categories
  const categories = ['All', 'Veg', 'Non-Veg', 'Dairy', 'Spices'];

  // ✅ Add ingredient
  const addIngredient = (text?: string) => {
    const val = (text ?? inputValue).trim();
    if (!val) return;
    if (ingredients.includes(val.toLowerCase())) {
      toast('Ingredient already added');
      setInputValue('');
      return;
    }
    setIngredients([...ingredients, val]);
    setInputValue('');
    setShowSuggestions(false);
  };

  // ✅ Remove ingredient
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // ✅ Clear all ingredients
  const clearAllIngredients = () => {
    setIngredients([]);
    toast.info('All ingredients cleared');
  };

  // ✅ Input filtering logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setInputValue(val);
    if (!val.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = allSuggestions.filter((s) => s.includes(val));
    setFilteredSuggestions(matches);
    setShowSuggestions(true);
    setHighlightIndex(0);
  };

  // ✅ Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      setHighlightIndex((prev) => (prev + 1) % (filteredSuggestions.length || 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex((prev) =>
        prev === 0 ? (filteredSuggestions.length || 1) - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        addIngredient(filteredSuggestions[highlightIndex]);
      } else {
        addIngredient(inputValue);
      }
      setShowSuggestions(false);
    }
  };

  // 🎙️ Voice analyzer (Web Speech API)
  const toggleVoiceListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech Recognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInputValue(transcript);
    };

    recognition.onend = () => {
      setListening(false);
      if (inputValue.trim()) addIngredient(inputValue);
    };

    recognition.onerror = () => {
      toast.error('Error analyzing voice input');
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  // 📸 Upload Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
    toast.success('Image uploaded!');
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    toast.info('Image removed');
  };

  // 🤖 Generate AI recommendations
  const generateRecommendations = () => {
    if (ingredients.length === 0 && !uploadedImage) {
      toast.error('Add ingredients or upload an image first');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsGenerating(false);
      toast.success('AI Recommendations generated!');
    }, 1500);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF5200] to-[#FF7A33] rounded-full mb-4 shadow-md">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-[#1C1C1C]">AI Food Recommendation 🤖</h1>
            <p className="text-[#5E5E5E]">Speak, type, or upload — YummPort will suggest delicious recipes!</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="p-8 bg-white shadow-xl rounded-2xl border-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-medium text-[#1C1C1C]">Your Ingredients</h2>
                <Badge className="bg-[#FF5200]/10 text-[#FF5200]">
                  {ingredients.length} added
                </Badge>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedCategory === cat
                        ? 'bg-[#FF5200] text-white border-[#FF5200]'
                        : 'border-[#FFD9B5] text-[#FF5200] hover:bg-[#FFF3E6]'
                    }`}
                    aria-label={`Filter category ${cat}`}
                  >
                    <Filter className="w-3 h-3 mr-1" />
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Input with Suggestions */}
              <div className="relative mb-6">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type or say an ingredient (e.g., tomato)"
                  className="flex-1 h-12 border-2 border-[#FFE0C2] focus:border-[#FF5200] rounded-lg px-4"
                />
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 mt-1 w-full bg-white border border-[#FFD9B5] rounded-lg shadow-lg max-h-56 overflow-y-auto"
                  >
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((s, index) => {
                        const start = s.toLowerCase().indexOf(inputValue.toLowerCase());
                        const end = start + inputValue.length;
                        return (
                          <div
                            key={s}
                            onClick={() => {
                              addIngredient(s);
                              setShowSuggestions(false);
                            }}
                            className={`px-4 py-2 cursor-pointer ${
                              highlightIndex === index ? 'bg-[#FFF3E6]' : 'hover:bg-[#FFF9F4]'
                            }`}
                            aria-label={`Add ingredient ${s}`}
                          >
                            {s.slice(0, start)}
                            <span className="font-semibold text-[#FF5200]">
                              {s.slice(start, end)}
                            </span>
                            {s.slice(end)}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-sm text-center text-[#5E5E5E]">
                        ❌ No match found for “{inputValue}”
                        <Button
                          size="sm"
                          onClick={() => {
                            addIngredient(inputValue);
                            setShowSuggestions(false);
                          }}
                          className="ml-2 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white rounded-lg"
                          title={`Add ${inputValue}`}
                        >
                          ➕ Add “{inputValue}”
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Voice + Upload Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  variant="outline"
                  onClick={toggleVoiceListening}
                  className={`border-[#FF5200] text-[#FF5200] hover:bg-[#FFF3E6] ${
                    listening ? 'animate-pulse shadow-inner bg-[#FFF9F4]' : ''
                  }`}
                  aria-label="Start or stop voice input"
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {listening ? 'Listening...' : 'Voice Input'}
                </Button>

                <div className="relative flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-photo"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#FF5200] text-[#FF5200] hover:bg-[#FFF3E6] w-full"
                    title="Upload Photo"
                  >
                    <label htmlFor="upload-photo" className="w-full flex justify-center cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </label>
                  </Button>
                </div>
              </div>

              {/* Uploaded Image Preview */}
              {uploadedImage && (
                <div className="relative mb-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded ingredient"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeUploadedImage}
                    aria-label="Remove uploaded photo"
                    title="Remove uploaded photo"
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                  >
                    <X className="w-4 h-4 text-[#FF5200]" />
                  </button>
                </div>
              )}

              {/* Ingredient Chips */}
              <div className="flex flex-wrap gap-2 p-3 bg-[#FFF9F4] rounded-lg border border-dashed border-[#FFE0C2] min-h-[70px] mb-4">
                {ingredients.length === 0 ? (
                  <p className="text-sm text-[#5E5E5E]">Add ingredients to begin...</p>
                ) : (
                  ingredients.map((ingredient, index) => (
                    <motion.div key={index} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                      <Badge className="bg-[#FF5200] text-white px-3 py-1 text-sm flex items-center gap-1">
                        {ingredient}
                        <button
                          onClick={() => removeIngredient(index)}
                          aria-label={`Remove ${ingredient}`}
                          title={`Remove ${ingredient}`}
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={generateRecommendations}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white h-12"
                  aria-label="Generate AI Recipes"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="mr-2"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" /> Generate Recipes 🍽
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAllIngredients}
                  className="h-12 border-[#FF5200] text-[#FF5200] hover:bg-[#FFF3E6]"
                  aria-label="Clear all ingredients"
                  title="Clear all ingredients"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Clear All
                </Button>
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-8 bg-white shadow-lg rounded-2xl border-0">
              <h2 className="text-2xl mb-6 font-medium text-[#1C1C1C]">AI Recommendations</h2>

              {recommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#5E5E5E]">
                  <p>🧠 Add ingredients or upload a photo to generate smart recipes.</p>
                </div>
              ) : (
                <>
                  <div className="bg-[#FFFAF5] text-[#FF5200] rounded-lg p-3 mb-4 text-sm text-center">
                    🍳 Based on your ingredients, YummPort suggests <b>{recommendations.length}</b> dishes you’ll love!
                  </div>
                  <div className="space-y-4">
                    {recommendations.map((dish, index) => (
                      <motion.div
                        key={dish.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-4 border-0 shadow-md">
                          <div className="flex gap-4">
                            <ImageWithFallback
                              src={dish.image}
                              alt={dish.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="text-lg font-semibold">{dish.name}</h3>
                                  <p className="text-sm text-[#5E5E5E]">{dish.calories} cal</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800">
                                  {dish.confidence}% match
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-[#FF5200] font-semibold">₹{dish.price}</span>
                                <Button
                                  onClick={() => handleAddToCart(dish)}
                                  className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white"
                                  aria-label={`Add ${dish.name} to cart`}
                                  title={`Add ${dish.name} to cart`}
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
