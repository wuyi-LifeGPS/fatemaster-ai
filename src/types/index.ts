export interface BaziInfo {
  year: string;
  month: string;
  day: string;
  hour: string;
  yearGan: string;
  yearZhi: string;
  monthGan: string;
  monthZhi: string;
  dayGan: string;
  dayZhi: string;
  hourGan: string;
  hourZhi: string;
  yinYang: string;
  wuXing: string;
  nayin: string;
  shiShen: string[];
  tenGods: Record<string, string>;
  wuXingCount: Record<string, number>;
  dayMaster: string;
}

export interface AnalyzeRequest {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthTime: string;
  birthPlace?: string;
  analysisType: 'bazi' | 'daily' | 'relationship';
}

export interface DailyFortune {
  date: string;
  overall: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
  advice: string;
  luckyColor: string;
  luckyNumber: string;
  luckyDirection: string;
}
