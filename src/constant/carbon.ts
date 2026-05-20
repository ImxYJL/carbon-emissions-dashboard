export const CARBON_SOURCE = {
  koreaElectricPower: {
    label: '한국전력',
    englishLabel: 'Korea Electric Power',
    activityCategory: 'electricity',
    scope: 'scope2',
    pcfStage: 'manufacturingEnergy',
    factor: 0.456,
    unit: 'kWh',
    description: '구매 전력 사용으로 인한 간접 배출입니다.',
  },
  plastic1: {
    label: '플라스틱 1',
    englishLabel: 'Plastic 1',
    activityCategory: 'material',
    scope: 'scope3',
    pcfStage: 'rawMaterial',
    factor: 2.3,
    unit: 'kg',
    description: '구매 원소재의 생산 과정에서 발생한 가치사슬 배출입니다.',
  },
  plastic2: {
    label: '플라스틱 2',
    englishLabel: 'Plastic 2',
    activityCategory: 'material',
    scope: 'scope3',
    pcfStage: 'rawMaterial',
    factor: 3.2,
    unit: 'kg',
    description: '구매 원소재의 생산 과정에서 발생한 가치사슬 배출입니다.',
  },
  truck: {
    label: '트럭',
    englishLabel: 'Truck',
    activityCategory: 'transport',
    scope: 'scope3',
    pcfStage: 'transportDistribution',
    factor: 3.5,
    unit: 'ton-km',
    description: '운송 및 유통 과정에서 발생한 가치사슬 배출입니다.',
  },
} as const;

export const GHG_SCOPE = {
  scope1: {
    label: 'Scope 1',
    koreanLabel: '직접 배출',
    description:
      '회사가 소유하거나 통제하는 설비·차량 등에서 직접 발생한 배출입니다. 현재 제공 데이터에는 Scope 1 활동이 포함되어 있지 않습니다.',
    order: 1,
  },
  scope2: {
    label: 'Scope 2',
    koreanLabel: '구매 에너지 간접 배출',
    description: '구매한 전기, 열, 스팀 사용으로 인해 발생한 간접 배출입니다.',
    order: 2,
  },
  scope3: {
    label: 'Scope 3',
    koreanLabel: '가치사슬 간접 배출',
    description: '원소재, 운송 등 회사 가치사슬에서 발생하는 기타 간접 배출입니다.',
    order: 3,
  },
} as const;

export const PCF_STAGE = {
  rawMaterial: {
    label: 'Raw Material',
    koreanLabel: '원재료 단계',
    description: '제품 생산에 투입되는 원소재와 관련된 배출입니다.',
    order: 1,
  },
  manufacturingEnergy: {
    label: 'Manufacturing Energy',
    koreanLabel: '제조 에너지',
    description: '제품 제조 과정에서 사용되는 전기 등 에너지 사용 배출입니다.',
    order: 2,
  },
  transportDistribution: {
    label: 'Transport / Distribution',
    koreanLabel: '운송·유통',
    description: '원재료 또는 제품 운송 과정에서 발생하는 배출입니다.',
    order: 3,
  },
} as const;

export const COUNTRY_BY_CODE = {
  KR: { code: 'KR', name: '대한민국', flag: '🇰🇷' },
  US: { code: 'US', name: '미국', flag: '🇺🇸' },
  DE: { code: 'DE', name: '독일', flag: '🇩🇪' },
} as const;
