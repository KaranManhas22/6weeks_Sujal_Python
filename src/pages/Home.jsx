import { useState, useEffect } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Building, Heart, BarChart3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state (Optimized with Debouncing)
  const [searchTerm, setSearchTerm] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Favorites state
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);

  // Comparison state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/properties');
      setProperties(data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync favorites on load
  const loadFavorites = () => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoritesList(favs);
  };

  useEffect(() => {
    fetchProperties();
    loadFavorites();

    // Listen to custom favorite toggled events
    window.addEventListener('favoritesChanged', loadFavorites);
    return () => window.removeEventListener('favoritesChanged', loadFavorites);
  }, []);

  // Custom Debounce Hook Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter listings client-side for dynamic reactivity
  useEffect(() => {
    let result = properties;

    if (keyword) {
      result = result.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    if (type) {
      result = result.filter(p => p.propertyType === type);
    }
    if (city) {
      result = result.filter(p => p.location.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (priceMax) {
      result = result.filter(p => p.price <= Number(priceMax));
    }
    if (showOnlyFavorites) {
      result = result.filter(p => favoritesList.includes(p._id));
    }

    setFilteredProperties(result);
  }, [properties, keyword, type, city, priceMax, showOnlyFavorites, favoritesList]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setKeyword('');
    setType('');
    setCity('');
    setPriceMax('');
    setShowOnlyFavorites(false);
  };

  // Compare functions
  const handleCompareToggle = (property) => {
    const exists = compareList.find(p => p._id === property._id);
    if (exists) {
      setCompareList(compareList.filter(p => p._id !== property._id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 properties at once.');
        return;
      }
      setCompareList([...compareList, property]);
    }
  };

  const handleRemoveFromCompare = (id) => {
    setCompareList(compareList.filter(p => p._id !== id));
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-none"
          >
            Find Your Perfect <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Sanctuary</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-slate-400 font-medium"
          >
            Discover exceptional properties in prime neighborhoods. Luxury homes, modern condos, and cozy apartments curated just for you.
          </motion.p>

          {/* Search Filter Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl shadow-2xl shadow-indigo-950/20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Keyword Search */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
                />
              </div>

              {/* City / Location */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Austin)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
                />
              </div>

              {/* Property Type Dropdown */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                <Building className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full cursor-pointer"
                >
                  <option value="" className="bg-slate-950">Property Type</option>
                  <option value="House" className="bg-slate-950">House</option>
                  <option value="Apartment" className="bg-slate-950">Apartment</option>
                  <option value="Condo" className="bg-slate-950">Condo</option>
                  <option value="Townhouse" className="bg-slate-950">Townhouse</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`flex items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                    showOnlyFavorites
                      ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                  title={showOnlyFavorites ? 'Show All Properties' : 'Show Favorites Only'}
                >
                  <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-500' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="col-span-2 flex items-center justify-center rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">
              {showOnlyFavorites ? 'Your Wishlist' : 'Latest Listings'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">Explore our newly added premium properties.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Showing {filteredProperties.length} matches</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-slate-400 font-medium text-sm">Finding properties...</span>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl mt-8">
            <Building className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300">No properties found</h3>
            <p className="text-sm text-slate-500 mt-1">Try modifying your filters or search keywords.</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-indigo-400 hover:bg-slate-800 transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isCompared={compareList.some(p => p._id === property._id)}
                onCompareToggle={handleCompareToggle}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Comparison Drawer */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 inset-x-0 z-30 p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-semibold text-white">
                  Comparing {compareList.length} {compareList.length === 1 ? 'property' : 'properties'}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">(select up to 3)</span>
              </div>

              {/* Compared properties mini-tags */}
              <div className="flex flex-wrap gap-2.5">
                {compareList.map((p) => (
                  <div key={p._id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="font-semibold text-white line-clamp-1 max-w-[150px]">{p.title}</span>
                    <button
                      onClick={() => handleRemoveFromCompare(p._id)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Compare Trigger button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCompareList([])}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowCompareModal(true)}
                  disabled={compareList.length < 2}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer transition-colors"
                >
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompareModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl overflow-x-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-500" />
                  <span>Property Comparison Matrix</span>
                </h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="rounded-xl border border-slate-800 p-1.5 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comparison Matrix Table */}
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/30">
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">Specification</th>
                    {compareList.map((p) => (
                      <th key={p._id} className="px-4 py-3 text-sm font-bold text-white w-1/4">
                        <div className="line-clamp-1">{p.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                  {/* Price */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Price</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3 font-bold text-emerald-400">
                        {p.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>
                  {/* Property Type */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Property Type</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3 font-semibold text-indigo-300">{p.propertyType}</td>
                    ))}
                  </tr>
                  {/* City & State */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Location</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3">{p.location.city}, {p.location.state}</td>
                    ))}
                  </tr>
                  {/* Bedrooms */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Bedrooms</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3">{p.bedrooms} Beds</td>
                    ))}
                  </tr>
                  {/* Bathrooms */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Bathrooms</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3">{p.bathrooms} Baths</td>
                    ))}
                  </tr>
                  {/* Area */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Area</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3">{p.area} sqft</td>
                    ))}
                  </tr>
                  {/* Year Built */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Year Built</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3">{p.yearBuilt || 'N/A'}</td>
                    ))}
                  </tr>
                  {/* Furnished */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Furnished</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3">{p.isFurnished ? 'Yes' : 'No'}</td>
                    ))}
                  </tr>
                  {/* Amenities */}
                  <tr>
                    <td className="px-4 py-3 text-slate-500 font-medium">Amenities</td>
                    {compareList.map((p) => (
                      <td key={p._id} className="px-4 py-3 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {p.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400">{a}</span>
                          ))}
                          {p.amenities.length > 3 && <span>+{p.amenities.length - 3}</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
