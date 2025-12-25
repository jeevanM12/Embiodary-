
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { UserRole, OrderCategory, OrderStatus, PaymentStatus } from './types';
import { Button, Card, Input, Modal, Badge } from './components/UI';
import { generateEmbroideryDesign, askBusinessAdvisor } from './services/geminiService';
import { 
  Menu, User as UserIcon, ShoppingBag, MessageCircle, LogOut, Plus, 
  Upload, QrCode, CheckCircle, Truck, DollarSign, Image as ImageIcon,
  Sparkles, Download, BarChart2, Briefcase, Camera, Mic, Search, Send, MapPin, Calendar, ArrowRight, Trash2, Edit, FileText, Users, Printer, Settings, Copy, Grid, History, CheckSquare, Banknote, Megaphone
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- Notifications Component ---
const Notifications = () => {
  const { notifications } = useStore();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none no-print">
      {notifications.map(n => (
        <div key={n.id} className="animate-in slide-in-from-right fade-in bg-white border-l-4 border-brand-burgundy shadow-glass p-4 rounded-r-xl flex items-center gap-3 w-80 pointer-events-auto">
          <div className={`w-2 h-2 rounded-full ${n.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
          <p className="text-sm font-medium text-luxe-900">{n.message}</p>
        </div>
      ))}
    </div>
  );
};

// --- Navbar ---
const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-luxe-200 shadow-sm no-print">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-brand-burgundy rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">S</div>
          <span className="font-serif text-2xl font-bold text-luxe-900 tracking-tight">Sri Sujana <span className="text-brand-burgundy">Embroidery</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-luxe-700 tracking-wide">
          <Link to="/" className="hover:text-brand-burgundy transition-colors">Home</Link>
          <Link to="/designs" className="hover:text-brand-burgundy transition-colors">Collection</Link>
          <Link to="/portfolio" className="hover:text-brand-burgundy transition-colors">Portfolio</Link>
          <Link to="/custom-order" className="hover:text-brand-burgundy transition-colors">Bespoke</Link>
          
          {user ? (
            <div className="flex items-center gap-4 ml-4">
              {user.role === UserRole.ADMIN && <Link to="/admin" className="text-brand-burgundy font-bold bg-brand-burgundy/10 px-4 py-1.5 rounded-full border border-brand-burgundy/20">Admin Dashboard</Link>}
              {user.role === UserRole.EMPLOYEE && <Link to="/employee" className="text-brand-burgundy font-bold bg-brand-burgundy/10 px-4 py-1.5 rounded-full border border-brand-burgundy/20">Staff Portal</Link>}
              {user.role === UserRole.CUSTOMER && <Link to="/my-orders" className="text-brand-burgundy font-bold bg-brand-burgundy/10 px-4 py-1.5 rounded-full border border-brand-burgundy/20">My Orders</Link>}
              <Button variant="ghost" onClick={() => { logout(); navigate('/'); }} className="!px-3 !py-1 text-xs uppercase font-bold">
                Log Out
              </Button>
            </div>
          ) : (
             <Link to="/login"><Button variant="primary" className="!px-5 !py-2 text-xs uppercase font-bold">Login</Button></Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="w-6 h-6 text-luxe-900" />
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-luxe-200 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
           <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
           <Link to="/designs" onClick={() => setIsMenuOpen(false)}>Collection</Link>
           <Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
           <Link to="/custom-order" onClick={() => setIsMenuOpen(false)}>Bespoke</Link>
           {!user && <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>}
           {user && <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-500">Logout</button>}
        </div>
      )}
    </nav>
  );
};

// --- Offers Slider Component ---
const OffersSlider = () => {
    const { offers } = useStore();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (offers.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % offers.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [offers]);

    if (offers.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-brand-burgundy to-luxe-900 text-white overflow-hidden relative shadow-md border-t border-brand-gold/20">
            <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {offers.map((offer) => (
                    <div key={offer.id} className="w-full flex-shrink-0 py-3 px-4 text-center">
                        <p className="text-sm md:text-base font-medium tracking-wider flex items-center justify-center gap-2">
                           <Sparkles className="w-4 h-4 text-brand-gold animate-pulse"/> 
                           {offer.text} 
                           <Sparkles className="w-4 h-4 text-brand-gold animate-pulse"/>
                        </p>
                    </div>
                ))}
            </div>
             {/* Simple Dots for Navigation Visibility */}
             <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                {offers.map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`} />
                ))}
            </div>
        </div>
    );
}

// --- Page: Home ---
const Home = () => {
  const navigate = useNavigate();
  const { designs } = useStore();
  
  return (
    <div className="min-h-screen">
      <OffersSlider />
      {/* Hero */}
      <section className="relative h-[650px] flex items-center justify-center bg-luxe-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")` }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-burgundy/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="container px-4 text-center z-10 relative">
          <Badge color="bg-brand-gold/20 text-luxe-900 mb-6 inline-block border border-brand-gold/30">Royal Collection 2024</Badge>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-luxe-900 mb-6 leading-tight">
            The Art of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-burgundy to-brand-rose">Premium Embroidery</span>
          </h1>
          <p className="text-xl text-luxe-700 mb-10 max-w-2xl mx-auto font-light">
            Where tradition meets modern elegance. Handcrafted designs tailored for your most precious moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button onClick={() => navigate('/designs')} className="text-lg px-8 py-3.5 shadow-xl shadow-brand-burgundy/20">View Collection</Button>
            <Button variant="secondary" onClick={() => navigate('/custom-order')} className="text-lg px-8 py-3.5">Start Bespoke Order</Button>
          </div>
          <div className="mt-8">
             <Button variant="outline" onClick={() => navigate('/name-embroidery')} className="mx-auto !rounded-full bg-white/50 backdrop-blur">
                Looking for Custom Name Embroidery? Click Here &rarr;
             </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-serif font-bold text-luxe-900 mb-4">Curated Categories</h2>
             <div className="w-24 h-1 bg-brand-burgundy mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.values(OrderCategory).map((cat) => (
              <div key={cat} onClick={() => navigate(`/designs?cat=${cat}`)} className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg hover:shadow-2xl transition-all duration-500">
                 <img src={`https://source.unsplash.com/random/600x800/?embroidery,${cat.split(' ')[0]},fabric`} alt={cat} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-luxe-900/90 via-luxe-900/20 to-transparent flex items-end p-8">
                    <div>
                        <h3 className="text-white font-serif text-2xl font-bold mb-1">{cat}</h3>
                        <p className="text-brand-gold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Explore Collection &rarr;</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Page: Portfolio (New Section) ---
const PortfolioPage = () => {
    const navigate = useNavigate();
    const { designs } = useStore();
    // Filter for "Custom Orders" category or use a subset of designs as portfolio
    const portfolioItems = designs.filter(d => d.category === OrderCategory.CUSTOM);

    return (
        <div className="container mx-auto px-4 py-12 bg-luxe-50 min-h-screen">
            <h1 className="text-5xl font-serif font-bold mb-4 text-center text-luxe-900">Our Portfolio</h1>
            <p className="text-center text-luxe-600 mb-12 max-w-2xl mx-auto">A showcase of our bespoke creations for past clients.</p>
            
            {portfolioItems.length === 0 ? (
                <div className="text-center text-luxe-400 py-20">
                    <Grid className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                    <p>No portfolio items uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {portfolioItems.map(item => (
                         <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-glass bg-white">
                             <img src={item.images[0]} alt={item.title} className="w-full h-80 object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                                 <h3 className="font-serif text-2xl font-bold mb-2">{item.title}</h3>
                                 <p className="mb-6 text-sm opacity-80">{item.description}</p>
                                 <Button variant="secondary" onClick={() => navigate(`/custom-order?design=${item.id}`)}>I want something like this</Button>
                             </div>
                         </div>
                    ))}
                </div>
            )}
            
            <div className="mt-20 text-center">
                <h3 className="font-serif text-3xl font-bold mb-4">Have your own idea?</h3>
                <Button onClick={() => navigate('/custom-order')}>Start Custom Order</Button>
            </div>
        </div>
    );
};

// --- Page: Designs ---
const DesignsPage = () => {
    const { designs } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('cat');
        if (cat) setFilter(cat);
    }, [location]);

    const filtered = designs.filter(d => {
        const matchesCategory = filter === 'All' || d.category === filter;
        const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-12 bg-luxe-50 min-h-screen">
            <h1 className="text-5xl font-serif font-bold mb-4 text-center text-luxe-900">Exquisite Collection</h1>
            <p className="text-center text-luxe-600 mb-12 max-w-2xl mx-auto">Browse our handcrafted masterpieces.</p>
            
            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 max-w-6xl mx-auto bg-white p-4 rounded-xl shadow-glass">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-luxe-400" />
                    <input 
                        type="text" 
                        placeholder="Search designs..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-luxe-200 focus:outline-none focus:ring-1 focus:ring-brand-burgundy"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant={filter === 'All' ? 'primary' : 'ghost'} onClick={() => setFilter('All')} className="!px-4 !py-1.5 text-sm">All</Button>
                    {Object.values(OrderCategory).map(cat => (
                        <Button key={cat} variant={filter === cat ? 'primary' : 'ghost'} onClick={() => setFilter(cat)} className="!px-4 !py-1.5 text-sm">
                            {cat.split(' ')[0]}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {filtered.map(design => (
                    <Card key={design.id} className="group hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden border-0">
                        <div className="aspect-[3/4] overflow-hidden bg-luxe-100 relative group">
                            {/* Show first image, flip to second on hover if available */}
                            <img src={design.images[0]} alt={design.title} className={`w-full h-full object-cover transition-opacity duration-700 ${design.images[1] ? 'group-hover:opacity-0' : ''}`} />
                            {design.images[1] && (
                                <img src={design.images[1]} alt={design.title} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <Button onClick={() => navigate(`/custom-order?design=${design.id}`)} className="scale-90 group-hover:scale-100 transition-transform">Order Now</Button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-luxe-900">{design.title}</h3>
                                    <p className="text-xs uppercase tracking-wide text-luxe-500">{design.category}</p>
                                </div>
                                <span className="font-serif font-bold text-xl text-brand-burgundy">₹{design.price}</span>
                            </div>
                            <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/custom-order?design=${design.id}`)}>
                                Customize & Order
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- Page: Custom Order ---
const OrderFormPage = ({ isNameEmbroidery = false }: { isNameEmbroidery?: boolean }) => {
    const { user, placeOrder } = useStore();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [generating, setGenerating] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        customerPhone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        dueDate: '',
        description: '',
        textToEmbroider: '',
        fontStyle: '',
        threadColor: '',
        size: '',
        designPrompt: '', 
        generatedImage: '',
        isCOD: false
    });

    const handleGenerateDesign = async () => {
        if (!formData.designPrompt) return;
        setGenerating(true);
        try {
            const img = await generateEmbroideryDesign({
                prompt: `High quality embroidery pattern, elegant, detailed: ${formData.designPrompt}`,
                aspectRatio: "1:1",
                resolution: "1K"
            });
            if (img) setFormData(prev => ({ ...prev, generatedImage: img }));
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        placeOrder({
            ...formData,
            category: isNameEmbroidery ? OrderCategory.NAME_EMBROIDERY : OrderCategory.CUSTOM,
            address: { line1: formData.address, city: formData.city, state: formData.state, pinCode: formData.pinCode },
            generatedDesignUrl: formData.generatedImage,
            paymentStatus: formData.isCOD ? PaymentStatus.COD_PENDING : PaymentStatus.PENDING,
            isCOD: formData.isCOD
        });
        navigate('/my-orders');
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold mb-2 text-center text-luxe-900">
                {isNameEmbroidery ? 'Monogram & Name Embroidery' : 'Bespoke Order Commission'}
            </h1>
            <p className="text-center text-luxe-500 mb-12">Tell us your vision, and we will thread it into reality.</p>

            <Card className="p-8 md:p-12">
                {step === 1 && (
                    <div className="animate-in fade-in space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-brand-burgundy text-white flex items-center justify-center font-bold">1</div>
                            <h3 className="font-serif text-2xl font-bold">Personal Details</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input label="Full Name" name="customerName" value={formData.customerName} onChange={handleInputChange} />
                            <Input label="Phone Number" name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} />
                        </div>
                        <h4 className="font-bold text-lg text-luxe-700 mt-4 border-b border-luxe-100 pb-2">Delivery Address</h4>
                        <Input label="Address Line 1" name="address" value={formData.address} onChange={handleInputChange} />
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
                            <Input label="State" name="state" value={formData.state} onChange={handleInputChange} />
                            <Input label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleInputChange} maxLength={6} />
                        </div>
                        <div className="flex justify-end mt-8">
                             <Button onClick={() => setStep(2)} disabled={!formData.customerName || !formData.customerPhone}>Proceed to Design &rarr;</Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in space-y-6">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-brand-burgundy text-white flex items-center justify-center font-bold">2</div>
                            <h3 className="font-serif text-2xl font-bold">Design Specifications</h3>
                        </div>
                        
                        <div className="mb-4 bg-luxe-50 p-4 rounded-lg border border-luxe-100">
                             <label className="block text-sm font-bold text-brand-burgundy mb-2 flex items-center gap-2 uppercase tracking-wide">
                                <Calendar className="w-4 h-4"/> Required By Date (Important)
                             </label>
                             <div className="relative">
                                <input 
                                    type="date" 
                                    name="dueDate" 
                                    value={formData.dueDate} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-3 rounded-lg border-2 border-luxe-300 bg-white focus:ring-2 focus:ring-brand-burgundy outline-none cursor-pointer font-bold text-luxe-900"
                                />
                             </div>
                        </div>
                        
                        {isNameEmbroidery ? (
                            <div className="space-y-4">
                                <Input label="Text to Embroider" name="textToEmbroider" value={formData.textToEmbroider} onChange={handleInputChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Font Style" name="fontStyle" placeholder="e.g. Cursive, Serif" value={formData.fontStyle} onChange={handleInputChange} />
                                    <Input label="Thread Color" name="threadColor" value={formData.threadColor} onChange={handleInputChange} />
                                </div>
                                <Input label="Approximate Size (e.g. 2 inches)" name="size" value={formData.size} onChange={handleInputChange} />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-luxe-800 mb-1.5">Description & Requirements</label>
                                    <textarea 
                                        name="description" 
                                        className="w-full p-4 border border-luxe-200 rounded-lg focus:ring-1 focus:ring-brand-burgundy outline-none bg-luxe-50/50" 
                                        rows={4} 
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe the fabric, colors, motifs, or design ID..."
                                    />
                                </div>
                                
                                <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 rounded-xl border border-indigo-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-900">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                        <span className="font-bold">AI Design Assistant</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input 
                                            placeholder="E.g., Gold peacock on red velvet" 
                                            className="!mb-0 flex-1 bg-white"
                                            name="designPrompt"
                                            value={formData.designPrompt}
                                            onChange={handleInputChange}
                                        />
                                        <Button 
                                            onClick={handleGenerateDesign} 
                                            isLoading={generating}
                                            className="bg-indigo-600 hover:bg-indigo-700 !shadow-none text-white"
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                    {formData.generatedImage && (
                                        <div className="mt-4 rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                                            <img src={formData.generatedImage} alt="AI Generated" className="w-full h-64 object-contain bg-white" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="mt-6 p-4 border rounded-lg bg-gray-50 flex items-center gap-3 cursor-pointer" onClick={() => setFormData(prev => ({...prev, isCOD: !prev.isCOD}))}>
                             <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isCOD ? 'bg-brand-burgundy border-brand-burgundy text-white' : 'border-gray-400 bg-white'}`}>
                                 {formData.isCOD && <CheckCircle className="w-3.5 h-3.5"/>}
                             </div>
                             <div>
                                 <p className="font-bold text-sm">Cash on Delivery (COD)</p>
                                 <p className="text-xs text-gray-500">Pay when you receive your order.</p>
                             </div>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t border-luxe-100">
                             <Button variant="ghost" onClick={() => setStep(1)}>&larr; Back</Button>
                             <Button onClick={handleSubmit} variant="secondary">Confirm Order</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

// --- Page: Order Details ---
const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const { orders, designs, user, sendMessage, uploadQR, uploadPaymentProof, verifyPayment, assignEmployee, updateOrderStatus, employees } = useStore();
    const navigate = useNavigate();
    const [msgText, setMsgText] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const order = orders.find(o => o.id === orderId);
    
    // Find associated design to get all images/angles
    const design = order?.designId ? designs.find(d => d.id === order.designId) : null;
    const allImages = design ? design.images : (order?.referenceImages || []);
    if(order?.generatedDesignUrl && !allImages.includes(order.generatedDesignUrl)) allImages.push(order.generatedDesignUrl);

    if (!order || !user) return null;

    const isInternalUser = user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE;
    const isAdmin = user.role === UserRole.ADMIN;

    return (
        <div className="container mx-auto px-4 py-8 bg-luxe-50 min-h-screen">
             <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6"><ArrowRight className="rotate-180 mr-2 w-4 h-4"/> Back</Button>
             
             <div className="grid lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-6">
                     
                     {/* Admin Controls Section */}
                     {isAdmin && (
                        <Card className="bg-luxe-100/50 border-brand-burgundy/20">
                            <div className="flex items-center gap-2 mb-4 text-brand-burgundy">
                                <Settings className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Admin Controls</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-luxe-600 mb-2">Order Status</label>
                                    <select 
                                        className="w-full p-3 rounded-lg border border-luxe-300 bg-white focus:ring-1 focus:ring-brand-burgundy outline-none transition-shadow"
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    >
                                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-luxe-600 mb-2">Assign Artisan</label>
                                    <select 
                                        className="w-full p-3 rounded-lg border border-luxe-300 bg-white focus:ring-1 focus:ring-brand-burgundy outline-none transition-shadow"
                                        value={order.assignedEmployeeId || ''}
                                        onChange={(e) => assignEmployee(order.id, e.target.value)}
                                    >
                                        <option value="">Unassigned</option>
                                        {employees.map(e => (
                                            <option key={e.id} value={e.id}>{e.name} (ID: {e.employeeId})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-luxe-200">
                                    <p className="text-xs font-bold uppercase text-luxe-600 mb-2">Manual Payment Action</p>
                                    <Button 
                                        variant="secondary" 
                                        className="w-full text-sm"
                                        onClick={() => verifyPayment(order.id, PaymentStatus.VERIFIED)}
                                    >
                                        <Banknote className="w-4 h-4 mr-2"/> Mark as Paid Offline / Cash Received
                                    </Button>
                                </div>
                            </div>
                        </Card>
                     )}

                     <Card>
                        <div className="flex justify-between items-start border-b border-luxe-100 pb-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-luxe-900">Order #{order.id.slice(-6)}</h1>
                                <p className="text-luxe-500">{order.category}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <Badge color={order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-brand-gold/20 text-luxe-900'}>{order.status}</Badge>
                                {order.assignedEmployeeId && (
                                    <Badge color="bg-blue-50 text-blue-700">Staff: {employees.find(e => e.id === order.assignedEmployeeId)?.name || 'Unknown'}</Badge>
                                )}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                             <div><span className="block font-bold text-luxe-900">Customer</span> {order.customerName}</div>
                             <div><span className="block font-bold text-luxe-900">Phone</span> {order.customerPhone}</div>
                             <div><span className="block font-bold text-luxe-900">Due Date</span> {order.dueDate}</div>
                             <div><span className="block font-bold text-luxe-900">Address</span> {order.address.line1}, {order.address.city}</div>
                             <div className="col-span-2 bg-luxe-50 p-4 rounded-lg border border-luxe-100">
                                <span className="block font-bold text-luxe-900 mb-1">Requirements</span> 
                                {order.description}
                             </div>
                        </div>
                        
                        {/* FULL IMAGE GALLERY FOR EMPLOYEES/ADMIN */}
                        {allImages.length > 0 && (
                            <div className="mt-6 border-t pt-4">
                                <h4 className="font-bold text-luxe-900 mb-3 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Design Gallery & Angles</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {allImages.map((img, idx) => (
                                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-luxe-200">
                                            <img src={img} className="w-full h-32 object-cover" onClick={() => window.open(img, '_blank')} />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => window.open(img, '_blank')}>
                                                <span className="text-white text-xs">View Full</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                     </Card>
                     
                     {/* Payment & Proofs */}
                     <Card>
                         <h3 className="font-bold text-xl mb-4 text-luxe-900">Payment Status: {order.paymentStatus}</h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            {/* QR Section */}
                            <div className="bg-luxe-100/50 p-4 rounded-xl text-center">
                                <p className="font-bold mb-2">Pay via QR</p>
                                {order.qrCodeUrl ? (
                                    <img src={order.qrCodeUrl} className="mx-auto w-40 h-40 object-contain mix-blend-multiply" />
                                ) : <div className="h-40 flex items-center justify-center text-luxe-400 italic">No QR Code</div>}
                                {isInternalUser && (
                                    <label className="block mt-2 cursor-pointer text-brand-burgundy text-sm font-bold hover:underline">
                                        Upload/Change QR <input type="file" hidden onChange={(e) => {
                                            if (e.target.files?.[0]) uploadQR(order.id, URL.createObjectURL(e.target.files[0]));
                                        }} />
                                    </label>
                                )}
                            </div>
                            {/* Proof Section */}
                            <div className="bg-luxe-100/50 p-4 rounded-xl text-center">
                                <p className="font-bold mb-2">Payment Proof</p>
                                {order.paymentProofUrl ? (
                                    <img src={order.paymentProofUrl} className="mx-auto w-40 h-40 object-cover rounded border" />
                                ) : <div className="h-40 flex items-center justify-center text-luxe-400 italic">No Proof Uploaded</div>}
                                {!isInternalUser && (
                                     <label className="block mt-2 cursor-pointer">
                                        <Button as="span" variant="secondary" className="w-full text-xs">Upload Receipt</Button>
                                        <input type="file" hidden onChange={(e) => {
                                            if (e.target.files?.[0]) uploadPaymentProof(order.id, URL.createObjectURL(e.target.files[0]));
                                        }} />
                                    </label>
                                )}
                                {isInternalUser && order.paymentProofUrl && order.paymentStatus !== PaymentStatus.VERIFIED && (
                                    <Button onClick={() => verifyPayment(order.id, PaymentStatus.VERIFIED)} className="w-full mt-2 text-xs">Verify Payment</Button>
                                )}
                            </div>
                         </div>
                     </Card>
                 </div>

                 {/* Chat */}
                 <Card className="h-[600px] flex flex-col p-0">
                     <div className="p-4 bg-luxe-100 border-b border-luxe-200 font-bold text-luxe-900 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-brand-burgundy" />
                        Communication
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                         {order.messages.length === 0 && <p className="text-center text-luxe-400 text-sm mt-10">No messages yet. Start chatting!</p>}
                         {order.messages.map(m => (
                             <div key={m.id} className={`p-3 rounded-lg max-w-[85%] text-sm shadow-sm ${m.senderId === user.id ? 'ml-auto bg-brand-burgundy text-white' : 'mr-auto bg-luxe-100 text-luxe-900'}`}>
                                 <p className="font-bold text-[10px] opacity-70 mb-1">{m.senderName} {m.isAdmin && '(Admin)'}</p>
                                 <p>{m.text}</p>
                             </div>
                         ))}
                         <div ref={chatEndRef}></div>
                     </div>
                     <div className="p-3 border-t flex gap-2">
                         <input className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-burgundy" 
                            placeholder="Type..." value={msgText} onChange={e => setMsgText(e.target.value)}
                         />
                         <Button onClick={() => { sendMessage(order.id, msgText); setMsgText(''); }} className="!p-2 rounded-full aspect-square"><Send className="w-4 h-4"/></Button>
                     </div>
                 </Card>
             </div>
        </div>
    );
};

// --- UPDATED ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const { orders, user, updateOrderStatus, designs, addDesign, deleteDesign, employees, addEmployee, removeEmployee, offers, addOffer, removeOffer } = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('revenue'); 
    const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
    
    // Design Upload State
    const [isAddDesignOpen, setIsAddDesignOpen] = useState(false);
    const [newDesign, setNewDesign] = useState({ title: '', price: '', category: OrderCategory.CUSTOM, imageFiles: null as FileList | null });

    // Employee State
    const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
    const [newEmp, setNewEmp] = useState({ name: '', phone: '' });

    // Offer State
    const [newOfferText, setNewOfferText] = useState('');

    if (user?.role !== UserRole.ADMIN) return <Navigate to="/login" />;

    // --- Revenue Logic ---
    const getRevenueData = () => {
        // Mocking data distribution based on timeframe
        const data = [];
        if (timeframe === 'Weekly') {
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
                data.push({ name: day, revenue: Math.floor(Math.random() * 5000) + 1000 });
            });
        } else if (timeframe === 'Monthly') {
             ['Week 1', 'Week 2', 'Week 3', 'Week 4'].forEach(week => {
                data.push({ name: week, revenue: Math.floor(Math.random() * 20000) + 5000 });
            });
        } else {
             ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].forEach(month => {
                data.push({ name: month, revenue: Math.floor(Math.random() * 80000) + 20000 });
            });
        }
        return data;
    };
    const revenueData = getRevenueData();
    const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);

    const handlePrint = () => {
        window.print();
    };

    const downloadCSV = () => {
        const headers = "Timeframe,Revenue\n";
        const rows = revenueData.map(d => `${d.name},${d.revenue}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob as any);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue_${timeframe.toLowerCase()}.csv`;
        a.click();
    };

    // --- Design Logic (Multiple Images) ---
    const handleDesignSubmit = () => {
        if (!newDesign.imageFiles || newDesign.imageFiles.length === 0) return;
        
        const imageUrls = Array.from(newDesign.imageFiles).map(file => URL.createObjectURL(file));

        addDesign({
            id: Date.now().toString(),
            title: newDesign.title,
            price: Number(newDesign.price),
            category: newDesign.category,
            description: '',
            images: imageUrls
        });
        setIsAddDesignOpen(false);
        setNewDesign({ title: '', price: '', category: OrderCategory.CUSTOM, imageFiles: null });
    };

    // --- Employee Logic ---
    const handleAddEmployee = () => {
        if(newEmp.name) {
            addEmployee(newEmp);
            setIsAddEmpOpen(false);
            setNewEmp({name: '', phone: ''});
        }
    }

    // --- Offer Logic ---
    const handleAddOffer = () => {
        if (newOfferText.trim()) {
            addOffer(newOfferText);
            setNewOfferText('');
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-luxe-50">
            <div className="flex justify-between items-center mb-8 no-print">
                <h1 className="text-3xl font-serif font-bold text-luxe-900">Executive Dashboard</h1>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-luxe-200">
                    {[
                        { id: 'revenue', icon: BarChart2, label: 'Analytics' },
                        { id: 'employees', icon: Users, label: 'Staff' },
                        { id: 'designs', icon: Briefcase, label: 'Catalog' },
                        { id: 'orders', icon: ShoppingBag, label: 'Orders' },
                        { id: 'marketing', icon: Megaphone, label: 'Marketing' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${activeTab === tab.id ? 'bg-brand-burgundy text-white shadow-md' : 'text-luxe-600 hover:bg-luxe-50'}`}
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- REVENUE TAB (Print Target) --- */}
            {activeTab === 'revenue' && (
                <div className="space-y-6" id="print-target">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-brand-burgundy text-white border-none">
                            <p className="opacity-80 text-sm mb-1">Total {timeframe} Revenue</p>
                            <h3 className="text-3xl font-serif font-bold">₹{totalRevenue.toLocaleString()}</h3>
                        </Card>
                         <Card>
                            <p className="text-luxe-500 text-sm mb-1">Active Orders</p>
                            <h3 className="text-3xl font-serif font-bold text-luxe-900">{orders.filter(o => o.status !== 'Completed').length}</h3>
                        </Card>
                         <Card>
                            <p className="text-luxe-500 text-sm mb-1">Top Category</p>
                            <h3 className="text-3xl font-serif font-bold text-luxe-900">Bridal</h3>
                        </Card>
                    </div>

                    <Card>
                        <div className="flex justify-between items-center mb-6 no-print">
                            <h3 className="font-bold text-xl text-luxe-900">Financial Performance</h3>
                            <div className="flex items-center gap-3">
                                <div className="bg-luxe-100 rounded-md p-1 flex">
                                    {['Weekly', 'Monthly', 'Yearly'].map(t => (
                                        <button key={t} onClick={() => setTimeframe(t as any)} className={`px-3 py-1 text-xs rounded transition-colors ${timeframe === t ? 'bg-white shadow text-brand-burgundy font-bold' : 'text-luxe-500'}`}>{t}</button>
                                    ))}
                                </div>
                                <Button variant="outline" onClick={downloadCSV} className="!px-3 !py-1.5 text-xs"><FileText className="w-4 h-4 mr-1"/> Export CSV</Button>
                                <Button variant="outline" onClick={handlePrint} className="!px-3 !py-1.5 text-xs"><Printer className="w-4 h-4 mr-1"/> Print PDF</Button>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} cursor={{fill: '#F3F4F6'}} />
                                    <Bar dataKey="revenue" fill="#800020" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- EMPLOYEES TAB --- */}
            {activeTab === 'employees' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl text-luxe-900">Workforce Management</h3>
                        <Button onClick={() => setIsAddEmpOpen(true)}><Plus className="w-4 h-4 mr-2"/> Add Employee</Button>
                    </div>
                    <div className="grid gap-4">
                        {employees.map(emp => (
                            <Card key={emp.id} className="flex justify-between items-center py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-luxe-100 flex items-center justify-center text-luxe-600 font-bold">{emp.name.charAt(0)}</div>
                                    <div>
                                        <p className="font-bold text-luxe-900">{emp.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-luxe-500">
                                            <span>{emp.phone}</span>
                                            <span className="text-luxe-300">|</span>
                                            <span className="font-mono bg-luxe-100 px-1 rounded text-luxe-800">ID: {emp.employeeId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4">
                                        <p className="text-xs text-luxe-400">Assigned Tasks</p>
                                        <p className="font-bold text-luxe-900">{orders.filter(o => o.assignedEmployeeId === emp.id).length}</p>
                                    </div>
                                    <Button variant="danger" className="!p-2" onClick={() => removeEmployee(emp.id)}><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Modal isOpen={isAddEmpOpen} onClose={() => setIsAddEmpOpen(false)} title="New Staff Member">
                        <div className="space-y-4">
                            <Input label="Name" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
                            <Input label="Phone" value={newEmp.phone} onChange={e => setNewEmp({...newEmp, phone: e.target.value})} />
                            <p className="text-xs text-luxe-500">A unique 6-digit login ID will be generated automatically.</p>
                            <Button className="w-full mt-2" onClick={handleAddEmployee}>Onboard Employee</Button>
                        </div>
                    </Modal>
                </div>
            )}

            {/* --- MARKETING TAB (Offers) --- */}
            {activeTab === 'marketing' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                             <h3 className="font-bold text-xl text-luxe-900">Marketing & Offers</h3>
                             <p className="text-luxe-500 text-sm">Manage the sliding banner on the homepage.</p>
                        </div>
                    </div>
                    
                    <Card className="bg-luxe-50/50">
                        <h4 className="font-bold mb-4">Add New Offer</h4>
                        <div className="flex gap-2">
                             <Input 
                                placeholder="E.g. Summer Sale: 20% Off" 
                                className="!mb-0 flex-1" 
                                value={newOfferText}
                                onChange={(e) => setNewOfferText(e.target.value)}
                             />
                             <Button onClick={handleAddOffer}>Add Banner</Button>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <h4 className="font-bold text-luxe-900">Active Offers</h4>
                        {offers.length === 0 && <p className="text-luxe-400 italic">No active offers. Homepage banner will be hidden.</p>}
                        {offers.map(offer => (
                            <div key={offer.id} className="bg-white p-4 rounded-lg shadow-sm border border-luxe-200 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Megaphone className="w-5 h-5 text-brand-burgundy"/>
                                    <span className="font-medium">{offer.text}</span>
                                </div>
                                <Button variant="danger" className="!p-2 !h-auto" onClick={() => removeOffer(offer.id)}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- DESIGNS TAB --- */}
            {activeTab === 'designs' && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-luxe-900">Design Catalog</h3>
                        <Button onClick={() => setIsAddDesignOpen(true)}><Plus className="w-4 h-4 mr-2"/> Add Design</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {designs.map(d => (
                            <div key={d.id} className="relative group bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="relative h-40">
                                    <img src={d.images[0]} className="w-full h-full object-cover" />
                                    {d.images.length > 1 && (
                                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">
                                            +{d.images.length - 1}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-sm truncate">{d.title}</h4>
                                    <p className="text-xs text-luxe-500">₹{d.price}</p>
                                </div>
                                <button onClick={() => deleteDesign(d.id)} className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                    <Modal isOpen={isAddDesignOpen} onClose={() => setIsAddDesignOpen(false)} title="Upload New Design">
                        <div className="space-y-4">
                             <Input label="Title" value={newDesign.title} onChange={e => setNewDesign({...newDesign, title: e.target.value})} />
                             <Input label="Price (₹)" type="number" value={newDesign.price} onChange={e => setNewDesign({...newDesign, price: e.target.value})} />
                             <div>
                                <label className="block text-sm font-medium mb-1.5">Category</label>
                                <select className="w-full border rounded-lg p-2.5 bg-luxe-50" value={newDesign.category} onChange={e => setNewDesign({...newDesign, category: e.target.value as any})}>
                                    {Object.values(OrderCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                             </div>
                             <div className="border-2 border-dashed border-luxe-200 rounded-xl p-6 text-center cursor-pointer hover:bg-luxe-50 transition-colors relative">
                                {/* MULTIPLE FILE INPUT */}
                                <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setNewDesign({...newDesign, imageFiles: e.target.files})} />
                                <Upload className="w-8 h-8 mx-auto text-luxe-400 mb-2"/>
                                <p className="text-sm text-luxe-500">
                                    {newDesign.imageFiles && newDesign.imageFiles.length > 0 
                                        ? `${newDesign.imageFiles.length} files selected` 
                                        : "Click to Upload (Multiple Allowed)"}
                                </p>
                             </div>
                             <Button onClick={handleDesignSubmit} className="w-full" disabled={!newDesign.imageFiles}>Add to Collection</Button>
                        </div>
                    </Modal>
                </div>
            )}
            
            {/* Orders Tab (Simplified View for Admin) */}
            {activeTab === 'orders' && (
                <div>
                    <h3 className="font-bold text-xl text-luxe-900 mb-4">Master Order List</h3>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-luxe-50 text-luxe-600 border-b border-luxe-200">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id} className="border-b border-luxe-100 hover:bg-luxe-50/50">
                                        <td className="p-4 font-mono font-bold text-brand-burgundy cursor-pointer hover:underline" onClick={() => navigate(`/order/${o.id}`)}>#{o.id.slice(-6)}</td>
                                        <td className="p-4 font-bold">{o.customerName}</td>
                                        <td className="p-4"><Badge>{o.status}</Badge></td>
                                        <td className="p-4 text-luxe-500">{o.paymentStatus}</td>
                                        <td className="p-4">
                                            <Button variant="outline" className="!px-3 !py-1 text-xs" onClick={() => navigate(`/order/${o.id}`)}>Manage</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Other Components remain largely similar but assume style updates flow through UI.tsx ---
// (CustomerDashboard, EmployeeDashboard, LoginPage, etc. utilize the improved Card/Button components automatically)

const CustomerDashboard = () => {
    const { orders, user } = useStore();
    const navigate = useNavigate();
    if (!user) return <Navigate to="/login" />;
    const myOrders = orders.filter(o => o.customerId === user.id);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-3xl font-serif font-bold mb-2">My Wardrobe</h1>
            <p className="text-luxe-500 mb-8">Track your bespoke creations.</p>
            {myOrders.length === 0 ? (
                <div className="text-center py-20 bg-luxe-50 rounded-2xl border border-dashed border-luxe-300">
                    <ShoppingBag className="w-16 h-16 text-luxe-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-luxe-700 mb-2">Your collection is empty</h3>
                    <Button onClick={() => navigate('/designs')}>Browse Designs</Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {myOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-glass border border-white p-6 flex flex-col md:flex-row items-center gap-6">
                             <div className="w-20 h-20 bg-luxe-50 rounded-lg flex items-center justify-center border border-luxe-100">
                                {order.generatedDesignUrl ? <img src={order.generatedDesignUrl} className="w-full h-full object-cover rounded-lg" /> : <ShoppingBag className="text-luxe-300" />}
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="font-bold text-lg text-luxe-900">Order #{order.id.slice(-6)}</h3>
                                <p className="text-sm text-luxe-500">{order.category}</p>
                            </div>
                            <div className="flex flex-col gap-2"><Badge>{order.status}</Badge></div>
                            <Button variant="outline" onClick={() => navigate(`/order/${order.id}`)}>Details</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const EmployeeDashboard = () => {
     const { orders, user, updateOrderStatus } = useStore();
     const navigate = useNavigate();
     const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

     if (user?.role !== UserRole.EMPLOYEE) return <Navigate to="/login" />;
     
     const myOrders = orders.filter(o => o.assignedEmployeeId === user.id);
     
     // Filter tasks based on status
     const activeTasks = myOrders.filter(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.DELIVERED);
     const historyTasks = myOrders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.DELIVERED);
     
     const displayedTasks = activeTab === 'active' ? activeTasks : historyTasks;

     return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-luxe-50">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <div>
                    <h1 className="text-3xl font-serif font-bold text-luxe-900">Atelier Portal</h1>
                    <p className="text-luxe-500">Welcome back, {user.name}</p>
                 </div>
                 <div className="flex bg-white rounded-lg p-1 shadow-sm border border-luxe-200">
                     <button 
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-brand-burgundy text-white shadow' : 'text-luxe-500 hover:bg-luxe-50'}`}
                     >
                        <CheckSquare className="w-4 h-4 inline mr-2"/>Active Tasks
                     </button>
                     <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-brand-burgundy text-white shadow' : 'text-luxe-500 hover:bg-luxe-50'}`}
                     >
                        <History className="w-4 h-4 inline mr-2"/>History
                     </button>
                 </div>
             </div>
             
             {displayedTasks.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-xl border border-dashed border-luxe-200">
                     <p className="text-luxe-400">No tasks in this section.</p>
                 </div>
             ) : (
                 <div className="grid gap-6">
                    {displayedTasks.map(order => (
                        <Card key={order.id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="font-bold text-lg">#{order.id.slice(-6)} - {order.category}</h3>
                                <p className="text-sm text-luxe-500">Due: {order.dueDate || 'No Date'}</p>
                            </div>
                            <div className="flex gap-2">
                                 {activeTab === 'active' && order.status !== 'Completed' && (
                                     <Button onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}>Mark Done</Button>
                                 )}
                                 <Button variant="outline" onClick={() => navigate(`/order/${order.id}`)}>View Details & Images</Button>
                            </div>
                        </Card>
                    ))}
                 </div>
             )}
        </div>
     );
};

const LoginPage = () => {
    const { login } = useStore();
    const navigate = useNavigate();
    
    // State to handle Employee ID input
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [empIdInput, setEmpIdInput] = useState('');

    const handleLogin = (role: UserRole) => {
        if (role === UserRole.EMPLOYEE) {
            setSelectedRole(UserRole.EMPLOYEE);
            return;
        }
        
        login(role);
        if (role === UserRole.ADMIN) navigate('/admin');
        else navigate('/my-orders');
    };

    const handleEmployeeLogin = () => {
        const success = login(UserRole.EMPLOYEE, empIdInput);
        if (success) navigate('/employee');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-luxe-100 p-4">
            <Card className="w-full max-w-md text-center p-10 shadow-2xl">
                <div className="w-20 h-20 bg-brand-burgundy rounded-full flex items-center justify-center text-white font-serif font-bold text-3xl mx-auto mb-6 shadow-lg">S</div>
                <h2 className="text-3xl font-serif font-bold mb-2 text-luxe-900">Sri Sujana Embroidery</h2>
                <p className="text-luxe-500 mb-10 tracking-wide">Select Portal Access</p>
                
                {!selectedRole ? (
                    <div className="space-y-4">
                        <Button onClick={() => handleLogin(UserRole.CUSTOMER)} className="w-full" variant="outline">Client Portal</Button>
                        <Button onClick={() => handleLogin(UserRole.EMPLOYEE)} className="w-full" variant="outline">Artisan/Staff Portal</Button>
                        <Button onClick={() => handleLogin(UserRole.ADMIN)} className="w-full bg-luxe-900 hover:bg-black border-none text-white shadow-xl">Executive Admin</Button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <p className="text-sm font-bold text-brand-burgundy">Employee Secure Login</p>
                        <Input 
                            placeholder="Enter 6-digit ID" 
                            className="text-center tracking-widest text-lg"
                            value={empIdInput}
                            onChange={(e) => setEmpIdInput(e.target.value)}
                            maxLength={6}
                        />
                        <Button onClick={handleEmployeeLogin} className="w-full">Verify ID</Button>
                        <Button onClick={() => setSelectedRole(null)} variant="ghost" className="w-full">Back</Button>
                        <p className="text-xs text-luxe-400 mt-4">Contact Admin if you forgot your ID.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

// --- Main App Layout ---
const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-luxe-900 bg-white">
      <Notifications />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/custom-order" element={<OrderFormPage />} />
          <Route path="/name-embroidery" element={<OrderFormPage isNameEmbroidery />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/my-orders" element={<CustomerDashboard />} />
          <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        </Routes>
      </main>
      <footer className="bg-luxe-900 text-luxe-200 py-16 no-print">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
            <div>
                 <h3 className="font-serif text-2xl font-bold text-white mb-6">Sri Sujana Embroidery</h3>
                 <p className="opacity-70 leading-relaxed">Preserving the heritage of hand embroidery while embracing modern design aesthetics. Every stitch tells a story.</p>
            </div>
            <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Navigation</h4>
                <ul className="space-y-3 opacity-70">
                    <li><Link to="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
                    <li><Link to="/designs" className="hover:text-brand-gold transition-colors">Collection</Link></li>
                    <li><Link to="/custom-order" className="hover:text-brand-gold transition-colors">Bespoke Services</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Follow Us</h4>
                <div className="flex gap-4">
                    {['IG', 'FB', 'WA'].map(social => (
                        <div key={social} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-burgundy transition-all cursor-pointer text-xs font-bold">{social}</div>
                    ))}
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
    return (
        <StoreProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </StoreProvider>
    );
};

export default App;
