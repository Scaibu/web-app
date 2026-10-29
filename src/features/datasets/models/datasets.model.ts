/**
 * Golden Datasets & Fine-Tuning Models.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface DatasetItem {
  id: string;
  traceId: string;
  sourceSpan: string;
  inputPrompt: string;
  idealCompletion: string;
  rating: number; // 1 - 5 stars
  annotator: string;
  tags: string[];
  createdAt: string;
}

export interface GoldenDataset {
  id: string;
  name: string;
  description: string;
  targetModel: string;
  itemCount: number;
  totalTokens: number;
  exportFormat: 'jsonl' | 'alpaca' | 'sharegpt';
  lastUpdatedAt: string;
  items: DatasetItem[];
}
