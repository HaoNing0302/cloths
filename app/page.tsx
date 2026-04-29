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
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block transition hover:-translate-y-1"
              aria-label={`檢視 ${product.name}`}
            >
              <div className="aspect-[5/6] bg-gray-100 relative overflow-hidden rounded-3xl">
                <img
                  src={product.image_url || 'https://via.placeholder.com/600x720'}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="mt-6 flex justify-between">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm font-bold text-black">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}