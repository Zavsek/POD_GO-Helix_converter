export default function TitleBar() {
  return (
    <div
      className="flex justify-between items-center bg-slate-800 border-b-2 border-black/50 h-10 pl-2 select-none"
      style={{ WebkitAppRegion: "drag" }} 
    >
      <div className="text-slate-700/80 pl-2">POD Go To Helix Converter</div>

      <div className="flex space-x-1" style={{ WebkitAppRegion: "no-drag" }}>
        <button
          className="pr-3 pl-3 p-1 hover:bg-slate-700 rounded-b rounded-l text-gray-300 cursor-pointer"
          onClick={() => window.electronAPI.minimize()}
        >
          -
        </button>
        <button
          className="px-3 p-1 hover:bg-red-600  rounded-b text-gray-300 cursor-pointer"
          onClick={() => window.electronAPI.close()}
        >
          ×
        </button>
      </div>
    </div>
  );
}
