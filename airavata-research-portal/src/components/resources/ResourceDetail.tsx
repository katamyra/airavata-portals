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
  Heading,
  Flex,
  Spinner,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { unifiedApiService } from "../../lib/apiConfig";
import { toaster } from "../ui/toaster";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from "../ui/dialog";

interface StorageResource {
  id: string;
  name: string;
  storage?: string;
  storageType: string;
  status?: string;
  isActive?: boolean;
  description: string;
  capacityTB?: number;
  supportsEncryption?: boolean;
  supportsVersioning?: boolean;
  host?: string;
  port?: number;
  accessCredentials?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ComputeResource {
  id: string;
  name: string;
  compute?: string;
  computeType: string;
  status?: string;
  isActive?: boolean;
  description: string;
  cpuCores?: number;
  memoryGB?: number;
  gpuCores?: number;
  host?: string;
  port?: number;
  accessCredentials?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  const [resource, setResource] = useState<StorageResource | ComputeResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract type from URL path
  const type = location.pathname.includes('/storage/') ? 'storage' : 'compute';


  useEffect(() => {
    fetchResource();
  }, [type, id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (type === "storage" && id) {
        const data = await unifiedApiService.getStorageResourceById(id);
        setResource(data);
      } else if (type === "compute" && id) {
        const data = await unifiedApiService.getComputeResourceById(id);
        setResource(data);
      } else {
        setError("Invalid resource type or ID");
      }
    } catch (err: any) {
      console.error("Failed to fetch resource:", err);
      console.error("Error details:", {
        type,
        id,
        error: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      setError(`Failed to load resource details. Error: ${err.response?.status || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/resources/${type}/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      
      if (type === "storage" && id) {
        await unifiedApiService.deleteStorageResource(id);
        toaster.create({
          title: "Storage resource deleted",
          description: "The storage resource has been successfully deleted.",
          type: "success",
        });
      } else if (type === "compute" && id) {
        await unifiedApiService.deleteComputeResource(id);
        toaster.create({
          title: "Compute resource deleted", 
          description: "The compute resource has been successfully deleted.",
          type: "success",
        });
      }
      
      navigate("/resources");
    } catch (err: any) {
      console.error("Failed to delete resource:", err);
      toaster.create({
        title: "Delete failed",
        description: `Failed to delete resource: ${err.response?.data || err.message}`,
        type: "error",
      });
    } finally {
      setDeleting(false);
      onClose();
    }
  };

  const getStatusColor = (resource: any) => {
    // Handle both old status string format and new isActive boolean format
    if (typeof resource.status === 'string') {
      switch (resource.status.toLowerCase()) {
        case "active":
          return "green";
        case "full":
          return "red";
        case "archived":
          return "yellow";
        default:
          return "gray";
      }
    } else if (typeof resource.isActive === 'boolean') {
      return resource.isActive ? "green" : "gray";
    }
    return "gray";
  };

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error || !resource) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Container maxW="1200px" py={10}>
          <VStack spacing={4}>
            <Text color="red.500" fontSize="lg">{error || "Resource not found"}</Text>
            <Button onClick={() => navigate("/resources")}>
              Back to Resources
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="1200px" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/resources")}
                color="gray.600"
              >
                ← Back to Resources
              </Button>
              <Heading size="lg" color="gray.800">
                {resource.name}
              </Heading>
              <HStack>
                <Text color="gray.600" textTransform="capitalize">
                  {type} Resource
                </Text>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="medium"
                  colorScheme={getStatusColor(resource)}
                >
                  {typeof resource.status === 'string' ? resource.status : 
                   ((resource as any).isActive ? 'Active' : 'Inactive')}
                </Badge>
              </HStack>
            </VStack>
            
            {/* Action Buttons */}
            <HStack spacing={3}>
              <Button
                colorScheme="blue"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={onOpen}
              >
                Delete
              </Button>
            </HStack>
          </Flex>

          {/* Details Card */}
          <Box 
            bg="white" 
            borderRadius="lg" 
            p={6} 
            border="1px solid" 
            borderColor="gray.200"
            shadow="sm"
          >
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                  Resource Details
                </Text>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="gray.600">Name:</Text>
                    <Text>{resource.name}</Text>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="gray.600">ID:</Text>
                    <Text fontSize="sm" fontFamily="mono" color="gray.500">{resource.id}</Text>
                  </HStack>
                  
                  {type === "storage" ? (
                    <>
                      <HStack justify="space-between">
                        <Text fontWeight="medium" color="gray.600">Storage Type:</Text>
                        <Text>{(resource as StorageResource).storageType}</Text>
                      </HStack>
                      {(resource as StorageResource).capacityTB && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">Capacity:</Text>
                          <Text>{(resource as StorageResource).capacityTB} TB</Text>
                        </HStack>
                      )}
                      {(resource as StorageResource).supportsEncryption !== undefined && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">Supports Encryption:</Text>
                          <Badge colorScheme={(resource as StorageResource).supportsEncryption ? "green" : "gray"}>
                            {(resource as StorageResource).supportsEncryption ? "Yes" : "No"}
                          </Badge>
                        </HStack>
                      )}
                      {(resource as StorageResource).supportsVersioning !== undefined && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">Supports Versioning:</Text>
                          <Badge colorScheme={(resource as StorageResource).supportsVersioning ? "green" : "gray"}>
                            {(resource as StorageResource).supportsVersioning ? "Yes" : "No"}
                          </Badge>
                        </HStack>
                      )}
                    </>
                  ) : (
                    <>
                      <HStack justify="space-between">
                        <Text fontWeight="medium" color="gray.600">Compute Type:</Text>
                        <Text>{(resource as ComputeResource).computeType}</Text>
                      </HStack>
                      {(resource as ComputeResource).cpuCores && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">CPU Cores:</Text>
                          <Text>{(resource as ComputeResource).cpuCores}</Text>
                        </HStack>
                      )}
                      {(resource as ComputeResource).memoryGB && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">Memory:</Text>
                          <Text>{(resource as ComputeResource).memoryGB} GB</Text>
                        </HStack>
                      )}
                      {(resource as ComputeResource).gpuCores && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">GPU Cores:</Text>
                          <Text>{(resource as ComputeResource).gpuCores}</Text>
                        </HStack>
                      )}
                    </>
                  )}
                  
                  {((resource as any).host || (resource as any).port) && (
                    <>
                      {(resource as any).host && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">Host:</Text>
                          <Text fontFamily="mono" fontSize="sm">{(resource as any).host}</Text>
                        </HStack>
                      )}
                      {(resource as any).port && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium" color="gray.600">Port:</Text>
                          <Text>{(resource as any).port}</Text>
                        </HStack>
                      )}
                    </>
                  )}
                  
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="gray.600">Status:</Text>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                      colorScheme={getStatusColor(resource)}
                    >
                      {typeof resource.status === 'string' ? resource.status : 
                       ((resource as any).isActive ? 'Active' : 'Inactive')}
                    </Badge>
                  </HStack>
                  
                  {(resource as any).createdAt && (
                    <HStack justify="space-between">
                      <Text fontWeight="medium" color="gray.600">Created:</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date((resource as any).createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>

              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={3}>
                  Description
                </Text>
                <Text color="gray.600" lineHeight="1.6">
                  {resource.description}
                </Text>
              </Box>

              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={3}>
                  Quick Actions
                </Text>
                <HStack spacing={3}>
                  <Button
                    bg="#60b4f7"
                    color="white"
                    _hover={{ bg: "#4a9ce6" }}
                  >
                    Connect
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="gray.300"
                  >
                    Test Connection
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="gray.300"
                  >
                    Monitor
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handleEdit}
                  >
                    Edit Resource
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
      
      {/* Delete Confirmation Dialog */}
      <DialogRoot open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle fontSize="lg" fontWeight="bold">
              Delete {type} Resource
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            Are you sure you want to delete "{resource?.name}"? This action cannot be undone.
          </DialogBody>

          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={deleting}
              loadingText="Deleting..."
              ml={3}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
};