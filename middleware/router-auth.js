export default function({ store, redirect, route }) {
  if (store.state.user != null && route.name === 'login') {
    redirect('/home')
  }
  if (store.state.user == null && isUserRoute(route)) {
    redirect('/login')
  }
}

function isUserRoute(route) {
  if (
    route.matched.some(
      record => record.path === '/home' || record.path === '/profile'
    )
  ) {
    return true
  }
}
