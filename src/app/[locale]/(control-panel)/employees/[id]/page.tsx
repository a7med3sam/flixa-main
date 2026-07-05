import EmployeeView from 'src/sections/employee/employee-view';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ViewEmployeePage({ params }: Props) {
  const { id } = await params;
  return <EmployeeView id={id} />;
}
