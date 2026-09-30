import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  // Navigation & Brand
  brandName: string;
  brandTagline: string;
  navHome: string;
  navMap: string;
  navAssistant: string;
  navDashboard: string;
  navDirectory: string;
  navAdmin: string;
  switchRole: string;
  active: string;
  searchPlaceholder: string;
  searchAria: string;
  judgeDemo: string;
  accessibleOn: string;
  stepFree: string;
  shareLocation: string;
  broadcasting: string;
  languageSwitch: string;

  // Categories
  catAll: string;
  catClassroom: string;
  catLaboratory: string;
  catDepartment: string;
  catLibrary: string;
  catCanteen: string;
  catAdministrative: string;
  catMedical: string;
  catHostel: string;
  catParking: string;
  catAuditorium: string;
  catPlayground: string;
  catWashroom: string;
  catGate: string;

  // Map Controls & HUD
  satellite: string;
  blueprint: string;
  standard: string;
  vector: string;
  buildingPlans: string;
  floor: string;
  groundFloor: string;
  floorShort: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  radar: string;
  dropPin: string;
  clickMapToDrop: string;
  seeDirection: string;
  walk: string;
  walking: string;
  cancelRoute: string;
  swapDirection: string;
  distanceFromGate: string;
  minWalk: string;
  meters: string;

  // Turn-by-Turn Navigation
  turnByTurnDirections: string;
  turnByTurnRoute: string;
  stepsTotal: string;
  touchOtherToReroute: string;
  stepStart: string;
  stepStraight: string;
  stepTurnLeft: string;
  stepTurnRight: string;
  stepStairs: string;
  stepElevator: string;
  stepEnterBuilding: string;
  stepDestination: string;
  arrivedAtDestination: string;
  distance: string;
  time: string;
  steps: string;
  calories: string;
  interactiveWalkingSimulator: string;
  startWalk: string;
  pause: string;
  reset: string;
  wheelchairElevatorsOnly: string;
  standardWalking: string;
  exitNavigation: string;
  directions: string;
  youHaveArrivedAt: string;
  navigationFinishedSuccess: string;

  // Location Details Modal
  aboutLocation: string;
  operatingHours: string;
  locationDetails: string;
  contact: string;
  accessibilityFeatures: string;
  wheelchairAccessible: string;
  elevatorAvailable: string;
  tactilePaving: string;
  navigateHere: string;
  sharePlace: string;
  saveToFavorites: string;
  savedInFavorites: string;
  linkCopied: string;

  // Location Sharing & Radar
  liveCampusSharing: string;
  shareCampusLocation: string;
  shareSubtitle: string;
  createShare: string;
  activeBroadcast: string;
  scanQrCode: string;
  meetupTitle: string;
  selectLocationOrRoom: string;
  useMyGps: string;
  calibratingGps: string;
  meetupNote: string;
  liveSharingDuration: string;
  duration15Min: string;
  duration1Hour: string;
  duration4Hours: string;
  durationAllDay: string;
  broadcastMyLocation: string;
  broadcastingLive: string;
  sixCharMeetupCode: string;
  copyCode: string;
  codeCopied: string;
  instantShareChannels: string;
  whatsApp: string;
  copyLink: string;
  deviceShareSheet: string;
  stopBroadcast: string;
  scanToOpenPhone: string;
  pointPhoneCamera: string;
  campusLiveRadar: string;
  activeBroadcasts: string;
  allPeople: string;
  students: string;
  faculty: string;
  staff: string;
  noBroadcastsMatch: string;
  beFirstToShare: string;
  walkHere: string;
  locateOnMap: string;
  walkTo: string;

  // Home Hero
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroSearchPlaceholder: string;
  exploreCampusMap: string;
  askAiAssistant: string;
  popularDestinations: string;
  wheelchairAccessibleRoute: string;

  // Directory
  directoryTitle: string;
  directorySubtitle: string;
  filterByBuilding: string;
  filterByCategory: string;
  filterByFloor: string;
  allBuildings: string;
  allFloors: string;
  showingPlaces: string;
  navigateBtn: string;
  mapBtn: string;

  // Dashboard & Search Dialog
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  welcomeBack: string;
  savedFavorites: string;
  recentDestinations: string;
  findClassroom: string;
  todaySchedule: string;
  quickNavigate: string;
  searchDialogPlaceholder: string;
  quickResults: string;
  noResultsFound: string;

  // AI Assistant
  aiWelcomeMessage: string;
  aiInputPlaceholder: string;
  aiSuggestedQueries: string[];
}

const enTranslations: Translations = {
  brandName: 'CampusNav',
  brandTagline: 'NIIS Group of Institutions',
  navHome: 'Home',
  navMap: 'Campus Map',
  navAssistant: 'AI Assistant',
  navDashboard: 'Dashboard',
  navDirectory: 'Directory',
  navAdmin: 'Admin',
  switchRole: 'Switch Active Role',
  active: 'Active',
  searchPlaceholder: 'Search Campus (Ctrl + K)',
  searchAria: 'Search campus',
  judgeDemo: 'Judge Demo',
  accessibleOn: 'Accessible On',
  stepFree: 'Step-free',
  shareLocation: 'Share Location',
  broadcasting: 'Broadcasting',
  languageSwitch: 'Language',

  catAll: 'All',
  catClassroom: 'Classrooms',
  catLaboratory: 'Laboratories',
  catDepartment: 'Departments',
  catLibrary: 'Library',
  catCanteen: 'Canteen & Food',
  catAdministrative: 'Administrative',
  catMedical: 'Medical Room',
  catHostel: 'Hostels',
  catParking: 'Parking Plaza',
  catAuditorium: 'Auditorium',
  catPlayground: 'Sports Ground',
  catWashroom: 'Washrooms',
  catGate: 'Gates & Entry',

  satellite: 'Satellite',
  blueprint: 'Blueprint',
  standard: 'Standard',
  vector: 'Vector',
  buildingPlans: 'Building Plans',
  floor: 'Floor',
  groundFloor: 'Ground Floor',
  floorShort: 'F',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  resetView: 'Reset Campus View',
  radar: 'Radar',
  dropPin: 'Drop Pin',
  clickMapToDrop: 'Click Map...',
  seeDirection: 'See Direction',
  walk: 'Walk',
  walking: 'Walking...',
  cancelRoute: 'Cancel Route',
  swapDirection: 'Swap Direction',
  distanceFromGate: 'Distance from Main Gate',
  minWalk: 'min walk',
  meters: 'meters',

  turnByTurnDirections: 'Turn-by-Turn Directions',
  turnByTurnRoute: 'Turn-by-Turn Route',
  stepsTotal: 'steps total',
  touchOtherToReroute: 'Touch any other marker on the map to change direction!',
  stepStart: 'Start from',
  stepStraight: 'Continue straight along the campus pathway',
  stepTurnLeft: 'Turn left toward',
  stepTurnRight: 'Turn right toward',
  stepStairs: 'Take the stairs to floor',
  stepElevator: 'Take the accessible elevator to floor',
  stepEnterBuilding: 'Enter building via',
  stepDestination: 'Arrive at',
  arrivedAtDestination: 'You have arrived at your destination!',
  distance: 'Distance',
  time: 'Time',
  steps: 'Steps',
  calories: 'Calories',
  interactiveWalkingSimulator: 'Interactive Walking Simulator',
  startWalk: 'Start Walk',
  pause: 'Pause',
  reset: 'Reset',
  wheelchairElevatorsOnly: 'Wheelchair / Elevators Only',
  standardWalking: 'Standard Walking',
  exitNavigation: 'Exit navigation',
  directions: 'Directions',
  youHaveArrivedAt: 'You have arrived at',
  navigationFinishedSuccess: 'Turn-by-turn navigation finished successfully.',

  aboutLocation: 'About Location',
  operatingHours: 'Operating Hours',
  locationDetails: 'Location Details',
  contact: 'Contact',
  accessibilityFeatures: 'Accessibility Features',
  wheelchairAccessible: 'Wheelchair Accessible',
  elevatorAvailable: 'Elevator Available',
  tactilePaving: 'Tactile Paving',
  navigateHere: 'Navigate Here',
  sharePlace: 'Share Place',
  saveToFavorites: 'Save to favorites',
  savedInFavorites: 'Saved',
  linkCopied: 'Link Copied!',

  liveCampusSharing: 'Live Campus Sharing',
  shareCampusLocation: 'Share Campus Location',
  shareSubtitle: 'Send your pinpoint, room number, or meetup spot to classmates with 1-tap navigation.',
  createShare: 'Create Share',
  activeBroadcast: 'Active Broadcast',
  scanQrCode: 'Scan QR Code',
  meetupTitle: 'Meetup Title',
  selectLocationOrRoom: 'Select Campus Location / Room',
  useMyGps: 'Use My GPS',
  calibratingGps: 'Calibrating GPS...',
  meetupNote: 'Meetup Note / Instructions',
  liveSharingDuration: 'Live Sharing Duration',
  duration15Min: '15 Min',
  duration1Hour: '1 Hour',
  duration4Hours: '4 Hours',
  durationAllDay: 'All Day',
  broadcastMyLocation: 'Broadcast My Location',
  broadcastingLive: 'Broadcasting Live',
  sixCharMeetupCode: '6-Character Meetup Code',
  copyCode: 'Copy Code',
  codeCopied: 'Copied!',
  instantShareChannels: 'Instant Share Channels',
  whatsApp: 'WhatsApp',
  copyLink: 'Copy Link',
  deviceShareSheet: 'Share via Phone / Device Share Sheet',
  stopBroadcast: 'Stop Live Location Broadcast',
  scanToOpenPhone: 'Scan to Open on Mobile Phone',
  pointPhoneCamera: 'Point any phone camera or Google Lens at this QR code to launch navigation.',
  campusLiveRadar: 'Campus Live Radar',
  activeBroadcasts: 'Active location broadcasts',
  allPeople: 'All People',
  students: 'Students',
  faculty: 'Faculty',
  staff: 'Staff',
  noBroadcastsMatch: 'No live broadcasts match your filter.',
  beFirstToShare: 'Be the first to share your location!',
  walkHere: 'Walk Here',
  locateOnMap: 'Locate on Map',
  walkTo: 'Walk to',

  heroTitle: 'Smart Campus Navigation & Dijkstra Routing for',
  heroHighlight: 'NIIS Group of Institutions',
  heroSubtitle: 'Explore architectural 3D building floor plans, find classrooms, labs, libraries, and share live campus meetup locations effortlessly.',
  heroSearchPlaceholder: 'Search classroom, computer lab, library, canteen, faculty room...',
  exploreCampusMap: 'Explore Campus Map',
  askAiAssistant: 'Ask AI Assistant',
  popularDestinations: 'Popular Campus Destinations',
  wheelchairAccessibleRoute: 'Step-free Wheelchair Accessible Routes Available',

  directoryTitle: 'Campus Directory & Location Finder',
  directorySubtitle: 'Explore all classrooms, labs, lecture halls, offices, and campus facilities.',
  filterByBuilding: 'Filter by Building',
  filterByCategory: 'Filter by Category',
  filterByFloor: 'Filter by Floor',
  allBuildings: 'All Buildings',
  allFloors: 'All Floors',
  showingPlaces: 'campus places',
  navigateBtn: 'Navigate',
  mapBtn: 'Map',

  goodMorning: 'Good Morning',
  goodAfternoon: 'Good Afternoon',
  goodEvening: 'Good Evening',
  welcomeBack: 'Welcome back to NIIS CampusNav',
  savedFavorites: 'Saved Favorites',
  recentDestinations: 'Recent Destinations',
  findClassroom: 'Find Classroom / Lab',
  todaySchedule: "Today's Schedule & Quick Routes",
  quickNavigate: 'Quick Navigate',
  searchDialogPlaceholder: 'Search campus rooms, labs, buildings, or keywords...',
  quickResults: 'Campus Results',
  noResultsFound: 'No campus locations match your query.',

  aiWelcomeMessage: 'Hello! I am CampusNav AI, your university campus guide. Ask me where any classroom, lab, library, canteen, or department is located, and I will show you the exact building, floor, and shortest route on the satellite map.',
  aiInputPlaceholder: 'Ask anything about campus locations or directions... (e.g. "Where is MCA classroom?")',
  aiSuggestedQueries: [
    'Where is the MCA classroom?',
    'Where is Computer Lab 2?',
    'How do I reach the library?',
    'Find the nearest canteen',
    'Where is the medical dispensary?',
  ],
};

const hiTranslations: Translations = {
  brandName: 'कैंपसनेव',
  brandTagline: 'एनआईआईएस ग्रुप ऑफ इंस्टीट्यूशन्स',
  navHome: 'होम',
  navMap: 'कैंपस मैप',
  navAssistant: 'एआई सहायक',
  navDashboard: 'डैशबोर्ड',
  navDirectory: 'निर्देशिका',
  navAdmin: 'व्यवस्थापक',
  switchRole: 'सक्रिय भूमिका बदलें',
  active: 'सक्रिय',
  searchPlaceholder: 'कैंपस खोजें (Ctrl + K)',
  searchAria: 'कैंपस में खोजें',
  judgeDemo: 'डेमो देखें',
  accessibleOn: 'सुलभ मार्ग चालू',
  stepFree: 'सीढ़ी-मुक्त मार्ग',
  shareLocation: 'लोकेशन शेयर करें',
  broadcasting: 'लाइव प्रसारण',
  languageSwitch: 'भाषा',

  catAll: 'सभी',
  catClassroom: 'कक्षाएं',
  catLaboratory: 'प्रयोगशालाएं',
  catDepartment: 'विभाग',
  catLibrary: 'पुस्तकालय',
  catCanteen: 'कैंटीन व कैफे',
  catAdministrative: 'प्रशासनिक',
  catMedical: 'चिकित्सा कक्ष',
  catHostel: 'छात्रावास',
  catParking: 'पार्किंग प्लाजा',
  catAuditorium: 'सभागार',
  catPlayground: 'खेल मैदान',
  catWashroom: 'शौचालय',
  catGate: 'गेट व प्रवेश',

  satellite: 'सैटेलाइट',
  blueprint: 'ब्लूप्रिंट',
  standard: 'मानक',
  vector: 'वेक्टर',
  buildingPlans: 'भवन योजना',
  floor: 'मंजिल',
  groundFloor: 'भूतल',
  floorShort: 'मं',
  zoomIn: 'बड़ा करें',
  zoomOut: 'छोटा करें',
  resetView: 'कैंपस दृश्य रीसेट करें',
  radar: 'रडार',
  dropPin: 'पिन लगाएं',
  clickMapToDrop: 'मैप पर क्लिक करें...',
  seeDirection: 'दिशा-निर्देश देखें',
  walk: 'चलें',
  walking: 'चल रहे हैं...',
  cancelRoute: 'मार्ग रद्द करें',
  swapDirection: 'दिशा बदलें',
  distanceFromGate: 'मुख्य गेट से दूरी',
  minWalk: 'मिनट की पैदल दूरी',
  meters: 'मीटर',

  turnByTurnDirections: 'कदम-दर-कदम दिशा-निर्देश',
  turnByTurnRoute: 'कदम-दर-कदम मार्ग',
  stepsTotal: 'कुल कदम',
  touchOtherToReroute: 'दिशा बदलने के लिए मानचित्र पर किसी अन्य स्थान को छुएं!',
  stepStart: 'शुरू करें:',
  stepStraight: 'कैंपस मार्ग पर सीधे आगे बढ़ें',
  stepTurnLeft: 'बाईं ओर मुड़ें:',
  stepTurnRight: 'दाईं ओर मुड़ें:',
  stepStairs: 'सीढ़ियों से इस मंजिल पर जाएं:',
  stepElevator: 'सुलभ लिफ्ट लेकर इस मंजिल पर जाएं:',
  stepEnterBuilding: 'भवन में प्रवेश करें:',
  stepDestination: 'पहुंचें:',
  arrivedAtDestination: 'आप अपने गंतव्य पर पहुंच गए हैं!',
  distance: 'दूरी',
  time: 'समय',
  steps: 'कदम',
  calories: 'कैलोरी',
  interactiveWalkingSimulator: 'इंटरैक्टिव पैदल मार्ग सिमुलेटर',
  startWalk: 'चलना शुरू करें',
  pause: 'रोकें',
  reset: 'रीसेट',
  wheelchairElevatorsOnly: 'केवल व्हीलचेयर व सुलभ लिफ्ट',
  standardWalking: 'सामान्य पैदल मार्ग',
  exitNavigation: 'नेविगेशन समाप्त करें',
  directions: 'दिशा-निर्देश',
  youHaveArrivedAt: 'आप पहुंच गए हैं:',
  navigationFinishedSuccess: 'दिशा-निर्देश सफलतापूर्वक पूरे हुए।',

  aboutLocation: 'स्थान का विवरण',
  operatingHours: 'खुलने का समय',
  locationDetails: 'स्थान की जानकारी',
  contact: 'संपर्क',
  accessibilityFeatures: 'दिव्यांग सुलभ सुविधाएं',
  wheelchairAccessible: 'व्हीलचेयर सुलभ',
  elevatorAvailable: 'लिफ्ट उपलब्ध',
  tactilePaving: 'स्पर्शनीय मार्ग',
  navigateHere: 'मार्ग खोजें',
  sharePlace: 'स्थान साझा करें',
  saveToFavorites: 'पसंदीदा में जोड़ें',
  savedInFavorites: 'पसंदीदा',
  linkCopied: 'लिंक कॉपी हो गया!',

  liveCampusSharing: 'लाइव कैंपस लोकेशन शेयरिंग',
  shareCampusLocation: 'कैंपस लोकेशन साझा करें',
  shareSubtitle: 'कक्षा के साथियों को अपनी सटीक लोकेशन या मीटिंग पॉइंट एक क्लिक नेविगेशन के साथ भेजें।',
  createShare: 'नया शेयर बनाएं',
  activeBroadcast: 'सक्रिय प्रसारण',
  scanQrCode: 'क्यूआर कोड स्कैन करें',
  meetupTitle: 'मिलने का शीर्षक',
  selectLocationOrRoom: 'स्थान या कमरा चुनें',
  useMyGps: 'मेरा जीपीएस उपयोग करें',
  calibratingGps: 'जीपीएस जांच रहा है...',
  meetupNote: 'संदेश या निर्देश',
  liveSharingDuration: 'शेयरिंग की समय सीमा',
  duration15Min: '१५ मिनट',
  duration1Hour: '१ घंटा',
  duration4Hours: '४ घंटे',
  durationAllDay: 'पूरे दिन',
  broadcastMyLocation: 'मेरी लोकेशन प्रसारित करें',
  broadcastingLive: 'लाइव प्रसारण सक्रिय है',
  sixCharMeetupCode: '६-अक्षरों का कोड',
  copyCode: 'कोड कॉपी करें',
  codeCopied: 'कॉपी हुआ!',
  instantShareChannels: 'तुरंत शेयर करें',
  whatsApp: 'व्हाट्सएप',
  copyLink: 'लिंक कॉपी करें',
  deviceShareSheet: 'मोबाइल शेयर मेनू खोलें',
  stopBroadcast: 'लाइव प्रसारण बंद करें',
  scanToOpenPhone: 'मोबाइल में खोलने के लिए स्कैन करें',
  pointPhoneCamera: 'नेविगेशन तुरंत शुरू करने के लिए फोन कैमरा या गूगल लेंस से क्यूआर कोड स्कैन करें।',
  campusLiveRadar: 'कैंपस लाइव रडार',
  activeBroadcasts: 'सक्रिय लोकेशन प्रसारण',
  allPeople: 'सभी लोग',
  students: 'छात्र',
  faculty: 'प्राध्यापक',
  staff: 'स्टाफ',
  noBroadcastsMatch: 'इस फ़िल्टर से कोई सक्रिय प्रसारण नहीं मिला।',
  beFirstToShare: 'अपनी लोकेशन शेयर करने वाले पहले व्यक्ति बनें!',
  walkHere: 'यहां चलें',
  locateOnMap: 'मैप पर देखें',
  walkTo: 'के पास चलें',

  heroTitle: 'एनआईआईएस ग्रुप ऑफ इंस्टीट्यूशन्स के लिए',
  heroHighlight: 'स्मार्ट कैंपस नेविगेशन और डाइकस्ट्रा रूटिंग',
  heroSubtitle: '3D वास्तुशिल्प फ्लोर मैप देखें, कक्षाएं, कंप्यूटर लैब, पुस्तकालय खोजें और लाइव लोकेशन साझा करें।',
  heroSearchPlaceholder: 'कक्षा, कंप्यूटर लैब, पुस्तकालय, कैंटीन या शिक्षक कक्ष खोजें...',
  exploreCampusMap: 'कैंपस मैप देखें',
  askAiAssistant: 'एआई सहायक से पूछें',
  popularDestinations: 'लोकप्रिय कैंपस स्थल',
  wheelchairAccessibleRoute: 'सीढ़ी-मुक्त व्हीलचेयर सुलभ मार्ग उपलब्ध हैं',

  directoryTitle: 'कैंपस निर्देशिका एवं स्थान खोजक',
  directorySubtitle: 'सभी कक्षाओं, कंप्यूटर प्रयोगशालाओं, व्याख्यान कक्षों, कार्यालयों और सुविधाओं को देखें।',
  filterByBuilding: 'भवन के अनुसार फ़िल्टर',
  filterByCategory: 'श्रेणी के अनुसार फ़िल्टर',
  filterByFloor: 'मंजिल के अनुसार फ़िल्टर',
  allBuildings: 'सभी भवन',
  allFloors: 'सभी मंजिलें',
  showingPlaces: 'परिसर स्थल',
  navigateBtn: 'मार्ग खोजें',
  mapBtn: 'मैप',

  goodMorning: 'शुभ प्रभात',
  goodAfternoon: 'शुभ दोपहर',
  goodEvening: 'शुभ संध्या',
  welcomeBack: 'एनआईआईएस कैंपसनेव में आपका स्वागत है',
  savedFavorites: 'सहेजे गए पसंदीदा',
  recentDestinations: 'हाल के गंतव्य',
  findClassroom: 'कक्षा / लैब खोजें',
  todaySchedule: 'आज की समय-सारणी व त्वरित मार्ग',
  quickNavigate: 'त्वरित नेविगेशन',
  searchDialogPlaceholder: 'कक्षा, लैब, भवन या सुविधा खोजें...',
  quickResults: 'कैंपस खोज परिणाम',
  noResultsFound: 'आपकी खोज से कोई परिसर स्थल मेल नहीं खाता।',

  aiWelcomeMessage: 'नमस्ते! मैं कैंपसनेव एआई हूँ, आपका विश्वविद्यालय मार्गदर्शक। मुझसे किसी भी कक्षा, कंप्यूटर लैब, पुस्तकालय, कैंटीन या विभाग का स्थान पूछें, और मैं आपको सटीक भवन, मंजिल और सबसे छोटा मार्ग दिखाऊंगा।',
  aiInputPlaceholder: 'परिसर में कोई भी स्थान या दिशा पूछें... (उदा. "एमसीए क्लासरूम कहाँ है?")',
  aiSuggestedQueries: [
    'एमसीए क्लासरूम कहाँ है?',
    'कंप्यूटर लैब २ कहाँ है?',
    'सेंट्रल लाइब्रेरी कैसे पहुँचें?',
    'निकटतम कैंटीन खोजें',
    'मेडिकल डिस्पेंसरी कहाँ है?',
  ],
};

// Hindi translations dictionary for campus locations
const LOCATION_NAMES_HI: Record<string, string> = {
  loc_comp_lab_2: 'कंप्यूटर लैब २ (एडवांस्ड कोडिंग लैब)',
  loc_mca_class: 'एमसीए प्रथम वर्ष क्लासरूम (कक्ष २०२)',
  loc_mca_class_2: 'एमसीए द्वितीय वर्ष क्लासरूम (कक्ष २०३)',
  loc_central_library: 'सेंट्रल यूनिवर्सिटी लाइब्रेरी',
  loc_ai_iot_lab: 'एआई एवं आईओटी रिसर्च लैब',
  loc_seminar_hall_1: 'एपीजे अब्दुल कलाम सेमिनार हॉल',
  loc_canteen: 'कैंपस कैफेटेरिया व छात्र केंद्र',
  loc_admin_office: 'कुलसचिव एवं प्रशासनिक कार्यालय',
  loc_placement_cell: 'प्रशिक्षण एवं प्लेसमेंट प्रकोष्ठ',
  loc_faculty_cabins: 'कंप्यूटर एप्लीकेशन संकाय कक्ष',
  loc_sports_ground: 'विश्वविद्यालय खेल मैदान एवं एथलेटिक्स ट्रैक',
  loc_main_gate: 'मुख्य कैंपस द्वार एवं सुरक्षा चौकी',
  loc_parking_plaza: 'वाहन पार्किंग प्लाजा एवं ई-चार्जिंग',
  loc_medical_room: 'कैंपस स्वास्थ्य केंद्र एवं प्राथमिक उपचार',
  loc_girls_hostel: 'सरोजिनी नायडू कन्या छात्रावास',
  loc_boys_hostel: 'स्वामी विवेकानंद छात्र छात्रावास',
  loc_auditorium: 'मुख्य विश्वविद्यालय ऑडिटोरियम',
  loc_chem_lab: 'इंजीनियरिंग रसायन विज्ञान प्रयोगशाला',
  loc_mech_workshop: 'मैकेनिकल एवं रोबोटिक्स कार्यशाला',
};

// Hindi translations for Buildings
const BUILDING_NAMES_HI: Record<string, string> = {
  acad_a: 'शैक्षणिक ब्लॉक ए (इंजीनियरिंग एवं टेक्नोलॉजी)',
  acad_b: 'शैक्षणिक ब्लॉक बी (एमसीए एवं कंप्यूटर साइंस विभाग)',
  library: 'केंद्रीय विश्वविद्यालय पुस्तकालय',
  admin: 'प्रशासनिक संकुल',
  canteen: 'छात्र केंद्र एवं कैंटीन',
  sports: 'खेल संकुल एवं मैदान',
  hostel_boys: 'विवेकानंद छात्र छात्रावास',
  hostel_girls: 'सरोजिनी कन्या छात्रावास',
  auditorium_bldg: 'मुख्य विश्वविद्यालय ऑडिटोरियम',
  gate_complex: 'मुख्य द्वार एवं सुरक्षा चौकी',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  locName: (location: { id?: string; name: string; nameHi?: string }) => string;
  locDesc: (location: { description: string; descriptionHi?: string }) => string;
  bldgName: (building: { id?: string; name: string; nameHi?: string }) => string;
  categoryLabel: (category: string) => string;
  floorLabel: (floor: number) => string;
  landmarkLabel: (id: string, defaultLabel: string) => string;
  localizeStepInstruction: (instruction: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'campusnav_app_language';

const LANDMARKS_HI: Record<string, string> = {
  node_main_gate: 'मुख्य गेट (प्रवेश द्वार)',
  node_parking_entrance: 'उत्तर-पश्चिम पार्किंग प्लाजा',
  node_hostel_b_entrance: 'छात्र छात्रावास विंग ए',
  node_hostel_g_entrance: 'कन्या छात्रावास विंग बी',
  node_canteen_entrance: 'कैंपस कैंटीन',
  node_central_plaza: 'सेंट्रल सर्कल प्लाजा',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'hi' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = language === 'hi' ? hiTranslations : enTranslations;

  const locName = (location: { id?: string; name: string; nameHi?: string }): string => {
    if (language === 'hi') {
      if (location.nameHi) return location.nameHi;
      if (location.id && LOCATION_NAMES_HI[location.id]) return LOCATION_NAMES_HI[location.id];
    }
    return location.name;
  };

  const locDesc = (location: { description: string; descriptionHi?: string }): string => {
    if (language === 'hi' && location.descriptionHi) {
      return location.descriptionHi;
    }
    return location.description;
  };

  const bldgName = (building: { id?: string; name: string; nameHi?: string }): string => {
    if (language === 'hi') {
      if (building.nameHi) return building.nameHi;
      if (building.id && BUILDING_NAMES_HI[building.id]) return BUILDING_NAMES_HI[building.id];
    }
    return building.name;
  };

  const categoryLabel = (category: string): string => {
    if (language === 'en') return category;
    switch (category.toLowerCase()) {
      case 'classroom': return t.catClassroom;
      case 'laboratory': return t.catLaboratory;
      case 'department': return t.catDepartment;
      case 'library': return t.catLibrary;
      case 'canteen': return t.catCanteen;
      case 'administrative': return t.catAdministrative;
      case 'medical': return t.catMedical;
      case 'hostel': return t.catHostel;
      case 'parking': return t.catParking;
      case 'auditorium': return t.catAuditorium;
      case 'playground': return t.catPlayground;
      case 'washroom': return t.catWashroom;
      case 'gate': return t.catGate;
      case 'all': return t.catAll;
      default: return category;
    }
  };

  const floorLabel = (floor: number): string => {
    if (floor === 0) return t.groundFloor;
    if (language === 'hi') return `${floor}वीं मंजिल`;
    if (floor === 1) return '1st Floor';
    if (floor === 2) return '2nd Floor';
    if (floor === 3) return '3rd Floor';
    return `${floor}th Floor`;
  };

  const landmarkLabel = (id: string, defaultLabel: string): string => {
    if (language === 'hi' && LANDMARKS_HI[id]) return LANDMARKS_HI[id];
    return defaultLabel;
  };

  const localizeStepInstruction = (instruction: string): string => {
    if (language !== 'hi') return instruction;
    if (instruction.startsWith('Start from ')) {
      const rest = instruction.replace('Start from ', '');
      return `${rest} से चलना शुरू करें`;
    }
    if (instruction.startsWith('Continue straight')) {
      return instruction
        .replace('Continue straight', 'सीधे आगे बढ़ें')
        .replace('along the campus pathway', 'कैंपस पैदल मार्ग पर')
        .replace('along pathway', 'पैदल मार्ग पर');
    }
    if (instruction.startsWith('Turn left toward ')) {
      const rest = instruction.replace('Turn left toward ', '');
      return `${rest} की ओर बाएं मुड़ें`;
    }
    if (instruction.startsWith('Turn right toward ')) {
      const rest = instruction.replace('Turn right toward ', '');
      return `${rest} की ओर दाएं मुड़ें`;
    }
    if (instruction.startsWith('Take the stairs to floor ')) {
      const rest = instruction.replace('Take the stairs to floor ', '');
      return `सीढ़ियों से मंजिल ${rest} पर जाएं`;
    }
    if (instruction.startsWith('Take the accessible elevator to floor ')) {
      const rest = instruction.replace('Take the accessible elevator to floor ', '');
      return `सुलभ लिफ्ट से मंजिल ${rest} पर जाएं`;
    }
    if (instruction.startsWith('Enter building via ')) {
      const rest = instruction.replace('Enter building via ', '');
      return `${rest} से भवन में प्रवेश करें`;
    }
    if (instruction.startsWith('Arrive at ')) {
      const rest = instruction.replace('Arrive at ', '');
      return `${rest} पर पहुंचें (गंतव्य स्थल)`;
    }
    return instruction;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        locName,
        locDesc,
        bldgName,
        categoryLabel,
        floorLabel,
        landmarkLabel,
        localizeStepInstruction,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
