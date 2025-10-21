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

  // 🔹 Sistemski bloki, ki jih ignoriramo pri razvrščanju
  const sistemskiBloki = ["input", "output", "split", "join", "inputA", "inputB", "outputA", "outputB"];

  // 🔹 Zberi vse veljavne bloke (učinke)
  const vsiBloki = Object.entries(dsp)
    .filter(([ime, blok]) =>
      typeof blok === "object" &&
      blok !== null &&
      !sistemskiBloki.includes(ime.toLowerCase())
    )
    .map(([ime, blok]) => {
      const model = (blok["@model"] || "").replace(/_STATIC_/gi, "");
      return {
        key: ime,
        model: trimModelName(model),
        blok: { ...blok, "@model": trimModelName(model) },
      };
    });

  // 🔹 Sortiraj glede na @position, če obstaja
  vsiBloki.sort((a, b) => {
    const posA = a.blok["@position"] ?? 0;
    const posB = b.blok["@position"] ?? 0;
    return posA - posB;
  });

  // 🔹 Razporedi med dsp0 in dsp1 glede na indeks
  vsiBloki.forEach(({ blok }, index) => {
    const model = blok["@model"] || "";

    // Stereo/Mono logika
    if (isReverb(model)) {
      const stereoReverbs = [
        "DynamicHall", "DynamicPlate", "DynamicRoom", "DynamicAmbiance",
        "Shimmer", "HotSprings", "Glitz", "Ganymede", "SearchLights",
        "Plateaux", "DoubleTank"
      ];
      const isStereo = stereoReverbs.some(r => model.toLowerCase().includes(r.toLowerCase()));
      blok["@stereo"] = isStereo;
    } else {
      const stereoValue = setMonoStereo(model);
      blok["@stereo"] = stereoValue !== null ? stereoValue : false;
    }

    // 🔹 Nastavi path in position
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

  // 🔹 Vedno dodaj konec (input/split/join/output)
  appendDsp0(dsp0);
  appendDsp1(dsp1);

  toast.success("Konverzija uspešna!");
  return { dsp0, dsp1 };
}


