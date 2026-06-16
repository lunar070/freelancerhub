import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Proposal, Review, UserProfile } from '../types';
import { 
  IndianRupee, Calendar, Send, Star, MessageSquareCode, 
  ChevronDown, ChevronUp, User, LayoutGrid, CheckCircle2, 
  X, AlertCircle, Bookmark, StarHalf 
} from 'lucide-react';

interface ProjectCardProps {
  key?: string;
  project: Project;
  currentUser: UserProfile;
  activeRole: 'client' | 'freelancer';
  onSubmitProposal: (projectId: string, proposal: Omit<Proposal, 'id' | 'projectId' | 'projectTitle' | 'freelancerName' | 'freelancerAvatar' | 'freelancerEmail' | 'status' | 'createdAt'>) => void;
  onAcceptProposal: (projectId: string, proposalId: string) => void;
  onDeclineProposal: (projectId: string, proposalId: string) => void;
  onInviteToInterview: (projectId: string, proposalId: string, dateTime: string, platform: string, notes?: string) => void;
  onAddReview: (projectId: string, review: Omit<Review, 'id' | 'projectId' | 'reviewerName' | 'reviewerAvatar' | 'createdAt'>) => void;
  showToast: (text: string, type: 'success' | 'error') => void;
}

export default function ProjectCard({
  project,
  currentUser,
  activeRole,
  onSubmitProposal,
  onAcceptProposal,
  onDeclineProposal,
  onInviteToInterview,
  onAddReview,
  showToast,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Proposal Fields State
  const [bidAmount, setBidAmount] = useState(project.budget.toString());
  const [timelineDays, setTimelineDays] = useState('7');
  const [coverLetter, setCoverLetter] = useState('');

  // Interview Scheduling State
  const [schedulingPropId, setSchedulingPropId] = useState<string | null>(null);
  const [interviewDateTime, setInterviewDateTime] = useState('');
  const [interviewPlatform, setInterviewPlatform] = useState('Google Meet');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Review Fields State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Checks
  const myProposal = project.proposals.find(p => p.freelancerEmail === currentUser.email);
  const daysDifference = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const timeLabel = daysDifference === 0 ? 'Urgent / Posted Today' : `${daysDifference}d ago`;

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(bidAmount);
    const parsedTimeline = Number(timelineDays);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please specify a legitimate bid amount.', 'error');
      return;
    }
    if (isNaN(parsedTimeline) || parsedTimeline <= 0) {
      showToast('Please specify a viable delivery time.', 'error');
      return;
    }
    if (!coverLetter.trim() || coverLetter.trim().length < 8) {
      showToast('Please write a slightly longer cover letter detailing your credentials.', 'error');
      return;
    }

    onSubmitProposal(project.id, {
      bidAmount: parsedAmount,
      timelineDays: parsedTimeline,
      coverLetter: coverLetter.trim()
    });

    setCoverLetter('');
    setShowProposalForm(false);
    showToast('Your premium bid was submitted successfully to the client!', 'success');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please provide a descriptive comment for your review.', 'error');
      return;
    }

    onAddReview(project.id, {
      rating,
      comment: comment.trim()
    });

    setComment('');
    setShowReviewForm(false);
    showToast('Your work review was committed successfully!', 'success');
  };

  // Dynamic visual thumbnails based on project titles/IDs
  const getThumbnailImage = () => {
    const t = project.title.toLowerCase();
    if (project.id === 'proj-1' || t.includes('portfolio') || t.includes('redesign')) {
      return "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400";
    }
    if (project.id === 'proj-2' || t.includes('checkout') || t.includes('commerce') || t.includes('stripe')) {
      return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400";
    }
    if (project.id === 'proj-3' || t.includes('mobile') || t.includes('sign-in') || t.includes('restyle')) {
      return "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400";
    }
    return "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400";
  };

  // Compute status-based development progress
  const getProgressDetails = () => {
    switch (project.status) {
      case 'completed':
        return { percent: 100, label: 'Milestone Settled', color: 'bg-emerald-500' };
      case 'assigned':
        return { percent: 75, label: 'Active Development', color: 'bg-indigo-500 animate-pulse' };
      case 'active':
      default:
        return { percent: 35, label: 'Accepting Proposals', color: 'bg-violet-500' };
    }
  };

  const progress = getProgressDetails();
  const thumbnail = getThumbnailImage();

  // Compute stats on bids submitted
  const proposalCount = project.proposals.length;
  const bidsSummaryText = (() => {
    if (proposalCount === 0) return 'No bids active';
    if (proposalCount === 1) return `1 active bid for ₹${project.proposals[0].bidAmount.toLocaleString()}`;
    const amounts = project.proposals.map(p => p.bidAmount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    return `${proposalCount} bids • Avg ₹${Math.round(amounts.reduce((a,b) => a+b, 0)/proposalCount).toLocaleString()}`;
  })();

  return (
    <motion.div
      id={`project-card-${project.id}`}
      layout="position"
      whileHover={{ y: -4 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      
      {/* 1. THUMBNAIL IMAGE HEADER */}
      <div className="relative h-40 w-full overflow-hidden select-none bg-slate-100">
        <img
          src={thumbnail}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
        
        {/* Publisher Float Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-slate-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] text-slate-700 font-medium shadow-sm">
          <img
            src={project.clientAvatar}
            alt={project.clientName}
            referrerPolicy="no-referrer"
            className="h-4 w-4 rounded-full object-cover"
          />
          <span className="truncate max-w-[90px]">{project.clientName}</span>
        </div>

        {/* Budget Flag Overlay */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-sky-400 border border-blue-400/20 px-3 py-1 rounded-xl shadow-md">
          <span className="block text-[8px] text-blue-105 uppercase font-extrabold tracking-widest text-center leading-none text-white/90">Budget</span>
          <span className="text-xs font-black text-white flex items-center justify-center mt-0.5 leading-none">
            <IndianRupee className="h-3 w-3 shrink-0" />
            {project.budget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2. CARD CORE INFORMATION */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status Label & Title */}
          <div className="flex items-center justify-between gap-2.5 mb-1.5">
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              project.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
              project.status === 'assigned' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-sky-600 bg-sky-50 border border-sky-100'
            }`}>
              {project.status === 'active' ? '● Open' : project.status === 'assigned' ? '✓ Assigned' : '✓ Completed'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono font-medium">{timeLabel}</span>
          </div>

          <h3 className="text-sm font-black text-slate-800 tracking-tight leading-tight line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-medium">
            {project.description}
          </p>

          {/* 3. key SKILLS TAGS */}
          <div className="flex flex-wrap gap-1 mb-4 select-none">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="text-[9px] bg-slate-50 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-md font-mono font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 4. PROGRESS BAR */}
        <div className="border-t border-slate-100 pt-3.5 mb-3.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1.5 leading-none">
            <span className="text-[10px] font-black text-slate-700">{progress.label}</span>
            <span className="font-mono text-slate-500">{progress.percent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div className={`h-full rounded-full transition-all duration-500 ${
              project.status === 'completed' ? 'bg-emerald-500' :
              project.status === 'assigned' ? 'bg-blue-500 animate-pulse' : 'bg-sky-500'
            }`} style={{ width: `${progress.percent}%` }} />
          </div>
        </div>

        {/* 5. SUMMARY OF BIDS RECEIVED */}
        <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-4.5">
          <div className="flex items-center gap-1.5">
            {/* Embedded Avatar Overlap */}
            {project.proposals.length > 0 ? (
              <div className="flex -space-x-1.5 overflow-hidden select-none shrink-0">
                {project.proposals.slice(0, 3).map((p) => (
                  <img
                    key={p.id}
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                    src={p.freelancerAvatar}
                    alt={p.freelancerName}
                    referrerPolicy="no-referrer"
                    title={p.freelancerName}
                  />
                ))}
              </div>
            ) : (
              <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-205 flex items-center justify-center shrink-0">
                <AlertCircle className="h-3 w-3 text-slate-400" />
              </div>
            )}
            
            <div className="min-w-0">
              <span className="block text-[9px] text-slate-400 uppercase font-black tracking-wider leading-none">Bids Status</span>
              <span className="text-[11px] font-bold text-blue-600 truncate block mt-1 leading-none">{bidsSummaryText}</span>
            </div>
          </div>

          <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-1 rounded border border-slate-200">
            {proposalCount} Proposal{proposalCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* 6. PRIMARY INTERACTIVE CONTROLS */}
        <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
          <button
            id={`toggle-expand-btn-${project.id}`}
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            {expanded ? (
              <>Hide drawer <ChevronUp className="h-3.5 w-3.5 text-blue-500" /></>
            ) : (
              <>
                Inspect ({proposalCount})
                <ChevronDown className="h-3.5 w-3.5 text-blue-500 animate-bounce" />
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            {activeRole === 'freelancer' && project.status === 'active' && (
              <>
                {myProposal ? (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 py-1 px-2 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Bid Cast (₹{myProposal.bidAmount})
                  </span>
                ) : (
                  <button
                    id={`submit-proposal-trigger-${project.id}`}
                    onClick={() => {
                      setShowProposalForm(!showProposalForm);
                      setShowReviewForm(false);
                      if (!expanded) setExpanded(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow"
                  >
                    Bid
                  </button>
                )}
              </>
            )}

            <button
              id={`add-review-trigger-${project.id}`}
              onClick={() => {
                setShowReviewForm(!showReviewForm);
                setShowProposalForm(false);
                if (!expanded) setExpanded(true);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-205 transition-colors cursor-pointer"
            >
              Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Interactive Drawer (Bids, Reviews, Logs) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`expanded-drawer-${project.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 bg-slate-50/60 divide-y divide-slate-150 overflow-hidden"
          >
            
            {/* Segment 1: Bid Proposal Submission Form */}
            {showProposalForm && activeRole === 'freelancer' && !myProposal && (
              <div className="p-4 bg-blue-50/50 border-b border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                    <Send className="h-3.5 w-3.5" /> Submit Custom Proposal bid
                  </span>
                  <button
                    id={`close-proposal-form-${project.id}`}
                    onClick={() => setShowProposalForm(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <form onSubmit={handleProposalSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Your Bid Price (₹)
                      </label>
                      <input
                        id={`proposal-bid-${project.id}`}
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full bg-white text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Duration (Days)
                      </label>
                      <input
                        id={`proposal-days-${project.id}`}
                        type="number"
                        value={timelineDays}
                        onChange={(e) => setTimelineDays(e.target.value)}
                        className="w-full bg-white text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Proposal Cover Letter
                    </label>
                    <textarea
                      id={`proposal-letter-${project.id}`}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={2.5}
                      placeholder="Why are you qualified? Outline your design experience or relevant tech stack integrations..."
                      className="w-full bg-white text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    id={`proposal-submit-btn-${project.id}`}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white font-black text-xs py-2 px-4 rounded-xl shadow cursor-pointer transition-colors"
                  >
                    Confirm Submission Bid (₹{Number(bidAmount).toLocaleString()})
                  </button>
                </form>
              </div>
            )}

            {/* Segment 2: Add Work Review Form */}
            {showReviewForm && (
              <div className="p-4 bg-emerald-50/50 border-b border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-650 uppercase tracking-widest flex items-center gap-1 animate-none">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Submit Work Ratings Review
                  </span>
                  <button
                    id={`close-review-form-${project.id}`}
                    onClick={() => setShowReviewForm(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Platform Star Rating ({rating} Stars)
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          id={`star-btn-${project.id}-${star}`}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Descriptive Client / Developer Comment
                    </label>
                    <textarea
                      id={`review-comment-${project.id}`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      placeholder="Share feedback on responsiveness, speed, criteria excellence, or clarity..."
                      className="w-full bg-white text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    id={`review-submit-btn-${project.id}`}
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-emerald-400 font-bold text-xs py-2 px-4 rounded-xl border border-slate-700 transition-all cursor-pointer"
                  >
                    Post Platform Review Rating
                  </button>
                </form>
              </div>
            )}

            {/* Segment 3: View Received Proposals */}
            <div className="p-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-blue-500" />
                Submitted Proposals ({project.proposals.length})
              </h4>

              {project.proposals.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No freelancer bids have been submitted on this project listing, act as freelancer to bid!
                </p>
              ) : (
                <div className="space-y-3">
                  {project.proposals.map((prop) => (
                    <div
                      key={prop.id}
                      id={`proposal-item-${prop.id}`}
                      className={`border p-3.5 rounded-xl text-xs transition-all ${
                        prop.status === 'accepted'
                          ? 'border-emerald-305 bg-emerald-50/50'
                          : prop.status === 'declined'
                          ? 'border-rose-201 bg-rose-50/30 opacity-60'
                          : prop.status === 'interviewing'
                          ? 'border-blue-300 bg-blue-50/20 shadow-sm'
                          : 'border-slate-200 bg-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex gap-2.5">
                          <img
                            src={prop.freelancerAvatar}
                            alt={prop.freelancerName}
                            className="h-8 w-8 rounded-lg object-cover ring-2 ring-blue-500/10"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">{prop.freelancerName}</span>
                            <span className="text-[10px] text-slate-450 block leading-tight">{prop.freelancerEmail}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] text-slate-400">Proposed Rate</span>
                          <span className="text-xs font-black text-slate-800 block">₹{prop.bidAmount.toLocaleString()}</span>
                          <span className="text-[10px] text-blue-600 font-bold block mt-0.5">{prop.timelineDays} days delivery</span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-[11px] mt-2.5 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        &ldquo;{prop.coverLetter}&rdquo;
                      </p>

                      {/* Scheduled Interview Details Block */}
                      {prop.status === 'interviewing' && prop.interviewDetails && (
                        <div className="bg-blue-50/65 border border-blue-200 rounded-xl p-3 mt-3 text-slate-700 flex items-start gap-2.5">
                          <div className="h-6 w-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-blue-600">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div className="text-xs flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-blue-700 text-[10px] uppercase tracking-wider">
                                Scheduled Interview
                              </span>
                              <span className="bg-blue-105 text-blue-800 text-[9px] py-0.5 px-1.5 rounded font-extrabold font-mono uppercase">
                                {prop.interviewDetails.platform}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] font-bold text-slate-800">
                              Time: {new Date(prop.interviewDetails.dateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            {prop.interviewDetails.notes && (
                              <p className="mt-1.5 text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-blue-100/60 leading-relaxed">
                                Message: {prop.interviewDetails.notes}
                              </p>
                            )}
                            <div className="mt-2.5 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  showToast(`Launching virtual ${prop.interviewDetails?.platform} room... (Sandbox Simulation)`, 'success');
                                }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-605 hover:from-blue-500 hover:to-indigo-505 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow cursor-pointer"
                              >
                                Join call
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interview Scheduling Form Inline */}
                      {schedulingPropId === prop.id && (
                        <motion.div
                          id={`scheduling-form-container-${prop.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 mt-3 text-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                              Schedule Virtual Interview Setup
                            </span>
                            <button
                              type="button"
                              onClick={() => setSchedulingPropId(null)}
                              className="text-slate-400 hover:text-slate-650 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">
                                Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                value={interviewDateTime}
                                onChange={(e) => setInterviewDateTime(e.target.value)}
                                className="w-full bg-white border border-slate-202 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">
                                Meeting Platform
                              </label>
                              <select
                                value={interviewPlatform}
                                onChange={(e) => setInterviewPlatform(e.target.value)}
                                className="w-full bg-white border border-slate-202 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                              >
                                <option value="Google Meet">Google Meet</option>
                                <option value="Zoom Meeting">Zoom Meeting</option>
                                <option value="Microsoft Teams">Microsoft Teams</option>
                                <option value="Slack Huddle">Slack Huddle</option>
                                <option value="In-Platform Chat">In-Platform Chat</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">
                              Message / Special Details
                            </label>
                            <textarea
                              value={interviewNotes}
                              placeholder="Describe meeting agenda, prep items, or general details..."
                              onChange={(e) => setInterviewNotes(e.target.value)}
                              rows={2}
                              className="w-full text-xs bg-white border border-slate-202 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-blue-500 resize-none h-16 font-semibold"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!interviewDateTime) {
                                showToast('Please select a date and time for the interview.', 'error');
                                return;
                              }
                              onInviteToInterview(project.id, prop.id, interviewDateTime, interviewPlatform, interviewNotes);
                              setSchedulingPropId(null);
                              setInterviewDateTime('');
                              setInterviewNotes('');
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-[10px] py-2 px-4 rounded-xl cursor-pointer shadow"
                          >
                            Send Interview Invitation
                          </button>
                        </motion.div>
                      )}

                      {/* Display Status or Client Operations */}
                      <div className="flex items-center justify-between gap-3 mt-3 border-t border-slate-100 pt-2.5">
                        <span className="text-[10px] text-slate-450 font-medium font-mono">
                          Bid raised: {new Date(prop.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {(prop.status === 'pending' || prop.status === 'interviewing') ? (
                            <>
                              {/* Only the specific project owner can decide on proposals */}
                              {activeRole === 'client' && project.clientEmail === currentUser.email && (
                                <>
                                  <button
                                    id={`decline-proposal-btn-${prop.id}`}
                                    onClick={() => onDeclineProposal(project.id, prop.id)}
                                    className="bg-rose-50 hover:bg-rose-100/80 text-rose-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-rose-201 cursor-pointer"
                                  >
                                    Decline
                                  </button>
                                  {prop.status === 'pending' && (
                                    <button
                                      id={`schedule-interview-btn-${prop.id}`}
                                      type="button"
                                      onClick={() => {
                                        setSchedulingPropId(schedulingPropId === prop.id ? null : prop.id);
                                      }}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-650 px-3 py-1 rounded-lg text-[10px] font-bold border border-blue-200 cursor-pointer"
                                    >
                                      {schedulingPropId === prop.id ? 'Cancel' : 'Invite Interview'}
                                    </button>
                                  )}
                                  <button
                                    id={`accept-proposal-btn-${prop.id}`}
                                    onClick={() => onAcceptProposal(project.id, prop.id)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    Accept Bid
                                  </button>
                                </>
                              )}
                              {!(activeRole === 'client' && project.clientEmail === currentUser.email) && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                                  prop.status === 'interviewing'
                                    ? 'text-blue-600 bg-blue-50 border-blue-200'
                                    : 'text-amber-600 bg-amber-50 border-amber-100'
                                }`}>
                                  {prop.status === 'interviewing' ? 'Interview Scheduled' : 'Pending Review'}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              prop.status === 'accepted' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-slate-500 bg-slate-100 border border-slate-205'
                            }`}>
                              {prop.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Segment 4: Reviews Panel */}
            <div className="p-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <MessageSquareCode className="h-3.5 w-3.5 text-blue-500" />
                Workspace Feedback &amp; Reviews ({project.reviews.length})
              </h4>

              {project.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No team reviews have been logged on this project workspace yet. Feel free to add one above!
                </p>
              ) : (
                <div className="space-y-3">
                  {project.reviews.map((rev) => (
                    <div key={rev.id} id={`review-item-${rev.id}`} className="bg-white border border-slate-150 rounded-xl p-3 text-xs shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName}
                            className="h-6 w-6 rounded-md object-cover ring-1 ring-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-slate-700">{rev.reviewerName}</span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${
                                s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 italic text-[11px] mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
