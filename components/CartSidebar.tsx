'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/src/store/useCartStore';
import { useUIStore } from '@/src/store/useUIStore';
import { supabase } from '@/lib/supabase';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { isCartOpen, closeCart } = useUIStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('購物車是空的，無法結帳');
      return;
    }

    // 使用 prompt 取得 Email
    const email = window.prompt('請輸入您的 Email：');
    if (!email) return; // 用戶取消

    // Email 簡單驗證
    if (!email.includes('@')) {
      alert('請輸入有效的 Email 地址');
      return;
    }

    setIsCheckingOut(true);

    try {
      // 將訂單寫入 Supabase
      const { error } = await supabase.from('orders').insert([
        {
          email,
          items: items, // JSONB 格式
          total_price: totalPrice,
        },
      ]);

      if (error) {
        console.error('訂單建立失敗：', error);
        alert(`結帳失敗：${error.message}`);
        return;
      }

      // 成功後清空購物車、關閉側欄
      clearCart();
      closeCart();
      alert(
        `結帳成功！\n訂單已建立，確認信已寄至 ${email}\n感謝您的購買！`
      );
    } catch (error) {
      console.error('結帳過程出錯：', error);
      alert('結帳過程發生錯誤，請重試');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-lg transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">購物車</h2>
          <button
            onClick={closeCart}
            className="inline-flex items-center justify-center rounded-full p-2 transition hover:bg-gray-100"
            aria-label="關閉購物車"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-gray-500">
              <svg
                className="h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="mt-3 text-sm font-medium">購物車是空的</p>
              <p className="mt-1 text-xs">開始選購商品吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size || 'default'}`}
                  className="flex gap-4 rounded-2xl border border-gray-100 p-4"
                >
                  {/* Product Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.image_url || 'https://via.placeholder.com/96x96'}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        尺寸: {item.size}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        ${item.price.toFixed(0)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start rounded-full p-1 transition hover:bg-red-50"
                    aria-label={`移除 ${item.name}`}
                  >
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6 space-y-4">
            {/* Total Price */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">合計</p>
              <p className="text-lg font-semibold text-gray-900">
                ${totalPrice.toFixed(0)}
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full rounded-full bg-black py-4 text-center text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? '處理中...' : '前往結帳'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
