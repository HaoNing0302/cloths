import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../lib/supabase' 

export default async function Home() {
  // 從 Supabase 抓取商品
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Supabase 抓取錯誤:', error)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* 導航列 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-widest text-black">
            DDSW<span className='font-light text-gray-500'>SHOP</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="#" className="hover:text-gray-600">NEW ARRIVALS</Link>
            <Link href="#" className="hover:text-gray-600">BRANDS</Link>
            <Link href="#" className="hover:text-gray-600">APPAREL</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* 主視覺區 */}
      <section className="relative h-[60vh] bg-gray-900">
        <Image
          src="/images/螢幕擷取畫面 2026-04-27 230833.png" 
          alt="Hero Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">THE ART OF SELECTION</h1>
          <p className="mt-6 text-xl text-gray-200">演繹你的獨特生活美學</p>
        </div>
      </section>

      {/* 商品列表區 */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12">精選單品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-[5/6] bg-gray-100 relative overflow-hidden rounded-sm">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/600x720'} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="mt-6 flex justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">{product.category || 'SELECT'}</p>
                  <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
                </div>
                <p className="text-sm font-bold text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}