/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied. See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

import {
  Box,
  Button,
  Container,
  HStack,
  Text,
  VStack,
  Flex,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";
import heroImage from "../../assets/hero-image.png";


const StatsCard = ({ number, label, icon, color }: { number: string, label: string, icon: string, color: string }) => (
  <Box
    bg="rgba(255, 255, 255, 0.15)"
    backdropFilter="blur(10px)"
    borderRadius="lg"
    p={4}
    border="1px solid rgba(255, 255, 255, 0.2)"
    minW="140px"
  >
    <VStack spacing={2} align="center">
      <Box w={8} h={8} bg={color} borderRadius="full" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="lg">{icon}</Text>
      </Box>
      <Text color="white" fontWeight="bold" fontSize="xl">{number}</Text>
      <Text color="white" fontSize="sm" textAlign="center">{label}</Text>
    </VStack>
  </Box>
);

export const NewLandingPage = () => {
  const auth = useAuth();

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="1200px" py={16}>
        <Flex align="center" justify="space-between" gap={12}>
          {/* Left Content */}
          <Box flex={1}>
            <VStack align="start" spacing={6}>
              <VStack align="start" spacing={4}>
                <Text fontSize="5xl" fontWeight="bold" lineHeight="1.1" color="gray.800">
                  Your Gateway to
                  <br />
                  Seamless
                  <br />
                  <Text as="span" color="blue.500">Scientific</Text>
                  <br />
                  Computing
                </Text>
                
                <Text color="gray.600" fontSize="lg" maxW="500px" lineHeight="1.6">
                  CyberShuttle is a unified platform for managing compute, storage, datasets, models, and research tools. Seamlessly run scientific workflows using high-performance or cloud-based infrastructure, all in one place.
                </Text>
              </VStack>

              <HStack spacing={4}>
                <Button
                  size="lg"
                  bg="#40a9f7"
                  color="white"
                  px={8}
                  onClick={() => auth.signinRedirect()}
                  rightIcon={<Text>→</Text>}
                  _hover={{ bg: "#2e90d9" }}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="gray.300"
                  color="gray.700"
                  px={8}
                  rightIcon={<Text>▶</Text>}
                  _hover={{ bg: "gray.50" }}
                >
                  Learn More
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Right Content - Hero Image */}
          <Box flex={1} position="relative">
            <Box
              w="full"
              h="400px"
              borderRadius="2xl"
              position="relative"
              overflow="hidden"
            >
              {/* Hero Image */}
              <Image
                src={heroImage}
                alt="CyberShuttle Scientific Computing Platform"
                w="full"
                h="full"
                objectFit="cover"
                borderRadius="2xl"
              />

              {/* Stats Cards positioned like in the image */}
              <Box position="absolute" bottom={6} right={6}>
                <VStack spacing={3}>
                  <StatsCard 
                    number="200+" 
                    label="Compute Resources" 
                    icon="◉"
                    color="rgba(255, 255, 255, 0.3)" 
                  />
                </VStack>
              </Box>

              <Box position="absolute" bottom={24} left={6}>
                <StatsCard 
                  number="5000+" 
                  label="Users" 
                  icon="◯"
                  color="rgba(255, 255, 255, 0.3)" 
                />
              </Box>
            </Box>
          </Box>
            </Flex>
          </Container>
        </Box>
  );
};