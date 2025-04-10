import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { DocumentContext } from "../context/DocumentContext";

const Editor = () => {
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
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  const autoSaveTimerRef = useRef(null);
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
      } else {
        const newDoc = await createDocument();
        if (newDoc) {
          setValue(newDoc.content);
          setTitle(newDoc.title);
          navigate(`/editor/${newDoc._id}`);
        }
      }
    };

    loadDocument();

    return () => {
      // Clear autosave timer when component unmounts
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [id]);

  // Focus title input when creating new document
  useEffect(() => {
    if (!id && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [id]);

  // Autosave function
  const autoSave = useCallback(() => {
    if (
      autoSaveEnabled &&
      currentDocument &&
      (value !== currentDocument.content || title !== currentDocument.title)
    ) {
      updateDocument(currentDocument._id, { title, content: value });
    }
  }, [autoSaveEnabled, currentDocument, title, value, updateDocument]);
  // Set up autosave timer
  useEffect(() => {
    if (autoSaveEnabled && currentDocument) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for 2 seconds after typing stops
      autoSaveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [value, title, autoSaveEnabled, autoSave]);

  // Manual save handler
  const handleSave = () => {
    if (currentDocument) {
      updateDocument(currentDocument._id, { title, content: value });
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toggle autosave
  const toggleAutosave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
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
      <div className="editor-toolbar">
        <div className="left-controls">
          <button className="btn btn-sm" onClick={handleBack}>
            ← Back
          </button>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="title-input"
          />
        </div>
        <div className="right-controls">
          <span className={`save-status ${savedStatus ? "visible" : ""}`}>
            {saving ? "Saving..." : savedStatus}
          </span>
          <button
            className={`btn btn-sm ${autoSaveEnabled ? "active" : ""}`}
            onClick={toggleAutosave}
            title="Toggle Autosave"
          >
            {autoSaveEnabled ? "Autosave: On" : "Autosave: Off"}
          </button>
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
      </div>

      <div className="editor-content">
        <MDEditor
          value={value}
          onChange={setValue}
          preview={showPreview ? "live" : "edit"}
          height={isFullscreen ? "calc(100vh - 60px)" : "70vh"}
          visibleDragbar={true}
          textareaProps={{
            placeholder: "Start writing your markdown here...",
          }}
        />
      </div>
    </div>
  );
};

export default Editor;