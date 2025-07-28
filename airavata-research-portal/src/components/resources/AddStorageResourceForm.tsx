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
import { Box, VStack, HStack, Text, Button, Container, Input } from '@chakra-ui/react';
import { toaster } from '../ui/toaster';
import { useNavigate, useParams } from 'react-router-dom';
import { unifiedApiService } from '../../lib/apiConfig';

export const AddStorageResourceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hostname: '',
    storageType: 'Object Storage',
    capacityTB: 1,
    accessProtocol: 'S3',
    endpoint: '',
    supportsEncryption: false,
    supportsVersioning: false,
    additionalInfo: '',
    resourceManager: ''
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadExistingResource();
    }
  }, [isEditMode, id]);

  const loadExistingResource = async () => {
    try {
      setInitialLoading(true);
      const resource = await unifiedApiService.getStorageResourceById(id!);
      
      setFormData({
        name: resource.name || '',
        description: resource.description || '',
        hostname: resource.hostname || '',
        storageType: resource.storageType || 'Object Storage',
        capacityTB: resource.capacityTB || 1,
        accessProtocol: resource.accessProtocol || 'S3',
        endpoint: resource.endpoint || '',
        supportsEncryption: resource.supportsEncryption || false,
        supportsVersioning: resource.supportsVersioning || false,
        additionalInfo: resource.additionalInfo || '',
        resourceManager: resource.resourceManager || ''
      });
    } catch (error: any) {
      console.error('Failed to load storage resource:', error);
      toaster.create({
        title: "Error",
        description: "Failed to load storage resource data",
        type: "error",
      });
      navigate('/resources?tab=storage');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toaster.create({
        title: "Validation Error",
        description: "Please fill in name and description",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Create object matching v2 StorageResource entity structure
      const storageResourceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        hostname: formData.hostname.trim(), // Use 'hostname' to match backend entity
        storageType: formData.storageType,
        capacityTB: parseInt(formData.capacityTB.toString()),
        accessProtocol: formData.accessProtocol,
        endpoint: formData.endpoint.trim(),
        supportsEncryption: formData.supportsEncryption,
        supportsVersioning: formData.supportsVersioning,
        resourceManager: formData.resourceManager.trim(),
        additionalInfo: formData.additionalInfo.trim() || null
      };

      console.log(`${isEditMode ? 'Updating' : 'Creating'} storage resource:`, storageResourceData);
      
      let result;
      if (isEditMode && id) {
        result = await unifiedApiService.updateStorageResource(id, storageResourceData);
        toaster.create({
          title: "Success",
          description: "Storage resource updated successfully",
          type: "success",
        });
        navigate(`/resources/storage/${id}`);
      } else {
        result = await unifiedApiService.createStorageResource(storageResourceData);
        toaster.create({
          title: "Success",
          description: "Storage resource created successfully",
          type: "success",
        });
        navigate('/resources?tab=storage');
      }
      
      console.log(`Storage resource ${isEditMode ? 'updated' : 'created'} successfully:`, result);
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} storage resource:`, error);
      toaster.create({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} storage resource: ${error.response?.data || error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading storage resource...</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="1000px" py={8}>
        {/* Header */}
        <VStack spacing={8} align="stretch">
          <HStack>
            <Button
              variant="ghost"
              onClick={() => {
                if (isEditMode) {
                  navigate(`/resources/storage/${id}`);
                } else {
                  navigate('/resources?tab=storage');
                }
              }}
              color="gray.600"
              size="sm"
              leftIcon={<Text>←</Text>}
            >
              Back
            </Button>
          </HStack>

          {/* Title */}
          <VStack spacing={6} align="center">
            <Text fontSize="2xl" fontWeight="semibold" color="gray.800">
              {isEditMode ? 'Edit' : 'Add'} <Text as="span" color="#60B4F7">Storage Resource</Text>
            </Text>
            
            <Text color="gray.600" textAlign="center" fontSize="sm" maxW="600px" lineHeight="1.6">
              Provide information about your storage resource. The form will collect the relevant configuration details.
            </Text>
          </VStack>

          {/* Form */}
          <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
            <VStack as="form" onSubmit={handleSubmit} spacing={8} align="stretch">
              {/* Form Fields */}
              <VStack spacing={6} align="stretch">
                {/* Name */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Name <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      placeholder="e.g., Campus Data Storage"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      required
                    />
                  </Box>
                </HStack>

                {/* Description */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Description <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      placeholder="Brief description of the storage resource"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      required
                    />
                  </Box>
                </HStack>

                {/* Hostname */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Hostname <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      placeholder="e.g., storage.university.edu"
                      value={formData.hostname}
                      onChange={(e) => handleInputChange('hostname', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      required
                    />
                  </Box>
                </HStack>

                {/* Storage Type */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Storage Type <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Box as="select" 
                      value={formData.storageType}
                      onChange={(e: any) => handleInputChange('storageType', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={2}
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      w="full"
                    >
                      <option value="Object Storage">Object Storage</option>
                      <option value="File System">File System</option>
                      <option value="Database">Database</option>
                      <option value="Block Storage">Block Storage</option>
                    </Box>
                  </Box>
                </HStack>

                {/* Capacity TB */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Capacity (TB) <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.capacityTB}
                      onChange={(e) => handleInputChange('capacityTB', parseInt(e.target.value) || 1)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      min={1}
                      required
                    />
                  </Box>
                </HStack>

                {/* Access Protocol */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Access Protocol <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Box as="select" 
                      value={formData.accessProtocol}
                      onChange={(e: any) => handleInputChange('accessProtocol', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={2}
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      w="full"
                    >
                      <option value="S3">S3</option>
                      <option value="SFTP">SFTP</option>
                      <option value="NFS">NFS</option>
                      <option value="HTTP">HTTP</option>
                      <option value="HTTPS">HTTPS</option>
                    </Box>
                  </Box>
                </HStack>

                {/* Endpoint */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Endpoint <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      placeholder="e.g., https://s3.amazonaws.com or /mnt/storage"
                      value={formData.endpoint}
                      onChange={(e) => handleInputChange('endpoint', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      required
                    />
                  </Box>
                </HStack>

                {/* Features */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Features
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <VStack flex={1} align="stretch" spacing={3}>
                    <HStack spacing={2} align="center">
                      <Box
                        as="input"
                        type="checkbox"
                        checked={formData.supportsEncryption}
                        onChange={(e: any) => handleInputChange('supportsEncryption', e.target.checked)}
                        w="16px"
                        h="16px"
                        bg={formData.supportsEncryption ? "#60B4F7" : "white"}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="sm"
                        _focus={{ borderColor: "#60B4F7" }}
                      />
                      <Text fontSize="sm" color="gray.700">
                        Supports Encryption
                      </Text>
                    </HStack>
                    <HStack spacing={2} align="center">
                      <Box
                        as="input"
                        type="checkbox"
                        checked={formData.supportsVersioning}
                        onChange={(e: any) => handleInputChange('supportsVersioning', e.target.checked)}
                        w="16px"
                        h="16px"
                        bg={formData.supportsVersioning ? "#60B4F7" : "white"}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="sm"
                        _focus={{ borderColor: "#60B4F7" }}
                      />
                      <Text fontSize="sm" color="gray.700">
                        Supports Versioning
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                {/* Resource Manager */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Resource Manager <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      placeholder="e.g., University IT Department"
                      value={formData.resourceManager}
                      onChange={(e) => handleInputChange('resourceManager', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      required
                    />
                  </Box>
                </HStack>

                {/* Additional Info */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Additional Info
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      placeholder="Any additional configuration details"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                    />
                  </Box>
                </HStack>
              </VStack>

              {/* Submit Button */}
              <HStack justify="center" pt={6}>
                <Button
                  type="submit"
                  bg="black"
                  color="white"
                  size="lg"
                  px={8}
                  py={3}
                  borderRadius="md"
                  _hover={{ bg: "gray.800" }}
                  disabled={loading}
                  fontWeight="medium"
                >
                  {loading 
                    ? (isEditMode ? "Updating..." : "Creating...") 
                    : (isEditMode ? "Update Storage Resource" : "Create Storage Resource")
                  }
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};