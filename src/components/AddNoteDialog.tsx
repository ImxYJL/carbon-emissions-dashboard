'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { CompanyDto, PostDto } from '@/types/api';
import { Button } from './common/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './common/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './common/Form';
import { Input } from './common/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './common/Select';
import { Textarea } from './common/Textarea';

const noteFormSchema = z.object({
  companyId: z.string().min(1, '회사를 선택해주세요.'),
  dateTime: z
    .string()
    .regex(/^\d{4}-\d{2}$/, '기준 월은 YYYY-MM 형식이어야 합니다.'),
  title: z.string().trim().min(1, '제목을 입력해주세요.'),
  content: z.string().trim().min(1, '내용을 입력해주세요.'),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

type AddNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: CompanyDto[];
  onSubmit: (input: Omit<PostDto, 'id'>) => void | Promise<void>;
  isSubmitting?: boolean;
};

const AddNoteDialog = ({
  open,
  onOpenChange,
  companies,
  onSubmit,
  isSubmitting = false,
}: AddNoteDialogProps) => {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      companyId: '',
      dateTime: '',
      title: '',
      content: '',
    },
  });

  const handleSubmit = async (values: NoteFormValues) => {
    await onSubmit({
      resourceUid: values.companyId,
      dateTime: values.dateTime,
      title: values.title.trim(),
      content: values.content.trim(),
    });

    form.reset();
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
    }

    onOpenChange(nextOpen);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>산정 메모 추가</DialogTitle>
          <DialogDescription>
            특정 회사와 기준 월에 대한 배출량 변화의 배경이나 산정 근거를 기록합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사/계열사</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="회사를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>기준 월</FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      placeholder="YYYY-MM"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="메모 제목을 입력하세요"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="산정 근거나 변화에 대한 설명을 입력하세요"
                      rows={4}
                      className="resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : '저장'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
