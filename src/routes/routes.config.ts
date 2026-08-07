const routes = {
    ABOUT: 'about',

    CART: 'cart',
    CONTACT: 'contact',
    CATEGORIES: 'categories',
    CHECKOUT: 'checkout',

    HOME: 'home',

    NEWS: 'news',
    NEWS_DETAIL: (id: number) => `news/${id}`,

    ORDER: 'order',

    RESGISTER: 'register',

    LOGIN: 'login',

    FAQ: 'faq',

    SETTING: 'setting',

    PROFILE: 'profile',
    PRODUCT: 'product',
    PRODUCT_DETAIL: (id: number) => `product/${id}`,
    POLICY: 'policy',

    WISHLIST: 'wishlist',
}

export default routes;