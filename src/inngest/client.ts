import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'murmur',
  eventKey: process.env.INNGEST_EVENT_KEY,
});
