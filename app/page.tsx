'use client'; // 客戶端元件

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// ⚠️ 注意：不要在這裡寫 export const revalidate = 0; 會報錯！

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  // 抓取資料的函數
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('抓取失敗:', error);
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
        fetchProducts(); // 收到廣播後重新抓取
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 這裡放你的導航列與 Hero Section 程式碼... */}
      
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12">精選單品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-[5/6] bg-gray-100 relative overflow-hidden rounded-sm">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/600x720'} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="mt-4 flex justify-between text-sm font-medium">
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}