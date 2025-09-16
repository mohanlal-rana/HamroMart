import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBySearch } from "../features/products/publicProductSlice";

export default function SearchResults() {
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("search");

  const { searchResults, loadingSearch, errorSearch } = useSelector(
    (state) => state.publicProducts
  );

  useEffect(() => {
    if (query) {
      dispatch(fetchProductsBySearch(query));
    }
  }, [dispatch, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Search results for "<span className="text-blue-500">{query}</span>"
        </h2>

        {loadingSearch && <p className="text-gray-500">Loading...</p>}
        {errorSearch && <p className="text-red-500">{errorSearch}</p>}
        {!loadingSearch && searchResults.length === 0 && (
          <p className="text-gray-600">No products found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all overflow-hidden group"
            >
              <div className="relative h-56">
                <img
                  src={import.meta.env.VITE_API_URL + product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between h-36">
                <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-blue-700 font-bold text-lg">
                    ${product.price.toLocaleString()}
                  </p>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
