export type LocationCategory =
  | 'Department'
  | 'Classroom'
  | 'Laboratory'
  | 'Library'
  | 'Administrative'
  | 'Canteen'
  | 'Hostel'
  | 'Parking'
  | 'Auditorium'
  | 'Playground'
  | 'Medical'
  | 'Washroom'
  | 'Gate';

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: LocationCategory;
  building: string;
  buildingId: string;
  floor: number; // 0 for Ground, 1 for 1st, 2 for 2nd, etc.
  room?: string;
  coordinates: {
    x: number; // Campus vector map X (0 to 1000)
    y: number; // Campus vector map Y (0 to 800)
    latitude?: number;
    longitude?: number;
  };
  nodeId: string; // Associated graph node for pathfinding
  description: string;
  openingHours: string;
  accessibility: {
    wheelchair: boolean;
    elevatorAvailable: boolean;
    tactilePaving?: boolean;
  };
  tags: string[];
  contactPerson?: string;
  imageUrl?: string;
}

export interface Building {
  id: string;
  name: string;
  shortName: string;
  code: string;
  totalFloors: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  geoCenter: {
    lat: number;
    lng: number;
  };
  polygon?: { lat: number; lng: number }[];
  color: string;
  category: string;
  hasElevator: boolean;
  entrances: {
    name: string;
    nodeId: string;
    coordinates: { x: number; y: number };
  }[];
}

export interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  floor: number;
  buildingId?: string;
  isStairOrElevator?: boolean;
  isAccessible?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  distance: number; // in meters
  isStairs?: boolean;
  isElevator?: boolean;
}

export type StepDirectionType = 
  | 'start'
  | 'straight'
  | 'turn-left'
  | 'turn-right'
  | 'slight-left'
  | 'slight-right'
  | 'u-turn'
  | 'stairs'
  | 'elevator'
  | 'enter-building'
  | 'destination';

export interface NavigationStep {
  stepNumber: number;
  instruction: string;
  subInstruction?: string;
  distance: number; // meters
  durationSeconds: number;
  type: StepDirectionType;
  nodeId: string;
  coordinates: { x: number; y: number };
  geoCoordinates?: { latitude: number; longitude: number };
  floor: number;
  nextPreview?: string;
}

export interface NavigationRoute {
  routeId?: string;
  sourceId: string;
  sourceName: string;
  destinationId: string;
  destinationName: string;
  totalDistance: number; // meters
  estimatedMinutes: number;
  estimatedSeconds?: number;
  pathNodes: GraphNode[];
  steps: NavigationStep[];
  isAccessible: boolean;
}

export interface UserLivePosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  heading?: number | null;
  speed?: number | null;
  canvas: { x: number; y: number };
  isSimulated?: boolean;
}

export interface LiveNavigationState {
  currentStepIndex: number;
  currentInstruction: NavigationStep;
  nextInstruction?: NavigationStep;
  distanceRemainingMeters: number;
  estimatedMinutesRemaining: number;
  hasArrived: boolean;
  isOffRoute: boolean;
  distanceOffRouteMeters: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  locationCard?: CampusLocation;
  suggestedAction?: {
    type: 'navigate' | 'view_map' | 'call';
    label: string;
    locationId: string;
  };
  routePreview?: {
    destinationName: string;
    building: string;
    floor: number;
    distance: number;
    walkingTimeMinutes: number;
  };
}

export interface UserProfile {
  name: string;
  role: 'Student' | 'Faculty' | 'Visitor' | 'Staff' | 'Admin';
  department?: string;
  savedFavorites: string[]; // location IDs
  recentSearches: string[];
}

export interface SharedLocation {
  id: string;
  shareCode: string; // e.g. "CAMP-82"
  senderName: string;
  senderRole: 'Student' | 'Faculty' | 'Visitor' | 'Staff' | 'Admin';
  title: string;
  note?: string;
  locationId?: string; // matched CampusLocation if any
  buildingName?: string;
  floor: number;
  coordinates: {
    x: number;
    y: number;
    latitude?: number;
    longitude?: number;
  };
  nodeId: string;
  createdAt: string;
  expiresAt: string; // ISO string
  durationMinutes: number; // e.g. 15, 30, 60, 240, or 0 for permanent
  isLive: boolean;
  avatarColor?: string;
}

