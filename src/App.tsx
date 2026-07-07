import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import {
  ApplicantInputs,
  AssessmentResult,
  CATEGORY_LABELS,
  DocumentCategory,
  SelectedDocument,
  calculateAssessment,
  formatBytes,
  inferCategory,
} from "./assessment";

const INITIAL_INPUTS = {
  annualIncome: "96000",
  requestedAmount: "320000",
  existingDebt: "18000",
  monthlyLivingExpenses: "2600",
  loanTermYears: "30",
};

function currency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function percentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

function App() {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [documents, setDocuments] = useState<SelectedDocument[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategoryCount = useMemo(
    () => new Set(documents.map((document) => document.category)).size,
    [documents],
  );

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((current) => ({ ...current, [name]: value }));
    setResult(null);
    setError("");
  };

  const addFiles = (files: FileList | File[]) => {
    const nextDocuments = Array.from(files).map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type || "Unknown file type",
      category: inferCategory(file.name),
    }));

    setDocuments((current) => {
      const existingIds = new Set(current.map((document) => document.id));
      return [...current, ...nextDocuments.filter((document) => !existingIds.has(document.id))];
    });
    setResult(null);
    setError("");
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const updateDocumentCategory = (id: string, category: DocumentCategory) => {
    setDocuments((current) =>
      current.map((document) => (document.id === id ? { ...document, category } : document)),
    );
    setResult(null);
  };

  const removeDocument = (id: string) => {
    setDocuments((current) => current.filter((document) => document.id !== id));
    setResult(null);
  };

  const generateAssessment = () => {
    const numericInputs: ApplicantInputs = {
      annualIncome: Number(inputs.annualIncome),
      requestedAmount: Number(inputs.requestedAmount),
      existingDebt: Number(inputs.existingDebt),
      monthlyLivingExpenses: Number(inputs.monthlyLivingExpenses),
      loanTermYears: Number(inputs.loanTermYears),
    };

    if (
      numericInputs.annualIncome <= 0 ||
      numericInputs.requestedAmount <= 0 ||
      numericInputs.existingDebt < 0 ||
      numericInputs.monthlyLivingExpenses < 0 ||
      numericInputs.loanTermYears <= 0
    ) {
      setError("Enter valid non-negative financial values and a positive income, amount and term.");
      setResult(null);
      return;
    }

    setError("");
    setResult(calculateAssessment(numericInputs, documents));
    window.setTimeout(() => {
      document.getElementById("assessment-results")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const reset = () => {
    setInputs(INITIAL_INPUTS);
    setDocuments([]);
    setResult(null);
    setError("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Credit Assessment AI home">
          <span className="brand-mark" aria-hidden="true">CA</span>
          <span>
            <strong>Credit Assessment AI</strong>
            <small>Portfolio demonstration</small>
          </span>
        </a>
        <div className="security-pill">
          <span className="status-dot" aria-hidden="true" />
          No uploads · No credentials
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Explainable assessment workflow</p>
            <h1>Turn application inputs into a review-ready credit snapshot.</h1>
            <p className="hero-text">
              Explore a privacy-first demonstration of document intake, financial ratios,
              transparent risk indicators and structured reviewer guidance.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#assessment-form">Start assessment</a>
              <a className="secondary-button" href="#privacy">How privacy works</a>
            </div>
          </div>

          <div className="hero-panel" aria-label="Workflow summary">
            <div className="metric-tile">
              <span>01</span>
              <strong>Collect</strong>
              <p>Applicant details and local file metadata.</p>
            </div>
            <div className="metric-tile">
              <span>02</span>
              <strong>Analyse</strong>
              <p>Financial ratios and evidence coverage.</p>
            </div>
            <div className="metric-tile">
              <span>03</span>
              <strong>Explain</strong>
              <p>Review indicators, strengths and next steps.</p>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Application safeguards">
          <div><strong>Browser only</strong><span>No network processing</span></div>
          <div><strong>Transparent logic</strong><span>No hidden model</span></div>
          <div><strong>Human review</strong><span>No automated credit decision</span></div>
        </section>

        <section id="assessment-form" className="workspace">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Assessment workspace</p>
              <h2>Build the review package</h2>
            </div>
            <button className="text-button" type="button" onClick={reset}>Reset demo</button>
          </div>

          <div className="workspace-grid">
            <article className="panel">
              <div className="panel-heading">
                <span className="step-number">1</span>
                <div>
                  <h3>Applicant and loan details</h3>
                  <p>Use synthetic values only. Do not enter real customer information.</p>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  <span>Annual gross income</span>
                  <div className="input-prefix"><b>$</b><input name="annualIncome" type="number" min="1" value={inputs.annualIncome} onChange={handleInput} /></div>
                </label>
                <label>
                  <span>Requested loan amount</span>
                  <div className="input-prefix"><b>$</b><input name="requestedAmount" type="number" min="1" value={inputs.requestedAmount} onChange={handleInput} /></div>
                </label>
                <label>
                  <span>Existing debt balance</span>
                  <div className="input-prefix"><b>$</b><input name="existingDebt" type="number" min="0" value={inputs.existingDebt} onChange={handleInput} /></div>
                </label>
                <label>
                  <span>Monthly living expenses</span>
                  <div className="input-prefix"><b>$</b><input name="monthlyLivingExpenses" type="number" min="0" value={inputs.monthlyLivingExpenses} onChange={handleInput} /></div>
                </label>
                <label className="full-width">
                  <span>Loan term</span>
                  <div className="input-suffix"><input name="loanTermYears" type="number" min="1" max="40" value={inputs.loanTermYears} onChange={handleInput} /><b>years</b></div>
                </label>
              </div>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <span className="step-number">2</span>
                <div>
                  <h3>Supporting documents</h3>
                  <p>Only filename, file type and size are used. Contents are never read.</p>
                </div>
              </div>

              <div
                className={`dropzone ${dragging ? "dragging" : ""}`}
                onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <div className="upload-icon" aria-hidden="true">↑</div>
                <strong>Drop synthetic files here</strong>
                <p>PDF, CSV or image filenames can be used to demonstrate categorisation.</p>
                <button className="secondary-button" type="button" onClick={() => fileInputRef.current?.click()}>
                  Choose files
                </button>
                <input
                  ref={fileInputRef}
                  className="visually-hidden"
                  type="file"
                  multiple
                  accept=".pdf,.csv,.png,.jpg,.jpeg"
                  onChange={handleFileSelection}
                />
              </div>

              <div className="document-summary">
                <span>{documents.length} files selected</span>
                <span>{documentCategoryCount}/5 evidence categories</span>
              </div>

              {documents.length > 0 ? (
                <div className="document-list">
                  {documents.map((document) => (
                    <div className="document-row" key={document.id}>
                      <div className="file-badge" aria-hidden="true">DOC</div>
                      <div className="document-name">
                        <strong>{document.name}</strong>
                        <span>{formatBytes(document.size)} · {document.type}</span>
                      </div>
                      <select
                        aria-label={`Category for ${document.name}`}
                        value={document.category}
                        onChange={(event) => updateDocumentCategory(document.id, event.target.value as DocumentCategory)}
                      >
                        {(Object.keys(CATEGORY_LABELS) as DocumentCategory[]).map((category) => (
                          <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
                        ))}
                      </select>
                      <button className="remove-button" type="button" onClick={() => removeDocument(document.id)} aria-label={`Remove ${document.name}`}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">No files selected. The assessment can still run and will identify missing evidence.</div>
              )}
            </article>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <div className="assessment-action">
            <div>
              <strong>Ready to generate the demonstration assessment?</strong>
              <span>All calculations run locally in this browser tab.</span>
            </div>
            <button className="primary-button" type="button" onClick={generateAssessment}>
              Generate assessment
            </button>
          </div>
        </section>

        {result && (
          <section id="assessment-results" className="results-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Assessment output</p>
                <h2>Review-ready snapshot</h2>
              </div>
              <span className={`recommendation-badge ${result.recommendationTone}`}>{result.recommendation}</span>
            </div>

            <div className="result-grid">
              <article className="score-card primary-score">
                <span>Review risk score</span>
                <strong>{result.riskScore}<small>/100</small></strong>
                <div className="score-track"><div style={{ width: `${result.riskScore}%` }} /></div>
                <p>Higher values indicate more factors requiring manual review.</p>
              </article>
              <article className="score-card">
                <span>Debt-to-income</span>
                <strong>{percentage(result.debtToIncome)}</strong>
                <p>Existing debt divided by annual gross income.</p>
              </article>
              <article className="score-card">
                <span>Monthly commitments</span>
                <strong>{percentage(result.monthlyCommitmentRatio)}</strong>
                <p>Estimated debt and living commitments relative to monthly income.</p>
              </article>
              <article className="score-card">
                <span>Evidence completeness</span>
                <strong>{result.completeness}%</strong>
                <p>Coverage across the five demonstration evidence categories.</p>
              </article>
            </div>

            <div className="result-detail-grid">
              <article className="panel result-panel">
                <h3>Review indicators</h3>
                {result.indicators.length > 0 ? (
                  <ul className="finding-list warning-list">
                    {result.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}
                  </ul>
                ) : (
                  <p className="muted-copy">No material review indicators were generated.</p>
                )}
              </article>

              <article className="panel result-panel">
                <h3>Positive signals</h3>
                {result.strengths.length > 0 ? (
                  <ul className="finding-list strength-list">
                    {result.strengths.map((strength) => <li key={strength}>{strength}</li>)}
                  </ul>
                ) : (
                  <p className="muted-copy">Additional evidence is needed before strengths can be confirmed.</p>
                )}
              </article>
            </div>

            <article className="panel calculation-panel">
              <div>
                <span>Estimated new repayment</span>
                <strong>{currency(result.estimatedMonthlyRepayment)}<small>/month</small></strong>
              </div>
              <div>
                <span>Requested amount to income</span>
                <strong>{result.loanToIncome.toFixed(2)}×</strong>
              </div>
              <p>
                Estimates use simplified demonstration assumptions and are not suitable for a real lending decision.
              </p>
            </article>
          </section>
        )}

        <section id="privacy" className="privacy-section">
          <div>
            <p className="eyebrow">Privacy by design</p>
            <h2>Nothing leaves the browser.</h2>
          </div>
          <div className="privacy-grid">
            <article><strong>File contents</strong><p>Never read, parsed or uploaded.</p></article>
            <article><strong>Applicant values</strong><p>Held only in React state for the current tab.</p></article>
            <article><strong>External services</strong><p>No database, storage or AI provider is called.</p></article>
            <article><strong>Credentials</strong><p>None are required or included in the repository.</p></article>
          </div>
        </section>

        <section className="responsible-use">
          <strong>Responsible-use notice</strong>
          <p>
            This is an educational portfolio demonstration. It must not be used to approve,
            decline, price or otherwise determine a real person's access to credit.
          </p>
        </section>
      </main>

      <footer>
        <span>Credit Assessment AI · Portfolio demonstration</span>
        <a href="https://github.com/Lukeyone/credit-assessment-ai">View source on GitHub</a>
      </footer>
    </div>
  );
}

export default App;
