import React from "react";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Link,
    useDisclosure,
  } from "@chakra-ui/react";
import { makeServer } from "../mirage/server";

const SandboxButton = ()=> {
  //const [isMirageOn, setIsMirageOn] = useState(false);
  const isSandboxMode = localStorage.getItem('isSandboxMode') ?? 'false'

  const toggleMirage = () => {
    if (isSandboxMode.toLowerCase() === "true") {
      // Turn off Mirage server
      makeServer({ environment: "development" }).shutdown();
      localStorage.setItem('isSandboxMode', 'false');
      window.location.reload();
    } else {
      // Turn on Mirage server
      //makeServer({ environment: "development" });
      localStorage.setItem('isSandboxMode', 'true');
      window.location.reload();
    }
    //setIsMirageOn(!isMirageOn);
  };

  return (
    <Button
        height={{ base: 8, sm: 9 }}
        minW={{ base: 8, sm: 9 }}
        fontSize={{ base: "sm", sm: "md" }}
        variant="outline"
        borderColor="appBlue.400"
        borderRadius="0.3rem"
        color="appBlue.400"
        marginLeft={'10px'}
        _hover={{
            bg: "appBlue.400",
            color: "white",
        }}
        _active={{
            bg: "appBlue.500",
            color: "white",
        }}
        onClick={toggleMirage}>
      {isSandboxMode.toLowerCase() === "true" ? "Turn Off Sandbox" : "Turn On Sandbox"}
    </Button>
  );
};

export default SandboxButton;