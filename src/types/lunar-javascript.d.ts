declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar
    getYear(): number
    getMonth(): number
    getDay(): number
    getLunar(): Lunar
    toString(): string
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number, isLeap?: boolean): Lunar
    static getLeapMonth(year: number): number
    getYear(): number
    getMonth(): number
    getDay(): number
    getSolar(): Solar
    getMonthInChinese(): string
    getDayInChinese(): string
    toString(): string
    toFullString(): string
  }
}
