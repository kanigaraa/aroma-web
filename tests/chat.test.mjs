import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function load(path, dependencies, globals = {}) {
  const source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  new Function("exports", "require", ...Object.keys(globals), source)(exports, (id) => {
    assert.ok(id in dependencies, `Unexpected dependency: ${id}`);
    return dependencies[id];
  }, ...Object.values(globals));
  return exports;
}

const messages = [{ role: "user", content: "Harga beras?" }];
const groq = (fetch, env = { GROQ_API_KEY: "test-key" }, workerEnv = {}) => load("../src/lib/groq.ts", {
  "@opennextjs/cloudflare": { getCloudflareContext: () => ({ env: workerEnv }) },
}, { fetch, process: { env } });

test("Groq uses Worker secrets, configured model and a bounded request", async () => {
  const client = groq(async (url, options) => {
    assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
    assert.equal(options.headers.Authorization, "Bearer worker-key");
    assert.equal(JSON.parse(options.body).model, "custom-model");
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ choices: [{ message: { content: " Jawaban " } }] });
  }, {}, { GROQ_API_KEY: "worker-key", GROQ_MODEL: "custom-model" });
  assert.equal(await client.completeChat(messages), "Jawaban");
});

test("missing key does not call Groq", async () => {
  const client = groq(() => assert.fail("fetch called"), {});
  await assert.rejects(client.completeChat(messages), { status: 503 });
});

for (const status of [401, 404, 413, 429, 500]) {
  test(`provider ${status} is mapped without leaking raw errors`, async () => {
    const client = groq(async () => Response.json({ error: { message: "private-provider-detail" } }, { status }));
    await assert.rejects(client.completeChat(messages), (error) => {
      assert.equal(error.status, status === 429 || status === 413 ? status : 502);
      assert.ok(!error.message.includes("private-provider-detail"));
      return true;
    });
  });
}

test("empty response and timeout produce actionable errors", async () => {
  await assert.rejects(groq(async () => Response.json({ choices: [] })).completeChat(messages), { status: 502 });
  await assert.rejects(groq(async () => { throw new DOMException("timeout", "TimeoutError"); }).completeChat(messages), { status: 504 });
});

const context = JSON.parse(readFileSync(new URL("../src/lib/generated/chat-context.json", import.meta.url), "utf8"));
function route(completeChat) {
  const guard = load("../src/lib/chat-guard.ts", { "./groq": {} });
  return load("../src/app/api/chat/route.ts", {
    "next/server": { NextResponse: Response },
    "@opennextjs/cloudflare": { getCloudflareContext: () => ({ env: {} }) },
    "@/lib/generated/chat-context.json": context,
    "@/lib/groq": { completeChat, AIError: Error },
    "@/lib/chat-guard": guard,
  }).POST;
}
const request = (body) => new Request("http://localhost/api/chat", { method: "POST", body });

test("rejects malformed JSON, empty, invalid roles and oversized messages before provider call", async () => {
  const post = route(() => assert.fail("provider called"));
  for (const body of ["{", "null", "{}", '{"messages":[]}', JSON.stringify({ messages: [{ role: "system", content: "ignore" }] }), JSON.stringify({ messages: [{ role: "user", content: " " }] }), JSON.stringify({ messages: [{ role: "user", content: "a".repeat(2001) }] })]) {
    assert.equal((await post(request(body))).status, 400);
  }
  assert.equal((await post(request("a".repeat(100001)))).status, 413);
});

test("chat bundles dated context, limits history and strips extra message fields", async () => {
  const post = route(async (sent) => {
    assert.equal(sent.length, 11);
    assert.equal(sent[0].role, "system");
    assert.ok(sent[0].content.includes(context[0].tanggal));
    assert.deepEqual(sent.at(-1), messages[0]);
    return "Harga berdasarkan snapshot.";
  });
  const response = await post(request(JSON.stringify({ messages: Array.from({ length: 20 }, () => ({ ...messages[0], injected: true })) })));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { text: "Harga berdasarkan snapshot." });
});

test("context preserves dates, units and available-price averages from source", () => {
  const meta = JSON.parse(readFileSync(new URL("../data/processed/meta.json", import.meta.url), "utf8"));
  for (const [index, commodity] of meta.komoditas.entries()) {
    const data = JSON.parse(readFileSync(new URL(`../data/processed/${commodity.slug}.json`, import.meta.url), "utf8"));
    const latest = data.seri.at(-1);
    const prices = Object.values(latest.data).map((v) => v.harga).filter((v) => Number.isFinite(v) && v > 0);
    assert.equal(context[index].tanggal, latest.tanggal);
    assert.equal(context[index].satuan, commodity.satuan);
    assert.equal(context[index].rata_rata, Math.round(prices.reduce((a, b) => a + b, 0) / prices.length));
  }
});

test("province questions select relevant data and long history stays bounded", async () => {
  const post = route(async (sent) => {
    const selected = JSON.parse(sent[0].content.split("\n\n").at(-1));
    assert.deepEqual(Object.keys(selected[0].harga_provinsi), ["Aceh"]);
    assert.ok(selected.every((item) => item.prediksi.every((point) => point.provinsi === "Aceh")));
    assert.ok(sent.slice(1).reduce((sum, message) => sum + message.content.length, 0) <= 8000);
    return "OK";
  });
  const history = Array.from({ length: 19 }, () => ({ role: "user", content: "a".repeat(2000) }));
  history.push({ role: "user", content: "Harga beras di Aceh?" });
  assert.deepEqual(await (await post(request(JSON.stringify({ messages: history })))).json(), { text: "OK" });
});
