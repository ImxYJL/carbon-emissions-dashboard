import { COUNTRY_BY_CODE } from '@/constant/carbon';
import { CompanyDto, CountryDto, PostDto } from '@/types/carbon';

// NOTE: 과제에서 제시된 companies 상수에서, emission key의 source가 누락되어 타입 정의에 맞게 임의로 추가
export const COMPANIES: CompanyDto[] = [
  {
    id: 'c1',
    name: 'Acme Corp',
    country: 'US',
    emissions: [
      { yearMonth: '2024-01', source: 'gasoline', emissions: 120 },
      { yearMonth: '2024-02', source: 'electricity', emissions: 110 },
      { yearMonth: '2024-03', source: 'diesel', emissions: 95 },
    ],
  },
  {
    id: 'c2',
    name: 'Globex',
    country: 'DE',
    emissions: [
      { yearMonth: '2024-01', source: 'electricity', emissions: 80 },
      { yearMonth: '2024-02', source: 'lng', emissions: 105 },
      { yearMonth: '2024-03', source: 'diesel', emissions: 120 },
    ],
  },
];

export const POSTS: PostDto[] = [
  {
    id: 'p1',
    title: 'Sustainability Report',
    resourceUid: 'c1',
    dateTime: '2024-02',
    content: 'Quarterly CO2 update',
  },
];

export const COUNTRIES: CountryDto[] = Object.values(COUNTRY_BY_CODE);

const _countries = [...COUNTRIES];
const _companies = [...COMPANIES];
let _posts = [...POSTS];

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
