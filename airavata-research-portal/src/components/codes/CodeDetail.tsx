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

import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Button, Badge, Container } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { researchApiService } from '../../lib/researchApi';
import { TagV2, normalizeTags } from '../../lib/tagUtils';

interface Code {
  id: number;
  name: string;
  description: string;
  tags: (string | TagV2)[];
  authors: string[];
  starCount: number;
  codeType: string;
  programmingLanguage: string;
  framework?: string;
}

export const CodeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = useState<Code | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCode(id);
    }
  }, [id]);

  const fetchCode = async (codeId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await researchApiService.getCodeById(codeId);
      setCode(data);
    } catch (err) {
      console.error('Failed to fetch code:', err);
      setError('Failed to load code details. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = async () => {
    if (!code || !id) return;
    
    try {
      await researchApiService.starCode(id);
      // Refresh the code data to get updated star count
      fetchCode(id);
    } catch (err) {
      console.error('Failed to star code:', err);
    }
  };

  if (loading) {
    return (
      <Container maxW="1000px" py={10}>
        <Box textAlign="center">
          <Text color="gray.500">Loading code details...</Text>
        </Box>
      </Container>
    );
  }

  if (error || !code) {
    return (
      <Container maxW="1000px" py={10}>
        <Box textAlign="center">
          <Text color="red.500" mb={4}>{error || 'Code not found'}</Text>
          <Button onClick={() => navigate('/codes')} size="sm">
            Back to Codes
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="1000px" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Back Button */}
          <Box>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/codes')}
              leftIcon={<Text>←</Text>}
            >
              Back to Codes
            </Button>
          </Box>

          {/* Main Content */}
          <Box bg="white" p={8} borderRadius="xl" shadow="sm">
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={3} flex={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                    {code.name}
                  </Text>
                  <HStack spacing={4}>
                    <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                      {code.codeType}
                    </Badge>
                    <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                      {code.programmingLanguage}
                    </Badge>
                    {code.framework && (
                      <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                        {code.framework}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
                
                <Button
                  onClick={handleStarClick}
                  variant="outline"
                  leftIcon={<Text>⭐</Text>}
                  size="sm"
                >
                  Star ({code.starCount})
                </Button>
              </HStack>

              {/* Description */}
              <Box>
                <Text fontSize="lg" color="gray.700" lineHeight="1.7">
                  {code.description}
                </Text>
              </Box>

              {/* Tags */}
              {code.tags && code.tags.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                    Tags
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {normalizeTags(code.tags).map((tag, index) => (
                      <Box
                        key={index}
                        bg="#60b4f7"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        {tag}
                      </Box>
                    ))}
                  </HStack>
                </Box>
              )}

              {/* Authors */}
              {code.authors && code.authors.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                    Authors
                  </Text>
                  <Text color="gray.600">
                    {code.authors.join(", ")}
                  </Text>
                </Box>
              )}

              {/* Action Buttons */}
              <HStack spacing={4} pt={4}>
                <Button
                  bg="#60b4f7"
                  color="white"
                  _hover={{ bg: "#4a9ce6" }}
                  size="md"
                >
                  Use in Project
                </Button>
                <Button
                  variant="outline"
                  size="md"
                >
                  View Source
                </Button>
                <Button
                  variant="outline"
                  size="md"
                >
                  Fork Code
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};