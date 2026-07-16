import { NextRequest, NextResponse } from 'next/server'

// 服务端代理调用 Kimi API
// Key 通过环境变量 KIMI_API_KEY 配置，前端不可见
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, systemPrompt, temperature = 0.7 } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const apiKey = body.apiKey || process.env.KIMI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'KIMI_API_KEY not configured. Please contact the site administrator.' },
        { status: 500 }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

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
            content: systemPrompt || '你是一位精通传统命理学的 AI 分析师，擅长从八字角度提供专业解读。你用现代语言解读命理，不迷信不恐吓。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Kimi API error:', response.status, errorText)
      return NextResponse.json(
        { error: `Kimi API error: ${response.status}` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('AI proxy error:', error)
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '请求超时，请稍后重试' },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
