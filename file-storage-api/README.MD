# 📂 File Storage Services API (Project 3)

A robust backend service built with Node.js, Express, MongoDB, and **Cloudinary** for handling seamless cloud-based file uploads (both single and multiple files) using Multer memory storage.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose (ODM)
- **Cloud Storage:** Cloudinary SDK (`upload_stream`)
- **Middleware:** Multer (`memoryStorage`)
- **API Testing Tool:** Thunder Client

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in your root directory and configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📁 Project Folder Structure

```text
file-storage-api/
│
├── config/
│   ├── db.js               # MongoDB Connection
│   └── cloudinary.js       # Cloudinary SDK Configuration
│
├── controllers/
│   └── fileController.js   # Single & Multiple file upload logic
│
├── middleware/
│   └── upload.js           # Multer memoryStorage configuration
│
├── models/
│   └── FileModel.js        # Mongoose schema for file metadata
│
├── routes/
│   └── fileRoutes.js       # API endpoint routing
│
├── utils/
│   └── cloudinaryUpload.js # Cloudinary stream upload utility
│
├── .env                    # Environment variables
├── package.json
└── server.js               # Main application entry point
```

---

## ⚙️ Implementation Details

### 1. File Model (`models/FileModel.js`)

Stores file metadata (original name, secure cloud URL, size, and mimetype) in MongoDB.

```javascript
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true }, // Cloudinary Secure URL
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("File", fileSchema);
```

### 2. Cloudinary Config (`config/cloudinary.js`)

Initializes the Cloudinary SDK using credentials from environment variables.

```javascript
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### 3. Multer Middleware (`middleware/upload.js`)

Configures Multer to store files temporarily in RAM (buffer) rather than local disk.

```javascript
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
```

### 4. Cloudinary Upload Utility (`utils/cloudinaryUpload.js`)

Streams the file buffer directly to Cloudinary.

```javascript
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "file-storage-api" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};
```

### 5. File Controller (`controllers/fileController.js`)

Handles single and multiple file uploads, streaming buffers to Cloudinary and saving metadata to MongoDB.

```javascript
import { StatusCodes } from "http-status-codes";
import File from "../models/FileModel.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// Single File Upload
export const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

    const newFile = await File.create({
      fileName: req.file.originalname,
      filePath: cloudinaryResponse.secure_url,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "File uploaded to Cloudinary Successfully",
      data: newFile,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error during cloud upload",
    });
  }
};

// Multiple Files Upload
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "upload at least one file",
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const cloudinaryResponse = await uploadToCloudinary(file.buffer);

      return File.create({
        fileName: file.originalname,
        filePath: cloudinaryResponse.secure_url,
        fileType: file.mimetype,
        fileSize: file.size,
      });
    });

    const savedFiles = await Promise.all(uploadPromises);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "File Uploads Successfully",
      data: savedFiles,
    });
  } catch (error) {
    console.error("Multiple Upload Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal issue",
    });
  }
};
```

---

## 🧪 Testing via Thunder Client

### 1. Single File Upload

- **URL:** `http://localhost:5000/api/files/upload`
- **Method:** `POST`
- **Body:** Form Data -> Key: `file` (Type: File)

### 2. Multiple Files Upload

- **URL:** `http://localhost:5000/api/files/upload-multiple`
- **Method:** `POST`
- **Body:** Form Data -> Key: `files` (Type: File, add multiple entries or select multiple files)
