import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Bell, Check, LogOut, ChevronDown, User, Sparkles } from 'lucide-react';
import { UserProfile, Notification } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  notifications: Notification[];
  activeRole: 'client' | 'freelancer';
  onRoleChange: (role: 'client' | 'freelancer') => void;
  onLogout: () => void;
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
}

export default function Header({
  currentUser,
  notifications,
  activeRole,
  onRoleChange,
  onLogout,
  onMarkNotificationRead,
  onClearNotifications,
}: HeaderProps) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-2 rounded-xl shadow-md">
            <Zap className="h-5 w-5 text-amber-300 fill-amber-300 animate-pulse" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            FreelanceHub
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-slate-100 text-[10px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full font-mono">
            v2.1
          </span>
        </div>

        {/* Navigation / Actions Control Panel */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Role Pill Switcher */}
          <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-inner">
            <button
              id="header-role-client"
              onClick={() => {
                onRoleChange('client');
                if (showProfileMenu) setShowProfileMenu(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'client'
                  ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              Client Mode
            </button>
            <button
              id="header-role-freelancer"
              onClick={() => {
                onRoleChange('freelancer');
                if (showProfileMenu) setShowProfileMenu(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'freelancer'
                  ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              Freelancer Mode
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="header-notif-bell-btn"
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (showProfileMenu) setShowProfileMenu(false);
              }}
              className={`p-2.5 rounded-xl border transition-all relative cursor-pointer ${
                showNotifMenu
                  ? 'bg-slate-100 border-slate-350 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-850 hover:border-slate-300'
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifMenu && (
                <motion.div
                  id="notifications-dropdown"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-80 md:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 text-slate-800"
                >
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Notifications ({unreadCount} unread)</span>
                    {notifications.length > 0 && (
                      <button
                        id="clear-notif-btn"
                        onClick={onClearNotifications}
                        className="text-[10px] text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No notifications is currently active.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          id={`notif-item-${notif.id}`}
                          className={`p-3.5 text-xs transition-colors hover:bg-slate-50 flex gap-3 ${
                            notif.read ? 'opacity-60' : 'bg-blue-50'
                          }`}
                        >
                          <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5 animate-pulse" />
                          <div className="flex-1">
                            <p className="font-bold text-slate-800">{notif.title}</p>
                            <p className="text-slate-600 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!notif.read && (
                            <button
                              id={`mark-read-btn-${notif.id}`}
                              onClick={() => onMarkNotificationRead(notif.id)}
                              className="text-slate-400 hover:text-blue-600 shrink-0 self-center cursor-pointer"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Info Dropdown */}
          <div className="relative">
            <button
              id="header-profile-menu-btn"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                if (showNotifMenu) setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100/80 transition-all text-left cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-lg object-cover ring-2 ring-blue-500/10"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-slate-400 capitalize leading-none font-medium">
                  {activeRole === 'client' ? 'Client Workspace' : 'Freelancer'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  id="profile-dropdown-menu"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 text-slate-800 p-2"
                >
                  {/* Account Summary mini header */}
                  <div className="p-2.5 bg-slate-50 rounded-lg mb-2 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bio Profile</span>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{currentUser.bio}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 border-b border-slate-100 pb-2 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-semibold text-slate-700">Rating: {currentUser.rating} ★</span>
                    </div>

                    <button
                      id="profile-menu-logout-btn"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out Account
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </header>
  );
}
