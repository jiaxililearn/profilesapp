import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    postConfirmation
  },
  groups: ["ADMINS", "EVERYONE"],
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"]),
  ],
});