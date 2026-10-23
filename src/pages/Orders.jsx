import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faArrowRight, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";
import { readStorage } from "../utils/storage.js";
import { money } from "../utils/format.js";
import { EmptyState } from "../components/common/States.jsx";

export default function Orders() {
  const { user } = useAuth();
  const orders = readStorage("nexora_orders", []).filter((o) => o.userId === user?.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (!orders.length) return <div className="container-page py-12 sm:py-16"><EmptyState title="No orders yet" description="Your placed demo orders will appear here." action={<Link to="/products" className="btn-primary">Start shopping</Link>} /></div>;
  return <div className="container-page py-8 sm:py-11"><div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">Your purchases</p><h1 className="section-title mt-1 text-3xl sm:text-4xl">Order history</h1><p className="mt-2 text-sm text-slate-500">Orders are saved locally in this browser.</p></div><div className="space-y-4">{orders.map((order) => <article key={order.id} className="surface p-4 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-600"><FontAwesomeIcon icon={faReceipt} /></span><div><p className="font-extrabold">{order.id}</p><p className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p><span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">{order.status}</span></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><div><p className="text-xs text-slate-500">Order total</p><p className="mt-1 text-lg font-extrabold">{money(order.totals?.total)}</p></div><Link to={`/order-success/${order.id}`} className="btn-secondary text-xs">View details <FontAwesomeIcon icon={faArrowRight} /></Link></div></div><div className="mt-4 flex gap-2 overflow-x-auto border-t border-slate-100 pt-4">{(order.items || []).map((item) => <div key={item.id} title={item.title} className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 p-2"><img src={item.thumbnail} alt="" className="h-10 w-10 object-contain" /><div className="max-w-[150px]"><p className="truncate text-xs font-bold">{item.title}</p><p className="text-[10px] text-slate-500">Qty {item.quantity}</p></div></div>)}</div></article>)}</div></div>;
}
