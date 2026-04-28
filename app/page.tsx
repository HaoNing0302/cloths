'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error('抓取失敗:', error);
    else setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();

    // 🌟 這是官方推薦的原生監聽做法，不需要 SQL Trigger
    const channel = supabase
      .channel('any-name-you-want')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('資料庫有變動，自動更新中!', payload);
          fetchProducts();
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
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="#" className="hover:text-gray-600">NEW ARRIVALS</Link>
            <Link href="#" className="hover:text-gray-600">BRANDS</Link>
            <Link href="#" className="hover:text-gray-600">APPAREL</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[65vh] bg-gray-900">
        <Image
          src="/images/hero-bg.jpg" 
          alt="Hero"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">THE ART OF SELECTION</h1>
          <p className="mt-4 text-lg tracking-[0.2em] font-light">演繹你的獨特生活美學</p>
        </div>
      </section>

      {/* 商品列表 */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12">精選單品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-[5/6] bg-gray-100 relative overflow-hidden">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/600x720'} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="mt-6 flex justify-between">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm font-bold">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}