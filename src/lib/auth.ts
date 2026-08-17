import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { db } from '@/db/drizzle';
import * as schema from '@/db/schema';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
  },
  plugins: [
    organization({
      requireEmailVerificationOnInvitation: false,
      async sendInvitationEmail(data) {
        console.log('Invitation email would be sent:', {
          email: data.email,
          organization: data.organization.name,
          invitedBy: data.inviter.user.name,
          invitationId: data.id,
        });
      },
    }),
  ],
});
