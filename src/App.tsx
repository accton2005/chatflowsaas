import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, signInWithGoogle } from './firebase';
import { UserProfile, ChatbotConfig } from './types';
import { Layout, Bot, Database, CreditCard, Settings, LogOut, Menu, X, ChevronRight, Zap, Shield, Globe, MessageSquare, BarChart3, Plus, Trash2, Edit2, ExternalLink, Send, Paperclip, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }: any) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: any = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    accent: "bg-amber-100 text-amber-700 hover:bg-amber-200"
  };
  
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select 
      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
      {...props}
    >
      {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <textarea 
      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 min-h-[100px]"
      {...props}
    />
  </div>
);

// --- PAGES ---

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Bot className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ChatFlow AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
            <a href="#integrations" className="hover:text-indigo-600">Integrations</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/login')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            <span>Next-Gen AI Chatbot Platform</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]"
          >
            Build Smarter Chatbots <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">With Your Own Data</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Connect your PDFs, websites, and docs. Deploy a custom AI assistant in minutes. 
            Scale your customer support with Gemini and GPT-4.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => navigate('/login')}>
              Start Free Trial
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything you need to scale</h2>
            <p className="text-gray-600 mt-4">Powerful features for modern businesses.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: "RAG Knowledge Base", desc: "Upload PDFs, scrape URLs, or paste text. Your AI learns from your specific data." },
              { icon: Shield, title: "Enterprise Security", desc: "Multi-tenant data isolation and secure API access for your peace of mind." },
              { icon: Globe, title: "Multi-Language", desc: "Support for 50+ languages. Automatically detects and responds in the user's language." },
              { icon: MessageSquare, title: "Dual AI Engine", desc: "Switch between Google Gemini and OpenAI GPT models with automatic fallback." },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Track message volume, token usage, and user satisfaction in real-time." },
              { icon: Zap, title: "Instant Deployment", desc: "Embed your chatbot on any site with a single line of code or use our WordPress plugin." },
            ].map((f, i) => (
              <Card key={i} className="p-8 hover:border-indigo-200 transition-all group">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                  <f.icon className="text-indigo-600 w-6 h-6 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="text-gray-600 mt-4">Choose the plan that's right for your business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$29", features: ["1 Chatbot", "1000 Messages/mo", "50MB Knowledge Base", "Standard Support"] },
              { name: "Pro", price: "$79", features: ["5 Chatbots", "10,000 Messages/mo", "500MB Knowledge Base", "Priority Support", "Custom Branding"], popular: true },
              { name: "Business", price: "$199", features: ["Unlimited Chatbots", "50,000 Messages/mo", "2GB Knowledge Base", "Dedicated Account Manager", "API Access"] },
            ].map((p, i) => (
              <Card key={i} className={`p-8 relative ${p.popular ? 'border-indigo-600 ring-4 ring-indigo-50' : ''}`}>
                {p.popular && <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">POPULAR</div>}
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={p.popular ? 'primary' : 'secondary'} onClick={() => navigate('/login')}>Get Started</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      // Create user profile if not exists
      const userRef = doc(db, 'users', loggedUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const isAdmin = loggedUser.email === 'elqelai@enarabat.ac.ma';
        await setDoc(userRef, {
          uid: loggedUser.uid,
          email: loggedUser.email,
          displayName: loggedUser.displayName,
          photoURL: loggedUser.photoURL,
          role: isAdmin ? 'admin' : 'user',
          plan: 'free',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Bot className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your AI chatbots</p>
        </div>
        <Button className="w-full py-3" variant="secondary" onClick={handleLogin}>
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continue with Google
        </Button>
        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </Card>
    </div>
  );
};

const Dashboard = ({ profile }: { profile: UserProfile | null }) => {
  const [chatbots, setChatbots] = useState<ChatbotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    const q = query(collection(db, 'chatbots'), where('ownerId', '==', profile.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bots = snapshot.docs.map(doc => doc.data() as ChatbotConfig);
      setChatbots(bots);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [profile]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.displayName}</p>
        </div>
        <Button onClick={() => navigate('/chatbots/new')}>
          <Plus className="w-4 h-4" />
          New Chatbot
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-indigo-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-6 h-6 opacity-80" />
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">THIS MONTH</span>
          </div>
          <div className="text-3xl font-bold">1,284</div>
          <div className="text-sm opacity-80 mt-1">Total Messages</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">TOKEN USAGE</span>
          </div>
          <div className="text-3xl font-bold">45.2k</div>
          <div className="text-sm text-gray-500 mt-1">Tokens consumed</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">PLAN</span>
          </div>
          <div className="text-3xl font-bold capitalize">{profile?.plan}</div>
          <div className="text-sm text-gray-500 mt-1">Current subscription</div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">Your Chatbots</h2>
        {chatbots.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="font-bold">No chatbots yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Create your first AI assistant to get started.</p>
            <Button onClick={() => navigate('/chatbots/new')}>Create Chatbot</Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {chatbots.map(bot => (
              <Card key={bot.id} className="p-6 hover:border-indigo-200 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Bot className="text-indigo-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">{bot.name}</h3>
                      <p className="text-xs text-gray-500">{bot.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="p-2" onClick={() => navigate(`/chatbots/${bot.id}/edit`)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="p-2 text-indigo-600" onClick={() => navigate(`/chatbots/${bot.id}/chat`)}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 243 msgs</span>
                    <span className="flex items-center gap-1"><Database className="w-3 h-3" /> 12 sources</span>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded ${bot.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {bot.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ChatbotBuilder = ({ profile, isEdit }: { profile: UserProfile | null, isEdit?: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    name: '',
    personality: '',
    behaviorRules: '',
    model: 'gemini-3-flash-preview',
    isActive: true
  });

  useEffect(() => {
    if (isEdit && id) {
      getDoc(doc(db, 'chatbots', id)).then(snap => {
        if (snap.exists()) setConfig(snap.data() as any);
      });
    }
  }, [isEdit, id]);

  const handleSave = async () => {
    if (!profile) return;
    if (!config.name) return toast.error("Name is required");
    
    setLoading(true);
    try {
      const botId = isEdit ? id! : uuidv4();
      await setDoc(doc(db, 'chatbots', botId), {
        ...config,
        id: botId,
        ownerId: profile.uid,
        updatedAt: new Date().toISOString(),
        ...(isEdit ? {} : { createdAt: new Date().toISOString() })
      }, { merge: true });
      toast.success(isEdit ? "Chatbot updated!" : "Chatbot created!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Failed to save chatbot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="p-2" onClick={() => navigate(-1)}>
          <X className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Chatbot' : 'Create New Chatbot'}</h1>
      </div>

      <Card className="p-8 space-y-6">
        <Input 
          label="Chatbot Name" 
          placeholder="e.g. Customer Support Bot" 
          value={config.name}
          onChange={(e: any) => setConfig({ ...config, name: e.target.value })}
        />
        <Select 
          label="AI Model" 
          options={[
            { value: 'gemini-3-flash-preview', label: 'Google Gemini 3 Flash (Fast & Cheap)' },
            { value: 'gemini-3.1-pro-preview', label: 'Google Gemini 3.1 Pro (Powerful)' },
            { value: 'gpt-4o', label: 'OpenAI GPT-4o (Premium)' },
            { value: 'gpt-3.5-turbo', label: 'OpenAI GPT-3.5 Turbo' }
          ]}
          value={config.model}
          onChange={(e: any) => setConfig({ ...config, model: e.target.value })}
        />
        <Textarea 
          label="Personality & Tone" 
          placeholder="e.g. Helpful, professional, and friendly. Use emojis occasionally." 
          value={config.personality}
          onChange={(e: any) => setConfig({ ...config, personality: e.target.value })}
        />
        <Textarea 
          label="Behavior Rules (System Prompt)" 
          placeholder="e.g. You are a support agent for a SaaS company. Only answer questions about our products. If you don't know, refer to support@example.com." 
          value={config.behaviorRules}
          onChange={(e: any) => setConfig({ ...config, behaviorRules: e.target.value })}
        />
        
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSave} loading={loading}>{isEdit ? 'Save Changes' : 'Create Chatbot'}</Button>
        </div>
      </Card>
    </div>
  );
};

const KnowledgeBasePage = ({ profile }: { profile: UserProfile | null }) => {
  const [sources, setSources] = useState<any[]>([]);
  const [chatbots, setChatbots] = useState<ChatbotConfig[]>([]);
  const [selectedBot, setSelectedBot] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    const q = query(collection(db, 'chatbots'), where('ownerId', '==', profile.uid));
    onSnapshot(q, (snap) => {
      const bots = snap.docs.map(doc => doc.data() as ChatbotConfig);
      setChatbots(bots);
      if (bots.length > 0 && !selectedBot) setSelectedBot(bots[0].id);
    });
  }, [profile]);

  useEffect(() => {
    if (!selectedBot) return;
    const q = query(collection(db, 'chatbots', selectedBot, 'knowledge'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setSources(snap.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [selectedBot]);

  const handleUrlScrape = async () => {
    if (!url || !selectedBot) return;
    setLoading(true);
    try {
      const res = await fetch('/api/rag/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, chatbotId: selectedBot, ownerId: profile?.uid })
      });
      if (res.ok) {
        toast.success("URL scraped successfully!");
        setUrl('');
      } else {
        toast.error("Failed to scrape URL.");
      }
    } catch (error) {
      toast.error("Error scraping URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !selectedBot) return;
    
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await fetch('/api/rag/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data, chatbotId: selectedBot, ownerId: profile?.uid })
        });
        if (res.ok) toast.success("PDF processed!");
        else toast.error("Failed to process PDF.");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error uploading file.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-gray-600">Train your chatbots with custom data.</p>
        </div>
        <div className="w-64">
          <Select 
            options={chatbots.map(b => ({ value: b.id, label: b.name }))}
            value={selectedBot}
            onChange={(e: any) => setSelectedBot(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <h2 className="font-bold flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Add Website URL
          </h2>
          <div className="flex gap-2">
            <Input 
              placeholder="https://example.com/docs" 
              className="flex-1"
              value={url}
              onChange={(e: any) => setUrl(e.target.value)}
            />
            <Button onClick={handleUrlScrape} loading={loading}>Scrape</Button>
          </div>
          <div className="pt-6 border-t border-gray-100">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" />
              Upload PDF
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-all cursor-pointer relative">
              <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
              <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click or drag PDF to upload</p>
              <p className="text-xs text-gray-400 mt-1">Max size: 10MB</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold mb-4">Active Sources</h2>
          <div className="space-y-3">
            {sources.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No sources added yet.</p>
            ) : (
              sources.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {s.type === 'pdf' ? <FileText className="w-4 h-4 text-red-500" /> : <Globe className="w-4 h-4 text-blue-500" />}
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{s.metadata?.url || 'PDF Document'}</p>
                      <p className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="p-1 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const ChatInterface = ({ profile }: { profile: UserProfile | null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState<ChatbotConfig | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'chatbots', id)).then(snap => {
      if (snap.exists()) setBot(snap.data() as ChatbotConfig);
    });

    const q = query(collection(db, 'chatbots', id, 'messages'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => doc.data()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !bot || !id) return;
    
    const userMsg = {
      id: uuidv4(),
      chatbotId: id,
      role: 'user',
      text: input,
      createdAt: new Date().toISOString()
    };
    
    setInput('');
    setLoading(true);
    
    try {
      await setDoc(doc(db, 'chatbots', id, 'messages', userMsg.id), userMsg);
      
      // Fetch knowledge
      const knowledgeQuery = query(collection(db, 'chatbots', id, 'knowledge'));
      const knowledgeSnap = await getDocs(knowledgeQuery);
      const knowledge = knowledgeSnap.docs.map(doc => doc.data().content).join('\n\n');
      
      // Call AI
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        System: ${bot.behaviorRules}
        Personality: ${bot.personality}
        Context Knowledge: ${knowledge.substring(0, 10000)}
        User: ${input}
      `;
      
      const result = await ai.models.generateContent({
        model: bot.model,
        contents: prompt
      });
      const responseText = result.text;
      
      const assistantMsg = {
        id: uuidv4(),
        chatbotId: id,
        role: 'assistant',
        text: responseText,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'chatbots', id, 'messages', assistantMsg.id), assistantMsg);
    } catch (error) {
      toast.error("Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Bot className="text-indigo-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold">{bot?.name}</h2>
            <p className="text-xs text-green-600 font-medium">Online</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'}`}>
              <div className="prose prose-sm max-w-none">
                <Markdown>{m.text}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
        <div className="flex gap-2">
          <input 
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button className="p-3 rounded-xl" onClick={handleSend} disabled={loading}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const BillingPage = ({ profile }: { profile: UserProfile | null }) => {
  const handleSubscribe = async (plan: string) => {
    toast.info(`Redirecting to ${plan} checkout...`);
    // In real app, call /api/billing/create-checkout
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your plan and payment methods.</p>
      </div>

      <Card className="p-8 bg-indigo-600 text-white flex items-center justify-between">
        <div>
          <p className="text-indigo-100 text-sm font-medium">Current Plan</p>
          <h2 className="text-3xl font-bold capitalize">{profile?.plan} Plan</h2>
          <p className="text-indigo-200 text-sm mt-1">Next billing date: April 24, 2026</p>
        </div>
        <Button variant="accent">Manage Subscription</Button>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Starter", price: "$29", features: ["1 Chatbot", "1000 Messages/mo", "50MB Knowledge Base"] },
          { name: "Pro", price: "$79", features: ["5 Chatbots", "10,000 Messages/mo", "500MB Knowledge Base"], popular: true },
          { name: "Business", price: "$199", features: ["Unlimited Chatbots", "50,000 Messages/mo", "2GB Knowledge Base"] },
        ].map((p, i) => (
          <Card key={i} className={`p-6 ${p.name.toLowerCase() === profile?.plan ? 'border-indigo-600 ring-2 ring-indigo-100' : ''}`}>
            <h3 className="font-bold">{p.name}</h3>
            <div className="text-2xl font-bold mt-2 mb-4">{p.price}<span className="text-xs text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-6">
              {p.features.map((f, j) => (
                <li key={j} className="text-xs text-gray-600 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Button 
              className="w-full text-sm" 
              variant={p.name.toLowerCase() === profile?.plan ? 'secondary' : 'primary'}
              disabled={p.name.toLowerCase() === profile?.plan}
              onClick={() => handleSubscribe(p.name)}
            >
              {p.name.toLowerCase() === profile?.plan ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SettingsPage = ({ profile }: { profile: UserProfile | null }) => {
  const [isGeminiReady, setIsGeminiReady] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if Gemini API key is available
    if (process.env.GEMINI_API_KEY) {
      setIsGeminiReady(true);
    } else {
      setIsGeminiReady(false);
    }
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      toast.success("API Key selection opened. Please select a key to enable advanced models.");
    } else {
      toast.error("API Key selection is not available in this environment.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Configure your account and API integrations.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <h2 className="font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            API Integrations
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Bot className="text-indigo-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Google Gemini API</p>
                  <p className="text-xs text-gray-500">Required for chatbot responses</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isGeminiReady === true ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> READY
                  </span>
                ) : isGeminiReady === false ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                    <AlertCircle className="w-3 h-3" /> MISSING
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Checking...</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-3">
              <p className="text-xs text-indigo-700 font-medium">
                Advanced models like Gemini 3.1 Pro may require a personal API key.
              </p>
              <Button variant="primary" className="w-full text-xs py-2" onClick={handleSelectKey}>
                Select Personal API Key
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="font-bold flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-600" />
            Profile Settings
          </h2>
          <div className="space-y-4">
            <Input label="Display Name" value={profile?.displayName || ''} disabled />
            <Input label="Email Address" value={profile?.email || ''} disabled />
            <div className="pt-4">
              <p className="text-xs text-gray-500 italic">Profile information is managed via Google Account.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminPanel = ({ profile }: { profile: UserProfile | null }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [allChatbots, setAllChatbots] = useState<ChatbotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'chatbots' | 'analytics'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    const fetchAdminData = async () => {
      try {
        // In a real app, these would be separate collections or filtered queries
        // For this demo, we'll fetch all users and chatbots
        const usersSnap = await getDocs(collection(db, 'users'));
        const botsSnap = await getDocs(collection(db, 'chatbots'));
        
        setUsers(usersSnap.docs.map(doc => doc.data() as UserProfile));
        setAllChatbots(botsSnap.docs.map(doc => doc.data() as ChatbotConfig));
      } catch (error) {
        toast.error("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [profile]);

  const updateUserPlan = async (userId: string, newPlan: SubscriptionPlan) => {
    try {
      await setDoc(doc(db, 'users', userId), { plan: newPlan, updatedAt: new Date().toISOString() }, { merge: true });
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, plan: newPlan } : u));
      toast.success(`User plan updated to ${newPlan}`);
    } catch (error) {
      toast.error("Failed to update plan.");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This will NOT delete their Firebase Auth account, only their profile.")) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.uid !== userId));
      toast.success("User profile deleted.");
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const toggleChatbotStatus = async (botId: string, currentStatus: boolean) => {
    try {
      await setDoc(doc(db, 'chatbots', botId), { isActive: !currentStatus, updatedAt: new Date().toISOString() }, { merge: true });
      setAllChatbots(prev => prev.map(b => b.id === botId ? { ...b, isActive: !currentStatus } : b));
      toast.success(`Chatbot ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update chatbot status.");
    }
  };

  const deleteChatbot = async (botId: string) => {
    if (!window.confirm("Are you sure you want to delete this chatbot?")) return;
    try {
      await deleteDoc(doc(db, 'chatbots', botId));
      setAllChatbots(prev => prev.filter(b => b.id !== botId));
      toast.success("Chatbot deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete chatbot.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChatbots = allChatbots.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.ownerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewUserBots = (userId: string) => {
    setSearchQuery(userId);
    setActiveTab('chatbots');
  };

  if (profile?.role !== 'admin') return <Navigate to="/dashboard" />;
  if (loading) return <div className="flex items-center justify-center h-screen">Loading Admin Data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-600">Global platform management and oversight.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1.5 text-sm bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <Menu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('chatbots')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'chatbots' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Chatbots
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'analytics' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'users' && (
        <Card className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.photoURL || ''} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.displayName}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.plan}
                      onChange={(e) => updateUserPlan(u.uid, e.target.value as SubscriptionPlan)}
                      className="text-xs font-bold px-2 py-1 rounded capitalize bg-gray-50 border-none outline-none cursor-pointer"
                    >
                      <option value="free">Free</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                      <option value="business">Business</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="p-1 text-indigo-600" onClick={() => viewUserBots(u.uid)}>
                        <Bot className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" className="p-1 text-indigo-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" className="p-1 text-red-500" onClick={() => deleteUser(u.uid)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'chatbots' && (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredChatbots.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
              No chatbots found matching "{searchQuery}"
            </div>
          ) : (
            filteredChatbots.map(bot => (
              <Card key={bot.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Bot className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{bot.name}</h3>
                    <p className="text-xs text-gray-500">Owner ID: {bot.ownerId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="p-1 text-red-500" onClick={() => deleteChatbot(bot.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <button 
                    onClick={() => toggleChatbotStatus(bot.id, bot.isActive)}
                    className={`text-xs font-bold px-2 py-1 rounded transition-all ${bot.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {bot.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Model: {bot.model}</span>
                  <button 
                    onClick={() => navigate(`/chatbots/${bot.id}/edit`)}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    View Knowledge
                  </button>
                  <button 
                    onClick={() => navigate(`/chatbots/${bot.id}/chat`)}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    View Chat
                  </button>
                </div>
                <span>Created: {new Date(bot.createdAt).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Platform Growth
            </h3>
            <div className="h-48 bg-gray-50 rounded-xl flex items-end justify-around p-4">
              {[40, 65, 45, 90, 75, 85, 100].map((h, i) => (
                <div key={i} className="w-8 bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </Card>
          <Card className="p-8 flex flex-col justify-center items-center text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Zap className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold">{allChatbots.length}</h3>
            <p className="text-gray-500">Total Chatbots Deployed</p>
            <div className="pt-4 flex gap-8">
              <div className="text-center">
                <p className="text-xl font-bold">{users.length}</p>
                <p className="text-xs text-gray-400">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">12.4k</p>
                <p className="text-xs text-gray-400">Total Messages</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>;

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage user={user} />} />
        
        {/* Protected Routes */}
        <Route path="/*" element={
          user ? (
            <div className="min-h-screen bg-gray-50 flex">
              {/* Sidebar */}
              <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
                <div className="p-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Bot className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">ChatFlow</span>
                </div>
                
                <nav className="flex-1 px-4 space-y-1">
                  <SidebarLink to="/dashboard" icon={Layout} label="Dashboard" />
                  <SidebarLink to="/chatbots" icon={Bot} label="My Chatbots" />
                  <SidebarLink to="/knowledge" icon={Database} label="Knowledge Base" />
                  <SidebarLink to="/billing" icon={CreditCard} label="Billing" />
                  <SidebarLink to="/settings" icon={Settings} label="Settings" />
                  {profile?.role === 'admin' && (
                    <SidebarLink to="/admin" icon={Shield} label="Admin Panel" />
                  )}
                </nav>

                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer" onClick={() => auth.signOut()}>
                    <img src={user.photoURL || ''} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <LogOut className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard profile={profile} />} />
                  <Route path="/chatbots/new" element={<ChatbotBuilder profile={profile} />} />
                  <Route path="/chatbots/:id/edit" element={<ChatbotBuilder profile={profile} isEdit />} />
                  <Route path="/chatbots/:id/chat" element={<ChatInterface profile={profile} />} />
                  <Route path="/knowledge" element={<KnowledgeBasePage profile={profile} />} />
                  <Route path="/billing" element={<BillingPage profile={profile} />} />
                  <Route path="/settings" element={<SettingsPage profile={profile} />} />
                  <Route path="/admin" element={<AdminPanel profile={profile} />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

const SidebarLink = ({ to, icon: Icon, label }: any) => (
  <Link 
    to={to} 
    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all group"
  >
    <Icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
    {label}
  </Link>
);

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
