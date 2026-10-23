import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock, faArrowRight, faStore } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function AuthShell({ title, subtitle, children }) {
  return <div className="container-page flex min-h-[65vh] items-center justify-center py-10"><div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft md:grid-cols-[.85fr_1.15fr]"><div className="hidden flex-col justify-between bg-brand-900 p-9 text-white md:flex"><Link to="/" className="font-display text-2xl font-extrabold">nexora<span className="text-coral-500">.</span></Link><div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-200"><FontAwesomeIcon icon={faStore} size="lg" /></span><h2 className="section-title mt-5 text-3xl leading-tight">A better kind<br />of everyday.</h2><p className="mt-3 text-sm leading-6 text-blue-100">Find something useful. Find something lovely. Find your next favourite.</p></div><p className="text-xs text-blue-200">Nexora demo storefront</p></div><div className="p-6 sm:p-10"><Link to="/" className="mb-8 inline-block font-display text-xl font-extrabold text-brand-900 md:hidden">nexora<span className="text-coral-500">.</span></Link><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">Welcome to Nexora</p><h1 className="section-title mt-2 text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-500">{subtitle}</p>{children}<p className="mt-6 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-800"><FontAwesomeIcon icon={faLock} className="mr-2" />Demo only: account data is stored in this browser. Never use a real password.</p></div></div></div>;
}

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault(); setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address.");
    if (!form.password) return setError("Enter your password.");
    setBusy(true);
    try { login(form); toast("Welcome back!"); navigate(location.state?.from?.pathname || "/", { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <AuthShell title="Welcome back" subtitle="Sign in to pick up where you left off."><form onSubmit={submit} className="mt-7 space-y-4" noValidate><div><label className="mb-1.5 block text-sm font-bold" htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" className="field" value={form.email} onChange={change} placeholder="you@example.com" /></div><div><label className="mb-1.5 block text-sm font-bold" htmlFor="password">Password</label><div className="relative"><input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" className="field pr-12" value={form.password} onChange={change} placeholder="Your password" /><button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400"><FontAwesomeIcon icon={show ? faEyeSlash : faEye} /></button></div></div>{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}<button disabled={busy} className="btn-primary w-full">{busy ? "Signing in..." : "Sign in"} <FontAwesomeIcon icon={faArrowRight} /></button></form><p className="mt-5 text-center text-sm text-slate-500">New to Nexora? <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800">Create an account</Link></p></AuthShell>;
}

export function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault(); setError("");
    if (form.name.trim().length < 2) return setError("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");
    if (form.password !== form.confirm) return setError("Your passwords do not match.");
    try { register(form); toast("Account created successfully."); navigate("/profile", { replace: true }); }
    catch (err) { setError(err.message); }
  };
  return <AuthShell title="Create your account" subtitle="Save your favourites and make checkout a little easier."><form onSubmit={submit} className="mt-7 space-y-4" noValidate><div><label className="mb-1.5 block text-sm font-bold" htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" className="field" value={form.name} onChange={change} placeholder="Your full name" /></div><div><label className="mb-1.5 block text-sm font-bold" htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" className="field" value={form.email} onChange={change} placeholder="you@example.com" /></div><div><label className="mb-1.5 block text-sm font-bold" htmlFor="password">Password</label><div className="relative"><input id="password" name="password" type={show ? "text" : "password"} autoComplete="new-password" className="field pr-12" value={form.password} onChange={change} placeholder="At least 8 characters" /><button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400"><FontAwesomeIcon icon={show ? faEyeSlash : faEye} /></button></div></div><div><label className="mb-1.5 block text-sm font-bold" htmlFor="confirm">Confirm password</label><input id="confirm" name="confirm" type={show ? "text" : "password"} autoComplete="new-password" className="field" value={form.confirm} onChange={change} placeholder="Repeat your password" /></div>{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}<button className="btn-primary w-full">Create account <FontAwesomeIcon icon={faArrowRight} /></button></form><p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-brand-600">Sign in</Link></p></AuthShell>;
}
