import ModelItem from "../interfaces/ModelItem";
import { DspBlock } from "../interfaces/DspBlock";

 const getAllBlocksMap = (dsp0: (ModelItem | null)[],
    dsp1: (ModelItem | null)[]) => {
    const allBlocks: { 
      id: string; 
      model: string; 
      dsp: "dsp0" | "dsp1"; 
      index: number; 
      data: DspBlock 
    }[] = [];

    
    dsp0.forEach((item, index) => {
      if (item) {
        allBlocks.push({
          id: item.id,
          model: item.block["@model"] || "Unknown",
          dsp: "dsp0",
          index: index,
          data: item.block 
        });
      }
    });


    dsp1.forEach((item, index) => {
      if (item) {
        allBlocks.push({
          id: item.id,
          model: item.block["@model"] || "Unknown",
          dsp: "dsp1",
          index: index,
          data: item.block
        });
      }
    });

    return allBlocks;
  };
  export default getAllBlocksMap;