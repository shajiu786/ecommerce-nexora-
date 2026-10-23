export const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "USD", maximumFractionDigits: 2
}).format(Number(value) || 0);

export const discountedPrice = (product) => {
  const price = Number(product?.price) || 0;
  const discount = Number(product?.discountPercentage) || 0;
  return discount > 0 && discount < 100 ? price * (1 - discount / 100) : price;
};

export const discountPercent = (product) => Math.round(Number(product?.discountPercentage) || 0);
export const safeText = (value) => String(value ?? "").trim();
