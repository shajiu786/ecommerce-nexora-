import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faRotateRight } from "@fortawesome/free-solid-svg-icons";

export function ProductSkeletons({ count = 8 }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{Array.from({ length: count }, (_, i) => <div key={i} className="surface overflow-hidden p-3"><div className="skeleton aspect-square rounded-xl" /><div className="skeleton mt-4 h-3 w-2/3 rounded" /><div className="skeleton mt-3 h-4 w-full rounded" /><div className="skeleton mt-4 h-8 w-1/2 rounded" /></div>)}</div>;
}
export function ErrorState({ message = "We couldn't load these products.", onRetry }) {
  return <div className="surface flex flex-col items-center px-6 py-14 text-center"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"><FontAwesomeIcon icon={faRotateRight} size="lg" /></div><h3 className="text-lg font-bold">Something went wrong</h3><p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>{onRetry && <button className="btn-primary mt-5" onClick={onRetry}>Try again</button>}</div>;
}
export function EmptyState({ title = "Nothing here just yet", description = "Explore the store and discover something you love.", action }) {
  return <div className="surface flex flex-col items-center px-6 py-14 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-brand-600"><FontAwesomeIcon icon={faBoxOpen} size="2x" /></div><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
