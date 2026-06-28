import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'scalo',
  eventKey: process.env.INNGEST_EVENT_KEY,
});
