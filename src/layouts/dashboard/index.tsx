'use client';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSettingsContext } from 'src/components/settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <div className="flex min-h-screen flex-col items-stretch lg:flex-row">
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <div className="flex min-h-screen flex-col items-stretch lg:flex-row">
        {renderNavVertical}

        <Main>{children}</Main>
      </div>
    </>
  );
}
