const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");

const router = express.Router();

// POST /contacts - Create a contact
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();

    res.status(201).json({
      message: "Contact created successfully",
      contact: savedContact
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "contactId or email already exists"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// GET /contacts - Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({
      count: contacts.length,
      contacts: contacts
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// GET /contacts/:id - Get contact by MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// PUT /contacts/:id - Update contact
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid contact ID"
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedContact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "contactId or email already exists"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// DELETE /contacts/:id - Delete contact
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid contact ID"
      });
    }

    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json({
      message: "Contact deleted successfully",
      contact: deletedContact
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;