import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Plus, X, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Project, UserProfile } from '../types';

interface ProjectFormProps {
  currentUser: UserProfile;
  activeRole: 'client' | 'freelancer';
  onAddProject: (project: Omit<Project, 'id' | 'proposals' | 'reviews' | 'createdAt'>) => void;
  showToast: (text: string, type: 'success' | 'error') => void;
}

const COMMON_SKILLS = [
  'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Figma', 'Stripe API', 'Python', 'Next.js', 'Google Maps'
];

export default function ProjectForm({ currentUser, activeRole, onAddProject, showToast }: ProjectFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState<string[]>(['React']);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (skill: string) => {
    const cleaned = skill.trim();
    if (cleaned && !skills.includes(cleaned)) {
      setSkills([...skills, cleaned]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please specify a project title.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Please provide a descriptive scope of work.', 'error');
      return;
    }
    const numericalBudget = Number(budget);
    if (!budget || isNaN(numericalBudget) || numericalBudget <= 0) {
      showToast('Please provide a legitimate positive budget amount (₹).', 'error');
      return;
    }
    if (skills.length === 0) {
      showToast('Please add at least one required skill tag.', 'error');
      return;
    }

    onAddProject({
      title: title.trim(),
      description: description.trim(),
      budget: numericalBudget,
      skills,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      clientEmail: currentUser.email,
      status: 'active'
    });

    // Reset Form & collapse
    setTitle('');
    setDescription('');
    setBudget('');
    setSkills(['React']);
    setIsOpen(false);
    showToast('Your new project has been published to the global pipeline!', 'success');
  };

  if (activeRole !== 'client') {
    return (
      <div id="freelancer-cta-box" className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center select-none shadow-sm relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-50 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-md mx-auto">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Freelancer Workspace Active</span>
          <h2 className="text-xs font-bold text-slate-800 mt-1">Browse premium project listings, submit proposals, and chat!</h2>
          <div className="mt-2 text-[10px] text-slate-500 italic inline-flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-blue-500 shrink-0" />
            Switch to &quot;Client Mode&quot; in the header menu to publish new projects.
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <motion.button
        id="compact-post-project-trigger"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.01, borderColor: '#3b82f6' }}
        whileTap={{ scale: 0.99 }}
        className="w-full text-left bg-white border border-dashed border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md hover:border-blue-300"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
        
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 group-hover:bg-blue-550 group-hover:text-white transition-all flex items-center justify-center shrink-0">
            <Plus className="h-6 w-6" id="plus-icon-compact" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
              Post a New Project Listing
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-md">
              Define target milestones, skill requirements, and budget ranges in Indian Rupees (₹) to solicit immediate bids.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 uppercase tracking-wider font-bold shrink-0 self-stretch md:self-auto justify-center">
          <Sparkles className="h-3 w-3 text-amber-500" /> Compact Creator
        </div>
      </motion.button>
    );
  }

  return (
    <div id="project-form-container" className="bg-white border border-slate-200 rounded-2xl p-5.5 shadow-md relative overflow-hidden">
      
      {/* Visual Accent Corner Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4.5">
        <div className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-blue-500" />
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Post a New Project</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-202 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      </div>
      
      <form onSubmit={handleFormSubmit} id="create-project-form" className="space-y-4">
        
        {/* Row: Title & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
              Project Title
            </label>
            <input
              id="form-project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Portfolio Website with Smooth Transitions"
              className="w-full bg-slate-50 text-xs border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-blue-550 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
              Budget (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-semibold">
                ₹
              </span>
              <input
                id="form-project-budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 5000"
                min="100"
                className="w-full bg-slate-50 text-xs border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-blue-550 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">
            Project Description &amp; Scope
          </label>
          <textarea
            id="form-project-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Outline user experiences, deliverables, design styles, and goals clearly..."
            className="w-full bg-slate-50 text-xs border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-blue-550 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200 resize-none animate-none"
          />
        </div>

        {/* Skills Tag Management */}
        <div>
          <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">
            Required Expertise &amp; Skills
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg text-xs font-semibold"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:bg-blue-100 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              id="form-project-skill-input"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                }
              }}
              placeholder="Type skills (e.g., Next.js, Stripe) and press Enter"
              className="flex-1 bg-slate-50 text-xs border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-blue-550 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200"
            />
            <button
              id="form-add-skill-tag-btn"
              type="button"
              onClick={() => handleAddSkill(skillInput)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 rounded-xl border border-slate-205 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Popular Choices:</span>
            {COMMON_SKILLS.filter(s => !skills.includes(s)).slice(0, 5).map((skill) => (
              <button
                key={skill}
                id={`skill-suggest-${skill}`}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="inline-flex items-center text-[10px] bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-2 py-0.5 rounded-md transition-all cursor-pointer"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button layout */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            <span>Indexed immediately.</span>
          </div>
          <button
            id="form-submit-project-btn"
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
          >
            Publish Project <Plus className="h-4 w-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
