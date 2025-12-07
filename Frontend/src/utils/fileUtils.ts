
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { PodGo } from "../interfaces/PodGoData";
import { toast } from 'react-hot-toast';


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

    if (izbranaDatoteka.startsWith('/mock/')) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pgp';
      input.onchange = (e) => {
        const fileInput = e.target as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target!.result;
            if (typeof result === 'string') {
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


export const handleConvert = async (
  filePath: string | null,
  fileContent: string | null,
  convertToHlxLogic: (data: any) => any
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
    const convertedData = convertToHlxLogic(podGoData);

    const savePath: string | null = await save({
      defaultPath: "output.hlx",
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
