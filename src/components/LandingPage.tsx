import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ArrowRight, Briefcase, Star, Users, 
  IndianRupee, Zap, Check, Award, LineChart, Terminal
} from 'lucide-react';
import { Project } from '../types';

interface LandingPageProps {
  projects: Project[];
  onGetStarted: () => void;
  onExploreActive: () => void;
}

export default function LandingPage({ projects, onGetStarted, onExploreActive }: LandingPageProps) {
  const [showcaseRole, setShowcaseRole] = useState<'client' | 'freelancer'>('client');

  const totalActive = projects.filter(p => p.status === 'active').length;
  const totalInvestment = projects.reduce((acc, p) => acc + p.budget, 0);

  // Key stats highlights (Light mode optimized, matching metrics prompt)
  const stats = [
    { label: 'ACTIVE PROJECTS', value: `${totalActive || 3} ACTIVE PROJECTS`, icon: Briefcase, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'TOTAL CAPITAL POOL', value: totalInvestment > 0 ? `₹${(totalInvestment / 1000).toFixed(0)}k+` : '₹245k+', icon: IndianRupee, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'EXPERT DEVELOPERS', value: '47+ DEVELOPERS', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { label: 'AVG RATING', value: 'AVG RATING 4.9★', icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-50' }
  ];

  const clientSteps = [
    { title: 'Publish Requirements', desc: 'Define your tech stack, scope of work, and Indian Rupee budget range in seconds.' },
    { title: 'Receive Elite Bids', desc: 'Vetted, high-scoring freelance developers place custom proposed milestone bids.' },
    { title: 'Optimize & Collide', desc: 'Accept bids, write in our live chat, and review completed deliverables instantly.' }
  ];

  const freelancerSteps = [
    { title: 'Curate Professional Profile', desc: 'Register your special skill badges, set custom hourly rate limits, and build trust.' },
    { title: 'Slick Interactive Pitching', desc: 'Submit custom proposals matching specific client budgets and targets.' },
    { title: 'Deliver & Build Score', desc: 'Secure project assignments, communicate, and receive glowing feedback reviews.' }
  ];

  return (
    <div id="landing-root" className="min-h-screen bg-white text-slate-800 flex flex-col relative overflow-hidden select-none font-sans">
      
      {/* 1. SOLID PURE WHITE BACKGROUND REPLACING GRID LINES */}
      <div className="absolute inset-0 bg-white pointer-events-none z-0" />
      
      {/* Subtle background highlight gradients for interest */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-sky-400/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 2. HEADER NAVIGATION BAR */}
      <header id="landing-navbar" className="relative z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 md:px-8 py-4 sticky top-0 flex items-center justify-between">
        {/* Left Side: Logo & Tagline with strict horizontal alignment */}
        <div className="flex items-baseline gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-sky-400 flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-sans font-black tracking-tight text-sm text-slate-900 leading-none" >
              F R E E L A N C EHUB 
            </span>
          </div>
         
        </div>

        {/* Center: Navigation links with balanced 32px (gap-8) space */}
        <nav className="hidden md:flex items-center gap-8 text-xs text-slate-500 font-semibold select-none">
          <a href="#features-deck" className="hover:text-blue-600 transition-colors">Key Features</a>
          <a href="#sandbox-demonstrator" className="hover:text-blue-600 transition-colors">Role Sandbox</a>
          <a href="#live-pipeline-ticker" className="hover:text-blue-600 transition-colors">Public Job Board</a>
          <a href="#expert-endorsements" className="hover:text-blue-600 transition-colors">Ecosystem Trust</a>
        </nav>

        {/* Right Side: Prominent Light Blue Pill Button */}
        <button
          id="landing-nav-cta"
          onClick={onGetStarted}
          className="bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white font-extrabold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          GO TO APP <ArrowRight className="h-3 w-3" />
        </button>
      </header>

      {/* 3. HERO SHOWCASE STAGE */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-4 md:px-8 pt-16 md:pt-20 pb-12 text-center">
        
        {/* Catalyst Sandbox Pill Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full shadow-sm mb-6.5 hover:border-blue-200 transition-colors"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-duration-1000"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
            CATALYST SANDBOX V2.4 | FULLY FUNCTIONAL LIVE BID SIMULATOR
          </span>
        </motion.div>

        {/* Headline: Extra Bold Dark Charcoal Navy, Stacked into Three Lines */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-[#0F172A] max-w-4xl mx-auto"
        >
          Your ideas.<br />
          My execution.<br />
          Limitless possibilities.
        </motion.h1>

        {/* Subheadline Paragraph: slate gray with Mt-6 (24px) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#475569] text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          A highly visual, lightning-fast workspace dashboard built to bridge developers and clients. Create project grids rich with skill tags, submit Rupees-denominated bid structures, and engage with our reactive AI Sidecar Companion.
        </motion.p>

        {/* Perfectly Symmetrical Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 max-w-md mx-auto"
        >
          <button
            id="hero-cta-launch"
            onClick={onGetStarted}
            className="w-full sm:w-48 h-12 bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-650 hover:from-blue-600 hover:to-sky-500 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            LAUNCH DASHBOARD →
          </button>
          
          <button
            id="hero-cta-explore"
            onClick={onExploreActive}
            className="w-full sm:w-48 h-12 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-extrabold uppercase tracking-widest text-xs rounded-xl transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            EXPLORE ACTIVE FEED ({totalActive || 3})
          </button>
        </motion.div>

        {/* 4. BOTTOM FEATURE CARDS CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 max-w-3xl mx-auto text-left"
        >
          {/* Card 1: INTERVIEW SANDBOX */}
          <div className="bg-slate-50/50 border border-slate-200/95 p-6 rounded-2xl flex gap-4 hover:border-blue-300 hover:bg-white transition-all duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-105 border-blue-100 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Award className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9px] bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded tracking-wide leading-none font-mono">
                  NEW CORE SERVICE
                </span>
                <h4 className="text-xs font-black text-slate-900 tracking-wider font-mono">
                  INTERVIEW SANDBOX
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                A tool allowing clients to test freelancers with live, pre-hire technical challenges to ensure job perfection before committing milestone trust.
              </p>
            </div>
          </div>

          {/* Card 2: REAL-TIME PROGRESS RADAR */}
          <div className="bg-slate-50/50 border border-slate-200/95 p-6 rounded-2xl flex gap-4 hover:border-purple-300 hover:bg-white transition-all duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <LineChart className="h-4.5 w-4.5 animate-pulse group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9px] bg-purple-100 text-purple-800 font-black px-1.5 py-0.5 rounded tracking-wide leading-none font-mono">
                  FEATURE STANDARD
                </span>
                <h4 className="text-xs font-black text-slate-900 tracking-wider font-mono">
                  REAL-TIME PROGRESS RADAR
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                A feature mandating freelancers to provide frequent, structured micro-updates, check-ins, and step logs directly on the global interactive card pipeline.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 5. METRICS BAR WITH SOFT BORDERS & PURE STYLING */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.42 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto bg-slate-50/50 border border-slate-200/90 rounded-2xl p-5 text-left divide-y md:divide-y-0 md:divide-x divide-slate-200"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`p-4 first:pt-0 md:first:pt-4 md:p-5 ${idx >= 2 ? 'pt-4 md:pt-5' : ''}`}>
                <div className="flex items-center gap-2 text-slate-600 mb-1.5">
                  <div className={`h-6 w-6 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  </div>
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500 leading-none">
                    {stat.label}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 font-sans tracking-tight block">
                   {stat.value}
                </span>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* 6. KEY BENTO FEATURES DECK */}
      <section id="features-deck" className="bg-slate-50/50 border-t border-b border-slate-200/90 py-16 px-4 md:px-8 relative z-10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">PREMIUM PLATFORM BLUEPRINT</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              A meticulously engineered workspace
            </h2>
            <p className="text-xs text-slate-555 text-slate-500 mt-2">
              Every detail is calibrated to support intuitive project visualization, fluid bid coordination, and custom sandbox capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Bento Card */}
            <div className="bg-white border border-slate-200 hover:border-blue-400/30 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">High Fidelity Project Cards</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Visual cards featuring real-time project metrics, beautiful system avatars, detailed development milestones, specific skills, and inbound proposals.
              </p>
            </div>

            {/* Feature 2: Bento Card */}
            <div className="bg-white border border-slate-200 hover:border-purple-400/30 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-4">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Catalyst Sidecar Assistant</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                An embedded smart companion equipped with full knowledge of active sandbox pipelines to inspect budgets, suggest tags, and review custom terms.
              </p>
            </div>

            {/* Feature 3: Bento Card */}
            <div className="bg-white border border-slate-200 hover:border-emerald-400/30 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Instant Milestones Settlement</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Evaluate bids instantly! Accept or decline proposals in one click to automatically shift project statuses from accepting offers to active code building.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE ROLE DEMONSTRATOR */}
      <section id="sandbox-demonstrator" className="py-16 px-4 md:px-8 max-w-6xl mx-auto relative z-10 scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-4">
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider font-mono">Dual Role Interactive Simulator</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              One Unified Core. Two Immersive Perspectives.
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We did not build empty mockups. FreelanceHub features fully integrated client and freelancer dashboard flows, allowing you to alternate perspectives instantly.
            </p>

            {/* Selector Buttons */}
            <div className="flex gap-2 p-1.5 bg-slate-105 bg-slate-100 border border-slate-200 rounded-xl max-w-xs mt-4">
              <button
                type="button"
                onClick={() => setShowcaseRole('client')}
                className={`flex-1 py-2 px-3 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer ${
                  showcaseRole === 'client' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Client View
              </button>
              <button
                type="button"
                onClick={() => setShowcaseRole('freelancer')}
                className={`flex-1 py-2 px-3 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer ${
                  showcaseRole === 'freelancer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Freelancer View
              </button>
            </div>
          </div>

          {/* Right Workflow Column */}
          <div className="lg:col-span-12 xl:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm relative overflow-hidden min-h-[300px] flex flex-col justify-between">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-md ${
                  showcaseRole === 'client' ? 'text-blue-700 bg-blue-50' : 'text-purple-700 bg-purple-50'
                }`}>
                  Live {showcaseRole === 'client' ? 'Client' : 'Freelancer'} Workspace
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Simulation Flow</span>
              </div>

              <div className="space-y-4">
                {(showcaseRole === 'client' ? clientSteps : freelancerSteps).map((step, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <div className="h-6 w-6 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-6 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Configured & compiled locally
              </span>
              <button 
                onClick={onGetStarted}
                className="text-blue-600 hover:text-blue-700 font-extrabold transition-colors cursor-pointer flex items-center gap-1 inline-flex"
              >
                Interact Live <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. PUBLIC POSTINGS TICKER */}
      <section id="live-pipeline-ticker" className="bg-slate-50/50 py-16 px-4 md:px-8 border-t border-b border-slate-200 relative z-10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8.5 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider font-mono">LIVE INDEX PIPELINE</span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Public active project requirements
              </h2>
            </div>
            <div>
              <button 
                onClick={onGetStarted}
                className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
              >
                Publish yours here <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick list of real local projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 3).map((pj) => (
              <div key={pj.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-3">
                    <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      ₹{pj.budget.toLocaleString()} Range
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold font-mono">● Active</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{pj.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {pj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img src={pj.clientAvatar} alt={pj.clientName} className="h-5 w-5 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer" />
                    <span className="truncate max-w-[80px] font-medium text-slate-600">{pj.clientName}</span>
                  </div>
                  <span className="font-mono text-[9px] bg-slate-50 p-1 rounded border border-slate-100 text-slate-600">
                    {pj.skills[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. ECOSYSTEM TRUST & ACCREDITATION */}
      <section id="expert-endorsements" className="py-16 px-4 md:px-8 max-w-6xl mx-auto text-center relative z-10 scroll-mt-16">
        <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider font-mono">ECOSYSTEM TRUST</span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 mb-10">
          Hiring with absolute coordination
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Testimonial 1 */}
          <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl text-left flex flex-col justify-between hover:bg-white transition-colors">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "We coordinate entire high-fidelity redesign sprints through FreelanceHub Catalyst. Setting milestone bids in Rupees and inspecting reviews has simplified our developer pipelines considerably."
            </p>
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80" 
                alt="Sarah Jenkins" 
                className="h-8.5 w-8.5 rounded-full object-cover border border-slate-100" 
                referrerPolicy="no-referrer" 
              />
              <div>
                <span className="block text-xs font-bold text-slate-900">Sarah Jenkins</span>
                <span className="block text-[9px] font-mono text-slate-400">Design Lead, Apex Systems</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl text-left flex flex-col justify-between hover:bg-white transition-colors">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "As a developer, having full visibility into historical client reviews and direct control over hourly pricing matches perfectly with how sovereign digital professionals want to work."
            </p>
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" 
                alt="Alex Rivera" 
                className="h-8.5 w-8.5 rounded-full object-cover border border-slate-100" 
                referrerPolicy="no-referrer" 
              />
              <div>
                <span className="block text-xs font-bold text-slate-900">Alex Rivera</span>
                <span className="block text-[9px] font-mono text-slate-400">Senior React Engineer</span>
              </div>
            </div>
          </div>

        </div>

        {/* Closing conversion banner */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 mt-16 max-w-4xl mx-auto text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform" />
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Ready to experience FreelanceHub Catalyst?
          </h3>
          <p className="text-xs text-slate-500 mt-2.5 max-w-md mx-auto leading-relaxed">
            Enter the live workspace today. Access our state managers, place bids real-time, and trigger our interactive developer sandbox simulations.
          </p>
          <button
            id="landing-footer-cta-access"
            onClick={onGetStarted}
            className="mt-6 bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white font-extrabold uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer inline-flex items-center gap-2"
          >
            Enter Workspace Sandbox <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </section>

      {/* 10. LANDING FOOTER */}
      <footer className="mt-auto border-t border-slate-200 px-4 py-8 bg-slate-50 relative z-20 text-center font-mono text-[9px] text-slate-400">
        <p>© 2026 FreelanceHub Catalyst. Built with absolute typography pairing, React v18, and motion.</p>
        <p className="mt-1 text-slate-400">Equipped with active development sandbox monitors and Indian Rupee checkout streams.</p>
      </footer>

    </div>
  );
}
