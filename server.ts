import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import admin from "firebase-admin";

// Initialize Firebase Admin (uses Application Default Credentials if available)
try {
  admin.initializeApp();
  console.log("Firebase Admin initialized");
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example backend route
  app.post("/api/contact", async (req, res) => {
    const { name, phone, content } = req.body;
    console.log("New contact request:", { name, phone, content });
    
    try {
      // Save to Firestore from the backend
      await admin.firestore().collection('messages').add({
        name,
        phone,
        content,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        source: 'backend_api'
      });
      res.json({ success: true, message: "Contact request received and saved to database" });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
