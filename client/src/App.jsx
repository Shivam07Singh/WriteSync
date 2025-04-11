import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DocumentProvider } from "./context/DocumentContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Editor from "./pages/Editor";
import DocumentsList from "./pages/DocumentsList";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/documents"
              element={
                <PrivateRoute>
                  <DocumentsList />
                </PrivateRoute>
              }
            />
            <Route path="/document" element={<Navigate to="/documents" replace />} />

            <Route
              path="/view/:id"
              element={
                <PrivateRoute>
                  <Editor readOnly={true} />
                </PrivateRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <PrivateRoute>
                  <Editor />
                </PrivateRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <PrivateRoute>
                  <Editor />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </DocumentProvider>
    </AuthProvider>
  );
}

export default App;
