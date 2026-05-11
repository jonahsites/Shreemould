import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Search, Filter } from 'lucide-react';

const categories = ["All", "Rings", "Pendants", "Bracelets", "Earrings", "Custom"];

const jewelryItems = [
  { id: 1, name: "Solitaire Halo Ring", category: "Rings", price: 450, material: "18K Gold / Platinum", detail: "MatrixGold Source File", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Intricate Cross Pendant", category: "Pendants", price: 320, material: "Yellow Gold", detail: "Micro-Pave Ready", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Cubic Link Bracelet", category: "Bracelets", price: 580, material: "Rose Gold", detail: "Manifold STL Included", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Floral Diamond Studs", category: "Earrings", price: 290, material: "White Gold", detail: "Print-Optimized Mesh", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "Heavy Cuban Chain", category: "Custom", price: 850, material: "Solid Gold / VVS", detail: "Custom Length Script", image: "https://images.unsplash.com/photo-1626784224261-dd9d4973430d?auto=format&fit=crop&q=80&w=800" },
  { id: 6, name: "Emerald Cut Band", category: "Rings", price: 380, material: "Platinum", detail: "Parametric Design", image: "https://images.unsplash.com/photo-1603561591411-0e7320b97760?auto=format&fit=crop&q=80&w=800" },
  { id: 7, name: "Initial Script Pendant", category: "Pendants", price: 220, material: "Silver / Gold", detail: "Font Customizable CAD", image: "https://images.unsplash.com/photo-1611085583191-a3b1a308c027?auto=format&fit=crop&q=80&w=800" },
  { id: 8, name: "Twisted Rope Ring", category: "Rings", price: 190, material: "Multi-Metal", detail: "Geometric Precision", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800" },
];

interface InventoryProps {
  onClose: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredItems = jewelryItems.filter(item => 
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
            <div className="text-gold/60 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 font-serif">The Digital Vault</div>
            <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tight leading-none text-white uppercase">
              CAD <span className="text-gold/20 text-outline">GALLERY</span> <br/> Masterpieces.
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-4 border border-gold/20 rounded-none hover:bg-gold/10 transition-colors pointer-events-auto text-gold flex items-center justify-center bg-luxury-black shadow-2xl"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center mb-16 border-b border-gold/10 pb-10">
                  <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-none text-[9px] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat ? 'bg-gold text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'bg-transparent border border-gold/10 text-gold/40 hover:text-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96 text-white">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/20" size={16} />
            <input 
              type="text"
              placeholder="Search CAD designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border border-gold/10 rounded-none py-4 pl-12 pr-6 text-sm text-gold focus:outline-none focus:border-gold/40 placeholder:text-gold/10"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-luxury-navy border border-gold/5 hover:border-gold/20 transition-all overflow-hidden"
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
                     <span className="text-[8px] font-mono text-gold/40 tracking-[0.4em]">CAD_MOD_00{item.id}</span>
                     <div className="w-8 h-px bg-gold/20" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-10">
                  <div className="text-[9px] uppercase tracking-[0.4em] text-gold/60 mb-4 font-bold">{item.category}</div>
                  <h3 className="text-xl font-serif tracking-tight mb-8 text-white uppercase group-hover:text-gold transition-colors">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-8 border-t border-gold/5 pt-8">
                    <div>
                      <div className="text-[9px] uppercase text-gold/40 tracking-widest mb-1">Source</div>
                      <div className="text-xs font-bold tracking-tight text-white/40 uppercase">{item.material}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-gold/40 tracking-widest mb-1">CAD Fee</div>
                      <div className="text-sm font-bold tracking-tight text-gold">${item.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                
                <button className="absolute bottom-10 right-10 w-12 h-12 bg-gold text-black flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all delay-75 shadow-2xl">
                  <ArrowUpRight size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-gold/20 uppercase tracking-[0.4em] text-xs">No matching designs found in the digital vault.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Inventory;
