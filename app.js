// ============================================================
// NEURO DIAGNOSTICS UNIT — APP LOGIC
// ============================================================

(function () {
  "use strict";

  // Scoring constants
  const POINTS_FULL = 100;       // awarded for fully correct diagnosis (right NT + right direction)
  const POINTS_PARTIAL = 50;     // awarded for right NT, wrong direction
  const POINTS_PER_QUESTION = 12; // deducted per question asked, only applies when diagnosis earned points
  const POINTS_FLOOR = 40;       // minimum points for an earned (non-zero) diagnosis, however many questions asked

  const state = {
    detective: "",
    caseOrder: [],            // shuffled array of indices into CASES, built fresh each game
    currentCaseIndex: 0,      // position within caseOrder (not an index into CASES directly)
    askedQuestions: {},      // caseId -> Set of question indices asked
    collectedEvidence: {},   // caseId -> Set of evidence ids
    results: [],             // { caseId, patientName, ntChoice, dirChoice, correct, points, questionsAsked }
    diagnosisInProgress: { nt: null, dir: null }
  };

  function shuffledIndices(n) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---------- DOM refs ----------
  const screens = {
    intro: document.getElementById("screen-intro"),
    case: document.getElementById("screen-case"),
    final: document.getElementById("screen-final")
  };

  const el = {
    detectiveNameInput: document.getElementById("name-input"),
    btnStart: document.getElementById("btn-start"),
    ntRoster: document.getElementById("nt-roster"),

    headerDetective: document.getElementById("detective-name"),
    headerSolved: document.getElementById("header-solved"),
    headerTotal: document.getElementById("header-total"),
    headerStatus: document.getElementById("header-status"),
    headerScore: document.getElementById("header-score"),
    caseTracker: document.getElementById("case-tracker"),

    caseTab: document.getElementById("case-tab"),
    casePatientLine: document.getElementById("case-patient-line"),
    caseComplaint: document.getElementById("case-complaint"),
    caseVitals: document.getElementById("case-vitals"),

    transcript: document.getElementById("transcript"),
    questionList: document.getElementById("question-list"),
    qCounter: document.getElementById("q-counter"),

    evidenceGrid: document.getElementById("evidence-grid"),
    btnToDiagnosis: document.getElementById("btn-to-diagnosis"),

    diagnosisPanel: document.getElementById("diagnosis-panel"),
    ntOptions: document.getElementById("nt-options"),
    directionOptions: document.getElementById("direction-options"),
    reasoningInput: document.getElementById("reasoning-input"),
    btnSubmitDiagnosis: document.getElementById("btn-submit-diagnosis"),

    feedbackPanel: document.getElementById("feedback-panel"),

    finalScore: document.getElementById("final-score"),
    finalPoints: document.getElementById("final-points"),
    finalRank: document.getElementById("final-rank"),
    finalComment: document.getElementById("final-comment"),
    finalTableBody: document.getElementById("final-table-body"),
    btnRestart: document.getElementById("btn-restart")
  };

  // ---------- Init static content ----------
  function renderRoster() {
    el.ntRoster.innerHTML = NT_PRIMER.map(nt => `
      <div class="nt-chip">
        <b>${nt.name}</b>${nt.role}
      </div>
    `).join("");
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Header / tracker ----------
  function totalScore() {
    return state.results.reduce((sum, r) => sum + r.points, 0);
  }

  function renderHeader() {
    el.headerDetective.textContent = state.detective || "Unassigned";
    el.headerTotal.textContent = CASES.length;
    el.headerSolved.textContent = state.results.filter(r => r.correct).length;
    const solvedCount = state.results.length;
    if (solvedCount === 0) {
      el.headerStatus.textContent = "Investigation active";
    } else if (solvedCount === CASES.length) {
      el.headerStatus.textContent = "Archive complete";
    } else {
      el.headerStatus.textContent = `Case ${solvedCount + 1} of ${CASES.length}`;
    }
    if (el.headerScore) {
      el.headerScore.textContent = `${totalScore()} pts`;
    }

    el.caseTracker.innerHTML = CASES.map((c, idx) => {
      let cls = "case-dot";
      if (idx < state.results.length) {
        cls += " solved";
      } else if (idx === state.currentCaseIndex) {
        cls += " current";
      } else {
        cls += " locked";
      }
      return `<div class="${cls}" title="Case ${idx + 1} of ${CASES.length}">${idx + 1}</div>`;
    }).join("");
  }

  // ---------- Case rendering ----------
  function getCurrentCase() {
    const actualIndex = state.caseOrder[state.currentCaseIndex];
    return CASES[actualIndex];
  }

  function ensureCaseState(caseId) {
    if (!state.askedQuestions[caseId]) state.askedQuestions[caseId] = new Set();
    if (!state.collectedEvidence[caseId]) state.collectedEvidence[caseId] = new Set();
  }

  function renderCase() {
    const c = getCurrentCase();
    ensureCaseState(c.id);

    el.caseTab.textContent = `CASE ${String(state.currentCaseIndex + 1).padStart(2, "0")}`;
    el.casePatientLine.textContent = c.patientName;
    el.caseComplaint.textContent = c.complaint;

    el.caseVitals.innerHTML = c.vitals.map(([label, value, flagged]) => `
      <tr>
        <td>${label}</td>
        <td${flagged ? ' class="flag"' : ""}>${value}</td>
      </tr>
    `).join("");

    renderTranscript();
    renderQuestionList();
    renderEvidence();

    // reset diagnosis UI
    el.diagnosisPanel.style.display = "none";
    el.feedbackPanel.style.display = "none";
    el.feedbackPanel.innerHTML = "";
    el.reasoningInput.value = "";
    state.diagnosisInProgress = { nt: null, dir: null };
    el.btnToDiagnosis.disabled = false;
    el.btnToDiagnosis.style.display = "inline-block";

    renderHeader();
  }

  function renderTranscript() {
    const c = getCurrentCase();
    const askedIdxs = Array.from(state.askedQuestions[c.id] || []).sort((a, b) => a - b);
    if (askedIdxs.length === 0) {
      el.transcript.innerHTML = `<div class="line"><span class="who">[No questions asked yet]</span> Select a question below to begin the interview.</div>`;
    } else {
      el.transcript.innerHTML = askedIdxs.map(i => {
        const item = c.questions[i];
        return `
          <div class="line detective"><span class="who">You:</span> ${item.q}</div>
          <div class="line witness"><span class="who">Witness:</span> ${item.a}</div>
        `;
      }).join("");
    }
    el.transcript.scrollTop = el.transcript.scrollHeight;
    el.qCounter.textContent = `${askedIdxs.length}/${c.questions.length} asked`;
  }

  function renderQuestionList() {
    const c = getCurrentCase();
    const asked = state.askedQuestions[c.id];
    el.questionList.innerHTML = c.questions.map((item, idx) => {
      const isAsked = asked.has(idx);
      return `
        <button class="q-btn" data-idx="${idx}" ${isAsked ? "disabled" : ""}>
          ${isAsked ? '<span class="tick">✓</span>' : ""}${item.q}
        </button>
      `;
    }).join("");

    el.questionList.querySelectorAll(".q-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        askQuestion(idx);
      });
    });
  }

  function askQuestion(idx) {
    const c = getCurrentCase();
    const askedSet = state.askedQuestions[c.id];
    if (askedSet.has(idx)) return;
    askedSet.add(idx);

    const item = c.questions[idx];
    if (item.unlocks) {
      state.collectedEvidence[c.id].add(item.unlocks);
    }

    renderTranscript();
    renderQuestionList();
    renderEvidence();
  }

  function renderEvidence() {
    const c = getCurrentCase();
    const collected = state.collectedEvidence[c.id];
    el.evidenceGrid.innerHTML = c.evidence.map(ev => {
      const isCollected = collected.has(ev.id);
      return `
        <div class="evidence-card ${isCollected ? "collected" : ""}">
          <b>${isCollected ? ev.label : "??? Locked"}</b>
          ${isCollected ? ev.text : "Ask a relevant question to unlock this evidence."}
        </div>
      `;
    }).join("");
  }

  // ---------- Diagnosis flow ----------
  function renderDiagnosisOptions() {
    el.ntOptions.innerHTML = NEUROTRANSMITTERS.map(nt => `
      <button class="nt-option" data-nt="${nt.id}" type="button">${nt.name}</button>
    `).join("");

    el.ntOptions.querySelectorAll(".nt-option").forEach(btn => {
      btn.addEventListener("click", () => {
        state.diagnosisInProgress.nt = btn.getAttribute("data-nt");
        el.ntOptions.querySelectorAll(".nt-option").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });

    el.directionOptions.querySelectorAll(".dir-option").forEach(btn => {
      // Clean previous listeners by replacing node not necessary since options are static; just (re)bind once.
    });
  }

  function bindDirectionOptions() {
    el.directionOptions.querySelectorAll(".dir-option").forEach(btn => {
      btn.addEventListener("click", () => {
        state.diagnosisInProgress.dir = btn.getAttribute("data-dir");
        el.directionOptions.querySelectorAll(".dir-option").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  }

  el.btnToDiagnosis.addEventListener("click", () => {
    el.diagnosisPanel.style.display = "block";
    renderDiagnosisOptions();
    el.btnToDiagnosis.style.display = "none";
    el.diagnosisPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  bindDirectionOptions();

  el.btnSubmitDiagnosis.addEventListener("click", () => {
    const { nt, dir } = state.diagnosisInProgress;
    if (!nt || !dir) {
      alert("Please select both a neurotransmitter and a direction (deficiency/excess) before filing your diagnosis.");
      return;
    }
    submitDiagnosis(nt, dir);
  });

  function calculatePoints(correct, ntCorrectOnly, questionsAsked) {
    if (!correct && !ntCorrectOnly) return 0;
    const base = correct ? POINTS_FULL : POINTS_PARTIAL;
    const penalty = questionsAsked * POINTS_PER_QUESTION;
    return Math.max(POINTS_FLOOR, base - penalty);
  }

  function submitDiagnosis(ntChoice, dirChoice) {
    const c = getCurrentCase();
    const correct = (ntChoice === c.correctNT) && (dirChoice === c.correctDirection);
    const ntCorrectOnly = (ntChoice === c.correctNT) && (dirChoice !== c.correctDirection);
    const questionsAsked = state.askedQuestions[c.id] ? state.askedQuestions[c.id].size : 0;
    const points = calculatePoints(correct, ntCorrectOnly, questionsAsked);

    state.results.push({
      caseId: c.id,
      patientName: c.patientName,
      ntChoice: NEUROTRANSMITTERS.find(n => n.id === ntChoice).name,
      dirChoice: DIRECTION_LABEL[dirChoice],
      correctNT: NEUROTRANSMITTERS.find(n => n.id === c.correctNT).name,
      correctDir: DIRECTION_LABEL[c.correctDirection],
      correct: correct,
      questionsAsked: questionsAsked,
      points: points
    });

    renderFeedback(c, correct, ntCorrectOnly, questionsAsked, points);
    el.diagnosisPanel.style.display = "none";
    renderHeader();
  }

  function renderFeedback(c, correct, ntCorrectOnly, questionsAsked, points) {
    const panel = el.feedbackPanel;
    panel.className = "feedback " + (correct ? "correct" : "incorrect");
    panel.style.display = "block";

    let verdict;
    if (correct) {
      verdict = "✓ Diagnosis Confirmed";
    } else if (ntCorrectOnly) {
      verdict = "✗ Partially Correct — right transmitter, wrong direction";
    } else {
      verdict = "✗ Diagnosis Incorrect";
    }

    const cluesHtml = c.explanation.keyClues.map(clue => `<li>${clue}</li>`).join("");

    const isLastCase = state.currentCaseIndex === CASES.length - 1;

    const totalQs = c.questions.length;
    let scoreLine;
    if (correct) {
      scoreLine = `<p class="score-line"><b>+${points} points</b> &mdash; asked ${questionsAsked} of ${totalQs} available questions. ${questionsAsked <= 2 ? "Sharp work: minimal questioning and still on target." : "Fewer questions asked next time means a higher score for the same correct call."}</p>`;
    } else if (points > 0) {
      scoreLine = `<p class="score-line"><b>+${points} points</b> &mdash; asked ${questionsAsked} of ${totalQs} available questions. Partial credit for identifying the right transmitter; direction is worth points too.</p>`;
    } else {
      scoreLine = `<p class="score-line"><b>+0 points</b> &mdash; points are only awarded when the transmitter identified is at least correct.</p>`;
    }

    panel.innerHTML = `
      <div class="feedback-verdict">${verdict}</div>
      ${scoreLine}
      <div class="feedback-body">
        <p><b>Correct diagnosis:</b> ${NEUROTRANSMITTERS.find(n => n.id === c.correctNT).name} (${DIRECTION_LABEL[c.correctDirection]})</p>
        <p>${c.explanation.correctSummary}</p>
        <h4>Key clues that point here</h4>
        <ul class="clue-list">${cluesHtml}</ul>
        <h4>Common mix-up</h4>
        <p>${c.explanation.distractorNote}</p>
      </div>
      <div class="action-row">
        <button class="btn" id="btn-next-case">${isLastCase ? "View Final Report →" : "Next Case →"}</button>
      </div>
    `;

    document.getElementById("btn-next-case").addEventListener("click", () => {
      if (isLastCase) {
        renderFinal();
        showScreen("final");
      } else {
        state.currentCaseIndex += 1;
        renderCase();
      }
    });

    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Final report ----------
  function renderFinal() {
    const correctCount = state.results.filter(r => r.correct).length;
    const total = CASES.length;
    const score = totalScore();
    const maxPossible = total * POINTS_FULL;
    el.finalScore.textContent = `${correctCount}/${total}`;
    if (el.finalPoints) {
      el.finalPoints.textContent = `${score} / ${maxPossible} points`;
    }

    let rank, comment;
    const pct = correctCount / total;
    if (pct === 1) {
      rank = "Master Diagnostician";
      comment = "A clean sweep. You correctly identified every neurotransmitter system and its direction across all eight cases — including the GABA/glutamate distinction, which trips up most investigators on first pass.";
    } else if (pct >= 0.75) {
      rank = "Senior Detective";
      comment = "Strong work — you correctly diagnosed most cases. Review the cases marked incorrect below and pay close attention to the 'Common mix-up' notes, which flag exactly where reasoning tends to go sideways.";
    } else if (pct >= 0.5) {
      rank = "Field Detective";
      comment = "A solid start, but a few diagnoses missed the mark. Go back through the cases below, re-read the key clues, and notice how each clue connects to a specific neurotransmitter's known mechanism rather than just the symptom on its own.";
    } else {
      rank = "Trainee Investigator";
      comment = "This case archive is meant to be revisited. Consider replaying the cases you missed, paying close attention to the evidence locker clues and how each one maps onto a transmitter's actual physiological role.";
    }

    if (pct === 1 && score >= maxPossible * 0.85) {
      comment += " And your point total shows you got there efficiently, asking only the questions you needed.";
    }

    el.finalRank.textContent = rank;
    el.finalComment.textContent = comment;

    el.finalTableBody.innerHTML = state.results.map((r, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${r.patientName}</td>
        <td class="right">${r.ntChoice} / ${r.dirChoice}</td>
        <td class="right">${r.questionsAsked}</td>
        <td class="right">${r.points}</td>
        <td class="right ${r.correct ? "tag-correct" : "tag-incorrect"}">${r.correct ? "Correct" : `Incorrect (was ${r.correctNT} / ${r.correctDir})`}</td>
      </tr>
    `).join("");
  }

  el.btnRestart.addEventListener("click", () => {
    state.caseOrder = shuffledIndices(CASES.length);
    state.currentCaseIndex = 0;
    state.askedQuestions = {};
    state.collectedEvidence = {};
    state.results = [];
    state.diagnosisInProgress = { nt: null, dir: null };
    renderCase();
    showScreen("case");
  });

  // ---------- Start flow ----------
  el.btnStart.addEventListener("click", () => {
    const name = el.detectiveNameInput.value.trim();
    state.detective = name || "Detective";
    state.caseOrder = shuffledIndices(CASES.length);
    state.currentCaseIndex = 0;
    renderCase();
    showScreen("case");
  });

  el.detectiveNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") el.btnStart.click();
  });

  // ---------- Boot ----------
  renderRoster();
  renderHeader();
})();
