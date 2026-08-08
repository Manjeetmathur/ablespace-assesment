'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { resetWorkspace } from '@/lib/api-client';
import { ArrowLeft, Edit2, Moon, Palette, Search, Sun, User } from 'lucide-react';
import { useAppTheme } from '@/components/theme-provider';

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme, colorMode, setColorMode } = useAppTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'color'>('profile');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [title, setTitle] = useState(user?.title || '');
  const [username, setUsername] = useState(user?.username || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async () => {
    await updateUser({ name: fullName, email, title, username });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLeaveWorkspace = async () => {
    if (confirm('Are you sure you want to remove yourself from the workspace?')) {
      await resetWorkspace();
      logout();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Settings Navigation Sidebar (Left) */}
      <aside className="w-64 border-r border-border p-4 flex flex-col gap-6 bg-card/40">
        {/* Back to App Link */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to app</span>
        </Link>

        {/* Search Input (Figma Exact) */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 h-9 text-xs rounded-lg bg-muted/30 border border-border/60"
          />
        </div>

        {/* Settings Menu Items */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${activeTab === 'profile' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'
              }`}
          >
            <User className="h-4 w-4 text-foreground" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${activeTab === 'theme' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'
              }`}
          >
            <Sun className="h-4 w-4 text-foreground" />
            <span>Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('color')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${activeTab === 'color' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'
              }`}
          >
            <div className="h-3.5 w-3.5 rounded-xs bg-foreground shrink-0" />
            <span>Color</span>
          </button>
        </nav>
      </aside>

      {/* Main Settings Content Area */}
      <main className="flex-1 p-8 md:p-12 max-w-4xl mx-auto space-y-8 overflow-y-auto my-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Details Card (Figma Image 1 Exact Layout) */}
            <Card className="rounded-2xl border border-border/80 p-6 space-y-4 bg-card shadow-xs">
              {/* Profile Picture */}
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-xs font-semibold text-muted-foreground">Profile picture</span>
                <Avatar className="h-10 w-10 border border-border shadow-xs">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-pink-500 text-white font-bold">
                    {fullName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-xs font-semibold text-muted-foreground">Email</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{email}</span>
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
              </div>

              {/* Full Name */}
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-xs font-semibold text-muted-foreground">Full name</span>
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-56 h-8 text-xs rounded-lg text-right bg-muted/30 border border-border/50"
                />
              </div>

              {/* Title */}
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground">Title</span>
                  <span className="text-[11px] text-muted-foreground/70">Your job title or role</span>
                </div>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-56 h-8 text-xs rounded-lg text-right bg-muted/30 border border-border/50"
                />
              </div>

              {/* Username */}
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground">Username</span>
                  <span className="text-[11px] text-muted-foreground/70">One word, like a nickname or first name</span>
                </div>
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-56 h-8 text-xs rounded-lg text-right bg-muted/30 border border-border/50"
                />
              </div>
            </Card>

            {/* Workspace Access Card */}
            <div className="space-y-3 pt-4">
              <h2 className="text-sm font-bold text-foreground">Workspace access</h2>
              <Card className="rounded-2xl border border-border/80 p-5 flex items-center justify-between bg-card shadow-xs">
                <span className="text-xs text-muted-foreground font-medium">
                  Remove yourself from the workspace
                </span>
                <Button
                  variant="destructive"
                  onClick={handleLeaveWorkspace}
                  className="rounded-lg text-xs font-semibold px-4 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-400 border-none shadow-none"
                >
                  Leave Workspace
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Theme Settings Tab */}
        {activeTab === 'theme' && (
          <Card className="rounded-2xl border border-border/80 p-6 space-y-4 bg-card">
            <h2 className="text-sm font-bold text-foreground">Theme Preference</h2>
            <div className="flex gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="rounded-lg flex items-center gap-2 text-xs"
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light Theme</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="rounded-lg flex items-center gap-2 text-xs"
              >
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>Dark Theme</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Color Mode Settings Tab */}
        {activeTab === 'color' && (
          <Card className="rounded-2xl border border-border/80 p-6 space-y-4 bg-card">
            <h2 className="text-sm font-bold text-foreground">Accent Color Mode</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'amber', label: 'Amber', color: 'bg-amber-600' },
                { id: 'blue', label: 'Blue', color: 'bg-blue-600' },
                { id: 'pink', label: 'Pink', color: 'bg-pink-500' },
                { id: 'rose', label: 'Rose', color: 'bg-rose-600' },
                { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
                { id: 'black', label: 'Black', color: 'bg-zinc-900 dark:bg-zinc-100' },
              ].map(item => (
                <Button
                  key={item.id}
                  variant={colorMode === item.id ? 'default' : 'outline'}
                  onClick={() => setColorMode(item.id as any)}
                  className="rounded-lg flex items-center justify-start gap-2.5 text-xs py-3"
                >
                  <span className={`h-4 w-4 rounded-sm ${item.color}`} />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
