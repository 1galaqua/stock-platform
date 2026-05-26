export const en = {
  app: {
    name: "Stock Platform",
    tagline: "Weekly stock insights",
  },
  language: {
    label: "Language",
    en: "EN",
    he: "עב",
  },
  skipToContent: "Skip to main content",
  nav: {
    aria: "Main navigation",
    home: "Home",
    global: "Global Stocks",
    israel: "Israeli Stocks",
  },
  footer: {
    refreshNote: "Recommendations refresh every {days} days from trusted market sources.",
    disclaimer: "Not financial advice. Data and AI summaries are for informational purposes only.",
  },
  home: {
    badge: "Weekly refresh",
    title: "Intelligent stock analysis, built for clarity",
    description:
      "{appName} delivers two focused dashboards — global market leaders and Israeli TASE stocks — with sentiment, risk levels, and AI-powered summaries updated every {days} days.",
    dashboardsAria: "Dashboard entry points",
    highlightsAria: "Platform highlights",
    openDashboard: "Open dashboard",
    global: {
      title: "Global Recommended Stocks",
      description:
        "20 curated picks from Yahoo Finance, Finnhub, NASDAQ, and more — refreshed weekly.",
      badge: "20 stocks",
    },
    israel: {
      title: "Israeli Stocks (TASE)",
      description:
        "Tel Aviv Stock Exchange dashboard with bilingual names, sector filters, and market news.",
      badge: "TASE",
    },
    features: {
      sentiment: {
        title: "Market sentiment",
        body: "Bullish, neutral, or bearish signals on every recommendation.",
      },
      risk: {
        title: "Risk-aware picks",
        body: "Low, medium, and high risk labels to match your strategy.",
      },
      sources: {
        title: "Trusted sources",
        body: "Aggregated from Yahoo Finance, Alpha Vantage, Finnhub, and TASE data.",
      },
    },
  },
  globalPage: {
    badge: "Global market",
    title: "Global Recommended Stocks",
    description:
      "20 weekly picks from reliable financial sources — prices, mini charts, sentiment, risk levels, and recommendation summaries.",
    lastUpdated: "Last updated: {date}",
  },
  israelPage: {
    badge: "TASE · Tel Aviv · ₪ ILS",
    title: "Israeli Stocks Dashboard",
    description:
      "Top TASE recommendations with Hebrew and English names, daily and weekly performance, market news, and sentiment.",
    lastUpdated: "Last updated: {date}",
  },
  dashboard: {
    sector: "Sector",
    risk: "Risk",
    sortBy: "Sort by",
    all: "All",
    showing: "Showing {filtered} of {total} recommendations",
    showingTase: "Showing {filtered} of {total} TASE recommendations",
    searchGlobal: "Search by ticker or company name…",
    searchIsrael: "Search by ticker, English or Hebrew name…",
    noGlobal: "No global recommendations yet",
    noIsrael: "No Israeli recommendations yet",
    noGlobalDesc:
      "Live market data has not been loaded. Use refresh in development or wait for the weekly cron job.",
    noIsraelDesc:
      "Live TASE data has not been loaded. Use refresh in development or wait for the weekly cron job.",
    noMatches: "No matches found",
    noMatchesDesc: "Try another ticker, company name, sector, or risk filter.",
    noMatchesIsraelDesc:
      "Try another ticker, Hebrew or English company name, sector, or risk filter.",
    sort: {
      dailyChangeDesc: "Daily change (high → low)",
      dailyChangeAsc: "Daily change (low → high)",
      sentiment: "Sentiment (bullish first)",
      risk: "Risk (low first)",
      sector: "Sector (A → Z)",
      name: "Company name (A → Z)",
    },
    riskLevels: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
  },
  statusBanner: {
    loaded: "{count} recommendations loaded",
    sources: "Sources: {sources}",
    dataUpdated: "Data updated {date}",
    nextRefresh: "Next scheduled refresh {date}",
    autoRefresh: "Auto-refresh: {schedule}",
    cronSchedule: "Every Sunday at 06:00 UTC",
    lastJob: "Last job: {status}",
    weeklyAuto: "Weekly auto-refresh",
    stale:
      "Data is older than {days} days. Trigger a refresh or wait for the next cron run.",
    refreshNow: "Refresh now",
    refreshing: "Refreshing…",
    refreshed: "Data refreshed",
    refreshFailed: "Refresh failed",
  },
  stock: {
    today: "today",
    thisWeek: "this week",
    dailyWeekly: "Daily {daily} · Weekly {weekly}",
    source: "Source: {source}",
    readMore: "Read more →",
    updated: "Updated {date}",
    aiSummary: "AI summary",
    ruleSummary: "Rule-based summary",
    summaryBy: "Summary by {source}",
    priceSentiment: "Price {value}",
    newsSentiment: "News {value}",
    analystSentiment: "Analyst {value}",
    risk: "{level} risk",
    dailyChart: "Daily chart",
    weeklyChart: "Weekly chart",
    chartTrend: "Recent price trend",
  },
  sentiment: {
    bullish: "Bullish",
    neutral: "Neutral",
    bearish: "Bearish",
    overall: "Overall: {value}",
  },
  taseSentiment: {
    title: "TASE market sentiment",
    description:
      "Aggregated from {count} recommended Tel Aviv stocks based on daily price action.",
    badge: "TA-35 focus universe",
  },
  news: {
    title: "Israeli market news",
    description:
      "Headlines from Yahoo Finance and Finnhub for leading TASE names.",
    emptyTitle: "No headlines available",
    emptyDesc: "News will appear after the next data refresh.",
  },
  refreshStatus: {
    idle: "idle",
    success: "success",
    partial: "partial",
    failed: "failed",
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for does not exist or may have moved.",
    action: "Back to home",
  },
  error: {
    title: "Something went wrong",
    description: "We could not load this page. Please try again.",
    retry: "Try again",
    globalTitle: "Could not load global dashboard",
    globalDesc: "There was a problem loading global stock recommendations.",
    israelTitle: "Could not load Israeli dashboard",
    israelDesc: "There was a problem loading TASE stock recommendations.",
  },
  header: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    closeOverlay: "Close menu overlay",
  },
} as const;

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type Dictionary = DeepStringRecord<typeof en>;
