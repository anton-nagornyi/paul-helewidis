export const enumToStrings = (status: object): ReadonlyArray<string> => Object.values(status).filter((x) => typeof x === 'string').map((s: string) => s);
