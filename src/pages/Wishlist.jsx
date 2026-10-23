import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { EmptyState } from "../components/common/States.jsx";
import { money, discountedPrice } from "../utils/format.js";

export default function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  if (!items.length) return <div className="container-page py-12 sm:py-16"><EmptyState title="Your wishlist is waiting" description="Save products you like and compare them whenever you're ready." action={<Link to="/products" className="btn-primary">Explore products</Link>} /></div>;
  return <div className="container-page py-8 sm:py-11"><div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">Saved for later</p><h1 className="section-title mt-1 text-3xl sm:text-4xl">Your wishlist <span className="text-lg font-semibold text-slate-400">({items.length})</span></h1></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id} className="surface flex gap-4 p-4"><Link to={`/product/${item.id}`} className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2"><img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain" /></Link><div className="flex min-w-0 flex-1 flex-col"><Link to={`/product/${item.id}`} className="line-clamp-2 text-sm font-extrabold hover:text-brand-600">{item.title}</Link><p className="mt-2 font-extrabold">{money(discountedPrice(item))}</p><div className="mt-auto flex flex-wrap gap-2 pt-3"><button onClick={() => addItem(item)} disabled={item.stock <= 0} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-brand-700 hover:bg-blue-100 disabled:opacity-40"><FontAwesomeIcon icon={faCartPlus} /> Add to cart</button><button onClick={() => removeItem(item.id)} aria-label="Remove from wishlist" className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-500"><FontAwesomeIcon icon={faTrash} /></button></div></div></article>)}</div></div>;
}
