import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DocumentContext } from "../context/DocumentContext";

const DocumentViewer = () => {
  const { id } = useParams();
  const { getDocument } = useContext(DocumentContext);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const doc = await getDocument(id);
        setDocument(doc);
      } catch (err) {
        setError("Error fetching document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!document) return <div>Document not found</div>;

  return (
    <div className="container document-viewer">
      <h1>{document.title}</h1>
      <div className="document-content" dangerouslySetInnerHTML={{ __html: document.content }} />
      <Link to="/" className="btn btn-secondary">
        Back to Documents
      </Link>
    </div>
  );
};

export default DocumentViewer;
