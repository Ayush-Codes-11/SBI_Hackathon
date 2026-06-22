import React, { createContext, useContext, useState, useCallback } from "react";
import { MOCK_CUSTOMERS } from "../data/mockCustomers";

const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
  const [selectedCustomer, setSelectedCustomerRaw] = useState(MOCK_CUSTOMERS[0]);
  const [language, setLanguage] = useState("en"); // "en" | "hi"
  const [journeyProgress, setJourneyProgress] = useState({});
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const toggleLanguage = () => setLanguage((l) => (l === "en" ? "hi" : "en"));

  const t = (en, hi) => (language === "hi" && hi ? hi : en);

  // Deliberate loading state when switching profiles (600ms feel of "AI re-running")
  const setSelectedCustomer = useCallback((customer) => {
    if (customer.id === selectedCustomer.id) return;
    setIsLoadingCustomer(true);
    setTimeout(() => {
      setSelectedCustomerRaw(customer);
      setIsLoadingCustomer(false);
    }, 650);
  }, [selectedCustomer.id]);

  const activateProduct = (customerId, productId) => {
    setJourneyProgress((prev) => ({
      ...prev,
      [customerId]: {
        ...(prev[customerId] || {}),
        [productId]: true,
      },
    }));
  };

  const getActivatedProducts = (customerId) => journeyProgress[customerId] || {};

  const resetJourney = (customerId) => {
    setJourneyProgress((prev) => ({ ...prev, [customerId]: {} }));
  };

  return (
    <CustomerContext.Provider
      value={{
        selectedCustomer,
        setSelectedCustomer,
        isLoadingCustomer,
        language,
        toggleLanguage,
        t,
        activateProduct,
        getActivatedProducts,
        resetJourney,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
};
