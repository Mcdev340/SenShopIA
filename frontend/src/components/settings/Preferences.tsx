'use client';

import { Switch } from '@/components/ui/Switch';

interface PreferencesProps { recommendations: boolean; marketing: boolean; onRecommendationsChange: (checked: boolean) => void; onMarketingChange: (checked: boolean) => void; }
export default function Preferences({ recommendations, marketing, onRecommendationsChange, onMarketingChange }: PreferencesProps) { return <div className="space-y-5"><div className="flex items-center justify-between gap-4"><span className="text-sm">Recommandations personnalisées</span><Switch checked={recommendations} onCheckedChange={onRecommendationsChange} /></div><div className="flex items-center justify-between gap-4"><span className="text-sm">Offres et nouveautés par email</span><Switch checked={marketing} onCheckedChange={onMarketingChange} /></div></div>; }
