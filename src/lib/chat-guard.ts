import type { ChatMessage } from "./groq";

const INJECTION = /(?:ignore|abaikan|lupakan).{0,80}(?:instruksi|instruction|system|prompt)|(?:system\s*prompt|developer\s*message|api\s*key|secret|token).{0,80}(?:tampilkan|bocorkan|reveal|extract)|<\/?(?:system|instruction|assistant|context)[^>]*>/i;
const LEAK = /(?:system\s*prompt|developer\s*message|api[_ -]?key|authorization:\s*bearer|groq_api_key|better_auth_secret)/i;

export function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export function normalizeChat(messages: ChatMessage[]): { error?: string; messages?: ChatMessage[] } {
  if (messages.length > 20) return { error: "Riwayat percakapan maksimal 20 pesan." };
  if (messages.some((message) => INJECTION.test(message.content))) {
    return { error: "Pesan berisi instruksi yang tidak didukung. Tanyakan harga pangan AROMA." };
  }
  // Riwayat dari browser tidak pernah dipercaya sebagai pesan asisten.
  const users = messages.filter((message) => message.role === "user").slice(-10);
  return { messages: users.map(({ content }) => ({ role: "user", content: content.trim() })) };
}

export function safeOutput(text: string) {
  if (LEAK.test(text)) return "Maaf, saya hanya dapat membantu pertanyaan tentang data harga pangan AROMA.";
  return text.slice(0, 2_000).trim();
}
