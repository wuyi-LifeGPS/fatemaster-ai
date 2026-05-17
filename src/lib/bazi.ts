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

// 地支藏干（本气、中气、余气）
const DI_ZHI_CANG_GAN: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

export function getWuXing(ganZhi: string): string {
  return WU_XING[ganZhi] || '未知';
}

export function getYinYang(ganZhi: string): string {
  return YIN_YANG[ganZhi] || '未知';
}

export function getShiShen(dayMaster: string, target: string): string {
  // 对天干直接查表
  const ganResult = SHI_SHEN_MAP[dayMaster]?.[target];
  if (ganResult) return ganResult;
  
  // 对地支，先查藏干，取本气
  const cangGan = DI_ZHI_CANG_GAN[target];
  if (cangGan && cangGan.length > 0) {
    return SHI_SHEN_MAP[dayMaster]?.[cangGan[0]] || '未知';
  }
  
  return '未知';
}

// 获取地支藏干列表
export function getCangGan(zhi: string): string[] {
  return DI_ZHI_CANG_GAN[zhi] || [];
}

// 获取地支藏干对应的十神
export function getZhiShiShen(dayMaster: string, zhi: string): string[] {
  const cangGan = getCangGan(zhi);
  return cangGan.map(gan => SHI_SHEN_MAP[dayMaster]?.[gan] || '未知');
}

export function calculateBazi(birthDate: string, birthTime: string) {
  // 使用 lunar-javascript 进行精确排盘
  const { Solar, Lunar } = require('lunar-javascript');
  
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour] = birthTime.split(':').map(Number);
  
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  
  // 获取八字四柱（年柱、月柱、日柱、时柱）
  // lunar-javascript 时柱需要传入时辰索引（0=子, 1=丑...11=亥）
  const hourZhiIdx = getHourZhiIndex(hour);
  const bazi = lunar.getBaZi();
  
  // lunar-javascript getBaZi() 返回 [年柱, 月柱, 日柱, 时柱]
  // 但时柱可能按默认子时计算，需要手动替换
  const yearGZ = bazi[0];  // 如 "癸亥"
  const monthGZ = bazi[1]; // 如 "壬戌"
  const dayGZ = bazi[2];   // 如 "庚辰"
  
  // 计算正确的时柱
  const dayGan = dayGZ[0];
  const hourGan = calculateHourGan(dayGan, hourZhiIdx);
  const hourZhi = DI_ZHI[hourZhiIdx];
  
  const pillars = [
    { name: '年柱', gan: yearGZ[0], zhi: yearGZ[1] },
    { name: '月柱', gan: monthGZ[0], zhi: monthGZ[1] },
    { name: '日柱', gan: dayGZ[0], zhi: dayGZ[1] },
    { name: '时柱', gan: hourGan, zhi: hourZhi },
  ];

  const dayMaster = dayGZ[0];

  // 五行统计（天干+地支藏干本气）
  const wuXingCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  
  // 统计天干五行
  pillars.forEach(p => {
    const wx = WU_XING[p.gan];
    if (wx) wuXingCount[wx]++;
  });
  
  // 统计地支藏干本气五行（只算本气，避免重复过多）
  pillars.forEach(p => {
    const cangGan = getCangGan(p.zhi);
    if (cangGan.length > 0) {
      const wx = WU_XING[cangGan[0]];
      if (wx) wuXingCount[wx]++;
    }
  });

  // 十神映射（天干直接查，地支查本气藏干）
  const tenGods: Record<string, string> = {};
  pillars.forEach(p => {
    // 天干十神
    if (p.gan !== dayMaster) {
      tenGods[p.gan] = getShiShen(dayMaster, p.gan);
    }
    // 地支十神（取本气藏干）
    const cangGan = getCangGan(p.zhi);
    if (cangGan.length > 0) {
      tenGods[p.zhi] = getShiShen(dayMaster, cangGan[0]);
    }
  });

  return {
    pillars,
    dayMaster,
    wuXingCount,
    tenGods,
    yinYang: getYinYang(dayMaster),
    wuXing: getWuXing(dayMaster),
    // 额外信息供分析使用
    cangGanInfo: pillars.map(p => ({
      name: p.name,
      zhi: p.zhi,
      cangGan: getCangGan(p.zhi),
      cangGanShiShen: getZhiShiShen(dayMaster, p.zhi),
    })),
  };
}

// 根据小时获取地支时辰索引（0=子，1=丑...11=亥）
function getHourZhiIndex(hour: number): number {
  // 中国传统时辰划分
  if (hour >= 23 || hour < 1) return 0;  // 子 23:00-01:00
  if (hour >= 1 && hour < 3) return 1;    // 丑 01:00-03:00
  if (hour >= 3 && hour < 5) return 2;    // 寅 03:00-05:00
  if (hour >= 5 && hour < 7) return 3;    // 卯 05:00-07:00
  if (hour >= 7 && hour < 9) return 4;    // 辰 07:00-09:00
  if (hour >= 9 && hour < 11) return 5;   // 巳 09:00-11:00
  if (hour >= 11 && hour < 13) return 6;  // 午 11:00-13:00
  if (hour >= 13 && hour < 15) return 7; // 未 13:00-15:00
  if (hour >= 15 && hour < 17) return 8; // 申 15:00-17:00
  if (hour >= 17 && hour < 19) return 9; // 酉 17:00-19:00
  if (hour >= 19 && hour < 21) return 10; // 戌 19:00-21:00
  return 11; // 亥 21:00-23:00
}

// 根据日干和时辰索引计算时干
// 口诀：甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
function calculateHourGan(dayGan: string, hourZhiIdx: number): string {
  const ziShiGanMap: Record<string, number> = {
    '甲': 0, '己': 0,  // 甲己日子时=甲子(甲=0)
    '乙': 2, '庚': 2,  // 乙庚日子时=丙子(丙=2)
    '丙': 4, '辛': 4,  // 丙辛日子时=戊子(戊=4)
    '丁': 6, '壬': 6,  // 丁壬日子时=庚子(庚=6)
    '戊': 8, '癸': 8,  // 戊癸日子时=壬子(壬=8)
  };
  
  const baseGanIdx = ziShiGanMap[dayGan];
  if (baseGanIdx === undefined) return '?';
  
  const ganIdx = (baseGanIdx + hourZhiIdx) % 10;
  return TIAN_GAN[ganIdx];
}

// 兼容旧接口的辅助函数
export function calculateYearPillar(year: number): [string, string] {
  const ganIdx = (year - 4) % 10;
  const zhiIdx = (year - 4) % 12;
  return [TIAN_GAN[ganIdx], DI_ZHI[zhiIdx]];
}

export function calculateDayPillar(date: Date): [string, string] {
  const { Solar } = require('lunar-javascript');
  const solar = Solar.fromDate(date);
  const gz = solar.getLunar().getDayInGanZhi();
  return [gz[0], gz[1]];
}
