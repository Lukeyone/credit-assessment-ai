export type DocumentCategory =
  | "bank-statements"
  | "income-evidence"
  | "identification"
  | "liabilities"
  | "other";

export interface SelectedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  category: DocumentCategory;
}

export interface ApplicantInputs {
  annualIncome: number;
  requestedAmount: number;
  existingDebt: number;
  monthlyLivingExpenses: number;
  loanTermYears: number;
}

export interface AssessmentResult {
  riskScore: number;
  recommendation: "Proceed to review" | "Manual review recommended" | "Additional information required";
  recommendationTone: "positive" | "caution" | "warning";
  debtToIncome: number;
  monthlyCommitmentRatio: number;
  loanToIncome: number;
  completeness: number;
  estimatedMonthlyRepayment: number;
  indicators: string[];
  strengths: string[];
}

const CATEGORY_WEIGHTS: Record<DocumentCategory, number> = {
  "bank-statements": 25,
  "income-evidence": 25,
  identification: 15,
  liabilities: 20,
  other: 15,
};

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  "bank-statements": "Bank statements",
  "income-evidence": "Income evidence",
  identification: "Identification",
  liabilities: "Liability evidence",
  other: "Other supporting material",
};

export function inferCategory(filename: string): DocumentCategory {
  const value = filename.toLowerCase();

  if (value.includes("bank") || value.includes("statement") || value.includes("transaction")) {
    return "bank-statements";
  }

  if (
    value.includes("pay") ||
    value.includes("income") ||
    value.includes("salary") ||
    value.includes("tax")
  ) {
    return "income-evidence";
  }

  if (
    value.includes("licence") ||
    value.includes("license") ||
    value.includes("passport") ||
    value.includes("identity")
  ) {
    return "identification";
  }

  if (
    value.includes("loan") ||
    value.includes("credit") ||
    value.includes("liability") ||
    value.includes("debt")
  ) {
    return "liabilities";
  }

  return "other";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function percentage(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

export function calculateAssessment(
  inputs: ApplicantInputs,
  documents: SelectedDocument[],
): AssessmentResult {
  const monthlyIncome = inputs.annualIncome / 12;
  const monthlyInterestRate = 0.065 / 12;
  const repaymentCount = Math.max(1, inputs.loanTermYears * 12);
  const growthFactor = (1 + monthlyInterestRate) ** repaymentCount;
  const estimatedMonthlyRepayment =
    inputs.requestedAmount > 0
      ? (inputs.requestedAmount * monthlyInterestRate * growthFactor) / (growthFactor - 1)
      : 0;

  const estimatedExistingDebtPayment = inputs.existingDebt * 0.025;
  const monthlyCommitments =
    estimatedExistingDebtPayment + estimatedMonthlyRepayment + inputs.monthlyLivingExpenses;

  const debtToIncome = percentage(inputs.existingDebt, inputs.annualIncome);
  const monthlyCommitmentRatio = percentage(monthlyCommitments, monthlyIncome);
  const loanToIncome = inputs.annualIncome > 0 ? inputs.requestedAmount / inputs.annualIncome : 0;

  const representedCategories = new Set(documents.map((document) => document.category));
  const completeness = Array.from(representedCategories).reduce(
    (total, category) => total + CATEGORY_WEIGHTS[category],
    0,
  );

  let riskScore = 8;
  const indicators: string[] = [];
  const strengths: string[] = [];

  if (debtToIncome > 60) {
    riskScore += 34;
    indicators.push("Existing debt is high relative to annual income.");
  } else if (debtToIncome > 40) {
    riskScore += 21;
    indicators.push("Existing debt warrants additional serviceability review.");
  } else if (debtToIncome > 25) {
    riskScore += 10;
    indicators.push("Existing debt is material but not automatically adverse.");
  } else {
    strengths.push("Existing debt is comparatively low relative to income.");
  }

  if (monthlyCommitmentRatio > 85) {
    riskScore += 34;
    indicators.push("Estimated monthly commitments consume most available income.");
  } else if (monthlyCommitmentRatio > 65) {
    riskScore += 23;
    indicators.push("Estimated monthly commitments may leave limited financial buffer.");
  } else if (monthlyCommitmentRatio > 45) {
    riskScore += 12;
    indicators.push("Monthly commitments should be reviewed against verified expenses.");
  } else {
    strengths.push("Estimated monthly commitments leave a stronger income buffer.");
  }

  if (loanToIncome > 5) {
    riskScore += 20;
    indicators.push("The requested amount exceeds five times annual income.");
  } else if (loanToIncome > 3.5) {
    riskScore += 10;
    indicators.push("The requested amount is high relative to annual income.");
  } else {
    strengths.push("The requested amount is moderate relative to annual income.");
  }

  if (completeness < 50) {
    riskScore += 22;
    indicators.push("Core supporting-document categories are missing.");
  } else if (completeness < 75) {
    riskScore += 11;
    indicators.push("Additional supporting evidence would improve the review package.");
  } else {
    strengths.push("The selected documents cover most core evidence categories.");
  }

  if (!representedCategories.has("bank-statements")) {
    indicators.push("Bank statements have not been selected.");
  }

  if (!representedCategories.has("income-evidence")) {
    indicators.push("Income evidence has not been selected.");
  }

  if (!representedCategories.has("identification")) {
    indicators.push("Identification evidence has not been selected.");
  }

  const finalRiskScore = Math.round(clamp(riskScore, 0, 100));

  if (finalRiskScore < 32) {
    return {
      riskScore: finalRiskScore,
      recommendation: "Proceed to review",
      recommendationTone: "positive",
      debtToIncome,
      monthlyCommitmentRatio,
      loanToIncome,
      completeness,
      estimatedMonthlyRepayment,
      indicators,
      strengths,
    };
  }

  if (finalRiskScore < 60) {
    return {
      riskScore: finalRiskScore,
      recommendation: "Manual review recommended",
      recommendationTone: "caution",
      debtToIncome,
      monthlyCommitmentRatio,
      loanToIncome,
      completeness,
      estimatedMonthlyRepayment,
      indicators,
      strengths,
    };
  }

  return {
    riskScore: finalRiskScore,
    recommendation: "Additional information required",
    recommendationTone: "warning",
    debtToIncome,
    monthlyCommitmentRatio,
    loanToIncome,
    completeness,
    estimatedMonthlyRepayment,
    indicators,
    strengths,
  };
}
