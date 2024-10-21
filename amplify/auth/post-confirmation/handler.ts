import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { generateClient } from "aws-amplify/data";
import { env } from "$amplify/env/post-confirmation";
import { createUserProfile } from "./graphql/mutations";

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: "iam",
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
);

const client = generateClient<Schema>({
  authMode: "iam",
});

const cognitoClient = new CognitoIdentityProviderClient();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await client.graphql({
    query: createUserProfile,
    variables: {
      input: {
        email: event.request.userAttributes.email,
        profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
      },
    },
  });

  // add user to group
  const addToGroupCommand = new AdminAddUserToGroupCommand({
    GroupName: env.GROUP_NAME,
    Username: event.userName,
    UserPoolId: event.userPoolId
  });
  const addToGroupResponse = await cognitoClient.send(addToGroupCommand);
  console.log('processed', addToGroupResponse.$metadata.requestId);

  return event;
};