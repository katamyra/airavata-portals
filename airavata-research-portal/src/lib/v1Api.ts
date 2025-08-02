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

import axios from 'axios';

const v1Api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/rf',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
v1Api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('V1 API Error:', error);
    return Promise.reject(error);
  }
);

export const v1ApiService = {
  // Dataset endpoints using v1 API
  async getDatasets(pageNumber = 0, pageSize = 50, nameSearch = '') {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      nameSearch: nameSearch,
      type: 'DATASET'
    });
    
    const response = await v1Api.get(`/resources/public?${params}`);
    return response.data;
  },

  async getDatasetById(id: string) {
    const response = await v1Api.get(`/resources/public/${id}`);
    return response.data;
  },

  async searchDatasets(keyword: string) {
    const response = await v1Api.get(`/resources/search?type=DATASET&name=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  async createDataset(dataset: any) {
    const response = await v1Api.post('/resources/dataset', dataset);
    return response.data;
  },

  async deleteDataset(id: string) {
    const response = await v1Api.delete(`/resources/${id}`);
    return response.data;
  },

  // Star endpoints - using actual v1 API endpoints
  async starDataset(id: string) {
    const response = await v1Api.post(`/resources/${id}/star`);
    return response.data; // Returns boolean indicating new star state
  },

  async getDatasetStarStatus(id: string) {
    const response = await v1Api.get(`/resources/${id}/star`);
    return response.data; // Returns boolean indicating if starred
  },

  // Tags endpoint
  async getAllTags() {
    const response = await v1Api.get('/resources/public/tags/all');
    return response.data;
  },

  // Get starred resources - requires user ID
  async getStarredResources(userId: string) {
    const response = await v1Api.get(`/resources/${userId}/stars`);
    return response.data; // Returns List<Resource>
  },

  // Model endpoints using v1 API
  async getModels(pageNumber = 0, pageSize = 50, nameSearch = '') {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      nameSearch: nameSearch,
      type: 'MODEL'
    });
    
    const response = await v1Api.get(`/resources/public?${params}`);
    return response.data;
  },

  async getModelById(id: string) {
    const response = await v1Api.get(`/resources/public/${id}`);
    return response.data;
  },

  async searchModels(keyword: string) {
    const response = await v1Api.get(`/resources/search?type=MODEL&name=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // Repository endpoints using v1 API
  async getRepositories(pageNumber = 0, pageSize = 50, nameSearch = '') {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      nameSearch: nameSearch,
      type: 'REPOSITORY'
    });
    
    const response = await v1Api.get(`/resources/public?${params}`);
    return response.data;
  },

  async getRepositoryById(id: string) {
    const response = await v1Api.get(`/resources/public/${id}`);
    return response.data;
  },

  async searchRepositories(keyword: string) {
    const response = await v1Api.get(`/resources/search?type=REPOSITORY&name=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // Notebook endpoints using v1 API
  async getNotebooks(pageNumber = 0, pageSize = 50, nameSearch = '') {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      nameSearch: nameSearch,
      type: 'NOTEBOOK'
    });
    
    const response = await v1Api.get(`/resources/public?${params}`);
    return response.data;
  },

  async getNotebookById(id: string) {
    const response = await v1Api.get(`/resources/public/${id}`);
    return response.data;
  },

  async searchNotebooks(keyword: string) {
    const response = await v1Api.get(`/resources/search?type=NOTEBOOK&name=${encodeURIComponent(keyword)}`);
    return response.data;
  }
};