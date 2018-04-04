import SessionStore from './SessionStore'
import ShowsStore from './ShowsStore'

export default function createStores() {
  return {
    sessionStore: new SessionStore(),
    showsStore: new ShowsStore()
  }
}