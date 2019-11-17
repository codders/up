export default function({ store, redirect, route }) {
  if (route.name === 'invite-id') {
    return
  }
  if (!store.state.user.uid && route.name !== 'index') {
    redirect('/')
  }
}
