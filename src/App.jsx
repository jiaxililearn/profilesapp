import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import {
  useAuthenticator,
  Loader,
  Placeholder,
  Avatar,
  Card,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

function MyButton() {
  return <Button>I'm a button</Button>;
}

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    setIsLoaded(false);
    fetchUserProfile().then((_) => {
      setIsLoaded(true);
    });
  }, []);

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
    console.log(profiles);
  }

  function MyProfile() {
    return (
      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <Flex
              direction="column"
              rowGap="0rem"
              alignContent="center"
              alignItems="center"
              margin="0 auto"
            >
              <Avatar size="large" />

              <Card>{userprofile.email}</Card>
            </Flex>
          </Flex>
        ))}
      </Grid>
    );
  }

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="row"
      width="90%"
      margin="0 auto"
    >
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        width="30%"
        margin="0 auto"
      >
        <Heading level={2}>My Profile</Heading>

        <Divider />
        <Placeholder variation="linear" isLoaded={isLoaded} />
        <MyProfile></MyProfile>

        <Button onClick={signOut}>Sign Out</Button>
      </Flex>

      {/* 2nd Column */}
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        width="40%"
        margin="0 auto"
      >
        <Avatar variation="outlined" />
        <MyButton></MyButton>
      </Flex>
    </Flex>
  );
}
