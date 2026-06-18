import { Dayjs } from 'dayjs';

export interface BannerFormValues {
  Url: string | File;
  StartDate: Dayjs | null;
  EndDate: Dayjs | null;
  IsActive: boolean;
}
export interface Banner{
        id: string,
        url: string,
        isActive:boolean,
        startDate: string,
        endDate: string
}