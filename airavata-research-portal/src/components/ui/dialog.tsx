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

import { Box, Button, ButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface DialogRootProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  children: React.ReactNode;
}

export const DialogRoot = ({ open, onOpenChange, children }: DialogRootProps) => {
  if (!open) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="overlay"
      onClick={() => onOpenChange({ open: false })}
    >
      {children}
    </Box>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
}

export const DialogContent = ({ children }: DialogContentProps) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="xl"
      maxW="md"
      w="full"
      mx={4}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Box>
  );
};

interface DialogHeaderProps {
  children: React.ReactNode;
}

export const DialogHeader = ({ children }: DialogHeaderProps) => {
  return (
    <Box
      px={6}
      py={4}
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      {children}
    </Box>
  );
};

interface DialogTitleProps {
  fontSize?: string;
  fontWeight?: string;
  children: React.ReactNode;
}

export const DialogTitle = ({ fontSize = "lg", fontWeight = "semibold", children }: DialogTitleProps) => {
  return (
    <Box fontSize={fontSize} fontWeight={fontWeight}>
      {children}
    </Box>
  );
};

interface DialogBodyProps {
  children: React.ReactNode;
}

export const DialogBody = ({ children }: DialogBodyProps) => {
  return (
    <Box px={6} py={4}>
      {children}
    </Box>
  );
};

interface DialogFooterProps {
  children: React.ReactNode;
}

export const DialogFooter = ({ children }: DialogFooterProps) => {
  return (
    <Box
      px={6}
      py={4}
      display="flex"
      justifyContent="flex-end"
      gap={3}
      borderTop="1px solid"
      borderColor="gray.200"
    >
      {children}
    </Box>
  );
};

interface DialogActionTriggerProps extends ButtonProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DialogActionTrigger = forwardRef<HTMLButtonElement, DialogActionTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    if (asChild && typeof children === 'object' && children !== null && 'props' in children) {
      // Pass the ref to the child component
      return children as React.ReactElement;
    }
    
    return (
      <Button ref={ref} {...props}>
        {children}
      </Button>
    );
  }
);

DialogActionTrigger.displayName = "DialogActionTrigger";