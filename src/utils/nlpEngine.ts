import { CampusLocation } from '../types/campus';
import { INITIAL_LOCATIONS } from '../data/campusData';
import { calculateRoute } from './dijkstra';

export interface NLPParsedResponse {
  matchedLocation: CampusLocation | null;
  intent: 'FIND' | 'NAVIGATE' | 'HOURS' | 'ACCESSIBILITY' | 'NEAREST' | 'UNKNOWN';
  confidence: number;
  answerText: string;
  distanceMeters?: number;
  walkingTimeMinutes?: number;
  routeSuggested?: boolean;
}

export function parseCampusQuery(
  query: string,
  userLocationNodeId: string = 'node_main_gate',
  locations: CampusLocation[] = INITIAL_LOCATIONS
): NLPParsedResponse {
  const normalized = query.trim().toLowerCase();
  const isHindi = /[\u0900-\u097F]/.test(query) || 
    normalized.includes('kahan') || 
    normalized.includes('kaise') || 
    normalized.includes('kidhar') ||
    normalized.includes('batao');

  // Intent classification
  let intent: NLPParsedResponse['intent'] = 'FIND';
  if (normalized.includes('nearest') || normalized.includes('closest') || normalized.includes('निकटतम') || normalized.includes('पास')) {
    intent = 'NEAREST';
  } else if (normalized.includes('how to go') || normalized.includes('navigate') || normalized.includes('route') || normalized.includes('directions') || normalized.includes('रास्ता') || normalized.includes('मार्ग') || normalized.includes('दिशा')) {
    intent = 'NAVIGATE';
  } else if (normalized.includes('time') || normalized.includes('hours') || normalized.includes('open') || normalized.includes('close') || normalized.includes('समय') || normalized.includes('खुलने')) {
    intent = 'HOURS';
  } else if (normalized.includes('wheelchair') || normalized.includes('ramp') || normalized.includes('elevator') || normalized.includes('accessible') || normalized.includes('दिव्यांग') || normalized.includes('लिफ्ट')) {
    intent = 'ACCESSIBILITY';
  }

  // Location scoring
  let bestMatch: CampusLocation | null = null;
  let bestScore = 0;

  for (const loc of locations) {
    let score = 0;
    const locName = loc.name.toLowerCase();
    const locBuilding = loc.building.toLowerCase();
    const locCategory = loc.category.toLowerCase();

    // Exact matches
    if (normalized.includes(locName)) {
      score += 100;
    }

    // Specific famous test queries (English & Hindi)
    if (loc.id === 'loc_mca_class' && (
      normalized.includes('mca') || 
      normalized.includes('mca classroom') || 
      normalized.includes('mca class') ||
      normalized.includes('एमसीए') ||
      normalized.includes('कक्षा २०२')
    )) {
      score += 120;
    }
    if (loc.id === 'loc_comp_lab_2' && (
      normalized.includes('lab 2') || 
      normalized.includes('computer lab 2') || 
      normalized.includes('lab-2') || 
      normalized.includes('a210') ||
      normalized.includes('कंप्यूटर लैब २') ||
      normalized.includes('लैब २')
    )) {
      score += 120;
    }
    if (loc.id === 'loc_comp_lab_1' && (
      normalized.includes('lab 1') || 
      normalized.includes('computer lab 1') || 
      normalized.includes('lab-1') || 
      normalized.includes('a108') ||
      normalized.includes('कंप्यूटर लैब १') ||
      normalized.includes('लैब १')
    )) {
      score += 115;
    }
    if (loc.id === 'loc_central_library' && (
      normalized.includes('library') || 
      normalized.includes('books') || 
      normalized.includes('reading room') ||
      normalized.includes('पुस्तकालय') ||
      normalized.includes('लाइब्रेरी')
    )) {
      score += 90;
    }
    if (loc.id === 'loc_canteen' && (
      normalized.includes('canteen') || 
      normalized.includes('food') || 
      normalized.includes('lunch') || 
      normalized.includes('eat') || 
      normalized.includes('cafeteria') || 
      normalized.includes('coffee') ||
      normalized.includes('कैंटीन') ||
      normalized.includes('खाना') ||
      normalized.includes('चाय')
    )) {
      score += 90;
    }
    if (loc.id === 'loc_medical_center' && (
      normalized.includes('medical') || 
      normalized.includes('doctor') || 
      normalized.includes('hospital') || 
      normalized.includes('clinic') || 
      normalized.includes('medicine') || 
      normalized.includes('emergency') ||
      normalized.includes('चिकित्सा') ||
      normalized.includes('दवा') ||
      normalized.includes('डॉक्टर')
    )) {
      score += 95;
    }
    if (loc.id === 'loc_main_block' && (
      normalized.includes('main block') ||
      normalized.includes('block a') ||
      normalized.includes('administrative block') ||
      normalized.includes('academic block a') ||
      normalized.includes('मेन ब्लॉक') ||
      normalized.includes('मुख्य ब्लॉक')
    )) {
      score += 120;
    }
    if (loc.id === 'loc_admin_office' && (
      normalized.includes('admin') || 
      normalized.includes('registrar') || 
      normalized.includes('admission') || 
      normalized.includes('fees') || 
      normalized.includes('office') ||
      normalized.includes('administration') ||
      normalized.includes('प्रशासनिक') ||
      normalized.includes('कार्यालय')
    )) {
      score += 90;
    }
    if (loc.id === 'loc_auditorium' && (
      normalized.includes('auditorium') || 
      normalized.includes('seminar') || 
      normalized.includes('event hall') ||
      normalized.includes('सभागार') ||
      normalized.includes('ऑडिटोरियम')
    )) {
      score += 90;
    }
    if (loc.id === 'loc_parking' && (
      normalized.includes('parking') || 
      normalized.includes('park') || 
      normalized.includes('car') || 
      normalized.includes('bike') ||
      normalized.includes('पार्किंग') ||
      normalized.includes('गाड़ी')
    )) {
      score += 90;
    }
    if (loc.id === 'loc_sports_ground' && (
      normalized.includes('playground') || 
      normalized.includes('ground') || 
      normalized.includes('sports') || 
      normalized.includes('football') || 
      normalized.includes('cricket') ||
      normalized.includes('खेल मैदान') ||
      normalized.includes('मैदान')
    )) {
      score += 90;
    }
    if (loc.id === 'loc_main_gate' && (
      normalized.includes('gate') || 
      normalized.includes('entry') || 
      normalized.includes('exit') || 
      normalized.includes('security') ||
      normalized.includes('गेट') ||
      normalized.includes('मुख्य द्वार')
    )) {
      score += 85;
    }
    if (loc.id === 'loc_washroom_acad_b' && (
      normalized.includes('washroom') || 
      normalized.includes('toilet') || 
      normalized.includes('restroom') ||
      normalized.includes('शौचालय') ||
      normalized.includes('टॉयलेट')
    )) {
      score += 80;
    }

    // Keyword tokens
    const queryTokens = normalized.split(/\s+/);
    queryTokens.forEach(token => {
      if (token.length > 2) {
        if (locName.includes(token)) score += 20;
        if (locBuilding.includes(token)) score += 15;
        if (locCategory.includes(token)) score += 15;
        if (loc.tags.some(t => t.includes(token))) score += 25;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = loc;
    }
  }

  if (!bestMatch || bestScore < 20) {
    return {
      matchedLocation: null,
      intent: 'UNKNOWN',
      confidence: 0,
      answerText: isHindi 
        ? `मुझे यह विशिष्ट कमरा या क्षेत्र नहीं मिला। कृपया "एमसीए क्लासरूम", "कंप्यूटर लैब २", "सेंट्रल लाइब्रेरी", "कैंटीन", या "स्वास्थ्य केंद्र" पूछें, या कैंपस मैप पर किसी भी भवन पर क्लिक करें।`
        : `I couldn't locate that specific room or area. Try asking for "MCA Classroom", "Computer Lab 2", "Central Library", "Canteen", "Medical Center", or click any building on the campus map.`,
    };
  }

  // Calculate route distance
  const route = calculateRoute(userLocationNodeId, bestMatch.id, false, locations);
  const distanceMeters = route ? route.totalDistance : 350;
  const walkingTimeMinutes = route ? route.estimatedMinutes : 4;

  const floorText = bestMatch.floor === 0 ? 'Ground Floor' : `${bestMatch.floor}${bestMatch.floor === 1 ? 'st' : bestMatch.floor === 2 ? 'nd' : bestMatch.floor === 3 ? 'rd' : 'th'} Floor`;
  const floorTextHi = bestMatch.floor === 0 ? 'भूतल' : `${bestMatch.floor}वीं मंजिल`;
  const roomText = bestMatch.room ? ` (${bestMatch.room})` : '';

  let answerText = '';

  if (isHindi) {
    if (intent === 'HOURS') {
      answerText = `${bestMatch.name} ${bestMatch.building} में ${floorTextHi} पर स्थित है। खुलने का समय: ${bestMatch.openingHours}। यह आपके वर्तमान स्थान से ${distanceMeters} मीटर की दूरी (~${walkingTimeMinutes} मिनट की पैदल दूरी) पर है।`;
    } else if (intent === 'ACCESSIBILITY') {
      const acc = bestMatch.accessibility.wheelchair ? 'रैंप और लिफ्ट के साथ व्हीलचेयर सुलभ' : 'सीढ़ियों से पहुंच आवश्यक';
      answerText = `${bestMatch.name} ${bestMatch.building} में ${floorTextHi}${roomText} पर है। सुलभता: ${acc}। दूरी: ${distanceMeters} मीटर (~${walkingTimeMinutes} मिनट पैदल)।`;
    } else {
      answerText = `${bestMatch.name} ${bestMatch.building} में ${floorTextHi}${roomText} पर स्थित है।\n\nदूरी: ${distanceMeters} मीटर\nअनुमानित पैदल समय: ${walkingTimeMinutes} मिनट`;
    }
  } else {
    if (intent === 'HOURS') {
      answerText = `${bestMatch.name} is in ${bestMatch.building}, ${floorText}. Operating hours: ${bestMatch.openingHours}. It is ${distanceMeters}m from your current position (~${walkingTimeMinutes} min walk).`;
    } else if (intent === 'ACCESSIBILITY') {
      const acc = bestMatch.accessibility.wheelchair ? 'Wheelchair accessible with ramp & elevator access' : 'Staircase access required';
      answerText = `${bestMatch.name} is in ${bestMatch.building}, ${floorText}${roomText}. Accessibility: ${acc}. Distance: ${distanceMeters} meters (~${walkingTimeMinutes} min walk).`;
    } else {
      answerText = `The ${bestMatch.name} is located in ${bestMatch.building}, ${floorText}${roomText}.\n\nDistance: ${distanceMeters} meters\nEstimated walking time: ${walkingTimeMinutes} minutes`;
    }
  }

  return {
    matchedLocation: bestMatch,
    intent,
    confidence: Math.min(100, bestScore),
    answerText,
    distanceMeters,
    walkingTimeMinutes,
    routeSuggested: true,
  };
}
