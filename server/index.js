const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// multer for file uploads
const multer = require('multer');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

const Item = require('./models/Item');
const Order = require('./models/Order');
const Scan = require('./models/Scan');
const User = require("./models/User");

// connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yummport_dev';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// seed database from data.json (one-time)
app.post('/api/seed', async (req, res) => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    const data = JSON.parse(raw);
    if (Array.isArray(data.items)) {
      // upsert by id
      for (const it of data.items) {
        await Item.updateOne({ id: it.id }, { $set: it }, { upsert: true });
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// basic search endpoint: /api/search?q=spicy
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  try {
    if (!q) {
      const items = await Item.find().limit(100).lean();
      return res.json({ results: items });
    }
    // use text search if available, fallback to regex
    let results = [];
    try {
      results = await Item.find({ $text: { $search: q } }).limit(50).lean();
    } catch (e) {
      const regex = new RegExp(q.split(/\s+/).join('|'), 'i');
      results = await Item.find({ $or: [ { name: regex }, { cuisine: regex }, { tags: regex } ] }).limit(50).lean();
    }
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ results: [] });
  }
});

// get items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().limit(500).lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ items: [] });
  }
});

// place order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = {
      items: req.body.items || [],
      total: req.body.total || 0,
      meta: req.body.meta || {}
    };
    const order = await Order.create(orderData);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// mock voice intent endpoint (server-side simple rules)
app.post('/api/voice', (req, res) => {
  const text = (req.body.text || '').toString().toLowerCase();
  if (text.includes('spicy')) return res.json({ intent: 'preference', preference: 'spicy' });
  if (text.includes('sweet')) return res.json({ intent: 'preference', preference: 'sweet' });
  if (text.includes('order')) return res.json({ intent: 'order' });
  if (text.includes('pack') || text.includes('ship')) return res.json({ intent: 'shipping' });
  res.json({ intent: 'search' });
});

// Vision endpoint: accepts an image file and returns mocked analysis
app.post('/api/vision', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // In a production setup, here you'd call an AI vision service (e.g., Cloud Vision, custom model)
    // For now, return a mocked analysis using the filename and random-ish values so frontend can render results.
    const fakeResult = {
      dish: 'Paneer Butter Masala',
      calories: 420,
      protein: 12,
      fat: 10,
      carbs: 30,
      healthScore: 8.2,
      tip: 'Avoid eating after 9 PM for better digestion',
      waterSuggestion: 'Drink 2 glasses after meal',
      breakdown: [
        { name: 'Paneer', percent: 70 },
        { name: 'Rice', percent: 20 },
        { name: 'Salad', percent: 10 }
      ],
      sourceFile: req.file.filename
    };

    // persist the analysis to MongoDB (if connected)
    try {
      const scanDoc = await Scan.create({
        userId: req.body.userId || undefined,
        dish: fakeResult.dish,
        calories: fakeResult.calories,
        protein: fakeResult.protein,
        fat: fakeResult.fat,
        carbs: fakeResult.carbs,
        healthScore: fakeResult.healthScore,
        tip: fakeResult.tip,
        waterSuggestion: fakeResult.waterSuggestion,
        breakdown: fakeResult.breakdown,
        sourceFile: fakeResult.sourceFile
      });
      // optional: remove temp file after processing
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
      return res.json({ success: true, analysis: fakeResult, saved: scanDoc });
    } catch (err) {
      // if persistence fails, still return analysis
      try { fs.unlinkSync(req.file.path); } catch (e) { }
      console.error('Failed to save scan', err);
      return res.json({ success: true, analysis: fakeResult, saved: null });
    }
  } catch (err) {
    console.error('Vision error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/vision/history?userId=<id> - returns last scans (optionally for a user)
app.get('/api/vision/history', async (req, res) => {
  try {
    const userId = req.query.userId;
    const q = userId ? { userId } : {};
    const scans = await Scan.find(q).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ scans });
  } catch (err) {
    console.error('vision history error', err);
    res.status(500).json({ scans: [] });
  }
});

// STT proxy endpoint: accepts audio file and forwards to configured provider (AssemblyAI or Deepgram)
app.post('/api/stt', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const assemblyKey = process.env.ASSEMBLYAI_KEY;
    const deepgramKey = process.env.DEEPGRAM_KEY;
    // Prefer AssemblyAI if configured
    if (assemblyKey) {
      // Upload file to AssemblyAI
      const uploadUrlResp = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: { authorization: assemblyKey },
        body: fs.createReadStream(req.file.path)
      });
      const uploadJson = await uploadUrlResp.json();
      const audio_url = uploadJson.upload_url || uploadJson.url || uploadJson.data?.upload_url;
      if (!audio_url) throw new Error('Failed to upload to AssemblyAI');

      // Create transcript
      const createResp = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: { authorization: assemblyKey, 'content-type': 'application/json' },
        body: JSON.stringify({ audio_url })
      });
      const createJson = await createResp.json();
      const transcriptId = createJson.id;

      // Poll for completion (timeout ~60s)
      let attempts = 0;
      let final = null;
      while (attempts < 60) {
        attempts += 1;
        const poll = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, { headers: { authorization: assemblyKey } });
        const pollJson = await poll.json();
        if (pollJson.status === 'completed') { final = pollJson; break; }
        if (pollJson.status === 'error') { throw new Error('Transcription failed'); }
        await new Promise(r => setTimeout(r, 1000));
      }
      // cleanup
      try { fs.unlinkSync(req.file.path); } catch (e) { }
      if (!final) return res.status(500).json({ error: 'Transcription timeout' });
      return res.json({ text: final.text, raw: final });
    }

    // Deepgram fallback: direct request
    if (deepgramKey) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const dgResp = await fetch('https://api.deepgram.com/v1/listen?punctuate=true', {
        method: 'POST',
        headers: { Authorization: `Token ${deepgramKey}`, 'Content-Type': 'application/octet-stream' },
        body: fileBuffer
      });
      const dgJson = await dgResp.json();
      try { fs.unlinkSync(req.file.path); } catch (e) { }
      const text = dgJson.results?.channels?.[0]?.alternatives?.[0]?.transcript || dgJson?.metadata?.transcript || '';
      return res.json({ text, raw: dgJson });
    }

    // No provider configured
    try { fs.unlinkSync(req.file.path); } catch (e) { }
    return res.status(400).json({ error: 'No STT provider configured. Set ASSEMBLYAI_KEY or DEEPGRAM_KEY in environment.' });
  } catch (err) {
    console.error('STT proxy error', err);
    try { fs.unlinkSync(req.file.path); } catch (e) { }
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------------
// 🔥 ADDING SIGNUP + LOGIN API (No removals, only addition)
// ------------------------------------------------------


const bcrypt = require("bcryptjs");

// SIGNUP API
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      mobile
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// LOGIN API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, error: "User not found" });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.json({ success: false, error: "Wrong password" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`YummPort API listening on http://localhost:${PORT}`);
});
