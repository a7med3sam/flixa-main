import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { DriverDetailsType } from 'src/types/driver';
import EditDriverView from 'src/sections/drivers/views/new-edit-view';

interface Props {
  params: Promise<{ driverId: string }>;
}

export default async function Page({ params }: Props) {
  const  {driverId}  =await params;

  const driverDetails = await getData<DriverDetailsType>(endpoints.drivers.single(driverId));
  if ('error' in driverDetails) {
    throw new Error(driverDetails.error);
  }
  return <EditDriverView 
      driver={driverDetails.data} 
         />;
  }
