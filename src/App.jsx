import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  MoreVertical,
  Activity,
  Coffee,
  ShoppingBag,
  Home,
  User,
  LogOut,
  Target,
  BarChart3,
  CreditCard,
  Briefcase,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2026-04-01', amount: 3500, category: 'Salary', type: 'income', title: 'TechCorp Monthly Salary' },
  { id: 2, date: '2026-04-02', amount: 45, category: 'Food', type: 'expense', title: 'Starbucks Coffee' },
  { id: 3, date: '2026-04-03', amount: 120, category: 'Shopping', type: 'expense', title: 'Amazon - Electronics' },
  { id: 4, date: '2026-04-04', amount: 800, category: 'Rent', type: 'expense', title: 'Monthly Studio Rent' },
  { id: 5, date: '2026-04-05', amount: 1500, category: 'Project Bonus', type: 'income', title: 'Freelance Design Project' },
  { id: 6, date: '2026-04-05', amount: 60, category: 'Transport', type: 'expense', title: 'Uber Ride - Airport' },
  { id: 7, date: '2026-04-06', amount: 200, category: 'Entertainment', type: 'expense', title: 'Steam - Game Purchase' },
  { id: 8, date: '2026-04-01', amount: 250, category: 'Investments', type: 'income', title: 'Dividend Payout' },
  { id: 9, date: '2026-04-05', amount: 15.99, category: 'Subscriptions', type: 'expense', title: 'Spotify Premium' },
  { id: 10, date: '2026-04-06', amount: 8.99, category: 'Subscriptions', type: 'expense', title: 'Netflix Standard' },
];

const MONTHLY_DATA = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
];

const PORTFOLIO_DATA = [
  { name: 'Stocks', value: 12500, change: '+5.2%', icon: Briefcase },
  { name: 'Crypto', value: 4200, change: '-2.1%', icon: Wallet },
  { name: 'Real Estate', value: 45000, change: '+1.5%', icon: Home },
  { name: 'Cash', value: 3775, change: '0.0%', icon: Wallet },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// --- SHARED COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    className={`nav-item ${active ? 'active' : ''}`} 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      color: active ? 'var(--primary)' : 'inherit',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      fontWeight: active ? '600' : '400',
      transition: 'all 0.2s',
      marginBottom: '0.25rem'
    }}
  >
    <Icon size={20} />
    <span>{label}</span>
  </div>
);

const ViewWrapper = ({ children, title, subtitle, actions }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
      <div>
        <h1>{title}</h1>
        <p className="text-muted">{subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {actions}
      </div>
    </header>
    {children}
  </motion.div>
);

const ProgressLine = ({ label, current, total, color }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
      <span style={{ fontWeight: '500' }}>{label}</span>
      <span className="text-muted">${current.toLocaleString()} / ${total.toLocaleString()}</span>
    </div>
    <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
       <motion.div 
         initial={{ width: 0 }} 
         animate={{ width: `${(current/total)*100}%` }} 
         transition={{ duration: 1, ease: 'easeOut' }}
         style={{ height: '100%', background: color, borderRadius: '10px' }} 
       />
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [role, setRole] = useState('Admin'); 
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Computed Values
  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.keys(categories).map(name => ({ name, value: categories[name] }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    }).sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, filterType]);

  const highestCategory = useMemo(() => {
    if (categoryData.length === 0) return 'N/A';
    return categoryData.sort((a, b) => b.value - a.value)[0].name;
  }, [categoryData]);

  // Handlers
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (role !== 'Admin') return;
    const form = e.target;
    const newTx = {
      id: Date.now(),
      title: form.title.value,
      amount: parseFloat(form.amount.value),
      category: form.category.value,
      type: form.type.value,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions([newTx, ...transactions]);
    setIsAddModalOpen(false);
    form.reset();
  };

  const handleDelete = (id) => {
    if (role !== 'Admin') {
      alert("Permission denied. Admin role required.");
      return;
    }
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // --- RENDERING VIEWS ---

  const renderDashboard = () => (
    <ViewWrapper 
      title="Good morning, Anish!" 
      subtitle="Here's what's happening with your finances today."
      actions={role === 'Admin' && (
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} /> Add Transaction
        </button>
      )}
    >
      <div className="dashboard-grid">
        <div className="card glass">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Balance</p>
          <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${totals.balance.toLocaleString()}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem' }}>
            <TrendingUp size={16} /> <span>+12.5% from last month</span>
          </div>
        </div>
        <div className="card glass">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Monthly Income</p>
          <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--secondary)' }}>${totals.income.toLocaleString()}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem' }}>
            <ArrowUpRight size={16} /> <span>+4.2%</span>
          </div>
        </div>
        <div className="card glass">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Monthly Expenses</p>
          <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--accent)' }}>${totals.expenses.toLocaleString()}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.875rem' }}>
            <ArrowDownLeft size={16} /> <span>-2.1%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass" style={{ height: '350px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Balance Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={transactions.map((t, i) => ({ name: t.date, balance: totals.balance - (i * 100) }))}>
              <defs><linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient></defs>
              <Tooltip />
              <Area type="monotone" dataKey="balance" stroke="var(--primary)" fill="url(#colorBal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card glass" style={{ height: '350px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Spending Distribution</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                {categoryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>Recent Transactions</h3>
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none' }} />
        </div>
        <div className="table-container">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Amount</th><th>Type</th>{role==='Admin'&&<th>Action</th>}</tr></thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.title}</td><td>{tx.category}</td><td style={{fontWeight:'bold'}}>${tx.amount}</td>
                  <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                  {role==='Admin'&&<td><button onClick={()=>handleDelete(tx.id)} style={{border:'none',background:'transparent',color:'var(--accent)',cursor:'pointer'}}>Delete</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ViewWrapper>
  );

  const renderAnalytics = () => (
    <ViewWrapper title="Analytics" subtitle="Deep dive into your financial performance.">
       <div className="dashboard-grid">
          <div className="card glass" style={{ height: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Monthly Comparison</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card glass">
             <h3>Cash Flow Index</h3>
             <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>0.85</h1>
                <p className="text-muted">Your income-to-expense ratio is healthy. You're saving on average 15% of your income.</p>
             </div>
          </div>
       </div>
    </ViewWrapper>
  );

  const renderPortfolio = () => (
    <ViewWrapper title="Portfolios" subtitle="Manage your assets and investments.">
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {PORTFOLIO_DATA.map((asset, i) => (
          <div key={i} className="card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <asset.icon size={24} color="var(--primary)" />
              <span style={{ color: asset.change.startsWith('+') ? 'var(--secondary)' : 'var(--accent)', fontWeight: 'bold' }}>{asset.change}</span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{asset.name}</p>
            <h2 style={{ fontSize: '1.5rem' }}>${asset.value.toLocaleString()}</h2>
          </div>
        ))}
      </div>
      <div className="card glass" style={{ marginTop: '2rem' }}>
        <h3>Asset Allocation</h3>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Diversification helps minimize risk.</p>
        <div style={{ display: 'flex', gap: '0.5rem', height: '40px', borderRadius: '10px', overflow: 'hidden' }}>
           <div style={{ width: '60%', background: COLORS[0] }} />
           <div style={{ width: '20%', background: COLORS[1] }} />
           <div style={{ width: '15%', background: COLORS[2] }} />
           <div style={{ width: '5%', background: COLORS[3] }} />
        </div>
      </div>
    </ViewWrapper>
  );

  const renderCards = () => (
    <ViewWrapper title="My Cards" subtitle="Manage your physical and virtual payment methods.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
          padding: '2rem', 
          borderRadius: '20px', 
          color: 'white',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.4)'
        }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Wallet size={32} />
              <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>VISA</span>
           </div>
           <h3 style={{ fontSize: '1.5rem', letterSpacing: '4px' }}>•••• •••• •••• 4291</h3>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><p style={{ fontSize: '0.7rem', opacity: 0.8 }}>CARD HOLDER</p><p>ANISH PRAJAPATI</p></div>
              <div><p style={{ fontSize: '0.7rem', opacity: 0.8 }}>EXPIRES</p><p>12/28</p></div>
           </div>
        </div>

        <div className="card glass" style={{ border: '2px dashed var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
           <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '50%' }}>
              <Plus size={32} />
           </div>
           <p style={{ fontWeight: '600' }}>Add New Card</p>
        </div>
      </div>
    </ViewWrapper>
  );

  const renderGoals = () => (
    <ViewWrapper title="Financial Goals" subtitle="Stay on track with your long-term objectives.">
       <div className="dashboard-grid">
         <div className="card glass">
            <h3>Active Goals</h3>
            <div style={{ marginTop: '1.5rem' }}>
               <ProgressLine label="New Tesla Model 3" current={25000} total={45000} color="var(--primary)" />
               <ProgressLine label="Vacation in Japan" current={4200} total={5000} color="var(--secondary)" />
               <ProgressLine label="Emergency Fund" current={8000} total={10000} color="var(--accent)" />
               <ProgressLine label="Custom PC Setup" current={1200} total={2500} color="#f59e0b" />
            </div>
         </div>
         <div className="card glass">
            <h3>Recent Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
               {[
                 { title: 'Emergency Fund 80%', date: 'Today', icon: CheckCircle2, color: 'var(--secondary)' },
                 { title: 'Tesla Goal Started', date: '2 days ago', icon: Clock, color: 'var(--primary)' },
                 { title: 'Japan Trip 50%', date: 'Last week', icon: CheckCircle2, color: 'var(--secondary)' }
               ].map((m, i) => (
                 <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: m.color }}><m.icon size={20} /></div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{m.title}</p><p className="text-muted" style={{ fontSize: '0.8rem' }}>{m.date}</p></div>
                    <ChevronRight size={16} className="text-muted" />
                 </div>
               ))}
            </div>
         </div>
       </div>
    </ViewWrapper>
  );

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <aside className="sidebar glass">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}><Wallet color="white" /></div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>FinanceFlow</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'Dashboard'} onClick={() => setCurrentView('Dashboard')} />
          <NavItem icon={Activity} label="Analytics" active={currentView === 'Analytics'} onClick={() => setCurrentView('Analytics')} />
          <NavItem icon={Briefcase} label="Portfolios" active={currentView === 'Portfolios'} onClick={() => setCurrentView('Portfolios')} />
          <NavItem icon={CreditCard} label="Cards" active={currentView === 'Cards'} onClick={() => setCurrentView('Cards')} />
          <NavItem icon={Target} label="Goals" active={currentView === 'Goals'} onClick={() => setCurrentView('Goals')} />
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn glass" onClick={toggleDarkMode} style={{ padding: '0.5rem', justifyContent: 'center' }}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span style={{ marginLeft: '10px' }}>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
          
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '12px' }}>
             <p className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>SYSTEM ROLE</p>
             <select value={role} onChange={(e) => setRole(e.target.value)} style={{ border: 'none', background: 'transparent', fontWeight: '700', color: 'inherit', cursor: 'pointer', outline: 'none' }}>
                <option value="Admin">ADMIN</option>
                <option value="Viewer">VIEWER</option>
             </select>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentView === 'Dashboard' && renderDashboard()}
          {currentView === 'Analytics' && renderAnalytics()}
          {currentView === 'Portfolios' && renderPortfolio()}
          {currentView === 'Cards' && renderCards()}
          {currentView === 'Goals' && renderGoals()}
        </AnimatePresence>
      </main>

      {/* Admin Marker */}
      <div className="role-badge">
        ACTIVE: {role}
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }} onClick={() => setIsAddModalOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card glass" style={{ width: '400px' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginBottom: '1.5rem' }}>New Transaction</h2>
              <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input name="title" required placeholder="Description" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', color: 'inherit' }} />
                <input name="amount" required type="number" placeholder="Amount" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', color: 'inherit' }} />
                <input name="category" required placeholder="Category (e.g. Food)" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', color: 'inherit' }} />
                <select name="type" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', color: 'inherit' }}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Save Transaction</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
