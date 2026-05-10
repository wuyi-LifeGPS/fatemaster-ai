const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const WU_XING: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
  '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};
const YIN_YANG: Record<string, string> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴',
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};
const SHI_SHEN_MAP: Record<string, Record<string, string>> = {
  '甲': {'甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印'},
  '乙': {'甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印'},
  '丙': {'甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官'},
  '丁': {'甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀'},
  '戊': {'甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财'},
  '己': {'甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财'},
  '庚': {'甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官'},
  '辛': {'甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神'},
  '壬': {'甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财'},
  '癸': {'甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩'}
};

// 已知日柱表（1900-2100简化版，实际用算法更精确）
const BASE_DATE = new Date(1900, 0, 31); // 1900年1月31日 = 甲辰日

function getDaysDiff(date: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((date.getTime() - BASE_DATE.getTime()) / msPerDay);
}

function getGanZhi(offset: number): [string, string] {
  const gan = TIAN_GAN[offset % 10];
  const zhi = DI_ZHI[offset % 12];
  return [gan, zhi];
}

export function calculateYearPillar(year: number): [string, string] {
  // 立春前算上一年，简化处理：直接按年份
  const ganIdx = (year - 4) % 10;
  const zhiIdx = (year - 4) % 12;
  return [TIAN_GAN[ganIdx], DI_ZHI[zhiIdx]];
}

export function calculateMonthPillar(yearGan: string, month: number): [string, string] {
  // 年干定月干起点
  const yearGanIdx = TIAN_GAN.indexOf(yearGan);
  const monthGanBase = [2, 14, 26, 38, 50, 62, 74, 86, 98, 110][yearGanIdx]; // 寅月天干起点
  const monthGanIdx = (monthGanBase + month - 1) % 10;
  const zhiIdx = (month + 1) % 12; // 正月=寅
  return [TIAN_GAN[monthGanIdx], DI_ZHI[zhiIdx]];
}

export function calculateDayPillar(date: Date): [string, string] {
  const daysDiff = getDaysDiff(date);
  return getGanZhi(daysDiff);
}

export function calculateHourPillar(dayGan: string, hour: number): [string, string] {
  const hourZhiMap: Record<number, string> = {
    0: '子', 1: '丑', 2: '丑', 3: '寅', 4: '寅', 5: '卯', 6: '卯', 7: '辰', 8: '辰', 9: '巳', 10: '巳',
    11: '午', 12: '午', 13: '未', 14: '未', 15: '申', 16: '申', 17: '酉', 18: '酉', 19: '戌', 20: '戌', 21: '亥', 22: '亥', 23: '子'
  };
  const dayGanIdx = TIAN_GAN.indexOf(dayGan);
  const zhi = hourZhiMap[hour] || '子';
  const zhiIdx = DI_ZHI.indexOf(zhi);
  // 日干定子时天干
  const shiGanBase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9][dayGanIdx]; // 简化
  const ganIdx = (shiGanBase + zhiIdx) % 10;
  return [TIAN_GAN[ganIdx], zhi];
}

export function getWuXing(ganZhi: string): string {
  return WU_XING[ganZhi] || '未知';
}

export function getYinYang(ganZhi: string): string {
  return YIN_YANG[ganZhi] || '未知';
}

export function getShiShen(dayMaster: string, target: string): string {
  return SHI_SHEN_MAP[dayMaster]?.[target] || '未知';
}

export function calculateBazi(birthDate: string, birthTime: string) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour] = birthTime.split(':').map(Number);
  const date = new Date(year, month - 1, day);

  const [yearGan, yearZhi] = calculateYearPillar(year);
  const [monthGan, monthZhi] = calculateMonthPillar(yearGan, month);
  const [dayGan, dayZhi] = calculateDayPillar(date);
  const [hourGan, hourZhi] = calculateHourPillar(dayGan, hour);

  const pillars = [
    { name: '年柱', gan: yearGan, zhi: yearZhi },
    { name: '月柱', gan: monthGan, zhi: monthZhi },
    { name: '日柱', gan: dayGan, zhi: dayZhi },
    { name: '时柱', gan: hourGan, zhi: hourZhi },
  ];

  const wuXingCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  const allGanZhi = [yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, hourGan, hourZhi];
  allGanZhi.forEach(gz => {
    const wx = WU_XING[gz];
    if (wx) wuXingCount[wx]++;
  });

  const tenGods: Record<string, string> = {};
  allGanZhi.forEach(gz => {
    if (gz !== dayGan) {
      tenGods[gz] = getShiShen(dayGan, gz);
    }
  });

  return {
    pillars,
    dayMaster: dayGan,
    wuXingCount,
    tenGods,
    yinYang: getYinYang(dayGan),
    wuXing: getWuXing(dayGan),
  };
}
