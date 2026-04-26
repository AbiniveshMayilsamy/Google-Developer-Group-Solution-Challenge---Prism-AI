/**
 * Calculates bias metrics given a dataset and configuration.
 *
 * @param {Array} data - Array of objects (parsed CSV data)
 * @param {Object} config - Configuration object
 * @param {string} config.targetAttribute - e.g., 'income'
 * @param {string} config.favorableOutcome - e.g., '>50K'
 * @param {string} config.sensitiveAttribute - e.g., 'gender'
 * @param {string} config.privilegedGroup - e.g., 'Male'
 * @param {string} config.unprivilegedGroup - e.g., 'Female'
 * 
 * @returns {Object} Calculated metrics
 */
export function calculateBiasMetrics(data, config) {
  const {
    targetAttribute,
    favorableOutcome,
    sensitiveAttribute,
    privilegedGroup,
    unprivilegedGroup
  } = config;

  let privTotal = 0;
  let privFavorable = 0;
  let unprivTotal = 0;
  let unprivFavorable = 0;

  data.forEach(row => {
    const sensitiveVal = row[sensitiveAttribute]?.toString().trim();
    const targetVal = row[targetAttribute]?.toString().trim();
    const isFavorable = targetVal === favorableOutcome;

    if (sensitiveVal === privilegedGroup) {
      privTotal++;
      if (isFavorable) privFavorable++;
    } else if (sensitiveVal === unprivilegedGroup) {
      unprivTotal++;
      if (isFavorable) unprivFavorable++;
    }
  });

  const privFavorableRate = privTotal > 0 ? privFavorable / privTotal : 0;
  const unprivFavorableRate = unprivTotal > 0 ? unprivFavorable / unprivTotal : 0;

  // Statistical Parity Difference (SPD)
  // SPD = P(Y=1 | Unprivileged) - P(Y=1 | Privileged)
  // Ideal value: 0
  const spd = unprivFavorableRate - privFavorableRate;

  // Disparate Impact (DI)
  // DI = P(Y=1 | Unprivileged) / P(Y=1 | Privileged)
  // Ideal value: 1
  const di = privFavorableRate > 0 ? unprivFavorableRate / privFavorableRate : 0;

  return {
    privTotal,
    privFavorable,
    unprivTotal,
    unprivFavorable,
    privFavorableRate,
    unprivFavorableRate,
    statisticalParityDifference: spd,
    disparateImpact: di
  };
}
