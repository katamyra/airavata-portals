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

import { adminApiService } from './adminApi';
import { researchApiService } from './researchApi';

// Detect local development environment
const isLocalDevelopment = () => {
  const isLocal = window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.port === '5173'; // Vite default port
  console.log('🔍 Environment check:', { 
    hostname: window.location.hostname, 
    port: window.location.port, 
    isLocal,
    fullLocation: window.location.href 
  });
  return isLocal;
};

// Unified API service that routes to appropriate backend
export const unifiedApiService = {
  // Compute Resources - Use research API v2 when local, fallback to admin API
  async getComputeResources(params?: any) {
    console.log('🔍 isLocalDevelopment:', isLocalDevelopment());
    console.log('🔍 hostname:', window.location.hostname);
    console.log('🔍 port:', window.location.port);
    
    if (isLocalDevelopment()) {
      console.log('✅ Using RESEARCH API v2 for compute resources', params);
      return await researchApiService.getComputeResources(params);
    }
    console.log('⚠️ Using ADMIN API for compute resources');
    return await adminApiService.getComputeResources();
  },

  async getComputeResourceById(id: string | number) {
    if (isLocalDevelopment()) {
      return await researchApiService.getComputeResourceById(String(id));
    }
    return await adminApiService.getComputeResourceById(Number(id));
  },

  async createComputeResource(computeResource: any) {
    if (isLocalDevelopment()) {
      return await researchApiService.createComputeResource(computeResource);
    }
    return await adminApiService.createComputeResource(computeResource);
  },

  async updateComputeResource(id: string | number, computeResource: any) {
    if (isLocalDevelopment()) {
      return await researchApiService.updateComputeResource(String(id), computeResource);
    }
    // Admin API doesn't have update endpoint yet
    throw new Error('Update not supported in production yet');
  },

  async deleteComputeResource(id: string | number) {
    if (isLocalDevelopment()) {
      return await researchApiService.deleteComputeResource(String(id));
    }
    // Admin API doesn't have delete endpoint yet
    throw new Error('Delete not supported in production yet');
  },

  async searchComputeResources(keyword: string) {
    if (isLocalDevelopment()) {
      return await researchApiService.searchComputeResources(keyword);
    }
    return await adminApiService.searchComputeResources(keyword);
  },

  // Storage Resources - Use research API v2 when local, fallback to admin API  
  async getStorageResources(params?: any) {
    console.log('🔍 isLocalDevelopment:', isLocalDevelopment());
    
    if (isLocalDevelopment()) {
      console.log('✅ Using RESEARCH API v2 for storage resources', params);
      return await researchApiService.getStorageResources(params);
    }
    console.log('⚠️ Using ADMIN API for storage resources');
    return await adminApiService.getStorageResources();
  },

  async getStorageResourceById(id: string | number) {
    if (isLocalDevelopment()) {
      return await researchApiService.getStorageResourceById(String(id));
    }
    return await adminApiService.getStorageResourceById(Number(id));
  },

  async createStorageResource(storageResource: any) {
    if (isLocalDevelopment()) {
      return await researchApiService.createStorageResource(storageResource);
    }
    return await adminApiService.createStorageResource(storageResource);
  },

  async updateStorageResource(id: string | number, storageResource: any) {
    if (isLocalDevelopment()) {
      return await researchApiService.updateStorageResource(String(id), storageResource);
    }
    // Admin API doesn't have update endpoint yet
    throw new Error('Update not supported in production yet');
  },

  async deleteStorageResource(id: string | number) {
    if (isLocalDevelopment()) {
      return await researchApiService.deleteStorageResource(String(id));
    }
    // Admin API doesn't have delete endpoint yet
    throw new Error('Delete not supported in production yet');
  },

  async searchStorageResources(keyword: string) {
    if (isLocalDevelopment()) {
      return await researchApiService.searchStorageResources(keyword);
    }
    return await adminApiService.searchStorageResources(keyword);
  },
};