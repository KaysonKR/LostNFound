import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, PackageSearch, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuthUser } from '@/lib/AuthUserContext';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isTeacher, login, logout } = useAuthUser();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Find Item' },
    ...(isTeacher ? [{ to: '/report', label: 'Report Found' }, { to: '/admin', label: 'Admin' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[hsl(0,0%,9%)] border-b border-[hsl(0,0%,18%)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <PackageSearch className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg text-white">Lost & Found</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side: Login / User */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-gray-200 hover:text-white hover:bg-white/10 hidden md:flex">
                    {isTeacher ? <ShieldCheck className="w-4 h-4 text-secondary" /> : <User className="w-4 h-4" />}
                    <span className="text-sm max-w-[160px] truncate">{user.full_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    {isTeacher && (
                      <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Teacher / Admin
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {isTeacher && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/report">Report Found Item</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                size="sm"
                className="hidden md:flex gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-200 hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[hsl(0,0%,9%)] border-t border-[hsl(0,0%,18%)] px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  isActive(link.to) ? 'bg-primary text-primary-foreground' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="pt-2 border-t border-[hsl(0,0%,18%)]">
            {user ? (
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={login}
                className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}