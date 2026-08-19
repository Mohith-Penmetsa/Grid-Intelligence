export interface ConsumerData {
  id: string;
  meterId: string;
  area: string;
  transformerId: string;
  expectedConsumption: number;
  actualConsumption: number;
  historicalConsumption: number[]; // e.g. last 6 months
}

export const MOCK_CONSUMERS: ConsumerData[] = [
  { id: "C-9021", meterId: "MTR-A451", area: "Bhimavaram Zone 4", transformerId: "TR-104", expectedConsumption: 450, actualConsumption: 210, historicalConsumption: [420, 440, 460, 450, 220, 210] },
  { id: "C-9044", meterId: "MTR-B882", area: "Bhimavaram Zone 4", transformerId: "TR-104", expectedConsumption: 320, actualConsumption: 180, historicalConsumption: [310, 315, 330, 320, 200, 180] },
  { id: "C-9011", meterId: "MTR-C119", area: "Bhimavaram Zone 4", transformerId: "TR-106", expectedConsumption: 280, actualConsumption: 150, historicalConsumption: [270, 280, 290, 280, 160, 150] },
  { id: "C-9088", meterId: "MTR-D743", area: "Bhimavaram Zone 4", transformerId: "TR-102", expectedConsumption: 510, actualConsumption: 490, historicalConsumption: [500, 520, 510, 490, 500, 490] },
  { id: "C-9099", meterId: "MTR-E902", area: "Bhimavaram Zone 4", transformerId: "TR-105", expectedConsumption: 180, actualConsumption: 175, historicalConsumption: [170, 180, 175, 180, 170, 175] },
  { id: "C-9005", meterId: "MTR-F331", area: "Bhimavaram Zone 4", transformerId: "TR-101", expectedConsumption: 620, actualConsumption: 610, historicalConsumption: [600, 610, 630, 620, 615, 610] },
  { id: "C-9025", meterId: "MTR-G212", area: "Bhimavaram Zone 4", transformerId: "TR-104", expectedConsumption: 200, actualConsumption: 195, historicalConsumption: [190, 205, 200, 195, 190, 195] },
];

