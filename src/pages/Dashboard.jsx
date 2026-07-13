import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, X, Building, DollarSign, Layers, Bed, Bath, Maximize, MapPin, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [propertyType, setPropertyType] = useState('House');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState(0);
  const [yearBuilt, setYearBuilt] = useState(new Date().getFullYear());
  const [isFurnished, setIsFurnished] = useState(false);
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Auth Guard
    if (!user || (user.role !== 'Seller' && user.role !== 'Admin')) {
      showToast('Unauthorized access. Redirected to home.', 'error');
      navigate('/');
      return;
    }

    const fetchMyProperties = async () => {
      try {
        const { data } = await api.get('/properties');
        // Filter properties by this seller (since mock backend API returns all properties)
        const myProps = data.properties.filter(p => p.seller === user._id || p.seller?._id === user._id);
        setProperties(myProps);
      } catch (error) {
        console.error('Error fetching dashboard properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const amenities = amenitiesInput
      ? amenitiesInput.split(',').map((x) => x.trim()).filter(Boolean)
      : [];
    const images = imagesInput
      ? imagesInput.split(',').map((x) => x.trim()).filter(Boolean)
      : [];

    const body = {
      title,
      description,
      price: Number(price),
      address,
      location: {
        city,
        state,
        zipCode,
        coordinates: { lat: 34.0522, lng: -118.2437 }, // Defaults
      },
      propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      parkingSpaces: Number(parkingSpaces),
      yearBuilt: Number(yearBuilt),
      isFurnished,
      amenities,
      images,
    };

    try {
      const { data } = await api.post('/properties', body);
      showToast('Property listed successfully! Pending Admin approval.', 'success');
      setProperties([data, ...properties]);
      
      // Reset Form
      setTitle('');
      setDescription('');
      setPrice('');
      setAddress('');
      setCity('');
      setState('');
      setZipCode('');
      setArea('');
      setAmenitiesInput('');
      setImagesInput('');
      setShowAddForm(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white">Seller Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your property listings portfolio.</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>List New Property</span>
        </button>
      </div>

      {/* Main Inventory Section */}
      <div className="mt-10">
        <h2 className="text-xl font-display font-bold text-white mb-6">Your Listed Properties</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-slate-400 text-sm">Loading your properties...</span>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl">
            <Building className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No properties listed yet</h3>
            <p className="text-xs text-slate-500 mt-1">Click the button above to create your first real estate listing.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-950/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Property Info</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stats</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-sm text-slate-300">
                  {properties.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-indigo-400" />
                          <span>{item.address}, {item.location.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-indigo-300 uppercase">
                        {item.propertyType}
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {item.bedrooms} Bed • {item.bathrooms} Bath • {item.area} sqft
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          {item.approvalStatus === 'Approved' ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approved</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending Approval</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD PROPERTY */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
                  <Building className="w-6 h-6 text-indigo-500" />
                  <span>List New Property</span>
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-slate-800 p-1.5 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Listing Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Luxury Family Villa"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Property Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about neighborhood, architecture, special characteristics..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650 resize-none"
                  />
                </div>

                {/* Price, Type & Year Built Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Price (USD)</label>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                      <DollarSign className="w-4 h-4 text-indigo-400" />
                      <input
                        type="number"
                        required
                        placeholder="500000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-650"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Property Type</label>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="bg-transparent border-none text-white text-sm focus:outline-none w-full cursor-pointer"
                      >
                        <option value="House" className="bg-slate-950">House</option>
                        <option value="Apartment" className="bg-slate-950">Apartment</option>
                        <option value="Condo" className="bg-slate-950">Condo</option>
                        <option value="Townhouse" className="bg-slate-950">Townhouse</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Year Built</label>
                    <input
                      type="number"
                      required
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div className="border-t border-slate-850 pt-4 mt-1 space-y-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Location Details</span>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Street Address</label>
                      <input
                        type="text"
                        required
                        placeholder="123 Luxury Dr"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Austin"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">State</label>
                      <input
                        type="text"
                        required
                        placeholder="TX"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                      />
                    </div>
                  </div>
                </div>

                {/* Specs Row */}
                <div className="border-t border-slate-850 pt-4 mt-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Bedrooms</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Bathrooms</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Area (sqft)</label>
                    <input
                      type="number"
                      required
                      placeholder="2500"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 h-full pt-6">
                    <input
                      type="checkbox"
                      id="is-furnished"
                      checked={isFurnished}
                      onChange={(e) => setIsFurnished(e.target.checked)}
                      className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 w-4 h-4 bg-slate-950"
                    />
                    <label htmlFor="is-furnished" className="text-sm font-semibold text-slate-300 select-none cursor-pointer">
                      Is Furnished
                    </label>
                  </div>
                </div>

                {/* Amenities & Images Inputs */}
                <div className="border-t border-slate-850 pt-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Amenities (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Pool, Gym, Garden, Smart Home, Security"
                      value={amenitiesInput}
                      onChange={(e) => setAmenitiesInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Image URLs (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                      value={imagesInput}
                      onChange={(e) => setImagesInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <span>Publish Listing</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
