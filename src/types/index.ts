export type EnergyLevel = 'low' | 'medium' | 'hyperfocus';

export type RoomCategory = 'kitchen' | 'bedroom' | 'desk' | 'bathroom' | 'living_room';

export interface Wave {
  id: string;
  name: string;
  purpose: string;
}

export interface DecompositionStep {
  id: string;
  waveId: string;
  title: string;
  instruction: string;
  targetZone: string;
  estimatedMinutes: number;
  physicalAnchor: string;
  dopamineAnchor: string;
  microReward: string;
  substeps: string[];
  isCompleted?: boolean;
}

export interface DecompositionResult {
  roomType: string;
  clutterSummary: string;
  overwhelmScore: number;
  totalEstimatedMinutes: number;
  encouragement: string;
  waves: Wave[];
  steps: DecompositionStep[];
}

export interface SampleRoom {
  id: string;
  title: string;
  roomType: RoomCategory;
  description: string;
  thumbnailSvg: string;
  imageDataUri: string;
}
