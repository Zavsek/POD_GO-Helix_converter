import { DspBlock } from "./DspBlock";


export interface BlockLayoutItem {
  id: string;
  model: string;
  dsp: "dsp0" | "dsp1";
  index: number;
  data: DspBlock;
}

export type BlockLayoutMap = BlockLayoutItem[];