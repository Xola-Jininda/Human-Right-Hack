"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ExpandedContextType {
  expanded: boolean;
  toggleExpanded: () => void;
}

const ExpandedContext = createContext<ExpandedContextType | undefined>(undefined);

export function ExpandedProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <ExpandedContext.Provider value={{ expanded, toggleExpanded }}>
      {children}
    </ExpandedContext.Provider>
  );
}

export function useExpanded(): ExpandedContextType {
  const context = useContext(ExpandedContext);
  if (context === undefined) {
    throw new Error("useExpanded must be used within an ExpandedProvider");
  }
  return context;
} 