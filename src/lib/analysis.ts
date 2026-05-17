import { calculateBazi } from '@/lib/bazi'

export function buildPrompt(bazi: any, name: string, gender: string, type: string, note?: string): string {
  const { pillars, dayMaster, wuXingCount, yinYang, wuXing } = bazi
  
  const pillarsText = pillars.map((p: any) => `${p.name}: ${p.gan}${p.zhi}`).join('\n')
  const wuXingText = Object.entries(wuXingCount).map(([k, v]) => `${k}: ${v}`).join(', ')

  return `请为以下八字命盘进行详细分析：

命主信息：
- 姓名：${name || '未提供'}
- 性别：${gender === 'male' ? '男' : '女'}
- 日主：${dayMaster}（${yinYang}${wuXing}）
${note ? `- 备注：${note}` : ''}

八字排盘：
${pillarsText}

五行分布：${wuXingText}

请从以下几个方面进行分析：
1. 性格特质（基于日主和五行分布）
2. 事业发展方向（适合什么类型的工作）
3. 财运分析
4. 感情婚姻
5. 健康注意事项
6. 人生建议

要求：
- 用温暖理性的语气，不要恐吓
- 结合现代生活场景给出具体建议
- 强调命运掌握在自己手中，八字只是参考
- 总字数控制在800-1200字`
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
  const { dayMaster, wuXing, yinYang, wuXingCount } = bazi
  
  // 找出最多的五行和最少的五行
  const sortedWuXing = Object.entries(wuXingCount).sort((a, b) => (b[1] as number) - (a[1] as number))
  const strongest = sortedWuXing[0][0]
  const weakest = sortedWuXing[sortedWuXing.length - 1][0]

  // 日主性格描述
  const dayMasterTraits: Record<string, string> = {
    '甲': '如参天大树，向上生长，有领导气质，正直有担当',
    '乙': '如花草藤蔓，柔韧灵活，善于适应环境，心思细腻',
    '丙': '如太阳之火，热情开朗，光芒四射，感染力强',
    '丁': '如灯烛之火，温暖内敛，专注执着，精益求精',
    '戊': '如城墙之土，稳重踏实，包容力强，值得信赖',
    '己': '如田园之土，温和滋养，善于培育，细致入微',
    '庚': '如刀剑之金，刚毅果断，有魄力，执行力强',
    '辛': '如珠玉之金，精致细腻，审美出众，追求完美',
    '壬': '如江河之水，智慧流动，思维活跃，善于变通',
    '癸': '如雨露之水，温柔内敛，直觉敏锐，富有灵性',
  }

  const trait = dayMasterTraits[dayMaster] || '具有独特的个人魅力'

  // 五行旺衰建议
  const wuXingAdvice: Record<string, string> = {
    '金': '可适当佩戴金属饰品，关注呼吸系统健康，适合从事金融、法律、科技等行业',
    '木': '多接触自然环境，养护绿植，关注肝胆健康，适合从事教育、文化、设计等行业',
    '水': '保持学习热情，多饮水，关注肾脏健康，适合从事贸易、物流、咨询等行业',
    '火': '保持积极心态，适度运动，关注心脏健康，适合从事传媒、演艺、餐饮等行业',
    '土': '保持规律作息，注重脾胃调养，适合从事房地产、农业、管理等行业',
  }

  return `【命盘基础解析】

亲爱的${name || '命主'}，您好！

您的日主为 **${dayMaster}**，属${yinYang}性${wuXing}命。

【性格特质】
${dayMaster}日主的人，${trait}。命盘中${strongest}五行能量最为突出，这赋予您在此领域的天然优势与强烈倾向。

【五行平衡】
您的命盘中${strongest}较旺，${weakest}相对较弱。在生活中可多关注${weakest}相关的方面来调和能量：
- ${wuXingAdvice[weakest] || '注意身心平衡'}

【事业方向】
基于您的日主${dayMaster}（${wuXing}命），适合发挥${trait.split('，')[0]}的特质。${strongest}旺的您，在与${strongest}相关的领域容易获得成就感。

【温馨提示】
以上为系统基础解析，如需深度个性化AI分析，可在「设置」页面添加您的 Kimi API Key，即可获得更详细的解读。

记住：**八字是认识自我的工具，不是命运的枷锁**。您的选择和努力才是决定人生走向的关键。`
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
