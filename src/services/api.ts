import { CampusLocation, Building } from '../types/campus';
import { INITIAL_LOCATIONS, CAMPUS_BUILDINGS } from '../data/campusData';
import { parseCampusQuery } from '../utils/nlpEngine';

export interface AssistantChatResponse {
  answer: string;
  matchedLocation: CampusLocation | null;
  distanceMeters?: number;
  walkingTimeMinutes?: number;
  source: 'gemini' | 'local_nlp';
}

export async function fetchLocations(category?: string, search?: string): Promise<CampusLocation[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`/api/locations?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch {
    // offline fallback
  }

  // Fallback to local
  let result = [...INITIAL_LOCATIONS];
  if (category && category !== 'All') {
    result = result.filter(l => l.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.building.toLowerCase().includes(q) ||
      l.tags.some(t => t.includes(q))
    );
  }
  return result;
}

export async function fetchBuildings(): Promise<Building[]> {
  try {
    const res = await fetch('/api/buildings');
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.data;
    }
  } catch {
    // fallback
  }
  return CAMPUS_BUILDINGS;
}

export async function askCampusAssistant(query: string, userLocationNode: string = 'node_main_gate'): Promise<AssistantChatResponse> {
  // First attempt call to server Gemini endpoint
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, userLocation: userLocationNode }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && !data.fallback && data.answer) {
        return {
          answer: data.answer,
          matchedLocation: data.matchedLocation || null,
          source: 'gemini',
        };
      }
    }
  } catch {
    // Server endpoint not reachable, proceed to local NLP engine
  }

  // High-fidelity local NLP processing
  const localParsed = parseCampusQuery(query, userLocationNode);
  return {
    answer: localParsed.answerText,
    matchedLocation: localParsed.matchedLocation,
    distanceMeters: localParsed.distanceMeters,
    walkingTimeMinutes: localParsed.walkingTimeMinutes,
    source: 'local_nlp',
  };
}

export async function addLocation(locationData: Partial<CampusLocation>): Promise<CampusLocation | null> {
  try {
    const res = await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // fallback
  }
  return null;
}

export async function deleteLocation(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch {
    // fallback
  }
  return false;
}
