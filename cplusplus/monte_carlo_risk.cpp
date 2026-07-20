#include <algorithm>
#include <numeric>
#include <random>
#include <stdexcept>
#include <vector>

namespace gram_setu {

double runMonteCarloRiskProbabilityIndex(
    const std::vector<double>& baselineCashFlow,
    int simulationCount,
    double weatherShockVolatility,
    double marketPriceVolatility,
    unsigned int seed = std::random_device{}()) {
  if (baselineCashFlow.empty()) {
    throw std::invalid_argument("baselineCashFlow must not be empty");
  }
  if (simulationCount <= 0) {
    throw std::invalid_argument("simulationCount must be positive");
  }
  if (weatherShockVolatility < 0.0 || marketPriceVolatility < 0.0) {
    throw std::invalid_argument("Volatility values must be non-negative");
  }

  const double baselineTotal =
      std::accumulate(baselineCashFlow.begin(), baselineCashFlow.end(), 0.0);

  std::mt19937 engine(seed);
  std::normal_distribution<double> weatherDist(0.0, weatherShockVolatility);
  std::normal_distribution<double> marketDist(0.0, marketPriceVolatility);

  int stressFailures = 0;
  for (int i = 0; i < simulationCount; ++i) {
    double simulatedTotal = 0.0;
    for (double value : baselineCashFlow) {
      const double weatherShock = weatherDist(engine);
      const double marketShock = marketDist(engine);
      const double combinedMultiplier = 1.0 + weatherShock + marketShock;
      simulatedTotal += value * std::max(0.0, combinedMultiplier);
    }

    if (simulatedTotal < baselineTotal * 0.85) {
      ++stressFailures;
    }
  }

  return static_cast<double>(stressFailures) / static_cast<double>(simulationCount);
}

}  // namespace gram_setu
