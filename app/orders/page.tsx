'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { CartItem } from '@/src/store/useCartStore';

interface Order {
  id: string;
  email: string;
  items: CartItem[];
  total_price: number;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('取得訂單失敗：', fetchError);
          setError(fetchError.message);
          return;
        }

        setOrders(data || []);
      } catch (err) {
        console.error('錯誤：', err);
        setError('無法連接到數據庫');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-red-600">錯誤：{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">訂單管理</h1>
          <p className="mt-2 text-gray-600">共 {orders.length} 份訂單</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-center">
            <svg
              className="h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-900">尚無訂單</p>
            <p className="mt-1 text-sm text-gray-500">開始購物以建立您的第一份訂單</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
              >
                {/* Order Header */}
                <div className="border-b border-gray-100 bg-white px-6 py-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        訂單 ID
                      </p>
                      <p className="mt-2 font-mono text-sm text-gray-900">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        郵箱
                      </p>
                      <p className="mt-2 text-sm text-gray-900">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        訂單時間
                      </p>
                      <p className="mt-2 text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        總金額
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">
                        ${order.total_price.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-6">
                  <p className="mb-4 text-sm font-semibold text-gray-900">
                    商品清單
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={`${item.id}-${item.size || 'default'}`}
                        className="flex items-center gap-4 rounded-lg bg-white p-4"
                      >
                        {/* Product Image */}
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={item.image_url || 'https://via.placeholder.com/64x64'}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </div>

                        {/* Item Info */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            尺寸: {item.size} | ${item.price.toFixed(0)} × {item.quantity}
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
