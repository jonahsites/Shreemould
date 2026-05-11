import React from 'react';

const BrandLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 border border-white/10 rounded-none flex items-center justify-center overflow-hidden bg-[#0c0e14] shadow-2xl">
           <img 
             src="https://scontent-lga3-2.cdninstagram.com/v/t51.82787-19/671814932_18082300949166593_8572662144281401063_n.jpg?cb=8438d1d6-89aba764&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gETvn836jZKuQzARgYV74UrHIssb852pfexcl1leWEqWozSjNZ_fLC2tHjRTsWDjtbC9H10hnRHEwOVJGF3EE1M&_nc_ohc=mdULwJslmNsQ7kNvwFaxxhS&_nc_gid=T5G0ap4AyQy1Q3EOQ97ATQ&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_Af5qt6O580WA6cs8Y_UMGO70o86aKYwCaOBc2LxaG9STWg&oe=6A067E70&_nc_sid=7a9f4b" 
             alt="AR Watches Corp Logo"
             className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
        </div>
      </div>
      <div className="mt-4 text-[12px] uppercase tracking-[0.5em] text-accent font-serif font-bold border-t border-accent/20 pt-2 text-center uppercase">
        AR Watches Corp
      </div>
    </div>
  );
};

export default BrandLogo;
