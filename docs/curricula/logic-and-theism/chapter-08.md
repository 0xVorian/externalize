# Chapter VIII — Clouds of Witnesses: “Of Miracles”

**Source:** Jordan Howard Sobel, *Logic and Theism*, Chapter VIII, pp. 298–344  
**Status:** reviewed  
**Role in source-driven curriculum:** applies Bayesian reasoning to testimony, rare events, witness reliability, and updating under extreme priors

## Why this chapter matters for Externalize

Chapter VIII is one of the best chapters in the book for concrete-to-formal teaching.

The conceptual core is not specifically theological. It is about a general problem:

> How should testimony change our confidence in a highly improbable event?

That problem appears in medicine, fraud detection, anomaly reporting, forensics, intelligence analysis, scientific replication, and everyday witness reports. The theology gives the source motivation; the reusable curriculum is about **base rates, likelihoods, testimony, false positives, reliability, and posterior belief**.

It also provides a direct transfer test from Chapter VII. The learner should not relearn Bayes from scratch. Externalize should detect prior mastery and immediately apply the same machinery to testimony.

## Durable concept nodes

### Reused from Chapter VII

- `probability`
- `conditional-probability`
- `prior-probability`
- `likelihood`
- `posterior-probability`
- `bayes-theorem`
- `confirmation`
- `background-information`

### New or extended

- `testimony-as-evidence`
- `base-rate`
- `witness-reliability`
- `true-positive-rate`
- `false-positive-rate`
- `report-content-vs-report-occurrence`
- `evidence-strength`
- `rare-event-updating`
- `old-evidence`
- `multiple-witnesses`
- `witness-dependence`
- `lottery-report`
- `hume-maxim`
- `hume-condorcet-rule`
- `ideal-vs-human-updating`

## Capability dimensions

Track separately whether the learner can:

- distinguish the event from testimony that the event occurred;
- distinguish `P(report|event)` from `P(event|report)`;
- use base rates correctly;
- separate witness sensitivity from false-report propensity;
- update on testimony using Bayes;
- compare rare-event and lottery cases;
- reason about multiple witnesses and dependence;
- understand why observed human updating may diverge from simple Bayesian norms;
- distinguish evidence for a miracle from evidence for God.

---

## VIII.1–VIII.2 — What counts as a miracle, and what is a law of nature?

Sobel preserves Hume’s technical framing: a miracle is a violation/transgression of a law of nature by divine or other invisible agency. Importantly, this is not simply “an extremely improbable event.”

### Externalize sequence

1. Present events varying along two dimensions:
   - very improbable vs ordinary;
   - law-violating under the stipulated model vs law-conforming.
2. Ask learner to classify:
   - lottery winner;
   - freak but physically possible coincidence;
   - apparent suspension of a physical law;
   - unknown mechanism.
3. Make explicit that improbability alone does not settle miracle status.

### Curriculum finding

`rare-event` and `miracle` must not be merged. One is probabilistic; the other includes source-local metaphysical/causal content.

**Reading exit:** learner can keep “extraordinary,” “very improbable,” and “miraculous” distinct in Sobel’s/Hume’s discussion.

---

## VIII.3 — Evidence for miracles is not automatically evidence for God

A miracle, on Hume’s definition, could be due to the Deity or some other invisible agent. So even if testimony established a miracle, a further explanatory comparison would be needed to connect it to God.

Sobel also notes that the pattern/distribution of miracles might itself fit some divine hypotheses poorly.

### Externalize sequence

1. Suppose event M is established.
2. Offer hypotheses:
   - God caused M;
   - another supernatural agent caused M;
   - unknown cause.
3. Ask which evidence would discriminate among them.
4. Reuse Chapter VII’s hypothesis-comparison UI.

### Cross-chapter lesson

This is another instance of **conclusion strength**:

```text
testimony supports M
  ≠ testimony establishes M
  ≠ M establishes supernatural agency
  ≠ M establishes God
```

**Reading exit:** learner can say exactly which inferential step is still missing after a miracle is accepted.

---

## VIII.4 — Hume’s general maxim

Sobel formalizes Hume’s famous idea that testimony should establish a miracle only when the falsehood of the testimony would be even more improbable than the miracle reported.

He treats a necessary condition for testimony `t(M)` to establish M as:

```text
P(M | t(M)) > 1/2
```

and connects Hume’s “more miraculous falsehood” language to comparative improbability.

### Externalize sequence

1. Start with a rare event M.
2. Give a witness report `t(M)`.
3. Ask what must be true for the report to make M more likely than not.
4. Display competing paths:
   - M happened and witness reported it;
   - M did not happen and witness nevertheless reported it.
5. Compare the probability mass of those two paths.
6. Only then translate to Bayes/Hume formalism.

### Important distinction

The learner should see that a report’s persuasive force depends not merely on “how honest/reliable the witness is,” but on how likely **this specific report** is under both M and ¬M.

### Old evidence

Sobel notes a technical issue once the testimony is already known with certainty. Externalize should treat this as Mastery depth: evaluating the evidential force of a known report may require a counterfactual/pre-update perspective rather than naïvely setting `P(t(M)) = 1` and thinking the issue is solved.

---

## VIII.5–VIII.6 — Necessary and sufficient conditions; the second part of Hume’s maxim

The detailed source treatment refines when testimony is sufficient to establish a miracle and then considers the second part of Hume’s maxim concerning religious testimony.

### Externalize strategy

Do not make the learner memorize the maxim as prose. Treat it as a **threshold/evidence condition**.

Provide cases with:

- different priors for M;
- different witness true-positive rates;
- different false-positive rates;
- different posterior thresholds.

Ask whether the testimony crosses the threshold for belief.

### Transfer goal

The learner should generalize beyond miracles to:

- rare medical diagnoses;
- intrusion alerts;
- fraud reports;
- exceptional scientific claims.

This is where source-driven learning can produce immediately reusable epistemic skill.

---

## VIII.7 — Bayes for testimony

Sobel specializes the Chapter VII theorem:

```text
P(S | t(S)) =
  P(S) P(t(S)|S)
  --------------------------------------------
  P(S)P(t(S)|S) + P(¬S)P(t(S)|¬S)
```

### Externalize representation

Use a two-path tree:

```text
S                 ¬S
│                 │
report t(S)        false report t(S)
│                 │
prior × hit-rate   prior × false-positive-rate
```

Normalize the two surviving branches to obtain the posterior.

This representation should be reusable in every base-rate problem.

### Error tags

Chapter VIII strongly motivates dedicated error categories:

- `reversed-conditional`;
- `ignored-base-rate`;
- `ignored-false-positive-rate`;
- `report-equals-truth`;
- `reliability-as-posterior`.

---

## VIII.8 — Bayes historically

The historical material distinguishes Bayes’s actual essay from later forms commonly called Bayes’s theorem. This is source/context material rather than core prerequisite machinery.

### Externalize mode

**Interrogate / context**, not graded mastery by default.

The source route should preserve Sobel’s historical caution without turning it into mandatory probability content.

---

## VIII.9–VIII.10 — Richard Price and lotteries

Price argues, among other things, that Hume’s emphasis on prior improbability risks making ordinary reports of lottery outcomes incredible. Sobel’s reply is that this does not follow when the report model is specified correctly.

A lottery is the perfect concrete teaching case because every exact winning number has a tiny prior probability, yet a sufficiently discriminating witness/reporting mechanism can still make a particular result highly credible.

### Externalize sequence

1. 1,000 equally likely numbers; prior for `79` is 0.001.
2. Witness reports `79`.
3. Specify:
   - `P(report 79 | 79)` high;
   - `P(report 79 | n≠79)` distributed across many wrong reports.
4. Ask learner to compute/estimate `P(79 | report 79)`.
5. Contrast with a witness who, when wrong, disproportionately says `79`.
6. Show that the **structure of errors** matters, not only the overall frequency of truthfulness.

### Major curriculum insight

A scalar “90% reliable witness” is often underspecified.

Externalize should support a richer **confusion-matrix model**:

- probability of saying S when S;
- probability of saying S when ¬S;
- perhaps a distribution over alternative reports.

This is more general and more faithful than one reliability percentage.

---

## VIII.11 — Hume weighs Price

Sobel argues that Hume’s core intuition about prior probabilities survives Price’s challenge and can be reconstructed in Bayesian terms even though Hume did not know the modern theorem.

### Externalize task: argument reconstruction without anachronism

Separate:

- what Hume explicitly had;
- what Sobel thinks can formalize Hume’s intuition;
- what modern Bayes provides.

This is a useful general source-reading discipline: **a modern formalization is not automatically a historical attribution**.

---

## VIII.12–VIII.13 — Tversky/Kahneman taxi experiments and responses

Sobel turns from ideal Bayesian updating to actual human reasoning. In the taxicab-style experiments, subjects tend to discount or ignore base rates when given witness accuracy information.

The curricular value is enormous because the learner can experience the bias directly.

### Externalize sequence

1. Present base rate only: 15 blue / 85 green.
2. Ask probability accident cab is blue.
3. Add a witness who identifies colors correctly 80% of the time under balanced test conditions.
4. Ask for an intuitive posterior **before** calculation.
5. Record the answer.
6. Reveal the Bayesian calculation with all intermediate branches.
7. Compare intuition to result without framing the learner as simply careless.
8. Repeat with varied base rates.

### Important nuance from Sobel

He considers two reactions to such experiments:

- people are making systematic errors;
- simple Bayesianism may omit psychologically or rationally relevant dimensions in some real cases.

Externalize should preserve that distinction. The exercise can teach the formal Bayesian result without pretending the philosophical interpretation of experimental deviations is settled.

### Product opportunity

This could become one of Externalize’s strongest adaptive mechanisms: when a learner repeatedly ignores priors, schedule targeted base-rate transfer cases across domains.

---

# Appendix A — proof of Hume’s theorem

Mastery-only by default.

### Externalize strategy

- expose each probability identity used;
- keep the target theorem pinned;
- allow a proof replay with one algebraic transformation per step;
- provide a semantic gloss beside every symbolic step.

This matches Externalize’s original working-memory purpose extremely well.

---

# Appendix B — Condorcet, witness reliability, and last degrees of assurance

## B1 — Hume–Condorcet rule

Useful for expressing testimony strength in terms of:

- prior probability `p` of S;
- a reliability/evidence factor `r` based on reporting behavior.

## B2 — witness reliability

Sobel’s key point is that reliability to S depends on both:

- `P(t(S)|S)` — tendency to report S when S is true;
- `P(t(S)|¬S)` — tendency to report S when S is false.

This strongly supports a reusable `witness-confusion-profile` model in Externalize.

## B3 — last degrees of assurance

Advanced content concerning Hume’s language of proofs, maximal assurance, and problems representing such distinctions with ordinary probabilities 0 and 1.

This can be deferred until the learner encounters infinitesimals/hyperreals later in the book.

### Cross-link

Create a dependency from this appendix to Chapter XIII’s hyperreal material rather than teaching it twice.

---

# Reading route for Chapter VIII

```text
rare event vs miracle
  -> event vs testimony
  -> base rate
  -> report likelihood if true
  -> report likelihood if false
  -> Bayes testimony tree
  -> posterior belief
  -> lottery transfer
  -> human base-rate neglect
```

If Chapter VII Bayes is already mastered, the route should begin at `event vs testimony` and skip the generic probability lessons.

# Mastery route

Adds:

- Hume’s theorem formalization;
- old-evidence complication;
- derivation of testimony Bayes;
- lottery report calculations;
- Hume–Condorcet rule;
- detailed witness-reliability model;
- Appendix A proof;
- optional link to nonstandard probabilities/last degrees of assurance.

# Candidate exercise families contributed to Externalize

- `event-vs-report-sorter`
- `rare-event-testimony-tree`
- `witness-confusion-matrix`
- `base-rate-neglect-diagnostic`
- `lottery-report-updater`
- `false-positive-sensitivity`
- `multiple-witness-dependence`
- `historical-formalization-distinction`
- `old-evidence-perspective`
- `posterior-threshold-check`

# Architectural findings from Chapter VIII

1. **Reliability should not be a scalar by default.** A confusion profile is often necessary.
2. **Prior/base-rate neglect deserves learner-specific remediation.** This is an ideal adaptive skill tag.
3. **Source routes should reuse learned machinery aggressively.** Chapter VIII should instantiate Bayes, not reteach it if Chapter VII mastery exists.
4. **Event and evidence need separate objects.** The system should never encode `S` and `testimony(S)` as the same proposition.
5. **Human reasoning data can be incorporated without redefining correctness.** Externalize can show the normative Bayesian result while separately tracking empirical/psychological observations from the source.
6. **Advanced source material can create forward dependencies.** Hume’s “last degrees of assurance” can point ahead to hyperreals rather than bloating the current route.

# Validation target

At Reading depth, the learner should be able to answer without the text:

1. Why is a miracle not just a very improbable event in Sobel’s use?
2. Why does testimony for a miracle not automatically establish God?
3. Why does witness evidence depend on the prior probability of the event?
4. Why is `P(report|event)` different from `P(event|report)`?
5. Why can a very improbable lottery result become highly credible after a good report?
6. Why is “90% reliable witness” often not enough information?
7. What do the taxi experiments show about ordinary human updating?

If the learner can predict their own base-rate error in a taxi-style problem, inspect the Bayesian branches, and then transfer the lesson to Hume’s miracle case, Externalize is doing substantially more than explaining the chapter.