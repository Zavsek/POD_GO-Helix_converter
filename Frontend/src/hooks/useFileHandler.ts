import { useState } from 'react';
import { handleSelectFile, handleConvert, handleSaveFile } from '../utils/fileUtils'; 
import { PodGo } from '../interfaces/PodGoData';
import { DspBlock } from '../interfaces/DspBlock';

export const useFileHandler = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [transformedFile, setTransformedFile]= useState<PodGo | null>(null);
  const [models, setModels] = useState<DspBlock[] | null> (null);



  const onSelectFile = () => {
    setTransformedFile(null);
    setModels(null);
    handleSelectFile(setFilePath, setFileContent);
  };


  const onConvert = (convertToHlxLogic: (data: any) => any) => {
    handleConvert(filePath, fileContent, convertToHlxLogic, setTransformedFile, setModels);
  };


  const onSave = () =>{
    handleSaveFile(transformedFile);
  }
  return {
    filePath,
    fileContent,
    transformedFile,
    models,
    onSelectFile,
    onConvert,
    onSave
  };
};


