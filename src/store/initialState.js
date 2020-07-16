/**
 * @typedef {Object} UserBalance
 * @property {Number} pnlBTC
 * @property {Number} pnlUSDT
 * @property {Number} totalBTC
 * @property {Number} totalFreeBTC
 * @property {Number} totalFreeUSDT
 * @property {Number} totalLockedBTC
 * @property {Number} totalLockedUSDT
 * @property {Number} totalUSDT
 * @property {Boolean} loading
 */

/**
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../services/tradeApiClient.types').DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {import('../services/tradeApiClient.types').UserEquityEntity} UserEquityEntity
 * @typedef {import('../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import('../services/tradeApiClient.types').UserLoginResponse} UserLoginResponse
 *
 */

/**
 * @typedef {Object} UserObject
 * @property {Array<ExchangeConnectionEntity>} exchangeConnections
 * @property {UserBalance} balance
 * @property {DefaultDailyBalanceEntity} dailyBalance
 * @property {UserLoginResponse} userData
 */

/**
 * @typedef {Object} DefaultStateSessionTradeApi
 * @property {string} accessToken
 */

/**
 * @typedef {Object} DefaultStateSessionCoinRay
 * @property {string} accessToken
 */

/**
 * @typedef {Object} DefaultSessionData
 * @property {string} status
 * @property {number} validUntil
 */

/**
 * @typedef {Object} DefaultStateSession
 * @property {DefaultStateSessionTradeApi} tradeApi
 * @property {DefaultStateSessionCoinRay} coinRay
 * @property {DefaultSessionData} sessionData
 */

/**
 * @typedef {Object<string, Array<string>>} DisplayColumns
 */

/**
 * @typedef {Object<string, number>} RowsPerPage
 */

/**
 * @typedef {Object} DefaultStateSettings
 * @property {String} languageCode
 * @property {Boolean} darkStyle
 * @property {Boolean} balanceBox
 * @property {DisplayColumns} displayColumns
 * @property {RowsPerPage} rowsPerPage
 * @property {ExchangeConnectionEntity} selectedExchange
 */

/**
 * @typedef {Object} DefaultUIModalObject
 * @property {Boolean} twoFA
 * @property {Boolean} createProvider
 */

/**
 * @typedef {Object} AlertObject
 * @property {Boolean} open
 * @property {String} title
 * @property {String} body
 */

/**
 * @typedef {Object} DefaultUIAlertsObject
 * @property {AlertObject} success
 * @property {AlertObject} error
 */

/**
 * @typedef {Object} TimeframeObject
 * @property {Number} connectedCopyt
 * @property {Number} connectedSignalp
 * @property {Number} copyt
 * @property {Number} signalp
 */

/**
 * @typedef {Object} DefaultUIObject
 * @property {DefaultUIModalObject} modal
 * @property {DefaultUIAlertsObject} alerts
 * @property {Boolean} loader
 * @property {Boolean} ask2FA
 * @property {TimeframeObject} timeFrame
 * @property {Boolean} balanceLoader
 */

/**
 * @typedef {Object} DefaultViewsObject
 * @property {DefaultProviderGetObject} provider
 */

/**
 * @typedef {Object} DefaultState
 * @property {DefaultStateSession} session
 * @property {DefaultStateSettings} settings
 * @property {UserObject} user
 * @property {DefaultUIObject} ui
 * @property {DefaultViewsObject} views
 */

/**
 * @type {DefaultState} initialState
 */
const initialState = {
  session: {
    tradeApi: {
      accessToken: "",
    },
    coinRay: {
      accessToken: "",
    },
    sessionData: {
      status: "",
      validUntil: 0,
    },
  },
  settings: {
    languageCode: "en",
    darkStyle: false,
    balanceBox: false,
    rowsPerPage: {},
    displayColumns: {
      signalpAnalytics: [
        "percentageProfit",
        "signals",
        "sumPositions",
        "winRate",
        "sumClosedPositions",
        "avgAverageClosingTime",
        "sumSoldBySignal",
        "sumSoldByStopLoss",
        "sumSoldByTakeProfit",
      ],
      copytAnalytics: [
        "percentageProfit",
        "signals",
        "sumPositions",
        "winRate",
        "sumClosedPositions",
        "avgAverageClosingTime",
        "sumSoldBySignal",
        "sumSoldByStopLoss",
        "sumSoldByTakeProfit",
      ],
      dailyBalance: [
        "date",
        "totalUSDT",
        "totalFreeUSDT",
        "totalLockedUSDT",
        "totalBTC",
        "totalFreeBTC",
        "totalLockedBTC",
        "freeETH",
        "freeBNB",
      ],
      exchangeAssets: [
        "coin",
        "name",
        "balanceTotal",
        "balanceFree",
        "balanceLocked",
        "balanceTotalBTC",
        "balanceTotalUSDT",
      ],
      copytProfileUsers: [
        "userId",
        "email",
        "name",
        "active",
        "connected",
        "allocatedBalance",
        "suspended",
        "profitsFromClosedBalance",
        "lastTransactionId",
        "modify",
        "cancel",
        "cancelDate",
        "code",
        "realExchangeConnected",
      ],
      openPositions: [
        "col.date.open",
        "col.provider.logo",
        "col.pair",
        "col.price.current",
        "col.plnumber",
        "col.plpercentage",
        "col.invested",
        "col.actions",
      ],
      openEditPositions: [
        "col.date.open",
        "col.stat",
        "col.provider.logo",
        "col.pair",
        "col.price.current",
        "col.plnumber",
        "col.plpercentage",
        "col.invested",
        "col.actions",
      ],
      closedPositions: [
        "col.paper",
        "col.date.open",
        "col.date.close",
        "col.provider.logo",
        "col.pair",
        "col.price.entry",
        "col.price.exit",
        "col.amount",
        "col.invested",
        "col.risk",
        "col.fees",
        "col.netprofit.percentage",
        "col.netprofit.amount",
        "col.actions",
      ],
      logPositions: [
        "col.date.open",
        "col.type",
        "col.provider.logo",
        "col.stat",
        "col.pair",
        "col.invested",
        "col.actions",
      ],
      profileOpenPositions: [
        "col.date.open",
        "col.pair",
        "col.price.entry",
        "col.leverage",
        "col.unrealizedplnumber",
        "col.unrealizedplpercentage",
        "col.pricedifference",
        "col.side",
        "col.initialamount",
        "col.invested",
        "col.risk",
        "col.actions",
        "col.cancel",
      ],
      profileClosedPositions: [
        "col.amount",
        "col.pair",
        "col.buyprice",
        "col.date.close",
        "col.exchange",
        "col.leverage",
        "col.date.open",
        "col.positionsize",
        "col.returnfromallocated",
        "col.returnfrominvestment",
        "col.sellprice",
        "col.side",
        "col.status",
      ],
      depositHistory: ["status", "currency", "amount", "timestamp", "txid"],
      withdrawHistory: ["status", "currency", "amount", "timestamp", "txid"],
      convertAssets: [
        "coin",
        "balanceFree",
        "balanceFreeBTC",
        "balanceFreeUSDT",
        "balanceTotalExchCoin",
      ],
      managementPositions: [
        "col.provider.subpositions",
        "col.provider.name",
        "col.provider.totalpositions",
        "col.provider.soldpositions",
        "col.pair",
        "col.price.current",
        "col.plnumber",
        "col.plpercentage",
        "col.invested",
        "col.actions",
      ],
    },
    selectedExchange: {
      id: "",
      name: "",
      exchangeId: "",
      exchangeName: "",
      internalId: "",
      internalName: "",
      key: false,
      secret: false,
      areKeysValid: false,
      paperTrading: false,
      exchangeType: "",
      isTestnet: false,
      disable: false,
      positionSize: 0,
      managed: false,
      internal: false,
      isBrokerAccount: false,
      subAccountId: "",
      binanceBrokerId: "",
      checkAuthCount: 0,
      globalDelisting: false,
      globalBlacklist: false,
      globalMaxPositions: false,
      globalMinVolume: false,
      globalPositionsPerMarket: false,
      globalWhitelist: false,
      balanceSynced: false,
    },
  },
  user: {
    exchangeConnections: [],
    balance: {
      pnlBTC: 0,
      pnlUSDT: 0,
      totalBTC: 0,
      totalFreeBTC: 0,
      totalFreeUSDT: 0,
      totalLockedBTC: 0,
      totalLockedUSDT: 0,
      totalUSDT: 0,
      loading: false,
    },
    dailyBalance: {
      balances: [],
      quotes: [],
      loading: false,
    },
    userData: {
      ask2FA: false,
      twoFAEnable: false,
      binanceConnected: false,
      buysCount: 0,
      createdAt: "",
      dashlyEchoAuth: "",
      dashlyHash: "",
      email: "",
      firstName: "",
      isAdmin: null,
      minimumProviderSettings: true,
      onboarding: { finished: false, paused: true, step: "2" },
      planId: "",
      planName: "",
      planType: "",
      projectId: "",
      providerEnable: true,
      ref: "",
      refCode: "",
      sellsCount: 0,
      status: 0,
      subscribe: false,
      token: "",
      userId: "",
    },
  },
  ui: {
    modal: {
      twoFA: false,
      createProvider: false,
    },
    alerts: {
      success: {
        title: "",
        body: "",
        open: false,
      },
      error: {
        title: "",
        body: "",
        open: false,
      },
    },
    loader: true,
    ask2FA: false,
    balanceLoader: false,
    timeFrame: {
      connectedCopyt: 90,
      connectedSignalp: 90,
      copyt: 90,
      signalp: 90,
    },
  },
  views: {
    provider: {
      connected: false,
      copyTradingQuote: "",
      description: "",
      disable: false,
      exchangeInternalId: "",
      exchangeType: "",
      exchanges: [""],
      fee: "",
      hasBeenUsed: false,
      hasRecommendedSettings: false,
      id: "",
      internalPaymentInfo: {
        isPremium: true,
        merchantId: "",
        price: 0,
        trial: 0,
        ipnSecret: "",
      },
      isAdmin: false,
      isClone: false,
      isCopyTrading: false,
      key: false,
      list: false,
      logoUrl: "",
      longDesc: "",
      minAllocatedBalance: 0,
      name: "",
      options: {
        acceptUpdateSignal: false,
        allowSendingBuyOrdersAsMarket: false,
        balanceFilter: false,
        enablePanicSellSignals: false,
        enableSellSignals: false,
        limitPriceFromSignal: false,
        reBuyFromProvider: false,
        reBuysFromSignal: false,
        reUseSignalIdIfClosed: false,
        riskFilter: false,
        stopLossFromSignal: false,
        successRateFilter: false,
        takeProfitsFromSignal: false,
        terms: false,
        trailingStopFromSignal: false,
        useLeverageFromSignal: false,
        customerKey: false,
      },
      public: false,
      shortDesc: "",
      userPaymentInfo: { userId: "" },
      website: "",
      allocatedBalance: 0,
      allocatedBalanceUpdatedAt: { $date: { $numberlong: "" } },
      balanceFilter: false,
      clonedFrom: { $oid: "" },
      createdAt: "",
      enableInProvider: false,
      originalBalance: "",
      profitsFromClosedBalance: "0",
      reBuyFromProvider: false,
      riskFilter: false,
      successRateFilter: false,
      terms: false,
      team: [{ name: "", countryCode: "" }],
      social: [{ network: "", link: "" }],
      about: "",
      performance: {
        closePositions: 0,
        weeklyStats: [{ week: 0, return: 0, day: "", positions: 0 }],
        openPositions: 0,
        totalBalance: 0,
        totalTradingVolume: 0,
      },
      strategy: "",
      avgHoldingTime: 0,
      activeSince: 0,
      avgTradesPerWeek: 0,
      profitableWeeks: 0,
      followers: 0,
      stripe: {
        cancelAtPeriodEnd: false,
        cancelDate: "",
        email: "",
        enable: false,
        paymentGateway: "",
        trialStartedAt: "",
      },
      acceptUpdateSignal: false,
      allowSendingBuyOrdersAsMarket: false,
      customerKey: "",
      enablePanicSellSignals: false,
      enableSellSignals: false,
      limitPriceFromSignal: false,
      limitReBuys: "",
      long: false,
      mid: false,
      quantityPercentage: 0,
      reBuyAll: false,
      reBuyFirst: false,
      reBuyLast: false,
      reBuysFromSignal: false,
      reUseSignalIdIfClosed: false,
      risk: "",
      short: false,
      shortmid: false,
      stopLossFromSignal: false,
      successRate: "",
      takeProfitAll: false,
      takeProfitFirst: false,
      takeProfitLast: false,
      takeProfitsFromSignal: false,
      trailingStopFromSignal: false,
      useLeverageFromSignal: false,
      price: 0,
      loading: false,
      allowClones: true,
    },
  },
};

export default initialState;
