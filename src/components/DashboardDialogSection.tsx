import type { CompanyDto, PostDto } from '@/types/api';
import {
  useCreateActivityMutation,
  useCreateOrUpdatePostMutation,
} from '@/queries/carbon';
import { RawActivity } from '@/types/carbon';
import AddActivityDialog from './AddActivityDialog';
import AddNoteDialog from './AddNoteDialog';

type DashboardDialogSectionProps = {
  companies: CompanyDto[];
  isActivityDialogOpen: boolean;
  onActivityDialogOpenChange: (open: boolean) => void;
  isNoteDialogOpen: boolean;
  onNoteDialogOpenChange: (open: boolean) => void;
};

const DashboardDialogSection = ({
  companies,
  isActivityDialogOpen,
  onActivityDialogOpenChange,
  isNoteDialogOpen,
  onNoteDialogOpenChange,
}: DashboardDialogSectionProps) => {
  const createActivityMutation = useCreateActivityMutation();
  const createOrUpdatePostMutation = useCreateOrUpdatePostMutation();

  const handleCreateActivity = async (input: Omit<RawActivity, 'id'>) => {
    await createActivityMutation.mutateAsync(input);
  };

  const handleCreateNote = async (input: Omit<PostDto, 'id'>) => {
    await createOrUpdatePostMutation.mutateAsync(input);
  };

  return (
    <>
      <AddActivityDialog
        open={isActivityDialogOpen}
        onOpenChange={onActivityDialogOpenChange}
        companies={companies}
        onSubmit={handleCreateActivity}
        isSubmitting={createActivityMutation.isPending}
      />

      <AddNoteDialog
        open={isNoteDialogOpen}
        onOpenChange={onNoteDialogOpenChange}
        companies={companies}
        onSubmit={handleCreateNote}
        isSubmitting={createOrUpdatePostMutation.isPending}
      />
    </>
  );
};

export default DashboardDialogSection;
