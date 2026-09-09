'use client';

import { ReactNode } from 'react';
import { Activity, ArrowUpRight, BarChart3, Clock3 } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export interface Metric {
  label: string;
  value: string;
  change?: string;
}

interface OperationsPageProps {
  title: string;
  description: string;
  metrics?: Metric[];
  children?: ReactNode;
}

export default function OperationsPage({
  title,
  description,
  metrics = [],
  children,
}: OperationsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-600 dark:text-primary-400">
          Espace opérations
        </p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 dark:text-white sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">{description}</p>
          </div>
          <Activity className="h-8 w-8 text-primary-600" aria-hidden="true" />
        </div>
      </div>
      {metrics.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={metric.label} padding="lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">{metric.value}</p>
                </div>
                {index % 2 === 0 ? (
                  <BarChart3 className="h-5 w-5 text-primary-600" />
                ) : (
                  <Clock3 className="h-5 w-5 text-amber-600" />
                )}
              </div>
              {metric.change && (
                <p className="mt-4 flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" /> {metric.change}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
      {children || (
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 dark:text-gray-300">Aucune activité à afficher pour le moment.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
