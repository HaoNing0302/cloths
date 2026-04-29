'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/src/store/useCartStore';
import { useUIStore } from '@/src/store/useUIStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

const categoryNames: Record<string, string> = {
  '1': '上衣',
  '2': '褲子',
  '3': '其他',
};

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const categoryName = categoryNames[resolvedParams.id] || '分類';
  const subCategory = resolvedSearchParams.sub;
  const parsedSub = subCategory ? parseInt(subCategory, 10) : undefined;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      let query = supabase.from('products').select('*').eq('category_id', resolvedParams.id);
      if (parsedSub) {
        query = query.eq('subcategory', parsedSub);
      }

      const { data, error } = await query;

      if (error) {
        setError('載入商品失敗');
        console.error(error);
        setProducts([]);
      } else {
        setProducts(data as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [resolvedParams.id, parsedSub]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size: 'M',
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Category Header */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">{categoryName}</h1>
          <p className="mt-2 text-gray-600">精選 {categoryName} 系列商品</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/2 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black">
              返回首頁
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <svg
              className="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-lg font-semibold text-gray-900">此分類暫無商品</p>
            <p className="mt-1 text-sm text-gray-500">敬請期待更多商品上架</p>
            <Link href="/" className="mt-4 text-sm font-medium text-gray-600 hover:text-black">
              返回首頁
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4">
                    <Image
                      src={(product.image_url || '').trim() || '/images/placeholder.jpg'}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </Link>
                <div className="space-y-2">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-lg font-semibold text-black">${product.price.toFixed(0)}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full inline-flex items-center justify-center rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}