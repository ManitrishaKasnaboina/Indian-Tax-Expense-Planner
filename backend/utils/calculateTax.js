/**
 * Indian Tax Calculation Utility (FY 2025-26 / FY 2026-27 Slabs)
 */

// Helper to calculate HRA Exemption
// HRA Exemption is minimum of:
// 1. Actual HRA received
// 2. Rent paid minus 10% of basic salary
// 3. 50% of basic salary (metro) or 40% of basic salary (non-metro)
const calculateHraExemption = (hraReceived, rentPaid, basicSalary, isMetro = true) => {
  if (!hraReceived || !rentPaid || !basicSalary) return 0;
  
  const option1 = hraReceived;
  const option2 = Math.max(0, rentPaid - (0.1 * basicSalary));
  const option3 = isMetro ? (0.5 * basicSalary) : (0.4 * basicSalary);
  
  return Math.min(option1, option2, option3);
};

// Calculate Old Tax Regime
const calculateOldRegime = (income, deductions) => {
  const stdDeduction = 50000;
  
  // Cap deductions
  const cap80C = Math.min(deductions.section80C || 0, 150000);
  const cap80D = Math.min(deductions.section80D || 0, 25000);
  const capNPS = Math.min(deductions.nps || 0, 50000);
  const capHomeLoan = Math.min(deductions.homeLoanInterest || 0, 200000);
  const otherDeds = deductions.otherDeductions || 0;
  
  // HRA Exemption
  const basicSalary = deductions.basicSalary || (income * 0.45); // Assume basic is 45% if not provided
  const hraExemp = calculateHraExemption(
    deductions.hraReceived || 0,
    deductions.rentPaid || 0,
    basicSalary
  );
  
  const totalDeductions = stdDeduction + cap80C + cap80D + capNPS + capHomeLoan + otherDeds + hraExemp;
  const taxableIncome = Math.max(0, income - totalDeductions);
  
  let tax = 0;
  const breakdown = [];
  
  if (taxableIncome <= 250000) {
    tax = 0;
    breakdown.push({ slab: 'Up to ₹2.5L', rate: '0%', tax: 0 });
  } else {
    breakdown.push({ slab: 'Up to ₹2.5L', rate: '0%', tax: 0 });
    
    // ₹2.5L to ₹5L @ 5%
    if (taxableIncome > 250000) {
      const slabAmt = Math.min(taxableIncome, 500000) - 250000;
      const slabTax = slabAmt * 0.05;
      tax += slabTax;
      breakdown.push({ slab: '₹2.5L - ₹5L', rate: '5%', tax: slabTax });
    }
    
    // ₹5L to ₹10L @ 20%
    if (taxableIncome > 500000) {
      const slabAmt = Math.min(taxableIncome, 1000000) - 500000;
      const slabTax = slabAmt * 0.20;
      tax += slabTax;
      breakdown.push({ slab: '₹5L - ₹10L', rate: '20%', tax: slabTax });
    }
    
    // Above ₹10L @ 30%
    if (taxableIncome > 1000000) {
      const slabAmt = taxableIncome - 1000000;
      const slabTax = slabAmt * 0.30;
      tax += slabTax;
      breakdown.push({ slab: 'Above ₹10L', rate: '30%', tax: slabTax });
    }
  }
  
  // Rebate under 87A for Old Regime (up to ₹5L taxable income)
  let rebate = 0;
  if (taxableIncome <= 500000) {
    rebate = tax; // 100% rebate up to max tax at 5L (₹12,500)
  }
  
  const taxAfterRebate = Math.max(0, tax - rebate);
  const cess = taxAfterRebate * 0.04;
  const totalTax = taxAfterRebate + cess;
  
  return {
    grossIncome: income,
    standardDeduction: stdDeduction,
    appliedDeductions: {
      section80C: cap80C,
      section80D: cap80D,
      nps: capNPS,
      hraExemption: hraExemp,
      homeLoanInterest: capHomeLoan,
      otherDeductions: otherDeds
    },
    totalDeductions,
    taxableIncome,
    breakdown,
    calculatedTax: tax,
    rebate,
    cess,
    totalTaxLiability: Math.round(totalTax)
  };
};

// Calculate New Tax Regime (Budget 2024 Slabs / FY 2025-26)
const calculateNewRegime = (income) => {
  const stdDeduction = 75000; // Increased standard deduction for New Regime to 75,000
  const taxableIncome = Math.max(0, income - stdDeduction);
  
  let tax = 0;
  const breakdown = [];
  
  if (taxableIncome <= 300000) {
    tax = 0;
    breakdown.push({ slab: 'Up to ₹3L', rate: '0%', tax: 0 });
  } else {
    breakdown.push({ slab: 'Up to ₹3L', rate: '0%', tax: 0 });
    
    // ₹3L to ₹7L @ 5%
    if (taxableIncome > 300000) {
      const slabAmt = Math.min(taxableIncome, 700000) - 300000;
      const slabTax = slabAmt * 0.05;
      tax += slabTax;
      breakdown.push({ slab: '₹3L - ₹7L', rate: '5%', tax: slabTax });
    }
    
    // ₹7L to ₹10L @ 10%
    if (taxableIncome > 700000) {
      const slabAmt = Math.min(taxableIncome, 1000000) - 700000;
      const slabTax = slabAmt * 0.10;
      tax += slabTax;
      breakdown.push({ slab: '₹7L - ₹10L', rate: '10%', tax: slabTax });
    }
    
    // ₹10L to ₹12L @ 15%
    if (taxableIncome > 1000000) {
      const slabAmt = Math.min(taxableIncome, 1200000) - 1000000;
      const slabTax = slabAmt * 0.15;
      tax += slabTax;
      breakdown.push({ slab: '₹10L - ₹12L', rate: '15%', tax: slabTax });
    }
    
    // ₹12L to ₹15L @ 20%
    if (taxableIncome > 1200000) {
      const slabAmt = Math.min(taxableIncome, 1500000) - 1200000;
      const slabTax = slabAmt * 0.20;
      tax += slabTax;
      breakdown.push({ slab: '₹12L - ₹15L', rate: '20%', tax: slabTax });
    }
    
    // Above ₹15L @ 30%
    if (taxableIncome > 1500000) {
      const slabAmt = taxableIncome - 1500000;
      const slabTax = slabAmt * 0.30;
      tax += slabTax;
      breakdown.push({ slab: 'Above ₹15L', rate: '30%', tax: slabTax });
    }
  }
  
  // Rebate under 87A for New Regime (taxable income up to ₹7,00,000 gets full rebate)
  let rebate = 0;
  if (taxableIncome <= 700000) {
    rebate = tax; // Rebate up to ₹20,000 (since 5% of 4L is 20,000)
  }
  
  const taxAfterRebate = Math.max(0, tax - rebate);
  const cess = taxAfterRebate * 0.04;
  const totalTax = taxAfterRebate + cess;
  
  return {
    grossIncome: income,
    standardDeduction: stdDeduction,
    appliedDeductions: {
      section80C: 0,
      section80D: 0,
      nps: 0,
      hraExemption: 0,
      homeLoanInterest: 0,
      otherDeductions: 0
    },
    totalDeductions: stdDeduction,
    taxableIncome,
    breakdown,
    calculatedTax: tax,
    rebate,
    cess,
    totalTaxLiability: Math.round(totalTax)
  };
};

// Primary export function
const calculateTaxAll = (income, deductions = {}) => {
  const oldRegime = calculateOldRegime(income, deductions);
  const newRegime = calculateNewRegime(income);
  
  const recommendedRegime = oldRegime.totalTaxLiability < newRegime.totalTaxLiability ? 'old' : 'new';
  
  // Tax saving suggestions engine logic
  const current80C = deductions.section80C || 0;
  const current80D = deductions.section80D || 0;
  const currentNPS = deductions.nps || 0;
  
  const remaining80C = Math.max(0, 150000 - current80C);
  const remaining80D = Math.max(0, 25000 - current80D);
  const remainingNPS = Math.max(0, 50000 - currentNPS);
  
  const suggestions = [];
  
  // If user is currently on New Regime or Old Regime, let's see how much they can save in Old Regime
  if (remaining80C > 0) {
    // Recalculate old tax with maxed out 80C
    const optDeductions = { ...deductions, section80C: 150000 };
    const optOldTax = calculateOldRegime(income, optDeductions);
    const savings = Math.max(0, oldRegime.totalTaxLiability - optOldTax.totalTaxLiability);
    
    suggestions.push({
      section: '80C',
      title: 'Maximize Section 80C',
      description: 'You can invest more in tax-saving instruments like ELSS (Mutual Funds), PPF, EPF, Life Insurance, or National Savings Certificate (NSC).',
      maxLimit: 150000,
      currentAmount: current80C,
      suggestedInvestment: remaining80C,
      potentialTaxSavings: savings,
      investmentOptions: ['ELSS Mutual Funds (10-15% historic return)', 'Public Provident Fund (PPF - Risk-free, guaranteed)', 'National Savings Certificate (NSC)', 'Tax-saving Fixed Deposits']
    });
  }
  
  if (remaining80D > 0) {
    const optDeductions = { ...deductions, section80D: 25000 };
    const optOldTax = calculateOldRegime(income, optDeductions);
    const savings = Math.max(0, oldRegime.totalTaxLiability - optOldTax.totalTaxLiability);
    
    suggestions.push({
      section: '80D',
      title: 'Maximize Section 80D (Health Insurance)',
      description: 'Buying medical insurance for yourself, spouse, and children can reduce your taxable income and cover healthcare costs.',
      maxLimit: 25000,
      currentAmount: current80D,
      suggestedInvestment: remaining80D,
      potentialTaxSavings: savings,
      investmentOptions: ['Health Insurance Premium', 'Preventive Health Checkups (up to ₹5,000)']
    });
  }
  
  if (remainingNPS > 0) {
    const optDeductions = { ...deductions, nps: 50000 };
    const optOldTax = calculateOldRegime(income, optDeductions);
    const savings = Math.max(0, oldRegime.totalTaxLiability - optOldTax.totalTaxLiability);
    
    suggestions.push({
      section: '80CCD(1B)',
      title: 'Invest in National Pension System (NPS)',
      description: 'You can claim an additional deduction up to ₹50,000 under section 80CCD(1B) for contributions to NPS (Tier 1 account). This is over and above the ₹1.5L limit of 80C.',
      maxLimit: 50000,
      currentAmount: currentNPS,
      suggestedInvestment: remainingNPS,
      potentialTaxSavings: savings,
      investmentOptions: ['NPS Tier-1 Account Contribution']
    });
  }
  
  // What if they max out all of 80C, 80D, and NPS?
  const maxedDeductions = {
    ...deductions,
    section80C: 150000,
    section80D: 25000,
    nps: 50000
  };
  const maxedOldRegime = calculateOldRegime(income, maxedDeductions);
  const potentialSavingsVsNew = Math.max(0, newRegime.totalTaxLiability - maxedOldRegime.totalTaxLiability);
  
  let advisoryNote = '';
  if (recommendedRegime === 'new') {
    if (maxedOldRegime.totalTaxLiability < newRegime.totalTaxLiability) {
      advisoryNote = `Currently, the New Tax Regime is more beneficial for you. However, if you invest an additional ₹${(remaining80C + remaining80D + remainingNPS).toLocaleString('en-IN')} in tax-saving options (80C, 80D, NPS), the Old Regime will become cheaper, saving you ₹${potentialSavingsVsNew.toLocaleString('en-IN')} compared to the New Regime.`;
    } else {
      advisoryNote = 'The New Tax Regime is highly beneficial for your income level. Even if you max out your tax-saving deductions under the Old Regime, the New Regime still offers a lower or equal tax liability with no investment lock-in.';
    }
  } else {
    advisoryNote = 'The Old Tax Regime is currently more beneficial for you due to your existing declarations/deductions. Sticking to the Old Regime and maintaining these investments is recommended.';
  }
  
  return {
    oldRegime,
    newRegime,
    recommendedRegime,
    suggestions,
    advisoryNote,
    maxedOutScenario: {
      totalInvestmentNeeded: remaining80C + remaining80D + remainingNPS,
      oldRegimeTaxIfMaxed: maxedOldRegime.totalTaxLiability,
      isOldBetterIfMaxed: maxedOldRegime.totalTaxLiability < newRegime.totalTaxLiability,
      savingsVsCurrentBest: Math.max(0, Math.min(oldRegime.totalTaxLiability, newRegime.totalTaxLiability) - maxedOldRegime.totalTaxLiability)
    }
  };
};

module.exports = {
  calculateTaxAll,
  calculateOldRegime,
  calculateNewRegime,
  calculateHraExemption
};
