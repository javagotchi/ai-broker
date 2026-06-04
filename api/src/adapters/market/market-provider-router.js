import { AppError } from "../../lib/errors.js";

export const createMarketProviderRouter = ({ providers, defaultSymbol }) => {
  const getOrderedProviders = (item = {}) => {
    const baseProviders = providers.filter((provider) => provider.canHandle(item));

    if (item.exchange) {
      const exchange = item.exchange.toUpperCase();

      if (exchange === "XETR" || exchange === "XFRA" || exchange === "FSX") {
        return baseProviders.sort((left, right) => {
          if (left.name === "EODHD") {
            return -1;
          }

          if (right.name === "EODHD") {
            return 1;
          }

          return 0;
        });
      }
    }

    return baseProviders;
  };

  const tryProviders = async (method, item, args = []) => {
    const errors = [];

    for (const provider of getOrderedProviders(item)) {
      try {
        const result = await provider[method](item, ...args);
        return {
          provider: provider.name,
          result,
        };
      } catch (error) {
        errors.push({
          provider: provider.name,
          message: error.message,
        });
      }
    }

    throw new AppError("No market data provider could satisfy the request", 502, {
      symbol: item.ticker || defaultSymbol,
      providers: errors,
    });
  };

  return {
    async getOverviewForItem(item) {
      const [quoteResult, seriesResult] = await Promise.all([
        tryProviders("getQuote", item),
        tryProviders("getDailySeries", item, [20]),
      ]);

      return {
        symbol: item.ticker,
        asOf: quoteResult.result.timestamp,
        source: quoteResult.result.source,
        sourceDetail: {
          quote: quoteResult.provider,
          series: seriesResult.provider,
        },
        quote: quoteResult.result,
        series: seriesResult.result.values,
        notes:
          "Provider routing is modular. US symbols typically resolve through TwelveData; European listings can be routed to EODHD.",
      };
    },

    async getOverview(symbol = defaultSymbol) {
      return this.getOverviewForItem({
        ticker: symbol.toUpperCase(),
      });
    },

    async getQuoteForItem(item) {
      const { provider, result } = await tryProviders("getQuote", item);
      return {
        provider,
        quote: result,
      };
    },
  };
};
