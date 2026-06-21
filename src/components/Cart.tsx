
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

import { useState } from 'react';

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }) => {
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [isOrdering, setIsOrdering] = useState(false);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف");
      return;
    }

    setIsOrdering(true);

    const orderData = {
      customer: customerInfo,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      totalAmount: total,
      timestamp: new Date().toISOString()
    };

    // --- n8n Webhook Integration ---
    // ضع رابط الـ Webhook الخاص بك هنا
    const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';

    try {
      if (N8N_WEBHOOK_URL !== 'YOUR_N8N_WEBHOOK_URL_HERE') {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
      }
    } catch (error) {
      console.error("Webhook Error:", error);
    }

    // Redirect to WhatsApp
    const phoneNumber = "962776120965";
    let message = `*طلب جديد من: ${customerInfo.name}*\n`;
    message += `رقم الهاتف: ${customerInfo.phone}\n`;
    message += `العنوان: ${customerInfo.address}\n\n`;
    message += "المنتجات:\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity} قطعة)\n`;
    });
    
    message += `\n*المجموع الإجمالي: ${total} دينار*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setIsOrdering(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={24} />
                سلة التسوق
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingCart size={64} className="mb-4 opacity-20" />
                  <p className="text-lg">السلة فارغة حالياً</p>
                  <button 
                    onClick={() => {
                      onClose();
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-4 text-[#d4af37] font-bold hover:underline"
                  >
                    ابدأ التسوق الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-gray-900 font-bold text-sm mb-2">{item.price} دينار</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 border rounded hover:bg-gray-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 border rounded hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <form onSubmit={handleOrder} className="space-y-4 mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-2">معلومات التوصيل:</h4>
                  <input 
                    type="text" 
                    placeholder="الاسم الكامل" 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#d4af37] outline-none"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="رقم الهاتف" 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#d4af37] outline-none"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="العنوان (المدينة، الشارع)" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#d4af37] outline-none"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  />
                </form>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">المجموع الإجمالي</span>
                  <span className="text-2xl font-bold text-black">{total} <span className="text-sm">دنانير</span></span>
                </div>
                
                <button 
                  onClick={handleOrder}
                  disabled={isOrdering}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all border flex items-center justify-center gap-2 ${
                    isOrdering 
                    ? 'bg-gray-400 border-gray-400 cursor-not-allowed text-white' 
                    : 'bg-black text-[#d4af37] hover:bg-gray-900 border-[#d4af37]'
                  }`}
                >
                  {isOrdering ? 'جاري المعالجة...' : 'تأكيد الطلب وإرساله'}
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-3">سيتم فتح محادثة واتساب لإتمام التفاصيل النهائية</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
