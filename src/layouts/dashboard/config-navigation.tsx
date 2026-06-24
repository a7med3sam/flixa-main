'use client';

import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { ICONS } from 'src/config-icons';

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      {
        items: [
          {
            title: 'main',
            path: paths.dashboard.main,
            icon: ICONS.navbar.main,
          },
          {
            title: 'users',
            path: paths.dashboard.users.list,
            icon: ICONS.navbar.users,
          },
          {
            title: 'commissions',
            path: paths.dashboard.commissions.list,
            icon: ICONS.navbar.marketings,
          },
          {
            title: 'reports',
            path: paths.dashboard.reports.list,
            icon: ICONS.navbar.reports,
          },
          {
            title: 'financial',
            path: paths.dashboard.financial.list,
            icon: ICONS.navbar.products,
          },
          {
            title: 'content',
            path: paths.dashboard.content.aboutUs,
            icon: ICONS.navbar.policy,
            children: [
              {
                title: 'content_title',
                path: paths.dashboard.content.aboutUs,
              },
              {
                title: 'about-us',
                path: paths.dashboard.content.aboutUs,
              },
              {
                title: 'terms',
                path: paths.dashboard.content.termsConditions,
              },
              {
                title: 'privacy-policy',
                path: paths.dashboard.content.privacyPolicy,
              },
            ],
          },
          {
            title: 'contact-us',
            path: paths.dashboard.messages.list,
            icon: ICONS.navbar.contactUs,
          },
          {
            title: 'notifications',
            path: paths.dashboard.notifications.list,
            icon: ICONS.navbar.marketings,
          },
        ],
      },
    ],
    []
  );

  return data;
}
