import { Link, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBox, faArrowRight, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { readStorage } from "../utils/storage.js";
import { money } from "../utils/format.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const order = location.state?.order || readStorage("nexora_orders", []).find((o) => o.id === id && o.userId === user?.id);
  return <div className="container-page py-10 sm:py-16"><div className="surface mx-auto max-w-2xl p-6 text-center sm:p-10"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><FontAwesomeIcon icon={faCheck} size="2x" /></span><p className="mt-5 text-xs font-extrabold uppercase tracking-[.18em] text-emerald-600">Order recorded</p><h1 className="section-title mt-2 text-3xl sm:text-4xl">You're all set!</h1><p className="mt-3 text-sm leading-6 text-slate-500">Your demo order has been saved in this browser. No payment was processed and no real shipment was created.</p>{order ? <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">Order reference</p><p className="mt-1 font-extrabold">{order.id}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand-700">{order.status}</span></div><div className="mt-4 border-t border-slate-200 pt-4"><p className="text-xs text-slate-500">Order total</p><p className="mt-1 text-2xl font-extrabold">{money(order.totals?.total)}</p><p className="mt-2 text-xs text-slate-500">{order.items?.length || 0} product line(s) · {new Date(order.createdAt).toLocaleString()}</p></div></div> : <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">Order reference: <b>{id}</b></div>}<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/orders" className="btn-primary"><FontAwesomeIcon icon={faBox} /> View my orders</Link><Link to="/products" className="btn-secondary"><FontAwesomeIcon icon={faBagShopping} /> Keep shopping <FontAwesomeIcon icon={faArrowRight} /></Link></div></div></div>;
}
