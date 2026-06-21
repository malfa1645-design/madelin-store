
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-[#e5d5c5]">
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.price >= 8 && (
          <div className="absolute top-4 right-4 bg-black text-[#d4af37] px-3 py-1 rounded-full text-xs font-bold border border-[#d4af37]">
            توصيل مجاني
          </div>
        )}
      </div>
      <div className="p-6 text-center">
        <span className="text-[10px] font-bold text-[#b8860b] bg-[#fdf5e6] px-3 py-1 rounded-full uppercase tracking-widest border border-[#eee1d1]">
          {product.category}
        </span>
        <h3 className="mt-3 text-xl font-bold text-gray-900">{product.name}</h3>
        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{product.description}</p>
        
        <div className="mt-6 flex flex-col gap-4">
          <div className="text-2xl font-bold text-black">
            {product.price} <span className="text-sm font-medium">دنانير</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full flex items-center justify-center gap-2 bg-black text-[#d4af37] py-3 rounded-xl hover:bg-gray-900 transition-all border border-[#d4af37] active:scale-95 font-bold"
          >
            <ShoppingCart size={18} />
            <span>اطلبي الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
