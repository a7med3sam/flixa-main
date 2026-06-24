import { useTranslations } from 'next-intl';
import AuthClassicLayout from 'src/layouts/auth/classic';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const t = useTranslations();
  return (
    <AuthClassicLayout title={t('Global.title')} image="/assets/Bg.jpg">
      {children}
    </AuthClassicLayout>
  );
}
