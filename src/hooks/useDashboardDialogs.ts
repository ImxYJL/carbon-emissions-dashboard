'use client';

import { useState } from 'react';

const useDashboardDialogs = () => {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  return {
    isActivityDialogOpen,
    setIsActivityDialogOpen,
    isNoteDialogOpen,
    setIsNoteDialogOpen,
  };
};

export default useDashboardDialogs;
