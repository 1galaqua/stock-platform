import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export const he: Dictionary = {
  app: {
    name: "פלטפורמת מניות",
    tagline: "תובנות שבועיות על מניות",
  },
  language: {
    label: "שפה",
    en: "EN",
    he: "עב",
  },
  skipToContent: "דלג לתוכן הראשי",
  nav: {
    aria: "ניווט ראשי",
    home: "דף הבית",
    global: "מניות גלובליות",
    israel: "מניות ישראל",
  },
  footer: {
    refreshNote: "המלצות מתעדכנות כל {days} ימים ממקורות שוק אמינים.",
    disclaimer:
      "אין זה ייעוץ פיננסי. הנתונים וסיכומי הבינה המלאכותית מיועדים למידע בלבד.",
  },
  home: {
    badge: "רענון שבועי",
    title: "ניתוח מניות חכם, בנוי לבהירות",
    description:
      "{appName} מספקת שני לוחות מחוונים — מובילות גלובליות ומניות TASE — עם סנטימנט, רמות סיכון וסיכומי AI שמתעדכנים כל {days} ימים.",
    dashboardsAria: "כניסה ללוחות מחוונים",
    highlightsAria: "יתרונות הפלטפורמה",
    openDashboard: "פתח לוח מחוונים",
    global: {
      title: "מניות גלובליות מומלצות",
      description:
        "20 בחירות מ-Yahoo Finance, Finnhub, NASDAQ ועוד — מתעדכן שבועית.",
      badge: "20 מניות",
    },
    israel: {
      title: "מניות ישראל (TASE)",
      description:
        "לוח בורסת תל אביב עם שמות דו-לשוניים, סינון ענפים וחדשות שוק.",
      badge: "TASE",
    },
    features: {
      sentiment: {
        title: "סנטימנט שוק",
        body: "אותות שורי, ניטרלי או דובי בכל המלצה.",
      },
      risk: {
        title: "בחירות מודעות סיכון",
        body: "תוויות סיכון נמוך, בינוני וגבוה לפי האסטרטגיה שלך.",
      },
      sources: {
        title: "מקורות אמינים",
        body: "איגוד מ-Yahoo Finance, Alpha Vantage, Finnhub ונתוני TASE.",
      },
    },
  },
  globalPage: {
    badge: "שוק גלובלי",
    title: "מניות גלובליות מומלצות",
    description:
      "20 בחירות שבועיות ממקורות פיננסיים אמינים — מחירים, גרפים, סנטימנט, סיכון וסיכומים.",
    lastUpdated: "עודכן לאחרונה: {date}",
  },
  israelPage: {
    badge: "TASE · תל אביב · ₪ ILS",
    title: "לוח מניות ישראל",
    description:
      "המלצות TASE מובילות עם שמות בעברית ואנגלית, ביצועים יומיים ושבועיים, חדשות וסנטימנט.",
    lastUpdated: "עודכן לאחרונה: {date}",
  },
  dashboard: {
    sector: "ענף",
    risk: "סיכון",
    sortBy: "מיון לפי",
    all: "הכל",
    showing: "מציג {filtered} מתוך {total} המלצות",
    showingTase: "מציג {filtered} מתוך {total} המלצות TASE",
    searchGlobal: "חיפוש לפי סימול או שם חברה…",
    searchIsrael: "חיפוש לפי סימול, שם באנגלית או בעברית…",
    noGlobal: "אין עדיין המלצות גלובליות",
    noIsrael: "אין עדיין המלצות ישראליות",
    noGlobalDesc:
      "נתוני שוק חיים לא נטענו. השתמש ברענון בפיתוח או המתן ל-cron השבועי.",
    noIsraelDesc:
      "נתוני TASE חיים לא נטענו. השתמש ברענון בפיתוח או המתן ל-cron השבועי.",
    noMatches: "לא נמצאו תוצאות",
    noMatchesDesc: "נסה סימול, שם חברה, ענף או סינון סיכון אחר.",
    noMatchesIsraelDesc:
      "נסה סימול, שם בעברית או באנגלית, ענף או סינון סיכון אחר.",
    sort: {
      dailyChangeDesc: "שינוי יומי (גבוה → נמוך)",
      dailyChangeAsc: "שינוי יומי (נמוך → גבוה)",
      sentiment: "סנטימנט (שורי קודם)",
      risk: "סיכון (נמוך קודם)",
      sector: "ענף (א → ת)",
      name: "שם חברה (א → ת)",
    },
    riskLevels: {
      low: "נמוך",
      medium: "בינוני",
      high: "גבוה",
    },
  },
  statusBanner: {
    loaded: "{count} המלצות נטענו",
    sources: "מקורות: {sources}",
    dataUpdated: "נתונים עודכנו {date}",
    nextRefresh: "רענון מתוכנן הבא {date}",
    autoRefresh: "רענון אוטומטי: {schedule}",
    cronSchedule: "כל יום ראשון ב-06:00 UTC",
    lastJob: "משימה אחרונה: {status}",
    weeklyAuto: "רענון שבועי אוטומטי",
    stale:
      "הנתונים ישנים מ-{days} ימים. הפעל רענון או המתן ל-cron הבא.",
    refreshNow: "רענן עכשיו",
    refreshing: "מרענן…",
    refreshed: "הנתונים רועננו",
    refreshFailed: "הרענון נכשל",
  },
  stock: {
    today: "היום",
    thisWeek: "השבוע",
    dailyWeekly: "יומי {daily} · שבועי {weekly}",
    source: "מקור: {source}",
    readMore: "קרא עוד ←",
    updated: "עודכן {date}",
    aiSummary: "סיכום AI",
    ruleSummary: "סיכום מבוסס כללים",
    summaryBy: "סיכום מאת {source}",
    priceSentiment: "מחיר {value}",
    newsSentiment: "חדשות {value}",
    analystSentiment: "אנליסטים {value}",
    risk: "סיכון {level}",
    dailyChart: "גרף יומי",
    weeklyChart: "גרף שבועי",
    chartTrend: "מגמת מחיר אחרונה",
  },
  sentiment: {
    bullish: "שורי",
    neutral: "ניטרלי",
    bearish: "דובי",
    overall: "כללי: {value}",
  },
  taseSentiment: {
    title: "סנטימנט שוק TASE",
    description:
      "מחושב מ-{count} מניות תל אביב מומלצות על בסיס תנועת מחיר יומית.",
    badge: "מדד TA-35",
  },
  news: {
    title: "חדשות שוק ישראל",
    description: "כותרות מ-Yahoo Finance ו-Finnhub למניות TASE מובילות.",
    emptyTitle: "אין כותרות זמינות",
    emptyDesc: "חדשות יופיעו לאחר הרענון הבא.",
  },
  refreshStatus: {
    idle: "ממתין",
    success: "הצליח",
    partial: "חלקי",
    failed: "נכשל",
  },
  notFound: {
    title: "הדף לא נמצא",
    description: "הדף שחיפשת לא קיים או הועבר.",
    action: "חזרה לדף הבית",
  },
  error: {
    title: "משהו השתבש",
    description: "לא הצלחנו לטעון את הדף. נסה שוב.",
    retry: "נסה שוב",
    globalTitle: "לא ניתן לטעון לוח גלובלי",
    globalDesc: "אירעה בעיה בטעינת המלצות גלובליות.",
    israelTitle: "לא ניתן לטעון לוח ישראלי",
    israelDesc: "אירעה בעיה בטעינת המלצות TASE.",
  },
  header: {
    openMenu: "פתח תפריט",
    closeMenu: "סגור תפריט",
    closeOverlay: "סגור שכבת תפריט",
  },
};
