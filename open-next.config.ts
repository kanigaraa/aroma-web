import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // ponytail: static-only cache — no revalidation, all pages force-static
  // upgrade path: switch to kv-incremental-cache when ISR needed
  incrementalCache: staticAssetsCache,
  tagCache: "dummy",
  queue: "direct",
});
