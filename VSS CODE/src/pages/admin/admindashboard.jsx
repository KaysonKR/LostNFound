import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, ClipboardList } from 'lucide-react';
import AdminItemsTab from '@/components/admin/AdminItemsTab';
import AdminClaimsTab from '@/components/admin/AdminClaimsTab';
import { useAuthUser } from '@/lib/AuthUserContext';
import { ShieldOff } from 'lucide-react';

export default function AdminDashboard() {
  const { isTeacher, user, login } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ['admin-items'],
    queryFn: () => base44.entities.LostItem.list('-created_date', 500),
  });

  const { data: claims = [], isLoading: loadingClaims } = useQuery({
    queryKey: ['admin-claims'],
    queryFn: () => base44.entities.Claim.list('-created_date', 500),
  });

  const updateItem = useMutation({
    mutationFn: ({ id, data }) => base44.entities.LostItem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-items'] }),
  });

  const deleteItem = useMutation({
    mutationFn: (id) => base44.entities.LostItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-items'] }),
  });

  const updateClaim = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Claim.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-claims'] }),
  });

  if (!user || !isTeacher) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <ShieldOff className="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 className="font-heading font-bold text-xl">Teacher Access Only</h2>
        <p className="text-muted-foreground text-sm">This page is for teachers and administrators only. Please log in with a teacher account (@gmail.com).</p>
        {!user && <button onClick={login} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">Log In</button>}
      </div>
    );
  }

  const pendingCount = claims.filter((c) => c.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage lost items and review student claims</p>
      </div>

      <Tabs defaultValue="items">
        <TabsList className="mb-6">
          <TabsTrigger value="items" className="gap-2">
            <Package className="w-4 h-4" />
            Items ({items.length})
          </TabsTrigger>
          <TabsTrigger value="claims" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Claims ({claims.length})
            {pendingCount > 0 && (
              <span className="ml-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 font-medium">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <AdminItemsTab
            items={items}
            loading={loadingItems}
            onUpdateStatus={(id, status) => updateItem.mutate({ id, data: { status } })}
            onDelete={(id) => deleteItem.mutate(id)}
          />
        </TabsContent>

        <TabsContent value="claims">
          <AdminClaimsTab
            claims={claims}
            items={items}
            loading={loadingClaims}
            onUpdateClaim={(id, data) => updateClaim.mutate({ id, data })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}