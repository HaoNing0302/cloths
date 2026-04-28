'use client'; // 必須改為客戶端元件才能使用 useEffect

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
export const revalidate = 0; // 強制每次載入都抓最新資料

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  // 1. 初始抓取資料
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();

    // 2. 訂閱 Realtime 頻道
    const channel = supabase.channel('products:changes')
      .on('broadcast', { event: '*' }, (payload) => {
        console.log('收到即時更新:', payload);
        fetchProducts(); // 收到廣播後，重新抓取資料庫
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 導航列與 Hero Section 保持不變... */}
      
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12">精選單品 (Realtime 模式)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-[5/6] bg-gray-100 relative overflow-hidden">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/600x720'} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="mt-4 flex justify-between">
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