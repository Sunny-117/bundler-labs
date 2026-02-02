import { Entry } from "./entry";
import { AliasOptions } from "./typing";

export function normalizeEntries(enties: AliasOptions["entries"]) {
  if (Array.isArray(enties)) {
    return enties.map(({ find, replacement }) => {
      return new Entry(find, replacement);
    });
  } else {
    return Object.keys(enties).map((key) => {
      return new Entry(key, enties[key]);
    });
  }
}
