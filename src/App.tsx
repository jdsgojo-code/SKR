/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ShoppingBag, Search, Menu, ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const products = [
  // GOLD (Row 1)
  { id: 1, name: "Aurelian Choker", price: "$2,400", category: "GOLD", image: "/gold.png.png" },
  { id: 2, name: "Lumina Drop", price: "$1,850", category: "GOLD", image: "/gold.png.png" },
  { id: 3, name: "Obsidian Signet", price: "$1,200", category: "GOLD", image: "/gold.png.png" },
  { id: 4, name: "Celestial Cuff", price: "$3,100", category: "GOLD", image: "/gold.png.png" },
  // SILVER (Row 2)
  { id: 5, name: "Gilded Serpent", price: "$1,500", category: "SILVER", image: "/silver.png.png" },
  { id: 6, name: "Ethereal Pearl", price: "$2,100", category: "SILVER", image: "/silver.png.png" },
  { id: 7, name: "Midnight Band", price: "$950", category: "SILVER", image: "/silver.png.png" },
  { id: 8, name: "Solaris Pendant", price: "$2,800", category: "SILVER", image: "/silver.png.png" },
  // COIN (Row 3)
  { id: 9, name: "Lunar Studs", price: "$1,350", category: "COIN", image: "/coin.svg.png" },
  { id: 10, name: "Starlight Bangle", price: "$1,900", category: "COIN", image: "/coin.svg.png" },
  { id: 11, name: "Ancient Charm", price: "$750", category: "COIN", image: "/coin.svg.png" },
  { id: 12, name: "Royal Emerald", price: "$4,500", category: "COIN", image: "/coin.svg.png" },
  // BAR (Row 4)
  { id: 13, name: "Desert Rose", price: "$1,100", category: "BAR", image: "/bar.png.png" },
  { id: 14, name: "Oceanic Drop", price: "$3,200", category: "BAR", image: "/bar.png.png" },
  { id: 15, name: "Infinity Knot", price: "$1,650", category: "BAR", image: "/bar.png.png" },
  { id: 16, name: "Golden Bar", price: "$2,300", category: "BAR", image: "/bar.png.png" },
];

const TiltCard: React.FC<{ product: any; index: number }> = ({ product, index }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = (y - centerY) / 12; // Slightly more tilt
    const rY = (centerX - x) / 12;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        opacity: { duration: 0.8, delay: (index % 4) * 0.1 },
        y: { duration: 0.8, delay: (index % 4) * 0.1 },
        rotateX: { type: "spring", stiffness: 150, damping: 20, mass: 0.5 },
        rotateY: { type: "spring", stiffness: 150, damping: 20, mass: 0.5 },
        scale: { type: "spring", stiffness: 300, damping: 25 },
        marginTop: { duration: 0.3, ease: "easeOut" },
        marginBottom: { duration: 0.3, ease: "easeOut" }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        rotateX, 
        rotateY,
        marginTop: isHovered ? -20 : 0,
        marginBottom: isHovered ? 20 : 0,
        scale: isHovered ? 1.02 : 1
      }}
      style={{ perspective: 1500 }}
      className="group cursor-pointer flex flex-col"
    >
      <figure className="relative aspect-[3/4] overflow-hidden bg-surface-container-high mb-8 flex items-center justify-center border border-outline-variant/10 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-[8px] uppercase tracking-[0.5em] text-secondary/20">Image Pending</div>
        )}
        <div className="absolute inset-0 bg-surface/0 group-hover:bg-surface/5 transition-colors duration-500"></div>
      </figure>
      <figcaption className="flex flex-col items-center text-center space-y-2">
        <h4 className="text-lg font-serif text-primary tracking-[0.2em] uppercase">
          {product.name}
        </h4>
        <p className="text-[10px] font-sans text-secondary/60 tracking-[0.1em]">{product.price}</p>
      </figcaption>
    </motion.article>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const shoppingSectionRef = useRef<HTMLElement>(null);
  
  const rowRefs = {
    GOLD: useRef<HTMLDivElement>(null),
    SILVER: useRef<HTMLDivElement>(null),
    COIN: useRef<HTMLDivElement>(null),
    BAR: useRef<HTMLDivElement>(null),
  };

  const scrollToRow = (category: string) => {
    const ref = rowRefs[category as keyof typeof rowRefs];
    if (ref.current) {
      const navHeight = 100; // Offset for the sticky nav
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Observer for showing/hiding categories in nav
    const navObserver = new IntersectionObserver(
      ([entry]) => {
        setShowCategories(entry.isIntersecting || entry.boundingClientRect.top < 10);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -10% 0px" 
      }
    );

    // Obposers for tracking active category
    const categoryObservers: IntersectionObserver[] = [];
    Object.entries(rowRefs).forEach(([cat, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveCategory(cat);
            }
          },
          {
            threshold: 0.5, // Trigger when half the row is visible
            rootMargin: "-100px 0px -50% 0px" // Adjusted for nav height
          }
        );
        observer.observe(ref.current);
        categoryObservers.push(observer);
      }
    });

    const section = shoppingSectionRef.current;
    if (section) {
      navObserver.observe(section);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (section) {
        navObserver.unobserve(section);
      }
      categoryObservers.forEach(obs => obs.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-primary selection:text-on-primary">
      {/* Navigation */}
      <div className="sticky top-4 z-50 w-full flex justify-center px-4 md:px-12 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center border border-outline-variant/10 h-[70px] bg-surface/90 backdrop-blur-md rounded-full shadow-2xl max-w-7xl w-full px-8 md:px-12 ${showCategories ? 'justify-between' : 'justify-center'}`}
        >
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex items-center ${showCategories ? 'w-1/4 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
          >
            <h1 className="text-2xl font-serif tracking-[0.1em] text-secondary font-bold logo">
              SKR
            </h1>
          </motion.div>

          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-1 flex items-center justify-center"
          >
            {!showCategories ? (
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-serif tracking-[0.1em] text-secondary font-bold logo"
              >
                SKR
              </motion.h1>
            ) : (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center justify-center gap-6 md:gap-10"
              >
                {["GOLD", "SILVER", "COIN", "BAR"].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => {
                      scrollToRow(cat);
                      setActiveCategory(cat);
                    }}
                    className={`relative text-[10px] font-sans uppercase tracking-[0.3em] transition-all duration-300 font-bold whitespace-nowrap focus:outline-none focus:text-primary active:scale-95 ${
                      activeCategory === cat 
                        ? 'text-primary text-[12px] scale-110' 
                        : 'text-secondary/60 hover:text-primary/80'
                    }`}
                  >
                    {cat}
                    {activeCategory === cat && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`transition-all duration-700 ${showCategories ? 'w-1/4' : 'w-0 overflow-hidden'}`}
          >
            {/* Spacer for balance when categories are shown */}
          </motion.div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pb-20">
        <div className="absolute inset-0 z-0">
          {/* Brownish Gradient Background to match image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3d2f26_0%,_#1b1411_100%)]"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Large SKR Logo from Image */}
            <h2 className="text-[12rem] md:text-[24rem] font-serif leading-none tracking-[0.05em] text-secondary mb-4 select-none">
              SKR
            </h2>
            
            {/* Coming Soon Text */}
            <div className="flex items-center justify-center gap-1 md:gap-3 mb-24">
              {"COMING SOON".split("").map((char, i) => (
                <span 
                  key={i} 
                  className={`text-xl md:text-4xl font-serif tracking-[0.1em] text-secondary/90 ${char === " " ? "w-1 md:w-3" : ""}`}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Join List Input */}
            <div className="w-full max-w-xl">
              <div className="relative border-b border-secondary/30 pb-4 group">
                <input 
                  type="text" 
                  placeholder="JOIN THE ATELIER LIST" 
                  className="w-full bg-transparent border-none outline-none text-center text-xs md:text-sm tracking-[0.3em] text-secondary/80 placeholder:text-secondary/40 uppercase font-medium"
                />
                <button className="absolute right-0 top-0 text-secondary/60 hover:text-primary transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
              <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-secondary/40 font-light utility-text">
                Experience the gold standard of digital artistry.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Left Label */}
        <div className="absolute bottom-12 left-12 hidden md:block">
          <span className="text-sm font-serif text-secondary/60 tracking-wider italic">SKR Atelier</span>
        </div>

        {/* Bottom Right Copyright */}
        <div className="absolute bottom-12 right-12 hidden md:block">
          <span className="text-[10px] uppercase tracking-widest text-secondary/30">
            © 2024 SKR Atelier. All rights reserved.
          </span>
        </div>
      </section>

      {/* Shopping Grid Section */}
      <section ref={shoppingSectionRef} className="bg-surface-container-low py-24 md:py-40 px-6 md:px-12 flex flex-col gap-y-40">
        {["GOLD", "SILVER", "COIN", "BAR"].map((category) => (
          <div 
            key={category} 
            ref={rowRefs[category as keyof typeof rowRefs]}
            className="flex flex-col gap-y-12"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6"
            >
              <h3 className="text-2xl md:text-3xl font-serif text-primary tracking-[0.3em] uppercase whitespace-nowrap">
                {category} COLLECTION
              </h3>
              <div className="h-[1px] w-full bg-outline-variant/20"></div>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-20">
              {products
                .filter((p) => p.category === category)
                .map((product, index) => (
                  <TiltCard key={product.id} product={product} index={index} />
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Editorial Section - Asymmetric Layout */}
      <section className="py-24 md:py-40 bg-surface">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-10 aspect-[16/9] overflow-hidden rounded-sm editorial-shadow bg-surface-container-high flex items-center justify-center"
              >
                <div className="text-[10px] uppercase tracking-[0.5em] text-secondary/20">Editorial Visual Pending</div>
              </motion.div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-surface-container-highest/30 -z-10 rounded-full blur-3xl"></div>
            </div>
            <div className="lg:col-span-5 lg:pl-12">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-[11px] uppercase tracking-[0.5em] text-primary mb-6 block font-bold">Our Philosophy</span>
                <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight tracking-[0.1em] uppercase">
                  The Art of <br /> <span className="italic">Slow Creation</span>
                </h3>
                <p className="text-secondary/70 mb-8 leading-relaxed font-light tracking-[0.05em]">
                  In an era of mass production, we choose the path of intentionality. Every curve is considered, every stone hand-selected, ensuring that your piece is as unique as the story it will tell.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-primary text-[10px] uppercase tracking-[0.4em] font-bold group">
                  Our Process
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-20 border-t border-outline-variant/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-serif text-primary italic mb-6">L'Atelier</h2>
              <p className="text-secondary/50 text-sm leading-relaxed max-w-xs">
                Defining modern luxury through curated artisanal jewelry and timeless editorial design.
              </p>
            </div>
            <div>
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-6 text-secondary">Collections</h5>
              <ul className="flex flex-col gap-4 text-sm text-secondary/60">
                <li><a href="#" className="hover:text-primary transition-colors">Spring 2026</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">The Classics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bespoke Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Limited Edition</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-6 text-secondary">Company</h5>
              <ul className="flex flex-col gap-4 text-sm text-secondary/60">
                <li><a href="#" className="hover:text-primary transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-6 text-secondary">Newsletter</h5>
              <p className="text-sm text-secondary/60 mb-6">Join our inner circle for exclusive previews.</p>
              <div className="flex border-b border-outline-variant/30 pb-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-secondary/30"
                />
                <button className="text-primary hover:scale-110 transition-transform">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-outline-variant/10 gap-8">
            <p className="text-[10px] uppercase tracking-widest text-secondary/30 utility-text">
              © 2026 L'Atelier de Luxe. All rights reserved.
            </p>
            <div className="flex gap-8 text-secondary/40">
              <a href="#" className="hover:text-primary transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
