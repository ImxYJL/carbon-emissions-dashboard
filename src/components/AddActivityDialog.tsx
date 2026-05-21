'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  CARBON_SOURCE,
  DISPLAY_UNIT,
  GHG_SCOPE,
  PCF_STAGE,
} from '@/constant/carbon';
import type { CompanyDto } from '@/types/api';
import type { CarbonSourceKey, RawActivity } from '@/types/carbon';

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
import { Separator } from './common/Sperator';

const CARBON_SOURCE_KEYS = Object.keys(CARBON_SOURCE) as [
  CarbonSourceKey,
  ...CarbonSourceKey[],
];

const activityFormSchema = z.object({
  companyId: z.string().min(1, '회사를 선택해주세요.'),
  date: z.string().min(1, '활동 일자를 입력해주세요.'),
  source: z.enum(CARBON_SOURCE_KEYS, {
    error: '배출원을 선택해주세요.',
  }),
  amount: z
    .number({
      error: '사용량은 숫자로 입력해주세요.',
    })
    .positive('사용량은 0보다 큰 숫자여야 합니다.'),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

type AddActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: CompanyDto[];
  onSubmit: (input: Omit<RawActivity, 'id'>) => void | Promise<void>;
  isSubmitting?: boolean;
};

const AddActivityDialog = ({
  open,
  onOpenChange,
  companies,
  onSubmit,
  isSubmitting = false,
}: AddActivityDialogProps) => {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      companyId: '',
      date: '',
      source: undefined,
      amount: undefined,
    },
  });

  const watchedSource = form.watch('source');
  const watchedAmount = form.watch('amount');

  const sourceInfo = watchedSource ? CARBON_SOURCE[watchedSource] : null;

  const previewEmissions = useMemo(() => {
    if (!sourceInfo || !watchedAmount || watchedAmount <= 0) {
      return null;
    }

    return (watchedAmount * sourceInfo.factor) / 1000;
  }, [sourceInfo, watchedAmount]);

  const handleSubmit = async (values: ActivityFormValues) => {
    const selectedSource = CARBON_SOURCE[values.source];

    await onSubmit({
      companyId: values.companyId,
      date: values.date,
      activityType: selectedSource.activityCategory,
      source: values.source,
      amount: values.amount,
      unit: selectedSource.unit,
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
      <DialogContent className="sm:max-w-[480px] max-h-[85dvh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle>활동 데이터 추가</DialogTitle>
          <DialogDescription>
            전기·원소재·운송 사용량을 입력하면 배출계수에 따라 예상 배출량과 GHG
            Scope, PCF 단계가 자동 계산됩니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* 💡 본문 영역 전체를 스크롤 컨테이너로 감싸 오와 열이 깨지지 않게 방지합니다. */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 max-h-[calc(85dvh-170px)]">
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
                        <SelectTrigger className="w-full">
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>활동 일자</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>배출원</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="배출원을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {CARBON_SOURCE_KEYS.map((sourceKey) => (
                          <SelectItem key={sourceKey} value={sourceKey}>
                            {CARBON_SOURCE[sourceKey].label}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용량</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          placeholder="0"
                          className="flex-1"
                          disabled={isSubmitting}
                          value={field.value ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value === '' ? undefined : Number(value));
                          }}
                        />
                      </FormControl>

                      <span className="w-20 shrink-0 text-sm text-muted-foreground">
                        {sourceInfo ? sourceInfo.unit : '단위'}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {sourceInfo && (
                <>
                  <Separator className="my-2" />

                  <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      계산 미리보기
                    </p>

                    <div className="grid grid-cols-2 gap-y-2.5 text-sm">
                      <span className="text-muted-foreground">예상 배출량</span>
                      <span className="font-semibold text-primary">
                        {previewEmissions !== null
                          ? `${previewEmissions.toFixed(4)} ${DISPLAY_UNIT.emissions}`
                          : '—'}
                      </span>

                      <span className="text-muted-foreground">배출계수</span>
                      <span className="font-medium">
                        {sourceInfo.factor} kgCO₂e / {sourceInfo.unit}
                      </span>

                      <span className="text-muted-foreground">GHG Scope</span>
                      <span className="font-medium">
                        {GHG_SCOPE[sourceInfo.scope].label} ·{' '}
                        {GHG_SCOPE[sourceInfo.scope].koreanLabel}
                      </span>

                      <span className="text-muted-foreground">PCF 단계</span>
                      <span className="font-medium">
                        {PCF_STAGE[sourceInfo.pcfStage].koreanLabel}
                      </span>

                      <span className="text-muted-foreground">배출계수 버전</span>
                      <span className="font-medium">{sourceInfo.version}</span>
                    </div>

                    <p className="border-t border-border pt-2 text-xs text-muted-foreground">
                      {sourceInfo.description}
                    </p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="p-6 pt-4 border-t bg-muted/20 shrink-0">
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

export default AddActivityDialog;
