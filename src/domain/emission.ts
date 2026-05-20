import type { EmissionFactor, GhgEmission, RawActivity } from '@/types/carbon';

export function findApplicableEmissionFactor(
  activity: RawActivity,
  emissionFactors: EmissionFactor[],
): EmissionFactor {
  const matchedFactor = emissionFactors.find((factor) => {
    const isSameSource = factor.source === activity.source;
    const isSameUnit = factor.unit === activity.unit;
    const isAfterValidFrom = factor.validFrom <= activity.date;
    const isBeforeValidTo = !factor.validTo || activity.date <= factor.validTo;

    return isSameSource && isSameUnit && isAfterValidFrom && isBeforeValidTo;
  });

  if (!matchedFactor) {
    throw new Error(
      `배출계수를 찾을 수 없습니다. source=${activity.source}, unit=${activity.unit}, date=${activity.date}`,
    );
  }

  return matchedFactor;
}

export function calculateEmissionFromActivity(
  activity: RawActivity,
  emissionFactors: EmissionFactor[],
): GhgEmission {
  const emissionFactor = findApplicableEmissionFactor(activity, emissionFactors);

  return {
    id: `emission-${activity.id}`,
    activityId: activity.id,
    companyId: activity.companyId,
    yearMonth: activity.date.slice(0, 7),
    source: activity.source,
    emissions: (activity.amount * emissionFactor.factor) / 1000,
    scope: emissionFactor.scope,
    activityCategory: activity.activityType,
    pcfStage: emissionFactor.pcfStage,
    emissionFactorId: emissionFactor.id,
    emissionFactorVersion: emissionFactor.version,
  };
}

export function calculateEmissionsFromActivities(
  activities: RawActivity[],
  emissionFactors: EmissionFactor[],
): GhgEmission[] {
  return activities.map((activity) =>
    calculateEmissionFromActivity(activity, emissionFactors),
  );
}
