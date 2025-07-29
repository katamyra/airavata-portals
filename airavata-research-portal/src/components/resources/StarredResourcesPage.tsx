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

import {useEffect, useState} from "react";
import {useAuth} from "react-oidc-context";
import {Container, SimpleGrid, Spinner} from "@chakra-ui/react";
import {Resource} from "@/interfaces/ResourceType.ts";
import {ResourceCard} from "@/components/home/ResourceCard.tsx";
import {PageHeader} from "@/components/PageHeader.tsx";
import {StatusEnum} from "@/interfaces/StatusEnum.ts";
import {PrivacyEnum} from "@/interfaces/PrivacyEnum.ts";
import {v1ApiService} from "@/lib/v1Api.ts";
import {normalizeTag} from "@/lib/tagUtils.ts";

export const StarredResourcesPage = () => {
  const [starredResources, setStarredResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading || !auth.user?.profile.email) return;

    async function getStarredResources() {
      try {
        setLoading(true);
        // Fetch starred codes from v2 API
        const response = await fetch('http://localhost:8080/api/v2/rf/codes/starred');
        const data = await response.json();
        
        // Transform v2 Code data to match expected Resource format
        const transformedResources = data.content ? data.content.map((code: any) => ({
          id: code.id.toString(),
          name: code.name || 'Untitled Code',
          description: code.description || '',
          headerImage: code.headerImage || '',
          authors: code.authors || [],
          tags: (code.tags || []).map((tag: any) => ({ 
            value: normalizeTag(tag) 
          })),
          status: StatusEnum.VERIFIED,
          privacy: PrivacyEnum.PUBLIC,
          type: 'CODE'
        })) : [];
        
        setStarredResources(transformedResources);
      } catch (error) {
        console.error('Error fetching starred resources:', error);
        setStarredResources([]);
      } finally {
        setLoading(false);
      }
    }

    getStarredResources();
  }, [auth.isLoading, auth.user?.profile.email]);

  return (
      <Container maxW="container.lg" mt={8}>
        <PageHeader title={"Starred Resources"}
                    description={"Resources that you have starred will show up here, for easy access."}/>
        <SimpleGrid
            columns={{base: 1, md: 2, lg: 4}}
            mt={4}
            gap={2}
            justifyContent="space-around"
        >
          {starredResources.map((resource: Resource) => {
            return (
                <ResourceCard
                    resource={resource}
                    key={resource.id}
                    removeOnUnStar={true}
                />
            );
          })}
        </SimpleGrid>
        {
            loading && (
                <Spinner/>
            )
        }
      </Container>
  )
}