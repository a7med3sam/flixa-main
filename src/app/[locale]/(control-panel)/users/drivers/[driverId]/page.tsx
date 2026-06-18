import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import DriverDetails from 'src/sections/drivers/driver-details/list-view-details';

interface Props {
  params: Promise<{ driverId: string }>;
}

export default async function Page({ params }: Props) {
  const  {driverId}  =await params;

  const driverDetails = await getData<any>(endpoints.drivers.single(driverId));
  if ('error' in driverDetails) {
    throw new Error(driverDetails.error);
  }
       return <DriverDetails
        driverDetails={driverDetails?.data} 
         />;
  }