export const uuidv4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // tslint:disable-next-line: no-bitwise
    const r = (window.crypto.getRandomValues(new Uint32Array(1))[0] * Math.pow(2, -32) * 16) | 0;
    // tslint:disable-next-line: no-bitwise
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
