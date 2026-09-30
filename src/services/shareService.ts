import QRCode from 'qrcode';
import { SharedLocation, CampusLocation } from '../types/campus';

const LOCAL_STORAGE_ACTIVE_SHARE = 'campusnav_my_active_share';

// Default Campus Bounds (NIIS Group of Institutions, Sarada Vihar, Madanpur, Bhubaneswar)
export const CAMPUS_GEO = {
  minLat: 20.2480,
  maxLat: 20.2540,
  minLng: 85.7920,
  maxLng: 85.7980,
  centerLat: 20.2515,
  centerLng: 85.7950,
};

export const DEFAULT_ACTIVE_SHARES: SharedLocation[] = [
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

/**
 * Fetch all currently active shares from the server with offline fallback
 */
export async function fetchActiveShares(): Promise<SharedLocation[]> {
  try {
    const res = await fetch('/api/shares');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Graceful offline fallback
  }
  return DEFAULT_ACTIVE_SHARES;
}

/**
 * Fetch a specific share by ID or short shareCode
 */
export async function fetchShareById(idOrCode: string): Promise<SharedLocation | null> {
  try {
    const res = await fetch(`/api/shares/${encodeURIComponent(idOrCode)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch {
    // Fallback search in default demo shares
  }
  const match = DEFAULT_ACTIVE_SHARES.find(
    s => s.id === idOrCode || s.shareCode.toLowerCase() === idOrCode.toLowerCase()
  );
  return match || null;
}

/**
 * Create a new live location share session
 */
export async function createShare(
  payload: Partial<SharedLocation>
): Promise<SharedLocation | null> {
  try {
    const res = await fetch('/api/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveLocalActiveShare(json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to create location share on server:', err);
  }

  // Client-side fallback if server fails
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const shareCode = `NIIS-${randomChars}`;
  const now = new Date();
  const duration = payload.durationMinutes ?? 60;
  const fallbackShare: SharedLocation = {
    id: `share_${Date.now()}`,
    shareCode,
    senderName: payload.senderName || 'Anonymous Student',
    senderRole: payload.senderRole || 'Student',
    title: payload.title || 'Campus Meetup Spot',
    note: payload.note || '',
    locationId: payload.locationId,
    buildingName: payload.buildingName || 'Campus Ground',
    floor: payload.floor ?? 0,
    coordinates: payload.coordinates || { x: 490, y: 730 },
    nodeId: payload.nodeId || 'node_main_gate',
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + duration * 60 * 1000).toISOString(),
    durationMinutes: duration,
    isLive: payload.isLive ?? true,
    avatarColor: payload.avatarColor || '#1a73e8',
  };

  saveLocalActiveShare(fallbackShare);
  return fallbackShare;
}

/**
 * Update an existing share session
 */
export async function updateShare(
  id: string,
  updates: Partial<SharedLocation>
): Promise<SharedLocation | null> {
  try {
    const res = await fetch(`/api/shares/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveLocalActiveShare(json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to update share on server:', err);
  }
  return null;
}

/**
 * Stop/Delete a share session
 */
export async function deleteShare(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/shares/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      clearLocalActiveShare();
      return true;
    }
  } catch (err) {
    console.warn('Failed to delete share on server:', err);
  }
  clearLocalActiveShare();
  return true;
}

/**
 * Local storage helpers for my own active share
 */
export function getLocalActiveShare(): SharedLocation | null {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_ACTIVE_SHARE);
    if (!item) return null;
    const parsed: SharedLocation = JSON.parse(item);
    if (new Date(parsed.expiresAt) < new Date()) {
      clearLocalActiveShare();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocalActiveShare(share: SharedLocation) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_SHARE, JSON.stringify(share));
  } catch {
    // Ignore storage issues
  }
}

export function clearLocalActiveShare() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_ACTIVE_SHARE);
  } catch {
    // Ignore
  }
}

/**
 * Construct full shareable URL with code
 */
export function generateShareUrl(share: SharedLocation): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('share', share.shareCode);
  return url.toString();
}

/**
 * Generate share URL for an existing static location or custom pin
 */
export function generateLocationPinUrl(location: CampusLocation, customNote?: string): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('loc', location.id);
  if (customNote) {
    url.searchParams.set('note', encodeURIComponent(customNote));
  }
  return url.toString();
}

/**
 * Generate WhatsApp share link
 */
export function generateWhatsAppLink(text: string, url: string): string {
  const message = `${text}\n\n👉 Open campus directions: ${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

/**
 * Generate QR code as SVG Data URL or SVG string
 */
export async function generateQrCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return '';
  }
}

/**
 * Attempt to get user GPS coordinates mapped to Campus Vector Canvas (X: 0..1000, Y: 0..800)
 */
export function getCampusPositionFromGeo(
  lat: number,
  lng: number
): { x: number; y: number } {
  // Linear interpolation within campus bounding box
  const normalizedX = (lng - CAMPUS_GEO.minLng) / (CAMPUS_GEO.maxLng - CAMPUS_GEO.minLng);
  // Lat increases northward, SVG Y increases southward
  const normalizedY = 1 - (lat - CAMPUS_GEO.minLat) / (CAMPUS_GEO.maxLat - CAMPUS_GEO.minLat);

  const clampedX = Math.max(80, Math.min(920, Math.round(normalizedX * 1000)));
  const clampedY = Math.max(80, Math.min(720, Math.round(normalizedY * 800)));

  return { x: clampedX, y: clampedY };
}
