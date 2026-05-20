import React from 'react';

type Props = {
  title: string;
  value: string;
  description: string;
};

const DashboardCard = ({ title, value, description }: Props) => {
  const badgeConfig = {
    label: 'Live',
    activeClass: 'bg-emerald-500/10 text-emerald-500',
  };

  return (
    <div className="max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badgeConfig.activeClass}`}
        >
          {badgeConfig.label}
        </span>
      </div>

      <div className="mt-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
