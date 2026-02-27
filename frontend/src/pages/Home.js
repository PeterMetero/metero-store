
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../utils/api'; // adjust path if your api.js is elsewhere
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await API.get('/api/products?limit=6'); // adjust endpoint/query as per your backend
        setFeaturedProducts(response.data.products || response.data || []);
      } catch (error) {
        console.error('Failed to load featured products:', error);
        toast.error('Could not load products right now');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20 px-6 rounded-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to <span className="text-blue-300">Metero Store</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Discover quality products at unbeatable prices — shop smart, shop Metero.
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-900 hover:bg-gray-100 font-semibold py-4 px-10 rounded-full text-lg transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured items...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No featured products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-700">
                      ${product.price?.toFixed(2) || 'N/A'}
                    </span>
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16 px-6 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Shopping?</h2>
        <Link
          to="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-full text-lg transition"
        >
          Browse All Products
        </Link>
      </section>
    </div>
  );
};

export default Home;