import { calculateBazi } from '@/lib/bazi'

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

export async function getAiAnalysis(bazi: any, name: string, gender: string, type: string, note?: string, apiKey?: string): Promise<string> {
  if (!apiKey) return ''
  
  try {
    const prompt = buildPrompt(bazi, name, gender, type, note)
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: '你是一位精通传统命理学的 AI 命理分析师。你擅长通过八字命盘分析个人性格、运势、事业、感情等方面。你的分析风格是理性客观的，用现代语言解读传统命理，不迷信不恐吓，帮助用户更好地认识自己。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.choices?.[0]?.message?.content || ''
    }
  } catch (error) {
    console.error('Kimi API error:', error)
  }
  
  return ''
}

export function generateBackupAnalysis(bazi: any, name: string, gender: string): string {
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
  
  // 日主性格描述
  const dayMasterTraits: Record<string, string> = {
    '甲': '如参天大树，志向高远，有领袖气质，正直坚韧。做事有始有终，但有时过于固执，不善于妥协。',
    '乙': '如花草藤蔓，柔韧灵活，善于适应环境，心思细腻。外表温和，内心有主见，擅长以柔克刚。',
    '丙': '如太阳之火，热情开朗，光芒万丈，感染力强。为人慷慨大方，喜欢表达，但有时过于急躁。',
    '丁': '如灯烛之火，温暖内敛，专注执着，精益求精。心思缜密，有艺术天赋，容易陷入完美主义。',
    '戊': '如城墙之土，稳重踏实，包容力强，值得信赖。做事一步一个脚印，但有时过于保守，缺乏变通。',
    '己': '如田园之土，温和滋养，善于培育，细致入微。适应力强，善于协调，但容易过于迁就他人。',
    '庚': '如刀剑之金，刚毅果断，有魄力，执行力强。追求公平正义，有改革精神，但有时锋芒太露。',
    '辛': '如珠玉之金，精致细腻，审美出众，追求完美。心思灵巧，重情重义，但容易敏感多虑。',
    '壬': '如江河之水，智慧流动，思维活跃，善于变通。胸怀开阔，有冒险精神，但容易缺乏定力。',
    '癸': '如雨露之水，温柔内敛，直觉敏锐，富有灵性。心思深沉，善于倾听，但容易情绪化。',
  }
  
  const trait = dayMasterTraits[dayMaster] || '具有独特的个人气质，刚柔并济，潜力巨大。'
  
  // 藏干明细展示
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
  
  // 天干透出十神分析
  const ganShiShen = pillars
    .filter((p: any) => p.name !== '日柱')
    .map((p: any) => {
      const ss = tenGods[p.gan];
      return ss ? `${p.gan}（${ss}）` : '';
    })
    .filter(Boolean);

  // 喜用神与忌神
  const usefulGod = pattern.usefulGod?.join('、') || '需结合大运流年判断';
  const avoidGod = pattern.avoidGod?.join('、') || '需结合大运流年判断';

  // 根据格局和强弱给出事业建议
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

  // 外显特质判断
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
    '### 一、日主与格局',
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
    '### 二、地支藏干明细',
    '',
    cangGanText,
    '',
    '---',
    '',
    '### 三、天干透出十神',
    '',
    `年干、月干、时干透出：${ganShiShen.join('，')}`,
    '',
    '这些透出的十神是命局的"外显特质"——别人容易看到的你的能力和倾向。',
    '',
    '---',
    '',
    '### 四、五行能量分布',
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
    '### 五、喜用神与忌神',
    '',
    `**喜用神**：${usefulGod}`,
    '',
    '喜用神是命局中最需要补充的能量，代表对你最有利的人和事物方向。',
    '',
    `**忌神**：${avoidGod}`,
    '',
    '忌神是命局中过剩或对你不利的能量，知道忌神可以帮助你避开不适合的选择。',
    '',
    '---',
    '',
    '### 六、性格特质',
    '',
    `日主${dayMaster} (${bodyStrength.strength}) 的人，天生具有${trait.split('，')[0]}的底色。`,
    '',
    personalityAdvice(),
    '',
    `天干透出${ganShiShen.length >= 2 ? '多类十神' : ganShiShen.join('、')}，外显特质${externalTrait}。`,
    '',
    '---',
    '',
    '### 七、事业方向',
    '',
    career,
    '',
    '---',
    '',
    '### 八、感情婚姻',
    '',
    emotionAdvice(),
    '',
    emotionExtra,
    '',
    '---',
    '',
    '### 九、健康提示',
    '',
    healthAdvice(),
    '',
    '---',
    '',
    '### 十、人生建议',
    '',
    `1. **认识自己的能量模式**：你是${bodyType}之人，${careerGuide()}`,
    '',
    `2. **善用喜用神**：${pattern.usefulGod?.[0] || '根据格局特点'} 对你有利，在生活中可以多亲近此类五行对应的色彩、方位、行业和人。`,
    '',
    `3. **避开忌神陷阱**：${pattern.avoidGod?.[0] || '避免极端选择'} 对你不利，做重大决策时，可以反向思考——如果感觉某件事"特别顺手但不踏实"，可能正是忌神在诱你入局。`,
    '',
    '4. **记住核心真理**：八字是**能量地图**，不是**命运判决书**。知道自己是身强还是身弱，就像知道自己是跑车还是SUV——各有各的路，没有好坏之分。关键在于：**走对路，用对油**。',
    '',
    '---',
    '',
    `${name ? name + '，' : ''}你的八字排盘准确无误，以上分析基于传统命理逻辑推演，旨在帮助你更好地认识自己。**命由天定，运由己造**。愿你在这条认识自我的路上，越走越好。`,
    '',
    '---',
    '*以上为系统深度解析。如需AI个性化深度分析，可在「设置」页面添加 Kimi API Key，获得更贴合个人情况的解读。*',
  ].join('\n');
}

export function analyzeBazi(birthDate: string, birthTime: string, name: string, gender: string, note?: string, apiKey?: string) {
  const bazi = calculateBazi(birthDate, birthTime)
  
  // 先返回基础分析（同步）
  const backupAnalysis = generateBackupAnalysis(bazi, name, gender)
  
  return {
    ...bazi,
    aiAnalysis: backupAnalysis,
    _pendingAi: !!apiKey,
    _prompt: apiKey ? buildPrompt(bazi, name, gender, 'bazi', note) : undefined,
  }
}
