const Resource = require('../models/ResourceModel');

require("dotenv").config();;

const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createResource = async (req, res) => {
  const resource = new Resource({
    name: req.body.name,
    imgUrl: req.body.imgUrl,
    links: req.body.links,
  });

  try {
    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (err) {
    console.error("Error creating resource:", err.message);

    // Check if the error is a validation error
    if (err.name === 'ValidationError') {
      // Send detailed validation error response
      return res.status(400).json({ message: err.message, errors: err.errors });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};


const updateResource = async (req, res) => {
  let resource = await Resource.findById(req.params.id);

  if (req.body.name != null) {
    resource.name = req.body.name;
  }

  if (req.body.imgUrl != null) {
    resource.imgUrl = req.body.imgUrl;
  }

  if (req.body.links != null) {
    resource.links = req.body.links;
  }

  try {
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteResource = async (req, res) => {
  console.log(req.params.id);
  const objectId = new mongoose.Types.ObjectId(req.params.id);
  try {
    await Resource.findByIdAndRemove(objectId);
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResources = getResources;
exports.getResource = getResource;
exports.createResource = createResource;
exports.updateResource  = updateResource ;
exports.deleteResource  = deleteResource ;