import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, getCategories } from "@/lib/products/data";
import {
  SlidersHorizontal,
  Search,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

interface Product {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price: number;
  discount?: number;
  stock?: number;
  brand?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const params = await searchParams;

  const search = typeof params?.search === "string" ? params.search.trim() : "";
  const category =
    typeof params?.category === "string" ? params.category.trim() : "";
  const minPrice =
    typeof params?.minPrice === "string" ? params.minPrice.trim() : "";
  const maxPrice =
    typeof params?.maxPrice === "string" ? params.maxPrice.trim() : "";
  const sort = typeof params?.sort === "string" ? params.sort.trim() : "";

  // URL parameters dynamic handle
  const page = Math.max(1, parseInt(params?.page || "1", 10));
  const limit = 12; // Per page 12 products

  // Backend API Calls (server-side)
  const [categories, { products = [], totalPages = 1, totalProducts = 0 }] =
    await Promise.all([
      getCategories(),
      getProducts({
        page,
        limit,
        search,
        category,
        minPrice,
        maxPrice,
        sort,
      }),
    ]);

  // Display name for the selected category
  const selectedCategoryName =
    categories.find((c: Category) => c._id === category || c.slug === category)
      ?.name || category;

  const isFiltered = Boolean(search || category || minPrice || maxPrice);

  // Build the shared query object for pagination links
  const buildQuery = (nextPage: number) => ({
    ...(search && { search }),
    ...(category && { category }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(sort && { sort }),
    page: nextPage,
  });

  // Dynamic 4-Page Window Calculation
  const maxButtons = 4;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50/50 dark:bg-slate-950 pt-6 pb-16 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        {/* Header Banner */}
        <div className="mb-8 rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-300">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Our Products
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Explore our curated selection of high-quality items and exclusive
            offers.
          </p>
        </div>

        {/* Search & Filter Form */}
        <form
          action="/products"
          method="GET"
          className="mb-8 rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors duration-300"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <input
              type="text"
              name="search"
              placeholder="Search product..."
              defaultValue={search}
              className="min-w-[200px] flex-1 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-950/50 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-purple-300 dark:focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-600/20"
            />

            {/* Category Select */}
            <select
              name="category"
              defaultValue={category}
              className="rounded-xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-950/50 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 outline-none transition focus:border-purple-300 dark:focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-600/20"
            >
              <option
                value=""
                className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
              >
                All Categories
              </option>
              {categories.map((cat: Category) => (
                <option
                  key={cat._id}
                  value={cat.name}
                  className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                >
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <input
              type="number"
              name="minPrice"
              min="0"
              placeholder="Min price ($)"
              defaultValue={minPrice}
              className="w-32 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-950/50 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-purple-300 dark:focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-600/20"
            />
            <input
              type="number"
              name="maxPrice"
              min="0"
              placeholder="Max price ($)"
              defaultValue={maxPrice}
              className="w-32 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-950/50 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-purple-300 dark:focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-600/20"
            />

            {/* Sort */}
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-950/50 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 outline-none transition focus:border-purple-300 dark:focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-600/20"
            >
              <option
                value=""
                className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
              >
                Sort: Newest
              </option>
              <option
                value="price-asc"
                className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
              >
                Price: Low to High
              </option>
              <option
                value="price-desc"
                className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
              >
                Price: High to Low
              </option>
            </select>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 dark:bg-purple-700 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-purple-700 dark:hover:bg-purple-600 shadow-sm shadow-purple-600/20"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {/* Clear Button */}
            {isFiltered && (
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 transition hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </Link>
            )}
          </div>

          {isFiltered && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-purple-600 dark:text-purple-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters applied — refine your search anytime.
            </p>
          )}
        </form>

        {/* Product Count Info */}
        {products.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-purple-100/60 dark:border-purple-950/60 pb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedCategoryName || search || "All Products"}
            </h2>

            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {products.length}
              </span>{" "}
              of {totalProducts} products
            </span>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <Link
                  href={{
                    pathname: "/products",
                    query: buildQuery(page > 1 ? page - 1 : 1),
                  }}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                    page <= 1
                      ? "pointer-events-none opacity-40 border-purple-100 dark:border-purple-900/40 bg-gray-50 dark:bg-slate-900 text-gray-400 dark:text-gray-600"
                      : "border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 shadow-sm"
                  }`}
                >
                  Prev
                </Link>

                {/* Visible Page Buttons */}
                {visiblePages.map((pNum) => (
                  <Link
                    key={pNum}
                    href={{
                      pathname: "/products",
                      query: buildQuery(pNum),
                    }}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                      pNum === page
                        ? "bg-purple-600 dark:bg-purple-700 text-white shadow-sm shadow-purple-600/30"
                        : "border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 shadow-sm"
                    }`}
                  >
                    {pNum}
                  </Link>
                ))}

                {/* Next Button */}
                <Link
                  href={{
                    pathname: "/products",
                    query: buildQuery(
                      page < totalPages ? page + 1 : totalPages,
                    ),
                  }}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                    page >= totalPages
                      ? "pointer-events-none opacity-40 border-purple-100 dark:border-purple-900/40 bg-gray-50 dark:bg-slate-900 text-gray-400 dark:text-gray-600"
                      : "border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 shadow-sm"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-900 px-6 py-20 text-center shadow-sm transition-colors duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
              <ShoppingBag className="h-8 w-8 stroke-1 fill-purple-600/10 dark:fill-purple-400/10" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              {isFiltered ? "No Products Found" : "No Products Available"}
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500 dark:text-gray-400">
              {search
                ? `No products matched "${search}". Try another search term or clear filters.`
                : selectedCategoryName
                  ? `No products found in "${selectedCategoryName}".`
                  : isFiltered
                    ? "No products match the selected filters."
                    : "Products will appear here when available."}
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 dark:bg-purple-700 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-purple-700 dark:hover:bg-purple-600 shadow-sm shadow-purple-600/20"
            >
              View All Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
