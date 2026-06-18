import 'src/global.css';
import ThemeProvider from 'src/theme';
import { notFound } from 'next/navigation';
import { routing } from 'src/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import ProgressBar from 'src/components/progress-bar';
import { localesSettings } from 'src/i18n/config-locale';
import { SnackbarProvider } from 'src/components/snackbar';
import { getMessages, getTranslations } from 'next-intl/server';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import LocalizationProvider from 'src/components/localization-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;


  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const { dir } = localesSettings[locale];

  return (
    <main lang={locale} dir={dir} style={{ minHeight: '100vh' }}>
      <NextIntlClientProvider messages={messages}>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: dir, //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <LocalizationProvider>
              <MotionLazy>
                <SnackbarProvider>
                  <SettingsDrawer />
                  <ProgressBar />
                  {children}
                </SnackbarProvider>
              </MotionLazy>
            </LocalizationProvider>
          </ThemeProvider>
        </SettingsProvider>
      </NextIntlClientProvider>
    </main>
  );
}

export async function generateMetadata({params}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}
