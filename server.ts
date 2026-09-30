import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import navigationRoutes from './backend/routes/navigationRoutes';
import { INITIAL_LOCATIONS, CAMPUS_BUILDINGS } from './src/data/campusData';
import { CampusLocation, SharedLocation } from './src/types/campus';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory data store for locations initialized with mock campus database
let locationsStore: CampusLocation[] = [...INITIAL_LOCATIONS];
let navigationStats = {
  totalBuildings: 24,
  totalLocations: locationsStore.length,
  totalUsers: 1248,
  navigationRequests: 4532,
  activeVisitorsToday: 89,
};

// In-memory data store for active live location shares
let sharedLocationsStore: SharedLocation[] = [
  {
    id: 'share_rohan_demo',
    shareCode: 'ROH-88',
    senderName: 'Rohan Das',
    senderRole: 'Student',
    title: "Rohan's Live Meetup Point",
    note: 'Waiting at the Canteen lawn with study notes before Lab session. Grab a tea!',
    locationId: 'loc_canteen',
    buildingName: 'Student Amenity Center & Cafeteria',
    floor: 0,
    coordinates: { x: 740, y: 560, latitude: 20.2520, longitude: 85.7955 },
    nodeId: 'node_canteen',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    durationMinutes: 120,
    isLive: true,
    avatarColor: '#10b981',
  },
  {
    id: 'share_faculty_demo',
    shareCode: 'FAC-12',
    senderName: 'Prof. A. Mohapatra',
    senderRole: 'Faculty',
    title: 'Faculty Consultation Hours',
    note: 'In Staff Room 204. Open for project evaluations & dissertation queries.',
    locationId: 'loc_faculty_cabins',
    buildingName: 'Administrative Block A',
    floor: 2,
    coordinates: { x: 310, y: 340, latitude: 20.2514, longitude: 85.7942 },
    nodeId: 'node_admin_entry',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    durationMinutes: 90,
    isLive: true,
    avatarColor: '#8b5cf6',
  },
  {
    id: 'share_security_demo',
    shareCode: 'SEC-01',
    senderName: 'Campus Security Helpdesk',
    senderRole: 'Staff',
    title: 'Main Entrance Helpdesk',
    note: 'Visitor badge collection, vehicle passes, lost & found assistance.',
    locationId: 'loc_main_gate',
    buildingName: 'Main Gate & Security Post',
    floor: 0,
    coordinates: { x: 490, y: 730, latitude: 20.2505, longitude: 85.7949 },
    nodeId: 'node_main_gate',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    durationMinutes: 480,
    isLive: true,
    avatarColor: '#f59e0b',
  },
];

// Initialize Gemini client if GEMINI_API_KEY is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI();
}

// ---------------- API ROUTES ----------------

// Dedicated Real-Time Campus Walking Navigation API Router
app.use('/api/navigation', navigationRoutes);

// Get all locations with optional search/filter
app.get('/api/locations', (req, res) => {
  const { category, building, search } = req.query;
  let results = [...locationsStore];

  if (category && category !== 'All') {
    results = results.filter(l => l.category.toLowerCase() === String(category).toLowerCase());
  }

  if (building && building !== 'All') {
    results = results.filter(l => l.buildingId === building);
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.building.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.tags.some(t => t.includes(q))
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

// Get a single location by ID
app.get('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const match = locationsStore.find(l => l.id === id);
  if (!match) {
    res.status(404).json({ success: false, error: 'Campus location not found' });
    return;
  }
  res.json({ success: true, data: match });
});

// Get all buildings
app.get('/api/buildings', (_req, res) => {
  res.json({ success: true, data: CAMPUS_BUILDINGS });
});

// Admin: Add location
app.post('/api/locations', (req, res) => {
  const newLoc: CampusLocation = {
    ...req.body,
    id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  };

  if (!newLoc.name || !newLoc.building) {
    res.status(400).json({ success: false, error: 'Name and building are required' });
    return;
  }

  locationsStore.unshift(newLoc);
  navigationStats.totalLocations = locationsStore.length;
  res.status(201).json({ success: true, data: newLoc });
});

// Admin: Edit location
app.put('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const index = locationsStore.findIndex(l => l.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Location not found' });
    return;
  }

  locationsStore[index] = { ...locationsStore[index], ...req.body, id };
  res.json({ success: true, data: locationsStore[index] });
});

// Admin: Delete location
app.delete('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = locationsStore.length;
  locationsStore = locationsStore.filter(l => l.id !== id);

  if (locationsStore.length === initialLen) {
    res.status(404).json({ success: false, error: 'Location not found' });
    return;
  }

  navigationStats.totalLocations = locationsStore.length;
  res.json({ success: true, message: 'Location deleted successfully' });
});

// ---------------- LOCATION SHARING API ROUTES ----------------

// Get all active shares
app.get('/api/shares', (_req, res) => {
  const now = new Date().toISOString();
  // Filter out expired shares
  const activeShares = sharedLocationsStore.filter(s => !s.expiresAt || s.expiresAt > now);
  res.json({ success: true, count: activeShares.length, data: activeShares });
});

// Get a single share by ID or short shareCode
app.get('/api/shares/:identifier', (req, res) => {
  const { identifier } = req.params;
  const match = sharedLocationsStore.find(
    s => s.id === identifier || s.shareCode.toLowerCase() === identifier.toLowerCase()
  );

  if (!match) {
    res.status(404).json({ success: false, error: 'Shared location not found or link has expired' });
    return;
  }

  res.json({ success: true, data: match });
});

// Create a new location share
app.post('/api/shares', (req, res) => {
  const {
    senderName = 'Anonymous Student',
    senderRole = 'Student',
    title = 'Campus Meetup Point',
    note = '',
    locationId,
    buildingName = 'Campus Grounds',
    floor = 0,
    coordinates = { x: 490, y: 730 },
    nodeId = 'node_main_gate',
    durationMinutes = 60,
    isLive = true,
    avatarColor = '#1a73e8',
  } = req.body;

  const now = new Date();
  const expiresAt = durationMinutes > 0
    ? new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString()
    : new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  // Generate memorable 6-char share code e.g. CAMP-42
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const shareCode = `NIIS-${randomChars}`;

  const newShare: SharedLocation = {
    id: `share_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    shareCode,
    senderName,
    senderRole,
    title,
    note,
    locationId,
    buildingName,
    floor: Number(floor) || 0,
    coordinates: {
      x: Number(coordinates.x) || 490,
      y: Number(coordinates.y) || 730,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
    nodeId,
    createdAt: now.toISOString(),
    expiresAt,
    durationMinutes,
    isLive: Boolean(isLive),
    avatarColor,
  };

  sharedLocationsStore.unshift(newShare);
  res.status(201).json({ success: true, data: newShare });
});

// Update an existing share (e.g. live GPS move or update note)
app.put('/api/shares/:id', (req, res) => {
  const { id } = req.params;
  const index = sharedLocationsStore.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Share session not found' });
    return;
  }

  const existing = sharedLocationsStore[index];
  sharedLocationsStore[index] = {
    ...existing,
    ...req.body,
    id: existing.id,
    shareCode: existing.shareCode,
  };

  res.json({ success: true, data: sharedLocationsStore[index] });
});

// Delete/Stop a share
app.delete('/api/shares/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = sharedLocationsStore.length;
  sharedLocationsStore = sharedLocationsStore.filter(s => s.id !== id && s.shareCode !== id);

  if (sharedLocationsStore.length === initialLength) {
    res.status(404).json({ success: false, error: 'Share session not found' });
    return;
  }

  res.json({ success: true, message: 'Location sharing session terminated' });
});

// Stats endpoint for Admin dashboard
app.get('/api/stats', (_req, res) => {
  res.json({
    success: true,
    data: {
      ...navigationStats,
      totalLocations: locationsStore.length,
    },
  });
});

// AI Assistant Chat endpoint powered by Gemini
app.post('/api/chat', async (req, res) => {
  const { query, userLocation = 'node_main_gate' } = req.body;

  if (!query) {
    res.status(400).json({ success: false, error: 'Query is required' });
    return;
  }

  navigationStats.navigationRequests += 1;

  // Build ground truth context for Gemini
  const locationsContext = locationsStore.map(l => ({
    id: l.id,
    name: l.name,
    code: l.code,
    category: l.category,
    building: l.building,
    floor: l.floor === 0 ? 'Ground' : `${l.floor}th Floor`,
    room: l.room || 'N/A',
    description: l.description,
    openingHours: l.openingHours,
    accessibility: l.accessibility.wheelchair ? 'Wheelchair accessible' : 'Stairs only',
  }));

  if (ai) {
    try {
      const systemInstruction = `You are CampusNav AI, the smart, helpful voice of NIIS Group of Institutions Campus Navigation System.
Your job is to guide students, teachers, visitors, and staff to find places on campus accurately and quickly.
Here is the official campus location database:
${JSON.stringify(locationsContext, null, 2)}

When a user asks "Where is [place]?" or asks for directions, provide a polite, concise, Google-style navigational answer:
1. State the exact building, floor, and room number.
2. Provide estimated walking distance (usually between 100m to 550m from Main Gate) and walking time in minutes (walking speed ~80m per min).
3. If they asked about facilities, hours, or accessibility, mention those details.
4. At the very end of your response, output a single JSON object line in the format:
<<<JSON{"destinationId": "matching_location_id_or_empty", "intent": "FIND"|"NAVIGATE"|"HOURS"|"ACCESSIBILITY"}>>>
If you cannot find the requested location, suggest the closest match or guide them to ask the security desk at Main Gate.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const rawText = response.text || '';
      let cleanText = rawText;
      let metadata: any = null;

      // Extract <<<JSON{...}>>>
      const jsonMatch = rawText.match(/<<<JSON(.*?)>>>/s);
      if (jsonMatch) {
        cleanText = rawText.replace(/<<<JSON(.*?)>>>/s, '').trim();
        try {
          metadata = JSON.parse(jsonMatch[1]);
        } catch {
          // ignore parse error
        }
      }

      // Match destination location object if available
      let matchedLocation: CampusLocation | null = null;
      if (metadata?.destinationId) {
        matchedLocation = locationsStore.find(l => l.id === metadata.destinationId) || null;
      }

      res.json({
        success: true,
        answer: cleanText,
        matchedLocation,
        metadata,
      });
      return;
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local NLP engine:', err?.message);
    }
  }

  // Fallback response handled gracefully
  res.json({
    success: true,
    fallback: true,
    message: 'Local processing mode',
  });
});

// ---------------- VITE MIDDLEWARE SETUP ----------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusNav AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
