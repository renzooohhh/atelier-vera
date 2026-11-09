import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronRight, 
  Search, 
  User, 
  Heart, 
  Instagram, 
  Twitter, 
  Facebook, 
  Globe, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus,
  Check
} from 'lucide-react';

// Sample Product Data
const PRODUCTS = [
  {
    id: 1,
    name: "Architectural Wool Overcoat",
    category: "Outerwear",
    price: 890,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000",
    isNew: true,
    description: "Tailored from heavy double-faced Italian wool with unstructured shoulders and a minimalist silhouette."
  },
  {
    id: 2,
    name: "Oversized Cashmere Crewneck",
    category: "Knitwear",
    price: 450,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
    isNew: false,
    description: "Pure Mongolian cashmere spun into an ultra-soft, relaxed-fit sweater with ribbed trims."
  },
  {
    id: 3,
    name: "Structured Pleated Trousers",
    category: "Pants",
    price: 380,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000",
    isNew: true,
    description: "High-waisted trousers with twin front pleats, cut from crisp virgin wool gabardine."
  },
  {
    id: 4,
    name: "Raw Edge Heavyweight Tee",
    category: "Tops",
    price: 160,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
    isNew: false,
    description: "Crafted from 300gsm organic Japanese cotton with unfinished hems and a relaxed drape."
  },
  {
    id: 5,
    name: "Monolithic Leather Boot",
    category: "Footwear",
    price: 720,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000",
    isNew: true,
    description: "Calfskin boots featuring a stacked leather sole and concealed side-zip closure."
  },
  {
    id: 6,
    name: "Minimalist Poplin Shirt",
    category: "Tops",
    price: 290,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000",
    isNew: false,
    description: "Egyptian cotton poplin button-down with a hidden placket and tailored cuffs."
  }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Handle Scroll Header Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-white">
      
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] text-white text-xs tracking-widest py-2 text-center uppercase">
        Complimentary Worldwide Shipping on Orders Over $500
      </div>

      {/* Navigation */}
      <nav className={`fixed top-8 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-black/5 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 hover:opacity-70 transition-opacity"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left Nav (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase font-medium">
            <a href="#collections" className="hover:opacity-50 transition-opacity">Collections</a>
            <a href="#about" className="hover:opacity-50 transition-opacity">Atelier</a>
            <a href="#journal" className="hover:opacity-50 transition-opacity">Journal</a>
          </div>

          {/* Logo */}
          <a href="#" className="text-2xl md:text-3xl font-serif tracking-[0.2em] font-light text-center">
            ATELIER VERA
          </a>

          {/* Right Icons */}
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
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col px-8 py-12 justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xl font-serif tracking-widest">ATELIER VERA</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-6 text-2xl font-serif tracking-widest uppercase my-auto">
            <a href="#collections" onClick={() => setMobileMenuOpen(false)}>Collections</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>Atelier</a>
            <a href="#journal" onClick={() => setMobileMenuOpen(false)}>Journal</a>
          </div>
          <div className="text-xs text-gray-400 tracking-widest uppercase">
            © 2026 ATELIER VERA. ALL RIGHTS RESERVED.
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-90">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center filter brightness-[0.9]"
          />
        </div>
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] font-medium opacity-90">Autumn / Winter Edition</p>
          <h1 className="text-4xl md:text-7xl font-serif tracking-wide font-light leading-tight">
            Form Follows Feeling
          </h1>
          <p className="text-sm md:text-base font-light opacity-80 max-w-lg mx-auto tracking-wide">
            Architectural silhouettes crafted with pure organic materials and precise minimalism.
          </p>
          <div className="pt-4">
            <a 
              href="#collections"
              className="inline-flex items-center space-x-3 bg-white text-[#1A1A1A] px-8 py-4 text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy / About Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center space-y-8">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">The Essence</span>
        <h2 className="text-2xl md:text-4xl font-serif font-light leading-relaxed">
          "We believe luxury lies in restraint. Atelier Vera is an exploration of form, texture, and quiet permanence."
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-black/10 text-left">
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-widest font-semibold">Crafted in Italy</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Sourced from historic mills across Biella and Tuscany, prioritizing small-batch precision.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-widest font-semibold">Zero-Waste Vision</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Every piece is cut with zero-waste pattern-making methods to minimize environmental impact.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-widest font-semibold">Timeless Design</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Designed without seasonal trend constraints to remain elevated decades from today.</p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="collections" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Curated Offerings</span>
            <h3 className="text-3xl font-serif font-light mt-1">Selected Garments</h3>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center space-x-6 mt-6 md:mt-0 text-xs uppercase tracking-widest overflow-x-auto pb-2">
            {['All', 'Outerwear', 'Knitwear', 'Tops', 'Pants', 'Footwear'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`transition-opacity whitespace-nowrap ${
                  activeCategory === cat ? 'font-bold border-b border-black pb-1' : 'opacity-50 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                    New Release
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center">
                  <button 
                    onClick={() => setQuickViewProduct(product)}
                    className="bg-white text-[#1A1A1A] px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Quick View
                  </button>
                  <button 
                    onClick={() => addToCart(product)}
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

      {/* Featured Banner */}
      <section className="py-24 bg-[#1A1A1A] text-white my-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Custom Tailoring</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight">
              Bespoke Services for the Discerning Individual
            </h2>
            <p className="text-sm font-light text-gray-300 leading-relaxed">
              Schedule a private appointment at our Milan atelier. Work directly with our master tailors to create custom garments tailored precisely to your measurements.
            </p>
            <button className="border border-white/30 px-8 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Book Private Consultation
            </button>
          </div>
          <div className="aspect-[4/3] bg-gray-800 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000" 
              alt="Atelier Crafting" 
              className="w-full h-full object-cover filter grayscale contrast-125 hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-black/10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <Truck className="w-6 h-6 text-gray-600" />
          <h5 className="text-xs uppercase tracking-widest font-semibold">Worldwide Delivery</h5>
          <p className="text-xs text-gray-400">Express courier shipping with carbon-neutral logistics.</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <RotateCcw className="w-6 h-6 text-gray-600" />
          <h5 className="text-xs uppercase tracking-widest font-semibold">30-Day Returns</h5>
          <p className="text-xs text-gray-400">Complimentary home pick-up returns on all orders.</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <ShieldCheck className="w-6 h-6 text-gray-600" />
          <h5 className="text-xs uppercase tracking-widest font-semibold">Guaranteed Authenticity</h5>
          <p className="text-xs text-gray-400">Every piece includes a unique digital certificate of origin.</p>
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
            <h5 className="font-semibold text-gray-900 mb-4">Client Care</h5>
            <p><a href="#" className="text-gray-500 hover:text-black">Contact Us</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Shipping & Returns</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Size Guide</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Garment Care</a></p>
          </div>
          <div className="space-y-3 text-xs uppercase tracking-widest">
            <h5 className="font-semibold text-gray-900 mb-4">About</h5>
            <p><a href="#" className="text-gray-500 hover:text-black">Our Philosophy</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Sustainability</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Press & Inquiries</a></p>
            <p><a href="#" className="text-gray-500 hover:text-black">Careers</a></p>
          </div>
          <div className="space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-widest">Newsletter</h5>
            <p className="text-xs text-gray-500">Subscribe for private collection previews and editorial updates.</p>
            <div className="flex border-b border-black pb-1">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent text-xs w-full focus:outline-none placeholder-gray-400"
              />
              <button className="text-xs uppercase tracking-widest font-medium ml-2">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 tracking-widest uppercase">
          <p>© 2026 ATELIER VERA. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Instagram className="w-4 h-4 cursor-pointer hover:text-black" />
            <Twitter className="w-4 h-4 cursor-pointer hover:text-black" />
            <Facebook className="w-4 h-4 cursor-pointer hover:text-black" />
          </div>
        </div>
      </footer>

      {/* Shopping Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-black/10">
                  <h3 className="text-lg font-serif tracking-widest uppercase">Your Shopping Bag ({cart.length})</h3>
                  <button onClick={() => setCartOpen(false)}>
                    <X className="w-5 h-5 hover:opacity-50" />
                  </button>
                </div>
                <div className="mt-6 space-y-6 overflow-y-auto max-h-[60vh]">
                  {cart.length === 0 ? (
                    <p className="text-xs text-gray-400 uppercase tracking-widest text-center py-12">Your cart is currently empty.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex space-x-4 border-b border-black/5 pb-4">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                        <div className="flex-1 flex flex-col justify-between text-xs">
                          <div>
                            <h4 className="font-medium tracking-wide">{item.name}</h4>
                            <p className="text-gray-400 mt-1">${item.price}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2 border border-black/20 px-2 py-1">
                              <button onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3" /></button>
                              <span className="px-1 font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {cart.length > 0 && (
                <div className="border-t border-black/10 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span className="font-medium">${cartTotal}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 tracking-wider">Taxes and shipping calculated at checkout.</p>
                  <button className="w-full bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-white max-w-2xl w-full p-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
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
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
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