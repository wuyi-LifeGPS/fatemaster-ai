import { calculateBazi, getShiShen, getCangGan, DI_ZHI, calculateHourGan } from '@/lib/bazi'

// ===== buildPrompt =====
export function buildPrompt(bazi: any, name: string, gender: string, type: string, note?: string): string {
  const { pillars, dayMaster, wuXingCount, yinYang, wuXing } = bazi

  const pillarsText = pillars.map((p: any) => `${p.name}: ${p.gan}${p.zhi}`).join('\n')
  const wuXingText = Object.entries(wuXingCount).map(([k, v]) => `${k}: ${v}`).join(', ')

  return [
    '请为以下八字命盘进行详细分析：',
    '',
    '命主信息：',
    `- 姓名：${name || '未提供'}`,
    `- 性别：${gender === 'male' ? '男' : '女'}`,
    `- 日主：${dayMaster}（${yinYang}${wuXing}）`,
    note ? `- 备注：${note}` : '',
    '',
    '八字排盘：',
    pillarsText,
    '',
    `五行分布：${wuXingText}`,
    '',
    '请从以下几个方面进行分析：',
    '1. 性格特质（基于日主和五行分布）',
    '2. 事业发展方向（适合什么类型的工作）',
    '3. 财运分析',
    '4. 感情婚姻',
    '5. 健康注意事项',
    '6. 人生建议',
    '',
    '要求：',
    '- 用温暖理性的语气，不要恐吓',
    '- 结合现代生活场景给出具体建议',
    '- 强调命运掌握在自己手中，八字只是参考',
    '- 总字数控制在800-1200字',
  ].filter(Boolean).join('\n')
}

// ===== buildPromptPro =====
export function buildPromptPro(bazi: any, name: string, gender: string, type: string, note?: string): string {
  const { pillars, dayMaster, wuXingCount, yinYang, wuXing, combinedGod, bodyStrength, pattern, cangGanDetail } = bazi

  const pillarsText = pillars.map((p: any) => `${p.name}: ${p.gan}${p.zhi}`).join('\n')
  const wuXingText = Object.entries(wuXingCount).map(([k, v]) => `${k}: ${v}`).join(', ')
  const cangGanText = cangGanDetail.map((cg: any) => {
    const ganTexts = cg.cangGan.map((item: any) => `${item.gan}(${item.qi}·${item.shiShen})`).join('，');
    return `${cg.name} ${cg.zhi}：${ganTexts}`;
  }).join('\n');

  return [
    '请为以下八字命盘进行专业级详细分析：',
    '',
    '命主信息：',
    `- 姓名：${name || '未提供'}`,
    `- 性别：${gender === 'male' ? '男' : '女'}`,
    `- 日主：${dayMaster}（${yinYang}性·${wuXing}命）`,
    `- 日主强弱：${bodyStrength?.strength || '未知'}（评分${bodyStrength?.score || '-'}/10）`,
    `- 格局：${pattern?.patternName || '未知'}`,
    `- 调候用神：${combinedGod?.tiaoHouXi?.map((x: any) => `${x.gan}(${x.wuXing}·${x.shiShen})`).join('、') || '无'}`,
    `- 综合喜用：${combinedGod?.xi?.join('、') || '需结合大运判断'}`,
    `- 综合忌神：${combinedGod?.ji?.join('、') || '需结合大运判断'}`,
    note ? `- 备注：${note}` : '',
    '',
    '八字排盘：',
    pillarsText,
    '',
    '地支藏干：',
    cangGanText,
    '',
    `五行分布：${wuXingText}`,
    '',
    '请从以下几个方面进行专业级分析：',
    '1. 日主特性与性格深层分析（结合调候+扶抑）',
    '2. 事业方向与行业建议（结合格局+喜用神）',
    '3. 财运分析与理财建议',
    '4. 感情婚姻与伴侣特征',
    '5. 健康隐患与养生建议',
    '6. 人生关键节点与大运趋势提示',
    '7. 具体改运建议（颜色、方位、行业、人际）',
    '',
    '分析要求：',
    '- 严格遵循「调候优先、扶抑辅助」的专业命理原则',
    '- 用现代语言解读，避免恐吓式表达',
    '- 结合命主实际生活场景给出可操作建议',
    '- 强调八字是能量地图而非命运判决书',
    '- 总字数控制在1200-1800字',
  ].filter(Boolean).join('\n')
}


// ===== buildMatchPrompt =====
export function buildMatchPrompt(
  maleBazi: any,
  femaleBazi: any,
  maleName: string,
  femaleName: string,
  matchResult: any
): string {
  const m = maleBazi;
  const f = femaleBazi;
  const r = matchResult;

  const mPillars = m.pillars.map((p: any) => `${p.name}: ${p.gan}${p.zhi}`).join('\n');
  const fPillars = f.pillars.map((p: any) => `${p.name}: ${p.gan}${p.zhi}`).join('\n');

  const mCangGan = m.cangGanDetail?.map((cg: any) => {
    const ganTexts = cg.cangGan.map((item: any) => `${item.gan}(${item.qi}·${item.shiShen})`).join('，');
    return `${cg.name} ${cg.zhi}：${ganTexts}`;
  }).join('\n') || '';

  const fCangGan = f.cangGanDetail?.map((cg: any) => {
    const ganTexts = cg.cangGan.map((item: any) => `${item.gan}(${item.qi}·${item.shiShen})`).join('，');
    return `${cg.name} ${cg.zhi}：${ganTexts}`;
  }).join('\n') || '';

  return [
    '请为以下双方八字进行专业级合婚分析：',
    '',
    '【男方信息】',
    `- 姓名：${maleName || '未提供'}`,
    `- 日主：${m.dayMaster}（${m.yinYang}性·${m.wuXing}命）`,
    `- 日主强弱：${m.bodyStrength?.strength || '未知'}`,
    `- 喜用神：${m.combinedGod?.xi?.join('、') || '需结合大运判断'}`,
    `- 忌神：${m.combinedGod?.ji?.join('、') || '需结合大运判断'}`,
    '',
    '男方八字排盘：',
    mPillars,
    '',
    '男方地支藏干：',
    mCangGan,
    '',
    '【女方信息】',
    `- 姓名：${femaleName || '未提供'}`,
    `- 日主：${f.dayMaster}（${f.yinYang}性·${f.wuXing}命）`,
    `- 日主强弱：${f.bodyStrength?.strength || '未知'}`,
    `- 喜用神：${f.combinedGod?.xi?.join('、') || '需结合大运判断'}`,
    `- 忌神：${f.combinedGod?.ji?.join('、') || '需结合大运判断'}`,
    '',
    '女方八字排盘：',
    fPillars,
    '',
    '女方地支藏干：',
    fCangGan,
    '',
    '【算法评分结果】',
    `- 综合契合度：${r.score}分（${r.level}）`,
    `- 天干五合：${r.ganHeMatch ? '有' : '无'}`,
    `- 地支六合：${r.zhiHeMatch ? '有' : '无'}`,
    `- 地支三合：${r.sanHeMatch ? '有' : '无'}`,
    `- 地支六冲：${r.chongMatch ? '有' : '无'}`,
    `- 地支六害：${r.haiMatch ? '有' : '无'}`,
    `- 男方→女方十神：${r.mToF_SS}`,
    `- 女方→男方十神：${r.fToM_SS}`,
    `- 五行互补评分：${r.complementScore}分`,
    `- 喜用神互济：男方旺女方${r.mHelpF > 0 ? '✓' : '✗'}，女方旺男方${r.fHelpM > 0 ? '✓' : '✗'}`,
    '',
    '请从以下几个维度进行深度合婚分析：',
    '1. 双方性格契合度分析（基于日主特质、十神互动）',
    '2. 相处模式预测（谁主导、谁配合，潜在的摩擦点）',
    '3. 感情婚姻走势（甜蜜期、磨合期、稳定期的特征）',
    '4. 事业财运互助分析（双方在一起后运势如何变化）',
    '5. 家庭关系预判（与父母、子女的关系倾向）',
    '6. 关键风险提示（哪些年份需要特别注意感情维护）',
    '7. 具体相处建议（沟通方式、冲突化解、关系保鲜）',
    '',
    '分析要求：',
    '- 用现代亲密关系心理学的语言解读，不要迷信恐吓',
    '- 结合双方八字的能量特征给出具体建议',
    '- 强调婚姻需要经营，八字只是性格地图而非判决书',
    '- 对于评分低的组合，也要给出建设性建议而非一味否定',
    '- 总字数控制在1200-1800字',
  ].filter(Boolean).join('\n');
}

// ===== getMatchAiAnalysis =====
export async function getMatchAiAnalysis(
  maleBazi: any,
  femaleBazi: any,
  maleName: string,
  femaleName: string,
  matchResult: any,
): Promise<string> {
  try {
    const prompt = buildMatchPrompt(maleBazi, femaleBazi, maleName, femaleName, matchResult);
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemPrompt: '你是一位精通传统命理学的 AI 合婚分析师，擅长从八字角度分析双方的情感契合度。你用现代亲密关系语言解读命理，不迷信不恐吓，帮助情侣更好地理解彼此、经营关系。',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.content || '';
    }
  } catch (error) {
    console.error('Match AI analysis error:', error);
  }

  return '';
}

// ===== getAiAnalysis =====
export async function getAiAnalysis(bazi: any, name: string, gender: string, type: string, note?: string): Promise<string> {
  try {
    const prompt = buildPromptPro(bazi, name, gender, type, note)
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemPrompt: '你是一位精通传统命理学的 AI 命理分析师，擅长调候用神与扶抑用神的综合分析。你严格遵循「调候优先、扶抑辅助」的专业原则，用现代语言解读八字，不迷信不恐吓，帮助用户更好地认识自己。',
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.content || ''
    }
  } catch (error) {
    console.error('AI analysis error:', error)
  }

  return ''
}

// ===== calculateCombinedGod =====
function calculateCombinedGod(bazi: any) {
  const { dayMaster, tenGods, bodyStrength, tiaoHou, wuXingFullCount } = bazi;

  const wxNameMap: Record<string, string> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
    '庚': '金', '辛': '金', '壬': '水', '癸': '水'
  };

  const tiaoHouGan = tiaoHou?.tiaoHou || [];
  const tiaoHouWuXing = tiaoHouGan.map((g: string) => wxNameMap[g] || g);
  const tiaoHouStatus = tiaoHou?.tiaoHouStatus || 'lacking';

  // ===== 调候优先 =====
  const tiaoHouXiDetail = tiaoHouGan.map((g: string) => {
    const wx = wxNameMap[g];
    const ss = tenGods[g] || '未知';
    const reason = tiaoHou?.tiaoHouReason || '';
    return { gan: g, wuXing: wx, shiShen: ss, reason, type: '调候' as const };
  });

  // ===== 扶抑辅助 =====
  const fuyiXiDetail: any[] = [];
  if (bodyStrength.strength === '偏弱') {
    const tiaoHouWXSet = new Set(tiaoHouWuXing);
    if (!tiaoHouWXSet.has('金')) {
      fuyiXiDetail.push({ wuXing: '金', reason: '身弱需比劫助身', type: '扶抑' as const });
    }
    if (!tiaoHouWXSet.has('土')) {
      fuyiXiDetail.push({ wuXing: '土', reason: '身弱需印星生身', type: '扶抑' as const });
    }
  } else if (bodyStrength.strength === '强') {
    const tiaoHouWXSet = new Set(tiaoHouWuXing);
    if (!tiaoHouWXSet.has('火')) fuyiXiDetail.push({ wuXing: '火', reason: '身强喜官杀克制', type: '扶抑' as const });
    if (!tiaoHouWXSet.has('水')) fuyiXiDetail.push({ wuXing: '水', reason: '身强喜食伤泄秀', type: '扶抑' as const });
    if (!tiaoHouWXSet.has('木')) fuyiXiDetail.push({ wuXing: '木', reason: '身强喜财星耗身', type: '扶抑' as const });
  }

  // ===== 综合喜用（去重） =====
  const allXi = [...tiaoHouWuXing];
  fuyiXiDetail.forEach((item: any) => {
    if (!allXi.includes(item.wuXing)) allXi.push(item.wuXing);
  });

  // ===== 忌神推导 =====
  const finalJi: string[] = [];
  const finalXian: string[] = [];

  ['金', '木', '水', '火', '土'].forEach(wx => {
    if (allXi.includes(wx)) return;

    const harmsTiaoHou = tiaoHouWuXing.some((thWX: string) => {
      if (thWX === '火' && wx === '水') return true;
      if (thWX === '木' && wx === '金') return true;
      if (thWX === '土' && wx === '木') return true;
      if (thWX === '金' && wx === '火') return true;
      if (thWX === '水' && wx === '土') return true;
      return false;
    });

    const helpsTiaoHou = tiaoHouWuXing.some((thWX: string) => {
      if (thWX === '火' && wx === '木') return true;
      if (thWX === '土' && wx === '火') return true;
      if (thWX === '金' && wx === '土') return true;
      if (thWX === '水' && wx === '金') return true;
      if (thWX === '木' && wx === '水') return true;
      return false;
    });

    if (harmsTiaoHou) {
      finalJi.push(wx);
    } else if (helpsTiaoHou) {
      if (!allXi.includes(wx)) allXi.push(wx);
    } else {
      finalXian.push(wx);
    }
  });

  // 身弱且土过旺，土埋金也属忌
  if (bodyStrength.strength === '偏弱') {
    const tuCount = wuXingFullCount?.['土'] || 0;
    if (tuCount >= 4 && !allXi.includes('土') && !finalJi.includes('土')) {
      finalJi.push('土');
    }
  }

  return {
    xi: allXi,
    ji: finalJi,
    xian: finalXian,
    tiaoHouXi: tiaoHouXiDetail,
    fuyiXi: fuyiXiDetail,
    tiaoHouStatus,
    tiaoHouDesc: tiaoHou?.tiaoHouDesc || '',
    tiaoHouReason: tiaoHou?.tiaoHouReason || '',
    climate: tiaoHou?.climate || '',
  };
}

// ===== generateBackupAnalysis =====
export function generateBackupAnalysis(bazi: any, name: string, gender: string, combinedGod: any): string {
  const {
    dayMaster,
    yinYang,
    wuXing,
    wuXingCount,
    wuXingFullCount,
    pillars,
    tenGods,
    bodyStrength,
    pattern,
    cangGanDetail,
  } = bazi

  // 日主特质
  const dayMasterTraits: Record<string, string> = {
    '甲': '如参天大树，正直、有担当、有领导力。喜欢向上生长，有理想主义倾向，但有时会过于刚强、不够灵活。',
    '乙': '如花草藤蔓，柔韧、细腻、善于变通。有艺术气质，适应力强，但容易优柔寡断、缺乏主见。',
    '丙': '如太阳之火，热情、开朗、有感染力。乐观积极，喜欢成为焦点，但有时会过于张扬、急躁冲动。',
    '丁': '如烛光之火，温暖、细腻、有智慧。内心敏感，洞察力强，善于关怀他人，但容易多虑、情绪起伏。',
    '戊': '如大地之土，稳重、踏实、有包容力。值得信赖，做事有始有终，但有时会过于保守、缺乏变通。',
    '己': '如田园之土，温和、细腻、善于协调。有服务精神，善于照顾他人，但容易委屈求全、缺乏主见。',
    '庚': '如刀剑之金，刚毅果断，有魄力，执行力强。追求公平正义，有改革精神，但有时锋芒太露。',
    '辛': '如珠玉之金，精致细腻，审美出众，追求完美。心思灵巧，重情重义，但容易敏感多虑。',
    '壬': '如江河之水，智慧流动，思维活跃，善于变通。胸怀开阔，有冒险精神，但容易缺乏定力。',
    '癸': '如雨露之水，温柔内敛，直觉敏锐，富有灵性。心思深沉，善于倾听，但容易情绪化。',
  }

  const trait = dayMasterTraits[dayMaster] || '具有独特的个人气质，刚柔并济，潜力巨大。'

  // 藏干明细
  const cangGanText = cangGanDetail.map((cg: any) => {
    const ganTexts = cg.cangGan.map((item: any) =>
      `${item.gan}（${item.qi}·${item.shiShen}）`
    ).join('，');
    return `· ${cg.name} ${cg.zhi}：${ganTexts}`;
  }).join('\n');

  // 五行旺衰排序
  const sortedWX = Object.entries(wuXingCount).sort((a: any, b: any) => b[1] - a[1]);
  const strongest = sortedWX[0][0];
  const weakest = sortedWX[sortedWX.length - 1][0];

  // 天干透出十神
  const ganShiShen = pillars
    .filter((p: any) => p.name !== '日柱')
    .map((p: any) => {
      const ss = tenGods[p.gan];
      return ss ? `${p.gan}（${ss}）` : '';
    })
    .filter(Boolean);

  // === 使用 combinedGod 数据 ===
  const { xi, ji, xian, tiaoHouXi, tiaoHouStatus, tiaoHouDesc, tiaoHouReason, climate } = combinedGod;

  const usefulGodText = xi.join('、') || '需结合大运流年判断';
  const avoidGodText = ji.join('、') || '需结合大运流年判断';
  const neutralGodText = xian.join('、') || '无';

  const tiaoHouStatusText = () => {
    if (tiaoHouStatus === 'adequate') {
      return `调候用神${tiaoHouXi.map((x: any) => x.gan).join('、')}透干，全局气候调和，格局层次较高。`;
    }
    if (tiaoHouStatus === 'buried') {
      return `调候用神${tiaoHouXi.map((x: any) => x.gan).join('、')}不透天干，仅藏于地支。火藏不透，贵气稍欠，行运透出则发。`;
    }
    return `调候用神${tiaoHouXi.map((x: any) => x.gan).join('、')}完全缺失。命局气候偏枯，需大运流年补足调候之神方能有成。`;
  };

  // 事业建议
  const careerAdvice: Record<string, Record<string, string>> = {
    '食伤格': {
      '强': '食伤泄秀，才华横溢。适合创意、设计、教育、传媒、技术研发等需要表达和创新的领域。食伤生财，也可尝试自媒体、知识付费等轻资产创业。',
      '偏弱': '食伤泄身，需印星生扶。适合在有导师、平台支持的团队中发挥创意才能，不太适合独立创业。',
      '中和': '食伤生财有道，适合技术+商务结合的岗位，如产品经理、方案顾问等。',
    },
    '财格': {
      '强': '身强财旺，可以担财。适合经商、金融投资、销售、资源型行业。财星为养命之源，越动越有利。',
      '偏弱': '财多身弱，难以担财。适合从事稳定的财务、会计、数据分析工作，不宜投机。先提升自身能力是当务之急。',
      '中和': '财运平稳，适合稳健型理财，职业发展一步一个脚印。',
    },
    '官杀格': {
      '强': '身强杀浅，适合管理岗位、公务员、军警、企业高管。有管理才能，能服众。',
      '偏弱': '杀重身弱，压力大。适合专业技术岗位，靠手艺吃饭，或在大平台中稳定发展。',
      '中和': '官印相生，适合行政、人事、法务等需要协调沟通的岗位。',
    },
    '印格': {
      '强': '印旺身强，学识丰富。适合学术、研究、教育、顾问、策划、宗教文化等需要深度思考的领域。',
      '偏弱': '印轻身弱，需比劫助身。适合团队合作，在稳定机构中积累资历。',
      '中和': '印比相生，适合知识型工作，如培训、写作、咨询。',
    },
    '建禄格 / 月刃格': {
      '强': '建禄格身强，有实干精神。适合技术蓝领、创业、体育竞技、军警等需要体力和意志力的领域。',
      '偏弱': '有根但需生扶，适合稳定工作，积累后再图发展。',
      '中和': '身强有根，自力更生能力强，适合独立作业或创业。',
    },
    '特殊格局': {
      '强': '格局特殊，不走寻常路。适合自由职业、跨界创业、艺术、玄学、创新科技等小众领域。',
      '偏弱': '需找到独特的定位和贵人扶持，不适合随大流。',
      '中和': '灵活多变，适合多元发展的职业路径。',
    },
  };

  const careerKey = pattern.patternName?.split('/')[0]?.trim() || '特殊格局';
  const career = careerAdvice[careerKey]?.[bodyStrength.strength] ||
    careerAdvice['特殊格局'][bodyStrength.strength] || '根据命局特点，选择能发挥个人优势的领域发展。';

  // 感情建议
  const emotionAdvice = () => {
    const spouseGan = cangGanDetail[2].cangGan[0]?.shiShen || '';
    if (spouseGan.includes('正财') || spouseGan.includes('偏财')) {
      return '夫妻宫坐财星，重视家庭生活，伴侣对你有助益。感情中容易以对方为中心，需注意保持自我边界。';
    }
    if (spouseGan.includes('正官') || spouseGan.includes('七杀')) {
      return '夫妻宫坐官杀，对伴侣有要求、有标准，希望对方有能力、有担当。感情中容易处于被引导或被管束的位置。';
    }
    if (spouseGan.includes('正印') || spouseGan.includes('偏印')) {
      return '夫妻宫坐印星，伴侣像你的精神导师或贵人，能给你支持和包容。感情较为内敛含蓄，重精神契合。';
    }
    if (spouseGan.includes('食神') || spouseGan.includes('伤官')) {
      return '夫妻宫坐食伤，感情中追求自由和表达，喜欢有趣的灵魂。需注意言语不要过于直接，以免伤害对方。';
    }
    return '夫妻宫坐比劫，感情中容易有竞争感，或伴侣性格与自己相似。需学会欣赏差异，互补而非比较。';
  };

  // 健康提示
  const healthAdvice = () => {
    const adviceMap: Record<string, string> = {
      '火': '五行缺火，注意心脏、血液循环、眼睛健康。多晒太阳，保持温暖，适度有氧运动。',
      '水': '五行缺水，注意肾脏、泌尿系统、内分泌平衡。多喝水，保持情绪流动，避免压抑。',
      '木': '五行缺木，注意肝胆、筋骨、神经系统。多接触绿色植物，保持心情舒畅，避免熬夜。',
      '金': '五行缺金，注意肺部、呼吸系统、皮肤。多吃白色食物（如百合、银耳），保持空气清新环境。',
      '土': '五行缺土，注意脾胃消化系统。饮食规律，避免暴饮暴食，可多吃黄色食物（如小米、南瓜）。',
    };
    return adviceMap[weakest] || '五行相对平衡，注意全面保养即可。';
  };

  // 性格分析
  const personalityAdvice = () => {
    if (bodyStrength.strength === '强') {
      return '身强之人，自我意识明确，有主见、有担当，做事有魄力。优点是独立、自信、抗压能力强；缺点是有时过于固执，听不进建议，容易独断专行。';
    }
    if (bodyStrength.strength === '偏弱') {
      return '身弱之人，心思细腻，善于体察他人，适应力强。优点是灵活、谦逊、善于借力；缺点是容易犹豫不决，缺乏主见，过于在意他人评价。';
    }
    return '身中和之人，刚柔并济，既有主见又善于听取意见。性格平衡，人际关系和谐，是比较理想的命局状态。';
  };

  // 事业方向
  const bodyType = bodyStrength.strength === '强' ? '身强' : bodyStrength.strength === '偏弱' ? '身弱' : '中和';
  const careerGuide = () => {
    if (bodyStrength.strength === '强') {
      return '适合主动进取、担当大任，但要学会倾听和授权，不要事事亲力亲为。';
    }
    if (bodyStrength.strength === '偏弱') {
      return '适合借力打力、合作共赢，不要强求独立扛下所有，学会寻求帮助是你的智慧。';
    }
    return '灵活多变，能屈能伸，这是最好的状态，保持即可。';
  };

  // 外显特质
  const externalTrait = ganShiShen.some((s: string) => s.includes('食伤'))
    ? '偏向才华、表达和创意'
    : ganShiShen.some((s: string) => s.includes('财'))
    ? '偏向务实、物质和执行力'
    : ganShiShen.some((s: string) => s.includes('官杀'))
    ? '偏向责任、自律和管理'
    : '偏向学识、思考和内省';

  // 感情补充
  const emotionExtra = bodyStrength.strength === '偏弱'
    ? '身弱之人，感情中容易处于被动位置，建议找性格温和、能包容你的伴侣，对方的印星或比劫可以补足你的能量。'
    : bodyStrength.strength === '强'
    ? '身强之人，感情中容易主导局面，需注意尊重伴侣意见，避免过于强势。适合的伴侣是能柔化你锋芒的人。'
    : '身中和之人，感情关系相对平衡，既能独立又能依赖，是比较理想的感情模式。';

  return [
    '【命盘深度解析】',
    '',
    name ? `亲爱的 ${name}，您好！` : '命主您好！',
    '',
    `您的八字为：**${pillars[0].gan}${pillars[0].zhi} · ${pillars[1].gan}${pillars[1].zhi} · ${pillars[2].gan}${pillars[2].zhi} · ${pillars[3].gan}${pillars[3].zhi}**`,
    '',
    '---',
    '',
    '一、日主与格局',
    '',
    `**日主 ${dayMaster}（${yinYang}性·${wuXing}命）**`,
    '',
    trait,
    '',
    `**日主强弱**：${bodyStrength.strength}（评分 ${bodyStrength.score}/10）`,
    bodyStrength.description,
    '',
    `**格局**：${pattern.patternName}`,
    pattern.patternDesc,
    '',
    '---',
    '',
    '二、地支藏干明细',
    '',
    cangGanText,
    '',
    '---',
    '',
    '三、天干透出十神',
    '',
    `年干、月干、时干透出：${ganShiShen.join('，')}`,
    '',
    '这些透出的十神是命局的"外显特质"——别人容易看到的你的能力和倾向。',
    '',
    '---',
    '',
    '四、五行能量分布',
    '',
    '| 五行 | 天干+本气藏干 | 含全部藏干 | 状态 |',
    '|------|------------|----------|------|',
    `| 金 | ${wuXingCount['金']} | ${wuXingFullCount['金']} | ${wuXingCount['金'] >= 2 ? '旺' : wuXingCount['金'] >= 1 ? '平' : '弱'} |`,
    `| 木 | ${wuXingCount['木']} | ${wuXingFullCount['木']} | ${wuXingCount['木'] >= 2 ? '旺' : wuXingCount['木'] >= 1 ? '平' : '弱'} |`,
    `| 水 | ${wuXingCount['水']} | ${wuXingFullCount['水']} | ${wuXingCount['水'] >= 2 ? '旺' : wuXingCount['水'] >= 1 ? '平' : '弱'} |`,
    `| 火 | ${wuXingCount['火']} | ${wuXingFullCount['火']} | ${wuXingCount['火'] >= 2 ? '旺' : wuXingCount['火'] >= 1 ? '平' : '弱'} |`,
    `| 土 | ${wuXingCount['土']} | ${wuXingFullCount['土']} | ${wuXingCount['土'] >= 2 ? '旺' : wuXingCount['土'] >= 1 ? '平' : '弱'} |`,
    '',
    `命盘中 **${strongest}** 能量最为突出，**${weakest}** 相对薄弱。`,
    weakest === '火' ? '火弱则阳气不足，注意心脏、眼睛保养，性格上可能缺乏热情和冲劲。' :
    weakest === '水' ? '水弱则智慧流通不畅，注意肾脏、泌尿系统，思维上可能偏于固执。' :
    weakest === '木' ? '木弱则生发之气不足，注意肝胆、筋骨，性格上可能缺乏主见和决断力。' :
    weakest === '金' ? '金弱则收敛之力不足，注意肺部、呼吸系统，性格上可能过于随和缺乏原则。' :
    '土弱则根基不稳，注意脾胃消化系统，性格上可能缺乏耐心和持久力。',
    '',
    '---',
    '',
    '五、调候用神（核心）',
    '',
    `**月令气候**：${climate || '未知'}`,
    '',
    `**调候原理**：${tiaoHouReason || ''}`,
    '',
    tiaoHouStatusText(),
    '',
    '调候用神是八字分析中最优先的考量。它解决的不是"五行够不够"，而是"气候对不对"。就像种花，不是只看出土多少，还要看温度湿度是否适合生长。',
    '',
    '---',
    '',
    '六、喜用神与忌神（综合调候+扶抑）',
    '',
    `**喜用神（优先补此五行）**：${usefulGodText}`,
    '',
    '喜用神 = 调候用神优先 + 扶抑辅助。调候用神解决"气候偏枯"，扶抑用神解决"五行强弱"。当两者冲突时，**调候优先**。',
    '',
    `**忌神（需避开的五行）**：${avoidGodText}`,
    '',
    '忌神是破坏调候、加剧五行失衡的能量。',
    '',
    `**闲神（作用不大）**：${neutralGodText}`,
    '',
    '闲神对命局无明显助益也无明显损害，大运流年中可能转化为喜或忌。',
    '',
    '---',
    '',
    '七、性格特质',
    '',
    `日主${dayMaster} (${bodyStrength.strength}) 的人，天生具有${trait.split('，')[0]}的底色。`,
    '',
    personalityAdvice(),
    '',
    `天干透出${ganShiShen.length >= 2 ? '多类十神' : ganShiShen.join('、')}，外显特质${externalTrait}。`,
    '',
    '---',
    '',
    '八、事业方向',
    '',
    career,
    '',
    '---',
    '',
    '九、感情婚姻',
    '',
    emotionAdvice(),
    '',
    emotionExtra,
    '',
    '---',
    '',
    '十、健康提示',
    '',
    healthAdvice(),
    '',
    '---',
    '',
    '十一、人生建议',
    '',
    `1. **认识自己的能量模式**：你是${bodyType}之人，${careerGuide()}`,
    '',
    `2. **善用喜用神**：${xi[0] || '根据调候与格局特点'} 对你有利，在生活中可以多亲近此类五行对应的色彩、方位、行业和人。`,
    '',
    `3. **避开忌神陷阱**：${ji[0] || '避免极端选择'} 对你不利，做重大决策时，可以反向思考——如果感觉某件事"特别顺手但不踏实"，可能正是忌神在诱你入局。`,
    '',
    '4. **核心真理**：八字是**能量地图**，不是**命运判决书**。调候用神告诉你"需要什么样的气候"，扶抑用神告诉你"需要补多少营养"。两者结合，才能真正读懂自己的命局。',
    '',
    '---',
    '',
    `${name ? name + '，' : ''}你的八字排盘准确无误，以上分析基于传统命理学「调候优先、扶抑辅助」的原则推演，旨在帮助你更好地认识自己。**命由天定，运由己造**。愿你在这条认识自我的路上，越走越好。`,
    '',
    '---',
    '*以上为系统深度解析。如需AI个性化深度分析，可在「设置」页面添加 Kimi API Key，获得更贴合个人情况的解读。*',
  ].join('\n');
}

// ===== analyzeBazi =====
export function analyzeBazi(birthDate: string, birthTime: string, name: string, gender: string, note?: string, apiKey?: string) {
  const bazi = calculateBazi(birthDate, birthTime)
  const combinedGod = calculateCombinedGod(bazi)

  // 先返回基础分析（同步）
  const backupAnalysis = generateBackupAnalysis(bazi, name, gender, combinedGod)

  return {
    ...bazi,
    combinedGod,
    aiAnalysis: backupAnalysis,
    _pendingAi: !!apiKey,
    _prompt: apiKey ? buildPrompt(bazi, name, gender, 'bazi', note) : undefined,
  }
}

// ===== analyzeDailyFortune =====
export function analyzeDailyFortune(
  todayGanZhi: any,
  baziResult: any,
) {
  const { dayMaster, tenGods, combinedGod } = baziResult;
  const today = todayGanZhi;

  // 今天各柱天干对命主的十神
  const dayGanSS = getShiShen(dayMaster, today.day.gan);
  const monthGanSS = getShiShen(dayMaster, today.month.gan);
  const yearGanSS = getShiShen(dayMaster, today.year.gan);

  // 日支本气十神
  const dayZhiCangGan = getCangGan(today.day.zhi);
  const dayZhiBenQiSS = dayZhiCangGan.length > 0
    ? getShiShen(dayMaster, dayZhiCangGan[0])
    : '未知';

  // 评分基础模板
  const scoreMap: Record<string, { career: number; wealth: number; love: number; health: number; summary: string; desc: string }> = {
    '正官': {
      career: 85, wealth: 70, love: 80, health: 85,
      summary: '正官临日，自律守规，贵人暗助',
      desc: '今日正官当值，做事有条理，适合处理正式事务、汇报工作、推进项目。人际关系中易得长辈或上级支持，但需注意不要过于拘谨。',
    },
    '正印': {
      career: 80, wealth: 65, love: 85, health: 90,
      summary: '印星护体，贵人扶持，学业精进',
      desc: '今日正印当值，思维清晰，适合学习、考试、写作、策划。易得贵人相助，精神层面充实。注意不要太依赖他人。',
    },
    '正财': {
      career: 75, wealth: 95, love: 75, health: 70,
      summary: '财星高照，进账有望，务实稳健',
      desc: '今日正财当值，财运突出，适合处理财务、签约、投资。做事踏实靠谱，是推进商业合作的好时机。注意不要因为利益忽视人情。',
    },
    '偏财': {
      career: 70, wealth: 90, love: 70, health: 65,
      summary: '偏财临门，意外之喜，灵活应变',
      desc: '今日偏财当值，有意外收获的可能，适合社交应酬、尝试新机会。偏财运佳但不稳定，不宜大额投机。',
    },
    '食神': {
      career: 80, wealth: 65, love: 65, health: 75,
      summary: '食神当值，才华横溢，享受生活',
      desc: '今日食神当值，表达能力强，适合演讲、创作、社交。心情愉悦，适合享受美食、艺术。注意言行不要过于随性。',
    },
    '伤官': {
      career: 75, wealth: 60, love: 55, health: 70,
      summary: '伤官见日，才思敏捷，注意言辞',
      desc: '今日伤官当值，创意爆发，思维活跃，适合创新、突破。但容易言辞尖锐，得罪他人。注意控制情绪，避免与人争执。',
    },
    '比肩': {
      career: 60, wealth: 55, love: 60, health: 80,
      summary: '比肩同气，竞争加剧，自力更生',
      desc: '今日比肩当值，容易遇到同类竞争者，适合独立作业而非团队合作。有自助能力，但合作中易产生分歧。',
    },
    '劫财': {
      career: 55, wealth: 45, love: 55, health: 75,
      summary: '劫财临日，破耗难免，谨慎理财',
      desc: '今日劫财当值，容易有意外支出或被人争夺资源。注意保管财物，避免借贷。合作中警惕利益分配不均。',
    },
    '七杀': {
      career: 70, wealth: 55, love: 45, health: 60,
      summary: '七杀当值，压力增大，谨慎行事',
      desc: '今日七杀当值，压力与挑战并存。适合攻坚克难，但要注意身体健康和情绪管理。感情中易有摩擦，不宜做重大决定。',
    },
  };

  const base = scoreMap[dayGanSS] || {
    career: 65, wealth: 65, love: 65, health: 65,
    summary: '运势平稳，按部就班',
    desc: '今日运势中性，没有特别突出的吉凶。适合按部就班处理日常事务，不宜做重大变动。',
  };

  // 根据日支本气微调
  const zhiAdjust: Record<string, Partial<typeof base>> = {
    '正官': { career: +5, love: +5 },
    '正印': { health: +5, career: +3 },
    '正财': { wealth: +5, love: +3 },
    '偏财': { wealth: +3, career: +2 },
    '食神': { career: +3, health: +3 },
    '伤官': { career: +3, love: -5 },
    '比肩': { career: -3, health: +3 },
    '劫财': { wealth: -5, health: +3 },
    '七杀': { career: -3, love: -5 },
  };

  const adjust = zhiAdjust[dayZhiBenQiSS] || {};
  const scores = {
    career: Math.min(100, Math.max(30, base.career + (adjust.career || 0))),
    wealth: Math.min(100, Math.max(30, base.wealth + (adjust.wealth || 0))),
    love: Math.min(100, Math.max(30, base.love + (adjust.love || 0))),
    health: Math.min(100, Math.max(30, base.health + (adjust.health || 0))),
  };

  const overall = Math.round((scores.career + scores.wealth + scores.love + scores.health) / 4);

  // 宜忌
  const suitableMap: Record<string, string[]> = {
    '正官': ['签约','面试','汇报','请教长辈','整理规划'],
    '正印': ['学习','考试','写作','冥想','拜访贵人'],
    '正财': ['理财','收款','商务洽谈','储蓄','务实决策'],
    '偏财': ['社交','尝试新机会','小投资','请客','拓展人脉'],
    '食神': ['演讲','创作','约会','美食','享受生活'],
    '伤官': ['创新','突破','艺术创作','表达观点','独立作业'],
    '比肩': ['健身','独立工作','自我提升','处理个人事务'],
    '劫财': ['休息','保守','避免借贷','独处','整理'],
    '七杀': ['攻坚克难','运动','解决问题','体检','独处思考'],
  };

  const unsuitableMap: Record<string, string[]> = {
    '正官': ['冒险投机','顶撞上级','懒散懈怠','冲动消费'],
    '正印': ['投机冒险','过度依赖','空想不行动','大额支出'],
    '正财': ['赌博投机','铺张浪费','冲动签约','替人担保'],
    '偏财': ['大额投资','孤立行动','闭门造车','过度承诺'],
    '食神': ['过度承诺','言语不慎','暴饮暴食','冒险决策'],
    '伤官': ['团队合作','言辞尖锐','顶撞权威','大额决策'],
    '比肩': ['合作签约','大额借贷','竞争项目','过度社交'],
    '劫财': ['借贷担保','合作投资','大额消费','冲动决策'],
    '七杀': ['冒险决策','感情争执','过度劳累','重大变动'],
  };

  // 吉时/凶时计算
  const hourShiShen = (shiShen: string) => {
    const good = ['正官','正印','正财','食神'];
    const bad = ['七杀','伤官','劫财'];
    if (good.includes(shiShen)) return '吉';
    if (bad.includes(shiShen)) return '凶';
    return '平';
  };

  const hourFortune = DI_ZHI.map((zhi, idx) => {
    const hourGan = calculateHourGan(dayMaster, idx);
    const ss = getShiShen(dayMaster, hourGan);
    return { zhi, hourGan, status: hourShiShen(ss) };
  });

  const luckyHours = hourFortune.filter(h => h.status === '吉').map(h => `${h.zhi}时(${h.hourGan}${h.zhi})`);
  const unluckyHours = hourFortune.filter(h => h.status === '凶').map(h => `${h.zhi}时(${h.hourGan}${h.zhi})`);

  // 开运色和方位（基于喜用神）
  const colorMap: Record<string, string> = {
    '金': '白色、金色、银色',
    '木': '绿色、青色、翠色',
    '水': '黑色、深蓝、灰色',
    '火': '红色、橙色、紫色',
    '土': '黄色、棕色、米色',
  };

  const directionMap: Record<string, string> = {
    '金': '西方',
    '木': '东方',
    '水': '北方',
    '火': '南方',
    '土': '中央/本地',
  };

  const wxMap: Record<string, string> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
    '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  };

  const xi = combinedGod?.xi || [];
  const xiWuXing = xi.map((g: string) => wxMap[g] || g);
  const luckyColor = colorMap[xiWuXing[0]] || colorMap[xi[0]] || '根据命局喜用选择';
  const luckyDirection = directionMap[xiWuXing[0]] || directionMap[xi[0]] || '根据命局喜用选择';

  return {
    today,
    dayShiShen: {
      gan: dayGanSS,
      zhiBenQi: dayZhiBenQiSS,
      monthGan: monthGanSS,
      yearGan: yearGanSS,
    },
    scores: {
      overall,
      ...scores,
    },
    summary: base.summary,
    description: base.desc,
    suitable: suitableMap[dayGanSS] || ['日常事务'],
    unsuitable: unsuitableMap[dayGanSS] || ['重大决策'],
    luckyHours,
    unluckyHours,
    luckyColor,
    luckyDirection,
  };
}

// ===== analyzeMarriage =====
export function analyzeMarriage(maleBazi: any, femaleBazi: any, maleName: string, femaleName: string) {
  const m = maleBazi;
  const f = femaleBazi;

  // 天干五合
  const TIAN_GAN_WU_HE: Record<string, string> = {
    "甲": "己", "己": "甲",
    "乙": "庚", "庚": "乙",
    "丙": "辛", "辛": "丙",
    "丁": "壬", "壬": "丁",
    "戊": "癸", "癸": "戊",
  };

  // 地支六合
  const DI_ZHI_LIU_HE: Record<string, string> = {
    "子": "丑", "丑": "子",
    "寅": "亥", "亥": "寅",
    "卯": "戌", "戌": "卯",
    "辰": "酉", "酉": "辰",
    "巳": "申", "申": "巳",
    "午": "未", "未": "午",
  };

  // 地支三合
  const DI_ZHI_SAN_HE: Record<string, string[]> = {
    "申": ["子", "辰"], "子": ["申", "辰"], "辰": ["申", "子"],
    "寅": ["午", "戌"], "午": ["寅", "戌"], "戌": ["寅", "午"],
    "巳": ["酉", "丑"], "酉": ["巳", "丑"], "丑": ["巳", "酉"],
    "亥": ["卯", "未"], "卯": ["亥", "未"], "未": ["亥", "卯"],
  };

  // 地支六冲
  const DI_ZHI_CHONG: Record<string, string> = {
    "子": "午", "午": "子",
    "丑": "未", "未": "丑",
    "寅": "申", "申": "寅",
    "卯": "酉", "酉": "卯",
    "辰": "戌", "戌": "辰",
    "巳": "亥", "亥": "巳",
  };

  // 地支六害
  const DI_ZHI_HAI: Record<string, string> = {
    "子": "未", "未": "子",
    "丑": "午", "午": "丑",
    "寅": "巳", "巳": "寅",
    "卯": "辰", "辰": "卯",
    "申": "亥", "亥": "申",
    "酉": "戌", "戌": "酉",
  };

  const mDayMaster = m.dayMaster;
  const fDayMaster = f.dayMaster;
  const mDayZhi = m.pillars[2].zhi;
  const fDayZhi = f.pillars[2].zhi;

  const ganHeMatch = TIAN_GAN_WU_HE[mDayMaster] === fDayMaster;
  const zhiHeMatch = DI_ZHI_LIU_HE[mDayZhi] === fDayZhi;
  let sanHeMatch = false;
  const mSanHe = DI_ZHI_SAN_HE[mDayZhi];
  if (mSanHe && mSanHe.includes(fDayZhi)) sanHeMatch = true;
  const fSanHe = DI_ZHI_SAN_HE[fDayZhi];
  if (fSanHe && fSanHe.includes(mDayZhi)) sanHeMatch = true;
  const chongMatch = DI_ZHI_CHONG[mDayZhi] === fDayZhi;
  const haiMatch = DI_ZHI_HAI[mDayZhi] === fDayZhi;

  // 五行互补
  const mWx = m.wuXingFullCount;
  const fWx = f.wuXingFullCount;
  const mTotal = Object.values(mWx).reduce((a: any, b: any) => a + b, 0) as number;
  const fTotal = Object.values(fWx).reduce((a: any, b: any) => a + b, 0) as number;

  let complementScore = 0;
  const complementDetails: string[] = [];

  ["金", "木", "水", "火", "土"].forEach((wx) => {
    const mRatio = (mWx[wx] || 0) / mTotal;
    const fRatio = (fWx[wx] || 0) / fTotal;
    if (mRatio > 0.25 && fRatio < 0.15) {
      complementScore += 15;
      complementDetails.push(`男方${wx}旺，女方${wx}弱，男方补足女方`);
    } else if (fRatio > 0.25 && mRatio < 0.15) {
      complementScore += 15;
      complementDetails.push(`女方${wx}旺，男方${wx}弱，女方补足男方`);
    }
  });

  // 喜用神互济
  const mXi = m.combinedGod?.xi || [];
  const fXi = f.combinedGod?.xi || [];
  const wxMap: Record<string, string> = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土",
    "庚": "金", "辛": "金", "壬": "水", "癸": "水",
  };

  const xiJiScore = (xi1: string[], targetDayMaster: string) => {
    let score = 0;
    const targetWx = wxMap[targetDayMaster] || "";
    xi1.forEach((wx) => {
      if (wx === targetWx) score += 20;
    });
    return score;
  };

  const mHelpF = xiJiScore(mXi, fDayMaster);
  const fHelpM = xiJiScore(fXi, mDayMaster);

  // 十神互动
  const mToF_SS = getShiShen(fDayMaster, mDayMaster);
  const fToM_SS = getShiShen(mDayMaster, fDayMaster);

  const idealPairs = [
    { m: "正财", f: "正官", desc: "财官相生，传统美满婚姻" },
    { m: "正官", f: "正印", desc: "官印相生，夫贵妻贤" },
    { m: "食神", f: "正印", desc: "食印相生，互相滋养" },
    { m: "偏财", f: "正官", desc: "财官双美，富贵双全" },
  ];

  const pairMatch = idealPairs.find((p) => p.m === mToF_SS && p.f === fToM_SS);

  // 综合评分
  let totalScore = 60;
  if (ganHeMatch) totalScore += 15;
  if (zhiHeMatch) totalScore += 10;
  if (sanHeMatch) totalScore += 8;
  if (pairMatch) totalScore += 12;
  totalScore += complementScore;
  totalScore += mHelpF;
  totalScore += fHelpM;
  if (chongMatch) totalScore -= 20;
  if (haiMatch) totalScore -= 12;
  totalScore = Math.min(100, Math.max(20, totalScore));

  // 角色分析
  const roleAnalysis = () => {
    let mRole = "";
    let fRole = "";
    if (["正财", "偏财"].includes(mToF_SS)) {
      mRole = "男方视女方为财星，重视家庭，愿意为家庭付出物质支持。";
    } else if (["正官", "七杀"].includes(mToF_SS)) {
      mRole = "男方视女方为官杀，有敬畏之心，愿意承担责任。";
    } else if (["食神", "伤官"].includes(mToF_SS)) {
      mRole = "男方视女方为食伤，欣赏女方的才华和表达，关系轻松有趣。";
    } else if (["正印", "偏印"].includes(mToF_SS)) {
      mRole = "男方视女方为印星，依赖女方的智慧和支持，女方像精神导师。";
    } else {
      mRole = "男方视女方为同类，平等相待，既有竞争也有默契。";
    }

    if (["正官", "七杀"].includes(fToM_SS)) {
      fRole = "女方视男方为官杀，希望男方有担当、有能力，对男方有要求。";
    } else if (["正财", "偏财"].includes(fToM_SS)) {
      fRole = "女方视男方为财星，重视物质安全，希望男方提供稳定生活。";
    } else if (["正印", "偏印"].includes(fToM_SS)) {
      fRole = "女方视男方为印星，依赖男方的智慧和包容，男方像避风港。";
    } else if (["食神", "伤官"].includes(fToM_SS)) {
      fRole = "女方视男方为食伤，欣赏男方的才华，关系轻松自在。";
    } else {
      fRole = "女方视男方为同类，平等相待，既是伴侣也是战友。";
    }
    return { mRole, fRole };
  };

  const roles = roleAnalysis();

  const getLevel = () => {
    if (totalScore >= 85) return { level: "天作之合", color: "text-red-600", desc: "缘分深厚，五行互补，十神和谐，是非常理想的婚配组合。" };
    if (totalScore >= 70) return { level: "良缘佳配", color: "text-amber-600", desc: "有较好的互补性，虽有差异但可互相成就，用心经营可得美满婚姻。" };
    if (totalScore >= 55) return { level: "中等缘分", color: "text-blue-600", desc: "缘分中等，需要双方更多包容和理解。差异是挑战也是成长机会。" };
    return { level: "缘分较浅", color: "text-ink-500", desc: "五行冲突较多，相处中易有摩擦。若选择在一起，需要极大的耐心和智慧来磨合。" };
  };

  const level = getLevel();

  const suggestions: string[] = [];
  if (chongMatch) suggestions.push("日支相冲，日常生活中容易意见不合，建议遇到分歧时先冷静，避免正面冲突。");
  if (haiMatch) suggestions.push("日支相害，关系中暗藏隐患，需要多沟通，不要让小问题积累。");
  if (!ganHeMatch && !zhiHeMatch) suggestions.push("日主无明显合象，缘分需后天培养，多创造共同经历和回忆。");
  if (complementScore >= 30) suggestions.push("五行互补度高，你们在能量层面有很好的互相滋养，这是很大的优势。");
  if (mHelpF > 0 || fHelpM > 0) suggestions.push("喜用神互济，你们的结合能互相提升运势，是\"旺对方\"的组合。");
  if (suggestions.length === 0) suggestions.push("你们的八字组合相对平衡，保持现状、用心经营即可。");

  return {
    score: totalScore,
    level: level.level,
    levelColor: level.color,
    levelDesc: level.desc,
    ganHeMatch,
    zhiHeMatch,
    sanHeMatch,
    chongMatch,
    haiMatch,
    mToF_SS,
    fToM_SS,
    pairMatch,
    complementScore,
    complementDetails,
    mHelpF,
    fHelpM,
    roles,
    suggestions,
  };
}

// ===== analyzeCareer =====
export function analyzeCareer(maleBazi: any, femaleBazi: any, maleName: string, femaleName: string) {
  const m = maleBazi;
  const f = femaleBazi;

  const mDayMaster = m.dayMaster;
  const fDayMaster = f.dayMaster;
  const mDayZhi = m.pillars[2].zhi;
  const fDayZhi = f.pillars[2].zhi;

  // 天干五合
  const TIAN_GAN_WU_HE: Record<string, string> = {
    "甲": "己", "己": "甲",
    "乙": "庚", "庚": "乙",
    "丙": "辛", "辛": "丙",
    "丁": "壬", "壬": "丁",
    "戊": "癸", "癸": "戊",
  };

  // 地支六合
  const DI_ZHI_LIU_HE: Record<string, string> = {
    "子": "丑", "丑": "子",
    "寅": "亥", "亥": "寅",
    "卯": "戌", "戌": "卯",
    "辰": "酉", "酉": "辰",
    "巳": "申", "申": "巳",
    "午": "未", "未": "午",
  };

  const ganHeMatch = TIAN_GAN_WU_HE[mDayMaster] === fDayMaster;
  const zhiHeMatch = DI_ZHI_LIU_HE[mDayZhi] === fDayZhi;

  // 五行互补（侧重资源互补）
  const mWx = m.wuXingFullCount;
  const fWx = f.wuXingFullCount;
  const mTotal = Object.values(mWx).reduce((a: any, b: any) => a + b, 0) as number;
  const fTotal = Object.values(fWx).reduce((a: any, b: any) => a + b, 0) as number;

  let complementScore = 0;
  const complementDetails: string[] = [];

  ["金", "木", "水", "火", "土"].forEach((wx) => {
    const mRatio = (mWx[wx] || 0) / mTotal;
    const fRatio = (fWx[wx] || 0) / fTotal;
    if (mRatio > 0.25 && fRatio < 0.15) {
      complementScore += 12;
      complementDetails.push(`甲方${wx}旺，乙方${wx}弱，甲方在${wx}相关领域有资源优势`);
    } else if (fRatio > 0.25 && mRatio < 0.15) {
      complementScore += 12;
      complementDetails.push(`乙方${wx}旺，甲方${wx}弱，乙方在${wx}相关领域有资源优势`);
    }
  });

  // 喜用神互济
  const mXi = m.combinedGod?.xi || [];
  const fXi = f.combinedGod?.xi || [];
  const wxMap: Record<string, string> = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土",
    "庚": "金", "辛": "金", "壬": "水", "癸": "水",
  };

  const xiJiScore = (xi1: string[], targetDayMaster: string) => {
    let score = 0;
    const targetWx = wxMap[targetDayMaster] || "";
    xi1.forEach((wx) => {
      if (wx === targetWx) score += 18;
    });
    return score;
  };

  const mHelpF = xiJiScore(mXi, fDayMaster);
  const fHelpM = xiJiScore(fXi, mDayMaster);

  // 十神互动（事业视角）
  const mToF_SS = getShiShen(fDayMaster, mDayMaster);
  const fToM_SS = getShiShen(mDayMaster, fDayMaster);

  // 理想事业合作组合
  const idealPairs = [
    { m: "正财", f: "正官", desc: "财官相生，甲方擅长开拓，乙方擅长管理，互补型黄金搭档" },
    { m: "食神", f: "正印", desc: "食印相生，甲方创意输出，乙方资源整合，创新驱动型组合" },
    { m: "偏财", f: "正官", desc: "财官双美，甲方善于把握机会，乙方稳健执行，扩张型组合" },
    { m: "正官", f: "正财", desc: "官财相生，甲方管理能力+乙方资源整合，稳健经营型组合" },
  ];

  const pairMatch = idealPairs.find((p) => p.m === mToF_SS && p.f === fToM_SS);

  // 角色分析（事业视角）
  const roleAnalysis = () => {
    let mRole = "";
    let fRole = "";

    if (["正财", "偏财"].includes(mToF_SS)) {
      mRole = "甲方是乙方的财星——能为乙方带来资源、客户、收益。适合作为业务负责人或市场拓展角色。";
    } else if (["正官", "七杀"].includes(mToF_SS)) {
      mRole = "甲方是乙方的官杀——能约束、规范乙方，适合作为管理者或风控负责人。";
    } else if (["食神", "伤官"].includes(mToF_SS)) {
      mRole = "甲方是乙方的食伤——能为乙方提供创意、技术、内容输出。适合作为产品、研发或创意负责人。";
    } else if (["正印", "偏印"].includes(mToF_SS)) {
      mRole = "甲方是乙方的印星——能为乙方提供智慧、战略、资源支持。适合作为顾问、战略规划者。";
    } else {
      mRole = "甲方与乙方是同类——既是战友也是竞争者。适合各自负责独立板块，避免直接竞争同一资源。";
    }

    if (["正财", "偏财"].includes(fToM_SS)) {
      fRole = "乙方是甲方的财星——能为甲方带来资源转化和收益。适合作为运营、销售或财务负责人。";
    } else if (["正官", "七杀"].includes(fToM_SS)) {
      fRole = "乙方是甲方的官杀——能规范、约束甲方，适合作为管理者或流程把控者。";
    } else if (["食神", "伤官"].includes(fToM_SS)) {
      fRole = "乙方是甲方的食伤——能为甲方提供创意和技术支持。适合作为技术、产品或内容负责人。";
    } else if (["正印", "偏印"].includes(fToM_SS)) {
      fRole = "乙方是甲方的印星——能为甲方提供战略智慧和资源整合。适合作为战略规划者或投资人。";
    } else {
      fRole = "乙方与甲方是同类——既是战友也是竞争者。适合各自负责独立板块，避免资源重叠。";
    }

    return { mRole, fRole };
  };

  const roles = roleAnalysis();

  // 综合评分
  let totalScore = 60;
  if (ganHeMatch) totalScore += 12;
  if (zhiHeMatch) totalScore += 8;
  if (pairMatch) totalScore += 15;
  totalScore += complementScore;
  totalScore += mHelpF;
  totalScore += fHelpM;
  totalScore = Math.min(100, Math.max(20, totalScore));

  const getLevel = () => {
    if (totalScore >= 85) return { level: "黄金搭档", color: "text-amber-600", desc: "五行互补、十神协同、喜用神互济，是非常理想的商业合作伙伴。" };
    if (totalScore >= 70) return { level: "优质伙伴", color: "text-blue-600", desc: "有较好的互补性，合作中能互相成就，适合长期深度合作。" };
    if (totalScore >= 55) return { level: "普通合作", color: "text-ink-600", desc: "合作可行，但需要明确分工和边界，避免资源冲突。" };
    return { level: "谨慎合作", color: "text-ink-500", desc: "五行冲突较多，合作中易产生分歧。若必须合作，建议短期项目制，明确权责。" };
  };

  const level = getLevel();

  const suggestions: string[] = [];
  if (complementScore >= 24) suggestions.push("五行互补度高，双方在资源、能力上形成天然互补，这是合作的最大优势。");
  if (mHelpF > 0 || fHelpM > 0) suggestions.push("喜用神互济，合作能互相提升运势，属于「旺对方」的组合，合作对双方都有利。");
  if (pairMatch) suggestions.push(`十神组合理想（${pairMatch.desc}），双方在角色定位上天然契合。`);
  if (!ganHeMatch && !zhiHeMatch) suggestions.push("日主无明显合象，合作需要后天磨合，建议先从小项目试水。");
  if (mToF_SS === "比肩" || mToF_SS === "劫财") suggestions.push("甲方是乙方的比劫——存在竞争关系，合作中需明确利益分配，避免资源争夺。");
  if (fToM_SS === "比肩" || fToM_SS === "劫财") suggestions.push("乙方是甲方的比劫——存在竞争关系，建议各自负责不同板块，避免直接竞争。");
  if (suggestions.length === 0) suggestions.push("合作组合相对平衡，保持清晰的分工和沟通机制即可。");

  return {
    score: totalScore,
    level: level.level,
    levelColor: level.color,
    levelDesc: level.desc,
    ganHeMatch,
    zhiHeMatch,
    mToF_SS,
    fToM_SS,
    pairMatch,
    complementScore,
    complementDetails,
    mHelpF,
    fHelpM,
    roles,
    suggestions,
  };
}

// ===== buildCareerPrompt =====
export function buildCareerPrompt(
  maleBazi: any,
  femaleBazi: any,
  maleName: string,
  femaleName: string,
  careerResult: any
): string {
  const m = maleBazi;
  const f = femaleBazi;
  const r = careerResult;

  const mPillars = m.pillars.map((p: any) => `${p.name}: ${p.gan}${p.zhi}`).join('\n');
  const fPillars = f.pillars.map((p: any) => `${p.name}: ${p.gan}${p.zhi}`).join('\n');

  const mCangGan = m.cangGanDetail?.map((cg: any) => {
    const ganTexts = cg.cangGan.map((item: any) => `${item.gan}(${item.qi}·${item.shiShen})`).join('，');
    return `${cg.name} ${cg.zhi}：${ganTexts}`;
  }).join('\n') || '';

  const fCangGan = f.cangGanDetail?.map((cg: any) => {
    const ganTexts = cg.cangGan.map((item: any) => `${item.gan}(${item.qi}·${item.shiShen})`).join('，');
    return `${cg.name} ${cg.zhi}：${ganTexts}`;
  }).join('\n') || '';

  const mWuXingText = Object.entries(m.wuXingFullCount || {}).map(([k, v]) => `${k}: ${v}`).join(', ');
  const fWuXingText = Object.entries(f.wuXingFullCount || {}).map(([k, v]) => `${k}: ${v}`).join(', ');

  return [
    '请为以下双方八字进行专业级事业合作深度分析：',
    '',
    '【甲方信息】',
    `- 姓名：${maleName || '未提供'}`,
    `- 日主：${m.dayMaster}（${m.yinYang}性·${m.wuXing}命）`,
    `- 日主强弱：${m.bodyStrength?.strength || '未知'}（评分${m.bodyStrength?.score || '-'}/10）`,
    `- 格局：${m.pattern?.patternName || '未知'}`,
    `- 喜用神：${m.combinedGod?.xi?.join('、') || '需结合大运判断'}`,
    `- 忌神：${m.combinedGod?.ji?.join('、') || '需结合大运判断'}`,
    '',
    '甲方八字排盘：',
    mPillars,
    '',
    '甲方地支藏干：',
    mCangGan,
    '',
    `甲方五行分布：${mWuXingText}`,
    '',
    '【乙方信息】',
    `- 姓名：${femaleName || '未提供'}`,
    `- 日主：${f.dayMaster}（${f.yinYang}性·${f.wuXing}命）`,
    `- 日主强弱：${f.bodyStrength?.strength || '未知'}（评分${f.bodyStrength?.score || '-'}/10）`,
    `- 格局：${f.pattern?.patternName || '未知'}`,
    `- 喜用神：${f.combinedGod?.xi?.join('、') || '需结合大运判断'}`,
    `- 忌神：${f.combinedGod?.ji?.join('、') || '需结合大运判断'}`,
    '',
    '乙方八字排盘：',
    fPillars,
    '',
    '乙方地支藏干：',
    fCangGan,
    '',
    `乙方五行分布：${fWuXingText}`,
    '',
    '【算法评分结果】',
    `- 综合契合度：${r.score}分（${r.level}）`,
    `- 天干五合：${r.ganHeMatch ? '有' : '无'}`,
    `- 地支六合：${r.zhiHeMatch ? '有' : '无'}`,
    `- 十神互动：甲方对乙方为「${r.mToF_SS}」，乙方对甲方为「${r.fToM_SS}」`,
    `- 五行互补：${r.complementDetails.join('；') || '无明显互补'}`,
    `- 喜用神互济：甲方旺乙方${r.mHelpF > 0 ? '✓' : '○'}，乙方旺甲方${r.fHelpM > 0 ? '✓' : '○'}`,
    '',
    '请从以下几个维度进行深度分析：',
    '',
    '一、双方命盘基础解读',
    '- 分别解读甲乙双方的日主特性、性格底色、行事风格',
    '- 分析双方格局特点对事业取向的影响',
    '',
    '二、五行能量对比分析',
    '- 双方五行分布对比，找出能量共振与冲突点',
    '- 分析五行互补如何影响合作中的资源调配',
    '',
    '三、十神互动深度解析',
    `- 甲方对乙方为「${r.mToF_SS}」：这种关系在商业合作中意味着什么？`,
    `- 乙方对甲方为「${r.fToM_SS}」：这种关系在商业合作中意味着什么？`,
    '- 双方在合作中天然形成的角色分工',
    '',
    '四、合作模式与场景建议',
    '- 最适合的合作模式（合伙创业、项目合作、投资关系、顾问关系等）',
    '- 各自在合作中的最佳角色定位',
    '- 合作中的决策分工建议',
    '',
    '五、事业与财运协同分析',
    '- 双方事业运势的协同效应',
    '- 合作对双方财运的影响',
    '- 最适合一起做的行业/项目类型',
    '',
    '六、风险预警与规避建议',
    '- 合作中可能出现的摩擦点',
    '- 利益分配的建议原则',
    '- 需要特别警惕的合作陷阱',
    '',
    '七、综合结论与行动建议',
    '- 给出明确的合作建议（强烈推荐/值得尝试/谨慎推进/不建议）',
    '- 如果建议合作，给出第一步行动建议',
    '- 合作中的关键成功因素',
    '',
    '分析要求：',
    '- 用现代商业语言解读，避免传统命理术语堆砌',
    '- 结合双方八字特点给出具体的、可执行的建议',
    '- 不迷信不恐吓，理性分析合作的优劣势',
    '- 总字数控制在1500-2500字',
    '- 结构清晰，使用Markdown格式的小标题',
  ].filter(Boolean).join('\n');
}

// ===== getCareerAiAnalysis =====
export async function getCareerAiAnalysis(
  maleBazi: any,
  femaleBazi: any,
  maleName: string,
  femaleName: string,
  careerResult: any,
): Promise<string> {
  try {
    const prompt = buildCareerPrompt(maleBazi, femaleBazi, maleName, femaleName, careerResult);
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemPrompt: '你是一位精通传统命理学的 AI 事业合作分析师，擅长从八字角度分析商业合作契合度。你用现代商业语言解读命理，不迷信不恐吓，帮助创业者和商务人士找到最佳合作伙伴，规避合作风险。',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.content || '';
    }
  } catch (error) {
    console.error('Career AI analysis error:', error);
  }

  return '';
}
