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

import React, { useState } from 'react';
import { Box, VStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { adminApiService } from '../../lib/adminApi';

export const AddStorageResourceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storageType: 'S3',
    endPointUrl: '',
    bucketName: '',
    accessKey: '',
    secretKey: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in name and description');
      return;
    }

    if (!formData.endPointUrl.trim() || !formData.bucketName.trim()) {
      alert('Please fill in endpoint URL and bucket name');
      return;
    }

    setLoading(true);
    try {
      const newStorageResource = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        storageType: formData.storageType,
        storage: `${formData.bucketName} (${formData.endPointUrl})`,
        status: 'ACTIVE'
      };

      console.log('Submitting storage resource:', newStorageResource);
      const createdResource = await adminApiService.createStorageResource(newStorageResource);
      console.log('Storage resource created successfully:', createdResource);
      
      navigate('/resources?tab=storage');
    } catch (error) {
      console.error('Failed to create storage resource:', error);
      alert('Failed to create storage resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" p={8}>
      <VStack spacing={6} maxW="600px" mx="auto">
        <Button
          onClick={() => navigate('/resources?tab=storage')}
          color="gray.600"
          alignSelf="flex-start"
        >
          ← Back
        </Button>
        
        <Text fontSize="2xl" fontWeight="bold">
          Add <Text as="span" color="blue.500">Storage Resource</Text>
        </Text>
        
        <Text color="gray.600" textAlign="center" fontSize="sm">
          Provide a name, description, and select the type of storage you want to register. The form will update to show the relevant fields based on your chosen storage type.
        </Text>
        
        <Box bg="white" p={8} borderRadius="lg" w="full" border="1px solid" borderColor="gray.200">
          <VStack as="form" onSubmit={handleSubmit} spacing={6} align="stretch">
            {/* Name */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Name
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="Enter resource name"
                value={formData.name}
                onChange={(e: any) => handleInputChange('name', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Description */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Description
              </Text>
              <Box
                as="textarea"
                placeholder="Enter resource description"
                value={formData.description}
                onChange={(e: any) => handleInputChange('description', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                minH="80px"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Storage Type */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Storage Type
              </Text>
              <Box
                as="select"
                value={formData.storageType}
                onChange={(e: any) => handleInputChange('storageType', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
                bg="white"
              >
                <option value="S3">S3</option>
                <option value="GCS">Google Cloud Storage</option>
                <option value="Azure">Azure Blob Storage</option>
              </Box>
            </VStack>

            {/* End Point URL */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                End Point URL
              </Text>
              <Box
                as="input"
                type="url"
                placeholder="https://s3.amazonaws.com"
                value={formData.endPointUrl}
                onChange={(e: any) => handleInputChange('endPointUrl', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Bucket Name */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Bucket Name
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="my-storage-bucket"
                value={formData.bucketName}
                onChange={(e: any) => handleInputChange('bucketName', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Access Key */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Access Key
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="AKIAIOSFODNN7EXAMPLE"
                value={formData.accessKey}
                onChange={(e: any) => handleInputChange('accessKey', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Secret Key */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Secret Key
              </Text>
              <Box
                as="input"
                type="password"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                value={formData.secretKey}
                onChange={(e: any) => handleInputChange('secretKey', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Submit Button */}
            <Button
              type="submit"
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              disabled={loading}
              w="full"
              mt={6}
              py={6}
            >
              {loading ? 'Creating...' : 'Verify & Create'}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};