// 탄소 계산 도메인에서 공통으로 사용하는 타입
// Excel 원천 활동 데이터, 배출계수, 계산 완료된 GhgEmission
import {
  CARBON_SOURCE,
  COUNTRY_BY_CODE,
  GHG_SCOPE,
  PCF_STAGE,
} from '@/constant/carbon';

export type CarbonSourceKey = keyof typeof CARBON_SOURCE;

export type GhgScope = keyof typeof GHG_SCOPE;

export type PcfLifecycleStage = keyof typeof PCF_STAGE;

export type CountryCode = keyof typeof COUNTRY_BY_CODE;

export type ActivityCategory =
  (typeof CARBON_SOURCE)[CarbonSourceKey]['activityCategory'];

export type ActivityUnit = (typeof CARBON_SOURCE)[CarbonSourceKey]['unit'];

export type EmissionFactor = {
  id: string;
  source: CarbonSourceKey;
  factor: number; // kgCO₂e per activity unit
  unit: ActivityUnit;
  scope: GhgScope;
  pcfStage: PcfLifecycleStage;
  version: string;
  validFrom: string;
  validTo?: string;
};

export type RawActivity = {
  id: string;
  companyId: string;
  date: string; // YYYY-MM-DD
  activityType: ActivityCategory;
  source: CarbonSourceKey;
  amount: number;
  unit: ActivityUnit;
};

export type GhgEmission = {
  id: string;
  activityId: string;
  companyId: string;
  yearMonth: string; // YYYY-MM
  source: CarbonSourceKey;
  emissions: number; // tCO₂e
  scope: GhgScope;
  activityCategory: ActivityCategory;
  pcfStage: PcfLifecycleStage;
  emissionFactorId: string;
  emissionFactorVersion: string;
};
