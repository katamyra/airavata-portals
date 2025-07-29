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
import { 
  Box, 
  VStack, 
  Text, 
  Button, 
  Input, 
  Textarea, 
  Select,
  HStack,
  Container
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { researchApiService } from '../../lib/researchApi';
import { toaster } from '@/components/ui/toaster';

export const AddCodeForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    codeType: '',
    programmingLanguage: '',
    framework: '',
    tags: '',
    authors: ''
  });

  const codeTypes = [
    'Library',
    'Framework',
    'Application',
    'Script',
    'Module',
    'Plugin',
    'API',
    'Tool'
  ];

  const programmingLanguages = [
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'TypeScript',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
    'R',
    'MATLAB',
    'Scala',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.codeType || !formData.programmingLanguage) {
      toaster.create({
        title: "Missing Information",
        description: "Please fill in name, description, code type, and programming language",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const newCode = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        codeType: formData.codeType,
        programmingLanguage: formData.programmingLanguage,
        framework: formData.framework || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        authors: formData.authors ? formData.authors.split(',').map(author => author.trim()).filter(author => author) : [],
        starCount: 0
      };

      console.log('Submitting code:', newCode);
      await researchApiService.createCode(newCode);
      
      toaster.create({
        title: "Code Added Successfully",
        description: `${newCode.name} has been added to the code repository`,
        type: "success",
      });
      
      navigate('/codes');
    } catch (error) {
      console.error('Failed to create code:', error);
      toaster.create({
        title: "Failed to Add Code",
        description: "There was an error adding the code. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="800px" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/codes')}
              leftIcon={<Text>←</Text>}
              mb={6}
            >
              Back to Code
            </Button>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
              Add New Code
            </Text>
            <Text color="gray.600" fontSize="md">
              Share your code with the CyberShuttle community
            </Text>
          </Box>

          {/* Form */}
          <Box bg="white" p={8} borderRadius="xl" shadow="sm">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Code Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter the name of your code"
                    size="md"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Description *
                  </Text>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what your code does and its purpose"
                    rows={4}
                    resize="vertical"
                  />
                </Box>

                <HStack spacing={4}>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Code Type *
                    </Text>
                    <Select
                      value={formData.codeType}
                      onChange={(e) => handleInputChange('codeType', e.target.value)}
                      placeholder="Select code type"
                    >
                      {codeTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Programming Language *
                    </Text>
                    <Select
                      value={formData.programmingLanguage}
                      onChange={(e) => handleInputChange('programmingLanguage', e.target.value)}
                      placeholder="Select language"
                    >
                      {programmingLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </HStack>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Framework (Optional)
                  </Text>
                  <Input
                    value={formData.framework}
                    onChange={(e) => handleInputChange('framework', e.target.value)}
                    placeholder="e.g., React, Django, Spring Boot, TensorFlow"
                    size="md"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Tags (Optional)
                  </Text>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Separate tags with commas (e.g., machine-learning, web, api)"
                    size="md"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Authors (Optional)
                  </Text>
                  <Input
                    value={formData.authors}
                    onChange={(e) => handleInputChange('authors', e.target.value)}
                    placeholder="Separate authors with commas (e.g., john@example.com, jane@example.com)"
                    size="md"
                  />
                </Box>

                <HStack spacing={4} pt={4}>
                  <Button
                    type="submit"
                    bg="#60b4f7"
                    color="white"
                    _hover={{ bg: "#4a9ce6" }}
                    size="md"
                    isLoading={loading}
                    loadingText="Adding Code..."
                  >
                    Add Code
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/codes')}
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};