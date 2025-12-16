import { DspBlock } from "../../interfaces/DspBlock";
import isDelay from "./isDelay";
import isReverb from "./isReverb";

export default function checkForWierdExceptions(model:string, blok:DspBlock, ):[DspBlock, boolean]{
    const[legacyDelay, delayRetainsStereo] : [boolean, boolean] = isDelay(model );
        // Stereo/Mono logic
        if (isReverb(model)) {
          const stereoReverbs = [
            "DynamicHall", "DynamicPlate", "DynamicRoom", "DynamicAmbiance",
            "Shimmer", "HotSprings", "Glitz", "Ganymede", "SearchLights",
            "Plateaux", "DoubleTank"
          ];
          const isStereo = stereoReverbs.some(r => model.toLowerCase().includes(r.toLowerCase()));
          blok["@stereo"] = isStereo;
          return[blok,true]
        }
        else if(legacyDelay){
            return[blok, true]
        }
        //for some reason this is the way it is
        else if (model === "HD2_EQCaliQ" ){
            blok["@model"] = "HD2_CaliQ";
            blok["@stereo"] = true;
            return[blok,true]
        }
        return [blok, false];
}