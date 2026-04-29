'use client';

import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 🌟 引入 Link 組件
import { supabase } from '@/lib/supabase';

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryId = resolvedParams.id;
  const subCategory = resolvedSearchParams.sub;

  const fetchProducts = useCallback(async () => {
    const catIdNum = Number(categoryId);
    const subCatNum = subCategory ? Number(subCategory) : null;

    console.log(`[Realtime] 抓取分類 ${catIdNum} 的資料...`);

    let query = supabase
      .from('products')
      .select('*')
      .eq('category_id', catIdNum);

    if (subCatNum) {
      query = query.eq('subcategory', subCatNum);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('抓取失敗:', error);
    } else {
      // 🌟 過濾掉沒有名稱或沒有分類的髒資料，避免空白格
      const cleanData = (data || []).filter(p => p.name && p.category_id);
      setProducts([...cleanData]);
    }
    setLoading(false);
  }, [categoryId, subCategory]);

  useEffect(() => {
    fetchProducts();

    const channelName = `cat-realtime-${categoryId}-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchProducts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categoryId, subCategory, fetchProducts]);

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <h1 className="text-3xl font-bold mb-10 text-black">
        {categoryId === '1' ? '上衣' : categoryId === '2' ? '褲子' : '飾品'}
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center py-20">載入中...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((p) => (
            /* 🌟 關鍵修正：使用 Link 包裹整個品項，連結到產品詳細頁 */
            <Link 
              key={p.id} 
              href={`/products/${p.id}`} 
              className="group block transition hover:-translate-y-1"
            >
              <div className="aspect-[5/6] overflow-hidden rounded-2xl bg-gray-100 relative">
                <img 
                  src={p.image_url?.trim() || 'https://via.placeholder.com/600x720'} 
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-black">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                    {categoryId === '1' ? 'Tops' : categoryId === '2' ? 'Pants' : 'Accessory'}
                  </p>
                </div>
                <p className="text-sm font-bold text-black">NT$ {p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">此分類目前沒有商品</p>
          <Link href="/" className="text-black underline mt-4 inline-block">返回首頁逛逛</Link>
        </div>
      )}
    </div>
  );
}