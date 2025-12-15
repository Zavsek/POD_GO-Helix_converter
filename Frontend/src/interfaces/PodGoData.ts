import { DspObject } from "../types/DspObject";
//basically the entire structure of the .hlx and .pgp json files
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