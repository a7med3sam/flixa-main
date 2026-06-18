import { Drivers } from 'src/types/driver';
import { Clients } from 'src/types/clients';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import NewNotification from 'src/sections/notifications/views/new-notifications';

export default async function Page() {
  const clientList = await getData<{ totalCount: number; totalBlocked: number;totalActive: number; items: Clients[] }>(
     `${endpoints.clients.list}?Limit=100`,
   );
 
   if ('error' in clientList) {
     throw new Error(clientList.error);
   }
   const driverList = await getData<{ totalCount: number; items: Drivers[]}>(
       `${endpoints.drivers.list}?MaxResultCount=100`,
     );
   
     if ('error' in driverList) {
       throw new Error(driverList.error);
     }
  return <NewNotification clients={clientList?.data?.items} drivers={driverList?.data?.items}/>;
}
