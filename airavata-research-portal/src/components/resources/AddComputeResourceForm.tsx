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
import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { adminApiService } from '../../lib/adminApi';

interface QueueConfig {
  queueName: string;
  queueDescription: string;
  queueMaxRunTime: string;
  queueMaxNodes: string;
  queueMaxProcessors: string;
  queueMaxJobsInQueue: string;
  queueMaxMemory: string;
  cpusPerNode: string;
  defaultNodeCount: string;
  defaultCpuCount: string;
  defaultWalltime: string;
}

export const AddComputeResourceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [formData, setFormData] = useState({
    hostName: '',
    hostAddress: '',
    ipAddresses: '',
    resourceDescription: '',
    sshUserName: '',
    sshPort: '',
    alternativeSSHHostName: '',
    authenticationMethod: 'SSH_KEY',
    workingDirectory: ''
  });

  const [queueConfig, setQueueConfig] = useState<QueueConfig>({
    queueName: '',
    queueDescription: '',
    queueMaxRunTime: '',
    queueMaxNodes: '',
    queueMaxProcessors: '',
    queueMaxJobsInQueue: '',
    queueMaxMemory: '',
    cpusPerNode: '',
    defaultNodeCount: '',
    defaultCpuCount: '',
    defaultWalltime: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQueueChange = (field: keyof QueueConfig, value: string) => {
    setQueueConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hostName.trim() || !formData.hostAddress.trim()) {
      alert('Please fill in host name and host address');
      return;
    }

    setLoading(true);
    try {
      const newComputeResource = {
        name: formData.hostName.trim(),
        description: formData.resourceDescription.trim(),
        computeType: formData.authenticationMethod,
        compute: `${formData.hostAddress} (${formData.sshUserName})`,
        status: 'ACTIVE',
        hostConfig: {
          hostName: formData.hostName,
          hostAddress: formData.hostAddress,
          ipAddresses: formData.ipAddresses,
          sshUserName: formData.sshUserName,
          sshPort: formData.sshPort,
          alternativeSSHHostName: formData.alternativeSSHHostName,
          authenticationMethod: formData.authenticationMethod,
          workingDirectory: formData.workingDirectory
        },
        queueConfig: showQueue ? queueConfig : null
      };

      console.log('Submitting compute resource:', newComputeResource);
      const createdResource = await adminApiService.createComputeResource(newComputeResource);
      console.log('Compute resource created successfully:', createdResource);
      
      navigate('/resources?tab=compute');
    } catch (error) {
      console.error('Failed to create compute resource:', error);
      alert('Failed to create compute resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" p={8}>
      <VStack spacing={6} maxW="600px" mx="auto">
        <Button
          onClick={() => navigate('/resources?tab=compute')}
          color="gray.600"
          alignSelf="flex-start"
        >
          ← Back
        </Button>
        
        <Text fontSize="2xl" fontWeight="bold">
          Add <Text as="span" color="blue.500">Compute Resource</Text>
        </Text>
        
        <Text color="gray.600" textAlign="center" fontSize="sm">
          Add host based identification details about your computational resource. Input SSH connectivity and other details which will be required to set up a gateway.
        </Text>
        
        <Box bg="white" p={8} borderRadius="lg" w="full" border="1px solid" borderColor="gray.200">
          <VStack as="form" onSubmit={handleSubmit} spacing={6} align="stretch">
            {/* Host Name */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Host Name *
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="Enter host name"
                value={formData.hostName}
                onChange={(e: any) => handleInputChange('hostName', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Host Address */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Host Address *
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="Enter host address"
                value={formData.hostAddress}
                onChange={(e: any) => handleInputChange('hostAddress', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* IP Addresses */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                IP Addresses
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="Enter IP addresses"
                value={formData.ipAddresses}
                onChange={(e: any) => handleInputChange('ipAddresses', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Resource Description */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Resource Description
              </Text>
              <Box
                as="textarea"
                placeholder="Enter resource description"
                value={formData.resourceDescription}
                onChange={(e: any) => handleInputChange('resourceDescription', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                minH="80px"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* SSH Username */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                SSH Username
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="Enter SSH username"
                value={formData.sshUserName}
                onChange={(e: any) => handleInputChange('sshUserName', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* SSH Port */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                SSH Port
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="22"
                value={formData.sshPort}
                onChange={(e: any) => handleInputChange('sshPort', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Authentication Method */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Authentication Method *
              </Text>
              <Box
                as="select"
                value={formData.authenticationMethod}
                onChange={(e: any) => handleInputChange('authenticationMethod', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
                bg="white"
              >
                <option value="SSH_KEY">SSH Key</option>
                <option value="PASSWORD">Password</option>
                <option value="GSI">GSI</option>
              </Box>
            </VStack>

            {/* Working Directory */}
            <VStack align="start" spacing={2}>
              <Text fontWeight="medium" color="gray.700">
                Working Directory *
              </Text>
              <Box
                as="input"
                type="text"
                placeholder="/home/username/work"
                value={formData.workingDirectory}
                onChange={(e: any) => handleInputChange('workingDirectory', e.target.value)}
                w="full"
                p={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500" }}
              />
            </VStack>

            {/* Add Queue Button */}
            <Button
              type="button"
              onClick={() => setShowQueue(!showQueue)}
              variant="outline"
              size="sm"
              alignSelf="flex-start"
            >
              {showQueue ? '- Remove Queue' : '+ Add Queue'}
            </Button>

            {/* Queue Configuration */}
            {showQueue && (
              <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={6}>
                <Text fontSize="lg" fontWeight="medium" mb={4}>Add a Queue</Text>
                
                <VStack spacing={4}>
                  <HStack spacing={4} w="full">
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Queue Name
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Queue name"
                        value={queueConfig.queueName}
                        onChange={(e: any) => handleQueueChange('queueName', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Queue Description
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Queue description"
                        value={queueConfig.queueDescription}
                        onChange={(e: any) => handleQueueChange('queueDescription', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Queue Max Run Time
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Max run time"
                        value={queueConfig.queueMaxRunTime}
                        onChange={(e: any) => handleQueueChange('queueMaxRunTime', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Queue Max Nodes
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Max nodes"
                        value={queueConfig.queueMaxNodes}
                        onChange={(e: any) => handleQueueChange('queueMaxNodes', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Queue Max Processors
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Max processors"
                        value={queueConfig.queueMaxProcessors}
                        onChange={(e: any) => handleQueueChange('queueMaxProcessors', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Queue Max Jobs In Queue
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Max jobs"
                        value={queueConfig.queueMaxJobsInQueue}
                        onChange={(e: any) => handleQueueChange('queueMaxJobsInQueue', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Queue Max Memory
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Max memory"
                        value={queueConfig.queueMaxMemory}
                        onChange={(e: any) => handleQueueChange('queueMaxMemory', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        CPUs per Node
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="CPUs per node"
                        value={queueConfig.cpusPerNode}
                        onChange={(e: any) => handleQueueChange('cpusPerNode', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Default Node Count
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Default nodes"
                        value={queueConfig.defaultNodeCount}
                        onChange={(e: any) => handleQueueChange('defaultNodeCount', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        Default CPU Count
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Default CPUs"
                        value={queueConfig.defaultCpuCount}
                        onChange={(e: any) => handleQueueChange('defaultCpuCount', e.target.value)}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        fontSize="sm"
                        _focus={{ borderColor: "blue.500" }}
                      />
                    </VStack>
                  </HStack>

                  <VStack align="start" spacing={2} w="full">
                    <Text fontWeight="medium" color="gray.700" fontSize="sm">
                      Default Walltime
                    </Text>
                    <Box
                      as="input"
                      type="text"
                      placeholder="Default walltime"
                      value={queueConfig.defaultWalltime}
                      onChange={(e: any) => handleQueueChange('defaultWalltime', e.target.value)}
                      w="full"
                      p={2}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      fontSize="sm"
                      _focus={{ borderColor: "blue.500" }}
                    />
                  </VStack>
                </VStack>
              </Box>
            )}

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