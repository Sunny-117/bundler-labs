export interface AliasOptions {
  entries:
    | {
        [key: string]: string;
      }
    | { find: string | RegExp; replacement: string }[];
}
