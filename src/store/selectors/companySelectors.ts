import type { RootState } from '../index';

export const selectCompanyProfile = (state: RootState) => state.company.profile;
export const selectAllCompanies = (state: RootState) => state.company.companies;
