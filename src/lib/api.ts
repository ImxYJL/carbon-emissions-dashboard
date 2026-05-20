import {
  RAW_COMPANIES,
  COUNTRIES,
  POSTS,
  EMISSION_FACTORS,
  RAW_ACTIVITIES,
} from '@/data/seed';
import { buildCompaniesWithEmissions } from '@/domain/company';
import { calculateEmissionFromActivity } from '@/domain/emission';
import { PostDto } from '@/types/api';
import { RawActivity } from '@/types/carbon';

const _countries = [...COUNTRIES];
let _posts = [...POSTS];
let _rawActivities = [...RAW_ACTIVITIES];
const _emissionFactors = [...EMISSION_FACTORS];

let _companies = buildCompaniesWithEmissions({
  baseCompanies: RAW_COMPANIES,
  activities: _rawActivities,
  factors: _emissionFactors,
});

// API 모킹 함수
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

export async function fetchCountries() {
  await delay(jitter());
  return _countries;
}

export async function fetchCompanies() {
  await delay(jitter());
  return _companies;
}

export async function fetchPosts() {
  await delay(jitter());
  return _posts;
}

export async function createOrUpdatePost(p: Omit<PostDto, 'id'> & { id?: string }) {
  await delay(jitter());
  if (maybeFail()) throw new Error('Save failed');
  if (p.id) {
    _posts = _posts.map((x) => (x.id === p.id ? (p as PostDto) : x));
    return p as PostDto;
  }
  const created = { ...p, id: crypto.randomUUID() };
  _posts = [..._posts, created];
  return created;
}

export async function createActivity(input: Omit<RawActivity, 'id'>) {
  await delay(jitter());

  if (maybeFail()) {
    throw new Error('Save failed');
  }

  const createdActivity: RawActivity = {
    ...input,
    id: crypto.randomUUID(),
  };

  const createdEmission = calculateEmissionFromActivity(
    createdActivity,
    _emissionFactors,
  );

  _rawActivities = [..._rawActivities, createdActivity];

  _companies = _companies.map((company) =>
    company.id === createdActivity.companyId
      ? {
          ...company,
          emissions: [...company.emissions, createdEmission],
        }
      : company,
  );

  return createdActivity;
}
