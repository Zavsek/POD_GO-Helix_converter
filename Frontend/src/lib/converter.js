import isReverb from "./helpers/isReverb";
import setMonoStereo from "./helpers/setMonoStereo";
import trimModelName from "./helpers/trimModelName";
import { appendDsp0, appendDsp1 } from "./helpers/appendEnd";
import toast from "react-hot-toast";

export function convertToHlxLogic(podGo) {
  const presetName = podGo.data?.meta?.name || "Untitled";

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

  const { dsp0, dsp1 } = convertDsp(podGo.data.tone.dsp0);
  podGo.data.tone.dsp0 = dsp0;
  podGo.data.tone.dsp1 = dsp1;

  return podGo;
}

function convertDsp(dsp) {
  const dsp0 = {};
  const dsp1 = {};

  for (const [key, block] of Object.entries(dsp)) {
    if (typeof block !== "object" || block === null) {
      dsp0[key] = block;
      continue;
    }

    const newBlock = { ...block };
    let model = newBlock["@model"] || "";

    // 🔹 odstrani "_STATIC_" iz imena modela
    model = model.replace(/_STATIC_/gi, "");

    // 🔹 počisti model (odstrani Mono/Stereo na koncu)
    newBlock["@model"] = trimModelName(model);

    // 🔹 obdelaj reverb
    if (isReverb(model)) {
      const stereoReverbs = [
        "DynamicHall", "DynamicPlate", "DynamicRoom", "DynamicAmbiance",
        "Shimmer", "HotSprings", "Glitz", "Ganymede", "SearchLights",
        "Plateaux", "DoubleTank"
      ];
      const isStereo = stereoReverbs.some(r => model.toLowerCase().includes(r.toLowerCase()));
      newBlock["@stereo"] = isStereo; // vedno nastavi true/false
    } else {
      const stereoValue = setMonoStereo(model);
      newBlock["@stereo"] = stereoValue !== null ? stereoValue : false;
    }

    newBlock["@path"] = 0;

    const blockNumber = parseInt(key.replace("block", ""));
    if (!isNaN(blockNumber)) {
      if (blockNumber <= 7) {
        newBlock["@position"] = blockNumber;
        dsp0[key] = newBlock;
      } else {
        // 🔹 premik v dsp1 in preimenovanje block8 → block0, block9 → block1
        const newKey = `block${blockNumber - 8}`;
        newBlock["@position"] = blockNumber - 8;
        dsp1[newKey] = newBlock;
      }
    } else {
      dsp0[key] = newBlock;
    }
  }

  appendDsp0(dsp0);
  appendDsp1(dsp1);
  toast.success("Success!")
  return { dsp0, dsp1 };
}
