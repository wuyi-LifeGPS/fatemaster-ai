'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// 《心之力》全文
const HEART_POWER_TEXT = `宇宙即我心，我心即宇宙。细微至发梢，宏大至天地。世界、宇宙乃至万物，皆为思维心力所驱使。博古观今，尤知人类之所以为世间万物之灵长，实为天地间心力最致力于进化者也。夫中华悠悠古国，人文始祖，之所以为古文明绵延不绝之基，实因古圣贤不懈践行以心力征服天地万物也。中华文明之所以傲立寰宇，皆系中华之天道文明、人道文明、文道文明，三教合一，一以贯之。中华之道德文章，皆系心之力也。

天之力莫大于日，地之力莫大于电，人之力莫大于心。阳气发处，金石亦透，精神一到，何事不成？此心之伟力，实不可胜言。人生在世，所求者何？曰：自由，曰：平等，曰：幸福，曰：正义。然此四者，非心之力不能致也。心力之伟，大矣哉！其可以感天地，动鬼神，御万物，制群生。心力若正，则天地顺之；心力若邪，则天地逆之。

盖个人有何心性即外表为其生活，团体有何心性即外表为其事业，国家有何心性即外表为其文明，众生有何心性即外表为其业力果报。故心为形成世间器物之原力。佛曰：相由心生。其理即在此。吾心即宇宙，宇宙即吾心。心之力，实乃宇宙之力也。

故吾辈任重而道远，若能立此大心，聚爱成行，则此荧荧之光必点通天之亮，星星之火必成燎原之势，翻天覆地，扭转乾坤。戒海内贪腐之国贼，惩海外汉奸之子嗣；养万民农林之福祉，兴大国工业之格局；开仁武世界之先河，灭魔盗国际之基石；创中华新纪之强国，造国民千秋之福祉；兴神州万代之盛世，开全球永久之太平！也未为不可。

是故，天之力莫大于日，地之力莫大于电，人之力莫大于心。心之力，其大无外，其小无内。心之力，可以转乾坤，可以移日月。此心之力，实不可胜言。故吾辈当以此心之力，为天地立心，为生民立命，为往圣继绝学，为万世开太平！`

const CHAPTERS = [
  { title: '宇宙即我心', start: 0, end: 5 },
  { title: '心力之伟', start: 5, end: 11 },
  { title: '相由心生', start: 11, end: 15 },
  { title: '任重道远', start: 15, end: 20 },
  { title: '为万世开太平', start: 20, end: 22 },
]

export default function HeartPowerPage() {
  const [currentChapter, setCurrentChapter] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [showToc, setShowToc] = useState(false)
  const [saved, setSaved] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const paragraphs = HEART_POWER_TEXT.split('\n').filter(p => p.trim())
  const totalChapters = CHAPTERS.length

  const currentChapterData = CHAPTERS[currentChapter]
  const currentParagraphs = paragraphs.slice(currentChapterData.start, currentChapterData.end)
  const chapterProgress = ((currentChapter + 1) / totalChapters) * 100

  const goToChapter = (idx: number) => {
    if (idx < 0 || idx >= totalChapters) return
    setCurrentChapter(idx)
    setShowToc(false)
    // 滚动到顶部
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  const saveBookmark = () => {
    setSaved(true)
    localStorage.setItem('heart_power_chapter', currentChapter.toString())
    setTimeout(() => setSaved(false), 2000)
  }

  // 恢复阅读进度
  useEffect(() => {
    const savedChapter = localStorage.getItem('heart_power_chapter')
    if (savedChapter) {
      const parsed = parseInt(savedChapter, 10)
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalChapters) {
        setCurrentChapter(parsed)
      }
    }
  }, [totalChapters])

  return (
    <div className="min-h-screen moonly-bg moonly-content flex flex-col animate-fade-in relative">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-[#1a1428]/95 backdrop-blur-sm border-b border-white/5 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/shu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-secondary">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="text-white font-medium text-sm">心之力</div>
            <div className="text-moonly-muted text-xs">毛泽东 · 第 {currentChapter + 1} / {totalChapters} 章</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* 字体大小 */}
          <button
            onClick={() => setFontSize(s => Math.max(14, s - 2))}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs text-moonly-secondary hover:bg-white/10 transition"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize(s => Math.min(24, s + 2))}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-sm text-moonly-secondary hover:bg-white/10 transition"
          >
            A+
          </button>
          {/* 目录 */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${showToc ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'bg-white/5 text-moonly-secondary hover:bg-white/10'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          {/* 收藏 */}
          <button
            onClick={saveBookmark}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${saved ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'bg-white/5 text-moonly-secondary hover:bg-white/10'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 目录浮层 */}
      {showToc && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setShowToc(false)} />
          <div className="fixed top-14 right-4 z-[70] moonly-card p-4 w-56 shadow-2xl">
            <div className="text-white font-bold text-sm mb-3">目录</div>
            <div className="space-y-1">
              {CHAPTERS.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => goToChapter(i)}
                  className={`block text-sm w-full text-left py-2 px-3 rounded-lg transition ${
                    currentChapter === i ? 'text-[#c9a96e] bg-[#c9a96e]/10' : 'text-moonly-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-moonly-muted mr-2">{i + 1}.</span>
                  {ch.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 阅读进度条 */}
      <div className="w-full h-0.5 bg-white/10 flex-shrink-0 relative overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#c9a96e] to-[#e0c896] transition-all duration-300" style={{ width: `${chapterProgress}%` }} />
      </div>

      {/* 正文区域 */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-5 py-6 pb-28"
      >
        {/* 章节标题 */}
        <div className="text-center mb-8">
          <div className="text-[#c9a96e] text-xs mb-2 tracking-widest">第 {currentChapter + 1} 章</div>
          <h1 className="text-white font-bold text-lg">{CHAPTERS[currentChapter]?.title}</h1>
          <div className="text-moonly-muted text-xs mt-1">心之力 · 毛泽东</div>
        </div>

        {/* 正文 */}
        <div className="space-y-5" style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}>
          {currentParagraphs.map((para, i) => (
            <p key={i} className="text-white/90" style={{ textIndent: '2em' }}>
              {para}
            </p>
          ))}
        </div>

        {/* 章节底部提示 */}
        <div className="mt-10 text-center">
          <div className="text-moonly-muted text-xs">
            — 第 {currentChapter + 1} / {totalChapters} 章 · {CHAPTERS[currentChapter]?.title} —
          </div>
        </div>

        <div className="mt-8 text-center text-moonly-muted text-xs pb-8">
          已读 {Math.round(chapterProgress)}%
        </div>
      </div>

      {/* 底部翻页导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1428]/95 backdrop-blur-sm border-t border-white/10 px-4 py-3 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => goToChapter(currentChapter - 1)}
            disabled={currentChapter === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#c9a96e] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition border border-[#c9a96e]/20"
          >
            ← 上一章
          </button>
          <span className="text-sm text-moonly-muted">
            {CHAPTERS[currentChapter]?.title}
          </span>
          <button
            onClick={() => goToChapter(currentChapter + 1)}
            disabled={currentChapter === totalChapters - 1}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#c9a96e] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition border border-[#c9a96e]/20"
          >
            下一章 →
          </button>
        </div>
      </div>
    </div>
  )
}
