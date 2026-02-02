export class Entry {
  constructor(private find: string | RegExp, private replacement: string) {}
  match(filePath: string) {
    if (typeof this.find === "string") {
      return filePath.startsWith(this.find);
    } else {
      return this.find.test(filePath);
    }
  }
  replace(filePath: string) {
    return filePath.replace(this.find, this.replacement) + ".js";
  }
}
