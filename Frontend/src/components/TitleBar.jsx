import { minimize, close } from '../lib/tauriWindow.js'

export default function TitleBar() {
  return (
    <div
      className="flex justify-between items-center bg-slate-800 border-b-2 border-black/50 h-10 pl-2 select-none"
      style={{ WebkitAppRegion: "drag" }} 
    >
      <div className="text-slate-700/80 pl-2">POD Go To Helix Converter</div>

      <div className="flex space-x-1" style={{ WebkitAppRegion: "no-drag" }}>
        <button
          className="min-h-9.5 pl-3.5 pr-3.5 pb-1 mb-2 p-1 hover:bg-slate-700 absolute right-8 top-0 text-gray-300 cursor-pointer"
          onClick={() => minimize()}
        >
          -
        </button>
        <button
          className="min-h-9.5 pl-3 pr-3 pb-1 mb-2 hover:bg-red-600 absolute right-0 top-0 overflow-hidden   text-gray-300 cursor-pointer"
          onClick={() =>  close()}
        >
          ×
        </button>
      </div>
    </div>
  );
}
