import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  Search, 
  User, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus,
  Mail,
  Phone,
  MapPin,
  Quote,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

// Sample Product Data with Multi-size options
const PRODUCTS = [
  {
    id: 1,
    name: "Architectural Wool Overcoat",
    category: "Outerwear",
    price: 890,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000",
    isNew: true,
    description: "Tailored from heavy double-faced Italian wool with unstructured shoulders and a minimalist silhouette.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Oversized Cashmere Crewneck",
    category: "Knitwear",
    price: 450,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
    isNew: false,
    description: "Pure Mongolian cashmere spun into an ultra-soft, relaxed-fit sweater with ribbed trims.",
    sizes: ["S", "M", "L"]
  },
  {
    id: 3,
    name: "Structured Pleated Trousers",
    category: "Pants",
    price: 380,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000",
    isNew: true,
    description: "High-waisted trousers with twin front pleats, cut from crisp virgin wool gabardine.",
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: 4,
    name: "Raw Edge Heavyweight Tee",
    category: "Tops",
    price: 160,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
    isNew: false,
    description: "Crafted from 300gsm organic Japanese cotton with unfinished hems and a relaxed drape.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Monolithic Leather Boot",
    category: "Footwear",
    price: 720,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000",
    isNew: true,
    description: "Calfskin boots featuring a stacked leather sole and concealed side-zip closure.",
    sizes: ["40", "41", "42", "43", "44"]
  },
  {
    id: 6,
    name: "Minimalist Poplin Shirt",
    category: "Tops",
    price: 290,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000",
    isNew: false,
    description: "Egyptian cotton poplin button-down with a hidden placket and tailored cuffs.",
    sizes: ["S", "M", "L"]
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The attention to detail and fabric weight on the wool overcoat is unmatched. A true testament to quiet luxury.",
    author: "Julian Vance",
    role: "Architect, Milan"
  },
  {
    id: 2,
    quote: "Atelier Vera captures the essence of modern tailoring. Every piece feels sculptural yet effortless to wear.",
    author: "Elena Rostova",
    role: "Creative Director, Paris"
  },
  {
    id: 3,
    quote: "Exceptional customer experience and garments that transcend seasonal trends. My go-to house for essentials.",
    author: "Marcus Thorne",
    role: "Collector, London"
  }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Cart state with localStorage
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('atelier_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  
  // Notification Toast State
  const [toastMessage, setToastMessage] = useState('');

  // Form States
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const addToCart = (product, size = 'M') => {
    const itemKey = `${product.id}-${size}`;
    setCart(prevCart => {
      const existing = prevCart.find(item => item.itemKey === itemKey);
      if (existing) {
        return prevCart.map(item =>
          item.itemKey === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, itemKey, size, quantity: 1 }];
    });
    showToast(`Added ${product.name} (${size}) to Shopping Bag`);
    setCartOpen(true);
  };

  const updateQuantity = (itemKey, delta) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.itemKey === itemKey) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemKey) => {
    setCart(prevCart => prevCart.filter(item => item.itemKey !== itemKey));
    showToast("Item removed from bag");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    e.target.reset();
    setTimeout(() => setContactSubmitted(false), 6000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 6000);
    }
  };

  const handleCheckout = () => {
    setCheckoutCompleted(true);
    setCart([]);
    setTimeout(() => {
      setCheckoutCompleted(false);
      setCartOpen(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-white scroll-smooth relative overflow-x-hidden">
      
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1A1A1A] text-white px-6 py-3 text-xs tracking-widest uppercase shadow-2xl flex items-center space-x-3 transition-all duration-500 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="bg-[#1A1A1A] text-white text-[11px] tracking-[0.2em] py-2 text-center uppercase font-light">
        ✦ Complimentary Worldwide Shipping on Orders Over $500 ✦
      </div>

      {/* Navigation Bar with Glassmorphism */}
      <nav className={`fixed top-8 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-black/5 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 hover:opacity-70 transition-opacity"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium">
            <a href="#home" className="hover:opacity-50 transition-opacity hover:translate-y-[-1px]">Home</a>
            <a href="#about" className="hover:opacity-50 transition-opacity hover:translate-y-[-1px]">About Us</a>
            <a href="#products" className="hover:opacity-50 transition-opacity hover:translate-y-[-1px]">Products</a>
            <a href="#testimonials" className="hover:opacity-50 transition-opacity hover:translate-y-[-1px]">Testimonials</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity hover:translate-y-[-1px]">Contact Us</a>
          </div>

          <a href="#home" className="text-2xl md:text-3xl font-serif tracking-[0.25em] font-light text-center hover:scale-105 transition-transform duration-300">
            ATELIER VERA
          </a>

          <div className="flex items-center space-x-6">
            <button className="hidden sm:block hover:opacity-50 transition-opacity">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:block hover:opacity-50 transition-opacity">
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="relative hover:opacity-50 transition-opacity flex items-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.reduce((a, c) => a + c.quantity, 0) > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-xl flex flex-col px-8 py-12 justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xl font-serif tracking-widest">ATELIER VERA</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-6 text-2xl font-serif tracking-widest uppercase my-auto">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)}>Products</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
          </div>
          <div className="text-xs text-gray-400 tracking-widest uppercase">
            © 2026 ATELIER VERA. ALL RIGHTS RESERVED.
          </div>
        </div>
      )}

      {/* 1. HOME SECTION with Parallax Effect */}
      <section id="home" className="relative h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-90 scale-105 transition-transform duration-1000">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center filter brightness-[0.8] animate-pulse duration-1000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10" />
        <div className="relative z-20 text-center text-white max-w-3xl mx-auto space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] font-medium opacity-90 animate-fade-in">Autumn / Winter Edition</p>
          <h1 className="text-4xl md:text-7xl font-serif tracking-wide font-light leading-tight">
            Form Follows Feeling
          </h1>
          <p className="text-sm md:text-base font-light opacity-85 max-w-lg mx-auto tracking-wide">
            Architectural silhouettes crafted with pure organic materials and precise minimalism. Welcome to refined independence.
          </p>
          <div className="pt-4">
            <a 
              href="#products"
              className="inline-flex items-center space-x-3 bg-white text-[#1A1A1A] px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl hover:scale-105"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="py-28 px-6 md:px-12 max-w-5xl mx-auto text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Our Heritage & Mission</span>
          <h2 className="text-2xl md:text-4xl font-serif font-light leading-relaxed">
            "We believe luxury lies in restraint. Atelier Vera is an exploration of form, texture, and quiet permanence."
          </h2>
        </div>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          Founded in Milan, Atelier Vera bridges traditional Italian tailoring with uncompromising modern architecture. Our mission is to curate timeless garments using zero-waste pattern-making and sustainable organic textiles that endure across generations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-black/10 text-left">
          <div className="space-y-2 p-6 bg-white/60 backdrop-blur-sm border border-black/5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <h4 className="text-xs uppercase tracking-widest font-semibold">Crafted in Italy</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Sourced from historic mills across Biella and Tuscany, prioritizing small-batch precision.</p>
          </div>
          <div className="space-y-2 p-6 bg-white/60 backdrop-blur-sm border border-black/5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <h4 className="text-xs uppercase tracking-widest font-semibold">Zero-Waste Vision</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Every piece is cut with zero-waste pattern-making methods to minimize environmental impact.</p>
          </div>
          <div className="space-y-2 p-6 bg-white/60 backdrop-blur-sm border border-black/5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <h4 className="text-xs uppercase tracking-widest font-semibold">Timeless Design</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Designed without seasonal trend constraints to remain elevated decades from today.</p>
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS SECTION */}
      <section id="products" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400">What We Offer</span>
            <h3 className="text-3xl font-serif font-light mt-1">Selected Garments & Services</h3>
          </div>
          
          <div className="flex items-center space-x-6 mt-6 md:mt-0 text-xs uppercase tracking-widest overflow-x-auto pb-2">
            {['All', 'Outerwear', 'Knitwear', 'Tops', 'Pants', 'Footwear'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`transition-all whitespace-nowrap pb-1 ${
                  activeCategory === cat ? 'font-bold border-b-2 border-black scale-105' : 'opacity-50 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 shadow-md">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-medium shadow-sm">
                    New Release
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center">
                  <button 
                    onClick={() => setQuickViewProduct(product)}
                    className="bg-white text-[#1A1A1A] px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Quick View
                  </button>
                  <button 
                    onClick={() => addToCart(product, product.sizes[0])}
                    className="bg-black text-white px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start text-sm">
                <div>
                  <h4 className="font-medium tracking-wide group-hover:opacity-60 transition-opacity">{product.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                </div>
                <span className="font-light">${product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 bg-[#F4EFE6] px-6 md:px-12 my-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Client Voices</span>
            <h3 className="text-3xl md:text-4xl font-serif font-light">Testimonials & Reviews</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white/80 backdrop-blur-md p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="space-y-4">
                  <Quote className="w-8 h-8 text-amber-700/30" />
                  <p className="text-sm font-light leading-relaxed text-gray-700 italic">"{t.quote}"</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h5 className="text-xs uppercase tracking-widest font-semibold">{t.author}</h5>
                  <p className="text-[11px] text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-black/10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center space-y-2 group">
          <Truck className="w-6 h-6 text-gray-600 group-hover:scale-125 transition-transform duration-300" />
          <h5 className="text-xs uppercase tracking-widest font-semibold">Worldwide Delivery</h5>
          <p className="text-xs text-gray-400">Express courier shipping with carbon-neutral logistics.</p>
        </div>
        <div className="flex flex-col items-center space-y-2 group">
          <RotateCcw className="w-6 h-6 text-gray-600 group-hover:rotate-[-45deg] transition-transform duration-300" />
          <h5 className="text-xs uppercase tracking-widest font-semibold">30-Day Returns</h5>
          <p className="text-xs text-gray-400">Complimentary home pick-up returns on all orders.</p>
        </div>
        <div className="flex flex-col items-center space-y-2 group">
          <ShieldCheck className="w-6 h-6 text-gray-600 group-hover:scale-125 transition-transform duration-300" />
          <h5 className="text-xs uppercase tracking-widest font-semibold">Guaranteed Authenticity</h5>
          <p className="text-xs text-gray-400">Every piece includes a unique digital certificate of origin.</p>
        </div>
      </section>

      {/* 5. CONTACT US SECTION */}
      <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Get in Touch</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight">
              Connect With Our Client Advisors
            </h2>
            <p className="text-sm font-light text-gray-600 leading-relaxed">
              Whether you require bespoke tailoring appointments, sizing inquiries, or styling assistance, our team is at your disposal.
            </p>
            
            <div className="space-y-4 pt-4 text-sm">
              <div className="flex items-center space-x-4">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>Via Monte Napoleone 8, 20121 Milan, Italy</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>+39 02 8901 2345</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>advisor@ateliervera.com</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 shadow-xl border border-black/5 relative overflow-hidden">
            {contactSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto animate-bounce" />
                <h4 className="text-xl font-serif">Thank You for Reaching Out</h4>
                <p className="text-xs text-gray-500">Your message has been securely sent to our Milan atelier. An advisor will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <h3 className="text-xl font-serif mb-6 tracking-wide">Send a Message</h3>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Full Name</label>
                  <input required type="text" className="w-full border-b border-black/20 py-2 text-xs focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="Julian Vance" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Email Address</label>
                  <input required type="email" className="w-full border-b border-black/20 py-2 text-xs focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="julian@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Message / Inquiry</label>
                  <textarea required rows={4} className="w-full border-b border-black/20 py-2 text-xs focus:outline-none focus:border-black transition-colors bg-transparent resize-none" placeholder="Inquire about bespoke sizing or appointments..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-all hover:shadow-lg">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] pt-16 pb-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <h4 className="text-xl font-serif tracking-widest">ATELIER VERA</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Minimalist luxury menswear and unisex apparel crafted with enduring quality.
            </p>
          </div>
          <div className="space-y-3 text-xs uppercase tracking-widest">
            <h5 className="font-semibold text-gray-900 mb-4">Navigation</h5>
            <p><a href="#home" className="text-gray-500 hover:text-black">Home</a></p>
            <p><a href="#about" className="text-gray-500 hover:text-black">About Us</a></p>
            <p><a href="#products" className="text-gray-500 hover:text-black">Products</a></p>
            <p><a href="#testimonials" className="text-gray-500 hover:text-black">Testimonials</a></p>
          </div>
          <div className="space-y-3 text-xs uppercase tracking-widest">
            <h5 className="font-semibold text-gray-900 mb-4">Client Care</h5>
            <p><a href="#contact" className="text-gray-500 hover:text-black">Contact Us</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Shipping & Returns</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Size Guide</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Garment Care</a></p>
          </div>
          <div className="space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-widest">Newsletter</h5>
            <p className="text-xs text-gray-500">Subscribe for private collection previews and editorial updates.</p>
            {newsletterSubscribed ? (
              <p className="text-xs text-green-600 font-medium">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex border-b border-black pb-1">
                <input 
                  required
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-transparent text-xs w-full focus:outline-none placeholder-gray-400"
                />
                <button type="submit" className="text-xs uppercase tracking-widest font-medium ml-2 hover:opacity-60 transition-opacity">Join</button>
              </form>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 tracking-widest uppercase">
          <p>© 2026 ATELIER VERA. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-xs tracking-widest">
            <a href="#" className="hover:text-black">Instagram</a>
            <a href="#" className="hover:text-black">Twitter</a>
            <a href="#" className="hover:text-black">LinkedIn</a>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-500">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-black/10">
                  <h3 className="text-lg font-serif tracking-widest uppercase">Your Shopping Bag ({cart.reduce((a, c) => a + c.quantity, 0)})</h3>
                  <button onClick={() => setCartOpen(false)}>
                    <X className="w-5 h-5 hover:opacity-50" />
                  </button>
                </div>
                <div className="mt-6 space-y-6 overflow-y-auto max-h-[60vh]">
                  {checkoutCompleted ? (
                    <div className="py-16 text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto animate-bounce" />
                      <h4 className="text-lg font-serif">Order Successfully Placed!</h4>
                      <p className="text-xs text-gray-500">Thank you for shopping with Atelier Vera. Your order confirmation has been emailed.</p>
                    </div>
                  ) : cart.length === 0 ? (
                    <p className="text-xs text-gray-400 uppercase tracking-widest text-center py-12">Your cart is currently empty.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.itemKey} className="flex space-x-4 border-b border-black/5 pb-4">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                        <div className="flex-1 flex flex-col justify-between text-xs">
                          <div>
                            <h4 className="font-medium tracking-wide">{item.name}</h4>
                            <p className="text-gray-400 mt-0.5">Size: {item.size}</p>
                            <p className="text-gray-400 mt-0.5">${item.price}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2 border border-black/20 px-2 py-1">
                              <button onClick={() => updateQuantity(item.itemKey, -1)}><Minus className="w-3 h-3" /></button>
                              <span className="px-1 font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.itemKey, 1)}><Plus className="w-3 h-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.itemKey)} className="text-red-500 hover:underline">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {!checkoutCompleted && cart.length > 0 && (
                <div className="border-t border-black/10 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span className="font-medium">${cartTotal}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 tracking-wider">Taxes and shipping calculated at checkout.</p>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal with Size Selection */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-white max-w-2xl w-full p-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[3/4] bg-gray-100">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{quickViewProduct.category}</span>
                <h3 className="text-xl font-serif font-light mt-1">{quickViewProduct.name}</h3>
                <p className="text-lg font-light mt-2">${quickViewProduct.price}</p>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">{quickViewProduct.description}</p>
                
                {/* Size Selection */}
                <div className="mt-6">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Select Size</label>
                  <div className="flex space-x-2">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 text-xs border transition-all ${
                          (selectedSize || quickViewProduct.sizes[0]) === sz 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 hover:border-black text-gray-800'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => {
                    const chosenSize = selectedSize || quickViewProduct.sizes[0];
                    addToCart(quickViewProduct, chosenSize);
                    setQuickViewProduct(null);
                    setSelectedSize('');
                  }}
                  className="w-full bg-[#1A1A1A] text-white py-3 text-xs uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}