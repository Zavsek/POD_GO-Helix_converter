import { useFileHandler } from "./hooks/useFileHandler";
import { convertToHlxLogic } from "./lib/converter.js";  
import TitleBar from "./components/TitleBar.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";

function App() {

  const { filePath, fileContent, onSelectFile, onConvert } = useFileHandler();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 text-white">
      <TitleBar />

      <header className="w-full bg-slate-700/80 backdrop-blur-md py-4 text-center text-3xl font-semibold rounded-b-xl font-primary shadow-2xl">
        POD GO TO HELIX CONVERTER!
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
            className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer hover:scale-101"
          >
            Select .pgp File
          </button>
          
          <button
            onClick={() => onConvert(convertToHlxLogic)} 
            className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer hover:scale-101"
          >
            Convert to .hlx
          </button>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
