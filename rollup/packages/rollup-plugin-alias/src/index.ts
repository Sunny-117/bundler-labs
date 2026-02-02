import { Plugin } from "rollup";
import { AliasOptions } from "./typing";
import { normalizeEntries } from "./utils";

export function alias(options: AliasOptions): Plugin {
  const entries = normalizeEntries(options.entries);
  return {
    name: "alias",
    resolveId(source: string, importer: string | undefined) {
      const entry = entries.find((e) => {
        return e.match(source);
      });
      if (!entry) return source;
      return entry.replace(source);
    },
  };
}
