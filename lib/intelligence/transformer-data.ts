export type TransformerData = {
  id: string;
  area: string;
  input: number;
  consumed: number;
  techLoss: number;
  commLoss: number;
};

export const MOCK_TRANSFORMERS: TransformerData[] = [
  { id: "TR-104", area: "Bhimavaram Zone 4", input: 1200, consumed: 1080, techLoss: 40, commLoss: 80 },
  { id: "TR-106", area: "Bhimavaram Zone 4", input: 850, consumed: 800, techLoss: 25, commLoss: 25 },
  { id: "TR-102", area: "Bhimavaram Zone 4", input: 920, consumed: 880, techLoss: 28, commLoss: 12 },
  { id: "TR-105", area: "Bhimavaram Zone 4", input: 1100, consumed: 1060, techLoss: 35, commLoss: 5 },
  { id: "TR-101", area: "Bhimavaram Zone 4", input: 780, consumed: 755, techLoss: 22, commLoss: 3 },
  { id: "TR-103", area: "Bhimavaram Zone 4", input: 640, consumed: 620, techLoss: 18, commLoss: 2 },
];

