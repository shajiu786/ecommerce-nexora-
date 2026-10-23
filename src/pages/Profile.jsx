import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBox, faHeart, faCartShopping, faArrowRightFromBracket, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [name, setName] = useState(user?.name || "");
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => setName(user?.name || ""), [user]);
  const save = (e) => { e.preventDefault(); if (name.trim().length < 2) return toast("Please enter a valid name.", "error"); updateProfile({ name }); toast("Profile updated."); };
  return <div className="container-page py-8 sm:py-12"><div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">Your space</p><h1 className="section-title mt-1 text-3xl sm:text-4xl">My profile</h1></div><div className="grid gap-6 lg:grid-cols-[300px_1fr]"><aside className="surface flex h-fit flex-col items-center p-6 text-center"><div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-3xl font-extrabold text-brand-600">{user?.name?.slice(0, 1).toUpperCase()}</div><h2 className="mt-4 text-lg font-extrabold">{user?.name}</h2><p className="mt-1 break-all text-sm text-slate-500">{user?.email}</p><span className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Demo member</span><button onClick={() => { logout(); toast("You have signed out.", "info"); navigate("/"); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign out</button></aside><div className="space-y-5"><section className="surface p-5 sm:p-7"><h2 className="text-lg font-extrabold">Personal information</h2><p className="mt-1 text-sm text-slate-500">Keep your demo profile details up to date.</p><form onSubmit={save} className="mt-5 max-w-xl space-y-4"><div><label htmlFor="profile-name" className="mb-1.5 block text-sm font-bold">Full name</label><input id="profile-name" className="field" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></div><div><label htmlFor="profile-email" className="mb-1.5 block text-sm font-bold">Email address</label><input id="profile-email" className="field bg-slate-50 text-slate-500" value={user?.email || ""} readOnly /></div><button className="btn-primary"><FontAwesomeIcon icon={faFloppyDisk} /> Save changes</button></form></section><section className="grid gap-3 sm:grid-cols-3">{[{ icon: faBox, label: "My orders", value: "View history", to: "/orders" }, { icon: faHeart, label: "Wishlist", value: `${wishCount} saved`, to: "/wishlist" }, { icon: faCartShopping, label: "Cart", value: `${count} items`, to: "/cart" }].map((item) => <Link key={item.to} to={item.to} className="surface p-4 transition hover:-translate-y-0.5 hover:shadow-soft"><FontAwesomeIcon icon={item.icon} className="text-xl text-brand-600" /><p className="mt-3 text-sm font-extrabold">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.value}</p></Link>)}</section><p className="rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">This demo stores account data in browser LocalStorage. It is not suitable for real credentials or production authentication.</p></div></div></div>;
}
