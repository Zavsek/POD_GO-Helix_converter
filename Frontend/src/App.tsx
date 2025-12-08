import { useFileHandler } from "./hooks/useFileHandler";
import { convertToHlxLogic } from "./lib/converter.js";  
import TitleBar from "./components/TitleBar.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";

function App() {

  const { filePath,  transformedFile, models, onSelectFile, onConvert, onSave } = useFileHandler();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 text-white">
      <TitleBar />

      <header className="w-full bg-slate-700/80 backdrop-blur-md py-4 text-center text-3xl font-semibold rounded-b-xl font-primary shadow-2xl">
        POD GO TO HELIX CONVERTER
      </header>

      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
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
            className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white  py-2 px-6 rounded-lg shadow-md font-primary transition-all duration-500 cursor-pointer hover:scale-101"
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
            onClick={transformedFile ? onSave : undefined} 
            className={transformedFile? "animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white font-pirmary py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer, mt-10 hover:scale-101"
              : "border bg-[linear-gradient(110deg,#4f46e5,55%,#4f46e5)]/60 border-gray-500 w-full text-white/80 font-primary py-2 px-6 rounded-lg shadow-md transition-all cursor-pointer, mt-10 "}
          >
            Save file
          </button>
          { models && models.length > 0 ? (
            <div>
              {models.map((block, index) => (
                <div key={index}>
                  <p>Model: {block["@model"]}</p>
                  <p>Position: {block["@position"]}</p>
                  <p>Stereo: {block["@stereo"] ? "Yes" : "No"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No models available</p>
          )}
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
