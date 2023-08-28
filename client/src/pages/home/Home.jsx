import React from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../../components/authentication/login/Login";
import Signup from "../../components/authentication/signup/Signup";
const Home = () => {
  return (
    <Container maxW="xl">
      <Box p="3" w="100%" m="40px 0 15px 0" borderRadius="3px">
        <Text
          style={{ textAlign: "center", color: "var(--theme)" }}
          fontSize="4xl"
          alignItems="center"
          fontFamily="'Pacifico', cursive"
        >
          room
        </Text>
      </Box>

      <Box
        bg="white"
        p="3"
        m="40px 0 15px 0"
        borderWidth="1px "
        borderRadius="3px"
        boxShadow="lg"
      >
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab width="50%">Log In</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
