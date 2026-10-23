import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBolt, faShieldHalved, faTruckFast, faHeadset, faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { fetchProducts, fetchCategories } from "../services/productApi.js";
import ProductGrid from "../components/products/ProductGrid.jsx";
import { ErrorState } from "../components/common/States.jsx";

const categoryVisuals = {
  beauty: { emoji: "✨", color: "from-pink-50 to-rose-100" }, fragrances: { emoji: "🌸", color: "from-purple-50 to-fuchsia-100" },
  furniture: { emoji: "🛋️", color: "from-amber-50 to-orange-100" }, groceries: { emoji: "🥑", color: "from-green-50 to-lime-100" },
  "home-decoration": { emoji: "🏡", color: "from-orange-50 to-amber-100" }, laptops: { emoji: "💻", color: "from-blue-50 to-cyan-100" },
  "mens-shirts": { emoji: "👕", color: "from-sky-50 to-blue-100" }, "mens-shoes": { emoji: "👟", color: "from-slate-100 to-gray-200" },
  "womens-bags": { emoji: "👜", color: "from-rose-50 to-pink-100" }, smartphones: { emoji: "📱", color: "from-indigo-50 to-violet-100" },
  skincare: { emoji: "🧴", color: "from-teal-50 to-emerald-100" }, sunglasses: { emoji: "🕶️", color: "from-yellow-50 to-amber-100" }
};
const visualFor = (slug) => categoryVisuals[slug] || { emoji: "✦", color: "from-blue-50 to-indigo-100" };

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async (signal) => {
    setLoading(true); setError("");
    try {
      const [productData, categoryData] = await Promise.all([fetchProducts({ limit: 12, skip: 0, signal }), fetchCategories(signal)]);
      setProducts(productData.products || []);
      setCategories((categoryData || []).map((c) => typeof c === "string" ? { slug: c, name: c } : c).slice(0, 10));
    } catch (e) { if (e.code !== "ERR_CANCELED") setError("Please check your connection and try loading the storefront again."); }
    finally { if (!signal?.aborted) setLoading(false); }
  };
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, []);
  const featured = products.slice(0, 8);
  const trending = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  return <div className="container-page pt-5 sm:pt-8">
    <section className="relative isolate overflow-hidden rounded-[26px] bg-brand-900 text-white shadow-xl shadow-blue-950/10">
      <div className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" /><div className="absolute bottom-[-100px] right-[25%] -z-10 h-64 w-64 rounded-full bg-coral-500/20 blur-3xl" />
      <div className="grid items-center gap-5 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_.9fr] lg:px-14 lg:py-14">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-100"><FontAwesomeIcon icon={faBolt} className="text-amber-300" /> Your next favourite thing</span>
          <h1 className="section-title mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[58px]">Everyday finds.<br /><span className="text-blue-300">Extraordinary</span> value.</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">From clever tech to little lifestyle upgrades, meet the things that make everyday feel a little more exciting.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-brand-900 transition hover:-translate-y-0.5 hover:bg-blue-50">Shop all products <FontAwesomeIcon icon={faArrowRight} /></Link><a href="#categories" className="rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Explore categories</a></div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-blue-100"><span><FontAwesomeIcon icon={faStar} className="mr-1.5 text-amber-300" />Handpicked discoveries</span><span><FontAwesomeIcon icon={faTag} className="mr-1.5 text-blue-300" />Deals worth a look</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="absolute inset-8 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="relative grid grid-cols-2 gap-3">
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85" alt="Wireless headphones" className="aspect-square w-full rounded-xl object-cover" /><p className="mt-3 text-xs font-bold">Sound that moves you</p></div>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85" alt="Minimal wristwatch" className="aspect-square w-full rounded-xl object-cover" /><p className="mt-3 text-xs font-bold">Details make the day</p></div>
          </div>
          <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-xl sm:left-8 sm:translate-x-0"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><FontAwesomeIcon icon={faTruckFast} /></span><span><b className="block text-xs">Shopping made simple</b><small className="text-[10px] text-slate-500">Discover. Compare. Enjoy.</small></span></div>
        </div>
      </div>
    </section>

    <section id="categories" className="pt-12 sm:pt-16">
      <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">Browse your way</p><h2 className="section-title mt-1 text-2xl sm:text-3xl">What are you into?</h2></div><Link to="/products" className="shrink-0 text-xs font-bold text-brand-600 hover:text-brand-800 sm:text-sm">All categories <FontAwesomeIcon icon={faArrowRight} className="ml-1" /></Link></div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">{categories.map((cat) => { const visual = visualFor(cat.slug); return <Link key={cat.slug} to={`/products?category=${encodeURIComponent(cat.slug)}`} className={`min-w-[112px] flex-1 rounded-2xl bg-gradient-to-br ${visual.color} p-3 text-center transition hover:-translate-y-1 sm:min-w-[130px] sm:p-4`}><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-sm">{visual.emoji}</span><span className="mt-3 block truncate text-xs font-bold capitalize text-slate-700 sm:text-sm">{cat.name || cat.slug}</span></Link>; })}</div>
    </section>

    <section className="pt-12 sm:pt-16"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">Picked for you</p><h2 className="section-title mt-1 text-2xl sm:text-3xl">Featured finds</h2><p className="mt-1 text-sm text-slate-500">Little upgrades, big everyday energy.</p></div><Link to="/products" className="shrink-0 text-xs font-bold text-brand-600 hover:text-brand-800 sm:text-sm">View all <FontAwesomeIcon icon={faArrowRight} className="ml-1" /></Link></div>{error ? <ErrorState message={error} onRetry={() => load()} /> : <ProductGrid products={featured} loading={loading} skeletonCount={8} />}</section>

    <section className="pt-12 sm:pt-16"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-coral-600">Loved by shoppers</p><h2 className="section-title mt-1 text-2xl sm:text-3xl">Trending right now</h2></div><Link to="/products?sort=rating" className="shrink-0 text-xs font-bold text-brand-600 sm:text-sm">Top rated <FontAwesomeIcon icon={faArrowRight} className="ml-1" /></Link></div><ProductGrid products={trending} loading={loading} skeletonCount={4} /></section>

    <section className="mt-12 overflow-hidden rounded-[24px] bg-gradient-to-r from-orange-50 via-rose-50 to-blue-50 p-6 sm:mt-16 sm:p-10"><div className="grid items-center gap-6 md:grid-cols-[1fr_auto]"><div><span className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-coral-600">The little things sale</span><h2 className="section-title mt-4 max-w-xl text-3xl leading-tight sm:text-4xl">Your wishlist called.<br />It says, “go for it.”</h2><p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">Find a fresh favourite or finally pick up that thing you have been eyeing.</p><Link to="/products" className="btn-primary mt-5">Find your next favourite <FontAwesomeIcon icon={faArrowRight} /></Link></div><div className="hidden grid-cols-2 gap-3 md:grid"><img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=360&q=80" alt="Red sneaker" className="h-36 w-36 rotate-[-5deg] rounded-2xl object-cover shadow-lg" /><img src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=360&q=80" alt="Modern chair" className="mt-8 h-36 w-36 rotate-[5deg] rounded-2xl object-cover shadow-lg" /></div></div></section>

    <section className="grid gap-4 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-4">{[{ icon: faTruckFast, title: "Delivery made easy", text: "Clear shipping estimates before checkout." }, { icon: faShieldHalved, title: "Demo-safe checkout", text: "No real payment is taken in this demo." }, { icon: faTag, title: "Worthwhile finds", text: "Explore a broad catalogue of everyday picks." }, { icon: faHeadset, title: "Here to help", text: "A straightforward shopping experience." }].map((item) => <div key={item.title} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-600"><FontAwesomeIcon icon={item.icon} /></span><div><h3 className="text-sm font-extrabold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p></div></div>)}</section>
  </div>;
}
