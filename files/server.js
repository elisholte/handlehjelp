const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const KASSAL_KEY = process.env.KASSAL_KEY || '';

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ── Kassalapp produktsøk ──────────────────────────────────────────────────
app.get('/api/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.status(400).json({ error: 'Mangler søkeord' });
  if (!KASSAL_KEY) return res.status(500).json({ error: 'KASSAL_KEY ikke satt i Railway' });

  try {
    const url = `https://kassal.app/api/v1/products?search=${encodeURIComponent(q)}&size=30&unique=false`;
    const r = await fetch(url, {
      headers: { Authorization: 'Bearer ' + KASSAL_KEY, Accept: 'application/json' }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── eTilbudsavis tilbud ───────────────────────────────────────────────────
app.get('/api/offers', async (req, res) => {
  const q = req.query.q || '';
  const lat = req.query.lat || '63.4305';
  const lng = req.query.lng || '10.3951';
  const rad = req.query.rad || '30000';

  try {
    const url = `https://squid-api.tjek.com/v2/offers/search?r_lat=${lat}&r_lng=${lng}&r_radius=${rad}&r_locale=nb_NO&query=${encodeURIComponent(q)}&offset=0&limit=80`;
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Status ────────────────────────────────────────────────────────────────
app.get('/api/status', async (req, res) => {
  const kassalOk = KASSAL_KEY.length > 0;
  let etaOk = false;
  try {
    const r = await fetch('https://squid-api.tjek.com/v2/offers/search?r_lat=63.43&r_lng=10.39&r_radius=10000&r_locale=nb_NO&query=melk&limit=1');
    etaOk = r.ok;
  } catch {}
  res.json({ kassal: kassalOk, eta: etaOk });
});

// Alle andre ruter → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Handlehjelpen kjører på port ${PORT}`);
});
