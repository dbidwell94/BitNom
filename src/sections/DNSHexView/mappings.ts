export enum DNSOpcode {
  Query = 0,
  IQuery = 1,
  Status = 2,
  Unassigned = 3,
  Notify = 4,
  Update = 5,
  DSO = 6,
}

export const DNSOpcodeKeys = Object.values(DNSOpcode)
  .filter((code) => typeof code === 'number')
  .map((code) => Number(code));

console.log(DNSOpcodeKeys);

export enum RCode {
  NoErr = 0,
  FmtErr = 1,
  SvrErr = 2,
  NmErr = 3,
  NtImpl = 4,
  Refuse = 5,
}

export const RCodeKeys = Object.values(RCode)
  .filter((code) => typeof code === 'number')
  .map((code) => Number(code));
