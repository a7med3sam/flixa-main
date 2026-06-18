
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { Employee, EmployeePermission } from 'src/types/employee';
import EmployeeDetailsView from 'src/sections/employee/details/views/new-edit-view';

interface Props {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<
  Record<'page' | 'limit' |'search'|'PaymentMethodId'| 'status' | 'RegistrationDate', string | undefined>
>;
}


export default async function Page({ params }: Props) {
  const  {employeeId}  =await params;


  const employeeDetails= await getData<Employee>(endpoints.employee.single(employeeId));
  if ('error' in employeeDetails) {
    throw new Error(employeeDetails.error);
  }

  const permissionList = await getData<{ totalCount: number; items: EmployeePermission[] }>(
    endpoints.employee.listPermissions
  );
    
  
  if ('error' in permissionList) {
    throw new Error(permissionList.error);
  }

  return <EmployeeDetailsView
  employeeDetails={employeeDetails?.data}
  permissionList={permissionList?.data.items}
  />
}