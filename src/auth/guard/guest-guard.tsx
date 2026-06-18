type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  return <>{children}</>;
}
