import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Mail, Lock, User, Sparkles, ArrowRight, ArrowLeft,
  Briefcase, Laptop, Code2, Shield, Heart, Star, Check 
} from 'lucide-react';
import { UserProfile } from '../types';
import { getSavedUsers, saveUsers } from '../data';

interface AuthPageProps {
  onLogin: (user: UserProfile) => void;
  showToast: (text: string, type: 'success' | 'error') => void;
}

export default function AuthPage({ onLogin, showToast }: AuthPageProps) {
  // Phase of Login: 'choice' (Initial two cards Selector) or 'form' (Selected role credentials)
  const [phase, setPhase] = useState<'choice' | 'form'>('choice');
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer'>('client');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  
  // Custom freelancer-specific inputs
  const [hourlyRate, setHourlyRate] = useState('60');
  const [skillsSelected, setSkillsSelected] = useState<string[]>(['React', 'TypeScript', 'Tailwind CSS']);

  const availableSkills = [
    'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 
    'Node.js', 'UI Design', 'Stripe API', 'Python', 'PostgreSQL'
  ];

  const handleSelectRole = (role: 'client' | 'freelancer') => {
    setSelectedRole(role);
    setPhase('form');
    // Pre-populate some clean defaults for registration screen if needed
    setEmail('');
    setPassword('');
    setFullName('');
    setBio(role === 'client' 
      ? 'Product Strategist hiring elite talent' 
      : 'Mid-Senior systems developer and interface designer'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast('Please enter both your email address and password.', 'error');
      return;
    }

    const allUsers = getSavedUsers();

    if (activeTab === 'signin') {
      // Find user with matching credentials
      const matched = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (matched) {
        // Enforce role consistency for logging in under that pathway, or allow profile adaptation
        if (matched.role !== selectedRole) {
          showToast(`This account is registered as a ${matched.role}. Signing you in with your registered role!`, 'success');
        } else {
          showToast(`Welcome back, ${matched.name}!`, 'success');
        }
        onLogin(matched);
      } else {
        showToast('Invalid custom credentials. Please check your credentials or register a new profile.', 'error');
      }
    } else {
      // Sign up process
      if (!fullName.trim()) {
        showToast('Please enter your full name.', 'error');
        return;
      }

      // Check if email already exists
      const emailExists = allUsers.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (emailExists) {
        showToast('This email is already registered. Please sign in instead.', 'error');
        return;
      }

      const generatedId = `usr-${Date.now()}`;
      
      const newProfile: UserProfile = {
        id: generatedId,
        name: fullName.trim(),
        email: email.trim(),
        password: password,
        avatar: selectedRole === 'client'
          ? `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150` // Client avatar style
          : `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150`, // Freelancer avatar style
        role: selectedRole,
        bio: bio.trim() || `Professional ${selectedRole === 'client' ? 'client' : 'freelancer'} ready to build modern digital products.`,
        rating: 5.0,
        completedJobsCount: 0,
        ...(selectedRole === 'client' 
          ? { totalSpent: 0 } 
          : { 
              totalEarnings: 0, 
              skills: skillsSelected, 
              hourlyRate: Number(hourlyRate) || 60 
            }
        )
      };

      const updatedUsers = [...allUsers, newProfile];
      saveUsers(updatedUsers);
      showToast(`Account successfully initiated! Welcome aboard, ${newProfile.name}.`, 'success');
      onLogin(newProfile);
    }
  };

  const handleQuickLogin = (userEmail: string) => {
    const allUsers = getSavedUsers();
    const matched = allUsers.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (matched) {
      onLogin(matched);
      showToast(`Instant login successful: welcome back, ${matched.name}!`, 'success');
    } else {
      showToast('Could not load cached seed user.', 'error');
    }
  };

  const toggleSkill = (skill: string) => {
    if (skillsSelected.includes(skill)) {
      setSkillsSelected(skillsSelected.filter(s => s !== skill));
    } else {
      setSkillsSelected([...skillsSelected, skill]);
    }
  };

  // Get users of currently active form role to present in "One-Click Quick Login" list
  const currentRoleSeedUsers = getSavedUsers().filter(u => u.role === selectedRole);

  return (
    <div id="auth-page-container" className="min-h-screen w-full flex items-center justify-center bg-white text-slate-800 relative overflow-hidden px-4 py-8 select-none">
      
      {/* Premium Ambient Backdrops */}
      <div className="absolute top-1/6 left-1/5 w-[380px] h-[380px] bg-blue-500/5 rounded-full blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/6 right-1/5 w-[340px] h-[340px] bg-sky-450/5 rounded-full blur-[130px] animate-pulse pointer-events-none" />

      <AnimatePresence mode="wait">
        {phase === 'choice' ? (
          /* CHOICE STAGE: Continue as Client or Freelancer */
          <motion.div
            key="role-choice-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl space-y-8 z-10 text-center"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">SaaS Marketplace Portal</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Collaborate without limits
              </h1>
              <p className="text-[#475569] text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                Connect with pre-vetted digital professionals or deploy your enterprise requirements into active bid streams.
              </p>
            </div>

            {/* The Dual Role Choice Card Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-4">
              
              {/* CLIENT CARD */}
              <motion.div
                id="select-client-card"
                whileHover={{ scale: 1.025, translateY: -4 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleSelectRole('client')}
                className="bg-white border border-slate-200 hover:border-blue-500/50 rounded-2xl p-6 shadow-md hover:shadow-lg cursor-pointer text-left transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-blue-550/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 border border-blue-200 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <Briefcase className="h-6 w-6 text-blue-500 group-hover:text-white" />
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                  Continue as Client
                  <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Hire digital development experts, set budgets, evaluate secure bids, and coordinate workspace milestones.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <Shield className="h-3.5 w-3.5 text-blue-500 fill-blue-500/5" />
                  <span>Verified Client Dashboard</span>
                </div>
              </motion.div>

              {/* FREELANCER CARD */}
              <motion.div
                id="select-freelancer-card"
                whileHover={{ scale: 1.025, translateY: -4 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleSelectRole('freelancer')}
                className="bg-white border border-slate-200 hover:border-sky-505/50 rounded-2xl p-6 shadow-md hover:shadow-lg cursor-pointer text-left transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-sky-550/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors pointer-events-none" />
                
                <div className="h-12 w-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 border border-sky-200 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  <Laptop className="h-6 w-6 text-sky-500 group-hover:text-white" />
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                  Continue as Freelancer
                  <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Submit bids, list your developer skills, quote competitive hourly rates, and earn verified project scores.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <Code2 className="h-3.5 w-3.5 text-sky-500 fill-sky-500/5" />
                  <span>Developer Sandbox Hub</span>
                </div>
              </motion.div>

            </div>

            <p className="text-[10px] text-slate-400 font-mono max-w-sm mx-auto">
              Selected roles can still be switched instantly inside the sandbox environment workspace dashboard.
            </p>
          </motion.div>
        ) : (
          /* FORM STAGE: Login / Sign Up with customizable options */
          <motion.div
            key="auth-interactive-registration"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl z-10 relative overflow-hidden"
          >
            {/* Header / Nav Back Segment */}
            <div className="flex items-center justify-between mb-6">
              <button
                id="auth-go-back-btn"
                type="button"
                onClick={() => setPhase('choice')}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to roles
              </button>
              
              <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-mono border border-blue-100 text-blue-600 capitalize">
                {selectedRole === 'client' ? (
                  <span className="flex items-center gap-1 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Client Track
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                    Freelancer Track
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                {selectedRole === 'client' ? 'Client Workspace Sign-In' : 'Freelancer Portal Sign-In'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {selectedRole === 'client' 
                  ? 'Manage projects and evaluate incoming developer proposals.' 
                  : 'Pitch to active job lists and track hourly rates.'}
              </p>
            </div>

            {/* Custom Tab selectors: Login vs Sign Up */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl mb-6">
              <button
                id="tab-signin-btn"
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-signup-btn"
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Conditional Fields for Registration */}
              {activeTab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                      Full Name / Showcase Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Catherine Vance"
                        className="w-full text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Professional Biography */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                      Professional Bio
                    </label>
                    <textarea
                      id="signup-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Expert in modern React app development..."
                      rows={2}
                      className="w-full text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-slate-800 resize-none placeholder-slate-400"
                    />
                  </div>

                  {/* Freelancer specific fields */}
                  {selectedRole === 'freelancer' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-4 pt-1"
                    >
                      {/* Hourly Rate */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                          Hourly rate (₹ per hour)
                        </label>
                        <input
                          id="signup-hourly-rate"
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="60"
                          className="w-full text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-505 focus:bg-white rounded-xl px-3.5 py-2.5 text-slate-800"
                        />
                      </div>

                      {/* Technical Skills selectors */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                          My Skills Set
                        </label>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                          {availableSkills.map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                                skillsSelected.includes(skill)
                                  ? 'bg-sky-500 border-sky-400 text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {skillsSelected.includes(skill) && <Check className="h-2.5 w-2.5 inline mr-1" />}
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. client@test.com"
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="signin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. test"
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <button
                id="auth-submit-btn"
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-extrabold uppercase tracking-widest text-white rounded-xl bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 shadow-sm hover:shadow active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                {activeTab === 'signin' ? 'Verify Credentials' : 'Register Account'}
              </button>

            </form>

            {/* Quick-Logins list explicitly relevant to the chosen pathway */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block text-center mb-3">
                Quick-Login Seed Profiles ({selectedRole} role)
              </span>

              <div id="quick-links-stack" className="space-y-2">
                {currentRoleSeedUsers.map((user) => (
                  <button
                    key={user.id}
                    id={`quick-login-${user.name.split(' ')[0]}`}
                    type="button"
                    onClick={() => handleQuickLogin(user.email)}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl p-2.5 flex items-center justify-between transition-all duration-200 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-7 w-7 rounded-lg object-cover ring-2 ring-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="block text-xs font-bold text-slate-800">{user.name}</span>
                        <span className="block text-[9px] text-slate-400 font-mono">
                          {user.email} / password: <span className="font-bold text-blue-500">test</span>
                        </span>
                      </div>
                    </div>
                    
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      Log In
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
