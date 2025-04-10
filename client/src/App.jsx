import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DocumentProvider } from "./context/DocumentContext";

function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <Router>hi</Router>
      </DocumentProvider>
    </AuthProvider>
  );
}

export default App;
