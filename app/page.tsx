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

    // 訂閱資料庫變動 (Broadcast 模式)
    const channel = supabase.channel('products:changes')
      .on('broadcast', { event: '*' }, (payload) => {
        console.log('收到更新通知:', payload);
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* 導航列 - 完整保留 */}
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

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* 主視覺區 Hero Section - 完整保留 */}
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
          <button className="mt-10 px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition duration-300 text-sm tracking-widest">
            SHOP NOW
          </button>
        </div>
      </section>

      {/* 商品列表區 */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold">精選單品</h2>
            <p className="text-gray-500 mt-2">Curated Essentials for Your Style</p>
          </div>
          <Link href="#" className="text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition">
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[5/6] bg-gray-100 relative overflow-hidden rounded-sm">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/600x720'} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition duration-300">
                   <button className="w-full bg-white/90 backdrop-blur-sm text-black py-2 text-xs font-bold tracking-tighter hover:bg-black hover:text-white transition">
                     QUICK ADD +
                   </button>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category || 'COLLECTION'}</p>
                  <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                </div>
                <p className="text-sm font-bold text-black">${product.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer 裝飾 */}
      <footer className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="container mx-auto px-6 text-center text-gray-400 text-xs tracking-widest">
          © 2026 DDSWSHOP SELECTION. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}