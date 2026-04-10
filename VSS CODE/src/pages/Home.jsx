import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Plus, Shield, PackageSearch, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthUser } from '@/lib/AuthUserContext';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ItemCard from '@/components/search/ItemCard';

export default function Home() {
  const { isTeacher, user } = useAuthUser();
  const navigate = useNavigate();

  const { data: recentItems = [] } = useQuery({
    queryKey: ['recent-items'],
    queryFn: () => base44.entities.LostItem.filter({ status: 'available' }, '-created_date', 6),
  });

  const features = [
    {
      icon: Search,
      title: 'Find Your Item',
      description: 'Browse found items by category, search by description, and claim what\'s yours.',
      to: '/search',
      color: 'bg-primary/10 text-primary',
    },
    ...(isTeacher ? [
      {
        icon: Plus,
        title: 'Report a Found Item',
        description: 'Found something? Submit it with photos and a description so the owner can find it.',
        to: '/report',
        color: 'bg-secondary/20 text-secondary-foreground',
      },
      {
        icon: Shield,
        title: 'Admin Dashboard',
        description: 'Manage postings, review student claims, and update item statuses.',
        to: '/admin',
        color: 'bg-yellow-100 text-yellow-700',
      },
    ] : []),
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-secondary/5 py-16 md:py-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <PackageSearch className="w-4 h-4" />
            School Lost & Found
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
            Lost something?<br />
            <span className="text-primary">We'll help you find it.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-lg">
            Our digital Lost & Found makes it easy to report, search, and claim lost items on campus.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="gap-2 h-12 px-6 text-base" onClick={() => navigate('/search')}>
              <Search className="w-5 h-5" />
              Search Lost Items
            </Button>
            {isTeacher && (
              <Button size="lg" variant="outline" className="gap-2 h-12 px-6 text-base" onClick={() => navigate('/report')}>
                <Plus className="w-5 h-5" />
                Report Found Item
              </Button>
            )}
          </div>
        </motion.div>

        {/* Decorative */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Recently Found Items */}
      {recentItems.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-2xl">Recently Found</h2>
              <p className="text-muted-foreground mt-0.5 text-sm">Click any item to see details and claim it</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/search')} className="gap-1.5">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Feature cards */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="font-heading font-bold text-2xl">How It Works</h2>
          <p className="text-muted-foreground mt-1">Use the sidebar to browse by category, or click below to get started</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <Link to={f.to} className="block group">
                <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-base mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Get started <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}