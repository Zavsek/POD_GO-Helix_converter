
import { PodGo } from "../interfaces/PodGoData";

export const mockPodGoFile: PodGo = {
  data: {
    device: 0,
    device_version: 0,
    meta: { name: "Test Preset" },
    tone: {
      dsp0: {
        inputA: { "@model": "AppDSPFlowInput", "@path": 0 },

        block0: { "@model": "HD2_VolPanVolStereo", "@position": 0, "@path": 0 },
        block1: { "@model": "HD2_CompressorLAStudioCompStereo", "@position": 1, "@path": 0 },
        outputA: { "@model": "AppDSPFlowOutput", "@path": 0 }
      },
      dsp1: {}
    }
  }
};