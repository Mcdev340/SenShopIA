'use client';

import { ReactNode } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export interface WorkspaceAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface WorkspacePageProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: WorkspaceAction[];
  children?: ReactNode;
}

export default function WorkspacePage({
  eyebrow = 'ShopSense AI',
  title,
  description,
  actions = [],
  children,
}: WorkspacePageProps) {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 border-b border-gray-200 pb-8 dark:border-gray-800">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-600 dark:text-primary-400">
          {eyebrow}
        </p>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  asChild={Boolean(action.href)}
                  onClick={action.onClick}
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  {action.href ? <a href={action.href}>{action.label}</a> : action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </header>
      {children || (
        <Card>
          <CardHeader>
            <CardTitle>Tout est prêt</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <p>Cette section est configurée et prête à recevoir vos données.</p>
            </div>
          </CardBody>
        </Card>
      )}
    </main>
  );
}
