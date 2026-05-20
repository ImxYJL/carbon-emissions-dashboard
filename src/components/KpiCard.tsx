'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './common/Card';
import { cn } from '@/lib/style';

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  highlighted?: boolean;
  description?: string;
};

const KpiCard = ({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  highlighted = false,
  description,
}: KpiCardProps) => {
  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  return (
    <Card
      className={cn(
        'py-0',
        highlighted
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card',
      )}
    >
      <CardContent className="p-5">
        <p
          className={cn(
            'text-sm font-medium',
            highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          {title}
        </p>

        <p className="text-2xl font-bold tracking-tight mt-1">{value}</p>

        {subtitle && (
          <p
            className={cn(
              'text-xs mt-1',
              highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground',
            )}
          >
            {subtitle}
          </p>
        )}

        {change !== undefined && (
          <div className="flex items-center gap-1 mt-3">
            {isPositiveChange ? (
              <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            ) : isNegativeChange ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            ) : null}

            <span
              className={cn(
                'text-xs font-semibold',
                isPositiveChange
                  ? highlighted
                    ? 'text-red-300'
                    : 'text-red-500'
                  : isNegativeChange
                    ? highlighted
                      ? 'text-emerald-300'
                      : 'text-emerald-500'
                    : highlighted
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground',
              )}
            >
              {change > 0 ? '+' : ''}
              {change}%
            </span>

            {changeLabel && (
              <span
                className={cn(
                  'text-xs',
                  highlighted
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground',
                )}
              >
                {changeLabel}
              </span>
            )}
          </div>
        )}

        {description && (
          <p
            className={cn(
              'text-xs mt-3 pt-3 border-t',
              highlighted
                ? 'border-primary-foreground/15 text-primary-foreground/60'
                : 'border-border text-muted-foreground',
            )}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
