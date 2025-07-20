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
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { adminApiService } from "../../lib/adminApi";
import { useNavigate } from "react-router";

interface StorageResource {
  id: number;
  name: string;
  storage: string;
  storageType: string;
  status: string;
  description: string;
}

interface ComputeResource {
  id: number;
  name: string;
  compute: string;
  computeType: string;
  status: string;
  description: string;
}

export const Resources = () => {
  const [activeTab, setActiveTab] = useState("storage");
  const [storageResources, setStorageResources] = useState([]);
  const [computeResources, setComputeResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === "storage") {
        const data = await adminApiService.getStorageResources();
        setStorageResources(data);
      } else {
        const data = await adminApiService.getComputeResources();
        setComputeResources(data);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError("Failed to load resources. Make sure the API server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResource = (id, type) => {
    navigate(`/resources/${type}/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "full":
        return "red";
      case "archived":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="1400px" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Text fontSize="4xl" fontWeight="bold" color="gray.800" mb={4}>
              Resources
            </Text>
            <Text color="gray.600" maxW="600px" lineHeight="1.6" fontSize="md">
              Accelerate your research with reliable and scalable infrastructure. Explore
              available compute and storage resources, or register your own to customize
              and optimize your scientific workflows.
            </Text>
          </Box>

          {/* Tabs */}
          <Box>
            <HStack spacing={0} mb={6}>
              <Button
                variant="ghost"
                color={activeTab === "storage" ? "#60b4f7" : "gray.600"}
                borderBottom={activeTab === "storage" ? "2px solid #60b4f7" : "2px solid transparent"}
                borderRadius={0}
                fontWeight="medium"
                onClick={() => setActiveTab("storage")}
                px={0}
                mr={8}
              >
                Storage
              </Button>
              <Button
                variant="ghost"
                color={activeTab === "compute" ? "#60b4f7" : "gray.600"}
                borderBottom={activeTab === "compute" ? "2px solid #60b4f7" : "2px solid transparent"}
                borderRadius={0}
                fontWeight="medium"
                onClick={() => setActiveTab("compute")}
                px={0}
              >
                Compute
              </Button>
            </HStack>
          </Box>

          {/* Filters and Add Button */}
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                Filters :
              </Text>
              <Button size="sm" variant="outline" borderColor="gray.300">
                {activeTab === "storage" ? "Storage Type" : "Compute Type"}
              </Button>
              <Button size="sm" variant="outline" borderColor="gray.300">
                Status
              </Button>
            </HStack>
            <Button
              bg="#60b4f7"
              color="white"
              size="md"
              _hover={{ bg: "#4a9ce6" }}
            >
              + Add Resource
            </Button>
          </Flex>

          {/* Loading/Error States */}
          {loading && (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">Loading resources...</Text>
            </Box>
          )}

          {error && (
            <Box textAlign="center" py={12}>
              <Text color="red.500">{error}</Text>
              <Button mt={4} onClick={fetchResources} size="sm">
                Retry
              </Button>
            </Box>
          )}

          {/* Table */}
          {!loading && !error && (
            <Box bg="white" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
              <VStack spacing={0} align="stretch">
                {/* Header */}
                <Box bg="gray.50" p={4} borderBottom="1px solid" borderColor="gray.200">
                  <HStack spacing={8}>
                    <Box w="40px"></Box>
                    <Box w="200px">
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">Name</Text>
                    </Box>
                    <Box w="120px">
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">
                        {activeTab === "storage" ? "Storage" : "Compute"}
                      </Text>
                    </Box>
                    <Box w="120px">
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">
                        {activeTab === "storage" ? "Storage Type" : "Compute Type"}
                      </Text>
                    </Box>
                    <Box w="100px">
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">Status</Text>
                    </Box>
                    <Box w="80px">
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">Actions</Text>
                    </Box>
                  </HStack>
                </Box>
                
                {/* Rows */}
                {(activeTab === "storage" ? storageResources : computeResources).map((resource, index) => (
                  <Box 
                    key={resource.id} 
                    p={4} 
                    borderBottom="1px solid" 
                    borderColor="gray.100"
                    _hover={{ bg: "gray.50" }}
                  >
                    <HStack spacing={8}>
                      <Box w="40px">
                        <Text fontSize="sm" color="gray.600">{index + 1}</Text>
                      </Box>
                      <Box w="200px">
                        <Text fontSize="sm" fontWeight="medium">{resource.name}</Text>
                      </Box>
                      <Box w="120px">
                        <Text fontSize="sm">
                          {activeTab === "storage" ? resource.storage : resource.compute}
                        </Text>
                      </Box>
                      <Box w="120px">
                        <Text fontSize="sm">
                          {activeTab === "storage" ? resource.storageType : resource.computeType}
                        </Text>
                      </Box>
                      <Box w="100px">
                        <Box
                          as="span"
                          px={2}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="medium"
                          color="white"
                          bg={`${getStatusColor(resource.status)}.500`}
                        >
                          {resource.status}
                        </Box>
                      </Box>
                      <Box w="80px">
                        <Button
                          size="sm"
                          bg="black"
                          color="white"
                          _hover={{ bg: "gray.800" }}
                          onClick={() => handleViewResource(resource.id, activeTab)}
                        >
                          View
                        </Button>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};