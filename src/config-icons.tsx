import SvgColor from './components/svg-color';

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/${name}.svg`} sx={{ width: '1em', height: '1em' }} />
);

export const ICONS = {
  navbar: {
    main: icon('navbar/ic_main'),
    categories: icon('navbar/ic_categories'),
    subCategories: icon('navbar/ic_subcategories'),
    products: icon('navbar/ic_products'),
    orders: icon('navbar/ic_orders'),
    returnedOrders: icon('navbar/ic_returned_orders'),
    marketings: icon('navbar/ic_marketings'),
    workArea: icon('navbar/ic_work_area'),
    users: icon('navbar/ic_users'),
    reports: icon('navbar/ic_reports'),
    policy: icon('navbar/ic_policy'),
    contactUs: icon('navbar/ic_contact_us'),
    deliveryFees: icon('navbar/ic_delivery_fees'),
   },
  global: {
    eye: icon('global/ic_eye'),
    eyeClosed: icon('global/ic_eye_closed'),
    edit: icon('global/ic_edit'),
    delete: icon('global/ic_delete'),
    link: icon('global/ic_link'),
    externalLink: icon('global/ic_external_link'),
    search: icon('global/ic_search'),
    add: icon('global/ic_plus'),
    update: icon('/global/ic_update.svg'),
    x: icon('global/ic_x'),
    deleteCircle: icon('global/ic_delete_circle'),
    settingsRounded: icon('global/ic_settings_rounded'),
    block: icon('global/ic_block'),
    brokenImage: icon('global/ic_broken_image'),
    info: icon('global/ic_info'),
    active: icon('global/active'),
    trendingDown: icon('global/ic_trending_down'),
    trendingUp: icon('global/ic_trending_up'),
    drivers: icon('global/ic_drivers'),
  },
  SocialIcons:{
    gmail:icon('social-icons/ic_gmail'),
    wats:icon('social-icons/ic_wats'),
    facebook:icon('social-icons/ic_facebook'),
    instagram:icon('social-icons/ic_instagram'),
    telegram:icon('social-icons/ic_telegram'),
    snapchat:icon('social-icons/ic_snapchat'),
    tiktok:icon('social-icons/ic_tiktok'),
  }
};
