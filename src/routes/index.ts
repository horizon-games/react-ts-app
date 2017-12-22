import HomeRoute from './HomeRoute'
import AboutRoute from './AboutRoute'
import ContactRoute from './ContactRoute'
import TagRoute from './TagRoute'
import ActorRoute from './ActorRoute'
import AdminRoute from './AdminRoute'
import LoginRoute from './LoginRoute'
import CollectionsRoute from './CollectionsRoute'
import CollectionRoute from './CollectionRoute'

export default <any>[
  { path: '', component: HomeRoute },
  { path: 'login', component: LoginRoute },
  { path: 'about', component: AboutRoute, animate: true },
  { path: 'contact', component: ContactRoute, animate: true },
  {
    path: 'collections',
    component: CollectionsRoute,
    children: [
      { path: ':collectionId', component: CollectionRoute },
      { path: '', redirectTo: 'a' }
    ]
  },
  {
    path: 'shows',
    // NOTE: both work, if you'd like to name your chunks use this below
    loadChildren: () => import(/* webpackChunkName: "shows" */ './shows')
    // loadChildren: () => import('./shows')
  },
  {
    path: 'actors/:id',
    component: ActorRoute,
    outlet: 'modal',
    animate: true
  },
  {
    path: 'tags/:tag',
    component: TagRoute
  },
  // Redirects
  {path: 'actors', redirectTo: '/' },
  {path: 'tags', redirectTo: '/' },
  {
    // Using relative path
    path: 'redirect',
    children: [
      { path: '', redirectTo: '../shows' }
    ]
  },
  // Admin route with a session guard
  {
    path: 'admin',
    component: AdminRoute,
    canActivate: (route, navigation) => {
      const { stores: { SessionStore } } = route.context
      if (SessionStore.isAuthenticated) {
        return true
      } else {
        SessionStore.unauthorizedNavigation = navigation
        return navigation.redirectTo('/login')
      }
    },
    canDeactivate: (route, navigation) => {
      if (window.confirm('Discard changes?')) {
        return true
      }
      return false
    } // ,
    // Fakes network delay
    // willResolve: () => delay(20 + Math.random() * 200)
  }
]
