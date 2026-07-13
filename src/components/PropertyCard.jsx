import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyCard = memo(({ property, isCompared, onCompareToggle }) => {
  const { _id, title, price, location, bedrooms, bathrooms, area, propertyType, status, images } = property;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favs.includes(_id));
  }, [_id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavs;
    if (favs.includes(_id)) {
      updatedFavs = favs.filter(id => id !== _id);
      setIsFavorite(false);
    } else {
      updatedFavs = [...favs, _id];
      setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(updatedFavs));
    
    // Dispatch a custom event to alert other listening components (like Navbar/Home)
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const defaultImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
  const coverImage = images && images.length > 0 ? images[0] : defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900 shadow-xl transition-shadow hover:shadow-indigo-500/5"
    >
      {/* Property Image & Status overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
        
        {/* Overlay Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-md ${
            status === 'For Sale' ? 'bg-emerald-500/80 border border-emerald-400/20' : 'bg-indigo-600/80 border border-indigo-400/20'
          }`}>
            {status}
          </span>
          <span className="rounded-full bg-slate-900/80 border border-slate-700/30 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-300 backdrop-blur-md">
            {propertyType}
          </span>
        </div>

        {/* Favorite (Heart) Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md border shadow-md transition-all hover:scale-110 cursor-pointer bg-slate-900/80 border-slate-700/30"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
        </button>

        {/* Price tag */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xl font-display font-bold text-white">
            {price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-xs font-medium text-slate-400 mb-2">
          <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span>{location.city}, {location.state}</span>
        </div>

        <Link to={`/properties/${_id}`} className="block group-hover:text-indigo-400 transition-colors">
          <h3 className="text-lg font-display font-semibold line-clamp-1 text-white">
            {title}
          </h3>
        </Link>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-slate-400">
          <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-950/40 rounded-xl">
            <Bed className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">{bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-950/40 rounded-xl">
            <Bath className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">{bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-950/40 rounded-xl">
            <Maximize className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">{area} sqft</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-12 gap-2">
          <Link
            to={`/properties/${_id}`}
            className="col-span-9 flex items-center justify-center gap-2 rounded-2xl bg-slate-800/60 hover:bg-indigo-600 border border-slate-700/50 hover:border-indigo-500 py-2.5 text-sm font-semibold text-slate-200 hover:text-white transition-all duration-300"
          >
            <span>View Details</span>
          </Link>
          
          <button
            onClick={() => onCompareToggle(property)}
            className={`col-span-3 flex items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer ${
              isCompared
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 hover:bg-indigo-600/30'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
            title="Add to Compare"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
