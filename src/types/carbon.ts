import {
  CARBON_SOURCE,
  COUNTRY_BY_CODE,
  GHG_SCOPE,
  PCF_STAGE,
} from '@/constant/carbon';

// 원본 데이터 타입
export type CompanyDto = {
  id: string;
  name: string;
  country: string;
  emissions: GhgEmissionDto[];
};

export type GhgEmissionDto = {
  yearMonth: string;
  source: string;
  emissions: number;
};

export type PostDto = {
  id: string;
  title: string;
  resourceUid: string;
  dateTime: string;
  content: string;
};

// NOTE: 명세에 누락된 타입. 임의로 작성
export type CountryDto = {
  code: string;
  name: string;
  flag: string;
};

export type ActivityUnit = 'kWh' | 'kg' | 'ton-km';

export type EmissionFactor = {
  id: string;
  source: CarbonSourceKey;
  factor: number; // kgCO₂e per unit
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
  date: string;
  activityType: ActivityCategory;
  source: CarbonSourceKey;
  amount: number;
  unit: ActivityUnit;
};

// 프론트엔드 전용 타입으로 좁힌 도메인 타입
export type CarbonSourceKey = keyof typeof CARBON_SOURCE;

export type GhgScope = keyof typeof GHG_SCOPE;

export type PcfLifecycleStage = keyof typeof PCF_STAGE;

export type ActivityCategory = 'electricity' | 'material' | 'transport';

export type GhgEmission = {
  yearMonth: string;
  source: CarbonSourceKey;
  emissions: number; // tCO₂e
  scope: GhgScope;
  activityCategory: ActivityCategory;
  pcfStage: PcfLifecycleStage;
};

export type CountryCode = keyof typeof COUNTRY_BY_CODE;

export type Company = {
  id: string;
  name: string;
  country: string;
  emissions: GhgEmission[];
};
