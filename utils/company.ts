import type { CompanyInfo } from "@/app/types/client-profile"

export const getCompanyName = (company: string | CompanyInfo | undefined): string => {
  if (!company) return '';
  if (typeof company === 'string') return company;
  return company.name || '';
}

export const getCompanyInfo = (company: string | CompanyInfo | undefined): Partial<CompanyInfo> => {
  if (!company) return {};
  if (typeof company === 'string') return { name: company };
  return company;
}