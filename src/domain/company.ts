import type { CompanyDto } from '@/types/api';
import type { EmissionFactor, RawActivity } from '@/types/carbon';
import { calculateEmissionsFromActivities } from './emission';

type BuildCompaniesWithEmissionsParams = {
  baseCompanies: Omit<CompanyDto, 'emissions'>[];
  activities: RawActivity[];
  factors: EmissionFactor[];
};

export function buildCompaniesWithEmissions({
  baseCompanies,
  activities,
  factors,
}: BuildCompaniesWithEmissionsParams): CompanyDto[] {
  const emissions = calculateEmissionsFromActivities(activities, factors);

  return baseCompanies.map((company) => ({
    ...company,
    emissions: emissions.filter((emission) => emission.companyId === company.id),
  }));
}
