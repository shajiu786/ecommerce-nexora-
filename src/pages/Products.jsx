import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faXmark, faChevronRight, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchAllProducts, fetchCategories, fetchCategoryProducts, searchProducts } from "../services/productApi.js";
import ProductGrid from "../components/products/ProductGrid.jsx";
import { ErrorState } from "../components/common/States.jsx";

const normalizeCategory = (c) => typeof c === "string" ? { slug: c, name: c } : c;
export default function Products() {
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get("category") || "";
  const queryParam = params.get("q") || "";
  const [all, setAll] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(categoryParam);
  const [sort, setSort] = useState(params.get("sort") || "featured");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState("0");
  const [availability, setAvailability] = useState("all");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => { setCategory(categoryParam); setSort(params.get("sort") || "featured"); }, [categoryParam, params]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    const request = queryParam ? searchProducts(queryParam, controller.signal) : categoryParam ? fetchCategoryProducts(categoryParam, controller.signal) : fetchAllProducts(controller.signal);
    Promise.all([request, fetchCategories(controller.signal)]).then(([data, cats]) => {
      setAll(data.products || []); setCategories((cats || []).map(normalizeCategory));
    }).catch((e) => { if (e.code !== "ERR_CANCELED") setError("Products could not be loaded. Check your connection and retry."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [categoryParam, queryParam]);

  const shown = useMemo(() => {
    let list = all.filter((p) => Number(p.price) <= maxPrice && Number(p.rating || 0) >= Number(minRating) && (availability === "all" || (availability === "stock" ? p.stock > 0 : p.stock <= 0)));
    if (!categoryParam && category) list = list.filter((p) => p.category === category);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [all, maxPrice, minRating, availability, category, categoryParam, sort]);

  const clearFilters = () => { setCategory(""); setMaxPrice(2000); setMinRating("0"); setAvailability("all"); setSort("featured"); setParams(queryParam ? { q: queryParam } : {}); };
  const updateSort = (value) => { setSort(value); const next = {}; if (categoryParam) next.category = categoryParam; if (queryParam) next.q = queryParam; if (value !== "featured") next.sort = value; setParams(next); };
  const filters = <div className="space-y-6">
    <div><div className="mb-3 flex items-center justify-between"><h3 className="font-extrabold">Category</h3><button onClick={() => { setCategory(""); setParams(queryParam ? { q: queryParam } : {}); }} className="text-xs font-semibold text-brand-600">Clear</button></div><div className="max-h-60 space-y-2 overflow-auto pr-1">{categories.map((cat) => <label key={cat.slug} className="flex cursor-pointer items-center gap-2.5 text-sm capitalize text-slate-600"><input type="radio" name="category" checked={(categoryParam || category) === cat.slug} onChange={() => { setCategory(cat.slug); if (!queryParam) setParams({ category: cat.slug, ...(sort !== "featured" ? { sort } : {}) }); }} className="accent-blue-600" />{cat.name || cat.slug}</label>)}</div></div>
    <div><div className="mb-3 flex items-center justify-between"><h3 className="font-extrabold">Maximum price</h3><span className="text-xs font-bold text-brand-600">${maxPrice}</span></div><input aria-label="Maximum price" type="range" min="0" max="2000" step="25" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-600" /><div className="flex justify-between text-[11px] text-slate-400"><span>$0</span><span>$2,000+</span></div></div>
    <div><h3 className="mb-3 font-extrabold">Minimum rating</h3><select className="field text-sm" value={minRating} onChange={(e) => setMinRating(e.target.value)}><option value="0">All ratings</option><option value="3">3★ and up</option><option value="4">4★ and up</option><option value="4.5">4.5★ and up</option></select></div>
    <div><h3 className="mb-3 font-extrabold">Availability</h3><select className="field text-sm" value={availability} onChange={(e) => setAvailability(e.target.value)}><option value="all">All products</option><option value="stock">In stock</option><option value="out">Out of stock</option></select></div>
    <button onClick={clearFilters} className="btn-secondary w-full text-sm"><FontAwesomeIcon icon={faRotateLeft} /> Clear all filters</button>
  </div>;

  return <div className="container-page py-7 sm:py-10">
    <div className="mb-6 flex items-center gap-2 text-xs text-slate-500"><Link to="/" className="hover:text-brand-600">Home</Link><FontAwesomeIcon icon={faChevronRight} className="text-[9px]" /><span className="font-semibold text-slate-800">{queryParam ? `Search: ${queryParam}` : categoryParam ? categoryParam.replaceAll("-", " ") : "All products"}</span></div>
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">{queryParam ? "Search results" : "The whole collection"}</p><h1 className="section-title mt-1 text-3xl capitalize sm:text-4xl">{queryParam ? `Results for “${queryParam}”` : categoryParam ? categoryParam.replaceAll("-", " ") : "Find your next favourite"}</h1><p className="mt-2 text-sm text-slate-500">{loading ? "Finding products..." : `${shown.length} product${shown.length === 1 ? "" : "s"} to explore`}</p></div><div className="flex items-center gap-2"><button onClick={() => setMobileFilters(true)} className="btn-secondary lg:hidden"><FontAwesomeIcon icon={faSliders} /> Filters</button><label className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">Sort by <select className="field min-w-[145px] py-2 text-xs sm:min-w-[170px] sm:text-sm" value={sort} onChange={(e) => updateSort(e.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name: A to Z</option></select></label></div></div>
    {error ? <ErrorState message={error} onRetry={() => { setParams(new URLSearchParams(params)); }} /> : <div className="grid gap-6 lg:grid-cols-[230px_1fr]"><aside className="surface hidden h-fit p-5 lg:block"><h2 className="mb-5 text-lg font-extrabold">Filters</h2>{filters}</aside><div><div className="mb-4 flex flex-wrap items-center gap-2">{categoryParam && <button onClick={() => setParams(queryParam ? { q: queryParam } : {})} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-brand-700">{categoryParam.replaceAll("-", " ")} <FontAwesomeIcon icon={faXmark} className="ml-1" /></button>}{queryParam && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Query: {queryParam}</span>}</div><ProductGrid products={shown} loading={loading} skeletonCount={12} emptyTitle="No matching products" emptyDescription="Try raising the price limit, changing the rating, or clearing your filters." /></div></div>}
    {mobileFilters && <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" onClick={() => setMobileFilters(false)}><div className="animate-in ml-auto h-full w-[min(360px,92vw)] overflow-y-auto bg-white p-5" onClick={(e) => e.stopPropagation()}><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-extrabold">Filters</h2><button aria-label="Close filters" onClick={() => setMobileFilters(false)} className="p-2"><FontAwesomeIcon icon={faXmark} /></button></div>{filters}<button onClick={() => setMobileFilters(false)} className="btn-primary mt-5 w-full">Show {shown.length} products</button></div></div>}
  </div>;
}
