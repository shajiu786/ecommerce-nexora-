import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faEnvelope, faShieldHalved, faTruckFast, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const subscribe = (e) => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast("Enter a valid email address.", "error"); return; } toast("You're on the list! (Demo subscription)"); setEmail(""); };
  return <footer className="mt-16 bg-[#101c36] text-white">
    <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
      <div><Link to="/" className="font-display text-2xl font-extrabold">nexora<span className="text-coral-500">.</span></Link><p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">Good finds. Great prices. A little more joy in every delivery.</p><div className="mt-5 flex gap-3"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><FontAwesomeIcon icon={faInstagram} /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><FontAwesomeIcon icon={faFacebookF} /></a><a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><FontAwesomeIcon icon={faXTwitter} /></a></div></div>
      <div><h3 className="font-bold">Explore</h3><div className="mt-4 flex flex-col gap-3 text-sm text-slate-300"><Link className="hover:text-white" to="/products">All products</Link><Link className="hover:text-white" to="/products?sort=rating">Top rated</Link><Link className="hover:text-white" to="/wishlist">Your wishlist</Link><Link className="hover:text-white" to="/cart">Shopping cart</Link></div></div>
      <div><h3 className="font-bold">Shopping with confidence</h3><div className="mt-4 space-y-4 text-sm text-slate-300"><p className="flex gap-3"><FontAwesomeIcon icon={faTruckFast} className="mt-1 text-blue-300" /> Shipping estimates at checkout</p><p className="flex gap-3"><FontAwesomeIcon icon={faShieldHalved} className="mt-1 text-blue-300" /> Demo checkout, no real payment</p><p className="flex gap-3"><FontAwesomeIcon icon={faRotateLeft} className="mt-1 text-blue-300" /> Easy-to-find order records</p></div></div>
      <div><h3 className="font-bold">Get the good stuff</h3><p className="mt-3 text-sm leading-6 text-slate-300">New drops, clever finds and occasional offers. No spam.</p><form onSubmit={subscribe} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="newsletter-email">Email address</label><div className="relative min-w-0 flex-1"><FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-300" required /></div><button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 hover:bg-blue-400" aria-label="Subscribe"><FontAwesomeIcon icon={faArrowRight} /></button></form></div>
    </div>
    <div className="border-t border-white/10"><div className="container-page flex flex-col gap-2 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Nexora Marketplace. Demo storefront.</span><span>Built for discovery. Powered by DummyJSON.</span></div></div>
  </footer>;
}
