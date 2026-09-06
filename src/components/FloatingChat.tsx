"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Halo! Tanya apa saja soal harga pangan AROMA. Contoh: \"Berapa harga cabai rawit sekarang?\"" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const moved = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...msgs, { role: "user", content: q }] }),
      });
      const d = (await r.json()) as { text?: string; error?: string };
      setMsgs((m) => [...m, { role: "assistant", content: d.text || d.error || "Maaf, tidak ada respons." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Gagal terhubung ke AI." }]);
    } finally {
      setLoading(false);
    }
  };

  // Pointer-based drag
  const onPointerDown = (e: React.PointerEvent) => {
    if (open) return; // jangan drag saat chat terbuka
    dragging.current = true;
    moved.current = false;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    moved.current = true;
    const x = e.clientX - offset.current.x;
    const y = e.clientY - offset.current.y;
    setPos({ x, y });
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  // Button position style
  const btnStyle = pos
    ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
    : {};

  // Chat panel: follow button or default bottom-right
  const panelStyle = pos
    ? {
        left: pos.x + 56 > window.innerWidth - 340
          ? pos.x - 328
          : pos.x,
        top: pos.y - 390 < 12 ? pos.y + 70 : pos.y - 390,
        right: "auto",
        bottom: "auto",
      }
    : {};

  return (
    <>
      {open && (
        <div
          className="fixed z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:w-96"
          style={Object.keys(panelStyle).length ? panelStyle : { bottom: "10rem", right: "1.25rem" }}
        >
          <div className="flex items-center justify-between border-b border-border bg-teal-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">Asisten AROMA</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user" ? "bg-teal-600 text-white" : "bg-muted text-primary"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tanya soal harga pangan..."
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-primary outline-none focus:border-accent"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              aria-label="Kirim"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button — draggable, mobile-safe position */}
      <button
        ref={btnRef}
        onClick={() => {
          if (moved.current) { moved.current = false; return; }
          setOpen((o) => !o);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-label="Asisten AI"
        className={`fixed z-50 flex h-14 w-14 touch-none items-center justify-center rounded-full shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 ${
          open ? "bg-teal-700" : "bg-teal-600"
        }`}
        style={
          Object.keys(btnStyle).length
            ? { ...btnStyle, willChange: "left, top" }
            : { bottom: "5.5rem", right: "1.25rem" }
        }
      >
        {open ? <X className="h-5 w-5 text-white" /> : <Bot className="h-6 w-6 text-white" />}
      </button>
    </>
  );
}
