'use client';

import Logo from 'src/components/logo';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { NavSectionMini } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <div className="shrink-0 lg:w-[88px]">
      <NavToggleButton style={{ insetInlineStart: NAV.W_MINI - 12 }} />

      <div
        className="fixed min-h-full w-[88px] overflow-x-hidden bg-white pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ borderInlineEnd: '1px solid rgba(145, 158, 171, 0.16)' }}
      >
        <div className="mx-auto w-[50px]">
          <Logo sx={{ my: 2, maxWidth: '100%', color: '#212B36' }} />
        </div>

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </div>
    </div>
  );
}
