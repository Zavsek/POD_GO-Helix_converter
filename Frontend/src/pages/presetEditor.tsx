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
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableBlock from "../components/sortableBlock";

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

const PresetEditor: React.FC<Props> = ({ transformedFile, onShowModelBuilder, models }) => {
  if (!models) return <p>Loading…</p>;

  const dsp0Models = useMemo(() => models.filter((m) => m.dsp === "dsp0"), [models]);
  const dsp1Models = useMemo(() => models.filter((m) => m.dsp === "dsp1"), [models]);

  const [rows, setRows] = useState<{
    dsp0: (ModelItem | null)[];
    dsp1: (ModelItem | null)[];
  }>(() => ({
    dsp0: makeRowFromModels(dsp0Models),
    dsp1: makeRowFromModels(dsp1Models),
  }));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function findLocationById(id: string) {
    const rowKey = rows.dsp0.findIndex((it) => it?.id === id) !== -1
      ? "dsp0"
      : rows.dsp1.findIndex((it) => it?.id === id) !== -1
      ? "dsp1"
      : null;
    if (!rowKey) return null;
    const index = rows[rowKey].findIndex((it) => it?.id === id);
    return { rowKey: rowKey as "dsp0" | "dsp1", index };
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!active || !over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const src = findLocationById(activeId);
    const trg = findLocationById(overId);

    if (!src || !trg) return;

    // Omejitev: elementi se lahko premikajo samo znotraj iste vrstice
    if (src.rowKey !== trg.rowKey) return;

    setRows((prev) => {
      const newRow = [...prev[src.rowKey]];
      const [moved] = newRow.splice(src.index, 1);
      newRow.splice(trg.index, 0, moved);

      // Zagotovi dolžino ROW_LENGTH
      const normalized = newRow.slice(0, ROW_LENGTH);
      while (normalized.length < ROW_LENGTH) normalized.push(null);

      return { ...prev, [src.rowKey]: normalized };
    });
  }

  const renderRow = (row: (ModelItem | null)[], rowKey: "dsp0" | "dsp1") => {
    const draggableIds = row.filter(Boolean).map((it) => it!.id);

    return (
      <div key={rowKey}>
        <h2 className="mb-2">{rowKey.toUpperCase()}</h2>
        <SortableContext items={draggableIds} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-2">
            {row.map((cell, idx) => {
              if (!cell) {
                return (
                  <div
                    key={`empty-${rowKey}-${idx}`}
                    style={{
                      width: 100,
                      height: 80,
                      textWrap:"wrap",
                      border: "1px dashed #444",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.02)",
                      color: "#777",
                    }}
                  >
                    <span style={{ fontSize: 12 }}>empty</span>
                  </div>
                );
              }

              return <SortableBlock key={cell.id} id={cell.id} item={cell} />;
            })}
          </div>
        </SortableContext>
      </div>
    );
  };

  return (
    <>
      <Header title={"PRESET BUILDER"} onShowModelBuilder={onShowModelBuilder} showModelBuilder={true} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-6 p-4">
          {renderRow(rows.dsp0, "dsp0")}
          {renderRow(rows.dsp1, "dsp1")}
        </div>
      </DndContext>
      <div className="p-4">
      </div>
    </>
  );
};

export default PresetEditor;
