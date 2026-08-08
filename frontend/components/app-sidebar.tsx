'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth-context';
import { useAppTheme } from './theme-provider';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  FolderKanban,
  LayoutList,
  Moon,
  Settings,
  Sun,
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme, colorMode, setColorMode } = useAppTheme();

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      {/* Top Profile Dropdown Trigger */}
      <SidebarHeader className="p-3.5">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left group border-none bg-transparent cursor-pointer">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-border shadow-xs">
                <AvatarImage src={user?.avatar} alt={user?.name || 'Guest'} />
                <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-xs">
                  {user?.name?.[0] || 'G'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight text-foreground">
                  {user?.name || 'Guest'}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </DropdownMenuTrigger>

          {/* Profile Theme & Options Popover (Figma Exact Styling) */}
          <DropdownMenuContent className="w-60 p-3.5 rounded-sm shadow-xl border border-border/80 bg-popover" align="start">
            {/* Centered Profile Avatar & Info Header (Figma Exact) */}
            <div className="flex flex-col items-center justify-center pt-1 pb-3.5 border-b border-border/40 mb-2 text-center">
              <Avatar className="h-14 w-14 border border-border/80 shadow-xs mb-2">
                <AvatarImage src={user?.avatar} alt={user?.name || 'Guest'} />
                <AvatarFallback className="bg-pink-500 text-white font-bold text-lg">
                  {user?.name?.[0] || 'G'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-foreground leading-snug">
                {user?.name || 'Guest User'}
              </span>
              <span className="text-xs text-muted-foreground/80 mt-0.5 font-normal">
                {user?.email || 'guest@workspace.com'}
              </span>
            </div>

            {/* Menu Options List */}
            <div className="space-y-1 pt-0.5">
              {/* Change Theme Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <Sun className="h-4 w-4 text-foreground" />
                    <span className="text-sm font-medium text-foreground">Change Theme</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40 p-2 rounded-2xl shadow-xl border border-border/80 bg-popover">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold px-2 py-1">
                    Theme
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setTheme('light')}
                    className="flex items-center justify-between py-2 px-2.5 rounded-xl cursor-pointer hover:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">Light</span>
                    </div>
                    {theme === 'light' ? <Check className="h-4 w-4 text-primary" /> : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme('dark')}
                    className="flex items-center justify-between py-2 px-2.5 rounded-xl cursor-pointer hover:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                    {theme === 'dark' ? <Check className="h-4 w-4 text-primary" /> : null}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Color Mode Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-xs bg-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground">Color Mode</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44 p-2 rounded-2xl shadow-xl border border-border/80 bg-popover">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold px-2 py-1">
                    Color Mode
                  </DropdownMenuLabel>
                  {[
                    { id: 'amber', label: 'Amber', color: 'bg-amber-600' },
                    { id: 'blue', label: 'Blue', color: 'bg-blue-600' },
                    { id: 'pink', label: 'Pink', color: 'bg-pink-500' },
                    { id: 'rose', label: 'Rose', color: 'bg-rose-600' },
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
                    { id: 'black', label: 'Black', color: 'bg-foreground' },
                  ].map(item => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => setColorMode(item.id as any)}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-xl cursor-pointer hover:bg-muted"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`h-3.5 w-3.5 rounded-xs ${item.color} shadow-xs`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {colorMode === item.id ? <Check className="h-4 w-4 text-primary" /> : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Settings Item */}
              <DropdownMenuItem
                onClick={() => router.push('/settings')}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer hover:bg-muted/60 transition-colors"
              >
                <Settings className="h-4 w-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">Settings</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      {/* Workspace Menu Section */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 pb-2.5">
            <span>Workspace</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-1">
            {/* Tasks Link */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === '/tasks' || pathname === '/'}
                className="px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                onClick={() => router.push('/tasks')}
              >
                <div className="flex items-center gap-3">
                  <LayoutList className="h-4 w-4 text-foreground" />
                  <span className="text-foreground font-semibold">Tasks</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Projects Link */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === '/projects'}
                className="px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                onClick={() => router.push('/projects')}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Projects</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
