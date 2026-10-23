import ProductCard from "./ProductCard.jsx";
import { ProductSkeletons, EmptyState } from "../common/States.jsx";

export default function ProductGrid({ products = [], loading = false, skeletonCount = 8, emptyTitle, emptyDescription }) {
  if (loading) return <ProductSkeletons count={skeletonCount} />;
  if (!products.length) return <EmptyState title={emptyTitle || "No products found"} description={emptyDescription || "Try another search or adjust your filters."} />;
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
