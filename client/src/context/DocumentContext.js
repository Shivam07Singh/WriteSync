import { createContext } from "react";
import { AuthContext } from "./AuthContext";

export const DocumentContext = createContext()

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
      const res = await axios.put(`/api/documents/${id}`, documentData);

      setDocuments(documents.map((doc) => (doc._id === id ? { ...doc, ...res.data } : doc)));

      setCurrentDocument(res.data);
      setSaving(false);
      setSavedStatus("Saved");

      // Reset saved status after 2 seconds
      setTimeout(() => {
        setSavedStatus("");
      }, 2000);

      return res.data;
    } catch (err) {
      setError("Error updating document");
      setSaving(false);
      setSavedStatus("Error saving");
      return null;
    }
  };

  // Delete document
  const deleteDocument = async (id) => {
    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
      return true;
    } catch (err) {
      setError("Error deleting document");
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
}