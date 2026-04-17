export default defineEventHandler(async event => (await useGame(event)).getGameResult())
