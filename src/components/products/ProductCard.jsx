import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar, faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import { discountedPrice, discountPercent, money } from "../../utils/format";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const saved = hasItem(product.id);
  const discount = discountPercent(product);
  return (
    <article className="product-card surface group relative flex min-w-0 flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative m-2 overflow-hidden rounded-xl bg-slate-50 sm:m-3">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`} className="flex aspect-square items-center justify-center p-4 sm:p-5">
          <img src={product.thumbnail || product.images?.[0]} alt={product.title} loading="lazy" className="product-image h-full w-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/500x500/f1f5f9/64748b?text=Product"; }} />
        </Link>
        {discount > 0 && <span className="absolute left-2 top-2 rounded-lg bg-coral-500 px-2 py-1 text-[10px] font-extrabold text-white sm:left-3 sm:top-3 sm:text-xs">{discount}% OFF</span>}
        <button aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleItem(product)} className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-sm transition hover:scale-105 sm:right-3 sm:top-3 ${saved ? "border-pink-100 text-pink-500" : "border-slate-100 text-slate-500 hover:text-pink-500"}`}><FontAwesomeIcon icon={faHeart} /></button>
        <Link to={`/product/${product.id}`} aria-label="Quick view product" className="absolute bottom-2 right-2 hidden h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-brand-600 hover:text-white group-hover:flex"><FontAwesomeIcon icon={faEye} /></Link>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
        <span className="truncate text-[10px] font-bold uppercase tracking-wider text-brand-600 sm:text-[11px]">{product.category?.replaceAll("-", " ")}</span>
        <Link to={`/product/${product.id}`} className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-5 text-slate-800 hover:text-brand-600 sm:text-sm">{product.title}</Link>
        <div className="mt-2 flex items-center gap-1.5 text-xs"><FontAwesomeIcon icon={faStar} className="text-amber-400" /><span className="font-bold">{Number(product.rating || 0).toFixed(1)}</span><span className="text-slate-400">({product.reviews?.length ?? 0})</span></div>
        <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-extrabold text-slate-900 sm:text-base">{money(discountedPrice(product))}</span>
          {discount > 0 && <span className="text-[10px] text-slate-400 line-through sm:text-xs">{money(product.price)}</span>}
        </div>
        <div className="mt-auto pt-3">
          <button disabled={product.stock <= 0} onClick={() => addItem(product)} className={`flex w-full items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-bold transition sm:text-sm ${product.stock <= 0 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-blue-50 text-brand-700 hover:bg-brand-600 hover:text-white"}`}>
            <FontAwesomeIcon icon={faCartPlus} /> {product.stock <= 0 ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
