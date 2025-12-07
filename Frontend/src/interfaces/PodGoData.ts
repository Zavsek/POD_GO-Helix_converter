import { DspObject } from "../types/DspObject";

export interface PodGoData {
  device?: number;
  device_version?: number;

  meta: {
    application?: string;
    appversion?: number;
    build_sha?: string;
    modifieddate?: number;
    name: string;
  };

  tone: {
    controller?: any;
    dsp0: DspObject;
    dsp1?: DspObject;
  };
}

export interface PodGo {
  data: PodGoData;
}