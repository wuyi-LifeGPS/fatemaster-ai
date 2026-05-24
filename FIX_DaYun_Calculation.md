修复了命运大师AI八字排盘网站中大运年份计算错误的bug。

## 问题描述
用户反馈大运年份计算错误，网站显示第5步丁巳运从2026年开始，但正确结果应该是2027年开始（起运年份相差1年）。

## 根本原因分析
发现两个bug导致了大运年份计算错误：

### Bug 1: DaYunFlow组件接收了错误的出生日期
在 `src/app/bazi/page.tsx` 中，当用户选择**农历生日**时：
- `calculateBazi` 正确使用了转换后的**公历日期**进行八字计算
- 但 `DaYunFlow` 组件错误地使用了用户输入的**农历日期**来计算大运
- 这导致大运起始年份完全错误

**修复方案：** 将转换后的公历日期 `birthDate` 保存到状态 `solarBirthDate` 中，并传递给 `DaYunFlow` 组件。

### Bug 2: calculateDaYun中起运年份计算存在跨年精度问题
在 `src/lib/bazi.ts` 的 `calculateDaYun` 函数中，原来的起运年份计算使用了 `Date.setMonth()`：
```typescript
const qiYunDate = new Date(birthY, birthM - 1, birthD);
qiYunDate.setFullYear(qiYunDate.getFullYear() + wholeYears);
qiYunDate.setMonth(qiYunDate.getMonth() + extraMonths);
const qiYunYear = qiYunDate.getFullYear();
```

这种方式在某些边界情况下（如日期溢出的月份）可能导致跨年计算不准确。

**修复方案：** 改用纯数学计算月份和年份，避免Date对象的复杂性：
```typescript
let qiYunYear = birthY + wholeYears;
let qiYunMonth = birthM + extraMonths;
while (qiYunMonth > 12) {
  qiYunMonth -= 12;
  qiYunYear += 1;
}
```

## 修改文件
1. `src/lib/bazi.ts` - 修复 `calculateDaYun` 函数中的起运年份计算
2. `src/app/bazi/page.tsx` - 修复 `DaYunFlow` 组件接收的出生日期问题

## 验证
- 1983年10月19日出生（癸亥年，壬戌月），男命逆行
- 上一个节：寒露（10月9日）
- 天数差：10天 → 起运年龄：3.3岁
- 起运时间：1983年10月 + 3年4个月 = 1987年2月
- 第4步戊午运：2017-2026年 ✓
- 第5步丁巳运：2027-2036年 ✓
