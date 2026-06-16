import { Project, UserProfile } from '../types';
import { Briefcase, FileText, IndianRupee, Star, Users, Award, TrendingUp, Sparkles } from 'lucide-react';

interface MetricsProps {
  projects: Project[];
  activeRole: 'client' | 'freelancer';
  currentUser: UserProfile;
}

export default function Metrics({ projects, activeRole, currentUser }: MetricsProps) {
  // Statistics computation
  const activePostings = projects.filter(p => p.status === 'active').length;
  const totalInvestment = projects.reduce((acc, p) => acc + p.budget, 0);
  const spent = currentUser.totalSpent || 18500;
  const earnings = currentUser.totalEarnings || 23400;

  // Decide display values based on roles, but keep the labels exactly as specified
  const displayInvestment = activeRole === 'client' ? spent : earnings;

  return (
    <div id="simplified-metrics-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
      
      {/* Essential Card 1: Total Active Postings */}
      <div id="metric-active-postings" className="relative group overflow-hidden bg-white border border-slate-205 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Briefcase className="h-28 w-28 text-blue-500" />
        </div>
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-102">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-450 uppercase tracking-widest">Total Active Postings</span>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-3xl font-black text-slate-800 font-sans tracking-tight">{activePostings}</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Live Feed
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Ready for real-time collaboration bids</p>
          </div>
        </div>
      </div>

      {/* Essential Card 2: Investment Overview */}
      <div id="metric-investment-overview" className="relative group overflow-hidden bg-white border border-slate-205 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <IndianRupee className="h-28 w-28 text-emerald-550" />
        </div>
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-650 border border-emerald-102">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-450 uppercase tracking-widest">Investment Overview</span>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-3xl font-black text-emerald-650 font-sans tracking-tight">
                ₹{displayInvestment.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {activeRole === 'client' ? 'Total Spent' : 'Total Earnings'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Pipeline Capital Balance: <span className="text-slate-700 font-bold">₹{totalInvestment.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
