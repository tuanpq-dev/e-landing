const routes = {
    ABOUT: 'about',

    CART: 'cart',
    CONTACT: 'contact',
    CATEGORIES: 'categories',
    CHECKOUT: 'checkout',

    HOME: 'home',

    ORDER: 'order',

    RESGISTER: 'register',

    LOGIN: 'login',

    FAQ: 'faq',

    SETTING: 'setting',

    PROFILE: 'profile',
    PRODUCT: 'product',
    PRODUCT_DETAIL: (id: string) => `/product/${id}`,
    POLICY: 'policy',

    WISHLIST: 'wishlist',
}

export default routes;