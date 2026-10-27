import Item from "../models/items.js";

export const createItems = async (req, res) => {
  try {
    let { name, description } = req.body;
    let newItem = await Item.create({ name, description });
    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newItem,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getItem = async (req, res) => {
  try {
    let items = await Item.find();
    return res.status(201).json({ success: true, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    let updateItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateItem)
      return res
        .status(401)
        .json({ success: false, message: "Item is Not found" });

    return res.status(201).json({
      success: true,
      data: updateItem,
      message: "Item updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    let deleteItem = await Item.findByIdAndDelete(req.params.id);
    if (!deleteItem)
      return res
        .status(401)
        .json({ success: false, message: "Item not found" });

    return res.status(201).json({ success: true, message: "Item deleted" });
  } catch (err) {
    return res.status(501).json({ success: false, error: err.message });
  }
};
