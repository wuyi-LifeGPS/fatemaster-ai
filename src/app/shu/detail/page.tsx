'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const BOOK_CONTENTS: Record<string, { title: string; author: string; content: string }> = {
  '道德经': {
    title: '道德经',
    author: '老子',
    content: `第一章
道可道，非常道。名可名，非常名。
无名天地之始；有名万物之母。
故常无，欲以观其妙；常有，欲以观其徼。
此两者，同出而异名，同谓之玄。
玄之又玄，众妙之门。

第二章
天下皆知美之为美，斯恶已。
皆知善之为善，斯不善已。
有无相生，难易相成，长短相形，高下相盈，音声相和，前后相随。
是以圣人处无为之事，行不言之教；
万物作焉而不辞，生而不有，为而不恃，功成而弗居。
夫唯弗居，是以不去。

第八章
上善若水。水善利万物而不争，处众人之所恶，故几于道。
居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。
夫唯不争，故无尤。

第十六章
致虚极，守静笃。
万物并作，吾以观复。
夫物芸芸，各复归其根。
归根曰静，是谓复命；复命曰常，知常曰明。
不知常，妄作凶。
知常容，容乃公，公乃全，全乃天，天乃道，道乃久，没身不殆。

第二十五章
有物混成，先天地生。
寂兮寥兮，独立不改，周行而不殆，可以为天地母。
吾不知其名，字之曰道，强为之名曰大。
大曰逝，逝曰远，远曰反。
故道大，天大，地大，人亦大。
域中有四大，而人居其一焉。
人法地，地法天，天法道，道法自然。`,
  },
  '心经': {
    title: '般若波罗蜜多心经',
    author: '玄奘译',
    content: `观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。

舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。

舍利子，是诸法空相，不生不灭，不垢不净，不增不减。是故空中无色，无受想行识，无眼耳鼻舌身意，无色声香味触法，无眼界，乃至无意识界，无无明，亦无无明尽，乃至无老死，亦无老死尽。无苦集灭道，无智亦无得。以无所得故。

菩提萨埵，依般若波罗蜜多故，心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想，究竟涅槃。

三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。

故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，能除一切苦，真实不虚。

故说般若波罗蜜多咒，即说咒曰：揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。`,
  },
  '清静经': {
    title: '太上老君说常清静经',
    author: '太上老君',
    content: `老君曰：大道无形，生育天地；大道无情，运行日月；大道无名，长养万物；吾不知其名，强名曰道。

夫道者：有清有浊，有动有静；天清地浊，天动地静。男清女浊，男动女静。降本流末，而生万物。清者浊之源，动者静之基。人能常清静，天地悉皆归。

夫人神好清，而心扰之；人心好静，而欲牵之。常能遣其欲，而心自静，澄其心而神自清。自然六欲不生，三毒消灭。所以不能者，为心未澄，欲未遣也。

能遣之者，内观其心，心无其心；外观其形，形无其形；远观其物，物无其物。三者既悟，唯见于空；观空亦空，空无所空；所空既无，无无亦无；无无既无，湛然常寂；寂无所寂，欲岂能生？欲既不生，即是真静。

真常应物，真常得性；常应常静，常清静矣。如此清静，渐入真道；既入真道，名为得道，虽名得道，实无所得；为化众生，名为得道；能悟之者，可传圣道。`,
  },
  '周易': {
    title: '周易·乾卦',
    author: '伏羲/文王',
    content: `乾：元亨利贞。

初九：潜龙勿用。

九二：见龙在田，利见大人。

九三：君子终日乾乾，夕惕若，厉无咎。

九四：或跃在渊，无咎。

九五：飞龙在天，利见大人。

上九：亢龙有悔。

用九：见群龙无首，吉。

彖曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明终始，六位时成，时乘六龙以御天。乾道变化，各正性命，保合太和，乃利贞。首出庶物，万国咸宁。

象曰：天行健，君子以自强不息。`,
  },
  '黄帝内经': {
    title: '黄帝内经·素问·上古天真论',
    author: '佚名',
    content: `昔在黄帝，生而神灵，弱而能言，幼而徇齐，长而敦敏，成而登天。

乃问于天师曰：余闻上古之人，春秋皆度百岁，而动作不衰；今时之人，年半百而动作皆衰者，时世异耶？人将失之耶？

岐伯对曰：上古之人，其知道者，法于阴阳，和于术数，食饮有节，起居有常，不妄作劳，故能形与神俱，而尽终其天年，度百岁乃去。

今时之人不然也，以酒为浆，以妄为常，醉以入房，以欲竭其精，以耗散其真，不知持满，不时御神，务快其心，逆于生乐，起居无节，故半百而衰也。

夫上古圣人之教下也，皆谓之虚邪贼风，避之有时，恬惔虚无，真气从之，精神内守，病安从来。`,
  },
  '金刚经': {
    title: '金刚般若波罗蜜经·节选',
    author: '鸠摩罗什译',
    content: `如是我闻：一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。

尔时，世尊食时，著衣持钵，入舍卫大城乞食。于其城中，次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。

时长老须菩提在大众中，即从座起，偏袒右肩，右膝著地，合掌恭敬而白佛言：「希有！世尊！如来善护念诸菩萨，善付嘱诸菩萨。世尊！善男子、善女人，发阿耨多罗三藐三菩提心，应云何住？云何降伏其心？」

佛言：「善哉，善哉。须菩提！如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听，当为汝说。善男子、善女人，发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。」

「唯然，世尊！愿乐欲闻。」

佛告须菩提：「诸菩萨摩诃萨，应如是降伏其心：所有一切众生之类，若卵生、若胎生、若湿生、若化生，若有色、若无色，若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。」`,
  },
  '阴符经': {
    title: '黄帝阴符经',
    author: '黄帝',
    content: `观天之道，执天之行，尽矣。

天有五贼，见之者昌。五贼在心，施行于天。宇宙在乎手，万化生乎身。

天性，人也；人心，机也。立天之道，以定人也。

天发杀机，移星易宿；地发杀机，龙蛇起陆；人发杀机，天地反覆；天人合发，万化定基。

性有巧拙，可以伏藏。九窍之邪，在乎三要，可以动静。

火生于木，祸发必克；奸生于国，时动必溃。知之修炼，谓之圣人。

天生天杀，道之理也。天地，万物之盗；万物，人之盗；人，万物之盗。三盗既宜，三才既安。

故曰：食其时，百骸理；动其机，万化安。人知其神而神，不知其不神之所以神也。

日月有数，大小有定，圣功生焉，神明出焉。

其盗机也，天下莫能见，莫能知。君子得之固躬，小人得之轻命。`,
  },
  '心之力': {
    title: '心之力',
    author: '毛泽东',
    content: `宇宙即我心，我心即宇宙。细微至发梢，宏大至天地。世界、宇宙乃至万物皆为思维心力所驱使。博古观今，尤知人类之所以为世间万物之灵长，实为天地间心力最致力于进化者也。

夫中华悠悠古国，人文始祖，之所以为古文明绵延不绝之基实乃因文教之力。我中华古华文明，实乃文教之力所化生。凡英雄豪杰之能成世界者，均有赖于其心力之强毅。

故个人有何心性即外表为其生活，团体有何心性即外表为其事业，国家有何心性即外表为其文明，众生有何心性即外表为其业力果报。故心为形成世间器物之原力。

佛曰：心生种种法生，心灭种种法灭。故个人、团体、国家、世界，乃至众生，皆由心之力所造成。`,
  },
}

function ShuDetailContent() {
  const searchParams = useSearchParams()
  const bookKey = searchParams.get('book') || ''
  const book = BOOK_CONTENTS[bookKey]
  const [fontSize, setFontSize] = useState(16)

  if (!book) {
    return (
      <div className="px-4 pt-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/shu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-gold-gradient text-xl font-bold">书籍详情</h1>
        </div>
        <div className="text-center py-20">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-moonly-text-secondary text-sm">未找到该书籍</p>
          <Link href="/shu" className="mt-4 inline-block px-4 py-2 rounded-full bg-moonly-gold/10 text-gold text-sm hover:bg-moonly-gold/20 transition">
            返回书库
          </Link>
        </div>
      </div>
    )
  }

  const paragraphs = book.content.split('\n\n')

  return (
    <div className="px-4 pt-4 pb-24 min-h-screen">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/shu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-white font-bold text-lg">{book.title}</h1>
            <p className="text-moonly-text-muted text-xs">{book.author}</p>
          </div>
        </div>
        {/* 字体大小切换 */}
        <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5">
          <button onClick={() => setFontSize(s => Math.max(14, s - 1))} className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-moonly-text-muted hover:text-white hover:bg-white/10 transition">A-</button>
          <button onClick={() => setFontSize(s => Math.min(22, s + 1))} className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-moonly-text-muted hover:text-white hover:bg-white/10 transition">A+</button>
        </div>
      </div>

      {/* 内容 */}
      <div className="space-y-6">
        {paragraphs.map((para, i) => (
          <div key={i}>
            {para.split('\n').map((line, j) => (
              <p 
                key={j} 
                className="text-white/85 leading-relaxed"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* 底部 */}
      <div className="mt-10 text-center">
        <div className="text-moonly-text-muted text-xs">— 全文完 —</div>
        <Link href="/shu" className="mt-4 inline-block px-6 py-2 rounded-full bg-moonly-gold/10 text-gold text-sm hover:bg-moonly-gold/20 transition border border-moonly-gold/20">
          返回书库
        </Link>
      </div>
    </div>
  )
}

export default function ShuDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-moonly-gold/30 border-t-moonly-gold animate-spin mb-4" />
        <p className="text-moonly-text-secondary text-sm">加载中...</p>
      </div>
    }>
      <ShuDetailContent />
    </Suspense>
  )
}
