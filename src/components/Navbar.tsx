
import { ShoppingBag, Menu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#fbf8f3]/90 backdrop-blur-md border-b border-[#e5d5c5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-black tracking-tighter text-black">
                MADELEINE
              </h1>
              <span className="text-[10px] font-bold text-[#d4af37] tracking-[0.2em] -mt-1 uppercase">Beauty & Care</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-900 hover:text-[#d4af37] font-bold text-sm transition-colors">الرئيسية</button>
              <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-900 hover:text-[#d4af37] font-bold text-sm transition-colors">منتجاتنا</button>
              <button onClick={() => window.open('https://wa.me/962776120965', '_blank')} className="text-gray-900 hover:text-[#d4af37] font-bold text-sm transition-colors">تواصل معنا</button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a href="https://wa.me/962776120965" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 bg-black text-[#d4af37] px-4 py-2 rounded-full text-sm font-bold border border-[#d4af37] hover:scale-105 transition-transform">
              <span>0776120965</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </a>
            <button 
              onClick={onOpenCart}
              className="relative p-3 bg-white border border-[#e5d5c5] rounded-full text-black hover:border-[#d4af37] transition-all"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-[#d4af37] text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#fbf8f3]">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-black">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
