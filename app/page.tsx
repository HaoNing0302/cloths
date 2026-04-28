'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  // 抓取資料函數
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Supabase 抓取失敗:', error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();

    // 🌟 使用 Supabase 原生 Realtime 監聽 (不需 SQL Trigger)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('資料庫變動:', payload);
          fetchProducts(); // 只要資料庫有變，就重新抓取
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* 導航列 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-widest text-black">
            DDSW<span className='font-light text-gray-500'>SHOP</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="#" className="hover:text-gray-600 transition">NEW ARRIVALS</Link>
            <Link href="#" className="hover:text-gray-600 transition">BRANDS</Link>
            <Link href="#" className="hover:text-gray-600 transition">APPAREL</Link>
          </div>
        </nav>
      </header>

      {/* 主視覺區 Hero Section */}
      <section className="relative h-[70vh] bg-gray-900">
        <Image
          src="/images/螢幕擷取畫面 2026-04-27 230833.png" 
          alt="Hero Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">THE ART OF SELECTION</h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light tracking-widest uppercase">演繹你的獨特生活美學</p>
        </div>
      </section>

      {/* 商品列表區 */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">精選單品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[5/6] bg-gray-100 relative overflow-hidden rounded-sm">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/600x720'} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="mt-6 flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{product.category}</p>
                </div>
                <p className="text-sm font-bold text-black">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 py-12 bg-gray-50 text-center text-gray-400 text-xs tracking-widest">
        © 2026 DDSWSHOP SELECTION.
      </footer>
    </div>
  );
}