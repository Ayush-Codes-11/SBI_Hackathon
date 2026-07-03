import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CustomerProvider } from "./context/CustomerContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VoiceAssistant from "./components/VoiceAssistant";
import Dashboard from "./pages/Dashboard";
import LifeEventPage from "./pages/LifeEventPage";
import JourneyPage from "./pages/JourneyPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AccountsPage from "./pages/AccountsPage";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"             element={<Dashboard />} />
        <Route path="/life-event"   element={<LifeEventPage />} />
        <Route path="/journey"      element={<JourneyPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/accounts"     element={<AccountsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomerProvider>
        <Navbar />
        <AppRoutes />
        <Footer />
        <VoiceAssistant />
      </CustomerProvider>
    </BrowserRouter>
  );
}
