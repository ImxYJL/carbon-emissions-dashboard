import React from 'react';

type SectionHeaderProps = {
  title: string;
  description: string;
  size?: 'main' | 'sub';
};

const SectionHeader = ({ title, description, size = 'sub' }: SectionHeaderProps) => {
  const isMain = size === 'main';

  return (
    <div className={isMain ? 'mb-8' : 'mb-4'}>
      <h2
        className={
          isMain
            ? 'text-3xl font-bold tracking-tight text-foreground'
            : 'text-lg font-semibold text-foreground'
        }
      >
        {title}
      </h2>
      <p
        className={
          isMain
            ? 'mt-2 text-base text-muted-foreground'
            : 'mt-1 text-sm text-muted-foreground'
        }
      >
        {description}
      </p>
    </div>
  );
};

export default SectionHeader;
