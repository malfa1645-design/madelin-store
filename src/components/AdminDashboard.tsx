import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';

export const AdminDashboard = ({ onBack }: { onBack: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'علاجي'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('يجب عليك اختيار صورة للرفع.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setNewItem({ ...newItem, image: data.publicUrl });
      alert('تم رفع الصورة بنجاح!');
    } catch (error: any) {
      alert('خطأ في رفع الصورة: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching:', error);
      // Fallback to local storage if supabase isn't connected yet
      const local = localStorage.getItem('madeleine_products');
      if (local) setProducts(JSON.parse(local));
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from('products')
      .insert([newItem])
      .select();

    if (!error && data) {
      setProducts([...products, data[0]]);
      setNewItem({ name: '', price: 0, description: '', image: '', category: 'علاجي' });
    } else {
      // Offline fallback
      const updated = [...products, { ...newItem, id: Date.now() }];
      setProducts(updated);
      localStorage.setItem('madeleine_products', JSON.stringify(updated));
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('madeleine_products', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">لوحة التحكم في المتجر</h1>
          <button 
            onClick={onBack}
            className="bg-black text-white px-6 py-2 rounded-lg font-bold"
          >
            العودة للمتجر
          </button>
        </div>

        {/* Add New Product Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus size={20} /> إضافة منتج جديد
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input 
              type="text" placeholder="اسم المنتج" 
              className="p-3 border rounded-xl"
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
            />
            <input 
              type="number" placeholder="السعر (دينار)" 
              className="p-3 border rounded-xl"
              value={newItem.price || ''}
              onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
            />
            <select 
              className="p-3 border rounded-xl"
              value={newItem.category}
              onChange={e => setNewItem({...newItem, category: e.target.value})}
            >
              <option value="علاجي">علاجي</option>
              <option value="تجميلي">تجميلي</option>
            </select>
            <div className="lg:col-span-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 bg-gray-50 border-2 border-dashed border-gray-300 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                {uploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                <span className="text-gray-600 font-medium">
                  {newItem.image ? 'تم اختيار صورة ✅' : 'اختر صورة المنتج من جهازك'}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
              {newItem.image && (
                <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold px-2">
                  <img src={newItem.image} className="w-8 h-8 rounded object-cover" />
                  تم تجهيز الصورة للرفع
                </div>
              )}
            </div>
            <textarea 
              placeholder="وصف المنتج" 
              className="p-3 border rounded-xl lg:col-span-3"
              value={newItem.description}
              onChange={e => setNewItem({...newItem, description: e.target.value})}
            />
            <button 
              onClick={handleAdd}
              className="bg-[#d4af37] text-black font-bold p-3 rounded-xl lg:col-span-3 hover:bg-[#b8860b] transition-colors"
            >
              إضافة للمتجر
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-10">جاري التحميل...</div>
          ) : (
            products.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                <img src={product.image} alt="" className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                <div className="flex-1 text-right w-full">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1">{product.description}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[#b8860b] font-bold">{product.price} دينار</span>
                    <span className="text-gray-400 text-sm">{product.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
