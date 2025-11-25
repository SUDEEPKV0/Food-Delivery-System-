import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import GroupOrderPage from './components/GroupOrderPage';
import AIRecommendationPage from './components/AIRecommendationPage';
import MoodFoodPage from './components/MoodFoodPage';
import FoodScannerPage from './components/FoodScannerPage';
import VoiceSearchPage from './components/VoiceSearchPage';
import CalorieVisualizerPage from './components/CalorieVisualizerPage';
import SymptomFoodPage from './components/SymptomFoodPage';
import GymSpacePage from './components/GymSpacePage';
import AnimalFoodsPage from './components/AnimalFoodsPage';
import TemplePrasadamPage from './components/TemplePrasadamPage';
import GiftPartyPage from './components/GiftPartyPage';
import InternationalSweetsPage from './components/InternationalSweetsPage';
import DatasetVisualizerPage from './components/DatasetVisualizerPage';
import CartDrawer from './components/CartDrawer';
import ChefYummiAssistant from './components/ChefYummiAssistant';
import { Toaster } from './components/ui/sonner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: any) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(i => i.id !== id));
    } else {
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FFF3E6]">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/" /> : 
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <HomePage 
                addToCart={addToCart} 
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/menu" 
            element={
              isAuthenticated ? 
              <MenuPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/group-order" 
            element={
              isAuthenticated ? 
              <GroupOrderPage 
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/ai-recommendation" 
            element={
              isAuthenticated ? 
              <AIRecommendationPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/mood-food" 
            element={
              isAuthenticated ? 
              <MoodFoodPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/food-scanner" 
            element={
              isAuthenticated ? 
              <FoodScannerPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/voice-search" 
            element={
              isAuthenticated ? 
              <VoiceSearchPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/calorie-visualizer" 
            element={
              isAuthenticated ? 
              <CalorieVisualizerPage 
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/symptom-food" 
            element={
              isAuthenticated ? 
              <SymptomFoodPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/gym-space" 
            element={
              isAuthenticated ? 
              <GymSpacePage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/animal-foods" 
            element={
              isAuthenticated ? 
              <AnimalFoodsPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/temple-prasadam" 
            element={
              isAuthenticated ? 
              <TemplePrasadamPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/gift-party" 
            element={
              isAuthenticated ? 
              <GiftPartyPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/sweets" 
            element={
              isAuthenticated ? 
              <InternationalSweetsPage 
                addToCart={addToCart}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/datasets" 
            element={
              isAuthenticated ? 
              <DatasetVisualizerPage 
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
              /> : 
              <Navigate to="/login" />
            } 
          />
          {/* Catch-all route for unmatched paths */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
          />
        </Routes>

        {isAuthenticated && (
          <>
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              items={cartItems}
              updateQuantity={updateCartQuantity}
              clearCart={clearCart}
            />
            <ChefYummiAssistant />
          </>
        )}

        <Toaster />
      </div>
    </Router>
  );
}

export default App;
