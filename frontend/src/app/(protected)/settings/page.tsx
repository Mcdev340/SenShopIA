'use client';

import { useState } from 'react';
import { useAuth, useUI, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { 
  Settings, 
  Globe, 
  Bell, 
  Palette, 
  Moon, 
  Sun, 
  Monitor,
  Mail,
  Smartphone,
  MessageCircle,
  Save,
  Loader2,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

const currencies = [
  { value: 'XOF', label: 'FCFA (XOF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar US (USD)' },
];

const timezones = [
  { value: 'Africa/Dakar', label: 'Dakar (GMT+0)' },
  { value: 'Africa/Abidjan', label: 'Abidjan (GMT+0)' },
  { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
];

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, setTheme, language, setLanguage } = useUI();
  const { success } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    language: language || 'fr',
    currency: 'XOF',
    timezone: 'Africa/Dakar',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLanguage(settings.language as 'fr' | 'en');
      success('Paramètres enregistrés');
    } catch (error) {
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Settings className="w-6 h-6 mr-2 text-primary-600" />
          Paramètres
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gérez vos préférences et paramètres
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Palette className="w-5 h-5 mr-2 text-gray-400" />
            Apparence
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Thème
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', label: 'Clair', icon: Sun },
                { value: 'dark', label: 'Sombre', icon: Moon },
                { value: 'system', label: 'Système', icon: Monitor },
              ].map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                      isActive
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', isActive && 'text-primary-600 dark:text-primary-400')} />
                    <span className={cn('text-sm', isActive && 'text-primary-600 dark:text-primary-400 font-medium')}>
                      {option.label}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-primary-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Globe className="w-5 h-5 mr-2 text-gray-400" />
            Langue et région
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Langue
              </label>
              <Select
                options={languages}
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Devise
              </label>
              <Select
                options={currencies}
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fuseau horaire
              </label>
              <Select
                options={timezones}
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gray-400" />
            Notifications
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications par email
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recevez des notifications par email
                  </p>
                </div>
              </div>
              <Checkbox
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: !!checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications push
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recevez des notifications push
                  </p>
                </div>
              </div>
              <Checkbox
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: !!checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications SMS
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recevez des notifications par SMS
                  </p>
                </div>
              </div>
              <Checkbox
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: !!checked })}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Marketing */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Communications marketing
          </h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Offres promotionnelles
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recevez nos offres spéciales
              </p>
            </div>
            <Checkbox
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: !!checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Newsletter
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recevez notre newsletter mensuelle
              </p>
            </div>
            <Checkbox
              checked={settings.newsletter}
              onCheckedChange={(checked) => setSettings({ ...settings, newsletter: !!checked })}
            />
          </div>
        </CardBody>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>
    </div>
  );
}