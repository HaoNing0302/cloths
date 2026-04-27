// src/app/page.tsx
import Image from 'next/image'
import Link from 'next/link'

// 模擬的商品資料 (未來可以從資料庫抓取)
const products = [
  {
    id: 1,
    name: '重磅極簡素 T',
    category: 'Apparel',
    price: '$1,280',
    // 關鍵：只要寫 /images/檔案名稱 即可，不需要 C:\...
    imageUrl: '/images/螢幕擷取畫面 2026-04-27 230833.png', 
  },
  {
    id: 2,
    name: 'Urban 帆布托特包',
    category: 'Accessories',
    price: '$2,500',
    imageUrl: '/images/螢幕擷取畫面 2026-04-27 230833.png',
  },
  // 下面以此類推...
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* 1. Header / Navigation (導航列) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo 區域 - 將來可以替換成 nano banana 生成的 Logo 圖片 */}
          <Link href="/" className="text-2xl font-bold tracking-widest text-black">
            DDSW<span className='font-light text-gray-500'>SHOP</span>
          </Link>
          
          {/* 導航連結 */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="#" className="hover:text-gray-600">NEW ARRIVALS</Link>
            <Link href="#" className="hover:text-gray-600">BRANDS</Link>
            <Link href="#" className="hover:text-gray-600">APPAREL</Link>
            <Link href="#" className="hover:text-gray-600">LIFE</Link>
          </div>

          {/* 右側功能圖示 */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-black relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section (首頁大圖區) */}
      <section className="relative bg-gray-50">
        {/* 這裡替換成 nano banana 生成的首頁大圖 URL */}
        <div className="absolute inset-0 z-0">
          <Image
  // 將原本長長的路徑刪除，只留下從 images 開始的部分，開頭要加上 /
  src="/images/螢幕擷取畫面 2026-04-27 230833.png" 
  alt="Hero Background"
  fill
/>
        </div>
        <div className="container mx-auto px-6 py-32 md:py-48 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md">
            THE ART OF SELECTION
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-sm">
            探尋來自世界各地的現代設計物，演繹你的獨特生活美學。
          </p>
          <div className="mt-12">
            <Link href="#" className="inline-block bg-white text-black px-12 py-4 text-sm font-bold tracking-widest hover:bg-gray-100 transition duration-300">
              SHOP NEW
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Product Grid Section (精選商品區) */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight">精選單品</h2>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2">
            查看全部 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Tailwind Grid 排版 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product.id} className="group">
              {/* 商品圖片容器 */}
              <div className="aspect-[5/6] w-full overflow-hidden bg-gray-100 relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute bottom-4 right-4 bg-white/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              {/* 商品資訊 */}
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                  <h3 className="mt-1 text-sm font-medium text-gray-700">
                    <Link href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                </div>
                <p className="text-sm font-bold text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Footer (頁尾) */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-24">
        <div className="container mx-auto px-6 py-12 text-center text-gray-500 text-sm">
          <p className="font-bold text-lg text-black mb-4">DDSWSHOP</p>
          <p>© 2024 DDSWSHOP, All Rights Reserved.</p>
          <p className="mt-2">About | Contact | Terms</p>
        </div>
      </footer>

    </div>
  )
}