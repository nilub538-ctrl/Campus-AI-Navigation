export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}

export interface CanvasCoordinates {
  x: number;
  y: number;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: 'Classroom' | 'Laboratory' | 'Library' | 'Administrative' | 'Canteen' | 'Hostel' | 'Sports' | 'Parking' | 'Washroom' | 'Auditorium' | 'Medical' | 'Security';
  building: string;
  buildingId: string;
  floor: number;
  room?: string;
  coordinates: {
    x: number;
    y: number;
    latitude: number;
    longitude: number;
  };
  nodeId: string;
  description: string;
  openingHours: string;
  accessibility: {
    wheelchair: boolean;
    elevatorAvailable?: boolean;
    tactilePaving?: boolean;
  };
  tags: string[];
  contactPerson?: string;
  phone?: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  shortName: string;
  code: string;
  totalFloors: number;
  coordinates: { x: number; y: number; width: number; height: number };
  geoCenter: { lat: number; lng: number };
  polygon: { lat: number; lng: number }[];
  color: string;
  category: string;
  hasElevator: boolean;
  entrances: { name: string; nodeId: string; coordinates: CanvasCoordinates }[];
}

export interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  floor: number;
  buildingId?: string;
  isStairOrElevator?: boolean;
  isAccessible?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  distance: number; // in meters
  walkingAllowed?: boolean;
  isStairs?: boolean;
  isElevator?: boolean;
  direction?: string;
}

export type StepDirectionType = 
  | 'start'
  | 'straight'
  | 'turn-right'
  | 'turn-left'
  | 'slight-right'
  | 'slight-left'
  | 'u-turn'
  | 'stairs'
  | 'elevator'
  | 'enter-building'
  | 'destination';

export interface TurnByTurnInstruction {
  stepNumber: number;
  type: StepDirectionType;
  instruction: string;
  subInstruction?: string;
  distance: number; // in meters
  durationSeconds: number;
  nodeId: string;
  coordinates: CanvasCoordinates;
  geoCoordinates: { latitude: number; longitude: number };
  floor: number;
  nextPreview?: string;
}

export interface WalkableRouteResponse {
  routeId: string;
  source: {
    nodeId: string;
    name: string;
    coordinates: CanvasCoordinates;
    geoCoordinates: { latitude: number; longitude: number };
  };
  destination: {
    id: string;
    nodeId: string;
    name: string;
    building: string;
    floor: number;
    room?: string;
    coordinates: CanvasCoordinates;
    geoCoordinates: { latitude: number; longitude: number };
  };
  totalDistance: number; // in meters
  estimatedMinutes: number; // in minutes
  estimatedSeconds: number;
  pathNodes: GraphNode[];
  instructions: TurnByTurnInstruction[];
  isAccessible: boolean;
  calculatedAt: string;
}

export interface RouteNavigationState {
  currentStepIndex: number;
  currentInstruction: TurnByTurnInstruction;
  nextInstruction?: TurnByTurnInstruction;
  distanceRemainingMeters: number;
  estimatedMinutesRemaining: number;
  hasArrived: boolean;
  isOffRoute: boolean;
  distanceOffRouteMeters: number;
  closestNodeId: string;
  userCoordinates: CanvasCoordinates;
}
