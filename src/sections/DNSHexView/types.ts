import { DNSOpcode, RCode } from './mappings';

export interface DNSQuery {
  qName: string;
  qType: number;
  qClass: number;
}

export interface DNSAnswer {
  name: string;
  type: number;
  class: number;
  ttl: number;
  rdLength: number;
  rdData: string;
}

export interface DNSPacket {
  id?: number;
  qr?: 'Req' | 'Res';
  op?: DNSOpcode;
  authoritative?: boolean;
  truncated?: boolean;
  recursionDesired?: boolean;
  recursionAvailable?: boolean;
  resultCode?: RCode;
  queryCount?: number;
  answerCount?: number;
  nameserverCount?: number;
  additionalRecordCount?: number;
  queries: DNSQuery[];
  answers: DNSAnswer[];
}
