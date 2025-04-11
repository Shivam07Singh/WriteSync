import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");

  const { isAuthenticated } = useContext(AuthContext);

  // Get all documents
  const getDocuments = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const res = await axios.get("/api/documents");
      setDocuments(res.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching documents");
      setLoading(false);
    }
  };

  // Get document by ID
  const getDocument = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/documents/${id}`);
      setCurrentDocument(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError("Error fetching document");
      setLoading(false);
      return null;
    }
  };

  // Create new document
  const createDocument = async (title = "Untitled Document", content = "") => {
    try {
      const res = await axios.post("/api/documents", { title, content });
      setDocuments([res.data, ...documents]);
      setCurrentDocument(res.data);
      return res.data;
    } catch (err) {
      setError("Error creating document");
      return null;
    }
  };

  // Update document
  const updateDocument = async (id, documentData) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.put(`/api/documents/${id}`, documentData, {
        headers: {
          "x-auth-token": token,
        },
      });

      setDocuments(documents.map((doc) => (doc._id === id ? { ...doc, ...res.data.data } : doc)));
      setCurrentDocument(res.data.data);
      setSavedStatus("Saved");

      setTimeout(() => setSavedStatus(""), 2000);
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update document";
      setError(errorMsg);
      setSavedStatus("Error saving");
      console.error("Update error:", errorMsg);
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete document
  const deleteDocument = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`/api/documents/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      setDocuments(documents.filter((doc) => doc._id !== id));

      // If current document is the one being deleted, clear it
      if (currentDocument?._id === id) {
        setCurrentDocument(null);
      }

      return true;
    } catch (err) {
      console.error("Delete Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Error deleting document");
      return false;
    }
  };

  // Clear current document
  const clearCurrentDocument = () => {
    setCurrentDocument(null);
  };

  // Clear errors
  const clearError = () => setError(null);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        currentDocument,
        loading,
        error,
        saving,
        savedStatus,
        getDocuments,
        getDocument,
        createDocument,
        updateDocument,
        deleteDocument,
        clearCurrentDocument,
        clearError,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
