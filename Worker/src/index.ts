import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';

export interface Env {
  SERVER_URL: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    try {
      const res = await fetch(env.SERVER_URL);
      console.log(`[KEEP-ALIVE] Status: ${res.status}`);
    } catch (err: any) {
      console.error(`[KEEP-ALIVE] Failed: ${err.message}`);
    }
  },
};
