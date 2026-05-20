// fake API에서 반환하는 대시보드 데이터 타입
// CompanyDto.emissions는 Excel 원천 활동 데이터와 배출계수를 통해 계산된 GhgEmission[]
import type { CountryCode } from './carbon';
import type { GhgEmission } from './carbon';

export type CompanyDto = {
  id: string;
  name: string;
  country: CountryCode;
  emissions: GhgEmission[];
};

export type PostDto = {
  id: string;
  title: string;
  resourceUid: string; // CompanyDto.id
  dateTime: string; // YYYY-MM
  content: string;
};

// NOTE: 과제 문서에서 Company.country는 Country.code를 참조하지만 Country 타입과 seed data는 없었음
// -> 임의로 지정한 국가 코드 상수 기준으로 CountryDto 정의
export type CountryDto = {
  code: CountryCode;
  name: string;
  flag: string;
};
