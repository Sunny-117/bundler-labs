import { describe, it, expect } from "vitest";
import { alias } from ".";
describe("alias", () => {
  describe("enties is object", () => {
    it("should replace when match success", () => {
      const aliasObj: any = alias({
        entries: {
          "@": "./utils",
          utils: "./utils",
        },
      });
      expect(aliasObj.resolveId("@/add")).toBe("./utils/add.js");
      expect(aliasObj.resolveId("utils/add")).toBe("./utils/add.js");
    });
    it("should does not replace  when match fail", () => {
      const aliasObj: any = alias({
        entries: {
          "@": "./utils",
        },
      });
      expect(aliasObj.resolveId("!/add")).toBe("!/add");
    });
  });
  describe("entries is array", () => {
    it("should replace when match success", () => {
      const aliasObj: any = alias({
        entries: [
          {
            find: "@",
            replacement: "./utils",
          },
          {
            find: "utils",
            replacement: "./utils",
          },
        ],
      });
      expect(aliasObj.resolveId("utils/add")).toBe("./utils/add.js");
    });
    it("should replace when find is reg", () => {
      const aliasObj: any = alias({
        entries: [{ find: /^(.*)\.js$/, replacement: "$1.alias" }],
      });
      expect(aliasObj.resolveId("add.js")).toBe("add.alias.js");
    });
    it("should replace when match fail", () => {
      const aliasObj: any = alias({
        entries: [
          {
            find: "@",
            replacement: "./utils",
          },
        ],
      });
      expect(aliasObj.resolveId("!/add")).toBe("!/add");
    });
  });
});
