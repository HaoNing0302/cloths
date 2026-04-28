import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../lib/supabase' 

export default async function Home() {
  // 從 Supabase 抓取資料
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Supabase Error:', error)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-widest text-black">
            DDSW<span className='font-light text-gray-500'>SHOP</span>
          </Link>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="#">NEW ARRIVALS</Link>
            <Link href="#">BRANDS</Link>
            <Link href="#">APPAREL</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <Image
          src="/images/螢幕擷取畫面 2026-04-27 230833.png" 
          alt="Hero"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold tracking-tight">THE ART OF SELECTION</h1>
        </div>
      </section>

      {/* 商品列表 */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">精選單品</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products?.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden rounded-sm">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/600x800'} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-sm font-bold">${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}