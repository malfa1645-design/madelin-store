import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { AdminDashboard } from './components/AdminDashboard';
import { Product, CartItem } from './types';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "سيروم الرموش والحواجب",
    price: 8,
    description: "يعزز كثافة الحواجب والرموش ويحفز نمو الشعر بشكل طبيعي. يرطب ويغذي من الجذور، آمن وفعال للاستخدام اليومي.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    category: "علاجي"
  },
  {
    id: 2,
    name: "جل الحواجب الشفاف",
    price: 7,
    description: "تركيبة شفافة تثبت الحواجب وتمنحها مظهراً مرتباً وطبيعياً طوال اليوم. تثبيت قوي، لمسة طبيعية، لا يترك تكتلات.",
    image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=800&auto=format&fit=crop",
    category: "تجميلي"
  },
  {
    id: 3,
    name: "سيروم الأظافر المغذي",
    price: 8,
    description: "تركيبة مغذية تقوي الأظافر وتمنحها مظهراً صحياً ولمعاناً طبيعياً. يقوي الأظافر، يرطب بعمق، ويحمي من التكسر.",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800&auto=format&fit=crop",
    category: "علاجي"
  }
];

function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('الكل');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data && data.length > 0) {
      setProducts(data);
    } else {
      const local = localStorage.getItem('madeleine_products');
      if (local) setProducts(JSON.parse(local));
    }
  };

  const filteredProducts = activeCategory === 'الكل' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isAdminView) {
    return <AdminDashboard onBack={() => { setIsAdminView(false); fetchProducts(); }} />;
  }

  return (
    <div className="min-h-screen bg-[#fbf8f3] flex flex-col">
      <Navbar cartCount={totalItems} onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16 relative rounded-[2rem] overflow-hidden bg-black h-[500px] flex items-center border border-[#d4af37]">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfad450526?q=80&w=1600&auto=format&fit=crop" 
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative z-10 p-12 max-w-2xl text-white">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 inline-block px-4 py-1 bg-[#d4af37]/20 border border-[#d4af37] rounded-full text-[#d4af37] text-sm font-bold uppercase tracking-widest"
            >
              Madeleine Cosmetics
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-black mb-6 leading-tight"
            >
              جمال طبيعي يبدأ من التفاصيل
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-10 text-gray-200 font-medium leading-relaxed"
            >
              منتجاتنا مصممة خصيصاً لتعزيز جمالك الطبيعي بمكونات آمنة وفعالة. استكشفي مجموعتنا المختارة بعناية.
            </motion.p>
            <div className="flex gap-4">
              <motion.button 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-[#d4af37] text-black px-10 py-4 rounded-xl font-black hover:bg-[#b8860b] transition-all transform hover:scale-105"
              >
                تسوقي الآن
              </motion.button>
              <motion.a 
                href="https://wa.me/962776120965"
                target="_blank"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-transparent border-2 border-white/50 text-white px-10 py-4 rounded-xl font-black hover:bg-white/10 transition-all text-center flex items-center justify-center"
              >
                اتصلي بنا
              </motion.a>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <div id="products" className="text-center mb-16 scroll-mt-24">
          <h2 className="text-4xl font-black text-gray-900 mb-4">منتجاتنا العلاجية</h2>
          <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-8 rounded-full"></div>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => setActiveCategory('الكل')}
              className={`px-8 py-3 rounded-full text-sm font-bold border transition-all ${activeCategory === 'الكل' ? 'bg-black text-[#d4af37] border-[#d4af37]' : 'bg-white text-gray-600 border-[#e5d5c5]'}`}
            >الكل</button>
            <button 
              onClick={() => setActiveCategory('علاجي')}
              className={`px-8 py-3 rounded-full text-sm font-bold border transition-all ${activeCategory === 'علاجي' ? 'bg-black text-[#d4af37] border-[#d4af37]' : 'bg-white text-gray-600 border-[#e5d5c5]'}`}
            >علاجي</button>
            <button 
              onClick={() => setActiveCategory('تجميلي')}
              className={`px-8 py-3 rounded-full text-sm font-bold border transition-all ${activeCategory === 'تجميلي' ? 'bg-black text-[#d4af37] border-[#d4af37]' : 'bg-white text-gray-600 border-[#e5d5c5]'}`}
            >تجميلي</button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Features Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 bg-white p-12 rounded-[2rem] border border-[#e5d5c5]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#fdf5e6] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]">
              <span className="text-2xl">✨</span>
            </div>
            <h4 className="text-xl font-bold mb-3">نتائج طبيعية</h4>
            <p className="text-gray-500">نهتم بإبراز جمالك الطبيعي دون تكلف وبأفضل النتائج.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#fdf5e6] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]">
              <span className="text-2xl">🌿</span>
            </div>
            <h4 className="text-xl font-bold mb-3">تركيبة مغذية</h4>
            <p className="text-gray-500">جميع منتجاتنا تحتوي على زيوت وفيتامينات مغذية للشعر والأظافر.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#fdf5e6] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]">
              <span className="text-2xl">🚛</span>
            </div>
            <h4 className="text-xl font-bold mb-3">توصيل سريع</h4>
            <p className="text-gray-500">توصيل مجاني للعروض وخدمة عملاء متميزة طوال أيام الأسبوع.</p>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <h3 className="text-2xl font-black mb-6 tracking-tighter">MADELEINE</h3>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                مادلين للجمال والعناية - خيارك الأول للمنتجات العلاجية والتجميلية في الأردن. نتميز بجودة منتجاتنا ونتائجها الفعالة.
              </p>
              <div className="mt-8 flex gap-4">
                {/* Social media placeholders */}
                <div className="bg-white/10 p-3 rounded-full hover:bg-[#d4af37]/20 transition-colors cursor-pointer">
                  <span className="text-[#d4af37] font-bold">IG</span>
                </div>
                <div className="bg-white/10 p-3 rounded-full hover:bg-[#d4af37]/20 transition-colors cursor-pointer">
                  <span className="text-[#d4af37] font-bold">FB</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[#d4af37] font-bold mb-6">روابط هامة</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">عن مادلين</button></li>
                <li><button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">منتجاتنا</button></li>
                <li><a href="https://wa.me/962776120965" target="_blank" className="hover:text-white transition-colors">سياسة التوصيل</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#d4af37] font-bold mb-6">تواصل معنا</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <span className="text-[#d4af37]">📍</span> الأردن، عمان
                </li>
                <li className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors" onClick={() => window.open('https://wa.me/962776120965', '_blank')}>
                  <span className="text-[#d4af37]">📞</span> 0776120965
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#d4af37]">✉️</span> info@madeleine-jo.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm flex flex-col items-center gap-4">
            <p>© 2024 جميع الحقوق محفوظة لبراند مادلين | MADELEINE.</p>
            <button 
              onClick={() => {
                const pass = prompt('ادخل كلمة مرور الإدارة:');
                if (pass === '1234') setIsAdminView(true);
              }}
              className="text-[10px] text-gray-700 hover:text-white transition-colors"
            >
              إدارة المتجر
            </button>
          </div>
        </div>
      </footer>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}

export default App;
