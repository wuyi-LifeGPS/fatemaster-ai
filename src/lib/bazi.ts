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

// 调候用神表（基于日主天干+月令地支判断气候所需）
// 调候用神的核心逻辑：
// - 寒月（子丑亥寅）：需火调候（暖局）
// - 热月（巳午未申）：需水调候（降温）
// - 燥月（戌未）：需水润燥 + 火炼金（庚金戌月典型）
// - 湿月（辰丑）：需火暖局 + 木疏土
// 不同日主在不同月份有不同需求，此处为简化版核心规则

const TIAO_HOU_TABLE: Record<string, Record<string, { tiaoHou: string[]; reason: string; climate: string }>> = {
  '甲': {
    '寅': { tiaoHou: ['丙'], reason: '春木初萌，需丙火暖局生发', climate: '初春微寒' },
    '卯': { tiaoHou: ['丙','癸'], reason: '仲春木旺，丙火泄秀、癸水滋根', climate: '仲春温和' },
    '辰': { tiaoHou: ['丙','庚'], reason: '辰月湿土，需丙火暖局+庚金劈甲引火', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['癸'], reason: '夏初木燥，需癸水降温滋木', climate: '初夏渐热' },
    '午': { tiaoHou: ['癸'], reason: '仲夏火炎，木易焚毁，急需癸水', climate: '盛夏炎热' },
    '未': { tiaoHou: ['癸','丙'], reason: '夏末土燥，癸水润土+丙火暖木', climate: '夏末燥热' },
    '申': { tiaoHou: ['丁','丙'], reason: '秋金当令，木被砍伐，需火制金护木', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['丁','庚'], reason: '仲秋金旺，丁火制金，庚金劈甲', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['丁','甲'], reason: '深秋燥土，丁火泄秀，甲木助身', climate: '深秋干燥' },
    '亥': { tiaoHou: ['丁','戊'], reason: '冬水寒冷，丁火暖局+戊土止水', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丁','丙'], reason: '仲冬严寒，需丁火/丙火暖局', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙','丁'], reason: '腊月湿寒，丙火暖局，丁火辅助', climate: '腊月严寒' },
  },
  '乙': {
    '寅': { tiaoHou: ['丙'], reason: '春木柔嫩，丙火泄秀生发', climate: '初春微寒' },
    '卯': { tiaoHou: ['丙','癸'], reason: '木旺需火泄秀+水滋根', climate: '仲春温和' },
    '辰': { tiaoHou: ['丙','癸'], reason: '湿土月，丙火暖局癸水滋根', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['癸'], reason: '夏初火旺，乙木易枯，癸水救急', climate: '初夏渐热' },
    '午': { tiaoHou: ['癸'], reason: '仲夏火炎，乙木最需癸水', climate: '盛夏炎热' },
    '未': { tiaoHou: ['癸','丙'], reason: '燥土月，癸水润燥+丙火泄秀', climate: '夏末燥热' },
    '申': { tiaoHou: ['丙','癸'], reason: '秋金克木，丙火制金+癸水滋木', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['丙','丁'], reason: '金旺木绝，急需火来制金', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['丁','甲'], reason: '深秋燥土，丁火泄秀+甲木帮身', climate: '深秋干燥' },
    '亥': { tiaoHou: ['丙','戊'], reason: '冬寒水旺，丙火暖局+戊土止水', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丙'], reason: '仲冬极寒，丙火暖局第一优先', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙'], reason: '腊月湿寒，丙火暖局', climate: '腊月严寒' },
  },
  '丙': {
    '寅': { tiaoHou: ['壬','庚'], reason: '春木生火，需壬水调候+庚金生水', climate: '初春微寒' },
    '卯': { tiaoHou: ['壬','庚'], reason: '木旺火相，壬水泄火+庚金助水', climate: '仲春温和' },
    '辰': { tiaoHou: ['壬','甲'], reason: '湿土晦火，壬水调候+甲木疏土', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['壬','庚'], reason: '夏初火旺，壬水降温+庚金生水', climate: '初夏渐热' },
    '午': { tiaoHou: ['壬','庚'], reason: '仲夏火炎至极，壬庚并用救急', climate: '盛夏炎热' },
    '未': { tiaoHou: ['壬','庚'], reason: '燥土助火，壬水降温+庚金生水', climate: '夏末燥热' },
    '申': { tiaoHou: ['壬','戊'], reason: '秋金生水，壬水太旺，需戊土止水', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['壬','丁'], reason: '仲秋金旺水相，壬水可用，丁火助暖', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['甲','壬'], reason: '深秋燥土，甲木疏土+壬水降温', climate: '深秋干燥' },
    '亥': { tiaoHou: ['甲','戊'], reason: '冬水克火，甲木生火+戊土止水', climate: '初冬寒冷' },
    '子': { tiaoHou: ['甲','丙'], reason: '仲冬火绝，甲木引火+丙火帮身', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['甲','壬'], reason: '腊月湿寒，甲木引火+壬水调候', climate: '腊月严寒' },
  },
  '丁': {
    '寅': { tiaoHou: ['甲','庚'], reason: '春木生火，甲木引丁+庚金劈甲', climate: '初春微寒' },
    '卯': { tiaoHou: ['庚','甲'], reason: '木旺火塞，庚金劈甲引火', climate: '仲春温和' },
    '辰': { tiaoHou: ['甲','庚'], reason: '湿土晦火，甲木疏土+庚金劈甲', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['庚','壬'], reason: '夏初火旺，庚金劈甲+壬水降温', climate: '初夏渐热' },
    '午': { tiaoHou: ['壬','庚'], reason: '仲夏火炎，壬水救急+庚金生水', climate: '盛夏炎热' },
    '未': { tiaoHou: ['壬','甲'], reason: '燥土助火，壬水降温+甲木疏土', climate: '夏末燥热' },
    '申': { tiaoHou: ['甲','庚','丙'], reason: '秋金旺水相，甲木引火+庚金生水+丙火暖局', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['甲','庚'], reason: '金旺火衰，甲木引火+庚金生水', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['甲','庚'], reason: '深秋燥土，甲木疏土引火+庚金生水', climate: '深秋干燥' },
    '亥': { tiaoHou: ['甲','丙'], reason: '冬水克火，甲木引火+丙火帮身', climate: '初冬寒冷' },
    '子': { tiaoHou: ['甲','丙'], reason: '仲冬火绝，甲木引火+丙火暖局', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['甲','丙'], reason: '腊月湿寒，甲木引火+丙火暖局', climate: '腊月严寒' },
  },
  '戊': {
    '寅': { tiaoHou: ['丙','甲'], reason: '春木克土，丙火暖局+甲木疏土', climate: '初春微寒' },
    '卯': { tiaoHou: ['丙','甲'], reason: '木旺土虚，丙火暖局+甲木疏土', climate: '仲春温和' },
    '辰': { tiaoHou: ['丙','甲'], reason: '湿土月，丙火暖局+甲木疏土', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['癸','甲'], reason: '夏初火旺，癸水润燥+甲木疏土', climate: '初夏渐热' },
    '午': { tiaoHou: ['壬','庚'], reason: '仲夏火炎，壬水降温+庚金生水', climate: '盛夏炎热' },
    '未': { tiaoHou: ['壬','庚'], reason: '燥土月，壬水降温+庚金生水', climate: '夏末燥热' },
    '申': { tiaoHou: ['丙','癸'], reason: '秋金泄土，丙火暖局+癸水滋金', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['丙','癸'], reason: '金旺土泄，丙火暖局+癸水滋金', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['甲','癸'], reason: '深秋燥土，甲木疏土+癸水润燥', climate: '深秋干燥' },
    '亥': { tiaoHou: ['丙','甲'], reason: '冬水耗土，丙火暖局+甲木疏土', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丙'], reason: '仲冬水旺土冻，丙火暖局第一优先', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙','甲'], reason: '腊月湿寒，丙火暖局+甲木疏土', climate: '腊月严寒' },
  },
  '己': {
    '寅': { tiaoHou: ['丙','甲'], reason: '春木克土，丙火暖局+甲木疏土', climate: '初春微寒' },
    '卯': { tiaoHou: ['丙','甲'], reason: '木旺土虚，丙火暖局+甲木疏土', climate: '仲春温和' },
    '辰': { tiaoHou: ['丙','甲'], reason: '湿土月，丙火暖局+甲木疏土', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['癸','丙'], reason: '夏初火旺，癸水润燥+丙火暖局', climate: '初夏渐热' },
    '午': { tiaoHou: ['癸','丙'], reason: '仲夏火炎，癸水救急+丙火辅助', climate: '盛夏炎热' },
    '未': { tiaoHou: ['癸','丙'], reason: '燥土月，癸水降温+丙火暖局', climate: '夏末燥热' },
    '申': { tiaoHou: ['丙','癸'], reason: '秋金泄土，丙火暖局+癸水滋金', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['丙','癸'], reason: '金旺土泄，丙火暖局+癸水滋金', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['甲','癸'], reason: '深秋燥土，甲木疏土+癸水润燥', climate: '深秋干燥' },
    '亥': { tiaoHou: ['丙','甲'], reason: '冬水耗土，丙火暖局+甲木疏土', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丙','甲'], reason: '仲冬水旺土冻，丙火暖局+甲木疏土', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙','甲'], reason: '腊月湿寒，丙火暖局+甲木疏土', climate: '腊月严寒' },
  },
  '庚': {
    '寅': { tiaoHou: ['丁','甲'], reason: '春木旺火相，庚金需丁火炼+甲木引火', climate: '初春微寒' },
    '卯': { tiaoHou: ['丁','甲'], reason: '木旺金缺，丁火炼金+甲木生火', climate: '仲春温和' },
    '辰': { tiaoHou: ['丁','甲'], reason: '湿土生金，丁火炼金+甲木疏土', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['壬','癸'], reason: '夏初火旺金熔，壬水降温+癸水滋金', climate: '初夏渐热' },
    '午': { tiaoHou: ['壬','癸'], reason: '仲夏火炎金熔，壬癸并用救急', climate: '盛夏炎热' },
    '未': { tiaoHou: ['壬','癸'], reason: '燥土助火，壬水降温+癸水滋金', climate: '夏末燥热' },
    '申': { tiaoHou: ['丁','甲'], reason: '秋金当令，丁火炼金成器+甲木生火', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['丁','甲'], reason: '金旺需火炼，丁火炼金+甲木引火', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['甲','丁'], reason: '深秋燥土埋金，甲木疏土+丁火炼金方能成器。火藏不透（戌中丁火、寅中丙火），贵气稍欠，行火运则发。', climate: '深秋燥土' },
    '亥': { tiaoHou: ['丁','丙'], reason: '冬水泄金，丁火暖局+丙火帮身', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丁','丙'], reason: '仲冬水旺金沉，丁火暖局+丙火帮身', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙','丁'], reason: '腊月湿寒金冻，丙丁并用暖局炼金', climate: '腊月严寒' },
  },
  '辛': {
    '寅': { tiaoHou: ['壬','丙'], reason: '春木旺火相，辛金需壬水淘洗+丙火暖局', climate: '初春微寒' },
    '卯': { tiaoHou: ['壬','甲'], reason: '木旺金缺，壬水淘洗+甲木疏土', climate: '仲春温和' },
    '辰': { tiaoHou: ['壬','甲'], reason: '湿土月，壬水淘洗+甲木疏土', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['壬','癸'], reason: '夏初火旺金熔，壬水降温+癸水滋金', climate: '初夏渐热' },
    '午': { tiaoHou: ['己','壬'], reason: '仲夏火炎，己土晦火+壬水降温', climate: '盛夏炎热' },
    '未': { tiaoHou: ['壬','庚'], reason: '燥土助火，壬水降温+庚金助身', climate: '夏末燥热' },
    '申': { tiaoHou: ['壬','丁'], reason: '秋金当令，壬水淘洗+丁火暖局', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['壬','丙'], reason: '金旺水相，壬水淘洗+丙火暖局', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['壬','甲'], reason: '深秋燥土，壬水淘洗+甲木疏土', climate: '深秋干燥' },
    '亥': { tiaoHou: ['丙'], reason: '冬水泄金，丙火暖局', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丙'], reason: '仲冬水旺金沉，丙火暖局', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙','壬'], reason: '腊月湿寒金冻，丙火暖局+壬水淘洗', climate: '腊月严寒' },
  },
  '壬': {
    '寅': { tiaoHou: ['丙','庚'], reason: '春木泄水，丙火暖局+庚金生水', climate: '初春微寒' },
    '卯': { tiaoHou: ['丙','庚'], reason: '木旺水缩，丙火泄木+庚金生水', climate: '仲春温和' },
    '辰': { tiaoHou: ['丙','甲'], reason: '湿土月，丙火暖局+甲木疏土', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['壬','庚'], reason: '夏初火旺水蒸，壬水帮身+庚金生水', climate: '初夏渐热' },
    '午': { tiaoHou: ['壬','庚'], reason: '仲夏火炎水干，壬庚并用救急', climate: '盛夏炎热' },
    '未': { tiaoHou: ['壬','庚'], reason: '燥土克水，壬水帮身+庚金生水', climate: '夏末燥热' },
    '申': { tiaoHou: ['丁','戊'], reason: '秋金生水旺，丁火泄秀+戊土止水', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['丁','甲'], reason: '金旺水相，丁火泄秀+甲木生火', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['甲','丙'], reason: '深秋燥土，甲木疏土+丙火暖局', climate: '深秋干燥' },
    '亥': { tiaoHou: ['丙','戊'], reason: '冬水极旺，丙火暖局+戊土止水', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丙','戊'], reason: '仲冬水旺，丙火暖局+戊土止水', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙','甲'], reason: '腊月湿寒，丙火暖局+甲木疏土', climate: '腊月严寒' },
  },
  '癸': {
    '寅': { tiaoHou: ['丙','辛'], reason: '春木泄水，丙火暖局+辛金生水', climate: '初春微寒' },
    '卯': { tiaoHou: ['庚','辛'], reason: '木旺水缩，庚辛金生水', climate: '仲春温和' },
    '辰': { tiaoHou: ['丙','辛'], reason: '湿土月，丙火暖局+辛金生水', climate: '暮春渐暖' },
    '巳': { tiaoHou: ['辛','庚'], reason: '夏初火旺水蒸，辛庚生水', climate: '初夏渐热' },
    '午': { tiaoHou: ['壬','庚'], reason: '仲夏火炎水干，壬水帮身+庚金生水', climate: '盛夏炎热' },
    '未': { tiaoHou: ['壬','庚'], reason: '燥土克水，壬水帮身+庚金生水', climate: '夏末燥热' },
    '申': { tiaoHou: ['丁','丙'], reason: '秋金生水旺，丁火泄秀+丙火暖局', climate: '初秋渐凉' },
    '酉': { tiaoHou: ['丁','丙'], reason: '金旺水相，丁火泄秀+丙火暖局', climate: '仲秋清凉' },
    '戌': { tiaoHou: ['辛','丙'], reason: '深秋燥土，辛金生水+丙火暖局', climate: '深秋干燥' },
    '亥': { tiaoHou: ['丙','戊'], reason: '冬水极旺，丙火暖局+戊土止水', climate: '初冬寒冷' },
    '子': { tiaoHou: ['丙','戊'], reason: '仲冬水旺，丙火暖局+戊土止水', climate: '仲冬严寒' },
    '丑': { tiaoHou: ['丙','甲'], reason: '腊月湿寒，丙火暖局+甲木疏土', climate: '腊月严寒' },
  },
};

// 计算调候用神
function calculateTiaoHou(
  dayMaster: string,
  monthZhi: string,
  pillars: { name: string; gan: string; zhi: string }[],
  wuXingFullCount: Record<string, number>,
) {
  const tiaoHouData = TIAO_HOU_TABLE[dayMaster]?.[monthZhi];
  
  if (!tiaoHouData) {
    return {
      tiaoHouGod: ['无法判断'],
      tiaoHouReason: '调候数据缺失',
      climate: '未知',
      presentTiaoHou: [],
      missingTiaoHou: [],
      isBuried: false,
    };
  }

  const tiaoHouGanSet = new Set(tiaoHouData.tiaoHou);
  
  // 检查调候用神是否透出于天干
  const presentTiaoHou: string[] = [];
  const missingTiaoHou: string[] = [];
  
  tiaoHouData.tiaoHou.forEach(gan => {
    const isPresent = pillars.some(p => p.gan === gan);
    if (isPresent) {
      presentTiaoHou.push(gan);
    } else {
      missingTiaoHou.push(gan);
    }
  });

  // 检查调候用神是否藏在地支中（不透）
  const buriedTiaoHou: string[] = [];
  pillars.forEach(p => {
    const cangGan = getCangGan(p.zhi);
    cangGan.forEach(gan => {
      if (tiaoHouGanSet.has(gan) && !presentTiaoHou.includes(gan)) {
        buriedTiaoHou.push(`${gan}（藏${p.zhi}中）`);
      }
    });
  });

  // 调候状态判断
  let tiaoHouStatus: 'adequate' | 'lacking' | 'buried';
  let tiaoHouDesc: string;
  
  if (presentTiaoHou.length > 0) {
    tiaoHouStatus = 'adequate';
    tiaoHouDesc = `调候用神${presentTiaoHou.join('、')}透出于天干，全局气候调和，格局层次较高。`;
  } else if (buriedTiaoHou.length > 0) {
    tiaoHouStatus = 'buried';
    tiaoHouDesc = `调候用神${missingTiaoHou.join('、')}不透天干，仅藏于地支（${buriedTiaoHou.join('，')}）。"火藏不透，贵气稍欠"，行运透出则发。`;
  } else {
    tiaoHouStatus = 'lacking';
    tiaoHouDesc = `调候用神${missingTiaoHou.join('、')}完全缺失。命局气候偏枯，需大运流年补足调候之神方能有成。`;
  }

  return {
    tiaoHouGod: tiaoHouData.tiaoHou,
    tiaoHouReason: tiaoHouData.reason,
    climate: tiaoHouData.climate,
    presentTiaoHou,
    missingTiaoHou,
    buriedTiaoHou,
    tiaoHouStatus,
    tiaoHouDesc,
    isBuried: tiaoHouStatus === 'buried',
  };
}

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

// 导出常量供外部使用
export { TIAN_GAN, DI_ZHI, WU_XING, SHI_SHEN_MAP };

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

  // 完整藏干信息（本气·中气·余气及对应十神）
  const cangGanDetail = pillars.map(p => {
    const cangGan = getCangGan(p.zhi);
    return {
      name: p.name,
      zhi: p.zhi,
      cangGan: cangGan.map((gan, idx) => ({
        gan,
        qi: idx === 0 ? '本气' : idx === 1 ? '中气' : '余气',
        wuXing: getWuXing(gan),
        shiShen: SHI_SHEN_MAP[dayMaster]?.[gan] || '未知',
      })),
    };
  });

  // 五行统计（天干 + 藏干本气）——UI展示用
  const wuXingCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  pillars.forEach(p => {
    const wx = WU_XING[p.gan];
    if (wx) wuXingCount[wx]++;
  });
  pillars.forEach(p => {
    const cangGan = getCangGan(p.zhi);
    if (cangGan.length > 0) {
      const wx = WU_XING[cangGan[0]];
      if (wx) wuXingCount[wx]++;
    }
  });

  // 五行统计（天干 + 所有藏干）——分析用
  const wuXingFullCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  // 天干
  pillars.forEach(p => {
    const wx = WU_XING[p.gan];
    if (wx) wuXingFullCount[wx]++;
  });
  // 所有藏干
  pillars.forEach(p => {
    const cangGan = getCangGan(p.zhi);
    cangGan.forEach(gan => {
      const wx = WU_XING[gan];
      if (wx) wuXingFullCount[wx]++;
    });
  });

  // 十神映射
  const tenGods: Record<string, string> = {};
  pillars.forEach(p => {
    if (p.gan !== dayMaster) {
      tenGods[p.gan] = getShiShen(dayMaster, p.gan);
    }
    const cangGan = getCangGan(p.zhi);
    if (cangGan.length > 0) {
      tenGods[p.zhi] = getShiShen(dayMaster, cangGan[0]);
    }
  });

  // 身强身弱判断
  const bodyStrength = calculateBodyStrength(
    dayMaster,
    pillars,
    wuXingFullCount,
    cangGanDetail
  );

  // 格局判断
  const pattern = determinePattern(
    dayMaster,
    pillars,
    cangGanDetail,
    bodyStrength
  );

  // 调候用神判断
  const tiaoHou = calculateTiaoHou(
    dayMaster,
    monthGZ[1],
    pillars,
    wuXingFullCount,
  );

  return {
    pillars,
    dayMaster,
    wuXingCount,
    wuXingFullCount,
    tenGods,
    yinYang: getYinYang(dayMaster),
    wuXing: getWuXing(dayMaster),
    cangGanDetail,
    bodyStrength,
    pattern,
    tiaoHou,
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
export function calculateHourGan(dayGan: string, hourZhiIdx: number): string {
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

// 计算日主强弱
// 基础规则：
// 1. 月令得气（日主五行与月支藏干本气同，或月支五行生日主）+2分
// 2. 其他地支有日主同五行（根）+1分/个
// 3. 天干有比劫（同类）+1分/个
// 4. 天干有印星（生我者）+1分/个
// 5. 地支有印星藏干 +0.5分/个
// 6. 被克（官杀）、被泄（食伤）、被耗（财）-1分/个（天干透出明显时）
function calculateBodyStrength(
  dayMaster: string,
  pillars: { name: string; gan: string; zhi: string }[],
  wuXingFullCount: Record<string, number>,
  cangGanDetail: { name: string; zhi: string; cangGan: { gan: string; qi: string; wuXing: string; shiShen: string }[] }[]
) {
  const dayMasterWuXing = WU_XING[dayMaster]; // 日主五行
  const dayMasterIdx = TIAN_GAN.indexOf(dayMaster);
  
  let score = 0;
  let helperGan: string[] = []; // 帮身的十神（比肩、劫财、正印、偏印）
  let restrictGan: string[] = []; // 克泄耗的十神
  
  // 判断月令（月支）
  const monthZhi = pillars[1].zhi;
  const monthCangGan = cangGanDetail[1].cangGan;
  
  // 月令得分
  let monthScore = 0;
  monthCangGan.forEach((cg, idx) => {
    if (cg.wuXing === dayMasterWuXing) {
      // 月令藏干有日主同五行（根）
      monthScore += idx === 0 ? 2 : 0.5;
    }
    if (['正印', '偏印'].includes(cg.shiShen)) {
      // 月令藏干有印星
      monthScore += idx === 0 ? 1.5 : 0.3;
    }
  });
  
  // 年支、日支、时支藏干得分
  let rootScore = 0;
  [0, 2, 3].forEach(idx => {
    const zhi = pillars[idx].zhi;
    if (zhi === monthZhi) return; // 月令已算
    cangGanDetail[idx].cangGan.forEach((cg, cIdx) => {
      if (cg.wuXing === dayMasterWuXing) {
        rootScore += cIdx === 0 ? 1 : 0.3;
      }
      if (['正印', '偏印'].includes(cg.shiShen)) {
        rootScore += cIdx === 0 ? 0.8 : 0.2;
      }
    });
  });
  
  // 天干得分（年月时干，日干不算）
  let ganScore = 0;
  [0, 1, 3].forEach(idx => {
    const gan = pillars[idx].gan;
    const shishen = SHI_SHEN_MAP[dayMaster]?.[gan];
    if (shishen === '比肩' || shishen === '劫财') {
      ganScore += 1;
      helperGan.push(`${gan}（${shishen}）`);
    }
    if (shishen === '正印' || shishen === '偏印') {
      ganScore += 1;
      helperGan.push(`${gan}（${shishen}）`);
    }
    if (['正官', '七杀', '食神', '伤官', '正财', '偏财'].includes(shishen || '')) {
      restrictGan.push(`${gan}（${shishen}）`);
    }
  });
  
  score = monthScore + rootScore + ganScore;
  
  // 总分判断
  let strength: '强' | '偏弱' | '中和';
  let description: string;
  
  if (score >= 4.5) {
    strength = '强';
    description = '日主得月令生扶，地支有强根，天干有比劫印星帮身，整体能量充沛。';
  } else if (score <= 1.5) {
    strength = '偏弱';
    description = '日主失令，地支根弱或无根，天干缺乏比劫印星支持，能量不足。';
  } else {
    strength = '中和';
    description = '日主强弱适中，既有生扶之力，也有克泄之气，整体趋于平衡。';
  }
  
  return {
    strength,
    score: Math.round(score * 10) / 10,
    description,
    monthScore: Math.round(monthScore * 10) / 10,
    rootScore: Math.round(rootScore * 10) / 10,
    ganScore: Math.round(ganScore * 10) / 10,
    helperGan,
    restrictGan,
  };
}

// 格局判断
function determinePattern(
  dayMaster: string,
  pillars: { name: string; gan: string; zhi: string }[],
  cangGanDetail: { name: string; zhi: string; cangGan: { gan: string; qi: string; wuXing: string; shiShen: string }[] }[],
  bodyStrength: any
) {
  const monthGan = pillars[1].gan;
  const monthZhi = pillars[1].zhi;
  const monthCangGan = cangGanDetail[1].cangGan;
  const monthBenQi = monthCangGan[0]; // 月令本气
  
  // 以月令本气藏干对应的十神定格局
  let patternName = '';
  let patternDesc = '';
  let usefulGod: string[] = []; // 喜用神
  let avoidGod: string[] = []; // 忌神
  
  const patternType = monthBenQi.shiShen;
  
  switch (patternType) {
    case '比肩':
    case '劫财':
      patternName = '建禄格 / 月刃格';
      patternDesc = '月令比肩或劫财，日主得月令强根，个性独立、自尊心强，有竞争意识。';
      if (bodyStrength.strength === '强') {
        usefulGod = ['官杀（克制比劫）', '食伤（泄秀生财）'];
        avoidGod = ['印星（生身太过）', '比劫（竞争加剧）'];
      } else {
        usefulGod = ['印星（生扶日主）', '比劫（助身抗官杀）'];
        avoidGod = ['官杀（克身太过）', '财星（耗身）'];
      }
      break;
    case '食神':
    case '伤官':
      patternName = '食伤格';
      patternDesc = '月令食伤透出，才华横溢、思维活跃，表达能力强，适合创意、技术、艺术领域。';
      if (bodyStrength.strength === '强') {
        usefulGod = ['财星（食伤生财）', '官杀（适度克制）'];
        avoidGod = ['印星（克制食伤）', '比劫（争夺资源）'];
      } else {
        usefulGod = ['印星（生身+制食伤）', '比劫（助身）'];
        avoidGod = ['食伤（泄身太过）', '财星（耗身）'];
      }
      break;
    case '正财':
    case '偏财':
      patternName = '财格';
      patternDesc = '月令财星当令，重视物质、善于理财，对金钱敏感，适合经商、金融、管理。';
      if (bodyStrength.strength === '强') {
        usefulGod = ['官杀（护财）', '食伤（生财之源）'];
        avoidGod = ['比劫（争夺财星）', '印星（分散精力）'];
      } else {
        usefulGod = ['印星（生身担财）', '比劫（助身求财）'];
        avoidGod = ['财星（耗身太过）', '官杀（克身）'];
      }
      break;
    case '正官':
    case '七杀':
      patternName = bodyStrength.strength === '强' ? '官杀格' : '杀重身弱格';
      patternDesc = '月令官杀当令，责任心强、自律、有管理才能，但压力较大。';
      if (bodyStrength.strength === '强') {
        usefulGod = ['财星（生官杀）', '食伤（制官杀）'];
        avoidGod = ['印星（化官杀生身，太过则官杀无力）'];
      } else {
        usefulGod = ['印星（化杀生身）', '比劫（助身抗杀）'];
        avoidGod = ['官杀（克身太过）', '财星（生官杀）'];
      }
      break;
    case '正印':
    case '偏印':
      patternName = '印格';
      patternDesc = '月令印星当令，学识丰富、思维深沉，有贵人相助，适合学术、研究、顾问。';
      if (bodyStrength.strength === '强') {
        usefulGod = ['财星（破印得财）', '食伤（泄秀生财）', '官杀（适度克制）'];
        avoidGod = ['印星（生身太过）', '比劫（争夺）'];
      } else {
        usefulGod = ['印星（继续生身）', '比劫（助身）'];
        avoidGod = ['财星（破印）', '食伤（泄身）'];
      }
      break;
    default:
      patternName = '特殊格局';
      patternDesc = '格局特殊，需结合全局综合判断。';
      usefulGod = ['根据具体组合分析'];
      avoidGod = ['根据具体组合分析'];
  }
  
  // 从格判断（极端情况）
  const wxCount = bodyStrength.score;
  const dayMasterWX = WU_XING[dayMaster];
  const sameWXCount = (wuXingFullCount: Record<string, number>) => {
    const c = wuXingFullCount[dayMasterWX] || 0;
    return c;
  };
  
  // 如果一方五行独大，另一方极弱，考虑从格
  const maxWX = Math.max(...Object.values({金:0,木:0,水:0,火:0,土:0})); // 占位
  
  return {
    patternName,
    patternDesc,
    patternType,
    usefulGod,
    avoidGod,
    monthBenQi: monthBenQi.gan,
    monthBenQiShiShen: monthBenQi.shiShen,
  };
}

// 兼容旧接口的辅助函数
// 获取今天的干支信息（年柱、月柱、日柱）
export function getTodayGanZhi() {
  const { Solar } = require('lunar-javascript');
  const today = new Date();
  const solar = Solar.fromDate(today);
  const lunar = solar.getLunar();

  const yearGZ = lunar.getYearInGanZhi();
  const monthGZ = lunar.getMonthInGanZhi();
  const dayGZ = lunar.getDayInGanZhi();

  return {
    year: { gan: yearGZ[0], zhi: yearGZ[1] },
    month: { gan: monthGZ[0], zhi: monthGZ[1] },
    day: { gan: dayGZ[0], zhi: dayGZ[1] },
    dateStr: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
    weekday: ['日','一','二','三','四','五','六'][today.getDay()],
  };
}

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
