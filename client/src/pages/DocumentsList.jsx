import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DocumentContext } from "../context/DocumentContext";

const DocumentsList = () => {
  const { documents, getDocuments, deleteDocument, loading, error } = useContext(DocumentContext);
  const navigate = useNavigate();

  useEffect(() => {
    getDocuments();
  }, []);

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(id);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container alert alert-danger">{error}</div>;

  return (
    <div className="documents-list">
      <div className="container">
        <div className="header">
          <h1>My Documents</h1>
          <Link to="/editor" className="btn btn-primary">
            Create New
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="no-documents">
            <p>You don't have any documents yet.</p>
            <Link to="/editor" className="btn btn-light">
              Create your first document
            </Link>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc._id} className="document-card">
                <h3>{doc.title}</h3>
                <p className="date">Last saved: {formatDate(doc.lastSaved)}</p>
                <div className="actions">
                  <Link to={`/editor/${doc._id}`} className="btn btn-sm">
                    Edit
                  </Link>
                  <button onClick={() => onDelete(doc._id)} className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsList;
