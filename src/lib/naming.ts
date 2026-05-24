// 姓名学计算库 - 三才五格、笔画数、数理吉凶

// 康熙字典简体常用字笔画数（部分）
const strokeMap: Record<string, number> = {
  // 常见姓氏
  '王': 4, '李': 7, '张': 11, '刘': 15, '陈': 16, '杨': 13, '黄': 12, '赵': 14,
  '吴': 7, '周': 8, '徐': 10, '孙': 10, '马': 10, '朱': 6, '胡': 11, '郭': 15,
  '何': 7, '高': 10, '林': 8, '罗': 20, '郑': 19, '梁': 11, '谢': 17, '宋': 7,
  '唐': 10, '许': 11, '韩': 17, '冯': 12, '邓': 19, '曹': 11, '彭': 12, '曾': 12,
  '肖': 19, '田': 5, '董': 15, '袁': 10, '潘': 16, '于': 3, '蒋': 17, '蔡': 17,
  '余': 7, '杜': 7, '叶': 15, '程': 12, '苏': 22, '魏': 18, '吕': 7, '丁': 2,
  '任': 6, '沈': 8, '姚': 9, '卢': 16, '姜': 19, '崔': 11, '钟': 20, '谭': 19,
  '陆': 16, '汪': 8, '范': 15, '金': 8, '石': 5, '廖': 14, '贾': 13, '夏': 10,
  '韦': 9, '付': 5, '方': 4, '白': 5, '邹': 17, '孟': 8, '熊': 14, '秦': 10,
  '邱': 12, '江': 7, '尹': 4, '薛': 19, '闫': 11, '段': 9, '雷': 13, '侯': 9,
  '龙': 16, '史': 5, '陶': 16, '黎': 15, '贺': 12, '顾': 21, '毛': 4, '郝': 14,
  '龚': 22, '邵': 12, '万': 15, '钱': 16, '严': 20, '覃': 12, '武': 8, '戴': 18,
  '莫': 13, '孔': 4, '向': 6, '汤': 13, '文': 4, '殷': 10, '常': 11, '乔': 12,
  '傅': 12, '赖': 16, '施': 9, '牛': 4, '樊': 15, '葛': 15, '齐': 14, '安': 6,
  '易': 8, '伍': 6, '庞': 19, '聂': 18, '庄': 6, '章': 11, '童': 12, '颜': 18,
  '盛': 12, '辛': 7, '柳': 9, '隋': 17, '柏': 10, '倪': 10, '卫': 15,
  '简': 18, '娄': 11, '窦': 20, '戚': 11, '闵': 12, '尤': 4, '柴': 9,
  '单': 12, '车': 7, '鞠': 17, '华': 14, '匡': 6, '游': 13, '阳': 17, '詹': 13,
  '岑': 7, '苑': 11, '祁': 8, '薄': 19, '浦': 11, '宓': 8, '慕': 15, '帅': 9,
  '廉': 13, '历': 16, '胥': 9, '凤': 14, '卞': 4, '邬': 12, '元': 4, '卜': 2,
  '平': 5, '米': 6, '臧': 14, '舒': 12, '祝': 10, '阮': 12, '翁': 10, '荀': 12,
  '惠': 12, '柯': 9, '宫': 9, '滕': 14, '缪': 17, '干': 3,

  // 常见名字用字
  '一': 1, '乙': 1, '二': 2, '十': 10, '人': 2, '入': 2, '八': 8, '几': 12,
  '了': 2, '力': 2, '刀': 2, '乃': 2, '又': 2, '三': 3, '上': 3, '下': 3,
  '亏': 17, '工': 3, '土': 3, '士': 3, '才': 3, '寸': 3, '大': 3,
  '丈': 3, '与': 14, '勺': 3, '久': 3, '凡': 3, '夕': 3, '千': 3, '子': 3, '女': 3,
  '弓': 3, '己': 3, '已': 3, '巳': 3, '之': 4, '乏': 4, '乞': 3, '川': 3, '也': 3,
  '习': 11, '乡': 3, '丰': 18, '井': 4, '五': 4, '亚': 8, '仁': 4, '什': 4, '片': 4,
  '仆': 14, '化': 4, '仇': 4, '仍': 4, '仅': 4, '斤': 4, '爪': 4, '反': 4, '兮': 4,
  '切': 4, '巨': 5, '牙': 4, '屯': 4, '戈': 4, '比': 4, '互': 4, '瓦': 5, '止': 4,
  '母': 5, '勿': 4, '日': 4, '凶': 4, '丹': 4, '认': 14, '云': 4,
  '专': 11, '木': 4, '不': 4, '太': 4, '犬': 4, '区': 11, '友': 4,
  '匹': 4,

  // 更多常用字
  '伟': 11, '芳': 10, '娜': 10, '敏': 11, '静': 16, '丽': 19, '强': 11, '磊': 15,
  '军': 9, '洋': 10, '勇': 9, '艳': 24, '杰': 12, '娟': 10, '涛': 18, '明': 8,
  '超': 12, '秀': 7, '霞': 17, '刚': 10, '桂': 10, '英': 11,
  '建': 9, '辉': 15, '玉': 5, '国': 11, '春': 9, '梅': 11, '鑫': 24,
  '宇': 6, '欣': 8, '婷': 12, '慧': 15, '佳': 8, '浩': 11, '然': 12, '诗': 13,
  '涵': 12, '怡': 9, '琪': 13, '晨': 11, '睿': 14, '昊': 8, '泽': 17,
  '博': 12, '瑞': 14, '轩': 10, '航': 10, '翔': 12, '凯': 12, '诺': 16, '辰': 7,
  '逸': 15, '嘉': 14, '俊': 9, '皓': 12, '梓': 11, '雨': 8, '思': 9, '彤': 7,
  '雅': 12, '依': 8, '琳': 13, '若': 11, '熙': 14, '语': 14, '曦': 20, '墨': 15,
  '风': 9, '月': 4, '星': 9, '天': 4, '水': 4, '火': 4,
  '山': 3, '河': 9, '海': 11, '森': 12,
  '梦': 14, '雪': 11, '冰': 6, '清': 12, '源': 14, '远': 17, '志': 7, '诚': 14,
  '信': 9, '礼': 18, '义': 13, '智': 12, '毅': 15, '恒': 10,
  '宁': 14, '康': 11, '泰': 10, '祥': 11, '福': 14, '禄': 13, '寿': 14,
  '喜': 12, '乐': 15, '悦': 11, '欢': 22, '美': 9, '善': 12, '真': 10,
  '爱': 13, '和': 8, '顺': 12, '达': 16, '成': 7, '功': 5, '名': 6,
  '利': 7, '富': 12, '贵': 12, '荣': 14, '兴': 16, '旺': 8,
  '昌': 8, '隆': 17, '发': 15, '财': 10, '宝': 20, '珠': 11, '珍': 10,
  '玲': 10, '珊': 10, '瑚': 14, '琼': 20, '瑶': 15, '瑾': 16, '瑜': 14,
  '璇': 16, '珮': 11, '珞': 11, '琬': 13, '琰': 13, '琴': 13, '瑟': 14,
  '笙': 11, '箫': 18, '笛': 11, '筝': 14, '鼓': 13, '舞': 14, '歌': 14,
  '咏': 12, '吟': 7, '词': 12, '赋': 15, '书': 10, '画': 12, '笔': 12,
  '纸': 10, '砚': 12, '棋': 12,
}

// 81数理吉凶表
const 数理吉凶: Record<number, { level: '吉' | '凶' | '半吉' | '半凶'; desc: string }> = {
  1: { level: '吉', desc: '太极之数，万物开泰，生发无穷，利禄亨通' },
  2: { level: '凶', desc: '两仪之数，混沌未开，进退保守，志望难达' },
  3: { level: '吉', desc: '三才之数，天地人和，大事大业，繁荣昌隆' },
  4: { level: '凶', desc: '四象之数，待于生发，万事慎重，不具营谋' },
  5: { level: '吉', desc: '五行俱权，循环相生，圆通畅达，福祉无穷' },
  6: { level: '吉', desc: '六爻之数，发展变化，天赋美德，吉祥安泰' },
  7: { level: '吉', desc: '七政之数，精悍严谨，天赋之力，吉星照耀' },
  8: { level: '吉', desc: '八卦之数，乾坎艮震，巽离坤兑，无穷无尽' },
  9: { level: '凶', desc: '大成之数，蕴涵凶险，或成或败，难以把握' },
  10: { level: '凶', desc: '终结之数，雪暗飘零，偶或有成，回顾茫然' },
  11: { level: '吉', desc: '旱苗逢雨，万物更新，调顺发达，恢弘泽世' },
  12: { level: '凶', desc: '掘井无泉，意志脆弱，家庭寂寞，谋事难成' },
  13: { level: '吉', desc: '春日牡丹，才艺多能，智谋奇略，忍柔当事' },
  14: { level: '凶', desc: '破兆，家庭缘薄，孤独遭难，谋事不达' },
  15: { level: '吉', desc: '福寿圆满，富贵荣誉，涵养雅量，德高望重' },
  16: { level: '吉', desc: '厚重，兴家得助，贵人得助，兴家兴业' },
  17: { level: '吉', desc: '刚强，突破万难，若能容忍，必获成功' },
  18: { level: '吉', desc: '铁镜重磨，权威显达，博得名利，且养柔德' },
  19: { level: '凶', desc: '多难，风云蔽日，辛苦重来，虽有智谋' },
  20: { level: '凶', desc: '屋下藏金，非业破运，灾难重重，进退维谷' },
  21: { level: '吉', desc: '明月中天，光风霁月，确立基业，官运亨通' },
  22: { level: '凶', desc: '秋草逢霜，困难疾弱，虽出豪杰，人生波折' },
  23: { level: '吉', desc: '壮丽，旭日东升，壮丽壮观，男性吉，女性慎用' },
  24: { level: '吉', desc: '掘藏得金，家门余庆，金钱丰盈，白手成家' },
  25: { level: '吉', desc: '英俊，资性英敏，才能奇特，克服傲慢' },
  26: { level: '凶', desc: '变怪，波澜重叠，千变万化，能通过危难' },
  27: { level: '凶', desc: '增长，欲望无止，宜静待时机，自我强烈' },
  28: { level: '凶', desc: '阔水浮萍，遭难之数，虽有豪杰，终归漂泊' },
  29: { level: '吉', desc: '智谋，财力归集，名闻海内，成就大业' },
  30: { level: '半吉', desc: '非运，沉浮不定，凶吉难辨，保留有变' },
  31: { level: '吉', desc: '春日花开，智勇得志，博得名利，统领众人' },
  32: { level: '吉', desc: '宝马金鞍，侥幸多望，贵人得助，财帛如裕' },
  33: { level: '吉', desc: '旭日升天，鸾凤相会，名闻天下，隆昌至极' },
  34: { level: '凶', desc: '破家，破家之身，见识短小，辛苦遭逢' },
  35: { level: '吉', desc: '高楼望月，温和平静，智达通畅，文昌技艺' },
  36: { level: '凶', desc: '波澜，风浪不平，枉费心力，多陷穷困' },
  37: { level: '吉', desc: '猛虎出林，权威显达，热诚忠信，终身荣富' },
  38: { level: '半吉', desc: '磨铁成针，意志薄弱，刻意经营，才识不凡' },
  39: { level: '半吉', desc: '富贵，富贵荣华，财帛丰盈，隐患较多' },
  40: { level: '凶', desc: '退安，智谋胆力，冒险投机，沉浮莫测' },
  41: { level: '吉', desc: '有德，纯阳独秀，德高望重，事事如意' },
  42: { level: '凶', desc: '寒蝉在柳，博识多能，精通世情，十艺九不成' },
  43: { level: '凶', desc: '散财，散财破产，诸事不遂，虽有智谋' },
  44: { level: '凶', desc: '烦闷，破家亡身，暗藏惨淡，事不如意' },
  45: { level: '吉', desc: '顺风，新生泰和，顺风扬帆，富贵繁荣' },
  46: { level: '凶', desc: '浪里淘金，载宝沉舟，历尽艰难，大功有成' },
  47: { level: '吉', desc: '点石成金，天赋幸福，吉祥和畅，福寿双全' },
  48: { level: '吉', desc: '苍松立鹤，智谋兼备，德量荣达，名利双收' },
  49: { level: '凶', desc: '吉临则吉，凶来则凶，转凶为吉，配好三才' },
  50: { level: '半吉', desc: '小舟入海，一成一败，吉凶参半，先得后失' },
  51: { level: '半吉', desc: '沉浮，盛衰交加，波澜重叠，常陷困苦' },
  52: { level: '吉', desc: '达眼，卓识达眼，先见之明，理想实现' },
  53: { level: '凶', desc: '曲卷，外祥内患，虽有吉兆，难逃苦厄' },
  54: { level: '凶', desc: '石上栽花，难得有活，忧闷频来，辛惨不绝' },
  55: { level: '凶', desc: '善恶，外美内苦，和顺不足，多难之象' },
  56: { level: '凶', desc: '浪里行舟，历尽艰辛，障碍重重，处 Strike' },
  57: { level: '吉', desc: '日照春松，寒雪青松，夜莺吟春，必受繁荣' },
  58: { level: '半吉', desc: '晚行遇月，沉浮多端，始凶终吉，难陷灾祸' },
  59: { level: '凶', desc: '寒蝉悲风，意志衰退，缺乏忍耐，苦难不休' },
  60: { level: '凶', desc: '无谋，黑暗无光，心迷意乱，出尔反尔' },
  61: { level: '吉', desc: '牡丹芙蓉，花开富贵，名利双收，定享天赋' },
  62: { level: '凶', desc: '衰败，基础不稳，缺乏信仰，事难遂愿' },
  63: { level: '吉', desc: '舟归平海，荣华富贵，心身健全，前途无量' },
  64: { level: '凶', desc: '非命，骨肉分离，孤独悲愁，难得心安' },
  65: { level: '吉', desc: '巨流归海，天长地久，家运隆昌，福寿绵长' },
  66: { level: '凶', desc: '岩头步马，进退两难，穷迫滞塞，忧虑烦恼' },
  67: { level: '吉', desc: '通达，利路亨通，名利双收，家道昌隆' },
  68: { level: '吉', desc: '顺风吹帆，兴家立业，好运来临，万事顺遂' },
  69: { level: '凶', desc: '非业，动摇不安，逆境之象，陷于苦难' },
  70: { level: '凶', desc: '残菊逢霜，障碍重重，辛苦迷茫，劳苦失意' },
  71: { level: '半吉', desc: '石上金花，内心劳苦，贯彻始终，定可昌隆' },
  72: { level: '凶', desc: '劳苦，荣枯无常，骨肉分离，孤立无援' },
  73: { level: '吉', desc: '无勇，盛衰交加，徒有高志，终陷困苦' },
  74: { level: '凶', desc: '残菊经霜，障碍重重，辛苦迷茫，陷于逆境' },
  75: { level: '凶', desc: '退守，吉尽凶始，事事不顺心，多灾多难' },
  76: { level: '凶', desc: '离散，骨肉分离，内外不和，虽是吉兆，暗藏苦难' },
  77: { level: '半吉', desc: '半吉，家庭有悦，苦尽甘来，晚年幸福' },
  78: { level: '半吉', desc: '晚苦，祸福参半，先天智能，可望成功' },
  79: { level: '凶', desc: '云头望月，身疲力尽，财力难筹，前途无光' },
  80: { level: '凶', desc: '遁吉，辛苦不绝，早入隐遁，安心立命' },
  81: { level: '吉', desc: '万物回春，最吉之数，还本归元，吉祥如意' },
}

// 获取字的笔画数（简化版，按字库查，查不到返回0）
export function getStrokeCount(char: string): number {
  return strokeMap[char] || 0
}

// 计算名字的总笔画数
export function getTotalStrokes(name: string): number {
  return name.split('').reduce((sum, char) => sum + getStrokeCount(char), 0)
}

// 五格计算
export interface FiveGrid {
  tianGe: number      // 天格
  renGe: number       // 人格
  diGe: number        // 地格
  waiGe: number       // 外格
  zongGe: number      // 总格
}

export function calculateFiveGrid(surname: string, givenName: string): FiveGrid {
  const surnameStrokes = getTotalStrokes(surname)
  const givenNameStrokes = getTotalStrokes(givenName)
  
  // 天格 = 姓氏笔画 + 1（单姓）
  const tianGe = surnameStrokes + 1
  
  // 人格 = 姓末字 + 名首字
  const surnameLast = surname[surname.length - 1]
  const givenNameFirst = givenName[0]
  const renGe = getStrokeCount(surnameLast) + getStrokeCount(givenNameFirst)
  
  // 地格 = 名字笔画总和
  const diGe = givenNameStrokes
  
  // 外格 = 总格 - 人格 + 1
  const zongGe = surnameStrokes + givenNameStrokes
  const waiGe = zongGe - renGe + 1
  
  return { tianGe, renGe, diGe, waiGe, zongGe }
}

// 获取数理吉凶
export function getNumerologyMeaning(num: number) {
  // 超过81则减去80的倍数
  const normalized = num > 81 ? num - Math.floor((num - 1) / 80) * 80 : num
  return 数理吉凶[normalized] || { level: '半吉', desc: '此数理较为少见，需结合三才综合判断' }
}

// 数字对应五行
export function getNumberWuxing(num: number): string {
  const lastDigit = num % 10
  if (lastDigit === 1 || lastDigit === 2) return '木'
  if (lastDigit === 3 || lastDigit === 4) return '火'
  if (lastDigit === 5 || lastDigit === 6) return '土'
  if (lastDigit === 7 || lastDigit === 8) return '金'
  return '水'
}

// 三才配置：天格、人格、地格的五行关系
export interface SanCai {
  tian: string   // 天才五行
  ren: string    // 人才五行
  di: string     // 地才五行
}

export function getSanCai(fiveGrid: FiveGrid): SanCai {
  return {
    tian: getNumberWuxing(fiveGrid.tianGe),
    ren: getNumberWuxing(fiveGrid.renGe),
    di: getNumberWuxing(fiveGrid.diGe),
  }
}

// 三才吉凶判断
export function getSanCaiLuck(sanCai: SanCai): { level: '吉' | '凶' | '半吉'; desc: string } {
  const { tian, ren, di } = sanCai
  
  // 相生：木→火→土→金→水→木
  const sheng: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  }
  
  // 相克
  const ke: Record<string, string> = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  }
  
  // 天→人，人→地的关系
  const tianToRen = tian === ren ? '比和' : sheng[tian] === ren ? '相生' : ke[tian] === ren ? '相克' : '无特殊'
  const renToDi = ren === di ? '比和' : sheng[ren] === di ? '相生' : ke[ren] === di ? '相克' : '无特殊'
  
  // 判断三才吉凶
  if (tianToRen === '相生' && renToDi === '相生') {
    return { level: '吉', desc: `三才相生（${tian}→${ren}→${di}），基础稳固，发展顺遂，上下和睦，能成功发达` }
  }
  if (tianToRen === '相克' || renToDi === '相克') {
    return { level: '凶', desc: `三才配置有克（${tian}→${ren}→${di}），基础不稳，易生变故，需谨慎行事` }
  }
  if (tianToRen === '比和' && renToDi === '比和') {
    return { level: '半吉', desc: `三才比和（${tian}=${ren}=${di}），基础尚可，但发展较为平淡，难有大成` }
  }
  return { level: '半吉', desc: `三才配置一般（${tian}→${ren}→${di}），吉凶参半，需结合其他因素综合判断` }
}

// 综合姓名分析
export interface NameAnalysis {
  fiveGrid: FiveGrid
  sanCai: SanCai
  sanCaiLuck: { level: string; desc: string }
  gridMeanings: {
    tianGe: { num: number; wuxing: string; luck: any }
    renGe: { num: number; wuxing: string; luck: any }
    diGe: { num: number; wuxing: string; luck: any }
    waiGe: { num: number; wuxing: string; luck: any }
    zongGe: { num: number; wuxing: string; luck: any }
  }
  overallScore: number
}

export function analyzeName(surname: string, givenName: string): NameAnalysis {
  const fiveGrid = calculateFiveGrid(surname, givenName)
  const sanCai = getSanCai(fiveGrid)
  const sanCaiLuck = getSanCaiLuck(sanCai)
  
  const gridMeanings = {
    tianGe: { num: fiveGrid.tianGe, wuxing: getNumberWuxing(fiveGrid.tianGe), luck: getNumerologyMeaning(fiveGrid.tianGe) },
    renGe: { num: fiveGrid.renGe, wuxing: getNumberWuxing(fiveGrid.renGe), luck: getNumerologyMeaning(fiveGrid.renGe) },
    diGe: { num: fiveGrid.diGe, wuxing: getNumberWuxing(fiveGrid.diGe), luck: getNumerologyMeaning(fiveGrid.diGe) },
    waiGe: { num: fiveGrid.waiGe, wuxing: getNumberWuxing(fiveGrid.waiGe), luck: getNumerologyMeaning(fiveGrid.waiGe) },
    zongGe: { num: fiveGrid.zongGe, wuxing: getNumberWuxing(fiveGrid.zongGe), luck: getNumerologyMeaning(fiveGrid.zongGe) },
  }
  
  // 简单评分算法
  let score = 60
  const grids = [gridMeanings.tianGe, gridMeanings.renGe, gridMeanings.diGe, gridMeanings.zongGe]
  grids.forEach(g => {
    if (g.luck.level === '吉') score += 10
    else if (g.luck.level === '凶') score -= 10
    else score += 2
  })
  
  if (sanCaiLuck.level === '吉') score += 10
  else if (sanCaiLuck.level === '凶') score -= 10
  
  score = Math.max(0, Math.min(100, score))
  
  return { fiveGrid, sanCai, sanCaiLuck, gridMeanings, overallScore: score }
}
