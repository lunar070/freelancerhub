import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Project, UserProfile, Notification, Proposal, Review 
} from './types';
import { 
  getSavedProjects, saveProjects, 
  getSavedNotifications, saveNotifications
} from './data';
import Header from './components/Header';
import Metrics from './components/Metrics';
import ProjectForm from './components/ProjectForm';
import ProjectCard from './components/ProjectCard';
import FeedbackToast, { ToastMessage } from './components/FeedbackToast';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import { 
  Search, SlidersHorizontal, Sparkles, Server, 
  RefreshCw, Check, Star, Filter, Heart, ChevronRight, HelpCircle 
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('freelance_hub_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  // Active role sandbox state
  const [activeRole, setActiveRole] = useState<'client' | 'freelancer'>(() => {
    return (currentUser?.role) || 'client';
  });

  // Core Data Lists
  const [projects, setProjects] = useState<Project[]>(() => {
    return getSavedProjects();
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation Screen State
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    return !localStorage.getItem('freelance_hub_user');
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Load Initial Store
  useEffect(() => {
    setProjects(getSavedProjects());
    setNotifications(getSavedNotifications());
    
    // Auto sync role if user changes
    if (currentUser) {
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text,
      type
    };
    setToasts((prev) => [...prev, newToast]);
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(newToast.id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sign out handler
  const handleLogout = () => {
    localStorage.removeItem('freelance_hub_user');
    setCurrentUser(null);
    setShowLanding(true);
    showToast('Signed out of Sandbox session.', 'info');
  };

  // Switch role handler
  const handleRoleChange = (role: 'client' | 'freelancer') => {
    setActiveRole(role);
    showToast(`Pivoted workspace context to **${role === 'client' ? 'Client Dashboard' : 'Freelancer Portal'}**`, 'success');
  };

  // Adding Projects (Client Mode)
  const handleAddProject = (newProj: Omit<Project, 'id' | 'proposals' | 'reviews' | 'createdAt'>) => {
    const fullProj: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
      proposals: [],
      reviews: [],
      createdAt: new Date().toISOString()
    };

    const updated = [fullProj, ...projects];
    setProjects(updated);
    saveProjects(updated);

    // Create Notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Project Indexed Successfully',
      message: `Your project "${newProj.title}" has been published with other listings.`,
      type: 'new_project',
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);
  };

  // Submitting proposal bid (Freelancer Mode)
  const handleSubmitProposal = (
    projectId: string, 
    proposalData: Omit<Proposal, 'id' | 'projectId' | 'projectTitle' | 'freelancerName' | 'freelancerAvatar' | 'freelancerEmail' | 'status' | 'createdAt'>
  ) => {
    if (!currentUser) return;

    const targetProject = projects.find(p => p.id === projectId);
    if (!targetProject) return;

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      projectId,
      projectTitle: targetProject.title,
      freelancerName: currentUser.name,
      freelancerAvatar: currentUser.avatar,
      freelancerEmail: currentUser.email,
      bidAmount: proposalData.bidAmount,
      timelineDays: proposalData.timelineDays,
      coverLetter: proposalData.coverLetter,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          proposals: [newProposal, ...p.proposals]
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    // Client Inbound Notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Inbound Bid Received',
      message: `${currentUser.name} placed a bid of ₹${proposalData.bidAmount.toLocaleString()} for "${targetProject.title}".`,
      type: 'proposal',
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);
  };

  // Accept proposal bid (Client Mode)
  const handleAcceptProposal = (projectId: string, proposalId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const proposalsUpdated = p.proposals.map(pr => {
          if (pr.id === proposalId) {
            return { ...pr, status: 'accepted' as const };
          }
          return { ...pr, status: 'declined' as const };
        });

        return {
          ...p,
          status: 'assigned' as const,
          proposals: proposalsUpdated
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    // Fetch details for toast / notification
    const targetProj = projects.find(p => p.id === projectId);
    const targetProp = targetProj?.proposals.find(pr => pr.id === proposalId);

    if (targetProp) {
      showToast(`Accepted bid from ${targetProp.freelancerName}! Project assigned.`, 'success');

      // Notify Freelancer
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        title: 'Bid Accepted!',
        message: `Catherine Vance accepted your proposal for "${targetProj?.title}". Code pipelines are now ready.`,
        type: 'status_change',
        read: false,
        createdAt: new Date().toISOString()
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      saveNotifications(updatedNotifs);
    }
  };

  // Decline proposal bid (Client Mode)
  const handleDeclineProposal = (projectId: string, proposalId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const proposalsUpdated = p.proposals.map(pr => {
          if (pr.id === proposalId) {
            return { ...pr, status: 'declined' as const };
          }
          return pr;
        });

        return {
          ...p,
          proposals: proposalsUpdated
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    showToast('Proposal declined.', 'info');
  };

  // Invite to interview (Client Mode)
  const handleInviteToInterview = (
    projectId: string,
    proposalId: string,
    dateTime: string,
    platform: string,
    notes?: string
  ) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const proposalsUpdated = p.proposals.map(pr => {
          if (pr.id === proposalId) {
            return {
              ...pr,
              status: 'interviewing' as const,
              interviewDetails: { dateTime, platform, notes }
            };
          }
          return pr;
        });

        return {
          ...p,
          proposals: proposalsUpdated
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    // Create a notification for the freelancer
    const targetProj = projects.find(p => p.id === projectId);
    const targetProp = targetProj?.proposals.find(pr => pr.id === proposalId);

    if (targetProp) {
      showToast(`Interview scheduled with ${targetProp.freelancerName}!`, 'success');

      const notif: Notification = {
        id: `notif-${Date.now()}`,
        title: 'Interview Scheduled!',
        message: `${currentUser?.name || 'Catherine Vance'} invited you to interview for "${targetProj?.title}" on ${new Date(dateTime).toLocaleString()} via ${platform}.`,
        type: 'status_change',
        read: false,
        createdAt: new Date().toISOString()
      };
      
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      saveNotifications(updatedNotifs);
    }
  };

  // Leaving workspace reviews (Both roles)
  const handleAddReview = (
    projectId: string, 
    reviewData: Omit<Review, 'id' | 'projectId' | 'reviewerName' | 'reviewerAvatar' | 'createdAt'>
  ) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      projectId,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    };

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          reviews: [newReview, ...p.reviews]
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    // Log review notification
    const pTitle = projects.find(p => p.id === projectId)?.title || '';
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Workspace Review Logged',
      message: `${currentUser.name} logged a review on "${pTitle}".`,
      type: 'review',
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);
  };

  // Notification actions
  const handleMarkNotifRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearNotifs = () => {
    setNotifications([]);
    saveNotifications([]);
    showToast('Cleared notifications registry.', 'info');
  };

  // Reset local database completely to default seeds
  const handleEmergencyWipe = () => {
    localStorage.removeItem('freelance_hub_projects');
    localStorage.removeItem('freelance_hub_notifications');
    setProjects(getSavedProjects());
    setNotifications(getSavedNotifications());
    showToast('Database reset to premium seed defaults.', 'success');
  };

  // Trigger simulated bid payload for testing
  const handleSimulateBid = () => {
    if (projects.length === 0) {
      showToast('No active projects available to attach a bid to.', 'error');
      return;
    }
    const firstActive = projects[0];
    const artificialBid: Proposal = {
      id: `prop-art-${Date.now()}`,
      projectId: firstActive.id,
      projectTitle: firstActive.title,
      freelancerName: 'Sarah Jenkins (Simulated)',
      freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      freelancerEmail: 'sarah@jenk.com',
      bidAmount: firstActive.budget - 250,
      timelineDays: 5,
      coverLetter: 'Hi, I saw your proposal listing. I have extensive experience with matching tools, animations, and high fidelity dashboard layouts. Let me configure premium features in 5 days!',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = projects.map(p => {
      if (p.id === firstActive.id) {
        return { ...p, proposals: [artificialBid, ...p.proposals] };
      }
      return p;
    });

    setProjects(updated);
    saveProjects(updated);

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Simulated Inbound Proposal',
      message: `Sarah Jenkins bids ₹${artificialBid.bidAmount.toLocaleString()} on "${firstActive.title}".`,
      type: 'proposal',
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);
    showToast(`Triggered simulated bid on project: "${firstActive.title}"! Check notifications.`, 'success');
  };

  // Filter project lists
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkill ? p.skills.includes(selectedSkill) : true;
    return matchesSearch && matchesSkill;
  });

  // Extract all unique skills across all projects for easy badge filtering
  const allAvailableSkillsSet = new Set<string>();
  projects.forEach(p => p.skills.forEach(s => allAvailableSkillsSet.add(s)));
  const uniqueSkillsList = Array.from(allAvailableSkillsSet);

  // Core Login Setup Screen
  if (!currentUser) {
    if (showLanding) {
      return (
         <div id="app-root-landing" className="min-h-screen bg-slate-950">
           <LandingPage
             projects={projects}
             onGetStarted={() => setShowLanding(false)}
             onExploreActive={() => setShowLanding(false)}
           />
           <FeedbackToast toasts={toasts} onClose={removeToast} />
         </div>
      );
    }

    return (
      <div id="app-root-login">
        {/* Support going back to landing page */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-[10px] font-bold bg-slate-900/60 hover:bg-slate-850/60 border border-slate-800/60 px-3 py-1.5 rounded-xl cursor-pointer transition-all select-none uppercase tracking-widest"
          >
            ← Back to Intro
          </button>
        </div>
        <AuthPage 
          onLogin={(user) => {
            setCurrentUser(user);
            localStorage.setItem('freelance_hub_user', JSON.stringify(user));
          }} 
          showToast={showToast} 
        />
        <FeedbackToast toasts={toasts} onClose={removeToast} />
      </div>
    );
  }

  return (
    <div id="dashboard-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none pb-12">
      
      {/* Premium Integrated Header Component */}
      <Header
        currentUser={currentUser}
        notifications={notifications}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        onLogout={handleLogout}
        onMarkNotificationRead={handleMarkNotifRead}
        onClearNotifications={handleClearNotifs}
      />

      {/* Main Container Stage */}
      <main id="main-content-layout" className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        
        {/* Dynamic Welcome Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, {currentUser.name}! 
              <Sparkles className="h-5 w-5 text-blue-500 fill-blue-500/20 animate-pulse hidden sm:inline" />
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              You are signed in as <span className="text-blue-600 font-bold capitalize">{activeRole}</span>. Pivoting layouts can be done in real time.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-205 px-4.5 py-2.5 rounded-2xl shadow-sm text-right">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Workspace Status</span>
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 justify-end mt-0.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                Live Development Sandbox
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Context Metrics Card Deck */}
        <Metrics 
          projects={projects} 
          activeRole={activeRole} 
          currentUser={currentUser} 
        />

        {/* Prime Splitting Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bigger Left Area: Visual Showcase Grid of Project Postings */}
          <div className="lg:col-span-2 space-y-6">

            {/* List Pipeline Area */}
            <div id="marketplace-feed" className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                    Available Marketplace Gigs 
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                      {filteredProjects.length} found
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Explore listed project requests ready for collaboration</p>
                </div>

                {/* Quick reset/simulation tools */}
                <div className="flex items-center gap-1.5 self-start">
                  <button
                    id="skill-filter-clear-btn"
                    onClick={() => {
                      setSelectedSkill(null);
                      setSearchQuery('');
                      showToast('Reset search filters.', 'info');
                    }}
                    className="text-[10px] text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors uppercase font-mono px-2.5 py-1.5 rounded-lg font-bold cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>

              {/* Advanced Interactive Search Grid */}
              <div id="search-filter-controls" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Text search field */}
                <div className="sm:col-span-2 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    id="feed-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects, authors, description..."
                    className="w-full text-xs bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-550 focus:ring-4 focus:ring-blue-100 transition-all rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-450"
                  />
                </div>

                {/* Skills filtering badge select dropdown style */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Filter className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <select
                    id="skill-filter-dropdown"
                    value={selectedSkill || ''}
                    onChange={(e) => {
                      setSelectedSkill(e.target.value ? e.target.value : null);
                      showToast(`Filtered projects by skill: ${e.target.value || 'All'}`, 'info');
                    }}
                    className="w-full text-xs bg-white border border-slate-200 hover:border-slate-350 focus:outline-none focus:border-blue-550 rounded-xl pl-9 pr-3 py-2.5 text-slate-700 appearance-none cursor-pointer font-bold shadow-sm"
                  >
                    <option value="">Filter by Skill Tag</option>
                    {uniqueSkillsList.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Skills Selector Horizontal pill layout */}
              {uniqueSkillsList.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center bg-white p-2.5 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <span className="text-[10px] text-slate-450 uppercase font-black tracking-wider shrink-0 mr-1.5 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" /> Skills Hot-keys:
                  </span>
                  {uniqueSkillsList.map((skill) => (
                    <button
                      key={skill}
                      id={`skill-pill-filter-${skill}`}
                      onClick={() => {
                        setSelectedSkill(selectedSkill === skill ? null : skill);
                        showToast(selectedSkill === skill ? 'Removed skill filter' : `Activated ${skill} filter`, 'info');
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                        selectedSkill === skill
                          ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid Wrapper for Showcase & Project Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. COMPACT "POST A NEW PROJECT" CARD (At the top of this grid spanning across) */}
                <div className="md:col-span-2">
                  <ProjectForm
                    currentUser={currentUser}
                    activeRole={activeRole}
                    onAddProject={handleAddProject}
                    showToast={showToast}
                  />
                </div>

                {/* 2. SHOWCASED VISUAL PROJECT CARDS */}
                {filteredProjects.length === 0 ? (
                  <div className="md:col-span-2 bg-white border border-dashed border-slate-200 p-12 text-center rounded-2xl select-none shadow-sm">
                    <HelpCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-800">No project listings found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                      Try resetting your skill tags search filter or use other queries to access default projects.
                    </p>
                    <button
                      id="reset-query-empty-btn"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSkill(null);
                      }}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-3.5 py-1.5 rounded-lg mt-4 cursor-pointer transition-colors"
                    >
                      Clear Search Filters
                    </button>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      currentUser={currentUser}
                      activeRole={activeRole}
                      onSubmitProposal={handleSubmitProposal}
                      onAcceptProposal={handleAcceptProposal}
                      onDeclineProposal={handleDeclineProposal}
                      onInviteToInterview={handleInviteToInterview}
                      onAddReview={handleAddReview}
                      showToast={showToast}
                    />
                  ))
                )}

              </div>

            </div>

          </div>

          {/* Right Column: Sandbox Utilities Side Panel */}
          <div className="space-y-5">
            
            {/* Developer Sandbox Controls */}
            <div id="sandbox-blueprint" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Server className="h-16 w-16 text-blue-500" />
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <Server className="h-4.5 w-4.5 text-blue-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Sandbox Utilities</h3>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-3.5 font-medium">
                Use these tools in the AI Studio preview environment to generate real-time feedback values and monitor live state behaviors.
              </p>

              <div className="space-y-2.5">
                
                {/* Simulate Bid Button */}
                <button
                  id="sandbox-simulate-bid-btn"
                  onClick={handleSimulateBid}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-705 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Simulate Inbound Bid
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Reset Seeds Button */}
                <button
                  id="sandbox-wipe-db-btn"
                  onClick={handleEmergencyWipe}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-500 hover:text-rose-600 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 text-rose-500" /> Reset Seed Database
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

              </div>
            </div>

            {/* Platform Profile Detail Panel */}
            <div id="sandbox-active-profile" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3.5">Active Persona Summary</span>
              
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-11 w-11 rounded-xl object-cover ring-4 ring-blue-500/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-800">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{currentUser.email}</p>
                  <div className="inline-flex items-center gap-1 text-[10px] text-amber-600 mt-1 font-extrabold bg-amber-50 border border-amber-150 px-1.5 py-0.5 rounded-md">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>{currentUser.rating} Developer Score</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-150 pt-3.5 font-medium">
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-black uppercase">Workspace Role:</span>
                  <span className="font-extrabold text-slate-800 capitalize text-[11px]">{activeRole}</span>
                </div>
                
                {activeRole === 'freelancer' && (
                  <>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-black uppercase">Hourly rate:</span>
                      <span className="font-extrabold text-slate-800 text-[11px]">₹5,000/hr</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-black uppercase">Total Earnings:</span>
                      <span className="font-extrabold text-slate-800 text-[11px]">₹{(currentUser.totalEarnings || 23400).toLocaleString()}</span>
                    </div>
                  </>
                )}

                {activeRole === 'client' && (
                  <>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-black uppercase">Project spendings:</span>
                      <span className="font-extrabold text-slate-800 text-[11px]">₹{(currentUser.totalSpent || 15000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-black uppercase">Completed hires:</span>
                      <span className="font-extrabold text-slate-800 text-[11px]">{currentUser.completedJobsCount} Hires</span>
                    </div>
                  </>
                )}

                <div className="text-[10px] text-slate-400 italic text-center pt-2 select-none leading-relaxed">
                  Toggle roles instantly in the upper right navigation segment.
                </div>
              </div>
            </div>

            {/* Quick Informational Guide */}
            <div id="sandbox-quick-guide" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block mb-2">Sandbox Instructions</span>
              <ul className="space-y-1.5 text-[10px] text-slate-500 leading-relaxed list-disc pl-4 font-medium">
                <li>Under **Client Mode**, publish projects dynamically, inspect incoming bids, and accept/reject them instantly.</li>
                <li>Under **Freelancer Mode**, search through published listings, filter by specific high-fidelity skills tags, and place custom project bids.</li>
                <li>Use standard **Add Review** buttons to leave dynamic ratings and client comments directly inside active drawers.</li>
              </ul>
              
              <div className="mt-4 border-t border-slate-100 pt-3 text-center">
                <span className="text-[9px] text-slate-400 font-mono italic">Crafted under Tailwind v4 • motion</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Platform premium footer & interactive chat system */}
      <Footer currentUser={currentUser} showToast={showToast} />

      {/* Catalyst AI Sidecar Companion */}
      <AIAssistant currentUser={currentUser} showToast={showToast} />

      {/* Floating feedback portal alert system */}
      <FeedbackToast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
