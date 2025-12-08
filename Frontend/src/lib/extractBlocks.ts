import { DspObject } from "../types/DspObject";

export const extractModels = (dsp: DspObject) =>{
    Object.entries(dsp).forEach(([key, block])=>{
        const model = block['@model'];
        if(model){
            
        }
    });
}