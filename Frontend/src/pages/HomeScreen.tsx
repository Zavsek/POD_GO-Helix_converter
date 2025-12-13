import React from 'react'
import Header from '../components/Header'
import { PodGo } from '../interfaces/PodGoData';
import { convertToHlxLogic } from "../lib/converter";  


interface Props{
    filePath:string|null;
    transformedFile: PodGo| null;
    onShowModelBuilder: () => void;
    onSelectFile: () => void;
    onConvert: (data: any) => void;
    onSave:() => void;
}

const HomeScreen: React.FC<Props> = ({filePath, transformedFile, onShowModelBuilder, onSelectFile, onConvert, onSave}) => {
  return (
    <>
          <Header title={"POD GO TO HELIX CONVERTER"} onShowModelBuilder={onShowModelBuilder} showModelBuilder={false}/>
          <main className="flex flex-col items-center justify-center flex-grow text-center px-4 mb-25">
            <div className="bg-slate-700/10 backdrop-blur-md p-10 shadow-2xl w-full max-w-lg min-h-[300px] flex flex-col justify-center gap-4">
              <input
                type="text"
                readOnly
                value={filePath || ""}
                placeholder="No File Selected"
                className="text-white p-2 rounded-lg border bg-[linear-gradient(110deg,#4f46e5,55%,#4f46e5)] border-gray-500 w-full"
              />
              <button
                onClick={onSelectFile}
                className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white py-2 px-6 rounded-lg shadow-md font-primary transition-all duration-500 cursor-pointer hover:scale-101"
              >
                Select .pgp File
              </button>

              <button
                onClick={() => onConvert(convertToHlxLogic)}
                className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white font-primary py-2 px-6 rounded-lg shadow-md transition-all mt-1 duration-500 cursor-pointer hover:scale-101"
              >
                Convert to .hlx
              </button>

              <button
                onClick={transformedFile ? onShowModelBuilder : undefined}
                className={transformedFile ? "animate-bg-shine bg-[linear-gradient(110deg,#F0184A,45%,#F0657A,55%,#F0184A)] bg-[length:200%_100%] bg  border-[1px] text-white font-primary py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer, mt-10 hover:scale-101" : "border bg-[linear-gradient(110deg,#4f46e5,55%,#4f46e5)]/60 border-gray-500 w-full text-white/80 font-primary py-2 px-6 rounded-lg shadow-md transition-all cursor-pointer, mt-10 "}
              >
                Preset builder
              </button>

              <button
                onClick={transformedFile ? onSave : undefined}
                className={transformedFile ? "animate-bg-shine bg-[linear-gradient(110deg,#CEE407,45%,#E8F858,55%,#CEE407)] bg-[length:200%_100%] border-[1px] text-white font-primary py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer hover:scale-101" : "border bg-[linear-gradient(110deg,#4f46e5,55%,#4f46e5)]/60 border-gray-500 w-full text-white/80 font-primary py-2 px-6 rounded-lg shadow-md transition-all cursor-pointer "}
              >
                Save file
              </button>
            </div>
          </main>
        </>
  )
}

export default HomeScreen