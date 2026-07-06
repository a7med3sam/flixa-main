import EmployeeForm from 'src/sections/employee/employee-form';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditEmployeePage({ params }: Props) {
  const { id } = await params;
  return <EmployeeForm mode="edit" employeeId={id} />;
}
