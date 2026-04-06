import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Code2, 
  Smartphone, 
  Zap, 
  Layout, 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Github,
  Twitter,
  MessageSquare,
  CreditCard,
  Check,
  LogOut,
  Loader2,
  Lock,
  ShoppingBag
} from 'lucide-react';
import { cn } from './lib/utils';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  loginWithEmail,
  registerWithEmail,
  resetPassword,
  changeUserPassword,
  logout, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  orderBy
} from 'firebase/firestore';

// --- Types ---
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
  paypalLink: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  icon: React.ReactNode;
  gallery: string[];
}

// --- Constants ---
const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 50,
    description: 'Perfect for simple landing pages and personal sites.',
    features: ['Single Page', 'Simple Design', 'Mobile Responsive', 'Contact Form'],
    paypalLink: 'https://www.paypal.com/ncp/payment/KL4VTKDSS77XJ',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 100,
    description: 'Great for small businesses needing more presence.',
    features: ['Up to 3 Pages', 'WhatsApp Integration', 'Custom Design', 'SEO Basics'],
    recommended: true,
    paypalLink: 'https://www.paypal.com/ncp/payment/5HVDKDUAANQYU',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 150,
    description: 'Advanced features for growing companies.',
    features: ['Up to 5 Pages', 'Custom Animations', 'High Performance', 'CMS Integration'],
    paypalLink: 'https://www.paypal.com/ncp/payment/3G95E2ZMC9ME8',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 200,
    description: 'The ultimate digital experience for your brand.',
    features: ['Up to 7 Pages', 'UX/UI Design', 'Advanced SEO', 'Priority Support'],
    paypalLink: 'https://www.paypal.com/ncp/payment/Y9SRYKF5PS3WJ',
  },
];

const PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: 'PitMaster WebSite',
    category: 'Restaurant / Food',
    image: 'https://cdn.discordapp.com/attachments/1485839621978853630/1486197087568924682/F69E6A48-E553-4D70-A0FE-C4E0C5A7DCDD.png?ex=69d27825&is=69d126a5&hm=10aeac660f38bd2e5d2fb5cd2d85723e9309b9d44c6f9f5778a59d5190c0064e&',
    icon: <Zap className="w-5 h-5" />,
    gallery: [
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197087568924682/F69E6A48-E553-4D70-A0FE-C4E0C5A7DCDD.png?ex=69d27825&is=69d126a5&hm=10aeac660f38bd2e5d2fb5cd2d85723e9309b9d44c6f9f5778a59d5190c0064e&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197088286019784/6D9428CD-6741-4905-9475-797AB05DD2A7.png?ex=69d27826&is=69d126a6&hm=b2c62b467df5b33b82b2bf003eef838d8c005fd3601ebd3b49a7facfb5f64676&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197088927875112/B48CB68E-2C9A-443F-9F84-8B05735F2322.png?ex=69d27826&is=69d126a6&hm=e53bffed0efc0c5b68bd6743e719d6cd8e040150374f6cbe619b612cb2c80509&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197089430933694/4FDA4795-B62C-4E61-B46A-F434361B8629.png?ex=69d27826&is=69d126a6&hm=60a5852879c11c83c27fd90b071a92e3eba00a321500d859753053dc86771974&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197089980514355/7FD88243-2EFD-4273-B2D7-AD1448C06835.png?ex=69d27826&is=69d126a6&hm=7563d4dac98662a8c711ea110448a3923c6706520ebffce4750adbc2dd254828&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197090492354650/284D36CC-A6BF-45C9-9152-A14768CA870D.png?ex=69d27826&is=69d126a6&hm=4b5968669b2346ac75e3bda0f897f82949fa94e15da080973d69305925cb283d&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197091138011186/47290D7F-6C52-4283-A8B3-9F5429D8586D.png?ex=69d27826&is=69d126a6&hm=cb6af15f0c78f878aff05ca8e64f5ca33933a11fe662bf35cb944e25117aa065&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197091599515878/B6C84C0C-F8D4-43C6-9DA7-C4CBF831E6A1.png?ex=69d27826&is=69d126a6&hm=61d4fc49b7394c1367ed6d0a9a8ca0f7be3fa323c56f7905486edfde14daa6d9&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486197092039790614/C595918A-D80E-4DED-8800-A7E3DFAC37C9.png?ex=69d27826&is=69d126a6&hm=d0bdc31de4b4c753e514e345e6edfaec5aeb8fed25d9e991e4feb3d093ee121f&'
    ]
  },
  {
    id: '2',
    title: 'GSF GANG',
    category: 'Community / Gaming',
    image: 'https://cdn.discordapp.com/attachments/1485839621978853630/1486201625654857769/7F63CB07-0A23-486D-B5D7-229353D8B48E.png?ex=69d27c5f&is=69d12adf&hm=7e1b46b5cd843f78db633951a4a3fc8fc528b01c927776a495ec2ee2c7bfd13b&',
    icon: <Layout className="w-5 h-5" />,
    gallery: [
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201625654857769/7F63CB07-0A23-486D-B5D7-229353D8B48E.png?ex=69d27c5f&is=69d12adf&hm=7e1b46b5cd843f78db633951a4a3fc8fc528b01c927776a495ec2ee2c7bfd13b&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201626036404224/15AC501C-BEF0-49BD-A8AE-08D16E1AD6E7.png?ex=69d27c5f&is=69d12adf&hm=1e7a91dcc56af7e931d09bbed44f99d9e054357b0be95c6b88ce39cee782f593&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201626359234681/4DEE1F21-DF2B-4B47-AF19-87ED85DF6178.png?ex=69d27c60&is=69d12ae0&hm=bebcf1bc17c322c83eb8231191376adae78f1b006cbeabeb699be370d42f3712&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201626803835022/6DF0393B-7F75-4443-9B43-E1435A1A235D.png?ex=69d27c60&is=69d12ae0&hm=579dcf4712ab0f9bc0cd74d799efff1db31da5a6dbcd84dbbef2bc07eda648d4&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201627215003659/A5BCA669-38F9-4888-87AD-5A6657EC43C7.png?ex=69d27c60&is=69d12ae0&hm=74bbcb1b07120df08da8c61f14ead48fc5295e9da8a14233550278f987d951ab&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201627604942952/008E4A0E-4C5D-40C3-AF48-04CD00A6CB8B.png?ex=69d27c60&is=69d12ae0&hm=3d094c7feede8ee8c64fc99afb2380f127c41105c6a8b6b2f4f80878a5e30b53&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201627949142046/6C1BFB93-48B9-42C3-80DB-FA70F114935C.png?ex=69d27c60&is=69d12ae0&hm=dc23a536d09e627641a524edc37e5f38acea12420d37a37c583197732f57238f&',
      'https://cdn.discordapp.com/attachments/1485839621978853630/1486201628309717033/F11DA09A-963A-4490-AC3E-7A64C07041FB.png?ex=69d27c60&is=69d12ae0&hm=cf50db3f89ebabcb41c4befe511a6562be86958f6f88dd59b863bd1e705f68d5&'
    ]
  },
  {
    id: '3',
    title: 'SmartWebs',
    category: 'Web Agency',
    image: 'https://cdn.discordapp.com/attachments/1485839621978853630/1490187930898137199/9F8640F7-C728-4E39-8F26-0FAB85679CF5.png?ex=69d32529&is=69d1d3a9&hm=6a019b2dd2d828e4b8be28f44b05abdb8f27bc58d665cdf33f8de277aaeab8e3&',
    icon: <Code2 className="w-5 h-5" />,
    gallery: [
      'https://cdn.discordapp.com/attachments/1485839621978853630/1490187930898137199/9F8640F7-C728-4E39-8F26-0FAB85679CF5.png?ex=69d32529&is=69d1d3a9&hm=6a019b2dd2d828e4b8be28f44b05abdb8f27bc58d665cdf33f8de277aaeab8e3&'
    ]
  },
];

const PAYMENT_METHODS = [
  { id: 'paypal', name: 'PayPal', icon: <CreditCard className="w-5 h-5" />, color: 'bg-[#0070ba]' },
  { id: 'bit', name: 'Bit', icon: <Smartphone className="w-5 h-5" />, color: 'bg-blue-600' },
  { id: 'payoneer', name: 'Payoneer', icon: <Globe className="w-5 h-5" />, color: 'bg-orange-600' },
  { id: 'bitcoin', name: 'Bitcoin', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-600' },
];

// --- Components ---

const Navbar = ({ onLoginClick, onProfileClick, user }: { onLoginClick: () => void, onProfileClick: () => void, user: FirebaseUser | null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'בית', href: '#home' },
    { name: 'מחירון', href: '#prices' },
    { name: 'תיק עבודות', href: '#portfolio' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "bg-black/80 backdrop-blur-md border-white/10 py-3" : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
            SmartWebs
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10">
              <button 
                onClick={onProfileClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                title="פרופיל אישי"
              >
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`} alt="" className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium text-gray-300">{user.displayName || 'משתמש'}</span>
              </button>
              <button 
                onClick={() => logout()}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="התנתק"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
            >
              <UserIcon className="w-4 h-4" />
              התחברות
            </button>
          )}

          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-400 hover:text-white"
              >
                {link.name}
              </a>
            ))}
            {user ? (
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500"
              >
                <LogOut className="w-5 h-5" />
                התנתק
              </button>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <UserIcon className="w-5 h-5" />
                התחברות
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', content: '' });
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userUid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      }, (error) => {
        console.error("Error fetching orders:", error);
      });
      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    
    try {
      if (authMode === 'login') {
        await loginWithEmail(authEmail, authPassword);
        setIsLoginOpen(false);
      } else if (authMode === 'register') {
        await registerWithEmail(authEmail, authPassword, authName);
        setIsLoginOpen(false);
      } else if (authMode === 'reset') {
        await resetPassword(authEmail);
        alert('נשלח אליך אימייל לאיפוס הסיסמה.');
        setAuthMode('login');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError(error.message || 'אירעה שגיאה. אנא נסה שוב.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const phoneNumber = "972504818481"; // 050-481-8481
      const message = `שלום,\nשמי: ${contactForm.name}\nטלפון: ${contactForm.phone}\nהודעה: ${contactForm.content}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      setContactForm({ name: '', phone: '', content: '' });
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('אירעה שגיאה. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setIsLoginOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans" dir="rtl">
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        user={user}
      />

      {/* Portfolio Modal */}
      <AnimatePresence>
        {selectedPortfolioItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  {selectedPortfolioItem.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedPortfolioItem.title}</h3>
                  <p className="text-blue-400 text-sm font-medium">{selectedPortfolioItem.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPortfolioItem(null)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-12">
              <div className="max-w-5xl mx-auto space-y-12">
                {selectedPortfolioItem.gallery.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
                  >
                    <img 
                      src={img} 
                      alt={`${selectedPortfolioItem.title} screenshot ${idx + 1}`}
                      className="w-full h-auto"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/20 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold tracking-wider uppercase mb-6">
              🚀 ברוכים הבאים ל-SmartWebs
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.2]">
              הבית שלך לאתרים <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                שמביאים לקוחות – לא רק נראים טוב.
              </span>
            </h1>
            <div className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed text-right md:text-center space-y-2">
              <p>💻 אנחנו מתמחים ביצירת אתרים מודרניים, מהירים וממוקדים בתוצאות.</p>
              <p>📈 הגדלת לידים, פניות ושיחות לעסקים מקומיים.</p>
              <p>🎯 עיצוב נקי, אמין ומותאם בדיוק לקהל שלך.</p>
              <div className="mt-6 inline-block text-right">
                <p className="font-bold text-white mb-2">🔧 מה תקבל כאן:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>הצעות וביקורות על אתרים</li>
                  <li>טיפים לשיווק ודיגיטל</li>
                  <li>שירותי בניית אתרים</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#prices"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                התחל עכשיו
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#portfolio"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                צפה בעבודות
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'לקוחות מרוצים', value: '+500' },
            { label: 'פרויקטים שהושלמו', value: '+1.2K' },
            { label: 'שנות ניסיון', value: '8+' },
            { label: 'זמינות תמיכה', value: '24/7' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prices" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">מחירון שקוף והוגן</h2>
            <p className="text-gray-400">בחר את החבילה המתאימה ביותר לצרכים שלך</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -10 }}
                className={cn(
                  "relative p-8 rounded-2xl border transition-all flex flex-col",
                  plan.recommended 
                    ? "bg-blue-600/5 border-blue-500/30 shadow-2xl shadow-blue-500/10" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    מומלץ
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold">₪{plan.price}</span>
                    <span className="text-gray-500 text-sm">/ פרויקט</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{plan.description}</p>
                </div>
                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <a 
                    href={plan.paypalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-full py-4 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2",
                      plan.recommended
                        ? "bg-[#0070ba] hover:bg-[#005ea6] text-white"
                        : "bg-[#0070ba]/20 hover:bg-[#0070ba]/30 text-[#0070ba]"
                    )}
                  >
                    <CreditCard className="w-5 h-5" />
                    קנה עכשיו ב-PayPal
                  </a>
                  <a 
                    href="#contact"
                    className="w-full py-3 rounded-xl font-bold transition-all text-center text-sm text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    תשלום בשיטות אחרות
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold mb-4">תיק עבודות</h2>
              <p className="text-gray-400">הצצה קטנה לכמה מהפרויקטים האחרונים שבנינו עבור הלקוחות שלנו</p>
            </div>
            <button className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2">
              צפה בכל העבודות
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PORTFOLIO.map((item) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer"
                onClick={() => setSelectedPortfolioItem(item)}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">צור קשר ותשלום</h2>
            <p className="text-gray-400">אנחנו כאן לכל שאלה, וגם כדי לעזור לך להשלים את הרכישה.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                  דרכי התקשרות ותשלום
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-blue-600 transition-all">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Bit</div>
                      <div className="text-lg font-bold">פתיחת טיקט בדיסקורד</div>
                    </div>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-[#0070ba] transition-all">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">PayPal</div>
                      <div className="text-lg font-bold">תשלום ישיר בחבילות</div>
                    </div>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-orange-600 transition-all">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">PAYONeer</div>
                      <div className="text-lg font-bold">פתיחת טיקט בדיסקורד</div>
                    </div>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-yellow-600 transition-all">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Bitcoin</div>
                      <div className="text-lg font-bold">דרך הדיסקורד</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
                <h4 className="font-bold mb-2">צריך עזרה?</h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  אם אתה מסתבך עם התשלום או רוצה הצעה מותאמת אישית, אל תהסס לפנות אלינו בטופס המצורף.
                </p>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-xs font-bold text-red-400 text-center">
                    ⚠️ אם שילמת ולא פתחת טיקט לא תקבל את המוצר
                  </p>
                </div>
              </div>
            </div>

            <form className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 mr-1">השם שלך</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="ישראל ישראלי" 
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 mr-1">מספר טלפון</label>
                  <input 
                    type="tel" 
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="050-000-0000" 
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 mr-1">מה אתה צריך?</label>
                <textarea 
                  rows={4} 
                  required
                  value={contactForm.content}
                  onChange={(e) => setContactForm({ ...contactForm, content: e.target.value })}
                  placeholder="ספר לנו קצת על הפרויקט שלך..." 
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all resize-none" 
                />
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'שלח הודעה'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">SmartWebs</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
              אנחנו הופכים רעיונות למציאות דיגיטלית. בניית אתרים ברמה הגבוהה ביותר עם דגש על עיצוב וביצועים.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/ab5P35TJAX" target="_blank" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">ניווט מהיר</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#home" className="hover:text-white transition-colors">בית</a></li>
              <li><a href="#prices" className="hover:text-white transition-colors">מחירון</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">תיק עבודות</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">צור קשר</h4>
            <ul className="space-y-4 text-gray-500">
              <li>054-336-4763</li>
              <li>050-481-8481</li>
              <li>דיסקורד: Hipaz</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© 2026 SmartWebs. כל הזכויות שמורות לצוות Smart Webs.</p>
          <div className="flex items-center gap-8">
            <button onClick={() => setIsTermsOpen(true)} className="hover:text-gray-400 transition-colors">תנאי שימוש</button>
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-gray-400 transition-colors">מדיניות פרטיות</button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl z-[90] p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <UserIcon className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {authMode === 'login' ? 'ברוכים הבאים' : authMode === 'register' ? 'צור חשבון' : 'איפוס סיסמה'}
                </h2>
                <p className="text-gray-500">
                  {authMode === 'login' ? 'התחבר לחשבון שלך ב-SmartWebs' : authMode === 'register' ? 'הצטרף אלינו ותתחיל לבנות' : 'הזן את האימייל שלך לאיפוס'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                {authMode === 'login' && (
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all flex items-center justify-center gap-3"
                  >
                    <Globe className="w-5 h-5" />
                    התחבר עם Google
                  </button>
                )}
                
                {authMode === 'login' && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0a] px-2 text-gray-500">או</span></div>
                  </div>
                )}

                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                    {authError}
                  </div>
                )}

                {authMode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 mr-1">שם מלא</label>
                    <input 
                      type="text" 
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="ישראל ישראלי"
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all text-white"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 mr-1">אימייל</label>
                  <input 
                    type="email" 
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all text-white"
                  />
                </div>

                {authMode !== 'reset' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-400 mr-1">סיסמה</label>
                      {authMode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setAuthMode('reset')}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          שכחת סיסמה?
                        </button>
                      )}
                    </div>
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all text-white"
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {authLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {authMode === 'login' ? 'התחבר עכשיו' : authMode === 'register' ? 'צור חשבון' : 'שלח קישור לאיפוס'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-gray-500 text-sm">
                  {authMode === 'login' ? (
                    <>
                      אין לך חשבון?{' '}
                      <button onClick={() => setAuthMode('register')} className="text-blue-400 font-bold hover:underline">צור חשבון חדש</button>
                    </>
                  ) : (
                    <>
                      כבר יש לך חשבון?{' '}
                      <button onClick={() => setAuthMode('login')} className="text-blue-400 font-bold hover:underline">התחבר כאן</button>
                    </>
                  )}
                </p>
              </div>

              <button 
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-6 left-6 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {isTermsOpen && (
          <InfoModal 
            title="תנאי שימוש" 
            onClose={() => setIsTermsOpen(false)}
          >
            <div className="space-y-6 text-right" dir="rtl">
              <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                <p className="text-white font-bold">השימוש בשירות מגיל 15+ בלבד באישור הורים.</p>
              </div>
              <p className="text-gray-400 leading-relaxed">
                חובה להיות חבר בשרת הדיסקורד הרשמי שלנו לקבלת תמיכה ועדכונים:
              </p>
              <a 
                href="https://discord.gg/AxqxHhTw8v" 
                target="_blank" 
                className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                הצטרף לדיסקורד
              </a>
            </div>
          </InfoModal>
        )}
      </AnimatePresence>

      {/* Privacy Modal (Service Rules) */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <InfoModal 
            title="מדיניות פרטיות וחוקי השירות" 
            onClose={() => setIsPrivacyOpen(false)}
          >
            <div className="space-y-4 text-right overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar" dir="rtl">
              <h3 className="text-xl font-bold text-blue-500 mb-4">📜 חוקי השירות</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-xl">❌</span>
                  <span>אין החזרים כספיים לאחר תחילת העבודה.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">💰</span>
                  <span>התשלום מתבצע מראש או 50% לפני + 50% בסיום.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🛠️</span>
                  <span>כל לקוח מקבל בדיוק את מה שבחר (Basic / Pro / Premium בלבד).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">➕</span>
                  <span>כל תוספת מעבר לחבילה תחויב בתשלום נוסף.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">⏱️</span>
                  <span>זמן אספקה משתנה לפי מורכבות (בין 1–4 ימים).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🔄</span>
                  <span>תיקונים כלולים רק במסגרת החבילה שנרכשה.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <span>במקרה של בעיה, ניתן לפנות אליי ואני אטפל בה בהקדם האפשרי.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🚫</span>
                  <span>אין אחריות על שינויים שנעשו על ידי הלקוח לאחר מסירת האתר.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <span>כל הקבצים והקוד נשארים שייכים ללקוח לאחר תשלום מלא.</span>
                </li>
              </ul>
            </div>
          </InfoModal>
        )}
      </AnimatePresence>
      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && user && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl z-[90] p-8 md:p-10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">הפרופיל שלי</h2>
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* User Info & Password Change */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`} 
                      alt="" 
                      className="w-16 h-16 rounded-full border border-white/20" 
                    />
                    <div>
                      <div className="font-bold text-lg">{user.displayName || 'משתמש'}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-500" />
                      שינוי סיסמה
                    </h3>
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                        try {
                          await changeUserPassword(newPassword);
                          alert('הסיסמה שונתה בהצלחה!');
                          form.reset();
                        } catch (error: any) {
                          alert(error.message || 'אירעה שגיאה בשינוי הסיסמה. ייתכן שצריך להתחבר מחדש.');
                        }
                      }}
                      className="space-y-4"
                    >
                      <input 
                        type="password" 
                        name="newPassword"
                        required
                        placeholder="סיסמה חדשה"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all text-white text-sm"
                      />
                      <button 
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm"
                      >
                        עדכן סיסמה
                      </button>
                    </form>
                  </div>
                </div>

                {/* Purchases / Orders */}
                <div className="flex-1 space-y-4">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-purple-500" />
                    הרכישות שלי
                  </h3>
                  
                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-gray-400">עדיין לא ביצעת רכישות.</p>
                      <a href="#prices" onClick={() => setIsProfileOpen(false)} className="text-blue-400 hover:underline text-sm mt-2 block">
                        צפה במחירון שלנו
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">{order.planName}</span>
                            <span className="text-blue-400 font-bold">₪{order.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>סטטוס: {order.status === 'paid' ? 'שולם' : order.status === 'completed' ? 'הושלם' : 'ממתין'}</span>
                            <span>{new Date(order.createdAt?.toDate()).toLocaleDateString('he-IL')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const InfoModal = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl z-[130] p-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500 hover:text-white" />
          </button>
        </div>
        {children}
      </motion.div>
    </>
  );
};

