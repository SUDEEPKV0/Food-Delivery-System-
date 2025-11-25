import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  updateQuantity,
  clearCart,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const delivery = subtotal > 0 ? 50 : 0;
  const discount = subtotal > 500 ? 20 : 0;
  const total = subtotal + tax + delivery - discount;

  const handleCheckout = () => {
    toast.success('Order placed successfully! 🎉');
    clearCart();
    onClose();
  };

  const handleDownloadBill = () => {
    toast.success('Bill downloaded as PDF! 🧾');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">
              <div className="flex items-center gap-2 text-white">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg">Your Cart</h2>
                {items.length > 0 && (
                  <Badge className="bg-white text-[#FF5200]">{items.length}</Badge>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                title="Close cart"
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-lg text-[#1C1C1C] mb-2">Your cart is empty</p>
                  <p className="text-sm text-[#5E5E5E]">Add items to get started</p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-[#FFF3E6] rounded-xl p-3 hover:shadow-md transition-shadow"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm text-[#1C1C1C] mb-1">{item.name}</h3>
                        <p className="text-sm text-[#FF5200] mb-2">₹{item.price}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity for ${item.name}`}
                            title={`Decrease quantity for ${item.name}`}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow hover:shadow-md transition-shadow"
                          >
                            <Minus className="w-3 h-3 text-[#FF5200]" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity for ${item.name}`}
                            title={`Increase quantity for ${item.name}`}
                            className="w-6 h-6 flex items-center justify-center bg-gradient-to-r from-[#FF5200] to-[#FF7A33] rounded-full shadow hover:shadow-md transition-shadow"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-[#1C1C1C]">
                        ₹{item.price * item.quantity}
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:underline w-full text-center py-2"
                  >
                    Clear All Items
                  </button>
                </>
              )}
            </div>

            {/* Footer - Bill Summary */}
            {items.length > 0 && (
              <div className="border-t-2 border-[#FF5200]/20 p-4 bg-white shadow-lg">
                <div className="bg-gradient-to-br from-[#FFF3E6] to-white rounded-xl p-4 border-2 border-[#FF5200]/10 mb-4">
                  <h3 className="text-[#1C1C1C] mb-3 flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <span>Bill Summary</span>
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-[#1C1C1C]">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#1C1C1C]">
                      <span>Tax (GST 5%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#1C1C1C]">
                      <span>Delivery Charges</span>
                      <span>₹{delivery.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 bg-green-50 -mx-2 px-2 py-1 rounded">
                        <span className="font-medium">YummPoints Discount 🎉</span>
                        <span className="font-medium">−₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg text-[#1C1C1C] bg-gradient-to-r from-[#FF5200]/10 to-[#FF7A33]/10 -mx-2 px-2 py-2 rounded-lg">
                      <span className="font-bold">Total Amount</span>
                      <span className="font-bold text-[#FF5200]">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] hover:shadow-lg"
                  >
                    Checkout Now
                  </Button>
                  <Button
                    onClick={handleDownloadBill}
                    variant="outline"
                    className="w-full border-[#FF5200] text-[#FF5200] hover:bg-[#FFF3E6]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Bill (PDF)
                  </Button>
                </div>

                <p className="text-xs text-center text-[#5E5E5E] mt-3">
                  Secured Payment Gateway by YummPort
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
