'use client';

import Link from 'next/link';
import { useCartStore } from '@/src/store/useCartStore';
import { useUIStore } from '@/src/store/useUIStore';

export default function Navbar() {
  const { items } = useCartStore();
  const { toggleCart } = useUIStore();
  
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-widest text-black">
          DDSW<span className='font-light text-gray-500'>SHOP</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <div className="group relative h-full flex items-center">
            <Link href="/category/1" className="text-black transition hover:text-gray-600">上衣</Link>
            <div className="invisible absolute top-full left-0 w-48 pt-4">
              <div className="bg-white border border-gray-100 rounded-lg shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <div className="flex flex-col space-y-1 p-2">
                  <Link href="/category/1" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">全部</Link>
                  <Link href="/category/1?sub=11" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">短袖</Link>
                  <Link href="/category/1?sub=12" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">長袖</Link>
                  <Link href="/category/1?sub=13" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">薄長袖</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative h-full flex items-center">
            <Link href="/category/2" className="text-black transition hover:text-gray-600">褲子</Link>
            <div className="invisible absolute top-full left-0 w-48 pt-4">
              <div className="bg-white border border-gray-100 rounded-lg shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <div className="flex flex-col space-y-1 p-2">
                  <Link href="/category/2" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">全部</Link>
                  <Link href="/category/2?sub=21" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">短褲</Link>
                  <Link href="/category/2?sub=22" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">長褲</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative h-full flex items-center">
            <Link href="/category/3" className="text-black transition hover:text-gray-600">飾品</Link>
            <div className="invisible absolute top-full left-0 w-48 pt-4">
              <div className="bg-white border border-gray-100 rounded-lg shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <div className="flex flex-col space-y-1 p-2">
                  <Link href="/category/3" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">全部</Link>
                  <Link href="/category/3?sub=31" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">項鍊</Link>
                  <Link href="/category/3?sub=32" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">戒指</Link>
                  <Link href="/category/3?sub=33" className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-gray-50">特別品</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={toggleCart}
          className="relative inline-flex items-center justify-center rounded-full p-2 transition hover:bg-gray-100"
          aria-label="打開購物車"
        >
          <svg
            className="h-6 w-6 text-gray-900"
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
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}