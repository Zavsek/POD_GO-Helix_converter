import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { PodGo } from "../interfaces/PodGoData";
import { DspBlock } from "../interfaces/DspBlock";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import mapColorsForBlocks from "../lib/helpers/mapColorsForBlocks";


interface ModelItem {
  id: string;
  block: DspBlock;
  dsp: "dsp0" | "dsp1";
}

interface Props {
  transformedFile: PodGo | null;
  onShowModelBuilder: () => void;
  models: ModelItem[] | null;
}

const ROW_LENGTH = 8;

function makeRowFromModels(modelsForDsp: ModelItem[]) {
  const row: (ModelItem | null)[] = new Array(ROW_LENGTH).fill(null);
  for (let i = 0; i < Math.min(modelsForDsp.length, ROW_LENGTH); i++) {
    row[i] = modelsForDsp[i];
  }
  return row;
}


interface SortableBlockProps {
  id: string;
  item: ModelItem | null;
  active?: boolean; 
}

const SortableBlockItem: React.FC<SortableBlockProps> = ({ id, item, active }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !item });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  
  if (!item) {
    return (
      <div
        ref={setNodeRef}
        style={style}
  
        className="w-full h-24 border border-dashed border-gray-700 rounded-lg flex items-center justify-center bg-gray-800/20 text-gray-600 text-[10px] select-none"
      >
        Empty
      </div>
    );
  }
  const blockColor = mapColorsForBlocks(item.block["@model"] || "");
  
  const dynamicStyle = {
    backgroundColor: blockColor,
    
    ...(active ? {} : style),
  };
  // ----------------------------------------------------


  const baseClasses = "w-full h-24 rounded-lg flex flex-col items-center justify-center p-2 cursor-grab select-none overflow-hidden text-center transition-all duration-100 ease-out";
  const colorClasses = active 
    ? "border-2 border-blue-400 shadow-xl z-50 cursor-grabbing" 
    : "border border-slate-600 hover:scale-[1.03] hover:border-slate-500 shadow-sm active:cursor-grabbing";

  return (
    <div
      ref={setNodeRef}
      style={dynamicStyle}
      {...attributes}
      {...listeners}
      className={`${baseClasses} ${colorClasses}`}
    >

      <span className="text-white text-xs font-medium break-words leading-tight w-full pointer-events-none px-1">
        {item.block["@model"] || "Unknown Block"}
      </span>

    </div>
  );
};

const PresetEditor: React.FC<Props> = ({ transformedFile, onShowModelBuilder, models }) => {
  
  const [items, setItems] = useState<{
    dsp0: (ModelItem | null)[];
    dsp1: (ModelItem | null)[];
  }>({ dsp0: [], dsp1: [] });

  const [activeId, setActiveId] = useState<string | null>(null);

  useMemo(() => {
    if (models) {
      const dsp0Models = models.filter((m) => m.dsp === "dsp0");
      const dsp1Models = models.filter((m) => m.dsp === "dsp1");
      setItems({
        dsp0: makeRowFromModels(dsp0Models),
        dsp1: makeRowFromModels(dsp1Models),
      });
    }
  }, [models]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (!models) return <div className="text-white p-4">Loading models...</div>;

  const getSlotId = (rowKey: string, index: number, item: ModelItem | null) => {
    return item ? item.id : `empty-${rowKey}-${index}`;
  };

  const findContainer = (id: string) => {
    if (items.dsp0.some((it, idx) => getSlotId("dsp0", idx, it) === id)) return "dsp0";
    if (items.dsp1.some((it, idx) => getSlotId("dsp1", idx, it) === id)) return "dsp1";
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeIdStr = String(active.id);
    setActiveId(null);

    if (!over) return;

    const overIdStr = String(over.id);
    const activeContainer = findContainer(activeIdStr);
    const overContainer = findContainer(overIdStr);

    if (!activeContainer || !overContainer) return;

    const activeIndex = items[activeContainer as "dsp0" | "dsp1"].findIndex(
      (it, idx) => getSlotId(activeContainer, idx, it) === activeIdStr
    );
    const overIndex = items[overContainer as "dsp0" | "dsp1"].findIndex(
      (it, idx) => getSlotId(overContainer, idx, it) === overIdStr
    );

    if (activeIndex === -1 || overIndex === -1) return;

    setItems((prev) => {
      const sourceRow = [...prev[activeContainer as "dsp0" | "dsp1"]];
      const targetRow = activeContainer === overContainer 
        ? sourceRow 
        : [...prev[overContainer as "dsp0" | "dsp1"]];

      const itemToMove = sourceRow[activeIndex];

      if (activeContainer === overContainer) {
        const newRow = arrayMove(prev[activeContainer as "dsp0" | "dsp1"], activeIndex, overIndex);
        return { ...prev, [activeContainer]: newRow };
      } else {
        sourceRow.splice(activeIndex, 1);
        targetRow.splice(overIndex, 0, itemToMove);
        
        while (sourceRow.length < ROW_LENGTH) sourceRow.push(null);
        const normalizedTarget = targetRow.slice(0, ROW_LENGTH);

        return {
          ...prev,
          [activeContainer]: sourceRow,
          [overContainer]: normalizedTarget,
        };
      }
    });
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: '0.4' },
      },
    }),
  };

  const renderRow = (rowKey: "dsp0" | "dsp1") => {
    const rowData = items[rowKey];
    const dndIds = rowData.map((it, idx) => getSlotId(rowKey, idx, it));

    return (
      <div className="w-full mb-6">
        <h2 className="mb-2 text-gray-400 font-bold text-xs uppercase tracking-wider pl-1">
            {rowKey.toUpperCase()} CHAIN
        </h2>
        <div className="bg-gray-900 p-3 rounded-xl border border-gray-800 shadow-inner">
            <SortableContext items={dndIds} strategy={horizontalListSortingStrategy}>

            <div className="grid grid-cols-8 gap-2 w-full">
                {rowData.map((item, idx) => (
                <SortableBlockItem
                    key={getSlotId(rowKey, idx, item)}
                    id={getSlotId(rowKey, idx, item)}
                    item={item}
                />
                ))}
            </div>
            </SortableContext>
        </div>
      </div>
    );
  };

  const activeItem = activeId 
    ? [...items.dsp0, ...items.dsp1].find(i => i?.id === activeId) 
    : null;

  return (

    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <Header title={"PRESET BUILDER"} onShowModelBuilder={onShowModelBuilder} showModelBuilder={true} />
      

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-full mx-auto">
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
            <div className="flex flex-col space-y-2">
                {renderRow("dsp0")}
                {renderRow("dsp1")}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeId && activeItem ? (

                    <div style={{ width: '140px' }}> 
                        <SortableBlockItem 
                            id={activeId} 
                            item={activeItem} 
                            active={true} 
                        />
                    </div>
                ) : null}
            </DragOverlay>

            </DndContext>
        </div>
      </div>
      <button
                className={transformedFile ? " absolute right-6 bottom-25 animate-bg-shine bg-[linear-gradient(110deg,#CEE407,45%,#E8F858,55%,#CEE407)] bg-[length:200%_100%] border-[1px] text-white font-primary py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer min-w-40 min-h-20 hover:scale-101" : "border bg-[linear-gradient(110deg,#4f46e5,55%,#4f46e5)]/60 border-gray-500 w-full text-white/80 font-primary py-2 px-6 rounded-lg shadow-md transition-all cursor-pointer "}
              >
                Save layout in file
              </button>
    </div>
  );
};

export default PresetEditor;