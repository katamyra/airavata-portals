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
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";

interface ItemCardProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  authors: string[];
  starCount: number;
  onStar: (id: number) => void;
}

export const ItemCard = ({ 
  id, 
  title, 
  description, 
  tags, 
  authors, 
  starCount, 
  onStar 
}: ItemCardProps) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
      bg="white"
      _hover={{ borderColor: "gray.300", shadow: "md" }}
      h="220px"
      display="flex"
      flexDirection="column"
      m={3}
    >
      <VStack align="stretch" spacing={3} flex={1}>
        {/* Header with title and star */}
        <Flex align="start" justify="space-between">
          <Text fontSize="lg" fontWeight="bold" color="gray.800" lineHeight="1.3" flex={1} pr={2}>
            {title}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStar(id)}
            color="gray.400"
            _hover={{ color: "yellow.500" }}
            minW="auto"
            h="auto"
            p={1}
          >
            ☆
          </Button>
        </Flex>

        {/* Description */}
        <Text color="gray.600" fontSize="sm" lineHeight="1.5" flex={1} mt={1}>
          {description}
        </Text>

        {/* Tags */}
        <Box>
          <HStack spacing={2} flexWrap="wrap">
            {tags.map((tag, index) => (
              <Box
                key={index}
                bg="#60b4f7"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="medium"
              >
                {tag}
              </Box>
            ))}
          </HStack>
        </Box>

        <Spacer />

        {/* Authors */}
        <Box mt={2}>
          <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">Authors -</Text>
          <Text 
            fontSize="xs" 
            color="gray.600" 
            lineHeight="1.3"
            overflow="hidden"
            textOverflow="ellipsis"
            noOfLines={2}
          >
            {authors.join(", ")}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};