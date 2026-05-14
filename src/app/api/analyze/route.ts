import { NextRequest, NextResponse } from 'next/server'
import { calculateBazi } from '@/lib/bazi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, gender, birthDate, birthTime, analysisType, note } = body

    if (!birthDate || !birthTime) {
      return NextResponse.json(
        { error: '请提供出生日期和时间' },
        { status: 400 }
      )
    }

    // 计算八字
    const bazi = calculateBazi(birthDate, birthTime)

    // 构建 prompt 用于 AI 分析
    const prompt = buildPrompt(bazi, name, gender, analysisType, note)

    // 调用 Kimi API 进行分析
    let aiAnalysis = ''
    try {
      const kimiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.KIMI_API_KEY || ''}`,
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

      if (kimiResponse.ok) {
        const kimiData = await kimiResponse.json()
        aiAnalysis = kimiData.choices?.[0]?.message?.content || ''
      }
    } catch (error) {
      console.error('Kimi API error:', error)
    }

    // 如果没有 AI 分析，使用备用分析
    if (!aiAnalysis) {
      aiAnalysis = generateBackupAnalysis(bazi, name, gender)
    }

    return NextResponse.json({
      ...bazi,
      aiAnalysis,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '分析过程中出现错误' },
      { status: 500 }
    )
  }
}

function buildPrompt(bazi: any, name: string, gender: string, type: string, note?: string): string {
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

function generateBackupAnalysis(bazi: any, name: string, gender: string): string {
  const { dayMaster, wuXing, yinYang, wuXingCount } = bazi
  
  // 找出最多的五行和最少的五行
  const sortedWuXing = Object.entries(wuXingCount).sort((a, b) => (b[1] as number) - (a[1] as number))
  const strongest = sortedWuXing[0][0]
  const weakest = sortedWuXing[sortedWuXing.length - 1][0]

  return `【AI 分析服务暂时不可用，以下为系统基础解析】

亲爱的${name || '命主'}，您好！

您的日主为${dayMaster}，属${yinYang}性${wuXing}命。

【性格特质】
${dayMaster}日主的人通常具有${wuXing}属性对应的特质。${strongest}五行在您的命盘中最为突出，这意味着您天生在这方面有较强的能量和倾向。

【五行平衡】
您的命盘中${strongest}较旺，${weakest}相对较弱。在生活中可以多关注${weakest}相关的方面来平衡能量。

【温馨提示】
由于 AI 分析服务暂时无法连接，以上为基础解析。如需深度个性化分析，请稍后重试或联系客服。

记住：八字是认识自我的工具，不是命运的枷锁。您的选择和努力才是决定人生走向的关键。`
}
