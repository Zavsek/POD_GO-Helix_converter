import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DspBlock } from "../interfaces/DspBlock";

export interface SortableBlockProps {
  id: string;
  item: {
    id: string;
    block: DspBlock;
    dsp: "dsp0" | "dsp1";
  };
}

export default function SortableBlock({ id, item }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "fit-content",
    height: 80,
    padding: "8px",
    border: "1px solid #666",
    borderRadius: 8,
    background: "#111",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "grab",
    textWrap:"wrap",
    boxSizing: "border-box",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{item.block["@model"]}</div>
      <div style={{ fontSize: 10, marginTop: 6 }}>{item.id}</div>
    </div>
  );
}
