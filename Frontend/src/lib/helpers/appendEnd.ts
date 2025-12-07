import { DspBlock } from "../../interfaces/DspBlock"
import { DspObject } from "../../types/DspObject"

export function appendDsp0(dsp :DspObject) : void{

    delete dsp["input"]
    delete dsp["output"]
    dsp.inputA={
     "@input" : 1,
     "@model" : "HD2_AppDSPFlow1Input",
     "decay" : 0.10,
     "noiseGate" : true,
     "threshold" : -60.0
    }
    dsp.inputB = {
     "@input" : 0,
     "@model" : "HD2_AppDSPFlow2Input",
     "decay" : 0.50,
     "noiseGate" : false,
     "threshold" : -48.0
    }
    dsp.join = {
     "@enabled" : true,
     "@model" : "HD2_AppDSPFlowJoin",
     "@position" : 8,
     "A Level" : 0.0,
     "A Pan" : 0.50,
     "B Level" : 0.0,
     "B Pan" : 0.50,
     "B Polarity" : false,
     "Level" : 0.0
    }
    dsp.outputA = {
     "@model" : "HD2_AppDSPFlowOutput",
     //This one fucking line took me way to long to figure out  😑🔫
     "@output" : 2,
     "gain" : 0.0,
     "pan" : 0.50
    }
    dsp.outputB = {
     "@model" : "HD2_AppDSPFlowOutput",
     "@output" : 0,
     "gain" : 0.0,
     "pan" : 0.50
    }
    dsp.split = {
     "@enabled" : true,
     "@model" : "HD2_AppDSPFlowSplitY",
     "@position" : 0,
     "BalanceA" : 0.50,
     "BalanceB" : 0.50,
     "bypass" : false
    }
}
export function appendDsp1 (dsp1: DspObject): void {
    dsp1.inputA = {
     "@input" : 0,
     "@model" : "HD2_AppDSPFlow1Input",
     "decay" : 0.50,
     "noiseGate" : false,
     "threshold" : -48.0
    }
    dsp1.inputB = {
     "@input" : 0,
     "@model" : "HD2_AppDSPFlow2Input",
     "decay" : 0.50,
     "noiseGate" : false,
     "threshold" : -48.0
    }
    dsp1.join = {
     "@enabled" : true,
     "@model" : "HD2_AppDSPFlowJoin",
     "@position" : 8,
     "A Level" : 0.0,
     "A Pan" : 0.50,
     "B Level" : 0.0,
     "B Pan" : 0.50,
     "B Polarity" : false,
     "Level" : 0.0
    }
    dsp1.outputA = {
     "@model" : "HD2_AppDSPFlowOutput",
     "@output" : 1,
     "gain" : 0.0,
     "pan" : 0.50
    }
    dsp1.outputB = {
     "@model" : "HD2_AppDSPFlowOutput",
     "@output" : 0,
     "gain" : 0.0,
     "pan" : 0.50
    }
    dsp1.split = {
     "@enabled" : true,
     "@model" : "HD2_AppDSPFlowSplitY",
     "@position" : 0,
     "BalanceA" : 0.50,
     "BalanceB" : 0.50,
     "bypass" : false
    }
}