import { calculateEmissionFromActivity } from './emission';
import { EMISSION_FACTORS } from '@/data/seed';
import { describe, expect, it } from '@jest/globals';

describe('calculateEmissionFromActivity', () => {
  it('전기 사용량을 tCO₂e 배출량으로 변환한다', () => {
    const result = calculateEmissionFromActivity(
      {
        id: 'activity-001',
        companyId: 'c1',
        date: '2025-01-01',
        activityType: 'electricity',
        source: 'koreaElectricPower',
        amount: 110,
        unit: 'kWh',
      },
      EMISSION_FACTORS,
    );

    // 110 × 0.456 / 1000 = 0.05016
    expect(result).toMatchObject({
      yearMonth: '2025-01',
      source: 'koreaElectricPower',
      scope: 'scope2',
      pcfStage: 'manufacturingEnergy',
    });

    expect(result.emissions).toBeCloseTo(0.05016, 5);
  });
});

it('원소재 사용량을 tCO₂e 배출량으로 변환한다', () => {
  const result = calculateEmissionFromActivity(
    {
      id: 'activity-010',
      companyId: 'c2',
      date: '2025-01-01',
      activityType: 'material',
      source: 'plastic1',
      amount: 230,
      unit: 'kg',
    },
    EMISSION_FACTORS,
  );

  // 230 × 2.3 / 1000 = 0.529
  expect(result).toMatchObject({
    yearMonth: '2025-01',
    source: 'plastic1',
    scope: 'scope3',
    pcfStage: 'rawMaterial',
  });

  expect(result.emissions).toBeCloseTo(0.529, 5);
});

it('운송량을 tCO₂e 배출량으로 변환한다', () => {
  const result = calculateEmissionFromActivity(
    {
      id: 'activity-022',
      companyId: 'c3',
      date: '2025-01-01',
      activityType: 'transport',
      source: 'truck',
      amount: 41,
      unit: 'ton-km',
    },
    EMISSION_FACTORS,
  );

  // 41 × 3.5 / 1000 = 0.1435 tCO₂e
  expect(result).toMatchObject({
    yearMonth: '2025-01',
    source: 'truck',
    scope: 'scope3',
    pcfStage: 'transportDistribution',
  });

  expect(result.emissions).toBeCloseTo(0.1435, 5);
});
