// ===== 天赋分析模块 v2.0 =====
// 融合八字命理 + 霍华德·加德纳多元智能理论
// 基于 DeepSeek "五行十神八维投射模型" 优化算法
// 核心改进：
// 1. 精细化计分：天干+3 / 地支本气+2.5 / 中气余气+1 / 合局+1.5
// 2. 透干通根系数：天干透出+地支有禄/旺根 → 1.2倍加成
// 3. 取消归一化拉平，让真实差异体现
// 4. 支持自测校准系数，用户体感可微调算法

import { getWuXing, getShiShen, SHI_SHEN_MAP, WU_XING } from './bazi'

export interface TalentDimension {
  key: string
  name: string
  label: string
  icon: string
  score: number      // 0-100
  level: '极高' | '高' | '中等' | '一般' | '较弱'
  description: string
  strengths: string[]
  dailySigns: string[]  // 日常行为对照
}

export interface SelfTestResult {
  linguistic: number    // -10 ~ +10  校准偏移
  logical: number
  spatial: number
  bodily: number
  musical: number
  interpersonal: number
  intrapersonal: number
  naturalist: number
}

export interface TalentResult {
  dimensions: TalentDimension[]
  top3: string[]
  dominantType: string
  careerSuggestions: CareerSuggestion[]
  lifeAdvice: string
  patternDescription: string
  rawScores: Record<string, number>  // 原始分数（调试用）
  selfTestApplied: boolean          // 是否应用了自测校准
}

export interface CareerSuggestion {
  field: string
  roles: string[]
  reason: string
  matchScore: number
}

// ===== 八维智能的五行十神映射表（DeepSeek 版） =====
// 核心五行 + 主导十神 + 补充十神 → 对应智能维度
const DIMENSION_CORE_MAP: Record<string, {
  coreWx: string[]      // 核心五行
  mainSS: string[]       // 主导十神
  subSS: string[]        // 补充十神
  desc: string
}> = {
  linguistic: {
    coreWx: ['水'],
    mainSS: ['食神', '伤官'],
    subSS: ['正印', '偏印'],
    desc: '水主智与流动，食伤主表达与输出，印星主词汇积累',
  },
  logical: {
    coreWx: ['金'],
    mainSS: ['七杀', '正官'],
    subSS: ['伤官'],
    desc: '金主义，主规则与切割；官杀主逻辑推理与问题解决',
  },
  spatial: {
    coreWx: ['火'],
    mainSS: ['食神', '伤官'],
    subSS: ['偏印'],
    desc: '火主影像与光感，伤官主想象力，偏印主独特的空间感知',
  },
  bodily: {
    coreWx: ['木'],
    mainSS: ['比肩', '劫财'],
    subSS: ['七杀'],
    desc: '木主肢体与韧性，比劫主身体动能与实操能力',
  },
  musical: {
    coreWx: ['水'],
    mainSS: ['食神'],
    subSS: ['正印'],
    desc: '水润下，有声波之象；食神主艺术才情与韵律感',
  },
  interpersonal: {
    coreWx: ['火'],
    mainSS: ['正财', '偏财'],
    subSS: ['比肩'],
    desc: '火主礼与社交，财星主为人处世与资源交换',
  },
  intrapersonal: {
    coreWx: ['土'],
    mainSS: ['正印', '偏印'],
    subSS: ['正官'],
    desc: '土主信与反思，印星主内化思考与自我观照',
  },
  naturalist: {
    coreWx: ['木', '土'],
    mainSS: ['偏印'],
    subSS: ['食神'],
    desc: '木主万物生长，土主大地承载，偏印主对非传统领域的洞察',
  },
}

// ===== 五行 → 各智能维度的基础贡献（权重微调） =====
const WX_TO_INTELLIGENCE: Record<string, Record<string, number>> = {
  '木': {
    linguistic: 5, logical: 3, spatial: 4, bodily: 9,     // 木主肢体 → 动觉高
    musical: 5, interpersonal: 5, intrapersonal: 4, naturalist: 9,  // 木主自然 → 自然高
  },
  '火': {
    linguistic: 6, logical: 4, spatial: 7, bodily: 4,   // 火主影像 → 空间高
    musical: 6, interpersonal: 9, intrapersonal: 5, naturalist: 4,   // 火主礼 → 人际高
  },
  '土': {
    linguistic: 3, logical: 5, spatial: 5, bodily: 3,
    musical: 3, interpersonal: 6, intrapersonal: 9, naturalist: 7,    // 土主反思 → 内省高
  },
  '金': {
    linguistic: 3, logical: 10, spatial: 7, bodily: 4,   // 金主精准 → 逻辑高
    musical: 5, interpersonal: 3, intrapersonal: 5, naturalist: 3,
  },
  '水': {
    linguistic: 9, logical: 5, spatial: 6, bodily: 3,    // 水主智 → 语言高
    musical: 9, interpersonal: 5, intrapersonal: 6, naturalist: 5,     // 水主韵律 → 音乐高
  },
}

// ===== 十神 → 各智能维度加成 =====
const SHI_SHEN_TO_INTELLIGENCE: Record<string, Record<string, number>> = {
  '食神': {
    linguistic: 4, musical: 5, interpersonal: 2, bodily: 2,
    logical: 1, spatial: 2, intrapersonal: 2, naturalist: 2,
  },
  '伤官': {
    linguistic: 5, spatial: 3, interpersonal: 1,
    logical: 2, musical: 2, bodily: 1, intrapersonal: 1, naturalist: 1,
  },
  '正财': {
    interpersonal: 5, logical: 3, intrapersonal: 2,
    linguistic: 1, musical: 1, spatial: 1, bodily: 1, naturalist: 1,
  },
  '偏财': {
    interpersonal: 5, logical: 2, musical: 2,
    linguistic: 2, spatial: 2, bodily: 2, intrapersonal: 1, naturalist: 2,
  },
  '正官': {
    logical: 5, interpersonal: 3, intrapersonal: 3,
    linguistic: 1, spatial: 1, musical: 1, bodily: 1, naturalist: 1,
  },
  '七杀': {
    logical: 4, bodily: 5, spatial: 3, interpersonal: 2,  // 七杀主行动力 → 动觉高
    linguistic: 1, musical: 1, intrapersonal: 2, naturalist: 2,
  },
  '正印': {
    intrapersonal: 5, linguistic: 4, logical: 3, musical: 2,
    spatial: 1, bodily: 1, interpersonal: 2, naturalist: 2,
  },
  '偏印': {
    intrapersonal: 5, spatial: 4, logical: 3, musical: 2, naturalist: 3,
    linguistic: 2, bodily: 1, interpersonal: 1,
  },
  '比肩': {
    bodily: 5, interpersonal: 3, naturalist: 2,  // 比肩主身体动能 → 动觉高
    linguistic: 1, logical: 1, spatial: 1, musical: 1, intrapersonal: 1,
  },
  '劫财': {
    bodily: 4, interpersonal: 3, logical: 2,
    linguistic: 1, spatial: 1, musical: 1, intrapersonal: 1, naturalist: 1,
  },
}

// ===== 地支 → 五行（地支本身） =====
const ZHI_WU_XING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
}

// ===== 地支藏干 =====
const ZHI_CANG_GAN: Record<string, string[]> = {
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
}

// ===== 地支三合局 =====
const SAN_HE: string[][] = [
  ['申', '子', '辰'], // 水局
  ['寅', '午', '戌'], // 火局
  ['亥', '卯', '未'], // 木局
  ['巳', '酉', '丑'], // 金局
]

// ===== 地支三会局 =====
const SAN_HUI: string[][] = [
  ['寅', '卯', '辰'], // 东方木
  ['巳', '午', '未'], // 南方火
  ['申', '酉', '戌'], // 西方金
  ['亥', '子', '丑'], // 北方水
]

// ===== 地支六合 =====
const LIU_HE: Record<string, string> = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午',
}

// ===== 十二长生（判断禄/旺） =====
// 禄 = 临官，旺 = 帝旺
const SHI_ER_CHANG_SHENG: Record<string, Record<string, string>> = {
  '甲': { '子': '沐浴', '丑': '冠带', '寅': '临官', '卯': '帝旺', '辰': '衰', '巳': '病', '午': '死', '未': '墓', '申': '绝', '酉': '胎', '戌': '养', '亥': '长生' },
  '乙': { '子': '病', '丑': '衰', '寅': '帝旺', '卯': '临官', '辰': '冠带', '巳': '沐浴', '午': '长生', '未': '养', '申': '胎', '酉': '绝', '戌': '墓', '亥': '死' },
  '丙': { '子': '胎', '丑': '养', '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝' },
  '丁': { '子': '绝', '丑': '墓', '寅': '死', '卯': '病', '辰': '衰', '巳': '帝旺', '午': '临官', '未': '冠带', '申': '沐浴', '酉': '长生', '戌': '养', '亥': '胎' },
  '戊': { '子': '胎', '丑': '养', '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝' },
  '己': { '子': '绝', '丑': '墓', '寅': '死', '卯': '病', '辰': '衰', '巳': '帝旺', '午': '临官', '未': '冠带', '申': '沐浴', '酉': '长生', '戌': '养', '亥': '胎' },
  '庚': { '子': '死', '丑': '墓', '寅': '绝', '卯': '胎', '辰': '养', '巳': '长生', '午': '沐浴', '未': '冠带', '申': '临官', '酉': '帝旺', '戌': '衰', '亥': '病' },
  '辛': { '子': '长生', '丑': '养', '寅': '胎', '卯': '绝', '辰': '墓', '巳': '死', '午': '病', '未': '衰', '申': '帝旺', '酉': '临官', '戌': '冠带', '亥': '沐浴' },
  '壬': { '子': '帝旺', '丑': '衰', '寅': '病', '卯': '死', '辰': '墓', '巳': '绝', '午': '胎', '未': '养', '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官' },
  '癸': { '子': '临官', '丑': '冠带', '寅': '沐浴', '卯': '长生', '辰': '养', '巳': '胎', '午': '绝', '未': '墓', '申': '死', '酉': '病', '戌': '衰', '亥': '帝旺' },
}

// ===== 智能维度元数据 =====
const DIMENSION_META: Record<string, { name: string; label: string; icon: string; desc: string; dailySigns: string[] }> = {
  linguistic:     { name: '语言智能',     label: '语言',     icon: '🗣️', desc: '对文字和语言高度敏感，擅长表达、写作、沟通与说服。这类人往往是朋友圈里"最会接话"的人。', dailySigns: ['喜欢阅读，能轻松记住新词和名字','喜欢文字游戏、双关语、绕口令','写作文或发朋友圈比其他人更顺手','擅长把复杂概念讲成大白话'] },
  logical:        { name: '逻辑数学智能', label: '逻辑数学', icon: '🧮', desc: '逻辑推理清晰，擅长找规律、做分析、拆解系统。遇到问题时，第一反应是"先理清楚因果关系"。', dailySigns: ['喜欢问"为什么"，对因果关系着迷','擅长策略类游戏（象棋、围棋、数独）','看到数据就想分析、找规律','做事喜欢列步骤、做流程图'] },
  spatial:        { name: '空间智能',     label: '空间',     icon: '🎯', desc: '脑中能清晰构建三维画面，对颜色、形状、空间位置敏感。看地图比看文字更舒服，迷路概率较低。', dailySigns: ['脑中能"看见"画面，比如回忆房间布局','喜欢看地图、建筑图纸、室内设计','对色彩、穿搭、视觉效果有直觉判断','玩拼图、乐高、迷宫类游戏很顺手'] },
  bodily:         { name: '身体动觉智能', label: '身体动觉', icon: '⚡', desc: '身体协调性好，动作学习与模仿能力强。闲不住，通过"动起来"来思考和学习。', dailySigns: ['喜欢运动、舞蹈、手工、拆装东西','学新动作时看一遍就能模仿','聊天时喜欢用手势辅助表达','坐着开会容易走神，走动时思路更活跃'] },
  musical:        { name: '音乐智能',     label: '音乐',     icon: '🎵', desc: '对音律、节奏、音色敏感。听几遍歌就能哼出旋律，能分辨出不同乐器的声音。', dailySigns: ['听几遍歌就能记住旋律和节奏','走路、工作时无意识打拍子或哼歌','能分辨出音高差异和不同乐器音色','喜欢音乐，对声音环境很敏感'] },
  interpersonal:  { name: '人际智能',     label: '人际',     icon: '🤝', desc: '善于察言观色，能敏锐感知他人情绪和需求。在人群中如鱼得水，是天然的"气氛调节者"。', dailySigns: ['能敏锐察觉别人的情绪变化','喜欢组织活动、召集朋友聚会','擅长调解矛盾、撮合合作','聊天时能让对方感到被理解和重视'] },
  intrapersonal:  { name: '自省智能',     label: '自省',     icon: '🧘', desc: '自我觉察深刻，喜欢独处和思考。对自己想要什么、不想要什么，有清晰的内在坐标。', dailySigns: ['喜欢独处、写日记或反思复盘','对自己优缺点有清醒认知','做决定时先问"这是我真正想要的吗"','能从过去的成功和失败中总结经验'] },
  naturalist:     { name: '自然智能',     label: '自然',     icon: '🌿', desc: '对自然界的规律和生命现象敏感。喜欢动植物、观察环境变化，能从大自然中获得能量。', dailySigns: ['喜欢养植物、宠物，或观察昆虫鸟类','能注意到季节、天气的细微变化','在户外（公园、山林、海边）感到放松和充电','对生物、地理、天文等自然知识感兴趣'] },
}

// ===== 职业建议库 =====
const CAREER_LIBRARY: Record<string, CareerSuggestion[]> = {
  linguistic: [
    { field: '内容创作', roles: ['作家', '编剧', '自媒体人', '文案策划'], reason: '文字是你的天然武器，表达欲旺盛', matchScore: 95 },
    { field: '教育传播', roles: ['教师', '培训师', '主播', '主持人'], reason: '善于把复杂概念讲得通俗易懂', matchScore: 90 },
    { field: '法律政务', roles: ['律师', '外交官', '公关', '翻译'], reason: '语言逻辑缜密，擅长说服与辩论', matchScore: 85 },
  ],
  logical: [
    { field: '科技研发', roles: ['软件工程师', '数据科学家', '算法工程师', '研究员'], reason: '抽象思维和逻辑推演是你的主场', matchScore: 95 },
    { field: '金融分析', roles: ['量化分析师', '精算师', '投资顾问', '风控'], reason: '擅长数字敏感度与风险评估', matchScore: 90 },
    { field: '医疗健康', roles: ['外科医生', '药剂师', '医学研究员'], reason: '精准、冷静、系统性思维', matchScore: 85 },
  ],
  spatial: [
    { field: '设计创意', roles: ['UI/UX设计师', '建筑师', '室内设计师', '摄影师'], reason: '空间想象力和视觉审美出众', matchScore: 95 },
    { field: '工程建造', roles: ['土木工程师', '机械设计师', '航拍摄影师'], reason: '三维空间感知与结构理解力强', matchScore: 88 },
    { field: '游戏开发', roles: ['3D建模师', '游戏策划', 'VR开发者'], reason: '虚拟空间构建能力突出', matchScore: 85 },
  ],
  bodily: [
    { field: '体育竞技', roles: ['职业运动员', '健身教练', '瑜伽导师', '舞蹈家'], reason: '身体控制力和协调性极佳', matchScore: 95 },
    { field: '表演艺术', roles: ['演员', '特技演员', '舞台表演者'], reason: '肢体表达力强，情感传递精准', matchScore: 90 },
    { field: '手工技艺', roles: ['外科医生', '手工艺人', '厨师', '技师'], reason: '精细动作控制能力优秀', matchScore: 85 },
  ],
  musical: [
    { field: '音乐创作', roles: ['作曲家', '音乐制作人', '编曲', 'DJ'], reason: '旋律感知和创作力强', matchScore: 95 },
    { field: '演奏表演', roles: ['乐器演奏家', '歌手', '乐队成员'], reason: '乐器操控和声音表现力突出', matchScore: 92 },
    { field: '声音相关', roles: ['配音演员', '音频工程师', '声乐教师'], reason: '对音色、音高、节奏的敏感度高', matchScore: 88 },
  ],
  interpersonal: [
    { field: '商业管理', roles: ['企业家', '销售总监', '市场负责人', 'HR'], reason: '识人用人、资源整合能力强', matchScore: 95 },
    { field: '教育咨询', roles: ['心理咨询师', '教练', '教师', '培训师'], reason: '善于理解他人需求、激励他人', matchScore: 92 },
    { field: '社会服务', roles: ['社会工作者', 'HR', '客户关系', '公关'], reason: '同理心强，擅长协调关系', matchScore: 88 },
  ],
  intrapersonal: [
    { field: '学术研究', roles: ['学者', '研究员', '哲学家', '理论物理学家'], reason: '独立思考、深度钻研能力强', matchScore: 95 },
    { field: '心理疗愈', roles: ['心理咨询师', '冥想导师', '生涯规划师'], reason: '自我觉察深刻，善于引导他人内省', matchScore: 92 },
    { field: '独立创作', roles: ['独立作家', '艺术家', '自由职业者', '投资家'], reason: '享受独处，内在驱动力强', matchScore: 90 },
  ],
  naturalist: [
    { field: '生命科学', roles: ['生物学家', '生态学家', '植物学家', '动物行为学家'], reason: '对自然生命系统的观察力敏锐', matchScore: 95 },
    { field: '农业环保', roles: ['农艺师', '园艺师', '环保工程师', '林业专家'], reason: '亲近自然，善于与生态系统互动', matchScore: 90 },
    { field: '自然教育', roles: ['自然导览', '科学教育者', '博物馆策展人'], reason: '善于发现和讲解自然之美', matchScore: 85 },
  ],
}

const COMBO_CAREERS: Record<string, { field: string; roles: string[]; reason: string }[]> = {
  'linguistic+interpersonal': [
    { field: '品牌公关', roles: ['品牌经理', '公关总监', '社群运营'], reason: '语言+人际 = 说服力MAX' },
    { field: '教育培训', roles: ['企业培训师', '知识付费讲师'], reason: '既会讲又懂人' },
  ],
  'logical+spatial': [
    { field: '数据可视化', roles: ['数据可视化专家', 'BI分析师', '信息设计师'], reason: '逻辑+空间 = 用图形讲数据' },
    { field: '工业设计', roles: ['工业设计师', '产品设计师'], reason: '理性结构与美感并重' },
  ],
  'musical+linguistic': [
    { field: '歌词创作', roles: ['作词人', '音乐评论', '播客主持人'], reason: '文字+旋律双通道输出' },
  ],
  'bodily+interpersonal': [
    { field: '体育教练', roles: ['运动教练', '体能训练师', '团队拓展教练'], reason: '身体+人际 = 带团队做运动' },
  ],
  'intrapersonal+logical': [
    { field: '战略咨询', roles: ['战略顾问', '管理咨询师', '研究员'], reason: '内省+逻辑 = 深度洞察与系统分析' },
  ],
  'naturalist+spatial': [
    { field: '景观设计', roles: ['景观设计师', '生态设计师', '园林规划师'], reason: '自然+空间 = 打造生态空间' },
  ],
}

// ===== 辅助函数：判断地支是否有该天干的禄/旺 =====
function hasLuOrWang(dayMaster: string, zhi: string): boolean {
  const status = SHI_ER_CHANG_SHENG[dayMaster]?.[zhi]
  return status === '临官' || status === '帝旺'
}

// ===== 辅助函数：判断地支是否有该天干的根（藏干含此天干） =====
function hasRootInZhi(gan: string, zhi: string): boolean {
  const cangGan = ZHI_CANG_GAN[zhi] || []
  return cangGan.includes(gan)
}

// ===== 辅助函数：检查三合/三会/六合 =====
function checkHeJu(zhiList: string[]): Record<string, number> {
  const wxBoost: Record<string, number> = {}

  // 检查三合
  SAN_HE.forEach(triplet => {
    const count = triplet.filter(z => zhiList.includes(z)).length
    if (count >= 3) {
      // 水局/火局/木局/金局
      const wxMap: Record<string, string> = {
        '申子辰': '水', '寅午戌': '火', '亥卯未': '木', '巳酉丑': '金',
      }
      const key = triplet.join('')
      const wx = wxMap[key]
      if (wx) wxBoost[wx] = (wxBoost[wx] || 0) + 1.5
    }
  })

  // 检查三会
  SAN_HUI.forEach(triplet => {
    const count = triplet.filter(z => zhiList.includes(z)).length
    if (count >= 3) {
      const wxMap: Record<string, string> = {
        '寅卯辰': '木', '巳午未': '火', '申酉戌': '金', '亥子丑': '水',
      }
      const key = triplet.join('')
      const wx = wxMap[key]
      if (wx) wxBoost[wx] = (wxBoost[wx] || 0) + 1.5
    }
  })

  // 检查六合（两两地支）
  const uniqueZhi = Array.from(new Set(zhiList))
  for (let i = 0; i < uniqueZhi.length; i++) {
    for (let j = i + 1; j < uniqueZhi.length; j++) {
      const z1 = uniqueZhi[i]
      const z2 = uniqueZhi[j]
      if (LIU_HE[z1] === z2) {
        // 六合加强对应五行（简化：子丑合土、寅亥合木、卯戌合火、辰酉合金、巳申合水、午未合土）
        const heWuXing: Record<string, string> = {
          '子丑': '土', '寅亥': '木', '卯戌': '火', '辰酉': '金', '巳申': '水', '午未': '土',
        }
        const key = [z1, z2].sort().join('')
        const wx = heWuXing[key]
        if (wx) wxBoost[wx] = (wxBoost[wx] || 0) + 1.5
      }
    }
  }

  return wxBoost
}

// ===== 核心计算函数 v2.0 =====
export function analyzeTalent(
  bazi: {
    pillars: { name: string; gan: string; zhi: string }[]
    dayMaster: string
    wuXingFullCount: Record<string, number>
    tenGods: Record<string, string>
    cangGanDetail?: { name: string; zhi: string; cangGan: { gan: string; qi: string; wuXing: string; shiShen: string }[] }[]
    bodyStrength?: any
    pattern?: any
  },
  selfTest?: SelfTestResult  // 可选的自测校准
): TalentResult {
  const { pillars, dayMaster, wuXingFullCount, tenGods, cangGanDetail } = bazi
  const dimensionKeys = ['linguistic', 'logical', 'spatial', 'bodily', 'musical', 'interpersonal', 'intrapersonal', 'naturalist']

  // ========== 原始分数（DeepSeek 精细化计分） ==========
  const rawScores: Record<string, number> = {}
  dimensionKeys.forEach(k => rawScores[k] = 0)

  // ---- 1. 天干透出计分（天干直接出现，力度最强） ----
  // 年干、月干、时干（日干是日主，不计入）
  pillars.forEach(p => {
    if (p.name === '日柱') return  // 日主单独处理
    const ganWx = WU_XING[p.gan]
    const ganSS = SHI_SHEN_MAP[dayMaster]?.[p.gan] || ''

    dimensionKeys.forEach(dim => {
      const core = DIMENSION_CORE_MAP[dim]
      let score = 0

      // 五行匹配
      if (core.coreWx.includes(ganWx)) {
        score += 3
      }
      // 主导十神匹配
      if (core.mainSS.includes(ganSS)) {
        score += 3
      }
      // 补充十神匹配
      if (core.subSS.includes(ganSS)) {
        score += 1.5
      }

      rawScores[dim] += score
    })
  })

  // ---- 2. 地支藏干计分（本气>中气>余气） ----
  if (cangGanDetail) {
    cangGanDetail.forEach(cg => {
      cg.cangGan.forEach((item, idx) => {
        const multiplier = idx === 0 ? 2.5 : idx === 1 ? 1.0 : 1.0  // 本气2.5，中气余气各1
        const wx = item.wuXing
        const ss = item.shiShen

        dimensionKeys.forEach(dim => {
          const core = DIMENSION_CORE_MAP[dim]
          let score = 0

          if (core.coreWx.includes(wx)) score += multiplier
          if (core.mainSS.includes(ss)) score += multiplier
          if (core.subSS.includes(ss)) score += multiplier * 0.5

          rawScores[dim] += score
        })
      })
    })
  }

  // ---- 3. 地支合局加成（三合/三会/六合） ----
  const zhiList = pillars.map(p => p.zhi)
  const heJuBoost = checkHeJu(zhiList)
  Object.entries(heJuBoost).forEach(([wx, boost]) => {
    dimensionKeys.forEach(dim => {
      const core = DIMENSION_CORE_MAP[dim]
      if (core.coreWx.includes(wx)) {
        rawScores[dim] += boost
      }
    })
  })

  // ---- 4. 日主天干加成（先天底色） ----
  const dmWx = WU_XING[dayMaster]
  dimensionKeys.forEach(dim => {
    const weights = WX_TO_INTELLIGENCE[dmWx]
    if (weights) {
      rawScores[dim] += (weights[dim] || 0) * 0.3  // 降低系数，避免日主权重过大
    }
  })

  // ---- 5. 格局加成 ----
  const patternType = bazi.pattern?.patternType || ''
  const patternBonus: Record<string, Record<string, number>> = {
    '食神': { linguistic: 3, musical: 3, interpersonal: 2 },
    '伤官': { linguistic: 4, musical: 2, spatial: 2, logical: 2 },
    '正财': { interpersonal: 4, logical: 2 },
    '偏财': { interpersonal: 4, musical: 2, naturalist: 2 },
    '正官': { logical: 4, intrapersonal: 2, interpersonal: 2 },
    '七杀': { logical: 3, bodily: 4, spatial: 3 },  // 七杀主行动力
    '正印': { intrapersonal: 4, linguistic: 3, logical: 2 },
    '偏印': { intrapersonal: 4, spatial: 3, logical: 2, naturalist: 2 },
    '比肩': { bodily: 4, interpersonal: 2, naturalist: 2 },  // 比肩主身体动能
    '劫财': { bodily: 3, interpersonal: 3, logical: 2 },
  }
  const pb = patternBonus[patternType]
  if (pb) {
    Object.entries(pb).forEach(([intel, bonus]) => {
      if (rawScores[intel] !== undefined) rawScores[intel] += bonus
    })
  }

  // ---- 6. 透干通根系数（1.2倍加成） ----
  // 检查每个天干：是否在天干透出 + 在地支有禄/旺根
  const touGanRoots: Record<string, boolean> = {} // 维度 -> 是否通根

  // 遍历天干（除日主）
  pillars.forEach(p => {
    if (p.name === '日柱') return
    const gan = p.gan
    const ganSS = SHI_SHEN_MAP[dayMaster]?.[gan] || ''

    // 检查该天干在地支是否有根（禄/旺）
    let hasStrongRoot = false
    pillars.forEach(p2 => {
      if (hasLuOrWang(gan, p2.zhi)) hasStrongRoot = true
    })
    // 另外检查藏干中是否包含此天干
    if (!hasStrongRoot) {
      pillars.forEach(p2 => {
        const cangGan = ZHI_CANG_GAN[p2.zhi] || []
        if (cangGan.includes(gan)) hasStrongRoot = true
      })
    }

    if (hasStrongRoot) {
      // 给该十神对应的所有维度加 1.2 系数
      dimensionKeys.forEach(dim => {
        const core = DIMENSION_CORE_MAP[dim]
        if (core.mainSS.includes(ganSS) || core.subSS.includes(ganSS)) {
          rawScores[dim] *= 1.15  // 通根系数 1.15（不是1.2，避免过度膨胀）
        }
      })
    }
  })

  // ---- 7. 日主强弱调和（微调） ----
  if (bazi.bodyStrength?.strength === '强') {
    rawScores.interpersonal += 1.5
    rawScores.linguistic += 1
    rawScores.bodily += 1.5
  } else if (bazi.bodyStrength?.strength === '偏弱') {
    rawScores.intrapersonal += 1.5
    rawScores.logical += 1
    rawScores.musical += 1
  }

  // ---- 8. 自测校准（如果提供了） ----
  let selfTestApplied = false
  if (selfTest) {
    selfTestApplied = true
    dimensionKeys.forEach(dim => {
      const calibration = selfTest[dim as keyof SelfTestResult] || 0
      // 校准量：每1分自测偏移 ≈ 1.5分原始分偏移
      rawScores[dim] += calibration * 1.5
    })
  }

  // ---- 9. 映射到 0-100 分制（线性映射，保留差异） ----
  // 找到原始分数的范围
  const allRaw = Object.values(rawScores)
  const maxRaw = Math.max(...allRaw)
  const minRaw = Math.min(...allRaw)
  const range = maxRaw - minRaw

  // 映射参数：最低分不低于20，最高分不超过95，保留真实差异比例
  const targetMin = 22
  const targetMax = 92

  const scores: Record<string, number> = {}
  dimensionKeys.forEach(key => {
    if (range > 0) {
      const normalized = targetMin + (rawScores[key] - minRaw) / range * (targetMax - targetMin)
      scores[key] = Math.round(Math.min(95, Math.max(18, normalized)))
    } else {
      scores[key] = 50
    }
  })

  // 构建维度结果
  const dimensions: TalentDimension[] = dimensionKeys.map(key => {
    const score = scores[key]
    const meta = DIMENSION_META[key]
    let level: TalentDimension['level']
    if (score >= 80) level = '极高'
    else if (score >= 65) level = '高'
    else if (score >= 50) level = '中等'
    else if (score >= 35) level = '一般'
    else level = '较弱'

    return {
      key,
      name: meta.name,
      label: meta.label,
      icon: meta.icon,
      score,
      level,
      description: meta.desc,
      strengths: generateStrengths(key, score, bazi),
      dailySigns: meta.dailySigns,
    }
  })

  // 排序找Top3
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)
  const top3 = sorted.slice(0, 3).map(d => d.key)
  const dominantType = sorted[0].key

  // 职业建议
  const careerSuggestions = generateCareerSuggestions(top3, scores)

  // 人生发展建议
  const lifeAdvice = generateLifeAdvice(top3, scores, bazi)

  // 天赋模式描述
  const patternDescription = generatePatternDescription(top3, scores, bazi)

  return {
    dimensions,
    top3,
    dominantType,
    careerSuggestions,
    lifeAdvice,
    patternDescription,
    rawScores,
    selfTestApplied,
  }
}

function generateStrengths(key: string, score: number, bazi: any): string[] {
  const strengths: string[] = []
  const dm = bazi.dayMaster

  switch (key) {
    case 'linguistic':
      if (score >= 70) strengths.push('你是朋友圈里的"接话王"，表达欲和说服力都很强')
      if (['甲', '乙', '壬', '癸'].includes(dm)) strengths.push('对文字有天然的亲近感，写作和表达像呼吸一样自然')
      if (bazi.tenGods && (bazi.tenGods['食神'] || bazi.tenGods['伤官'])) strengths.push('食伤透出，观点鲜明，不喜欢被堵住嘴')
      break
    case 'logical':
      if (score >= 70) strengths.push('遇到问题时先拆解再找规律，逻辑链条很清晰')
      if (['庚', '辛'].includes(dm)) strengths.push('金日主自带精准理性的思维底色，做事讲究章法')
      if (bazi.pattern?.patternType === '正官' || bazi.pattern?.patternType === '七杀') strengths.push('官杀格局赋予你系统性思维和规则意识')
      break
    case 'spatial':
      if (score >= 70) strengths.push('脑中能"看见"三维画面，空间想象力是你的隐性优势')
      if (['壬', '癸'].includes(dm)) strengths.push('水日主天生具有流动的空间感知力，对方向和环境变化敏感')
      break
    case 'bodily':
      if (score >= 70) strengths.push('身体协调性很好，动作学习和模仿能力突出')
      if (['甲', '乙', '寅', '卯'].some(x => dm.includes(x) || bazi.pillars.some((p: any) => p.zhi === x))) {
        strengths.push('木旺赋予你充沛的肢体能量，动起来比坐着更舒服')
      }
      if (bazi.pattern?.patternType === '七杀' || bazi.pattern?.patternType === '比肩') {
        strengths.push('七杀/比肩格局赋予你行动力和身体执行力')
      }
      break
    case 'musical':
      if (score >= 70) strengths.push('对音高、节奏、音色有敏锐辨识力，音乐是你与世界对话的通道')
      if (['丙', '丁', '壬', '癸'].includes(dm)) strengths.push('水火日主往往自带韵律感和节奏感')
      break
    case 'interpersonal':
      if (score >= 70) strengths.push('察言观色能力强，在人群中如鱼得水，天生的"气氛调节者"')
      if (['丙', '丁'].includes(dm)) strengths.push('火日主天生具有感染力和亲和力，社交场合自带光环')
      if (bazi.tenGods && (bazi.tenGods['正财'] || bazi.tenGods['偏财'])) strengths.push('财星透出，懂得价值交换和关系经营')
      break
    case 'intrapersonal':
      if (score >= 70) strengths.push('自我觉察深刻，独处时反而最清醒，内心世界很丰富')
      if (['戊', '己'].includes(dm)) strengths.push('土日主天生沉稳内敛，向内求索是你的本能')
      if (bazi.pattern?.patternType === '正印' || bazi.pattern?.patternType === '偏印') {
        strengths.push('印格赋予你独处时的深度思考能力')
      }
      break
    case 'naturalist':
      if (score >= 70) strengths.push('对自然界的规律有敏锐观察力，亲近自然会让你充满能量')
      if (['甲', '乙'].includes(dm)) strengths.push('木日主天生与植物、生命有深层连接')
      break
  }

  if (strengths.length === 0) {
    if (score >= 60) strengths.push('此维度表现良好，具备进一步开发的潜力')
    else strengths.push('此维度相对普通，但可以通过后天训练提升')
  }

  return strengths
}

function generateCareerSuggestions(top3: string[], scores: Record<string, number>): CareerSuggestion[] {
  const suggestions: CareerSuggestion[] = []
  const added = new Set<string>()

  top3.forEach(key => {
    const careers = CAREER_LIBRARY[key]
    if (careers) {
      careers.forEach(c => {
        if (!added.has(c.field)) {
          added.add(c.field)
          suggestions.push({ ...c, matchScore: Math.min(100, c.matchScore + (scores[key] - 70) * 0.5) })
        }
      })
    }
  })

  const comboKey = `${top3[0]}+${top3[1]}`
  const comboCareers = COMBO_CAREERS[comboKey]
  if (comboCareers) {
    comboCareers.forEach(c => {
      if (!added.has(c.field)) {
        added.add(c.field)
        suggestions.push({ ...c, matchScore: 88 })
      }
    })
  }

  return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6)
}

function generateLifeAdvice(top3: string[], scores: Record<string, number>, bazi: any): string {
  const [first, second, third] = top3
  const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0]

  const adviceParts: string[] = []

  const dmAdvice: Record<string, string> = {
    linguistic: '你的语言天赋是核心竞争力。建议多写作、多表达，不必等"准备好了"才开始——你的表达能力本身就是准备。',
    logical: '你的逻辑天赋让你在复杂系统中游刃有余。建议深入一个技术/分析领域做深做透，成为某个细分方向的专家。',
    spatial: '你的空间感知力是稀缺的。建议尝试设计、视觉、建筑或任何需要"看见看不见的东西"的领域。',
    bodily: '你的身体是你最好的工具。不要浪费这份天赋，运动、表演、手工——任何需要身体参与的领域你都可能出彩。',
    musical: '音乐是你与世界对话的方式。即使没有走专业路线，保持与音乐的连接也能持续滋养你的灵魂。',
    interpersonal: '你的人际敏感度是财富。学会用它去连接人、整合资源，而不是仅仅消耗在维护关系上。',
    intrapersonal: '你的内省深度是少数人才有的礼物。建议给自己留出足够的独处时间，那里才是你的能量充电站。',
    naturalist: '你与自然的连接力在现代社会越来越稀缺。多走进自然，那份宁静和观察力会反哺你的所有其他能力。',
  }

  adviceParts.push(`**${DIMENSION_META[first].name}**（${scores[first]}分）：${dmAdvice[first]}`)

  if (scores[second] >= 60) {
    adviceParts.push(`**${DIMENSION_META[second].name}**（${scores[second]}分）：这是你值得信赖的辅助优势，与主导天赋结合会形成独特的竞争力。`)
  }
  if (scores[third] >= 60) {
    adviceParts.push(`**${DIMENSION_META[third].name}**（${scores[third]}分）：第三优势领域，可以作为兴趣深化或跨界融合的切入点。`)
  }

  if (scores[weakest] < 45) {
    const weakName = DIMENSION_META[weakest].name
    adviceParts.push(`**${weakName}**（${scores[weakest]}分）：这是你的相对短板。建议不必强求补齐，而是找到能互补的合作伙伴或工具来弥补。`)
  }

  adviceParts.push(`**人生策略**：以${DIMENSION_META[first].label}能力为根基，以${DIMENSION_META[second].label}能力为翅膀，在需要${DIMENSION_META[third].label}的场景中寻找差异化定位。你不需要成为全能选手，只需要在"最擅长的战场"上持续积累。`)

  return adviceParts.join('\n\n')
}

function generatePatternDescription(top3: string[], scores: Record<string, number>, bazi: any): string {
  const [first, second] = top3
  const dm = bazi.dayMaster
  const wx = WU_XING[dm] || ''
  const yy = bazi.yinYang || ''
  const strength = bazi.bodyStrength?.strength || '中和'

  const patterns: Record<string, string> = {
    'linguistic+interpersonal': '「传播者型」—— 你天生适合把想法传递给更多人，语言是你的桥梁，人际是你的舞台。',
    'linguistic+intrapersonal': '「写作者型」—— 你擅长把内心的世界用文字表达，写作、创作、深度内容是适合你的方向。',
    'logical+spatial': '「架构师型」—— 你能在抽象逻辑和具象空间之间自由切换，适合设计、工程、数据可视化。',
    'logical+intrapersonal': '「战略家型」—— 独立思考+逻辑推演，你适合需要深度分析和独立判断的角色。',
    'musical+linguistic': '「韵律诗人型」—— 文字与旋律的跨界组合，歌词、朗诵、播客、声音设计都是你的舞台。',
    'bodily+interpersonal': '「团队领袖型」—— 身体能量+人际魅力，你在团队中自带气场，适合带队冲锋。',
    'interpersonal+intrapersonal': '「导师型」—— 既懂自己又懂他人，心理咨询、教练、教育是你天然的优势区。',
    'naturalist+spatial': '「生态设计师型」—— 对自然与空间的综合感知，景观、生态、可持续设计是你的方向。',
    'spatial+musical': '「视听艺术家型」—— 空间与声音的组合，影视、游戏、多媒体艺术是你的天赋区。',
    'bodily+spatial': '「运动艺术家型」—— 身体与空间感知的组合，舞蹈、运动、表演、手工技艺都是你的天赋区。',
    'intrapersonal+musical': '「灵魂歌者型」—— 内省深度+音乐感知，你擅长用音乐表达内心，创作型音乐人路线适合你。',
    'naturalist+intrapersonal': '「自然哲人型」—— 自然观察+深度反思，生态学、自然写作、环境哲学是你独特的方向。',
  }

  const comboKey = `${first}+${second}`
  let desc = patterns[comboKey] || `「复合型天赋」—— 你的${DIMENSION_META[first].label}与${DIMENSION_META[second].label}双高，适合跨界融合的领域，不要把自己框死在单一赛道。`

  desc += ` 日主${dm}（${yy}性·${wx}命，${strength}）赋予你${wx === '木' ? '生长的韧性与表达欲' : wx === '火' ? '热情的感染力与行动力' : wx === '土' ? '沉稳的内省力与包容心' : wx === '金' ? '精准的决断力与执行力' : '流动的智慧与适应力'}。`

  return desc
}

// ===== 自测问卷定义 =====
export interface SelfTestQuestion {
  dimension: string
  text: string
  weight: number  // 该问题对维度的影响权重
}

export const SELF_TEST_QUESTIONS: SelfTestQuestion[] = [
  // 语言智能
  { dimension: 'linguistic', text: '你喜欢阅读、写作，或经常被人夸"会说话"', weight: 3 },
  { dimension: 'linguistic', text: '发朋友圈、写东西对你来说很轻松自然', weight: 2 },
  // 逻辑数学
  { dimension: 'logical', text: '你喜欢分析数据、找规律，玩策略游戏很溜', weight: 3 },
  { dimension: 'logical', text: '遇到复杂问题时，你习惯拆解步骤再解决', weight: 2 },
  // 空间智能
  { dimension: 'spatial', text: '你脑中能"看见"画面，方向感不错，很少迷路', weight: 3 },
  { dimension: 'spatial', text: '对色彩搭配、室内布置、设计图有直觉判断', weight: 2 },
  // 身体动觉
  { dimension: 'bodily', text: '你喜欢运动、舞蹈、手工，身体协调性好', weight: 3 },
  { dimension: 'bodily', text: '学新动作看一遍就能模仿，动手能力强', weight: 2 },
  // 音乐智能
  { dimension: 'musical', text: '听几遍歌就能哼出旋律，对节奏敏感', weight: 3 },
  { dimension: 'musical', text: '能分辨不同乐器音色，走路时经常打拍子', weight: 2 },
  // 人际智能
  { dimension: 'interpersonal', text: '你擅长察言观色，组织聚会、撮合合作很自然', weight: 3 },
  { dimension: 'interpersonal', text: '聊天时能让对方感到被理解和重视', weight: 2 },
  // 内省智能
  { dimension: 'intrapersonal', text: '你喜欢独处思考，对自己想要什么很清晰', weight: 3 },
  { dimension: 'intrapersonal', text: '经常复盘反思，能从失败中快速总结经验', weight: 2 },
  // 自然智能
  { dimension: 'naturalist', text: '你喜欢动植物，在户外感到放松充电', weight: 3 },
  { dimension: 'naturalist', text: '能注意到季节、天气的细微变化，对自然知识感兴趣', weight: 2 },
]

// ===== 根据自测答案计算校准系数 =====
export function calculateSelfTestCalibration(answers: Record<string, number>): SelfTestResult {
  // answers: dimension -> 该维度总勾选数（0-5）
  const calibration: Record<string, number> = {}

  Object.entries(answers).forEach(([dim, count]) => {
    // 0-5 映射到 -10 ~ +10
    // 0=没中 → -8（八字可能高估了）
    // 5=全中 → +8（八字可能低估了）
    calibration[dim] = (count - 2.5) * 3.2
  })

  // 确保所有维度都有默认值
  const result: SelfTestResult = {
    linguistic: calibration['linguistic'] || 0,
    logical: calibration['logical'] || 0,
    spatial: calibration['spatial'] || 0,
    bodily: calibration['bodily'] || 0,
    musical: calibration['musical'] || 0,
    interpersonal: calibration['interpersonal'] || 0,
    intrapersonal: calibration['intrapersonal'] || 0,
    naturalist: calibration['naturalist'] || 0,
  }

  return result
}

// ===== AI 分析 Prompt =====
export function buildTalentPrompt(
  bazi: any,
  talentResult: TalentResult,
  name: string,
  gender: string,
): string {
  const dims = talentResult.dimensions.map(d => `${d.name}：${d.score}分（${d.level}）`).join('\n')
  const top3 = talentResult.top3.map(k => DIMENSION_META[k].name).join('、')
  const selfTestNote = talentResult.selfTestApplied ? '（已结合用户自测校准）' : ''

  return [
    '请为以下命主的天赋分析结果进行深度解读：',
    '',
    '【命主信息】',
    `- 姓名：${name || '未提供'}`,
    `- 性别：${gender === 'male' ? '男' : '女'}`,
    `- 日主：${bazi.dayMaster}（${bazi.yinYang}性·${bazi.wuXing}命）`,
    `- 日主强弱：${bazi.bodyStrength?.strength || '未知'}`,
    `- 格局：${bazi.pattern?.patternName || '未知'}`,
    '',
    '【多元智能评估结果】',
    dims,
    '',
    `天赋模式：${talentResult.patternDescription}`,
    '',
    `Top3天赋维度：${top3} ${selfTestNote}`,
    '',
    '【职业建议】',
    talentResult.careerSuggestions.map((c, i) => `${i + 1}. ${c.field}：${c.roles.join('、')}（匹配度${Math.round(c.matchScore)}%）\n   原因：${c.reason}`).join('\n'),
    '',
    '请从以下维度进行深度解读：',
    '',
    '一、天赋模式解读',
    `- 分析命主的Top3天赋组合意味着什么性格底色和行为模式`,
    `- 这种天赋组合在现代社会中的竞争优势和潜在盲区`,
    '',
    '二、事业发展建议',
    `- 基于天赋组合，给出3-5个最适合的职业方向（要具体、现代、可落地）`,
    `- 每个方向给出"为什么适合你"的命理学解释`,
    `- 给出"第一步行动建议"——如果命主现在想开始，具体做什么`,
    '',
    '三、学习与成长策略',
    `- 基于天赋短板，给出"不必补短板，要搭伙伴"的具体建议`,
    `- 给出持续提升Top3天赋的具体方法`,
    '',
    '四、人际关系建议',
    `- 这种天赋模式的人在团队中适合什么角色`,
    `- 与什么天赋类型的人合作最互补`,
    '',
    '五、人生发展路线图',
    `- 短期（1-3年）：聚焦哪个天赋，做什么具体积累`,
    `- 中期（3-10年）：天赋组合如何形成职业护城河`,
    `- 长期：天赋驱动的人生意义建议`,
    '',
    '分析要求：',
    '- 用现代职业发展语言解读，结合当下热门行业（AI、自媒体、跨境电商、知识付费等）',
    '- 语气温暖、有启发性，像一位了解命理的职业导师',
    '- 不要恐吓，不要宿命论，强调天赋是起点，努力是放大器',
    '- 总字数控制在1200-1800字',
    '- 结构清晰，使用Markdown小标题',
  ].join('\n')
}

export async function getTalentAiAnalysis(
  bazi: any,
  talentResult: TalentResult,
  name: string,
  gender: string,
): Promise<string> {
  try {
    const prompt = buildTalentPrompt(bazi, talentResult, name, gender)
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemPrompt: '你是一位融合命理学与职业发展的天赋分析师。你擅长把八字命理映射到现代职业场景，帮助人们发现自己的天赋优势。你说话温暖有洞察力，像一位懂命理的职业导师。',
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.content || ''
    }
  } catch (error) {
    console.error('Talent AI analysis error:', error)
  }

  return ''
}

// 颜色工具
export function getScoreColor(score: number): string {
  if (score >= 80) return '#F59E0B'
  if (score >= 65) return '#10B981'
  if (score >= 50) return '#3B82F6'
  if (score >= 35) return '#6B7280'
  return '#9CA3AF'
}

export function getLevelFromScore(score: number): string {
  if (score >= 80) return '极高'
  if (score >= 65) return '高'
  if (score >= 50) return '中等'
  if (score >= 35) return '一般'
  return '较弱'
}
