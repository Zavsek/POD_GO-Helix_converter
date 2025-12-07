import isReverb from "./helpers/isReverb";
import setMonoStereo from "./helpers/setMonoStereo";
import trimModelName from "./helpers/trimModelName";
import { appendDsp0, appendDsp1 } from "./helpers/appendEnd";
import { PodGo } from "../interfaces/PodGoData";
import { DspObject } from "../types/DspObject";
import { DspBlock } from "../interfaces/DspBlock";


export function convertToHlxLogic(podGo: PodGo) :  PodGo{
  const presetName = podGo.data?.meta?.name || "Untitled";

  //set of hlx metadata taken from my own installment of helix native
  podGo.data.device = 2162944;
  podGo.data.device_version = 56623104;
  podGo.data.meta = {
    application: "Helix Native",
    appversion: 56623104,
    build_sha: "",
    modifieddate: 1760906210,
    name: presetName,
  };

  if (podGo.data?.tone?.controller) {
    delete podGo.data.tone.controller;
  }

  const { dsp0 , dsp1 } = convertDsp(podGo.data.tone.dsp0);
  podGo.data.tone.dsp0 = dsp0;
  podGo.data.tone.dsp1 = dsp1;

  return podGo;
}

function convertDsp(dsp: DspObject): { dsp0: DspObject; dsp1: DspObject }  {
  const dsp0 : DspObject = {};
  const dsp1 : DspObject= {};

  const sistemskiBloki = ["input", "output", "split", "join", "inputA", "inputB", "outputA", "outputB"];

  const vsiBloki = Object.entries(dsp)
    .filter(([ime, blok]: [string, DspBlock]) =>
      typeof blok === "object" &&
      blok !== null &&
      !sistemskiBloki.includes(ime.toLowerCase())
    )
    .map(([ime, blok] : [string, DspBlock]) => {
      const model = (blok["@model"] || "").replace(/_STATIC_/gi, "");
      return {
        key: ime,
        model: trimModelName(model),
        blok: { ...blok, "@model": trimModelName(model) },
      };
    })
    // remove blocks without models
    .filter(({ model }) => model.trim() !== "");

  vsiBloki.sort((a, b) => {
    const posA = a.blok["@position"] ?? 0;
    const posB = b.blok["@position"] ?? 0;
    return posA - posB;
  });

  vsiBloki.forEach(({ blok }, index) => {
    const model = blok["@model"] || "";

    // skip FxLoop
    if (model.toLowerCase().includes("fxloop")) {
      return;
    }

    // Stereo/Mono logic
    if (isReverb(model)) {
      const stereoReverbs = [
        "DynamicHall", "DynamicPlate", "DynamicRoom", "DynamicAmbiance",
        "Shimmer", "HotSprings", "Glitz", "Ganymede", "SearchLights",
        "Plateaux", "DoubleTank"
      ];
      const isStereo = stereoReverbs.some(r => model.toLowerCase().includes(r.toLowerCase()));
      blok["@stereo"] = isStereo;
    } else {
      const stereoValue = setMonoStereo(model) ;
      blok["@stereo"] = stereoValue !== null ? stereoValue : false;
    }

    if (index < 8) {
      blok["@path"] = 0;
      blok["@position"] = index;
      dsp0[`block${index}`] = blok;
    } else {
      blok["@path"] = 0;
      blok["@position"] = index - 8;
      dsp1[`block${index - 8}`] = blok;
    }
  });

  appendDsp0(dsp0);
  appendDsp1(dsp1);
  return { dsp0, dsp1 };
}



