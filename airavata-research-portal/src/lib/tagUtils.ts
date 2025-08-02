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

/**
 * TagV2 interface representing backend tag objects
 * Uses 'name' to match actual JSON response from Tag entity
 */
export interface TagV2 {
  id: string;
  name: string;
}

/**
 * Utility function to normalize a single tag to string
 * Handles both legacy string tags and new TagV2 objects
 */
export const normalizeTag = (tag: string | TagV2): string => {
  return typeof tag === 'string' ? tag : tag.name;
};

/**
 * Utility function to normalize an array of tags to strings
 * Handles both legacy string arrays and new TagV2 object arrays
 */
export const normalizeTags = (tags: (string | TagV2)[]): string[] => {
  return tags.map(normalizeTag);
};

/**
 * Type guard to check if a tag is a TagV2 object
 */
export const isTagV2 = (tag: string | TagV2): tag is TagV2 => {
  return typeof tag === 'object' && tag !== null && 'name' in tag;
};