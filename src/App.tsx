import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Menu, MapPin, Phone, ArrowUpRight, MousePointer2 } from "lucide-react";
import Inventory from "./components/Inventory";
import JewelryArchive from "./components/JewelryArchive";
import { useState } from "react";

const navLinks = [
  { name: "CAD Designs", href: "#archive" },
  { name: "Custom Made", href: "#heritage" },
  { name: "Contact", href: "#contact" },
];

const specs = [
  { val: "3D CAD", label: "Specialty" },
  { val: "Custom", label: "Jewelry" },
  { val: "Global", label: "Shipping" },
  { val: "PayPal", label: "Accepted" },
];

export default function App() {
  const [showInventory, setShowInventory] = useState(false);
  
  return (
    <div className="relative bg-luxury-black font-sans selection:bg-accent selection:text-black overflow-x-hidden text-white" id="home">
      {/* Background HUD Layers - Minimalist style */}
      <div className="fixed inset-0 z-0 bg-grid-scan opacity-[0.2] pointer-events-none" />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 w-full z-100 flex items-center justify-between px-10 py-10 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-16 h-16 border border-accent/40 rounded-full flex items-center justify-center group-hover:border-gold transition-all overflow-hidden bg-luxury-navy shadow-2xl p-1">
             <div className="w-full h-full rounded-full bg-gold/10 flex items-center justify-center font-serif text-gold text-2xl font-bold border border-gold/20">
               SM
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] font-serif font-medium text-gold tracking-widest uppercase leading-none mb-1">Shree Mould</span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-gold/60 font-bold">3D Jewelry • CAD Designs</span>
          </div>
        </div>

        <div className="flex items-center gap-8 pointer-events-auto">
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 hover:text-gold transition-colors"
                whileHover={{ y: -1 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[8px] uppercase tracking-widest text-gold/40 font-bold">Secure Payment</span>
              <span className="text-[10px] uppercase tracking-widest text-white/80 font-black">PayPal Accepted</span>
            </div>
            <button 
              onClick={() => setShowInventory(true)}
              className="bg-gold text-black px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gold/80 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]"
            >
              Gallery
            </button>
          </div>
          <button className="md:hidden text-white"><Menu size={24} /></button>
        </div>
      </nav>

      {/* JEWELRY ARCHIVE SECTION */}
      <div id="archive" className="relative z-10">
        <JewelryArchive />
      </div>

      {/* HERITAGE STRIP */}
      <div id="heritage" className="relative z-20 w-full bg-monochrome py-40 border-y border-gold/10">
        <div className="max-w-[1400px] mx-auto px-10 text-gold shadow-[0_0_100px_rgba(197,160,89,0.05)]">
          <div className="flex flex-col items-center mb-20 text-center">
             <span className="font-luxury text-xl text-gold/60 mb-4 uppercase tracking-[0.3em]">Pure Craftsmanship</span>
             <h2 className="text-white text-6xl font-serif font-light tracking-tight whitespace-pre-line leading-tight uppercase">
               If You Can Imagine It, <br/> <span className="text-gold">We Can Create It</span>
             </h2>
             <p className="mt-8 text-gold/40 text-[10px] uppercase tracking-[0.5em] font-bold">Your One Stop Shop For All Custom Made Jewelry Cad Design</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-20">
            {specs.map((spec, i) => (
              <div key={i} className="flex flex-col gap-4 group">
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold/20 group-hover:text-gold transition-colors">[{i + 1}] {spec.label}</span>
                <span className="text-4xl font-serif text-white uppercase tracking-wider">{spec.val}</span>
                <div className="w-0 h-px bg-gold group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER: REFINED */}
      <footer id="contact" className="relative z-20 bg-luxury-black border-t border-gold/10 px-10 pt-40 pb-20 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          <div>
            <span className="text-[14px] font-bold uppercase tracking-[0.5em] text-gold mb-8 block font-serif">Shree Mould</span>
            <p className="text-white/30 text-[10px] leading-loose uppercase tracking-[0.2em]">
              Premier destination for high-end 3D Jewelry CAD Designs. We bring your imagination to life with precision and digital artistry. Now accepting PayPal for global commissions.
            </p>
            <div className="mt-8">
               <span className="bg-gold/10 border border-gold/20 text-gold px-4 py-2 text-[9px] font-bold tracking-widest uppercase">PayPal Accepted</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 text-gold/40">Studio</h4>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-gold transition-colors cursor-pointer">Digital First Studio</p>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-gold transition-colors cursor-pointer">Global Distribution</p>
            <p className="text-gold text-xs uppercase tracking-widest font-black mt-2">@shree.mould</p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 text-gold/40">Services</h4>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-gold transition-colors cursor-pointer">3D Jewelry Models</p>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-gold transition-colors cursor-pointer">Custom Jewelry CAD</p>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-gold transition-colors cursor-pointer">Design Consultation</p>
          </div>

          <div className="flex flex-col gap-4 text-white">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 text-gold/40">Contact</h4>
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-[0.2em] text-gold">FOLLOW US ON INSTAGRAM</span>
            </div>
            <div className="flex items-center gap-3 bg-gold/5 p-4 border border-gold/10">
              <span className="text-xs tracking-[0.2em] font-bold">@shree.mould</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto pt-20 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] uppercase tracking-[0.5em] text-gold/20">© 2026 Shree Mould. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="text-[12px] font-serif text-gold tracking-widest">PAYPAL</span>
          </div>
        </div>
      </footer>

      {/* Fleet Overlay Component - Hidden unless needed */}
      <AnimatePresence>
        {showInventory && (
          <Inventory onClose={() => setShowInventory(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}



