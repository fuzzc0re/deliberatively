// Class representing a Rust-compatible enum, since enums are only strings or
// numbers in pure JS
export abstract class Enum {
  enum: string;
  // eslint-disable-next-line
  constructor(properties: Record<string, any>) {
    if (Object.keys(properties).length !== 1) {
      throw new Error("Enum can only take single value");
    }
    this.enum = "";
    Object.keys(properties).forEach((key) => {
      this.enum = key;
    });
  }
}
