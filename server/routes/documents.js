const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const auth = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

//Get all documents for a user
router.get("/", auth, async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({ lastSaved: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get a specific document
router.get("/:id", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create a new document
router.post("/", auth, async (req, res) => {
  try {
    const newDocument = new Document({
      title: req.body.title || "Untitled Document",
      content: req.body.content || "",
      user: req.user.id,
    });
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update document
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID format",
      });
    }

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Verify document ownership
    if (document.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this document",
      });
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title || document.title,
          content: req.body.content || document.content,
          lastSaved: Date.now(),
        },
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during update",
      error: error.message,
    });
  }
});

//Delete a document
router.delete("/:id", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Ensure the user owns the document
    if (document.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
