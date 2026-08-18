import { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  CalendarDays, 
  CalendarCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import NetworkAnimation from '@/components/NetworkAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaxEvent {
  id: string;
  day: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  title: string;
  category: 'income_tax' | 'turnover_tax' | 'vat' | 'profit_tax' | 'holiday' | 'statistical' | 'other';
  description: string;
  applicableTo: string;
  isMonthly?: boolean;
  isQuarterly?: boolean;
  isAnnual?: boolean;
}

// RA Official Public Holidays (month is 0-indexed)
const RA_HOLIDAYS: { day: number; month: number; titleHy: string; titleRu: string; titleEn: string }[] = [
  { day: 1, month: 0, titleHy: 'Ամանոր', titleRu: 'Новый год', titleEn: 'New Year' },
  { day: 2, month: 0, titleHy: 'Ամանոր', titleRu: 'Новый год', titleEn: 'New Year' },
  { day: 6, month: 0, titleHy: 'Սուրբ Ծնունդ և Հայտնություն', titleRu: 'Рождество', titleEn: 'Christmas Day' },
  { day: 28, month: 0, titleHy: 'Բանակի օր', titleRu: 'День Армии', titleEn: 'Army Day' },
  { day: 8, month: 2, titleHy: 'Կանանց միջազգային օր', titleRu: 'Международный женский день', titleEn: 'International Women\'s Day' },
  { day: 24, month: 3, titleHy: 'Հայոց ցեղասպանության զոհերի հիշատակի օր', titleRu: 'День памяти жертв Геноцида армян', titleEn: 'Armenian Genocide Memorial Day' },
  { day: 1, month: 4, titleHy: 'Աշխատանքի օր', titleRu: 'День труда', titleEn: 'Labor Day' },
  { day: 9, month: 4, titleHy: 'Հաղթանակի և խաղաղության տոն', titleRu: 'День Победы и Мира', titleEn: 'Victory and Peace Day' },
  { day: 28, month: 4, titleHy: 'Հանրապետության տոն', titleRu: 'День Республики', titleEn: 'Republic Day' },
  { day: 5, month: 6, titleHy: 'Սահմանադրության օր', titleRu: 'День Конституции', titleEn: 'Constitution Day' },
  { day: 21, month: 8, titleHy: 'Անկախության տոն', titleRu: 'День Независимости', titleEn: 'Independence Day' },
  { day: 31, month: 11, titleHy: 'Ամանոր', titleRu: 'Новый год', titleEn: 'New Year\'s Eve' },
];

const MONTH_NAMES_HY = [
  'Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս',
  'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'
];

const MONTH_NAMES_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES_HY = ['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'];
const WEEKDAY_NAMES_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WEEKDAY_NAMES_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AVAILABLE_YEARS = [2024, 2025, 2026, 2027, 2028];

export default function TaxCalendar() {
  const { currentLanguage } = useLanguage();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    document.title = 'Հարկային Օրացույց | Amroyan Consulting';
  }, []);

  const monthNames = currentLanguage === 'ru' ? MONTH_NAMES_RU : currentLanguage === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_HY;
  const weekdayNames = currentLanguage === 'ru' ? WEEKDAY_NAMES_RU : currentLanguage === 'en' ? WEEKDAY_NAMES_EN : WEEKDAY_NAMES_HY;

  // Generate tax events for the given year and month
  const monthTaxEvents = useMemo(() => {
    const events: TaxEvent[] = [];

    // Monthly recurring obligations on the 20th
    events.push({
      id: `monthly-income-tax-${month}`,
      day: 20,
      month,
      title: 'Եկամտային հարկի և սոցիալական վճարի ամսական հաշվարկ',
      category: 'income_tax',
      description: 'Նախորդ ամսվա համար վարձու աշխատողների եկամտային հարկի, սոցիալական վճարի և դրոշմանիշային վճարի ամսական հաշվարկի ներկայացում և գումարների վճարում:',
      applicableTo: 'Բոլոր գործատուներ, հարկային գործակալներ',
      isMonthly: true
    });

    events.push({
      id: `monthly-vat-${month}`,
      day: 20,
      month,
      title: 'ԱԱՀ և ակցիզային հարկի ամսական հաշվարկ',
      category: 'vat',
      description: 'ԱԱՀ վճարողների կողմից նախորդ ամսվա ԱԱՀ-ի և ակցիզային հարկի հաշվարկի ներկայացում և հարկի վճարում:',
      applicableTo: 'ԱԱՀ և ակցիզային հարկ վճարող կազմակերպություններ և ԱՁ-ներ',
      isMonthly: true
    });

    // Quarterly obligations (due in Jan (month 0), Apr (month 3), Jul (month 6), Oct (month 9) on the 20th)
    if ([0, 3, 6, 9].includes(month)) {
      const quarterNum = month === 0 ? 4 : month === 3 ? 1 : month === 6 ? 2 : 3;
      events.push({
        id: `quarterly-turnover-${month}`,
        day: 20,
        month,
        title: `Շրջանառության հարկի ${quarterNum}-րդ եռամսյակի հաշվարկ`,
        category: 'turnover_tax',
        description: `Շրջանառության հարկ վճարողների կողմից ${quarterNum}-րդ եռամսյակի շրջանառության հարկի հաշվարկի ներկայացում և հարկի վճարում:`,
        applicableTo: 'Շրջանառության հարկ վճարողներ',
        isQuarterly: true
      });

      events.push({
        id: `quarterly-eco-${month}`,
        day: 20,
        month,
        title: `Բնապահպանական հարկի և բնօգտագործման վճարների ${quarterNum}-րդ եռամսյակի հաշվարկ`,
        category: 'other',
        description: `Բնապահպանական հարկի և բնօգտագործման վճարների ${quarterNum}-րդ եռամսյակի հաշվարկի ներկայացում և վճարում:`,
        applicableTo: 'Բնօգտագործող և բնապահպանական հարկ վճարող սուբյեկտներ',
        isQuarterly: true
      });
    }

    // Specific Month Events
    // January (month 0)
    if (month === 0) {
      events.push({
        id: 'annual-turnover-application-jan',
        day: 20,
        month: 0,
        title: 'Շրջանառության հարկ վճարող համարվելու հայտարարություն',
        category: 'turnover_tax',
        description: 'Ընթացիկ տարում շրջանառության հարկ վճարող համարվելու վերաբերյալ հայտարարության ներկայացման վերջնաժամկետ:',
        applicableTo: 'Շրջանառության հարկի դաշտում գործել ցանկացող տնտեսվարողներ',
        isAnnual: true
      });
    }

    // February (month 1)
    if (month === 1) {
      events.push({
        id: 'micro-application-feb',
        day: 20,
        month: 1,
        title: 'Միկրոձեռնարկատիրության սուբյեկտ համարվելու հայտարարություն',
        category: 'other',
        description: 'Ընթացիկ տարում միկրոձեռնարկատիրության սուբյեկտ համարվելու վերաբերյալ հայտարարության ներկայացում:',
        applicableTo: 'Միկրոձեռնարկատիրության չափանիշներին բավարարող անձինք',
        isAnnual: true
      });
    }

    // April (month 3)
    if (month === 3) {
      events.push({
        id: 'annual-profit-tax-apr',
        day: 20,
        month: 3,
        title: 'Տարեկան շահութահարկի հաշվարկ և վճարում',
        category: 'profit_tax',
        description: 'Նախորդ հարկային տարվա տարեկան շահութահարկի հաշվարկի ներկայացում և շահութահարկի գումարի վերջնահաշվարկ/վճարում:',
        applicableTo: 'Ռեզիդենտ և ոչ ռեզիդենտ շահութահարկ վճարողներ',
        isAnnual: true
      });
      events.push({
        id: 'physical-declaration-apr',
        day: 20,
        month: 3,
        title: 'Ֆիզիկական անձանց եկամուտների համատարած հայտարարագրում',
        category: 'income_tax',
        description: 'ՀՀ քաղաքացի հանդիսացող ֆիզիկական անձանց տարեկան եկամուտների հայտարարագրի ներկայացում և եկամտային հարկի վճարում:',
        applicableTo: 'Հայտարարատու ֆիզիկական անձինք',
        isAnnual: true
      });
    }

    // Add public holidays for this month
    RA_HOLIDAYS.filter(h => h.month === month).forEach(holiday => {
      events.push({
        id: `holiday-${month}-${holiday.day}`,
        day: holiday.day,
        month,
        title: holiday.titleHy,
        category: 'holiday',
        description: 'ՀՀ պաշտոնական տոնական և ոչ աշխատանքային օր (ՀՀ Աշխատանքային օրենսգիրք):',
        applicableTo: 'Հանրապետության ողջ տարածքում'
      });
    });

    return events;
  }, [month]);

  // Calculate calendar days, working days, working hours for selected month
  const monthData = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    
    let workingDaysCount = 0;
    let weekendDaysCount = 0;
    let holidaysCount = 0;

    const daysArray: {
      day: number;
      isWeekend: boolean;
      isHoliday: boolean;
      holidayTitle?: string;
      hasTaxEvent: boolean;
      taxEvents: TaxEvent[];
    }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dayOfWeek = (dateObj.getDay() + 6) % 7; // 0=Mon, 6=Sun
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Sat or Sun
      
      const holiday = RA_HOLIDAYS.find(h => h.month === month && h.day === d);
      const isHoliday = !!holiday;

      if (isHoliday) {
        holidaysCount++;
      } else if (isWeekend) {
        weekendDaysCount++;
      } else {
        workingDaysCount++;
      }

      const dayEvents = monthTaxEvents.filter(e => e.day === d);

      daysArray.push({
        day: d,
        isWeekend,
        isHoliday,
        holidayTitle: holiday?.titleHy,
        hasTaxEvent: dayEvents.some(e => e.category !== 'holiday'),
        taxEvents: dayEvents
      });
    }

    // Working hours (40h/week -> 8h/day, 36h/week -> 7.2h/day)
    const workingHours40 = workingDaysCount * 8;
    const workingHours36 = +(workingDaysCount * 7.2).toFixed(1);

    return {
      daysInMonth,
      firstDayOfWeek,
      daysArray,
      workingDaysCount,
      nonWorkingDaysCount: weekendDaysCount + holidaysCount,
      holidaysCount,
      workingHours40,
      workingHours36
    };
  }, [year, month, monthTaxEvents]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  const handleSelectMonth = (newMonthIdx: number) => {
    setCurrentDate(new Date(year, newMonthIdx, 1));
    setSelectedDay(null);
  };

  const handleSelectYear = (newYear: number) => {
    setCurrentDate(new Date(newYear, month, 1));
    setSelectedDay(null);
  };

  const filteredEvents = useMemo(() => {
    let list = monthTaxEvents;
    if (selectedCategory !== 'all') {
      list = list.filter(e => e.category === selectedCategory);
    }
    if (selectedDay !== null) {
      list = list.filter(e => e.day === selectedDay);
    }
    return list;
  }, [monthTaxEvents, selectedCategory, selectedDay]);

  const categoryBadge = (cat: TaxEvent['category']) => {
    switch (cat) {
      case 'income_tax':
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Եկամտային հարկ / Սոցվճար</Badge>;
      case 'turnover_tax':
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Շրջանառության հարկ</Badge>;
      case 'vat':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">ԱԱՀ և Ակցիզ</Badge>;
      case 'profit_tax':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Շահութահարկ</Badge>;
      case 'holiday':
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">Տոնական օր</Badge>;
      default:
        return <Badge className="bg-gold-500/20 text-gold-300 border-gold-500/30">Հարկային պարտավորություն</Badge>;
    }
  };

  return (
    <div className="relative pt-24 sm:pt-28 lg:pt-32 pb-20 overflow-x-hidden min-h-screen bg-black">
      <NetworkAnimation />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-medium mb-4">
            <CalendarCheck className="w-4 h-4" />
            ՀՀ Ֆինանսական և Հարկային Օրացույց
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-normal sm:leading-tight lg:leading-snug">
            <span className="gradient-text font-semibold">Հարկային Օրացույց</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Հաշվետվությունների և հարկերի վճարման վերջնաժամկետներ, աշխատանքային օրերի և ժամերի հաշվարկ՝ ամիս առ ամիս։
          </p>
        </div>
      </section>

      {/* Calendar and Stats Wrapper */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
        
        {/* Month Navigation & Controls Box */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-black border border-gold-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-5">
          
          {/* Top Bar: Title + Selects + Prev/Next Buttons */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Title & info */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-start">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
                  <span>{monthNames[month]}</span>
                  <span className="text-gold-400">{year}</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  {monthData.workingDaysCount} աշխատանքային օր · {monthData.workingHours40} աշխատանքային ժամ
                </p>
              </div>
            </div>

            {/* Direct Month & Year Selectors + Arrow controls */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full lg:w-auto">
              
              {/* Month Dropdown */}
              <div className="w-36 sm:w-40">
                <Select
                  value={month.toString()}
                  onValueChange={(val) => handleSelectMonth(parseInt(val))}
                >
                  <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white hover:border-gold-500/50 h-10 font-medium">
                    <SelectValue placeholder="Ընտրել ամիսը" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white max-h-64">
                    {monthNames.map((mName, idx) => (
                      <SelectItem key={mName} value={idx.toString()} className="focus:bg-gold-500 focus:text-black">
                        {mName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Dropdown */}
              <div className="w-24 sm:w-28">
                <Select
                  value={year.toString()}
                  onValueChange={(val) => handleSelectYear(parseInt(val))}
                >
                  <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white hover:border-gold-500/50 h-10 font-medium">
                    <SelectValue placeholder="Տարի" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    {AVAILABLE_YEARS.map((yr) => (
                      <SelectItem key={yr} value={yr.toString()} className="focus:bg-gold-500 focus:text-black">
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prev Month Button */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrevMonth}
                className="border-gold-500/30 text-gold-400 hover:bg-gold-500/20 hover:text-white h-10 w-10 shrink-0"
                aria-label="Նախորդ ամիս"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Today Button */}
              <Button 
                variant="outline" 
                onClick={handleCurrentMonth}
                className="border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-black font-semibold text-xs sm:text-sm px-3 sm:px-4 h-10 shrink-0"
              >
                Այսօր
              </Button>

              {/* Next Month Button */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextMonth}
                className="border-gold-500/30 text-gold-400 hover:bg-gold-500/20 hover:text-white h-10 w-10 shrink-0"
                aria-label="Հաջորդ ամիս"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick 12 Months Clickable Selector Bar */}
          <div className="pt-2 border-t border-gray-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {monthNames.map((mName, idx) => {
                const isSelectedMonth = month === idx;
                const isCurrentActualMonth = today.getFullYear() === year && today.getMonth() === idx;

                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => handleSelectMonth(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                      isSelectedMonth
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-md font-bold'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white border border-gray-700/50'
                    }`}
                  >
                    {mName}
                    {isCurrentActualMonth && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelectedMonth ? 'bg-black' : 'bg-gold-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Interactive Calendar Grid Card */}
        <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/30 shadow-2xl overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-gold-400" />
                  {monthNames[month]} {year} — Օրացուցային ցանց
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-400">
                  Սեղմեք ցանկացած օրվա վրա՝ տվյալ օրվա հարկային հաշվետվությունները և տոները դիտելու համար
                </CardDescription>
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-gold-500 inline-block ring-2 ring-gold-500/30" />
                  Հարկային վերջնաժամկետ
                </span>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block ring-2 ring-rose-500/30" />
                  Ոչ աշխատանքային / Տոն
                </span>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-gray-700 inline-block" />
                  Աշխատանքային
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-6">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-2 text-center">
              {weekdayNames.map((wd, i) => (
                <div 
                  key={wd} 
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg ${
                    i >= 5 ? 'text-rose-400 bg-rose-500/10' : 'text-gray-300 bg-gray-800/40'
                  }`}
                >
                  {wd}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
              {/* Empty leading offset days */}
              {Array.from({ length: monthData.firstDayOfWeek }).map((_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className="min-h-[64px] sm:min-h-[88px] rounded-xl border border-dashed border-gray-800/50 bg-gray-950/30" 
                />
              ))}

              {/* Active Month Days */}
              {monthData.daysArray.map((dObj) => {
                const isSelected = selectedDay === dObj.day;
                const isCurrentToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === dObj.day;

                return (
                  <button
                    key={`day-${dObj.day}`}
                    type="button"
                    onClick={() => setSelectedDay(selectedDay === dObj.day ? null : dObj.day)}
                    className={`min-h-[64px] sm:min-h-[88px] p-2 sm:p-2.5 rounded-xl text-left transition-colors flex flex-col justify-between border relative group focus:outline-none ${
                      isSelected 
                        ? 'border-gold-400 bg-gold-500/20 ring-2 ring-inset ring-gold-400/50 shadow-lg' 
                        : dObj.hasTaxEvent
                          ? 'border-gold-500/40 bg-gradient-to-br from-gold-950/30 to-gray-900 hover:border-gold-400 hover:bg-gold-500/10'
                          : dObj.isHoliday
                            ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-400'
                            : dObj.isWeekend
                              ? 'border-gray-800/60 bg-gray-950/60 hover:border-gray-700'
                              : 'border-gray-800 bg-gray-900/60 hover:border-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs sm:text-base font-bold ${
                        isCurrentToday
                          ? 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gold-500 text-black flex items-center justify-center font-extrabold shadow-md'
                          : dObj.isHoliday || dObj.isWeekend
                            ? 'text-rose-400'
                            : 'text-white'
                      }`}>
                        {dObj.day}
                      </span>

                      {dObj.hasTaxEvent && (
                        <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse shadow-sm shadow-gold-400/50" />
                      )}
                    </div>

                    {/* Small preview text in desktop */}
                    <div className="mt-1 hidden sm:block">
                      {dObj.hasTaxEvent ? (
                        <span className="text-[10px] line-clamp-2 text-gold-300 font-medium leading-tight">
                          {dObj.taxEvents.find(e => e.category !== 'holiday')?.title}
                        </span>
                      ) : dObj.isHoliday ? (
                        <span className="text-[10px] line-clamp-2 text-rose-300 font-medium leading-tight">
                          {dObj.holidayTitle}
                        </span>
                      ) : dObj.isWeekend ? (
                        <span className="text-[10px] text-gray-500">Հանգստյան</span>
                      ) : (
                        <span className="text-[10px] text-gray-500">8 ժամ</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 4 Stats Cards: Working Days, Holidays, 40h, 36h */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-500/40 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {monthData.workingDaysCount} <span className="text-sm font-normal text-gray-400">օր</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">
                Աշխատանքային օրեր
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-500/40 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {monthData.nonWorkingDaysCount} <span className="text-sm font-normal text-gray-400">օր</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">
                Հանգստյան և տոնական
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-500/40 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {monthData.workingHours40} <span className="text-sm font-normal text-gray-400">ժամ</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">
                40-ժամյա աշխատաշաբաթ
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-500/40 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {monthData.workingHours36} <span className="text-sm font-normal text-gray-400">ժամ</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">
                36-ժամյա աշխատաշաբաթ
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Events and Deadlines List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-gold-400" />
                {monthNames[month]} {year} ամսվա հարկային և կարևոր իրադարձություններ
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {selectedDay 
                  ? `Ցուցադրված են միայն ${selectedDay} ${monthNames[month]}-ի իրադարձությունները`
                  : 'Ամսվա բոլոր գրանցված հաշվետվությունները և վերջնաժամկետները'}
              </p>
            </div>

            {selectedDay && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 text-xs"
              >
                Ցուցադրել ամբողջ ամիսը
              </Button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Բոլորը' },
              { id: 'income_tax', label: 'Եկամտային հարկ / Սոցվճար' },
              { id: 'turnover_tax', label: 'Շրջանառության հարկ' },
              { id: 'vat', label: 'ԱԱՀ և Ակցիզ' },
              { id: 'profit_tax', label: 'Շահութահարկ' },
              { id: 'holiday', label: 'Տոներ' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-gold-500 text-black font-semibold shadow-md'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Events List Cards */}
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/40 rounded-2xl border border-dashed border-gray-800 p-8">
                <Info className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-300 font-semibold">Ընտրված օրվա կամ ֆիլտրի համար հատուկ իրադարձություններ չկան</p>
                <p className="text-sm text-gray-500 mt-1">Ընտրեք այլ օր կամ սեղմեք «Ցուցադրել ամբողջ ամիսը»</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <Card 
                  key={event.id} 
                  className={`border transition-all duration-300 ${
                    event.category === 'holiday' 
                      ? 'bg-gradient-to-r from-rose-950/30 via-gray-900 to-black border-rose-500/30' 
                      : 'bg-gradient-to-r from-gray-900 via-gray-900/80 to-black border-gold-500/30 hover:border-gold-400/60'
                  }`}
                >
                  <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
                    {/* Date Block */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gray-900 border border-gold-500/40 flex flex-col items-center justify-center text-center shrink-0 shadow-lg">
                      <span className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                        {event.day}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gold-400 font-semibold uppercase mt-1">
                        {monthNames[month].slice(0, 3)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {categoryBadge(event.category)}
                        {event.isMonthly && (
                          <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                            Ամսական պարբերական
                          </Badge>
                        )}
                        {event.isQuarterly && (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 text-xs">
                            Եռամսյակային
                          </Badge>
                        )}
                        {event.isAnnual && (
                          <Badge variant="outline" className="text-purple-400 border-purple-500/40 text-xs">
                            Տարեկան
                          </Badge>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {event.title}
                      </h4>

                      <p className="text-sm text-gray-300 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="pt-1 flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-gold-400 font-medium">Վերաբերում է՝</span>
                        <span>{event.applicableTo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Legal & Practical Guidelines Notice */}
        <Card className="bg-gradient-to-r from-gray-900 via-gray-900/60 to-black border border-gold-500/30">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">
                ՀՀ Հարկային Օրենսգրքի կարևոր դրույթներ
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-1.5">
                <p className="font-semibold text-gold-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  Ոչ աշխատանքային օրվա տեղափոխում (ՀՀ ՀՕ Հոդված 6)
                </p>
                <p className="text-gray-400">
                  Եթե հաշվետվության ներկայացման կամ հարկի վճարման վերջնաժամկետը համընկնում է ոչ աշխատանքային կամ տոնական օրվա հետ, ապա վերջնաժամկետ է համարվում դրան հաջորդող առաջին աշխատանքային օրը։
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-1.5">
                <p className="font-semibold text-gold-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  Էլեկտրոնային հաշվետվողականություն
                </p>
                <p className="text-gray-400">
                  Բոլոր հարկային հաշվարկները և հաշվետվությունները ներկայացվում են էլեկտրոնային եղանակով՝ ՊԵԿ-ի պաշտոնական էլեկտրոնային համակարգի (file-online.taxservice.am) միջոցով մինչև սահմանված օրվա 24:00-ն։
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </section>
    </div>
  );
}
