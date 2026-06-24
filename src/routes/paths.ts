export const paths = {
  // AUTH
  auth: {
    login: '/auth/login',
    forgotPassword: '/auth/forgot-password',
  },
  // Control Panel
  controlPanel: {
    main: '/',
    profile: {
      viewProfileEdit: '/edit-profile',
    },
    users: {
      clients: {
        list: '/clients',
        single: (id: string) => `/clients/${id}`,
      },
      employee: {
        list: '/employee',
        register: '/employee/register',
        edit: (id: string) => `/employee/edit/${id}`,
      },
      drivers: {
        list: '/drivers',
        single: (id: string) => `/drivers/${id}`,
        edit: (id: string) => `/drivers/edit/${id}`,
        driverOrders: (id: string) => `/drivers/${id}/orders`,
      },
    },
    workArea: {
      list: '/work-area',
      new: '/work-area/new',
      edit: (id: string) => `/work-area/edit/${id}`,
    },
    products: {
      list: '/products',
      new: '/products/new',
      single: (id: string) => `/products/${id}`,
      details: (id: string) => `/products/${id}/details`,
    },
    categories: {
      list: '/categories',
      single: (id: string) => `/categories/${id}`,
    },
    subCategories: {
      list: '/sub-categories',
      single: (id: string) => `/sub-categories/${id}`,
    },
    orders: {
      list: '/orders',
      single: (id: string) => `/orders/${id}`,
    },
    returnOrders: {
      list: '/return-orders',
      single: (id: string) => `/return-orders/${id}`,
    },
    marketings: {
      banners: {
        list: '/banners',
        new: '/banners/new',
        edit: (id: string) => `/banners/edit/${id}`,
      },
      barcodeDiscount: {
        list: '/barcode-discount',
        new: '/barcode-discount/new',
      },
      offers: {
        list: '/offers',
        new: '/offers/new',
        edit: (id: string) => `/offers/edit/${id}`,
      },
      notifications: {
        list: '/notifications',
        new: '/notifications/new',
      },
    },
  },
  // Dashboard
  dashboard: {
    main: '/',
    users: {
      list: '/users',
      single: (id: string) => `/users/${id}`,
      edit: (id: string) => `/users/edit/${id}`,
    },
    commissions: {
      list: '/commissions',
      single: (id: string) => `/commissions/${id}`,
      edit: (id: string) => `/commissions/edit/${id}`,
    },
    reports: {
      list: '/reports',
      statistics: '/reports/statistics',
    },
    financial: {
      list: '/financial-reports',
      details: (id: string) => `/financial-reports/${id}`,
    },
    content: {
      content: '/content/about-us',
      aboutUs: '/content/about-us',
      termsConditions: '/content/terms-conditions',
      privacyPolicy: '/content/privacy-policy',
    },
    messages: {
      list: '/messages',
      single: (id: string) => `/messages/${id}`,
      reply: (id: string) => `/messages/reply/${id}`,
    },
    notifications: {
      list: '/notifications',
      new: '/notifications/new',
      edit: (id: string) => `/notifications/edit/${id}`,
    },
  },
};
