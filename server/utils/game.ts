import type { EventHandlerRequest, H3Event } from 'h3'

export function useGameSession(event: H3Event<EventHandlerRequest>) {
  return useSession<GameSession>(event, {
    name: 'Jannes Kannes Game',
    password: 'superSuperSecretSessionPassword!',
  })
}
