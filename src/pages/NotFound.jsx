import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
export default function NotFound() {
  return <div className="container-page flex min-h-[55vh] items-center justify-center py-12"><div className="text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-brand-600"><FontAwesomeIcon icon={faCompass} size="2x" /></span><p className="mt-5 text-xs font-extrabold uppercase tracking-[.2em] text-brand-600">404 · Wrong turn</p><h1 className="section-title mt-2 text-4xl sm:text-5xl">This page wandered off.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">The link may be outdated, or the page might not exist. Let's get you back to the good stuff.</p><Link to="/" className="btn-primary mt-6">Back to home</Link></div></div>;
}
