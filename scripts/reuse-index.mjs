import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  writeFile,
  readdir,
  lstat,
  copyFile,
} from "node:fs/promises";
import { extractPack } from "@foundryvtt/foundryvtt-cli";
import { resolveProfile } from "./remote.mjs";
import { sha256 } from "./wiki-crawl.mjs";
import { slug } from "./wiki-extract.mjs";
import { safeRelative } from "./lib.mjs";
const root = path.resolve(".local/reuse-index");
async function hashes(dir) {
  const result = {};
  for (const name of (await readdir(dir)).sort()) {
    assert(
      /^(?:[0-9]+\.(?:ldb|log)|CURRENT|MANIFEST-[0-9]+|LOG(?:\.old)?|LOCK)$/.test(
        name,
      ),
      "Unexpected database file",
    );
    const p = path.join(dir, name);
    const st = await lstat(p);
    assert(st.isFile() && !st.isSymbolicLink(), "Non-regular database file");
    result[name] = sha256(await readFile(p));
  }
  return result;
}
export function reuseRecord(doc, { provider, version, pack }) {
  return {
    key: slug(doc.name),
    name: doc.name,
    uuid: `Compendium.${provider}.${pack}.Item.${doc._id}`,
    provider,
    version,
    pack,
    type: doc.type,
    subType: doc.system?.subType ?? null,
    img: doc.img ?? null,
    hasDescription: ["value", "unidentified"].some(
      (field) => (doc.system?.description?.[field]?.length ?? 0) > 30,
    ),
    placeholderImage: /mystery-man|item-bag|icons\/svg\/item-bag/i.test(
      doc.img ?? "",
    ),
    sha256: sha256(JSON.stringify(doc)),
    nativeActions: doc.system?.actions?.length ?? 0,
    hasChanges: !!doc.system?.changes?.length,
    hasContents: !!Object.keys(doc.system?.items ?? {}).length,
  };
}
async function main() {
  const profile = resolveProfile(
    JSON.parse(await readFile(".local/remote.json", "utf8")),
  );
  await mkdir(root, { recursive: true });
  const providers = [];
  const data = path.join(profile.dataPath, "Data");
  const sys = JSON.parse(
    await readFile(path.join(data, "systems/pf1/system.json"), "utf8"),
  );
  providers.push({ ...sys, folder: path.join(data, "systems/pf1") });
  for (const id of await readdir(path.join(data, "modules"))) {
    if (id === "additional-spheres-content") continue;
    try {
      const folder = path.join(data, "modules", id);
      const m = JSON.parse(
        await readFile(path.join(folder, "module.json"), "utf8"),
      );
      const systems = m.relationships?.systems?.map((s) => s.id) ?? [];
      if (systems.length && !systems.includes("pf1")) continue;
      providers.push({ ...m, folder });
    } catch {}
  }
  const entries = [],
    packs = [],
    errors = [];
  for (const provider of providers)
    for (const pack of provider.packs ?? []) {
      if (pack.type !== "Item") continue;
      try {
        const packPath = pack.path ?? `packs/${pack.name}`;
        safeRelative(packPath);
        assert(
          /^[a-zA-Z0-9_-]+$/.test(provider.id) &&
            /^[a-zA-Z0-9_-]+$/.test(pack.name),
          "Unsafe pack name",
        );
        let source = path.join(provider.folder, packPath);
        try {
          await lstat(source);
        } catch (error) {
          if (error.code !== "ENOENT" || !packPath.endsWith(".db")) throw error;
          source = path.join(provider.folder, packPath.slice(0, -3));
        }
        const before = await hashes(source);
        const fingerprint = sha256(JSON.stringify(before));
        const local = path.join(root, provider.id, pack.name, fingerprint);
        let docs;
        let names;
        try {
          const complete = JSON.parse(
            await readFile(path.join(local, "complete.json"), "utf8"),
          );
          assert.equal(complete.fingerprint, fingerprint);
          docs = path.join(local, complete.run, "documents");
          names = await readdir(docs);
          assert.equal(names.length, complete.count);
        } catch {
          const run = randomUUID();
          docs = path.join(local, run, "documents");
          const snapshot = path.join(local, run, "database");
          await mkdir(snapshot, { recursive: true });
          for (const name of Object.keys(before))
            await copyFile(path.join(source, name), path.join(snapshot, name));
          assert.deepEqual(await hashes(snapshot), before, "Copy changed");
          assert.deepEqual(
            await hashes(source),
            before,
            "Remote pack changed while copying",
          );
          await extractPack(snapshot, docs, {
            transformName: (d) => {
              assert(/^[a-zA-Z0-9]{16}$/.test(d._id), "Invalid source ID");
              return `${d._id}.json`;
            },
          });
          names = await readdir(docs);
          assert.deepEqual(
            await hashes(source),
            before,
            "Remote pack changed while extracting local copy",
          );
          await writeFile(
            path.join(local, "complete.json"),
            JSON.stringify({ fingerprint, run, count: names.length }),
          );
        }
        for (const name of names) {
          if (!name.endsWith(".json")) continue;
          const d = JSON.parse(await readFile(path.join(docs, name), "utf8"));
          if (d._key?.startsWith("!folders!")) continue;
          entries.push(
            reuseRecord(d, {
              provider: provider.id,
              version: provider.version,
              pack: pack.name,
            }),
          );
        }
        packs.push({
          provider: provider.id,
          version: provider.version,
          pack: pack.name,
          fingerprint,
          count: names.length,
        });
        console.log(`Indexed ${provider.id}.${pack.name}: ${names.length}`);
      } catch (e) {
        errors.push({
          provider: provider.id,
          pack: pack.name,
          error: e.message.replaceAll(profile.dataPath, "<configured-data>"),
        });
        console.log(`Unavailable reuse pack: ${provider.id}.${pack.name}`);
      }
    }
  entries.sort((a, b) => a.uuid.localeCompare(b.uuid));
  const result = {
    schemaVersion: 1,
    scope:
      "PF1 system and installed module Item packs, excluding this module and explicitly non-PF1 modules; no world-owned compendia",
    packs,
    errors,
    entries,
  };
  await writeFile(
    path.join(root, "index.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      packs: packs.length,
      records: entries.length,
      errors: errors.length,
    }),
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
