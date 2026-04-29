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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const sizes = ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (error || !data) {
        setError('找不到此商品');
        console.error(error || 'No product data returned');
        setProduct(null);
      } else {
        setProduct(data as Product);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        size: selectedSize,
      });
      setAdded(true);
      openCart();
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="container mx-auto px-6 py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex-1">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black">
              ← 返回首頁
            </Link>
            <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden min-h-[420px]">
              {loading ? (
                <div className="flex h-[420px] items-center justify-center text-gray-500">載入中...</div>
              ) : product ? (
                <div className="relative h-[420px] sm:h-[520px]">
                  <Image
                    src={(product.image_url || '').trim() || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-[420px] items-center justify-center text-gray-500">商品圖片無法顯示</div>
              )}
            </div>
          </div>

          <div className="flex-1 max-w-2xl space-y-6">
            {loading ? (
              <div className="space-y-4">
                <div className="h-8 w-40 rounded-full bg-gray-200" />
                <div className="h-6 w-20 rounded-full bg-gray-200" />
                <div className="h-4 w-full rounded-full bg-gray-200" />
                <div className="h-4 w-full rounded-full bg-gray-200" />
                <div className="h-4 w-5/6 rounded-full bg-gray-200" />
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">{error}</div>
            ) : product ? (
              <>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{product.category}</p>
                <h1 className="text-4xl font-semibold tracking-tight text-gray-900">{product.name}</h1>
                <p className="text-3xl font-semibold text-black">${product.price.toFixed(0)}</p>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{product.description}</p>
                </div>

                {/* Size Selection */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">尺寸</p>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 text-sm font-medium transition ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-500"
                    disabled={added}
                  >
                    {added ? '已加入購物車' : '加入購物車'}
                  </button>
                  <span className="text-sm text-gray-500">極簡精品風，專屬你的質感選品。</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
