import { useState } from 'react';
import { handleSelectFile, handleConvert, handleSaveFile } from '../utils/fileUtils'; 
import { PodGo } from '../interfaces/PodGoData';
import { DspBlock } from '../interfaces/DspBlock';
import { mainWindowResize, modelWindowResize } from '../lib/tauriWindow';
import { useEffect } from 'react';
import { BlockLayoutItem } from '../interfaces/BlockLayoutItem';
import { handleRearangeModels } from '../utils/fileUtils';

export const useFileHandler = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [transformedFile, setTransformedFile]= useState<PodGo | null>(null);
  const [models, setModels] = useState<{id:string,  block: DspBlock, dsp: 'dsp0' | 'dsp1' }[] | null>(null);
    const[showModelBuilder, setShowModelBuilder] = useState<boolean>(false)
    const[rearangedModels, setRearangedModels] = useState<BlockLayoutItem[] | null>(null);
    const[storedFileName, setStoredFileName] = useState<string |null>(null);



  const onSelectFile = async () => {
    setTransformedFile(null);
    setModels(null);
    handleSelectFile(setFilePath, setFileContent);
  };

 const onShowModelBuilder = () => {

    setShowModelBuilder(prev => !prev);
  };

  useEffect(() => {

    console.log("showModelBuilder updated:", showModelBuilder);
    if (showModelBuilder) {
      modelWindowResize();
    } else {
      mainWindowResize();
    }
  }, [showModelBuilder]);

  const onConvert = (convertToHlxLogic: (data: PodGo) => { convertedData: PodGo; presetName: string }) => {
    handleConvert(filePath, fileContent, convertToHlxLogic, setTransformedFile, setModels, setStoredFileName);
  };

  const onRearangeModels = (layout: BlockLayoutItem[]) => {
    handleRearangeModels(transformedFile, layout, setTransformedFile);
  }

  const onSave = () =>{
    handleSaveFile(transformedFile, storedFileName);
  }
  return {
    filePath,
    fileContent,
    transformedFile,
    models,
    showModelBuilder,
    setRearangedModels,
    onShowModelBuilder,
    onSelectFile,
    onConvert,
    onRearangeModels,
    onSave
  };
};


