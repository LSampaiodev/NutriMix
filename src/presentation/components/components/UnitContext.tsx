import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UnitContextType {
  unit: string;
  setUnit: (unit: string) => void;
  unitsAllowed: string[];
  setUnitsAllowed: (units: string[]) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnitState] = useState<string>("");
  const [unitsAllowed, setUnitsAllowedState] = useState<string[]>([]);

  useEffect(() => {
    // Carregar unidade ativa do localStorage ao iniciar
    const storedUnit = localStorage.getItem("active_unit");
    if (storedUnit) setUnitState(storedUnit);
    // Carregar unidades permitidas se houver
    const storedAllowed = localStorage.getItem("units_allowed");
    if (storedAllowed) setUnitsAllowedState(JSON.parse(storedAllowed));
  }, []);

  const setUnit = (u: string) => {
    setUnitState(u);
    localStorage.setItem("active_unit", u);
  };

  const setUnitsAllowed = (units: string[]) => {
    setUnitsAllowedState(units);
    localStorage.setItem("units_allowed", JSON.stringify(units));
  };

  return (
    <UnitContext.Provider value={{ unit, setUnit, unitsAllowed, setUnitsAllowed }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
}; 