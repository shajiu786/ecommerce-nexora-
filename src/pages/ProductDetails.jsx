import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faTruckFast, faRotateLeft, faShieldHalved, faMinus, faPlus, faChevronRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchProduct, fetchCategoryProducts } from "../services/productApi.js";
import { discountedPrice, discountPercent, money } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";
import { ErrorState } from "../components/common/States.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(""); setProduct(null); setQuantity(1); setImageIndex(0);
    fetchProduct(id, controller.signal).then(async (data) => {
      setProduct(data);
      try { const rel = await fetchCategoryProducts(data.category, controller.signal); setRelated((rel.products || []).filter((p) => p.id !== data.id).slice(0, 4)); } catch (e) { if (e.code !== "ERR_CANCELED") setRelated([]); }
    }).catch((e) => { if (e.code !== "ERR_CANCELED") setError("This product could not be found. It may have been removed from the catalogue."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  if (loading) return <div className="container-page py-10"><div className="grid gap-8 lg:grid-cols-2"><div className="skeleton aspect-square rounded-3xl" /><div className="space-y-4"><div className="skeleton h-5 w-1/3 rounded" /><div className="skeleton h-10 w-4/5 rounded" /><div className="skeleton h-5 w-1/2 rounded" /><div className="skeleton mt-8 h-36 rounded" /><div className="skeleton h-12 w-full rounded-xl" /></div></div></div>;
  if (error || !product) return <div className="container-page py-10"><ErrorState message={error} onRetry={() => navigate(0)} /><Link to="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-600"><FontAwesomeIcon icon={faArrowLeft} /> Back to products</Link></div>;
  const images = product.images?.length ? product.images : [product.thumbnail];
  const saved = hasItem(product.id);
  const discount = discountPercent(product);
  const buyNow = () => { addItem(product, quantity); navigate("/cart"); };
  return <div className="container-page py-7 sm:py-10">
    <div className="mb-6 flex flex-wrap items-center gap-2 text-xs capitalize text-slate-500"><Link to="/" className="hover:text-brand-600">Home</Link><FontAwesomeIcon icon={faChevronRight} className="text-[9px]" /><Link to="/products" className="hover:text-brand-600">Products</Link><FontAwesomeIcon icon={faChevronRight} className="text-[9px]" /><Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600">{product.category?.replaceAll("-", " ")}</Link><FontAwesomeIcon icon={faChevronRight} className="text-[9px]" /><span className="max-w-[180px] truncate font-semibold text-slate-800">{product.title}</span></div>
    <div className="grid gap-7 lg:grid-cols-2 lg:gap-12">
      <div><div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 sm:p-12"><img src={images[imageIndex] || product.thumbnail} alt={product.title} className="h-full w-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/700x700/f1f5f9/64748b?text=Product"; }} />{discount > 0 && <span className="absolute left-5 top-5 rounded-xl bg-coral-500 px-3 py-2 text-xs font-extrabold text-white">{discount}% OFF</span>}</div><div className="mt-3 flex gap-3 overflow-x-auto">{images.slice(0, 5).map((img, i) => <button key={`${img}-${i}`} onClick={() => setImageIndex(i)} className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border bg-white p-2 ${imageIndex === i ? "border-brand-500 ring-2 ring-blue-100" : "border-slate-200"}`} aria-label={`Show product image ${i + 1}`}><img src={img} alt="" className="h-full w-full object-contain" /></button>)}</div></div>
      <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">{product.brand || product.category?.replaceAll("-", " ")}</p><h1 className="section-title mt-3 text-3xl leading-tight sm:text-4xl">{product.title}</h1><div className="mt-4 flex flex-wrap items-center gap-3 text-sm"><span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 font-bold text-emerald-700"><FontAwesomeIcon icon={faStar} className="text-amber-400" /> {Number(product.rating || 0).toFixed(1)}</span><span className="text-slate-500">{product.reviews?.length ?? 0} customer reviews</span><span className={`text-xs font-bold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>{product.stock > 0 ? `In stock · ${product.stock} available` : "Out of stock"}</span></div>
      <div className="mt-6 flex flex-wrap items-baseline gap-3"><span className="text-3xl font-extrabold tracking-tight">{money(discountedPrice(product))}</span>{discount > 0 && <><span className="text-lg text-slate-400 line-through">{money(product.price)}</span><span className="text-sm font-bold text-emerald-600">Save {money(product.price - discountedPrice(product))}</span></>}</div><p className="mt-5 leading-7 text-slate-600">{product.description}</p>
      <div className="mt-7 flex flex-wrap items-center gap-3"><div className="flex items-center rounded-xl border border-slate-200 bg-white"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="Decrease quantity" className="h-11 w-10 text-slate-600 disabled:opacity-30"><FontAwesomeIcon icon={faMinus} /></button><span className="w-8 text-center text-sm font-bold">{quantity}</span><button onClick={() => setQuantity((q) => Math.min(Math.max(1, product.stock || 1), q + 1))} disabled={quantity >= product.stock} aria-label="Increase quantity" className="h-11 w-10 text-slate-600 disabled:opacity-30"><FontAwesomeIcon icon={faPlus} /></button></div><button disabled={product.stock <= 0} onClick={() => addItem(product, quantity)} className="btn-primary min-w-[155px] flex-1 disabled:cursor-not-allowed disabled:bg-slate-300">Add to cart</button><button onClick={() => toggleItem(product)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} className={`flex h-11 w-12 items-center justify-center rounded-xl border ${saved ? "border-pink-200 bg-pink-50 text-pink-500" : "border-slate-200 bg-white text-slate-600 hover:text-pink-500"}`}><FontAwesomeIcon icon={faHeart} /></button></div>
      <button disabled={product.stock <= 0} onClick={buyNow} className="btn-secondary mt-3 w-full disabled:opacity-50">Buy now</button>
      <div className="mt-7 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-4"><div className="flex gap-3 py-4"><FontAwesomeIcon icon={faTruckFast} className="mt-1 text-brand-600" /><div><p className="text-sm font-bold">Delivery estimate</p><p className="mt-1 text-xs text-slate-500">Shipping options and estimated costs appear at checkout.</p></div></div><div className="flex gap-3 py-4"><FontAwesomeIcon icon={faRotateLeft} className="mt-1 text-brand-600" /><div><p className="text-sm font-bold">Easy returns information</p><p className="mt-1 text-xs text-slate-500">Demo store policy: return eligibility is illustrative only.</p></div></div><div className="flex gap-3 py-4"><FontAwesomeIcon icon={faShieldHalved} className="mt-1 text-brand-600" /><div><p className="text-sm font-bold">Safe demo checkout</p><p className="mt-1 text-xs text-slate-500">No real payment is processed by this application.</p></div></div></div>
      <div className="mt-6 grid grid-cols-2 gap-3">{[["SKU", product.sku || `NX-${product.id}`], ["Weight", product.weight ? `${product.weight} units` : "Not specified"], ["Dimensions", product.dimensions ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth}` : "Not specified"], ["Warranty", product.warrantyInformation || "Not specified"]].map(([k, v]) => <div key={k} className="rounded-xl bg-slate-100/70 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</p><p className="mt-1 break-words text-xs font-semibold text-slate-700">{v}</p></div>)}</div>
      </div>
    </div>
    <section className="pt-14"><div className="mb-5"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">Keep exploring</p><h2 className="section-title mt-1 text-2xl sm:text-3xl">More in {product.category?.replaceAll("-", " ")}</h2></div><ProductGrid products={related} /></section>
  </div>;
}
