import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { PodGo } from "../interfaces/PodGoData";
import { toast } from "react-hot-toast";
import { DspBlock } from "../interfaces/DspBlock";
import { BlockLayoutItem } from "../interfaces/BlockLayoutItem";
import FixedKeys from "../types/FixedKeys"


// select file with tauri fs, stores fileContent in state
export const handleSelectFile = async (
  setFilePath: React.Dispatch<React.SetStateAction<string | null>>,
  setFileContent: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const izbranaDatoteka = await open({
      multiple: false,
      filters: [{ name: "POD GO Files", extensions: ["pgp"] }],
    });

    if (!izbranaDatoteka) return;

    setFilePath(izbranaDatoteka);

    if (izbranaDatoteka.startsWith("/mock/")) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pgp";
      input.onchange = (e) => {
        const fileInput = e.target as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target!.result;
            if (typeof result === "string") {
              setFileContent(result);
              toast.success(`Selected File: ${file.name}`);
            } else {
              toast.error("File content is not a valid string");
            }
          };
          reader.readAsText(file);
        } else {
          toast.error("No file selected");
        }
      };
      input.click();
    } else {
      setFileContent(await readTextFile(izbranaDatoteka));
      toast.success(`File Selected Successfully`);
    }
  } catch (err) {
    toast.error("Error in selecting file");
    console.error(err);
  }
};
/* Parses input file and sends it to the ConvertToHlx function then stores 
the converted files in state and stores the models in state for rearanging.
*/
export const handleConvert = async (
  filePath: string | null,
  fileContent: string | null,
  convertToHlxLogic: (data: PodGo) => {convertedData:PodGo, presetName:string},
  setTransformedFile: React.Dispatch<React.SetStateAction<PodGo | null>>,
   setModels: React.Dispatch<React.SetStateAction<{id: string, block: DspBlock, dsp: 'dsp0' | 'dsp1' }[] | null>>,
   setStoredFileName: React.Dispatch<React.SetStateAction<string| null>>
) => {
  if (!filePath && !fileContent) {
    toast.error("No File Selected!");
    return;
  }

  try {
    let contentToConvert = fileContent;

    if (!contentToConvert && filePath) {
      contentToConvert = await readTextFile(filePath);
    }

    if (!contentToConvert) {
      toast.error("No Content To Convert!");
      return;
    }

    const podGoData: PodGo = JSON.parse(contentToConvert);
    const {convertedData, presetName} = convertToHlxLogic(podGoData);
    setStoredFileName(presetName);
    setTransformedFile(convertedData);

   const dsp0Blocks = convertedData.data.tone.dsp0 ?? {};
const dsp1Blocks = convertedData.data.tone.dsp1 ?? {};

const allBlocks: {id:string, block: DspBlock, dsp: 'dsp0' | 'dsp1' }[] = [
  ...Object.entries(dsp0Blocks).map(([key, block]) => ({
    id: `dsp0-${key}` ,
    block,
    dsp: 'dsp0' as const,
  })),
  ...Object.entries(dsp1Blocks).map(([key, block]) => ({
    id: `dsp1-${key}` ,
    block,
    dsp: 'dsp1' as const,
  }))
].filter(({ block }) => {
  const modelName = block["@model"] || "";
  return !modelName.startsWith("HD2_AppDSPFlow");
});


setModels(allBlocks);
toast.success("Success");
} catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(err.toString());
  } else {
    toast.error("An unknown error occurred");
  }
}
};


/* gets rearanged files and makes deep copy of the transformed file
then updates the attribues path and position
i don't realy know how positions dont clash but as long as it works i am not complaining
*/ 
export const handleRearangeModels = async (
  transformedFile: PodGo | null,
  rearangedModels: BlockLayoutItem[] | null,
  setTransformedFile: React.Dispatch<React.SetStateAction<PodGo | null>>) => {
  try {
    if (!transformedFile || !rearangedModels) return;

    let newFile: PodGo = JSON.parse(JSON.stringify(transformedFile));

    const fixedKeys: FixedKeys[] = ['inputA', 'inputB', 'join', 'outputA', 'outputB', 'split'];

    const newDsp0: any= {} ;
    const newDsp1: any = {};


    for (const key of fixedKeys) {
        if (newFile.data.tone.dsp0[key]) {
            newDsp0[key] = newFile.data.tone.dsp0[key];
        }
        if (newFile.data.tone.dsp1 && newFile.data.tone.dsp1[key]) {
            newDsp1[key] = newFile.data.tone.dsp1[key];
        }
    }const dsp0Layout: BlockLayoutItem[] = [];
    const dsp1Layout: BlockLayoutItem[] = [];
    rearangedModels.forEach((item) => {

        const blockKey = item.id.split('-')[1]; 
        const originalDspKey = item.id.split('-')[0]; 

        let sourceDsp: any;
        if (originalDspKey === 'dsp0') {
            sourceDsp = transformedFile.data.tone.dsp0;
        } else if (originalDspKey === 'dsp1' && transformedFile.data.tone.dsp1) {
            sourceDsp = transformedFile.data.tone.dsp1;
        } else {
            return; 
        }
        
        const targetBlock = sourceDsp[blockKey]; 

        if (targetBlock) {

            const newBlock = JSON.parse(JSON.stringify(targetBlock));


            newBlock["@path"] = newBlock["@path"]; 
            newBlock["@position"] = item.index; 

         
            if (item.dsp === 'dsp0') {
                newDsp0[blockKey] = newBlock;
                dsp0Layout.push(item);
            } else if (item.dsp === 'dsp1') {
                newDsp1[blockKey] = newBlock;
                dsp1Layout.push(item);
            }
        }
    });

    newFile.data.tone.dsp0 = newDsp0;
    newFile.data.tone.dsp1 = newDsp1;
   
    
    setTransformedFile(newFile);
    toast.success("Successfully rearranged and saved!");

  } catch (error) {
    toast.error("An unexpected error occurred during rearrangement.");
    console.error(error);
  }
};

export const handleSaveFile = async (convertedData: PodGo | null, storedFileName: string|null) => {
  if (!convertedData) {
    toast.error("No file to save");
    return;
  }
  try {
    const savePath: string | null = await save({
      defaultPath: `${!storedFileName ? "output" : storedFileName}.hlx`,
      filters: [{ name: "Helix Files", extensions: ["hlx"] }],
    });

    if (!savePath) return;

    await writeTextFile(savePath, JSON.stringify(convertedData, null, 2));

    toast.success(`File Saved Successfully: ${savePath}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.toString());
    } else {
      toast.error("An unknown error occurred");
    }
  }
};
