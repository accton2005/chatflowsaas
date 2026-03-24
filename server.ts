import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import OpenAI from "openai";
import Stripe from "stripe";
// @ts-ignore
import pdf from "pdf-parse";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
// In AI Studio, we can use the config file or env vars
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Or use service account if needed
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();
const auth = admin.auth();

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // RAG: PDF Extraction
  app.post("/api/rag/pdf", async (req, res) => {
    try {
      const { base64Data, chatbotId, ownerId } = req.body;
      if (!base64Data) return res.status(400).json({ error: "No PDF data provided" });

      const buffer = Buffer.from(base64Data, 'base64');
      const data = await pdf(buffer);
      
      const sourceId = uuidv4();
      const sourceData = {
        id: sourceId,
        chatbotId,
        ownerId,
        type: "pdf",
        content: data.text,
        createdAt: new Date().toISOString()
      };

      await db.collection("chatbots").doc(chatbotId).collection("knowledge").doc(sourceId).set(sourceData);

      res.json({ success: true, sourceId });
    } catch (error: any) {
      console.error("PDF extraction error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // RAG: URL Scraping
  app.post("/api/rag/url", async (req, res) => {
    try {
      const { url, chatbotId, ownerId } = req.body;
      if (!url) return res.status(400).json({ error: "No URL provided" });

      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Basic scraping: get text from body, remove scripts/styles
      $('script, style').remove();
      const text = $('body').text().replace(/\s+/g, ' ').trim();

      const sourceId = uuidv4();
      const sourceData = {
        id: sourceId,
        chatbotId,
        ownerId,
        type: "url",
        content: text,
        metadata: { url },
        createdAt: new Date().toISOString()
      };

      await db.collection("chatbots").doc(chatbotId).collection("knowledge").doc(sourceId).set(sourceData);

      res.json({ success: true, sourceId });
    } catch (error: any) {
      console.error("URL scraping error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe: Create Checkout Session
  app.post("/api/billing/create-checkout", async (req, res) => {
    if (!stripe) return res.status(500).json({ error: "Stripe not configured" });

    try {
      const { priceId, customerEmail, userId } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/pricing`,
        customer_email: customerEmail,
        metadata: { userId }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // OpenAI Proxy (for fallback and fallback logic)
  app.post("/api/ai/openai", async (req, res) => {
    if (!openai) return res.status(500).json({ error: "OpenAI not configured" });

    try {
      const { messages, model = "gpt-4o" } = req.body;
      const completion = await openai.chat.completions.create({
        model,
        messages,
      });

      res.json(completion.choices[0].message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- VITE MIDDLEWARE ---

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
