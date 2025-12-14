import { DspBlock } from "./DspBlock";

interface ModelItem {
  id: string;
  block: DspBlock;
  dsp: "dsp0" | "dsp1";
}

export default ModelItem;