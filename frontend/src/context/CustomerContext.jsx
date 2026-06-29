import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { MOCK_CUSTOMERS } from "../data/mockCustomers";
import { fetchPrediction, checkBackendHealth } from "../services/api";

const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
  const [selectedCustomer, setSelectedCustomerRaw] = useState(MOCK_CUSTOMERS[0]);
  const [language, setLanguage] = useState("en"); // "en" | "hi"
  const [journeyProgress, setJourneyProgress] = useState({});
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const toggleLanguage = () => setLanguage((l) => (l === "en" ? "hi" : "en"));

  const t = (en, hi) => (language === "hi" && hi ? hi : en);

  // Fetch prediction on startup for the initial customer if backend is live
  useEffect(() => {
    const initPrediction = async () => {
      try {
        const isOnline = await checkBackendHealth();
        if (isOnline) {
          const result = await fetchPrediction(selectedCustomer.id);
          setSelectedCustomerRaw((prev) => ({
            ...prev,
            prediction: result.prediction,
          }));
        }
      } catch (err) {
        console.warn("[CustomerContext] Initial prediction fetch failed:", err.message);
      }
    };
    initPrediction();
  }, []);

  // Live prediction when switching profiles
  const setSelectedCustomer = useCallback(async (customer) => {
    if (customer.id === selectedCustomer.id) return;
    setIsLoadingCustomer(true);
    try {
      const isOnline = await checkBackendHealth();
      if (isOnline) {
        console.log(`[CustomerContext] Backend online. Fetching prediction for: ${customer.id}`);
        const result = await fetchPrediction(customer.id);
        const updatedCustomer = {
          ...customer,
          prediction: result.prediction,
        };
        setSelectedCustomerRaw(updatedCustomer);
      } else {
        console.log(`[CustomerContext] Backend offline. Falling back to local prediction for: ${customer.id}`);
        setSelectedCustomerRaw(customer);
      }
    } catch (err) {
      console.warn(`[CustomerContext] API error: ${err.message}. Falling back to local data.`);
      setSelectedCustomerRaw(customer);
    } finally {
      setIsLoadingCustomer(false);
    }
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
