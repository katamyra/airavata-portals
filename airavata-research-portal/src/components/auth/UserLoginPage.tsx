import { Box, Button, Container, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

// Using the existing hero image
import HeroImage from "../../assets/Hero.original.png";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const redirect = new URLSearchParams(window.location.search).get("redirect") || "/";

  const handleLogin = () => {
    setLoading(true);
    auth.signinRedirect({
      redirect_uri: `${window.location.origin}${redirect}`,
      extraQueryParams: {
        prompt: "login",
        kc_idp_hint: "oidc",
      },
    });
  };


  return (
    <Container maxWidth="100vw" height="100vh" padding={0}>
      <HStack height="100vh" gap={0}>
        {/* Left side - Hero Image */}
        <Box 
          width="50%" 
          height="100vh" 
          position="relative"
          backgroundImage={`url(${HeroImage})`}
          backgroundSize="cover"
          backgroundPosition="center"
        >
          <Box
            position="absolute"
            bottom="8"
            left="8"
            color="white"
          >
            <HStack gap={2} marginBottom={2}>
              <Box
                width="20px"
                height="20px"
                borderRadius="md"
                backgroundColor="rgba(255,255,255,0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" color="white">🏠</Text>
              </Box>
              <Text fontSize="sm" color="white">Home</Text>
            </HStack>
            <Text fontSize="2xl" fontWeight="bold" lineHeight="1.2">
              Your Gateway to Seamless
              <br />
              Scientific Computing
            </Text>
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Box width="50%" height="100vh" display="flex" flexDirection="column">
          {/* Header */}
          <HStack justifyContent="space-between" padding={6}>
            <HStack gap={2}>
              <Box
                width="24px"
                height="24px"
                backgroundColor="blue.500"
                borderRadius="sm"
              />
              <Text fontWeight="bold" color="blue.500">Cybershuttle</Text>
            </HStack>
          </HStack>

          {/* Login Form */}
          <VStack 
            flex={1} 
            justifyContent="center" 
            padding={8}
            maxWidth="400px"
            margin="0 auto"
            gap={6}
          >
            <VStack gap={2} alignItems="flex-start" width="100%">
              <Text fontSize="2xl" fontWeight="bold">Welcome back</Text>
              <Text color="gray.500" fontSize="sm">
                Sign in with your credentials to continue your work in
                cybershuttle
              </Text>
            </VStack>

            <VStack gap={4} width="100%">
              <Input placeholder="Username" backgroundColor="gray.50" border="none" />
              <Input placeholder="Password" type="password" backgroundColor="gray.50" border="none" />
              
              <HStack justifyContent="space-between" width="100%" fontSize="sm">
                <Text color="gray.500">Remember me</Text>
                <Text color="blue.500" cursor="pointer">Forgot Password?</Text>
              </HStack>
            </VStack>

            <VStack gap={3} width="100%">
              <Button
                width="100%"
                backgroundColor="blue.400"
                color="white"
                _hover={{ backgroundColor: "blue.500" }}
                onClick={handleLogin}
                disabled={loading}
              >
                Sign In
              </Button>

              <Text fontSize="sm" color="gray.400">or</Text>

              <Button
                width="100%"
                variant="outline"
                borderColor="gray.200"
                backgroundColor="white"
                _hover={{ backgroundColor: "gray.50" }}
                leftIcon={<Text>🔗</Text>}
                onClick={handleLogin}
                disabled={loading}
              >
                Sign in with Cilogon
              </Button>

              <Text fontSize="sm" color="gray.600" textAlign="center">
                Don't have an account?{" "}
                <Text 
                  as="span" 
                  color="blue.500" 
                  cursor="pointer"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Text>
              </Text>
            </VStack>
          </VStack>

          {/* Footer */}
          <Text fontSize="xs" color="gray.400" textAlign="center" padding={4}>
            © 2024 Cybershuttle - MIT Sugessie
          </Text>
        </Box>
      </HStack>
    </Container>
  );
};