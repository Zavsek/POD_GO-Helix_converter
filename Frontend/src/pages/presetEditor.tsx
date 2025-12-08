import React from 'react'
import { useFileHandler } from '../hooks/useFileHandler';
import Header from '../components/Header';
import { PodGo } from '../interfaces/PodGoData';

interface Props{
  transformedFile: PodGo |null;
  onShowModelBuilder: () => void;
}


const PresetEditor: React.FC<Props> = ({transformedFile, onShowModelBuilder})=> {
  return (
    <>
      <Header title={'PRESET BUILDER'}/>
      <button onClick={onShowModelBuilder}>back </button>
      </>
  );
}

export default PresetEditor