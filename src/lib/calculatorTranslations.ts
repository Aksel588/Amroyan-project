export type Language = 'hy' | 'ru' | 'en';

export interface CalculatorCardItem {
  slug: string;
  to: string;
  icon_name: string;
  category: 'salary' | 'tax' | 'project' | 'benefits';
  title: string;
  desc: string;
  tags: string[];
}

export interface CalculatorTranslations {
  // Page Meta & Common
  metaTitle: string;
  metaDesc: string;
  backToCalculators: string;
  openCalculator: string;
  calculate: string;
  resultsTitle: string;
  reset: string;
  exportPdf: string;
  copied: string;
  currency: string;
  amd: string;
  noteDefault: string;

  // Exactly 5 Calculator Cards on /calculators
  cards: CalculatorCardItem[];

  // Unified Salary Hub
  unifiedSalary: {
    title: string;
    subtitle: string;
    chooseCalculator: string;
    simpleTitle: string;
    simpleDesc: string;
    simpleTags: string[];
    compTitle: string;
    compDesc: string;
    compTags: string[];
    payrollTitle: string;
    payrollDesc: string;
    payrollTags: string[];
  };

  // 1. Simple Salary Calculator
  salary: {
    title: string;
    description: string;
    modeLabel: string;
    grossToNet: string;
    netToGross: string;
    grossAmountLabel: string;
    netAmountLabel: string;
    amountPlaceholder: string;
    itPrivilegeLabel: string;
    itPrivilegeDesc: string;
    pensionLabel: string;
    pensionMandatory: string;
    pensionVoluntaryPre2018: string;
    pensionVoluntaryPost2018: string;
    pensionNone: string;
    incomeTaxLabel: string;
    pensionFeeLabel: string;
    statePensionLabel: string;
    stampDutyLabel: string;
    netResultLabel: string;
    grossResultLabel: string;
    note: string;
    validationAmount: string;
  };

  // 2. Turnover Tax Calculator
  turnoverTax: {
    title: string;
    subtitle: string;
    description: string;
    infoBanner: string;
    colActivity: string;
    colTurnover: string;
    colDirectCosts: string;
    colAdminCosts: string;
    colTaxRate: string;
    colDeductionPercent: string;
    colMinTaxPercent: string;
    colMinTaxAmount: string;
    colActualTaxPercent: string;
    colTaxPayable: string;
    activities: string[];
    totalTurnover: string;
    totalDeductions: string;
    totalMinTax: string;
    totalTaxPayable: string;
    resetValues: string;
    note: string;
  };

  // 3. Benefit Calculator
  benefit: {
    title: string;
    description: string;
    typeLabel: string;
    types: {
      childCare: string;
      sickLeave: string;
      maternity: string;
      unemployment: string;
      disability: string;
    };
    salaryLabel: string;
    salaryPlaceholder: string;
    daysLabel: string;
    daysPlaceholder: string;
    childAgeLabel: string;
    childAgePlaceholder: string;
    insuranceLabel: string;
    insuranceDesc: string;
    dailyRateLabel: string;
    calculatedBenefitLabel: string;
    maxBenefitLabel: string;
    taxDeductionLabel: string;
    netBenefitLabel: string;
    note: string;
    descriptions: {
      childCareUnder3: string;
      childCareOver3: string;
      sickLeaveInsured: string;
      sickLeaveUninsured: string;
      maternity: string;
      unemployment: string;
      disability: string;
    };
  };

  // 4. Project / Estimate Calculator
  project: {
    title: string;
    description: string;
    infoBanner: string;
    salarySectionTitle: string;
    hourlyTitle: string;
    hourlyRate: string;
    hourlyHoursPerDay: string;
    hourlyDaysPerMonth: string;
    dailyTitle: string;
    dailyRate: string;
    dailyDaysPerMonth: string;
    monthlyTitle: string;
    monthlyRate: string;
    positionLabel: string;
    positionCostNote: string;
    statsPositionsCount: string;
    statsPositionsValues: string;
    statsTotalCount: string;
    statsTotalFundNet: string;
    taxesIncomeTax: string;
    taxesSocialFee: string;
    taxesStampDuty: string;
    taxesTotalWithTaxes: string;
    otherExpensesTitle: string;
    otherExpenseLabel: string;
    otherExpensesCommentLabel: string;
    otherExpensesCommentPlaceholder: string;
    profitPercentLabel: string;
    profitAmountLabel: string;
    serviceCostInclTaxesLabel: string;
    serviceCostFormula: string;
    vatPayerLabel: string;
    vatAmountLabel: string;
    finalTotalLabel: string;
  };

  // 5. Armenian Corporate Tax Calculator (79 rows)
  armenianTax: {
    title: string;
    description: string;
    infoBanner: string;
    searchPlaceholder: string;
    filterSection: string;
    filterCategory: string;
    allSections: string;
    allCategories: string;
    sectionIncomes: string;
    sectionExpenses: string;
    sectionLosses: string;
    sectionReductions: string;
    sectionCalculation: string;
    colNumber: string;
    colName: string;
    colValue: string;
    colCategory: string;
    totalIncomes: string;
    totalExpenses: string;
    totalLosses: string;
    totalReductions: string;
    taxableProfit: string;
    calculatedProfitTax: string;
    payableProfitTax: string;
    resetValues: string;
    note: string;
  };
}

export const translations: Record<Language, CalculatorTranslations> = {
  hy: {
    metaTitle: 'Հաշվիչներ — Ֆինանսական հաշվիչներ | Amroyan Consulting',
    metaDesc: 'Ֆինանսական հաշվիչներ՝ Աշխատավարձ, Շրջհարկ, Շահութահարկ, Նպաստ, Նախագծերի (Սմետա) հաշվարկ',
    backToCalculators: 'Դեպի հաշվիչների ցանկ',
    openCalculator: 'Բացել հաշվիչը',
    calculate: 'Հաշվարկել',
    resultsTitle: 'Հաշվարկի արդյունքներ',
    reset: 'Մաքրել',
    exportPdf: 'Արտահանել PDF',
    copied: 'Պատճենված է',
    currency: '֏',
    amd: 'ՀՀ դրամ',
    noteDefault: '* Հաշվարկները կրում են տեղեկատվական բնույթ',

    cards: [
      {
        slug: 'salary',
        to: '/calculators/salary',
        icon_name: 'Calculator',
        category: 'salary',
        title: 'Աշխատավարձի հաշվիչ',
        desc: 'Աշխատավարձի հաշվիչը հնարավորություն է տալիս պարզ և մատչելի կերպով հաշվարկել աշխատավարձի չափը, հարկերը և այլ վճարների չափերը։',
        tags: ['աշխատավարձ', 'հարկ', 'կուտակային', 'դրոշմանիշ']
      },
      {
        slug: 'estimate',
        to: '/calculators/estimate',
        icon_name: 'Calculator',
        category: 'project',
        title: 'Նախագծերի հաշվիչ',
        desc: 'Հաշվիչը հնարավորություն է տալիս հաշվարկել տարբեր ծառայությունների, աշխատանքների և պրոյեկտների բյուջեն՝ ինչպես պատվիրատուների, այնպես էլ կատարողների համար։',
        tags: ['նախագիծ', 'արժեք', 'գնահատում', 'սմետա']
      },
      {
        slug: 'turnover-tax',
        to: '/calculators/turnover-tax',
        icon_name: 'Calculator',
        category: 'tax',
        title: 'Շրջհարկի հաշվիչ',
        desc: 'Շրջանառության հարկի հաշվիչը հնարավորություն է տալիս հաշվարկել կազմակերպության կամ ԱՁ-ի եռամսյակային շրջանառության հարկը: Տող 1-5 համար լրացվում է շրջանառության ծավալը, գործունեության հետ անմիջականորեն կապ ունեցող ծախս (ինքնարժեք) ...',
        tags: ['շրջանառություն', 'հարկ', 'եռամսյակ', 'գործունեություն']
      },
      {
        slug: 'armenian-tax',
        to: '/calculators/armenian-tax',
        icon_name: 'Calculator',
        category: 'tax',
        title: 'Շահութահարկի հաշվիչ',
        desc: 'Հաշվեք շահութահարկը՝ եկամուտներ, ծախսեր, կորուստներ, նվազեցումներ և հարկվող շահույթ՝ 79 տողի ամբողջական հարկային աղյուսակով',
        tags: ['հայաստան', 'հարկային', 'շահութահարկ', 'եկամուտ', 'ծախս']
      },
      {
        slug: 'benefit',
        to: '/calculators/benefit',
        icon_name: 'Calculator',
        category: 'benefits',
        title: 'Նպաստի հաշվիչ',
        desc: 'Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն և այլն',
        tags: ['նպաստ', 'երեխա', 'հիվանդություն', 'ծննդաբերություն']
      }
    ],

    unifiedSalary: {
      title: 'Աշխատավարձի հաշվիչ',
      subtitle: 'Հաշվարկեք աշխատավարձը՝ պարզ, լրիվ կամ կեղտոտ/մաքուր ռեժիմով',
      chooseCalculator: 'Ընտրեք հաշվիչը',
      simpleTitle: 'Պարզ հաշվիչ',
      simpleDesc: 'Աշխատավարձի հաշվիչը հնարավորություն է տալիս պարզ և մատչելի կերպով հաշվարկել աշխատավարձի չափը, հարկերը և այլ վճարների չափերը։',
      simpleTags: ['աշխատավարձ', 'հարկ', 'կուտակային'],
      compTitle: 'Ամբողջական հաշվիչ',
      compDesc: 'Հաշվեք աշխատավարձի ֆոնդը, հարկերը, ծախսերը և վերջնական գինը՝ ժամավճարային, օրավճարային և ամսավճարային դրույքներով',
      compTags: ['աշխատավարձ', 'ֆոնդ', 'հարկ'],
      payrollTitle: 'ՀՀ Աշխատավարձի ամբողջական հաշվարկ',
      payrollDesc: 'Հաշվեք կեղտոտ/մաքուր աշխատավարձը՝ եկամտահարկ, սոցիալական վճարներ և դրոշմանիշային վճար',
      payrollTags: ['աշխատավարձ', 'կեղտոտ', 'մաքուր']
    },

    salary: {
      title: 'Աշխատավարձի հաշվիչ',
      description: 'Հաշվեք գրանցված ↔ մաքուր աշխատավարձը՝ հաշվի առնելով եկամտային հարկը, կուտակային վճարներն ու դրոշմանիշային վճարը։',
      modeLabel: 'Հաշվարկի ռեժիմ',
      grossToNet: 'Գրանցված (Gross) → Մաքուր (Net)',
      netToGross: 'Մաքուր (Net) → Գրանցված (Gross)',
      grossAmountLabel: 'Գրանցված աշխատավարձ (Gross)',
      netAmountLabel: 'Մաքուր աշխատավարձ (Net)',
      amountPlaceholder: 'Օրինակ՝ 300000',
      itPrivilegeLabel: 'ՏՏ արտոնյալ հարկում (10%)',
      itPrivilegeDesc: 'Նշեք, եթե կիրառվում է ՏՏ ոլորտի 10% եկամտային հարկի արտոնությունը։',
      pensionLabel: 'Կուտակային կենսաթոշակային համակարգ',
      pensionMandatory: 'Պարտադիր (1974թ. և հետո ծնվածներ)',
      pensionVoluntaryPre2018: 'Կամավոր (մինչև 07.2018 — պարտադիրի կանոններով)',
      pensionVoluntaryPost2018: 'Կամավոր (07.2018 հետո — 5% / առավելագույնը 56,250 ֏)',
      pensionNone: 'Չեմ մասնակցում',
      incomeTaxLabel: 'Եկամտային հարկ',
      pensionFeeLabel: 'Կուտակային վճար (աշխատակից)',
      statePensionLabel: 'Պետության համաֆինանսավորում',
      stampDutyLabel: 'Դրոշմանիշային վճար (Զինծառայողների ապահովագրության հիմնադրամ)',
      netResultLabel: 'Մաքուր աշխատավարձ (առձեռն)',
      grossResultLabel: 'Անհրաժեշտ գրանցված աշխատավարձ (Gross)',
      note: '* Հաշվարկները կատարված են ՀՀ գործող հարկային օրենսդրությանը համապատասխան։',
      validationAmount: 'Գումարը պետք է լինի դրական թիվ'
    },

    turnoverTax: {
      title: 'Շրջհարկի հաշվիչ',
      subtitle: 'Հաշվեք եռամսյակային շրջանառության հարկը',
      description: 'Հաշվարկեք շրջանառության հարկը՝ ըստ գործունեության տեսակների, անմիջական ծախսերի և նվազեցումների։',
      infoBanner: 'Տող 1-5 համար լրացվում է շրջանառության ծավալը, գործունեության հետ անմիջականորեն կապ ունեցող ծախսերը (ինքնարժեքը) և վարչական ծախսերը։ Տող 6-11 համար լրացվում է միայն շրջանառության ծավալը։',
      colActivity: 'Գործունեության տեսակ / Տող',
      colTurnover: 'Շրջանառության ծավալ (դրամ)',
      colDirectCosts: 'Անմիջական ծախս (ինքնարժեք)',
      colAdminCosts: 'Վարչական ծախս',
      colTaxRate: 'Հարկի դրույք (%)',
      colDeductionPercent: 'Նվազեցման %',
      colMinTaxPercent: 'Նվազագույն հարկի %',
      colMinTaxAmount: 'Նվազագույն հարկ (դրամ)',
      colActualTaxPercent: 'Փաստացի հարկ %',
      colTaxPayable: 'Վճարման ենթակա հարկ (դրամ)',
      activities: [
        '1. Սննդառական և խմիչքի, այլ սննդամթերքի արտադրությունից ստացվող եկամուտների մասով հարկի հաշվարկ',
        '2. Ապահովագրական ակտիվների օտարումից ստացվող եկամուտների մասով հարկի հաշվարկ',
        '3. Քաղաքացիական իրավական բնույթի պայմանագրերով մատուցվող ծառայությունների դիմաց ֆիզիկական անձանց կողմից ստացվող եկամուտներ',
        '4. Գործունեությունից ստացվող եկամուտների մասով հարկի հաշվարկ',
        '5. Այլ գործունեությունից ստացվող եկամուտների մասով հարկի հաշվարկ',
        '6. Երկրորդային շրջանառության հարկի հաշվարկ',
        '7. Բանկային գործառնություններից ստացվող եկամուտներ',
        '8. Վարկային կազմակերպությունների կողմից ստացվող եկամուտներ',
        '9. Օտարերկրյա արժույթի վաճառքից ստացվող եկամուտներ',
        '10. Այլ գործունեությունից ստացվող եկամուտներ (ֆիքսված)',
        '11. Այլ ակտիվների, այդ թվում՝ անշարժ գույքի օտարումից ստացվող եկամուտներ'
      ],
      totalTurnover: 'Ընդամենը շրջանառություն',
      totalDeductions: 'Ընդամենը նվազեցվող ծախսեր',
      totalMinTax: 'Ընդամենը նվազագույն հարկ',
      totalTaxPayable: 'Ընդամենը վճարման ենթակա հարկ',
      resetValues: 'Մաքրել տվյալները',
      note: '* Հաշվարկները կատարվում են ըստ ՀՀ հարկային օրենսգրքի շրջանառության հարկի բաժնի։'
    },

    benefit: {
      title: 'Նպաստի հաշվիչ',
      description: 'Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն, գործազրկություն և հաշմանդամություն',
      typeLabel: 'Նպաստի տեսակ',
      types: {
        childCare: 'Երեխայի խնամք',
        sickLeave: 'Հիվանդության նպաստ',
        maternity: 'Ծննդաբերության նպաստ',
        unemployment: 'Գործազրկության նպաստ',
        disability: 'Հաշմանդամության նպաստ'
      },
      salaryLabel: 'Հիմնական աշխատավարձ (AMD)',
      salaryPlaceholder: 'Օրինակ՝ 300000',
      daysLabel: 'Օրերի քանակ',
      daysPlaceholder: 'Օրինակ՝ 30',
      childAgeLabel: 'Երեխայի տարիք',
      childAgePlaceholder: 'Օրինակ՝ 3',
      insuranceLabel: 'Ապահովագրություն',
      insuranceDesc: 'Ունե՞ք ապահովագրություն',
      dailyRateLabel: 'Օրական դրույքաչափ',
      calculatedBenefitLabel: 'Հաշվարկված նպաստ',
      maxBenefitLabel: 'Առավելագույն նպաստ',
      taxDeductionLabel: 'Եկամտային հարկ (20%)',
      netBenefitLabel: 'Մաքուր նպաստ',
      note: '* Հաշվարկները հիմնված են Հայաստանի Հանրապետության օրենսդրության վրա',
      descriptions: {
        childCareUnder3: 'Երեխայի խնամքի նպաստ (մինչև 3 տարեկան)',
        childCareOver3: 'Երեխայի խնամքի նպաստ (3-18 տարեկան)',
        sickLeaveInsured: 'Հիվանդության նպաստ (ապահովագրությամբ)',
        sickLeaveUninsured: 'Հիվանդության նպաստ (առանց ապահովագրության)',
        maternity: 'Ծննդաբերության նպաստ',
        unemployment: 'Գործազրկության նպաստ',
        disability: 'Հաշմանդամության նպաստ'
      }
    },

    project: {
      title: 'Նախագծերի հաշվիչ',
      description: 'Հաշվիչը հնարավորություն է տալիս հաշվարկել տարբեր ծառայությունների, աշխատանքների և պրոյեկտների բյուջեն՝ ինչպես պատվիրատուների, այնպես էլ կատարողների համար։',
      infoBanner: 'Հաշվիչը հնարավորություն է տալիս հաշվարկել տարբեր ծառայությունների, աշխատանքների է պրոյեկտների բյուջեն, է օգտակար կլինի ինչպես պատվիրատուների, այնպես էլ կատարողների համար: Նախագծի արժեքը հաշվարկելու համար լրացրեք աշխատավարձային մասը (հաստիքների զուտ արժեքները), այլ ծախսային հոդվածները, նշեք կազմակերպության շահույթը (mapma) Կատարողի ԱԱՀ վճարող լինելը կամ ոչ',
      salarySectionTitle: 'Աշխատավարձային մաս',
      hourlyTitle: 'ԺԱՄԱՎՃԱՐ ԱՌՁԵՌՆ',
      hourlyRate: 'ժամավճար',
      hourlyHoursPerDay: 'ժամեր օրվա մեջ',
      hourlyDaysPerMonth: 'օրերի քանակ ամսվա մեջ',
      dailyTitle: 'ՕՐԱՎՃԱՐ ԱՌՁԵՌՆ',
      dailyRate: 'օրավճար',
      dailyDaysPerMonth: 'օրերի քանակ ամսվա մեջ',
      monthlyTitle: 'ՀԱՍՏԻՔ (ԱՄՍԱՎՃԱՐ) ԱՌՁԵՌՆ',
      monthlyRate: 'ամսավճար / հաստիք',
      positionLabel: 'հաստիք',
      positionCostNote: 'Ներգև — յուրաքանչյուր հաստիքի արժեքը (ժամավճար × ժամ/օր × օր/ամիս)',
      statsPositionsCount: 'Հաստիքների քանակ',
      statsPositionsValues: 'Հաստիքների արժեքներ',
      statsTotalCount: 'Ընդամենը հաստիքների քանակ',
      statsTotalFundNet: 'Ընդամենը աշխատավարձային ֆոնդ առձեռն',
      taxesIncomeTax: 'Եկամտային հարկ',
      taxesSocialFee: 'Սոցիալական վճար',
      taxesStampDuty: 'Դրոշմանիշային վճար',
      taxesTotalWithTaxes: 'Ընդամենը աշխատավարձ հարկերով',
      otherExpensesTitle: 'Այլ ծախսեր',
      otherExpenseLabel: 'Այլ ծախսեր',
      otherExpensesCommentLabel: 'Ծախսերի մեկնաբանություն',
      otherExpensesCommentPlaceholder: 'Մեկնաբանություն (ըստ ցանկության)',
      profitPercentLabel: 'Կազմակերպության շահույթ (մարժա, %)',
      profitAmountLabel: 'Կազմակերպության շահույթ, դրամով',
      serviceCostInclTaxesLabel: 'Ընդհանուր ծառայության արժեքը, ներառյալ հարկեր',
      serviceCostFormula: '(Ընդ. աշխատավարձ հարկերով + այլ ծախսեր 1–5 + շահույթ դրամով × 0.82)',
      vatPayerLabel: 'ԱԱՀ վճարող (այո/ոչ)',
      vatAmountLabel: 'ԱԱՀ (20%)',
      finalTotalLabel: 'Ընդամենը նախագծի արժեք'
    },

    armenianTax: {
      title: 'Շահութահարկի հաշվիչ',
      description: 'Հաշվեք շահութահարկը՝ եկամուտներ, ծախսեր, կորուստներ, նվազեցումներ և հարկվող շահույթ',
      infoBanner: 'Հաշվարկի կարգ՝ Եկամուտներ (1-24), Ծախսեր (25-45), Կորուստներ (46-50), Նվազեցումներ (51-66), Հաշվարկներ (67-79) ավտոմատ հաշվարկվում են։',
      searchPlaceholder: 'Փնտրել տողեր... (օր. եկամուտ, հարկ, շահույթ)',
      filterSection: 'Բաժին',
      filterCategory: 'Կատեգորիա',
      allSections: 'Բոլորը',
      allCategories: 'Բոլոր կատեգորիաները',
      sectionIncomes: 'Եկամուտներ',
      sectionExpenses: 'Ծախսեր',
      sectionLosses: 'Կորուստներ',
      sectionReductions: 'Նվազեցումներ',
      sectionCalculation: 'Հաշվարկներ',
      colNumber: 'Տող',
      colName: 'Անվանում',
      colValue: 'Գումար (AMD)',
      colCategory: 'Կատեգորիա',
      totalIncomes: 'Ընդամենը եկամուտներ',
      totalExpenses: 'Ընդամենը ծախսեր',
      totalLosses: 'Ընդամենը կորուստներ',
      totalReductions: 'Ընդամենը նվազեցումներ',
      taxableProfit: 'Հարկվող շահույթ (կորուստ)',
      calculatedProfitTax: 'Հաշվարկված շահութահարկ (18%)',
      payableProfitTax: 'Վճարման ենթակա շահութահարկ',
      resetValues: 'Մաքրել բոլոր տողերը',
      note: '* Հաշվարկը կատարվում է ըստ ՀՀ հարկային օրենսգրքի շահութահարկի դրույթների։'
    }
  },

  ru: {
    metaTitle: 'Калькуляторы — Финансовые калькуляторы | Amroyan Consulting',
    metaDesc: 'Финансовые калькуляторы: Зарплата, Налог на оборот, Налог на прибыль, Пособия, Смета проектов',
    backToCalculators: 'Ко всем калькуляторам',
    openCalculator: 'Открыть калькулятор',
    calculate: 'Рассчитать',
    resultsTitle: 'Результаты расчета',
    reset: 'Очистить',
    exportPdf: 'Экспорт в PDF',
    copied: 'Скопировано',
    currency: '֏',
    amd: 'драмов',
    noteDefault: '* Расчеты носят информационный характер',

    cards: [
      {
        slug: 'salary',
        to: '/calculators/salary',
        icon_name: 'Calculator',
        category: 'salary',
        title: 'Калькулятор заработной платы',
        desc: 'Калькулятор заработной платы позволяет просто и доступно рассчитать размер зарплаты, налоги и другие обязательные платежи.',
        tags: ['зарплата', 'подоходный налог', 'пенсионный', 'гербовый сбор']
      },
      {
        slug: 'estimate',
        to: '/calculators/estimate',
        icon_name: 'Calculator',
        category: 'project',
        title: 'Калькулятор сметы проектов',
        desc: 'Калькулятор позволяет рассчитать бюджет различных услуг, работ и проектов как для заказчиков, так и для исполнителей.',
        tags: ['проект', 'смета', 'бюджет', 'зарплата']
      },
      {
        slug: 'turnover-tax',
        to: '/calculators/turnover-tax',
        icon_name: 'Calculator',
        category: 'tax',
        title: 'Калькулятор налога с оборота',
        desc: 'Калькулятор позволяет рассчитать квартальный налог с оборота для организации или ИП: объем выручки, прямые расходы (себестоимость) и налог к уплате.',
        tags: ['налог с оборота', 'выручка', 'квартал', 'деятельность']
      },
      {
        slug: 'armenian-tax',
        to: '/calculators/armenian-tax',
        icon_name: 'Calculator',
        category: 'tax',
        title: 'Калькулятор налога на прибыль',
        desc: 'Расчет налога на прибыль: доходы, расходы, убытки, вычеты и налогооблагаемая прибыль по полной 79-строчной таблице.',
        tags: ['Армения', 'налоговый', 'налог на прибыль', 'доходы', 'расходы']
      },
      {
        slug: 'benefit',
        to: '/calculators/benefit',
        icon_name: 'Calculator',
        category: 'benefits',
        title: 'Калькулятор пособий',
        desc: 'Расчет различных видов государственных пособий: по уходу за ребенком, больничных, по беременности и родам и др.',
        tags: ['пособие', 'ребенок', 'больничный', 'декретные']
      }
    ],

    unifiedSalary: {
      title: 'Калькулятор заработной платы',
      subtitle: 'Рассчитайте заработную плату в простом, расширенном или полном режиме',
      chooseCalculator: 'Выберите калькулятор',
      simpleTitle: 'Простой калькулятор',
      simpleDesc: 'Калькулятор заработной платы позволяет просто и доступно рассчитать размер зарплаты, налоги и другие обязательные платежи.',
      simpleTags: ['зарплата', 'налог', 'пенсионный'],
      compTitle: 'Комплексный калькулятор',
      compDesc: 'Расчет фонда оплаты труда, налогов, расходов и финальной стоимости по почасовым, суточным и месячным ставкам',
      compTags: ['зарплата', 'фонд', 'налог'],
      payrollTitle: 'Полный расчет зарплаты в РА',
      payrollDesc: 'Детальный расчет Gross/Net зарплаты: подоходный налог, социальные выплаты и гербовый сбор',
      payrollTags: ['зарплата', 'Gross', 'Net']
    },

    salary: {
      title: 'Калькулятор заработной платы',
      description: 'Расчет начисленной ↔ чистой зарплаты с учетом подоходного налога, накопительных пенсионных взносов и гербового сбора.',
      modeLabel: 'Режим расчета',
      grossToNet: 'Начисленная (Gross) → Чистая на руки (Net)',
      netToGross: 'Чистая на руки (Net) → Начисленная (Gross)',
      grossAmountLabel: 'Начисленная заработная плата (Gross)',
      netAmountLabel: 'Чистая заработная плата на руки (Net)',
      amountPlaceholder: 'Например: 300000',
      itPrivilegeLabel: 'ИТ-льгота (подоходный налог 10%)',
      itPrivilegeDesc: 'Отметьте, если к вашей организации применяется льготная ставка подоходного налога 10%.',
      pensionLabel: 'Накопительная пенсионная система',
      pensionMandatory: 'Обязательное участие (рожденные в 1974 г. и позже)',
      pensionVoluntaryPre2018: 'Добровольное (до 07.2018 — по правилам обязательного)',
      pensionVoluntaryPost2018: 'Добровольное (после 07.2018 — 5% / макс. 56 250 ֏)',
      pensionNone: 'Не участвую',
      incomeTaxLabel: 'Подоходный налог',
      pensionFeeLabel: 'Накопительный пенсионный взнос (работник)',
      statePensionLabel: 'Софинансирование государства',
      stampDutyLabel: 'Гербовый сбор (Фонд страхования военнослужащих)',
      netResultLabel: 'Чистая зарплата на руки (Net)',
      grossResultLabel: 'Необходимая начисленная зарплата (Gross)',
      note: '* Расчеты выполнены в соответствии с действующим налоговым законодательством Республики Армения.',
      validationAmount: 'Сумма должна быть положительным числом'
    },

    turnoverTax: {
      title: 'Калькулятор налога с оборота',
      subtitle: 'Расчет квартального налога с оборота',
      description: 'Рассчитайте сумму налога с оборота по видам коммерческой деятельности, прямым затратам и вычетам.',
      infoBanner: 'Для строк 1–5 заполняются объем оборота (выручка), прямые расходы (себестоимость) и административные расходы. Для строк 6–11 заполняется только объем оборота.',
      colActivity: 'Вид деятельности / Строка',
      colTurnover: 'Объем оборота (AMD)',
      colDirectCosts: 'Прямые расходы (себестоимость)',
      colAdminCosts: 'Административные расходы',
      colTaxRate: 'Ставка налога (%)',
      colDeductionPercent: '% вычета',
      colMinTaxPercent: '% мин. налога',
      colMinTaxAmount: 'Мин. сумма налога (AMD)',
      colActualTaxPercent: 'Фактический налог %',
      colTaxPayable: 'Налог к уплате (AMD)',
      activities: [
        '1. Производство продуктов питания, напитков и прочей пищевой продукции',
        '2. Отчуждение страховых активов',
        '3. Доходы физических лиц по договорам гражданско-правового характера (ГПХ)',
        '4. Доходы от основной коммерческой деятельности',
        '5. Доходы от прочей деятельности (с правом вычетов)',
        '6. Вторичный налог с оборота',
        '7. Доходы от банковских операций',
        '8. Доходы кредитных организаций',
        '9. Доходы от продажи иностранной валюты',
        '10. Прочая деятельность (фиксированная ставка)',
        '11. Отчуждение иных активов, включая недвижимое имущество'
      ],
      totalTurnover: 'Итого оборот (выручка)',
      totalDeductions: 'Итого вычитаемые расходы',
      totalMinTax: 'Итого минимальный налог',
      totalTaxPayable: 'Итого налог к уплате',
      resetValues: 'Очистить данные',
      note: '* Расчет осуществляется согласно положениям Налогового кодекса Республики Армения о налоге с оборота.'
    },

    benefit: {
      title: 'Калькулятор пособий',
      description: 'Расчет различных видов государственных пособий: по уходу за ребенком, больничных, по беременности и родам и др.',
      typeLabel: 'Вид пособия',
      types: {
        childCare: 'Пособие по уходу за ребенком',
        sickLeave: 'Пособие по временной нетрудоспособности (больничный)',
        maternity: 'Пособие по беременности и родам (декретные)',
        unemployment: 'Пособие по безработице',
        disability: 'Пособие по инвалидности'
      },
      salaryLabel: 'Базовая заработная плата (AMD)',
      salaryPlaceholder: 'Например: 300000',
      daysLabel: 'Количество дней',
      daysPlaceholder: 'Например: 30',
      childAgeLabel: 'Возраст ребенка',
      childAgePlaceholder: 'Например: 3',
      insuranceLabel: 'Социальное страхование',
      insuranceDesc: 'Наличие социального страхования',
      dailyRateLabel: 'Среднедневная ставка',
      calculatedBenefitLabel: 'Начисленное пособие',
      maxBenefitLabel: 'Максимальный лимит пособия',
      taxDeductionLabel: 'Подоходный налог (20%)',
      netBenefitLabel: 'Чистая сумма к выплате',
      note: '* Расчеты основаны на трудовом и социальном законодательстве Республики Армения.',
      descriptions: {
        childCareUnder3: 'Пособие по уходу за ребенком (до 3 лет)',
        childCareOver3: 'Пособие по уходу за ребенком (от 3 до 18 лет)',
        sickLeaveInsured: 'Пособие по временной нетрудоспособности (со страховкой)',
        sickLeaveUninsured: 'Пособие по временной нетрудоспособности (без страховки)',
        maternity: 'Пособие по беременности и родам',
        unemployment: 'Пособие по безработице',
        disability: 'Пособие по инвалидности'
      }
    },

    project: {
      title: 'Калькулятор сметы проектов',
      description: 'Калькулятор позволяет рассчитать бюджет различных услуг, работ и проектов как для заказчиков, так и для исполнителей.',
      infoBanner: 'Калькулятор позволяет точно рассчитать бюджет различных услуг, работ и проектов, что полезно как для заказчиков, так и для исполнителей. Заполните зарплатную часть (чистые ставки специалистов), статьи прочих расходов, укажите норму прибыли организации (маржу) и статус плательщика НДС.',
      salarySectionTitle: 'Зарплатная часть (ФОТ)',
      hourlyTitle: 'ПОЧАСОВАЯ ОПЛАТА НА РУКИ',
      hourlyRate: 'ставка/час',
      hourlyHoursPerDay: 'часов/день',
      hourlyDaysPerMonth: 'дней/месяц',
      dailyTitle: 'ПОСУТОЧНАЯ ОПЛАТА НА РУКИ',
      dailyRate: 'ставка/день',
      dailyDaysPerMonth: 'дней/месяц',
      monthlyTitle: 'ФИКСИРОВАННЫЙ ОКЛАД НА РУКИ',
      monthlyRate: 'оклад/месяц',
      positionLabel: 'позиция',
      positionCostNote: 'Стоимость каждой позиции на руки',
      statsPositionsCount: 'Количество позиций',
      statsPositionsValues: 'Суммы по типам оплаты',
      statsTotalCount: 'Всего штатных единиц',
      statsTotalFundNet: 'Итого чистый ФОТ на руки',
      taxesIncomeTax: 'Подоходный налог',
      taxesSocialFee: 'Социальный взнос',
      taxesStampDuty: 'Гербовый сбор',
      taxesTotalWithTaxes: 'Итого ФОТ с налогами',
      otherExpensesTitle: 'Прочие расходы',
      otherExpenseLabel: 'Прочие расходы',
      otherExpensesCommentLabel: 'Комментарий к расходам',
      otherExpensesCommentPlaceholder: 'Пояснение к расходам (по желанию)',
      profitPercentLabel: 'Маржа организации (%)',
      profitAmountLabel: 'Прибыль организации (AMD)',
      serviceCostInclTaxesLabel: 'Общая стоимость услуг с налогами',
      serviceCostFormula: '(ФОТ с налогами + прочие расходы 1–5 + прибыль в драмах × 0.82)',
      vatPayerLabel: 'Плательщик НДС (да/нет)',
      vatAmountLabel: 'НДС (20%)',
      finalTotalLabel: 'Итоговая стоимость проекта'
    },

    armenianTax: {
      title: 'Калькулятор налога на прибыль',
      description: 'Расчет налога на прибыль: доходы, расходы, убытки, вычеты и налогооблагаемая прибыль по полной 79-строчной таблице.',
      infoBanner: 'Калькулятор основан на официальной форме годовой декларации по налогу на прибыль Республики Армения. Заполните соответствующие строки для автоматического расчета налогооблагаемой прибыли и налога к уплате.',
      searchPlaceholder: 'Поиск строки по названию или номеру...',
      filterSection: 'Раздел',
      filterCategory: 'Категория',
      allSections: 'Все разделы',
      allCategories: 'Все категории',
      sectionIncomes: 'Доходы (строки 1–24)',
      sectionExpenses: 'Расходы (строки 25–45)',
      sectionLosses: 'Убытки (строки 46–52)',
      sectionReductions: 'Вычеты (строки 53–65)',
      sectionCalculation: 'Расчет налога (строки 66–79)',
      colNumber: '№',
      colName: 'Наименование строки',
      colValue: 'Сумма (AMD)',
      colCategory: 'Категория',
      totalIncomes: 'Итого доходы',
      totalExpenses: 'Итого расходы',
      totalLosses: 'Итого убытки',
      totalReductions: 'Итого вычеты',
      taxableProfit: 'Налогооблагаемая прибыль',
      calculatedProfitTax: 'Начисленный налог на прибыль (18%)',
      payableProfitTax: 'Налог на прибыль к уплате',
      resetValues: 'Очистить все строки',
      note: '* Расчет производится в строгом соответствии с Налоговым кодексом Республики Армения.'
    }
  },

  en: {
    metaTitle: 'Calculators — Financial Calculators | Amroyan Consulting',
    metaDesc: 'Financial calculators: Salary, Turnover tax, Profit tax, Benefits, Project estimates',
    backToCalculators: 'Back to all calculators',
    openCalculator: 'Open calculator',
    calculate: 'Calculate',
    resultsTitle: 'Calculation Results',
    reset: 'Clear',
    exportPdf: 'Export to PDF',
    copied: 'Copied',
    currency: '֏',
    amd: 'AMD',
    noteDefault: '* Calculations are for informational purposes only',

    cards: [
      {
        slug: 'salary',
        to: '/calculators/salary',
        icon_name: 'Calculator',
        category: 'salary',
        title: 'Salary Calculator',
        desc: 'The salary calculator allows you to easily and accurately calculate gross and net salary, taxes, and other mandatory contributions.',
        tags: ['salary', 'income tax', 'pension', 'stamp duty']
      },
      {
        slug: 'estimate',
        to: '/calculators/estimate',
        icon_name: 'Calculator',
        category: 'project',
        title: 'Project Estimate Calculator',
        desc: 'Calculate project budgets for various services, works, and deliverables — useful for both clients and contractors.',
        tags: ['project', 'estimate', 'budget', 'salary']
      },
      {
        slug: 'turnover-tax',
        to: '/calculators/turnover-tax',
        icon_name: 'Calculator',
        category: 'tax',
        title: 'Turnover Tax Calculator',
        desc: 'Calculate quarterly turnover tax for companies or sole proprietors based on revenue, direct costs (cost of sales), and deductions.',
        tags: ['turnover tax', 'revenue', 'quarterly', 'business']
      },
      {
        slug: 'armenian-tax',
        to: '/calculators/armenian-tax',
        icon_name: 'Calculator',
        category: 'tax',
        title: 'Corporate Profit Tax Calculator',
        desc: 'Calculate corporate profit tax: revenues, expenses, losses, deductions, and taxable profit across the complete 79-line tax return.',
        tags: ['Armenia', 'tax', 'profit tax', 'revenue', 'expenses']
      },
      {
        slug: 'benefit',
        to: '/calculators/benefit',
        icon_name: 'Calculator',
        category: 'benefits',
        title: 'State Benefit Calculator',
        desc: 'Calculate various types of state benefits: childcare, temporary sick leave, maternity, etc.',
        tags: ['benefit', 'childcare', 'sick leave', 'maternity']
      }
    ],

    unifiedSalary: {
      title: 'Salary Calculator',
      subtitle: 'Calculate salary in simple, comprehensive, or full payroll breakdown modes',
      chooseCalculator: 'Choose Calculator',
      simpleTitle: 'Simple Calculator',
      simpleDesc: 'The salary calculator allows you to easily and accurately calculate gross and net salary, taxes, and other mandatory contributions.',
      simpleTags: ['salary', 'tax', 'pension'],
      compTitle: 'Comprehensive Calculator',
      compDesc: 'Calculate total payroll fund, taxes, direct costs, and final client rate across hourly, daily, and monthly positions',
      compTags: ['salary', 'fund', 'tax'],
      payrollTitle: 'Full Armenian Payroll Calculation',
      payrollDesc: 'Complete gross/net salary breakdown: income tax, social security contributions, and stamp duty',
      payrollTags: ['salary', 'gross', 'net']
    },

    salary: {
      title: 'Salary Calculator',
      description: 'Calculate registered gross ↔ net take-home salary considering income tax, pension contributions, and military stamp duty.',
      modeLabel: 'Calculation Mode',
      grossToNet: 'Gross (Registered) → Net (Take-home)',
      netToGross: 'Net (Take-home) → Gross (Registered)',
      grossAmountLabel: 'Gross Salary (Registered)',
      netAmountLabel: 'Net Salary (Take-home)',
      amountPlaceholder: 'e.g. 300000',
      itPrivilegeLabel: 'IT Sector Tax Privilege (10%)',
      itPrivilegeDesc: 'Check if your company qualifies for the 10% IT income tax incentive.',
      pensionLabel: 'Mandatory Pension System',
      pensionMandatory: 'Mandatory (born 1974 & later)',
      pensionVoluntaryPre2018: 'Voluntary (prior to 07/2018 — mandatory rules)',
      pensionVoluntaryPost2018: 'Voluntary (after 07/2018 — 5% / max 56,250 ֏)',
      pensionNone: 'Not participating',
      incomeTaxLabel: 'Income Tax',
      pensionFeeLabel: 'Pension Contribution (Employee)',
      statePensionLabel: 'State Co-Financing',
      stampDutyLabel: 'Military Insurance Fund (Stamp Duty)',
      netResultLabel: 'Net Take-Home Salary',
      grossResultLabel: 'Required Gross Salary',
      note: '* Calculations are aligned with the current tax legislation of the Republic of Armenia.',
      validationAmount: 'Amount must be a positive number'
    },

    turnoverTax: {
      title: 'Turnover Tax Calculator',
      subtitle: 'Quarterly turnover tax calculation',
      description: 'Calculate quarterly turnover tax by business activities, direct expenses, and documented deductions.',
      infoBanner: 'For lines 1–5, enter turnover volume (revenue), direct expenses (cost of sales), and administrative expenses. For lines 6–11, enter turnover volume only.',
      colActivity: 'Activity / Line',
      colTurnover: 'Turnover Volume (AMD)',
      colDirectCosts: 'Direct Costs (Cost of Sales)',
      colAdminCosts: 'Administrative Costs',
      colTaxRate: 'Tax Rate (%)',
      colDeductionPercent: 'Deduction %',
      colMinTaxPercent: 'Min. Tax %',
      colMinTaxAmount: 'Min. Tax Amount (AMD)',
      colActualTaxPercent: 'Effective Tax Rate %',
      colTaxPayable: 'Tax Payable (AMD)',
      activities: [
        '1. Production of food, beverages, and other food products',
        '2. Alienation of insurance assets',
        '3. Services under civil law contracts rendered by individuals',
        '4. Income from core business operations',
        '5. Income from other activities (with deductions)',
        '6. Secondary turnover tax',
        '7. Income from banking operations',
        '8. Income of credit organizations',
        '9. Income from foreign currency sales',
        '10. Other activities (fixed rate)',
        '11. Alienation of other assets including real estate'
      ],
      totalTurnover: 'Total Turnover (Revenue)',
      totalDeductions: 'Total Documented Deductions',
      totalMinTax: 'Total Minimum Tax',
      totalTaxPayable: 'Total Tax Payable',
      resetValues: 'Clear Values',
      note: '* Computed in accordance with the Turnover Tax chapter of the RA Tax Code.'
    },

    benefit: {
      title: 'State Benefit Calculator',
      description: 'Calculate various types of state benefits: childcare, temporary sick leave, maternity, etc.',
      typeLabel: 'Benefit Type',
      types: {
        childCare: 'Childcare Benefit',
        sickLeave: 'Temporary Sick Leave Benefit',
        maternity: 'Maternity Benefit',
        unemployment: 'Unemployment Benefit',
        disability: 'Disability Benefit'
      },
      salaryLabel: 'Base Salary (AMD)',
      salaryPlaceholder: 'e.g. 300000',
      daysLabel: 'Number of Days',
      daysPlaceholder: 'e.g. 30',
      childAgeLabel: "Child's Age",
      childAgePlaceholder: 'e.g. 3',
      insuranceLabel: 'Social Insurance Coverage',
      insuranceDesc: 'Has social insurance coverage',
      dailyRateLabel: 'Average Daily Rate',
      calculatedBenefitLabel: 'Calculated Benefit',
      maxBenefitLabel: 'Maximum Monthly Cap',
      taxDeductionLabel: 'Income Tax Deduction (20%)',
      netBenefitLabel: 'Net Payable Benefit',
      note: '* Calculations are based on Armenian labor and social security laws.',
      descriptions: {
        childCareUnder3: 'Childcare Benefit (under 3 years old)',
        childCareOver3: 'Childcare Benefit (3–18 years old)',
        sickLeaveInsured: 'Temporary Sick Leave Benefit (with insurance)',
        sickLeaveUninsured: 'Temporary Sick Leave Benefit (without insurance)',
        maternity: 'Maternity Benefit',
        unemployment: 'Unemployment Benefit',
        disability: 'Disability Benefit'
      }
    },

    project: {
      title: 'Project Estimate Calculator',
      description: 'Calculate project budgets for various services, works, and deliverables — useful for both clients and contractors.',
      infoBanner: 'This calculator allows contractors and clients to accurately determine project budgets for services and deliverables. Fill in the payroll section (net specialist rates), overhead expenses, profit margin, and VAT payer status.',
      salarySectionTitle: 'Payroll Section (Net Rates)',
      hourlyTitle: 'HOURLY TAKE-HOME RATE',
      hourlyRate: 'rate/hour',
      hourlyHoursPerDay: 'hours/day',
      hourlyDaysPerMonth: 'days/month',
      dailyTitle: 'DAILY TAKE-HOME RATE',
      dailyRate: 'rate/day',
      dailyDaysPerMonth: 'days/month',
      monthlyTitle: 'FIXED MONTHLY TAKE-HOME SALARY',
      monthlyRate: 'salary/month',
      positionLabel: 'position',
      positionCostNote: 'Individual net cost per position',
      statsPositionsCount: 'Positions Count',
      statsPositionsValues: 'Subtotals by Payment Type',
      statsTotalCount: 'Total Headcount',
      statsTotalFundNet: 'Total Net Payroll Fund',
      taxesIncomeTax: 'Income Tax',
      taxesSocialFee: 'Social Payment',
      taxesStampDuty: 'Stamp Duty Fee',
      taxesTotalWithTaxes: 'Total Payroll Fund (Gross incl. Taxes)',
      otherExpensesTitle: 'Overhead & Direct Expenses',
      otherExpenseLabel: 'Other Expense',
      otherExpensesCommentLabel: 'Expense Notes / Description',
      otherExpensesCommentPlaceholder: 'Optional notes regarding expenses',
      profitPercentLabel: 'Company Margin / Profit (%)',
      profitAmountLabel: 'Company Profit Amount (AMD)',
      serviceCostInclTaxesLabel: 'Total Service Cost including Taxes',
      serviceCostFormula: '(Gross Payroll + Expenses 1–5 + Profit in AMD × 0.82)',
      vatPayerLabel: 'VAT Payer (Yes/No)',
      vatAmountLabel: 'VAT (20%)',
      finalTotalLabel: 'Total Project Cost'
    },

    armenianTax: {
      title: 'Corporate Profit Tax Calculator',
      description: 'Calculate corporate profit tax: revenues, expenses, losses, deductions, and taxable profit across the complete 79-line tax return.',
      infoBanner: 'This calculator is modeled after the official Republic of Armenia Annual Corporate Profit Tax Declaration form. Complete the applicable lines to automatically calculate taxable profit and payable tax.',
      searchPlaceholder: 'Search line by name or number...',
      filterSection: 'Section',
      filterCategory: 'Category',
      allSections: 'All Sections',
      allCategories: 'All Categories',
      sectionIncomes: 'Revenues (Lines 1–24)',
      sectionExpenses: 'Expenses (Lines 25–45)',
      sectionLosses: 'Losses (Lines 46–52)',
      sectionReductions: 'Deductions (Lines 53–65)',
      sectionCalculation: 'Tax Calculation (Lines 66–79)',
      colNumber: '№',
      colName: 'Line Description',
      colValue: 'Amount (AMD)',
      colCategory: 'Category',
      totalIncomes: 'Total Revenues',
      totalExpenses: 'Total Expenses',
      totalLosses: 'Total Losses',
      totalReductions: 'Total Deductions',
      taxableProfit: 'Taxable Profit',
      calculatedProfitTax: 'Calculated Profit Tax (18%)',
      payableProfitTax: 'Payable Profit Tax',
      resetValues: 'Reset All Lines',
      note: '* Computed strictly according to the Corporate Profit Tax provisions of the RA Tax Code.'
    }
  }
};

export const getCalculatorTranslations = (lang: Language = 'hy'): CalculatorTranslations => {
  return translations[lang] || translations.hy;
};
