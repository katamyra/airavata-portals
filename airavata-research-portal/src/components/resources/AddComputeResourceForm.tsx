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
import { useNavigate, useParams } from 'react-router-dom';
import { unifiedApiService } from '../../lib/apiConfig';
import { toaster } from '../ui/toaster';

export const AddComputeResourceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hostname: '',
    computeType: 'HPC',
    cpuCores: 1,
    memoryGB: 1,
    operatingSystem: 'Linux',
    queueSystem: 'SLURM',
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
      const resource = await unifiedApiService.getComputeResourceById(id!);
      
      setFormData({
        name: resource.name || '',
        description: resource.description || '',
        hostname: resource.hostname || '',
        computeType: resource.computeType || 'HPC',
        cpuCores: resource.cpuCores || 1,
        memoryGB: resource.memoryGB || 1,
        operatingSystem: resource.operatingSystem || 'Linux',
        queueSystem: resource.queueSystem || 'SLURM',
        additionalInfo: resource.additionalInfo || '',
        resourceManager: resource.resourceManager || ''
      });
    } catch (error: any) {
      console.error('Failed to load compute resource:', error);
      toaster.create({
        title: "Error",
        description: "Failed to load compute resource data",
        type: "error",
      });
      navigate('/resources?tab=compute');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    if (isEditMode) {
      navigate(`/resources/compute/${id}`);
    } else {
      navigate('/resources?tab=compute');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create object matching v2 ComputeResource entity structure
      const computeResourceData = {
        name: formData.name,
        description: formData.description,
        hostname: formData.hostname, // Use 'hostname' to match backend entity
        computeType: formData.computeType,
        cpuCores: parseInt(formData.cpuCores.toString()),
        memoryGB: parseInt(formData.memoryGB.toString()),
        operatingSystem: formData.operatingSystem,
        queueSystem: formData.queueSystem,
        resourceManager: formData.resourceManager,
        additionalInfo: formData.additionalInfo || null
      };

      console.log(`${isEditMode ? 'Updating' : 'Creating'} compute resource:`, computeResourceData);
      
      let result;
      if (isEditMode && id) {
        result = await unifiedApiService.updateComputeResource(id, computeResourceData);
        toaster.create({
          title: "Success",
          description: "Compute resource updated successfully",
          type: "success",
        });
        navigate(`/resources/compute/${id}`);
      } else {
        result = await unifiedApiService.createComputeResource(computeResourceData);
        toaster.create({
          title: "Success", 
          description: "Compute resource created successfully",
          type: "success",
        });
        navigate('/resources?tab=compute');
      }
      
      console.log(`Compute resource ${isEditMode ? 'updated' : 'created'} successfully:`, result);
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} compute resource:`, error);
      toaster.create({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} compute resource: ${error.response?.data || error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading compute resource...</Text>
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
              onClick={handleBack}
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
              {isEditMode ? 'Edit' : 'Add'} <Text as="span" color="#60B4F7">Compute Resource</Text>
            </Text>
            
            <Text color="gray.600" textAlign="center" fontSize="sm" maxW="600px" lineHeight="1.6">
              Fill in the basic information about your compute resource. Ensure all required fields are properly configured.
            </Text>
          </VStack>

          {/* Form */}
          <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
            <VStack as="form" onSubmit={handleSubmit} spacing={8} align="stretch">
              {/* Form Fields */}
              <VStack spacing={6} align="stretch">
                {/* Resource Name */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Resource Name <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      placeholder="e.g., Campus HPC Cluster"
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
                      placeholder="Brief description of the compute resource"
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
                      placeholder="e.g., cluster.university.edu"
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

                {/* Compute Type */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Compute Type <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Box as="select" 
                      value={formData.computeType}
                      onChange={(e: any) => handleInputChange('computeType', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={2}
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      w="full"
                    >
                      <option value="HPC">HPC</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Local">Local</option>
                      <option value="Grid">Grid</option>
                    </Box>
                  </Box>
                </HStack>

                {/* CPU Cores */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      CPU Cores <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      type="number"
                      placeholder="e.g., 64"
                      value={formData.cpuCores}
                      onChange={(e) => handleInputChange('cpuCores', parseInt(e.target.value) || 1)}
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

                {/* Memory GB */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Memory (GB) <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Input
                      type="number"
                      placeholder="e.g., 256"
                      value={formData.memoryGB}
                      onChange={(e) => handleInputChange('memoryGB', parseInt(e.target.value) || 1)}
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

                {/* Operating System */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Operating System <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Box as="select" 
                      value={formData.operatingSystem}
                      onChange={(e: any) => handleInputChange('operatingSystem', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={2}
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      w="full"
                    >
                      <option value="Linux">Linux</option>
                      <option value="Ubuntu">Ubuntu</option>
                      <option value="CentOS">CentOS</option>
                      <option value="RHEL">RHEL</option>
                      <option value="SUSE">SUSE</option>
                      <option value="Windows">Windows</option>
                    </Box>
                  </Box>
                </HStack>

                {/* Queue System */}
                <HStack spacing={4} align="start">
                  <Box minW="200px" pt={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Queue System <Text as="span" color="red.500">*</Text>
                    </Text>
                  </Box>
                  <Text color="gray.500" pt={2}>:</Text>
                  <Box flex={1}>
                    <Box as="select" 
                      value={formData.queueSystem}
                      onChange={(e: any) => handleInputChange('queueSystem', e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={2}
                      _focus={{ borderColor: "#60B4F7", boxShadow: "0 0 0 1px #60B4F7" }}
                      w="full"
                    >
                      <option value="SLURM">SLURM</option>
                      <option value="PBS">PBS</option>
                      <option value="SGE">SGE</option>
                      <option value="Torque">Torque</option>
                      <option value="LSF">LSF</option>
                    </Box>
                  </Box>
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
                      placeholder="e.g., University HPC Center"
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
                    : (isEditMode ? "Update Compute Resource" : "Create Compute Resource")
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