'use client';

import { Switch } from '@/components/ui/Switch';

interface NotificationSettingsProps { email: boolean; push: boolean; onEmailChange: (checked: boolean) => void; onPushChange: (checked: boolean) => void; }
export default function NotificationSettings({ email, push, onEmailChange, onPushChange }: NotificationSettingsProps) { return <div className="space-y-5"><div className="flex items-center justify-between gap-4"><span className="text-sm">Notifications email</span><Switch checked={email} onCheckedChange={onEmailChange} /></div><div className="flex items-center justify-between gap-4"><span className="text-sm">Notifications push</span><Switch checked={push} onCheckedChange={onPushChange} /></div></div>; }
