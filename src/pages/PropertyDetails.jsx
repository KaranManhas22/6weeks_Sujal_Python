import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Bed, Bath, Maximize, MapPin, Calendar, Check, Send, ChevronLeft, Info, Calculator, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetails = () => {
  const { id } = useParams();
  const { showToast } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Recalculate Mortgage
  useEffect(() => {
    if (!property) return;
    const homePrice = property.price;
    const downPaymentAmount = homePrice * (downPaymentPercent / 100);
    const principal = homePrice - downPaymentAmount;
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    let payment = 0;
    if (monthlyRate === 0) {
      payment = principal / numberOfPayments;
    } else {
      payment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    setMonthlyPayment(payment);
  }, [property, downPaymentPercent, interestRate, loanTerm]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    showToast('Message sent to seller! They will get back to you shortly.', 'success');
    setContactMsg('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span className="text-slate-400 font-medium text-sm">Loading details...</span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 text-center py-24">
        <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Property Not Found</h3>
        <p className="text-slate-500 mt-2">The property may have been removed or is unavailable.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-indigo-400 hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';
  const displayImage = activeImage || defaultImage;

  // Mortgage Breakdown Calculations
  const downPaymentAmount = property.price * (downPaymentPercent / 100);
  const principalAmount = property.price - downPaymentAmount;
  const propertyTaxEst = (property.price * 0.012) / 12; // 1.2% annual tax
  const homeInsuranceEst = 120; // $120 monthly average estimate
  const totalMonthlyEst = monthlyPayment + propertyTaxEst + homeInsuranceEst;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white tracking-wide ${
                property.status === 'For Sale' ? 'bg-emerald-500/80' : 'bg-indigo-600/80'
              }`}>
                {property.status}
              </span>
              <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-semibold text-indigo-300">
                {property.propertyType}
              </span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-2 font-medium">
              <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>{property.address}, {property.location.city}, {property.location.state}</span>
            </div>
          </div>

          {/* Showcase Image */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-2xl relative">
            <img
              src={displayImage}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>

          {/* Thumbnail Selector */}
          {property.images && property.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-indigo-500 scale-95 shadow-md shadow-indigo-500/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Spec Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
            <div className="text-center p-3 bg-slate-950/40 rounded-2xl">
              <Bed className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <div className="text-xs text-slate-500 font-medium">Bedrooms</div>
              <div className="text-sm font-bold text-white mt-0.5">{property.bedrooms} Beds</div>
            </div>
            <div className="text-center p-3 bg-slate-950/40 rounded-2xl">
              <Bath className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <div className="text-xs text-slate-500 font-medium">Bathrooms</div>
              <div className="text-sm font-bold text-white mt-0.5">{property.bathrooms} Baths</div>
            </div>
            <div className="text-center p-3 bg-slate-950/40 rounded-2xl">
              <Maximize className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <div className="text-xs text-slate-500 font-medium">Square Feet</div>
              <div className="text-sm font-bold text-white mt-0.5">{property.area} sqft</div>
            </div>
            <div className="text-center p-3 bg-slate-950/40 rounded-2xl">
              <Calendar className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <div className="text-xs text-slate-500 font-medium">Year Built</div>
              <div className="text-sm font-bold text-white mt-0.5">{property.yearBuilt || 'N/A'}</div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-white">About Property</h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-slate-900/20 p-5 rounded-3xl border border-slate-800/40">
              {property.description}
            </p>
          </div>

          {/* Amenities Section */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-white">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-800 bg-slate-900/40">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl">
            <div className="text-xs text-slate-400 font-medium">Property Value</div>
            <div className="text-3xl font-display font-extrabold text-white mt-1">
              {property.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500 mt-1">Estimates exclude taxes and closing commissions</div>
          </div>

          {/* Agent Information & Form */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-display font-bold text-white border-b border-slate-800 pb-3">Contact Seller</h3>
            
            {/* Seller profile */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-lg">
                {property.seller?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="leading-snug">
                <div className="font-semibold text-white text-sm">{property.seller?.name || 'Verified Seller'}</div>
                <div className="text-xs text-slate-400">{property.seller?.email}</div>
                {property.seller?.phone && <div className="text-xs text-slate-500 mt-0.5">{property.seller.phone}</div>}
              </div>
            </div>

            {/* Message form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="I am interested in this listing..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-650 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry</span>
              </button>
            </form>
          </div>

          {/* Mortgage Calculator Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-display font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <span>Mortgage Calculator</span>
            </h3>

            <div className="space-y-4">
              {/* Down Payment % */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Down Payment ({downPaymentPercent}%)</span>
                  <span>{downPaymentAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Interest Rate % */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Interest Rate</span>
                  <span>{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Loan Term Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Loan Term</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="15">15 Years (Fixed)</option>
                  <option value="30">30 Years (Fixed)</option>
                </select>
              </div>

              {/* Breakdown Output */}
              <div className="border-t border-slate-850 pt-4 mt-2 space-y-2.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Principal Loan Amount:</span>
                  <span className="font-semibold text-white">
                    {principalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Principal & Interest (monthly):</span>
                  <span className="font-semibold text-white">
                    {monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Property Tax Est. (monthly):</span>
                  <span className="font-semibold text-white">
                    {propertyTaxEst.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Home Insurance Est. (monthly):</span>
                  <span className="font-semibold text-white">
                    {homeInsuranceEst.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                  <span>Est. Monthly Payment:</span>
                  <span className="text-indigo-400">
                    {totalMonthlyEst.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
