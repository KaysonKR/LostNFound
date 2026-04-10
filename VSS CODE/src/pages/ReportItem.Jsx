import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PhotoUpload from '@/components/report/PhotoUpload';
import { Loader2, CheckCircle2, ShieldOff } from 'lucide-react';
import { useAuthUser } from '@/lib/AuthUserContext';

const CATEGORIES = [
  'Jacket/Outerwear', 'Pants/Shorts', 'Shoes', 'Shirts',
  'Lunchbox', 'Backpack', 'Water Bottles', 'Accessories',
  'Private Belonging', 'Others',
];

const INITIAL = {
  title: '',
  category: '',
  date_found: '',
  physical_description: '',
  location_found: '',
  photo_front: '',
  photo_back: '',
  photo_side: '',
  status: 'available',
};

export default function ReportItem() {
  const { isTeacher, user, login } = useAuthUser();
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.LostItem.create(form);
    setSubmitting(false);
    setSubmitted(true);
  };

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

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="font-heading font-bold text-2xl">Item Posted!</h2>
        <p className="text-muted-foreground">The item has been added to the Lost & Found board.</p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => { setForm(INITIAL); setSubmitted(false); }}>
            Post Another
          </Button>
          <Button onClick={() => navigate('/search')}>View All Items</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Report a Found Item</CardTitle>
          <CardDescription>
            Fill out the details and upload photos so the owner can find their item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Item Name *</Label>
                <Input
                  placeholder="e.g. Blue Nike Jacket"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => set('category', v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Date Found *</Label>
                <Input
                  type="date"
                  value={form.date_found}
                  onChange={(e) => set('date_found', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Location Found</Label>
                <Input
                  placeholder="e.g. Gym, Room 204"
                  value={form.location_found}
                  onChange={(e) => set('location_found', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Physical Description *</Label>
              <Textarea
                placeholder="Color, size, brand, distinguishing features..."
                className="min-h-[100px]"
                value={form.physical_description}
                onChange={(e) => set('physical_description', e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="mb-3 block">Photos</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PhotoUpload label="Front *" value={form.photo_front} onChange={(v) => set('photo_front', v)} />
                <PhotoUpload label="Back" value={form.photo_back} onChange={(v) => set('photo_back', v)} />
                <PhotoUpload label="Side (optional)" value={form.photo_side} onChange={(v) => set('photo_side', v)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setForm(INITIAL)}>
                Clear
              </Button>
              <Button type="submit" disabled={submitting} className="gap-2 min-w-[140px]">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Post Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}