import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCartShopping, faChevronDown, faHeart, faMagnifyingGlass, faUser, faXmark, faBox, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { fetchCategories } from "../../services/productApi";

const badge = "absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-coral-500 px-1 text-[10px] font-extrabold text-white";
export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { const params = new URLSearchParams(location.search); setQuery(location.pathname === "/search" ? params.get("q") || "" : ""); }, [location.pathname, location.search]);
  useEffect(() => { const controller = new AbortController(); fetchCategories(controller.signal).then((data) => setCategories(data.map((c) => typeof c === "string" ? { slug: c, name: c } : c))).catch(() => {}); return () => controller.abort(); }, []);

  const submitSearch = (e) => { e.preventDefault(); const q = query.trim(); if (q) navigate(`/search?q=${encodeURIComponent(q)}`); else navigate("/products"); setMobileOpen(false); };
  const closeMobile = () => setMobileOpen(false);
  const linkClass = ({ isActive }) => `whitespace-nowrap text-sm font-semibold transition hover:text-brand-600 ${isActive ? "text-brand-600" : "text-slate-600"}`;

  return <>
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex h-[68px] items-center gap-3 sm:h-[78px] sm:gap-6">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="flex h-10 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden" aria-label={mobileOpen ? "Close menu" : "Open menu"}><FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} size="lg" /></button>
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Nexora home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg font-black text-white shadow-md shadow-blue-200">N</span>
          <span className="font-display text-xl font-extrabold tracking-tight text-brand-900 sm:text-2xl">nexora<span className="text-coral-500">.</span></span>
        </Link>
        <form onSubmit={submitSearch} className="relative ml-auto hidden max-w-[520px] flex-1 md:block">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands and more..." aria-label="Search products" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><FontAwesomeIcon icon={faXmark} /></button>}
        </form>
        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5 md:ml-0">
          <Link to="/wishlist" className="relative flex flex-col items-center gap-1 text-slate-600 transition hover:text-brand-600" aria-label={`Wishlist, ${wishCount} items`}><span className="relative"><FontAwesomeIcon icon={faHeart} size="lg" />{wishCount > 0 && <span className={badge}>{wishCount}</span>}</span><span className="hidden text-[10px] font-semibold sm:block">Wishlist</span></Link>
          <Link to="/cart" className="relative flex flex-col items-center gap-1 text-slate-600 transition hover:text-brand-600" aria-label={`Cart, ${count} items`}><span className="relative"><FontAwesomeIcon icon={faCartShopping} size="lg" />{count > 0 && <span className={badge}>{count}</span>}</span><span className="hidden text-[10px] font-semibold sm:block">Cart</span></Link>
          <div className="relative hidden sm:block">
            <button onClick={() => setCategoryOpen(!categoryOpen)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FontAwesomeIcon icon={faUser} />{user ? user.name.split(" ")[0] : "Account"}<FontAwesomeIcon icon={faChevronDown} className="text-xs" /></button>
            {categoryOpen && <><button className="fixed inset-0 z-40 cursor-default" aria-label="Close account menu" onClick={() => setCategoryOpen(false)} /><div className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
              {user ? <><div className="border-b px-3 py-2"><p className="truncate text-sm font-bold">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div><Link onClick={() => setCategoryOpen(false)} to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"><FontAwesomeIcon icon={faUser} /> My profile</Link><Link onClick={() => setCategoryOpen(false)} to="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"><FontAwesomeIcon icon={faBox} /> My orders</Link><button onClick={() => { logout(); setCategoryOpen(false); navigate("/"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign out</button></> : <><Link onClick={() => setCategoryOpen(false)} to="/login" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50">Sign in</Link><Link onClick={() => setCategoryOpen(false)} to="/register" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50">Create account</Link></>}
            </div></>}
          </div>
        </div>
      </div>
      <div className="hidden border-t border-slate-100 lg:block">
        <nav className="container-page flex h-11 items-center gap-7">
          <NavLink to="/" end className={linkClass}>Home</NavLink><NavLink to="/products" className={linkClass}>All products</NavLink>
          <div className="group relative flex h-full items-center"><button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand-600">Categories <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" /></button><div className="invisible absolute left-0 top-full z-50 max-h-[360px] w-64 overflow-auto rounded-b-2xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">{categories.map((cat) => <Link key={cat.slug} to={`/products?category=${encodeURIComponent(cat.slug)}`} className="block rounded-lg px-3 py-2 text-sm capitalize text-slate-600 hover:bg-blue-50 hover:text-brand-600">{cat.name || cat.slug}</Link>)}</div></div>
          <span className="ml-auto rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">Fresh finds, every day ✦</span>
        </nav>
      </div>
    </header>
    {mobileOpen && <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" onClick={closeMobile}>
      <nav className="animate-in h-full w-[min(340px,88vw)] overflow-y-auto bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between"><span className="font-display text-xl font-extrabold text-brand-900">nexora<span className="text-coral-500">.</span></span><button onClick={closeMobile} aria-label="Close menu" className="p-2"><FontAwesomeIcon icon={faXmark} /></button></div>
        <form onSubmit={submitSearch} className="relative mb-5 md:hidden"><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" /></form>
        {[["Home", "/"], ["All products", "/products"], ["Wishlist", "/wishlist"], ["Cart", "/cart"], ["My orders", "/orders"], [user ? "My profile" : "Sign in", user ? "/profile" : "/login"]].map(([label, to]) => <Link key={to} onClick={closeMobile} to={to} className="block rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-blue-50">{label}</Link>)}
        <p className="mb-2 mt-6 px-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Shop by category</p>
        {categories.map((cat) => <Link key={cat.slug} onClick={closeMobile} to={`/products?category=${encodeURIComponent(cat.slug)}`} className="block rounded-xl px-3 py-2.5 text-sm capitalize text-slate-600 hover:bg-slate-50">{cat.name || cat.slug}</Link>)}
      </nav>
    </div>}
  </>;
}
