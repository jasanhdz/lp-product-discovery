import { AppRoute } from '@/types/router'
import { AUTH_ROUTES, APP_ROUTES } from '@/constants/route-paths'

import SignInPage from '@/pages/SignIn'
import ProductsPage from '@/pages/Products'
import ProductDetailPage from '@/pages/ProductDetail'
import DynamicFormPage from '@/pages/DynamicForm'

export const publicRoutes: AppRoute[] = [
  {
    title: 'Sign In',
    path: AUTH_ROUTES.SIGN_IN,
    component: SignInPage,
    layout: 'AUTH'
  }
]

export const privateRoutes: AppRoute[] = [
  {
    title: 'Products Discovery',
    path: APP_ROUTES.PRODUCTS,
    component: ProductsPage,
    layout: 'APP'
  },
  {
    title: 'Product Detail',
    path: APP_ROUTES.PRODUCT_DETAIL,
    component: ProductDetailPage,
    layout: 'APP'
  },
  {
    title: 'New Product (Dynamic Form)',
    path: APP_ROUTES.DYNAMIC_FORM,
    component: DynamicFormPage,
    layout: 'APP'
  }
]
