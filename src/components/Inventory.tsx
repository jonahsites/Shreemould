import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Search, Filter } from 'lucide-react';

const categories = ["All", "Chronograph", "Dive", "Dress", "GMT", "Aviation", "Vintage"];

const timepieces = [
  { id: 1, name: "Submariner Pro", category: "Dive", price: 9500, material: "Oystersteel", detail: "300m Waterproof", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Daytona Stealth", category: "Chronograph", price: 14200, material: "Ceramic / Steel", detail: "Tachymetric Scale", image: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Master Calendar", category: "Dress", price: 8800, material: "White Gold", detail: "Moon Phase", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Sky Dweller", category: "GMT", price: 12500, material: "Everose Gold", detail: "Dual Time Zone", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "Nautilus Steel", category: "Vintage", price: 45000, material: "Stainless Steel", detail: "Classic 1976 Design", image: "https://images.unsplash.com/photo-1508685096489-7aac29623b66?auto=format&fit=crop&q=80&w=800" },
  { id: 6, name: "Heritage Pilot", category: "Aviation", price: 6500, material: "Titanium", detail: "Anti-Magnetic", image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&q=80&w=800" },
  { id: 7, name: "Speedmaster", category: "Chronograph", price: 7200, material: "Steel", detail: "Hesalite Crystal", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800" },
  { id: 8, name: "Deep Sea", category: "Dive", price: 11800, material: "Titanium / Steel", detail: "Helium Escape Valve", image: "https://images.unsplash.com/photo-1622434641406-a15812345ad1?auto=format&fit=crop&q=80&w=800" },
];

interface InventoryProps {
  onClose: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTimepieces = timepieces.filter(item => 
    (activeCategory === "All" || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-luxury-black overflow-y-auto px-6 py-10 md:px-16"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-20 text-white">
          <div>
            <div className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 font-serif">The Private Vault</div>
            <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tight leading-none text-white uppercase">
              Current <span className="text-white/10 text-outline">Inventory</span> <br/> of Reference.
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-4 border border-white/10 rounded-none hover:bg-white/10 transition-colors pointer-events-auto text-white flex items-center justify-center bg-luxury-black shadow-2xl"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center mb-16 border-b border-white/5 pb-10">
                  <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-none text-[9px] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat ? 'bg-accent text-black' : 'bg-transparent border border-white/10 text-white/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96 text-white">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text"
              placeholder="Filter by reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-none py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-white/40 placeholder:text-white/10"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTimepieces.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-luxury-navy border border-white/5 hover:border-white/20 transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden relative bg-luxury-black">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-1">
                     <span className="text-[8px] font-mono text-white/40 tracking-[0.4em]">REF_00{item.id}</span>
                     <div className="w-8 h-px bg-white/10" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-10">
                  <div className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-4 font-bold">{item.category}</div>
                  <h3 className="text-xl font-serif tracking-tight mb-8 text-white uppercase group-hover:text-white transition-colors">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                    <div>
                      <div className="text-[9px] uppercase text-white/20 tracking-widest mb-1">Material</div>
                      <div className="text-xs font-bold tracking-tight text-white/40 uppercase">{item.material}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-white/20 tracking-widest mb-1">Pricing</div>
                      <div className="text-sm font-bold tracking-tight text-white">${item.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                
                <button className="absolute bottom-10 right-10 w-12 h-12 bg-white text-black flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all delay-75 shadow-2xl">
                  <ArrowUpRight size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTimepieces.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-white/10 uppercase tracking-[0.4em] text-xs">No matching references found in our private vault.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Inventory;
