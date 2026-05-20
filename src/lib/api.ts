import { RAW_COMPANIES, COUNTRIES, POSTS } from '@/data/seed';
import { PostDto } from '@/types/carbon';

const _countries = [...COUNTRIES];
const _companies = [...RAW_COMPANIES];
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
