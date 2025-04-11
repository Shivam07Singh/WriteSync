import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { DocumentContext } from "../context/DocumentContext";

const Editor = ({ readOnly = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentDocument,
    getDocument,
    createDocument,
    updateDocument,
    loading,
    error,
    saving,
    savedStatus,
  } = useContext(DocumentContext);

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const titleInputRef = useRef(null);

  // Load document or create new one
  useEffect(() => {
    const loadDocument = async () => {
      if (id) {
        const doc = await getDocument(id);
        if (doc) {
          setValue(doc.content);
          setTitle(doc.title);
        }
      } else if (!readOnly) {
        const newDoc = await createDocument();
        if (newDoc) {
          setValue(newDoc.content);
          setTitle(newDoc.title);
          navigate(`/editor/${newDoc._id}`);
        }
      }
    };

    loadDocument();
  }, [id, readOnly]);

  // Focus title input when creating new document
  useEffect(() => {
    if (!id && !readOnly && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [id, readOnly]);

  // Manual save handler
  const handleSave = () => {
    if (!readOnly && currentDocument) {
      updateDocument(currentDocument._id, { title, content: value });
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Return to documents list
  const handleBack = () => {
    navigate("/documents");
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container alert alert-danger">{error}</div>;

  return (
    <div className={`editor-container ${isFullscreen ? "fullscreen" : ""}`}>
      {readOnly && (
        <div className="view-mode-banner">
          View Mode (Read Only) - <Link to={`/editor/${id}`}>Edit Document</Link>
        </div>
      )}

      <div className="editor-toolbar">
        <div className="left-controls">
          <button className="btn btn-sm" onClick={handleBack}>
            ← Back
          </button>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => !readOnly && setTitle(e.target.value)}
            placeholder="Document Title"
            className="title-input"
            readOnly={readOnly}
          />
        </div>
        {!readOnly && (
          <div className="right-controls">
            <span className={`save-status ${savedStatus ? "visible" : ""}`}>
              {saving ? "Saving..." : savedStatus}
            </span>
            <button
              className={`btn btn-sm ${showPreview ? "active" : ""}`}
              onClick={togglePreview}
              title="Toggle Preview"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <button className="btn btn-sm" onClick={handleSave} disabled={saving}>
              Save
            </button>
            <button
              className={`btn btn-sm ${isFullscreen ? "active" : ""}`}
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
        )}
      </div>

      <div className="editor-content">
        <MDEditor
          value={value}
          onChange={!readOnly ? setValue : undefined}
          preview={readOnly ? "preview" : showPreview ? "live" : "edit"}
          height={isFullscreen ? "calc(100vh - 60px)" : "70vh"}
          visibleDragbar={!readOnly}
          textareaProps={{
            placeholder: readOnly ? "" : "Start writing your markdown here...",
            readOnly: readOnly,
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
