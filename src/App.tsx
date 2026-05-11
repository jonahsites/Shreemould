import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Menu, MapPin, Phone, ArrowUpRight, MousePointer2 } from "lucide-react";
import Inventory from "./components/Inventory";
import WatchArchive from "./components/WatchArchive";
import { useState } from "react";

const navLinks = [
  { name: "Collection", href: "#archive" },
  { name: "Maison", href: "#home" },
  { name: "Boutique", href: "#contact" },
];

const specs = [
  { val: "Miami", label: "Headquarters" },
  { val: "Downtown", label: "Flagship" },
  { val: "Wholesale", label: "Direct" },
  { val: "Global", label: "Distribution" },
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
          <div className="w-16 h-16 border border-accent/20 rounded-none flex items-center justify-center group-hover:border-accent transition-all overflow-hidden bg-luxury-navy shadow-2xl">
             <img 
               src="https://scontent-lga3-2.cdninstagram.com/v/t51.82787-19/671814932_18082300949166593_8572662144281401063_n.jpg?cb=8438d1d6-89aba764&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gETvn836jZKuQzARgYV74UrHIssb852pfexcl1leWEqWozSjNZ_fLC2tHjRTsWDjtbC9H10hnRHEwOVJGF3EE1M&_nc_ohc=mdULwJslmNsQ7kNvwFaxxhS&_nc_gid=T5G0ap4AyQy1Q3EOQ97ATQ&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_Af5qt6O580WA6cs8Y_UMGO70o86aKYwCaOBc2LxaG9STWg&oe=6A067E70&_nc_sid=7a9f4b" 
               alt="AR Watches Corp Logo"
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-serif font-medium text-accent tracking-widest uppercase leading-none mb-1">AR Watches Corp</span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-bold">WATCH WHOLESALER • MIAMI</span>
          </div>
        </div>

        <div className="flex items-center gap-8 pointer-events-auto">
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 hover:text-accent transition-colors"
                whileHover={{ y: -1 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
          <button 
            onClick={() => setShowInventory(true)}
            className="bg-accent text-black px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent/80 transition-all"
          >
            Explore Collection
          </button>
          <button className="md:hidden text-white"><Menu size={24} /></button>
        </div>
      </nav>

      {/* WATCH ARCHIVE SECTION */}
      <div id="archive" className="relative z-10">
        <WatchArchive />
      </div>

      {/* HERITAGE STRIP */}
      <div id="heritage" className="relative z-20 w-full bg-luxury-navy py-40 border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex flex-col items-center mb-20 text-center">
             <span className="font-luxury text-xl text-white/40 mb-4 uppercase tracking-[0.3em]">Pure Sophistication</span>
             <h2 className="text-white text-6xl font-serif font-light tracking-tight whitespace-pre-line leading-tight uppercase">
               The Pinnacle of <br/> <span className="monochrome-gradient">Horological Art</span>
             </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-20">
            {specs.map((spec, i) => (
              <div key={i} className="flex flex-col gap-4 group">
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/20 group-hover:text-white transition-colors">[{i + 1}] {spec.label}</span>
                <span className="text-4xl font-serif text-white uppercase tracking-wider">{spec.val}</span>
                <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER: REFINED */}
      <footer id="contact" className="relative z-20 bg-luxury-black border-t border-white/5 px-10 pt-40 pb-20 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-accent mb-8 block font-serif">AR Watches Corp</span>
            <p className="text-white/30 text-[10px] leading-loose uppercase tracking-[0.2em]">
              Premier luxury watch wholesaler based in Miami. Authorized distributor providing curated timepieces with secure global delivery.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-20">Headquarters</h4>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">169 E. Flagler St</p>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">Suite 1018</p>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">Miami, FL 33131</p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-20">Certifications</h4>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">@mondaniweb</p>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">@watch_dealer_group</p>
            <p className="text-white/60 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">Verified Authenticity</p>
          </div>

          <div className="flex flex-col gap-4 text-white">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 text-white/20">Contact</h4>
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-accent/60" />
              <span className="text-xs tracking-[0.2em]">INFO@ARWATCHESCORP.COM</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={14} className="text-accent/60" />
              <span className="text-xs tracking-[0.2em]">MIAMI, FLORIDA</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/20">© 2026 AR Watches Corp. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors cursor-pointer">Terms of Service</span>
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



