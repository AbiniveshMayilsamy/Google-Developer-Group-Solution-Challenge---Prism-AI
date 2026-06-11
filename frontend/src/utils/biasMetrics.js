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

/**
 * Balances the dataset in-memory by duplicating minority/underrepresented records 
 * with favorable outcomes until the Disparate Impact score is balanced.
 *
 * @param {Array} data - Array of objects (parsed CSV data)
 * @param {Object} config - Configuration object
 * @returns {Array} Balanced dataset
 */
export function balanceDataset(data, config) {
  const {
    targetAttribute,
    favorableOutcome,
    sensitiveAttribute,
    privilegedGroup,
    unprivilegedGroup
  } = config;

  if (!data || data.length === 0) return [];

  const balancedData = [...data];

  // Separate records
  const privRows = data.filter(row => row[sensitiveAttribute]?.toString().trim() === privilegedGroup);
  const unprivRows = data.filter(row => row[sensitiveAttribute]?.toString().trim() === unprivilegedGroup);

  const privTotal = privRows.length;
  const privFavorable = privRows.filter(row => row[targetAttribute]?.toString().trim() === favorableOutcome).length;
  const privFavorableRate = privTotal > 0 ? privFavorable / privTotal : 0;

  const unprivTotal = unprivRows.length;
  const unprivFavorable = unprivRows.filter(row => row[targetAttribute]?.toString().trim() === favorableOutcome).length;
  const unprivFavorableRate = unprivTotal > 0 ? unprivFavorable / unprivTotal : 0;

  // If there is bias against unprivileged group
  if (privFavorableRate > unprivFavorableRate && unprivTotal > 0) {
    let k = 0;
    if (privFavorableRate < 1) {
      k = Math.round((privFavorableRate * unprivTotal - unprivFavorable) / (1 - privFavorableRate));
    } else {
      k = unprivTotal - unprivFavorable;
    }

    if (k > 0) {
      const templates = unprivRows.filter(row => row[targetAttribute]?.toString().trim() === favorableOutcome);
      const fallbackTemplates = unprivRows.filter(row => row[targetAttribute]?.toString().trim() !== favorableOutcome);

      for (let i = 0; i < k; i++) {
        let clonedRow;
        if (templates.length > 0) {
          clonedRow = { ...templates[i % templates.length] };
        } else if (fallbackTemplates.length > 0) {
          // If no favorable unprivileged rows exist, create one by flipping the outcome
          clonedRow = { ...fallbackTemplates[i % fallbackTemplates.length], [targetAttribute]: favorableOutcome };
        } else {
          clonedRow = { [sensitiveAttribute]: unprivilegedGroup, [targetAttribute]: favorableOutcome };
        }
        clonedRow._synthetic = true;
        balancedData.push(clonedRow);
      }
    }
  } else if (unprivFavorableRate > privFavorableRate && privTotal > 0) {
    // Bias is in opposite direction, balance privileged group
    let k = 0;
    if (unprivFavorableRate < 1) {
      k = Math.round((unprivFavorableRate * privTotal - privFavorable) / (1 - unprivFavorableRate));
    } else {
      k = privTotal - privFavorable;
    }

    if (k > 0) {
      const templates = privRows.filter(row => row[targetAttribute]?.toString().trim() === favorableOutcome);
      const fallbackTemplates = privRows.filter(row => row[targetAttribute]?.toString().trim() !== favorableOutcome);

      for (let i = 0; i < k; i++) {
        let clonedRow;
        if (templates.length > 0) {
          clonedRow = { ...templates[i % templates.length] };
        } else if (fallbackTemplates.length > 0) {
          clonedRow = { ...fallbackTemplates[i % fallbackTemplates.length], [targetAttribute]: favorableOutcome };
        } else {
          clonedRow = { [sensitiveAttribute]: privilegedGroup, [targetAttribute]: favorableOutcome };
        }
        clonedRow._synthetic = true;
        balancedData.push(clonedRow);
      }
    }
  }

  return balancedData;
}
