import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../config/config";
import { sendError } from "../../../handlers/errorHandler";
import { useHistory } from "react-router-dom";

const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("room_token"))) {
      history.push("/chats");
    }
  });

  const handleShowPass = () => {
    setShow(!show);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Please fill all fields.",
        status: "error",
        position: "top",
      });
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/user/login`,
        { email, password },
        config
      );
      toast({
        title: "Logged in.",
        status: "success",
        position: "top",
      });

      localStorage.setItem("room_token", JSON.stringify(data));
      setLoading(false);
      // history.push("/chats");
      window.location.pathname = "/chats";
    } catch (err) {
      toast({
        title: sendError(err),
        status: "error",
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowPass}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        isLoading={loading}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Log In
      </Button>
      {/* 
      <Button
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("Test@123");
        }}
        isLoading={loading}
      >
        Guest credentials
      </Button> */}
    </VStack>
  );
};

export default Login;
