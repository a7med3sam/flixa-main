
export const endpoints = {
  home: {
    reports: "/admin/home/report",
    mostPurchasedProducts: "/admin/home/most-purchased-products",
    salesRenveu: "/admin/home/sales",
    freeShipping: "/admin/settings",
    editFreeShipping: (id: string) => `/admin/settings/${id}`
  },
  auth: {
    login: '/api/v1/admin/auth/login',
    refreshToken: '/api/v1/admin/auth/refresh-token',
    logout: '/api/v1/admin/auth/logout',
    sendOtp: '/otps/resend-otp',
    verifyOtp: '/otps/verify-otp',
    changePassword: '/auth/change-password',
  },
  profile: {
    get: '/api/v1/admin/profile',
    update: '/api/v1/admin/profile/update',
    phoneOtp: '/api/v1/admin/profile/phone/send-otp',
    phoneVerify: '/api/v1/admin/profile/phone/verify-otp',
    emailOtp: '/api/v1/admin/profile/email/send-otp',
    emailVerify: '/api/v1/admin/profile/email/verify-otp',
  },
  categories: {
    single: (id: string) => `/admin/categories/${id}`,
    list: '/admin/categories',
    create: '/admin/categories',
    patch: (id: string) => `/admin/categories/${id}`,
    delete: (id: string) => `/admin/categories/${id}`,
  },
  subCategories: {
    list: '/admin/categories/sub',
  },
  product: {
    list: '/admin/products',
    delete: (id: string) => `/admin/products/${id}`,
    patch: (id: string) => `/admin/products/${id}`,
    create: '/admin/products',
    single: (id: string) => `/admin/products/${id}`,
  },
  unitMeasure: {
    list: '/admin/units-of-measure',
  },
  order: {
    single: (id: string) => `/admin/orders/${id}`,
    patch: (id: string) => `/admin/orders/change-status/${id}`,
    list: '/admin/orders',
    editStatus: '/admin/orders/change-status',
    count: '/admin/orders/count', // Use parameterized endpoint
  },
  paynentMethod: {
    list: '/payment-methods',
  },
  units: {
    list: '/admin/units-of-measure',
    single: (id: string) => `/admin/units-of-measure/${id}`,
    post: '/admin/units-of-measure',
    patch: (id: string) => `/admin/units-of-measure/${id}`,
    delete: (id: string) => `/admin/units-of-measure/${id}`,
  },
  returnOrders: {
    list: '/admin/orders/return-order-requests',
    patch: (id: string) => `/admin/orders/return-order-requests/change-status/${id}`,
    single: (id: string) => `/admin/orders/return-order-requests/${id}`,
    count: '/admin/orders/return-order-requests/count',
  },
  banners: {
    list: '/admin/banners',
    single: (id: string) => `/admin/banners/${id}`,
    patch: (id: string) => `/admin/banners/${id}`,
    create: '/admin/banners',
    delete: (id: string) => `/admin/banners/${id}`,
  },
  barcodeDiscount: {
    list: '/admin/coupon',
    create: '/admin/coupon',
    delete: (id: string) => `/admin/coupon/${id}`,
  },
  offers: {
    list: '/admin/product-unit-of-measure-offers',
    details: (id: string) => `/admin/product-unit-of-measure-offers/${id}`,
    post: '/admin/product-unit-of-measure-offers',
    single: (id: string) => `/admin/product-unit-of-measure-offers/${id}`,
    patch: (id: string) => `/admin/product-unit-of-measure-offers/${id}`,
    delete: (id: string) => `/admin/product-unit-of-measure-offers/${id}`,
  },

  notification: {
    list: '/admin/firebase-notification',
    postAll: '/admin/firebase-notification/send-notification-to-all-users',
    post: '/admin/firebase-notification/send-notification-to-user',
  },
  workArea: {
    list: '/admin/working-areas',
    create: '/admin/working-areas',
    single: (id: string) => `/admin/working-areas/${id}`,
    patch: (id: string) => `/admin/working-areas/${id}`,
    delete: (id: string) => `/admin/working-areas/${id}`
  },
  drivers: {
    list: '/admin/drivers',
    single: (id: string) => `/admin/drivers/${id}`,
    editStatus: (id: string) => `/admin/drivers/change-status/${id}`,
    patch: (id: string) => `/admin/drivers/${id}`,
    count: '/admin/drivers/count',
    orderDriver: (id: string) => `/admin/drivers/${id}/orders`,
    delete: (id: string) => `/admin/drivers/${id}`,
  },
  clients: {
    list: '/api/v1/admin/customers',
    single: (id: string) => `/api/v1/admin/customers/${id}`,
    create: '/api/v1/admin/customers',
    editStatus: (id: string) => `/api/v1/admin/customers/${id}/status`,
    delete: (id: string) => `/api/v1/admin/customers/${id}`,
    patch: (id: string) => `/api/v1/admin/customers/${id}`,
  },
  reports: {
    listReports: '/admin/reports',
    ListOrderReports: '/admin/reports/all-orders-report'
  },
  staticPages: {
    list: (pageType: string) => `/admin/static-pages/${pageType}`,
    patch: (pageType: string) => `/admin/static-pages/${pageType}`
  },
  contactUs: {
    list: '/admin/social-media',
    post: '/admin/social-media',
    delete: (id: string) => `/admin/social-media/${id}`,
    patch: (id: string) => `/admin/social-media/${id}`,
  },
  employee: {
    list: '/admin/employees',
    listPermissions: '/admin/employee-permission/all',
    create: '/employee/employee/register',
    single: (id: string) => `/admin/employees/${id}`,
    editStatus: (id: string) => `/admin/employees/${id}`,
    delete: (id: string) => `/admin/employees/${id}`,
    patch: (id: string) => `/admin/employees/${id}`,
    editPermission: '/admin/employee-permission/add-and-delete-employee-permission'
  },
  DeliveryFees: {
    list: '/admin/shoping-costs',
    single: (id: string) => `/admin/shoping-costs/${id}`,
    patch: (id: string) => `/admin/shoping-costs/${id}`,
    create: '/admin/shoping-costs',
    delete: (id: string) => `/admin/shoping-costs/${id}`,
  },
  pages: {
    list: '/api/v1/admin/pages',
    single: (id: string) => `/api/v1/admin/pages/${id}`,
    update: (id: string) => `/api/v1/admin/pages/${id}`,
  },
  message: {
    list: '/api/v1/admin/support-tickets',
    single: (id: string) => `/api/v1/admin/support-tickets/${id}`,
    patch: (id: string) => `/api/v1/admin/support-tickets/${id}`,
  },
  AdminCommissionSettings: {
    list: "/api/v1/admin/commission-setting"
  }
};