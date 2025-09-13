import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';

export interface Env {
  SERVER_URL: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    try {
        const pingurl = `${env.SERVER_URL}/ping?msg=keep_alive`;
        const response = await fetch(pingurl);
        console.log(`Pinged ${env.SERVER_URL}: ${response.status}`);
      } catch (error) {
        console.error("Ping failed:", error);
      }
  },
};
