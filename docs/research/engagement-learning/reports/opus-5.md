# Externalize — Independent Research Submission

## Engagement, Durable Learning, and the Ethical Use of Behavioural Mechanisms

**Investigator:** Independent frontier-model submission (1 of 3)
**Commissioning brief:** *Externalize — Research Brief: Engagement, Durable Learning, and Ethical Use of Behavioral Mechanisms*
**Date of investigation:** 29 August 2026
**Status:** Investigative. Findings and recommendations only. No product decisions authorised.
**Independence:** Prepared without sight of the other two submissions. No attempt made to anticipate or converge with them.

---

## 0. How to read this document

Epistemic categories are kept separate throughout and are marked inline:

- **[K] Known** — established evidence, or authoritative project state supplied by the brief.
- **[A] Assumption** — used provisionally; not established here.
- **[F] Finding** — a conclusion this investigation supports.
- **[O] Open** — material uncertainty that this investigation did not resolve.
- **[R] Recommendation** — reasoned proposal, not a decision.

Effect sizes are reported in Cohen's *d* or Hedges' *g* unless stated. Where a source reports a percentage lift on a behavioural metric, it is labelled as such and **not** converted into a learning claim. Industry figures are marked **[industry]** and are treated as weak evidence regardless of the size of the company reporting them.

A note on one methodological asymmetry that shapes this entire report: **the learning-science literature is dominated by short-horizon laboratory studies with delayed-retention outcomes, while the engagement literature is dominated by long-horizon field studies with behavioural outcomes.** Almost nothing in either corpus does both. This is the single largest obstacle to answering the brief's question, and it recurs in nearly every mechanism entry below.

---

## 1. Executive synthesis

### 1.1 The short answer

**[F] The evidence supports a narrow, specific, and somewhat deflationary conclusion: the behavioural-design toolbox is good at changing *when and how often* a person starts a session, and almost useless — sometimes harmful — at changing *what happens inside* the session. The learning-science toolbox is the reverse. The only defensible architecture is one that uses behavioural mechanisms exclusively for session initiation and return, and hands over completely to cognitive-science mechanisms once the session begins.**

This is not a compromise position. It is what the effect sizes actually say when you separate them by outcome class:

| Outcome class | Best-evidenced mechanisms | Typical magnitude |
|---|---|---|
| Delayed retention | Spaced retrieval, successive relearning | *g* ≈ 0.5–0.75; relearning potency *d* > 1.5 |
| Transfer | Retrieval practice (with elaboration), productive failure, self-explanation | *d* ≈ 0.28–0.55 |
| Session initiation | Implementation intentions, cue/context stability | *d* ≈ 0.65 |
| Return / retention (behavioural) | Streaks, notifications, micro-rewards for lapse recovery | 0.5%–27% lift on behavioural metrics |
| Post-intervention persistence | *Very little survives* | ~8% of tested interventions in the largest available tournament |

**[F] The asymmetry in that last row is the most important single fact in this report.** In the Milkman et al. (2021) exercise megastudy — the largest head-to-head comparison of behavioural interventions ever run — 45% of the 54 interventions significantly increased weekly gym visits by between 9% and 27%, but only 8% produced behaviour change that was still significant and measurable after the four-week intervention ended. The top-performing intervention offered micro-rewards for returning after a missed workout. Note carefully what that means: *the best-performing mechanism in the largest behavioural tournament ever run was a lapse-recovery reward, not a streak.*

### 1.2 The seven claims this report will defend

1. **[F] Retrieval practice scheduled across days is the only mechanism in the entire arsenal with strong evidence for both durable retention and transfer.** Everything else is either an initiation aid or a decoration. Spaced retrieval beats massed retrieval at *g* = 0.74 (Latimier et al., 2021); distributed practice in real classrooms sits at *d* = 0.54 (Mawson & Kang, 2025).

2. **[F] "Days practised" is a better reward target than "questions answered," and this is now a directly tested claim rather than an inference.** YeckehZaare & Resnick (2025) ran an RCT in which one group earned credit per practice question and another earned credit per *day* on which a set of questions was answered. The counting-days group earned higher exam scores, mediated by spacing practice over more days, with the benefit concentrated among lower-GPA students. This is the closest thing in the literature to a validated learning-aligned streak.

3. **[F] Streaks as commonly implemented are a *spacing* mechanism wearing a *loss-aversion* costume, and the spacing is doing most of the real work.** The loss-aversion framing is what makes them dangerous; the daily-cadence enforcement is what makes them useful. These can be separated.

4. **[F] Several famous "powerful" mechanisms have substantially weaker evidence than their reputation.** The near-miss effect has failed pre-registered replication on behavioural persistence. Variable-ratio reinforcement in human product contexts is largely folklore extrapolated from pigeon operant chambers. Leaderboards are the game element most consistently associated with *negative* outcomes in education research. Points and badges in isolation carry little of gamification's measured effect.

5. **[F] Feedback is not reliably good.** Kluger & DeNisi's foundational review found roughly a third of feedback effects were negative; Wisniewski et al. (2020) recovered a headline *d* = 0.48 across 435 studies but with enormous heterogeneity driven by information content. For Externalize this means *feedback design is a higher-leverage decision than feedback frequency.*

6. **[F] The Goodhart problem in tutoring systems is not hypothetical, is well-characterised, and has a name.** Baker's "gaming the system" literature has documented hint abuse and rapid guessing for two decades and consistently links them to poorer learning. Externalize's prior evaluation-integrity incident is an instance of a known failure class, not a one-off.

7. **[F] The strongest ethical argument against manipulative mechanisms here is not deontological — it is *measurement-theoretic*.** Manipulation that increases activity without increasing learning does not merely fail to help; it actively corrupts the evidence base the product uses to model the learner. In a product whose core asset is a valid mastery model, a dark pattern is a data-poisoning attack on yourself.

### 1.3 What this implies for a single-user validation phase

**[R]** Given that the brief states Externalize is entering a validation period prioritising sustained personal use, most of the arsenal is *out of scope on power grounds alone*. An N=1 or small-N validation cannot detect a 10% behavioural lift, and certainly cannot detect a *d* = 0.3 learning effect. What it *can* do:

- Detect whether a scheduling policy produces retrievals at the intended intervals (deterministic, verifiable without statistics).
- Detect whether mastery evidence is being corrupted (auditable per-item, via the Goodhart instrumentation in §9).
- Detect whether the product is subjectively tolerable enough to be used at all.

**[R] The correct output of a validation phase is instrumentation and invariants, not engagement features.** Build the measurement layer that would let a later, larger cohort answer the questions in §12. Ship no gamification you cannot later remove without breaking the mastery model.

---

## 2. Corrections and challenges to the research brief

The brief is unusually well-constructed. The challenges below are substantive rather than cosmetic, and are ordered by how much they would change the research programme.

### 2.1 The brief's framing of "exploit the strongest known mechanisms" imports a false premise

**Challenge.** The research question presupposes that there exists a set of "strongest known mechanisms for motivation, habit formation, attention and repeated engagement" whose strength is established and which merely need redirecting. **[F] This is not what the literature shows.** The engagement mechanisms with the most cultural prestige (variable rewards, near misses, streaks-as-loss-aversion) have the *weakest* controlled evidence; the ones with the strongest evidence (implementation intentions, cue-context stability, lapse-recovery micro-rewards, days-based incentives) are boring and largely non-manipulative.

**[F] The manipulative/non-manipulative axis and the effective/ineffective axis are not the same axis, and in this domain they are close to orthogonal — arguably slightly negatively correlated.** The brief anticipates a trade-off ("effective but dangerous" as a category) that the evidence only weakly supports. There *are* effective-but-dangerous mechanisms (§6), but they are fewer than the brief's structure implies, and the strongest candidates in §5 are almost all ethically unremarkable.

**[R]** Reframe the question as: *which mechanisms reliably cause a learner to begin an appropriately-difficult retrieval episode at an appropriate time, and which of those survive contact with a learner who wants to minimise effort?*

### 2.2 The brief under-specifies what "engagement is instrumental" commits you to

**Challenge.** The governing principle is stated but its operational consequence is not drawn out. If engagement is strictly instrumental, then **[F] engagement metrics should not appear in any decision rule at all** — not as tie-breakers, not as secondary criteria, not as "guardrails against over-difficulty." The moment an engagement metric enters a decision rule, it becomes an optimisation target and Goodharts.

**[R]** Adopt a stronger form: *engagement metrics are diagnostic only.* They may be inspected to explain a learning result; they may never be used to select between designs. If two designs produce equal delayed retention and one produces more sessions, that is not a reason to prefer it — it is a reason to ask why it needed more sessions to achieve the same result. Efficiency, not volume.

### 2.3 The brief conflates two distinct desiderata: "durable retention" and "genuine mastery"

**Challenge.** These come apart sharply in symbolic logic. **[F] A learner can achieve excellent durable retention of proof patterns while having zero transfer to unfamiliar problem forms** — this is precisely the finding of Pan & Rickard's (2018) transfer meta-analysis, where the weighted transfer effect was d = 0.28 when practice and final tests had no response congruency, rising by d = 0.30 when answers substantially overlapped. Retention effects are large; transfer effects are roughly half the size and vanish quickly as the practice/test distance grows.

For a symbolic-logic tutor this is a first-order concern. It is easy to build a system that produces confident, durable retention of "the shape of the problems Externalize asks" and calls it mastery.

**[R]** Split the outcome. Track *retention* (same-form delayed retrieval) and *transfer* (novel-form, novel-notation, novel-direction) as separate, non-substitutable outcomes. A design that raises retention while flattening transfer should be classified as a failure, not a partial success.

### 2.4 The brief's treatment of "dark patterns" is empirically generous to them

**Challenge.** The brief instructs against excluding mechanisms merely because casinos use them, which is correct methodology. But it thereby assumes that casino/F2P mechanisms are *known to work* and only their ethics are in question. **[F] For several flagship mechanisms this is not established.** The near-miss effect — arguably the archetypal casino mechanic — has a pre-registered replication record that is at best mixed: Pisklak et al. (2020) tested humans and pigeons and found no significant persistence differences, concluding that the research programme may have been misdirected from its inception. Later conceptual replications (Cherkasova et al., 2024) recovered subjective-motivation effects but found valence effects in the *opposite* direction to the original.

**[R]** Treat commercial adoption as evidence about *what is cheap to build and legally permitted*, not about what works. Where the brief says "the fact that a mechanism has been exploited by casinos is not grounds for exclusion," add the symmetric clause: *nor is it grounds for inclusion, or for assuming the mechanism is potent.*

### 2.5 The brief's phase-0 constraints are stronger than it realises

**Challenge.** The brief states that the current phase prioritises sustained personal use over feature expansion, and separately requests 30–50 mechanisms with implementation concepts. **[F] These are in tension.** Most listed mechanisms cannot be evaluated at N=1, and several (leaderboards, social proof, competition, relatedness) are *structurally impossible* at N=1. A meaningful fraction of the brief's Section 3D list is inapplicable to the product's current phase.

**[R]** Partition the arsenal explicitly by minimum viable population: N=1 testable / small-cohort testable / requires scale. This report does so in §5 and §12.

### 2.6 A missing research area: the specific transfer problem of formal logic

**Challenge.** The brief's Section 3 lists twenty learning mechanisms and nine ed-tech traditions, but does not list the literature on *whether formal-logic training transfers at all*. This is the single most product-relevant body of evidence for Externalize and it is not in scope as written.

**[F] The classic result is discouraging for pure formalism.** Cheng, Holyoak, Nisbett & Oliver (1986) manipulated the type of logic training subjects received and found that training was effective only when abstract principles were coupled with examples of selection problems that made the mapping between abstract rules and concrete instances explicit. Abstract training alone had little effect on reasoning performance. A separate experiment found that brief abstract training on a *pragmatic reasoning schema* (permission, obligation) transferred substantially.

**[F] The implication for Externalize is direct and uncomfortable: a system that teaches symbolic manipulation with high fidelity and no concrete-instance mapping is the exact condition under which the literature predicts near-zero transfer.**

**[R]** Add "transfer of formal reasoning training" as a first-class research area. Add at least one item type per rule that requires mapping between the formal object and a concrete instantiation, and measure it separately.

### 2.7 A missing metric: cost-per-unit-of-retention

**Challenge.** The brief's metric taxonomy (learning / behavioural / experience / proxy) has no efficiency measure. **[F] This matters because several strong mechanisms trade time for retention at poor rates.** Rawson & Dunlosky's optimisation work concludes that the prescriptive schedule is to reach an initial criterion of about three correct recalls and then relearn roughly three times at wide spacing — a specific answer to "how much is enough" that exists precisely because more practice is not freely good.

**[R]** Add *retention per minute of learner time* as a tracked outcome. It is the metric most likely to distinguish "the product is working" from "the product is consuming the learner."

### 2.8 Minor corrections

- **[F] "Overlearning" as listed in §3A is weakly supported relative to its neighbours** and is largely superseded by successive relearning; Rawson, Vaughn & Dunlosky's relearning-override work indicates that benefits of a higher *initial* criterion do not persist across relearning sessions.
- **[F] The brief lists "flow and challenge calibration" without noting that the most-cited quantitative anchor (the 85% rule) was derived from gradient-descent learning algorithms and perceptual-learning models, not from human educational learning.** Wilson et al. (2019) explicitly frame it as a result about a class of learning algorithms, demonstrated on artificial neural networks and biologically-plausible perceptual networks. It is a useful prior; it is not an educational finding.
- **[F] "Zeigarnik/Ovsiankina effects" should be flagged as pre-replication-crisis literature** with limited modern preregistered support; treat as speculative.

---

## 3. Evidence map

### 3.1 Research traditions, ranked by usefulness to Externalize

**Tier 1 — Directly load-bearing.**

| Tradition | Core sources | What it gives Externalize | Main weakness |
|---|---|---|---|
| Spacing / distributed practice | Cepeda et al. 2006; Cepeda et al. 2008; Latimier et al. 2021; Mawson & Kang 2025 | Scheduling policy; the *g* = 0.74 spaced-vs-massed retrieval benefit | Optimal-gap results are from verbal recall; procedural/proof materials under-studied |
| Retrieval practice | Rowland 2014 (*g* = 0.50); Adesope et al. 2017 (*g* = 0.61); Pan & Rickard 2018 (transfer *d* = 0.40) | The core item-interaction design | Transfer decays sharply with practice/test distance |
| Successive relearning | Rawson & Dunlosky 2011; Rawson, Dunlosky & Sciartelli 2013; Rawson et al. 2018; Rawson & Dunlosky 2022 | The strongest single learning protocol; *d* = 1.52–4.19 relearning potency | Nearly all in vocabulary/concept-definition materials, not proof construction |
| Intelligent tutoring systems | VanLehn 2011 (ITS *d* = 0.76 vs no tutoring; human tutoring *d* = 0.79) | Calibration for what a well-built step-level tutor can achieve | Step-based granularity results; substep-based was weaker (*d* ≈ 0.40) |
| Gaming-the-system / measurement integrity | Baker et al. 2004, 2006, 2008, 2010; Aleven & Koedinger help-seeking work | The Goodhart threat model, with detectors | Detectors are noisy; early detectors had poor recall on gaming |

**Tier 2 — Useful, with caveats.**

| Tradition | Core sources | Contribution | Caveat |
|---|---|---|---|
| Self-explanation | Bisra et al. 2018 (*g* = 0.55) | Direct empirical warrant for "externalize every intermediate state" | Effect may shrink inside adaptive systems that already provide the same processing by another route |
| Productive failure | Sinha & Kapur 2021 (*d* = 0.36, 166 comparisons) | Ordering of exploration vs instruction | Scaffolding the exploration phase *hurt* (*g* = −0.08); design fidelity dominates |
| Pretesting / prequestions | Pan & Carpenter 2023; multilevel MA 2025 (*g* = 0.66 targeted, *g* ≈ 0.01 untargeted) | Session-opening design | Benefit is item-specific, not general; risks rich-get-richer |
| Implementation intentions | Gollwitzer & Sheeran 2006 (*d* = 0.65, 94 tests, N > 8,000) | Session-initiation mechanism | Almost all health/goal-behaviour contexts; digital-habit application is inferential |
| Metacognitive monitoring | Rhodes & Tauber 2011 (delayed-JOL relative accuracy *g* = 0.93; memory benefit *g* = 0.08) | Calibration design | Delayed JOLs improve *accuracy* but barely improve *learning* |
| Feedback | Kluger & DeNisi 1996 (*d* = 0.38, ~⅓ negative); Wisniewski et al. 2020 (*d* = 0.48, 435 studies) | Feedback content taxonomy | Heterogeneity is the finding; averages are near-useless for design |
| Interleaving | Brunmair & Richter 2019 (*g* = 0.42 overall; *g* = 0.34 mathematics) | Practice-set composition | A large field experiment found ~0.04 SD on an end-of-year cumulative assessment — i.e. no durable effect |

**Tier 3 — Weak, contested, or non-transferable.**

| Tradition | Why demoted |
|---|---|
| Gamification (points/badges/leaderboards) | Sailer & Homner 2020 finds *g* = 0.49 cognitive / 0.36 motivational / 0.25 behavioural, but motivational and behavioural effects were *unstable* under high-rigour subsplit; later meta-analyses range wildly (*g* = 0.19 to *g* > 0.8), and moderator estimates in some recent syntheses are implausibly large (*d* > 4 for "competitive games"), which is itself a signal of literature quality problems |
| Gambling / near-miss | Pre-registered replication failures on behavioural persistence |
| F2P monetisation mechanics | Almost no disclosed-method evidence; outcome measures are revenue, not behaviour change, and never learning |
| Variable-ratio reinforcement in apps | Human field evidence essentially absent; the citation chain runs to Skinner's operant work, not to human product experiments |
| Social media engagement research | Outcome variable is attention capture; no learning outcomes; population and incentive structure not comparable |

### 3.2 What good evidence exists that is specific to *mobile, adult, self-directed, symbolic* learning

**[F] Almost none.** This is the largest gap in the evidence base and the strongest argument for epistemic humility in every recommendation below.

- The spacing/retrieval corpus is overwhelmingly verbal-material, lab, university-student, short-horizon.
- The ITS corpus is largely K-12 and undergraduate mathematics/physics/programming, instructor-mediated, desktop.
- The mobile-app corpus (Duolingo and similar) has strong *engineering* disclosure and weak *independent* learning evidence. The best-designed independent-ish study located (Smith, Jiang & Peters, in *Language Learning & Technology* 2024) found proficiency gains over three months with controlled time-on-task, and reported that session accuracy rate predicted proficiency improvement — but the population was paid university students in a supported study context, which is close to the opposite of unsupported self-directed adult use.
- Duolingo's own efficacy programme is methodologically transparent but is vendor research; a 2024 Duolingo report on educator perceptions is a *survey of opinions*, not an outcome study, and should carry no evidential weight.
- For symbolic logic specifically: the CMU Open Learning Initiative *Logic & Proofs* course was evaluated (Schunn & Patchan 2009) and the What Works Clearinghouse characterised the finding as indeterminate on academic achievement based on one outcome and 276 students. The stronger OLI accelerated-learning results are from the *Statistics* course, where hybrid-mode students covered a semester's material in roughly half the time with equal or better outcomes. **[A]** Transferring that to logic is an assumption, not a finding.

### 3.3 Replication and quality warnings applied throughout

- **Behavioural-economics mechanisms from 2005–2015** (goal gradient, endowed progress, fresh start, Zeigarnik, near miss) predate general preregistration norms in their fields. Several have single-study foundations that are heavily cited and lightly replicated.
- **Gamification meta-analyses are heterogeneous to the point of incoherence.** The spread from *g* = 0.19 to *g* = 0.82 across syntheses of ostensibly the same construct indicates the construct is not one thing.
- **Novelty effects are real and measurable.** Rodrigues et al. (2022), a 14-week quasi-experiment with N = 756 CS students, found gamification's effect began decreasing after four weeks, with the decline lasting two to six weeks before shifting to an uptrend between six and ten weeks — a U-shape, not a monotonic decay. Any Externalize experiment shorter than ~10 weeks may measure the wrong part of the curve.

---

## 4. Mechanism Arsenal

**Format.** Each entry: provenance | target | evidence quality | assessment, followed by mechanism, magnitude/horizon, external validity and counterevidence, Goodhart risk, ethical risk, Externalize application, backfire mode, smallest test, and the metric triple (primary learning / secondary engagement / guardrail).

**Assessment vocabulary:** Strong candidate · Promising · Context-dependent · Speculative · Effective but dangerous · Probably counterproductive · Insufficient evidence.

**Population applicability tag:** `N=1` (testable in the validation phase) · `cohort` (needs tens of learners) · `scale` (needs hundreds+).

---

### Family A — Scheduling and memory

#### M-01 · Spaced retrieval practice
*Provenance:* cognitive psychology | *Target:* retention, transfer | *Evidence:* strong (multiple meta-analyses) | **Strong candidate** · `N=1`

- **Mechanism.** Retrieval reconstructs a memory trace and strengthens it; distributing reconstructions across separated occasions produces study-phase retrieval and contextual variability that further strengthen and generalise the trace.
- **Magnitude / horizon.** Spaced vs massed retrieval *g* = 0.74 (Latimier et al. 2021, 29 studies). Distributed vs massed practice in applied classroom settings *d* = 0.54, 95% CI [0.31, 0.77] (Mawson & Kang 2025, 31 effect sizes, N > 3,000). Benefits grow with retention interval; the optimal inter-study interval increases as the target retention interval increases (Cepeda et al. 2006).
- **External validity / counterevidence.** Mathematics-specific spacing effects are smaller (*g* = 0.26). Ebersbach & Barzagar Nazari found no robust distributed-practice effect on short- and long-term retention of mathematical *procedures* — directly relevant, since proof construction is procedural. Voluntary uptake is a serious problem: in one of their experiments only 41% of students did the recommended voluntary practice at all, and *fewer* did so in the distributed condition.
- **Goodhart risk.** Low for the mechanism, high for its *scheduler*: a scheduler that maximises predicted recall probability will systematically avoid items the learner is likely to fail, which is exactly backwards.
- **Ethical risk.** Minimal. Scheduling that serves the learner's stated goal.
- **Externalize application.** Item-level scheduling over inference rules, equivalence patterns, and proof tactics, with the interval driven by a retrievability estimate rather than a fixed ladder. Schedule the retrieval attempt *just before* estimated failure, not at peak strength.
- **Backfire.** Curriculum incoherence (a session that is a bag of unrelated fragments); learner cannot perceive progress; abandonment.
- **Smallest test.** Within-subject: split the item pool, run one half on a spaced schedule and one half massed within-session, test both at 14 and 28 days. Works at N=1 with enough items.
- **Metrics.** Primary: 28-day unaided retrieval accuracy by pool. Secondary: sessions containing ≥1 due-item retrieval. Guardrail: proportion of scheduled retrievals actually attempted (voluntary-uptake failure is the known killer).

#### M-02 · Successive relearning (relearn-to-criterion across days)
*Provenance:* cognitive psychology | *Target:* retention | *Evidence:* strong, though narrow materials | **Strong candidate** · `N=1`

- **Mechanism.** Practise each item to a correct-recall criterion, then re-establish that criterion on later, widely spaced days. Combines spacing and retrieval at their individually optimal settings.
- **Magnitude / horizon.** Relearning potency over single-session learning *d* = 1.52–4.19 (Rawson et al. 2018). Classroom deployment improved course-exam performance and retention at 3 and 24 days (Rawson, Dunlosky & Sciartelli 2013), replicated in biopsychology and introductory psychology.
- **External validity / counterevidence.** Materials are almost entirely key-term/concept-definition pairs. **[O] Whether "relearn to criterion" is even well-defined for a proof tactic is unresolved** — a tactic is applied, not recalled. Also: initial-criterion advantages do not survive relearning (relearning-override), so raising the first-session bar buys little.
- **Goodhart risk.** Moderate. "Criterion reached" becomes the target; a learner who can hit criterion by pattern-matching the item surface will do so.
- **Ethical risk.** Minimal, except that it is demanding and can feel punitive if framed as failure.
- **Externalize application.** Define criterion at the level of *rule application in a novel context*, not item repetition: an inference rule counts as relearned when applied correctly in a proof the learner has not seen, on a later day. Prescriptive default from Rawson & Dunlosky: ~3 correct recalls initially, ~3 widely spaced relearning episodes.
- **Backfire.** Criterion inflation makes the product feel like an endless treadmill; learner perceives no completion.
- **Smallest test.** Compare items relearned to criterion on 3 separate days against items studied 3× in one day, matched for total retrievals. Delayed test at 30 days.
- **Metrics.** Primary: 30-day novel-context application rate. Secondary: relearning episodes completed. Guardrail: total learner minutes per item reaching criterion (efficiency).

#### M-03 · Expanding vs uniform spacing schedules
*Provenance:* cognitive psychology | *Target:* retention | *Evidence:* moderate, null-leaning | **Context-dependent** · `cohort`

- **Mechanism.** Intervals lengthen as strength grows, tracking the forgetting curve.
- **Magnitude / horizon.** Latimier et al. (2021) examined this directly as their second subset (54 effect sizes) and did *not* find expanding schedules reliably superior to uniform ones. **[F] The near-universal SRS assumption that expansion is essential is not well supported.**
- **External validity.** Lab, verbal materials, short horizons.
- **Goodhart risk.** Low.
- **Ethical risk.** None.
- **Externalize application.** Do not over-engineer expansion. A uniform or lightly-expanding schedule is defensible and much easier to reason about and audit.
- **Backfire.** Aggressive expansion produces long silent gaps in which the learner forgets the *product*, not just the item.
- **Smallest test.** Not worth an early experiment; adopt uniform-ish default and revisit.
- **Metrics.** Primary: retention at fixed delay. Secondary: n/a. Guardrail: maximum gap between any two sessions.

#### M-04 · Learned retrievability models (half-life regression / knowledge tracing)
*Provenance:* ed-tech ML | *Target:* retention, scheduling precision | *Evidence:* moderate (engineering-strong, learning-weak) | **Promising** · `scale`

- **Mechanism.** Estimate per-item, per-learner memory half-life from interaction history and schedule at a target recall probability.
- **Magnitude / horizon.** Settles & Meeder (2016) reported large reductions in recall-prediction error over Leitner and Pimsleur baselines on 13M Duolingo traces, and an operational user study in which the model improved daily student engagement by 12%. **[F] Note what is measured: prediction accuracy and engagement — not delayed retention against a control.**
- **External validity.** Vocabulary items with a clean correct/incorrect signal. Proof steps are compositional and partially correct; the modelling problem is materially harder.
- **Goodhart risk.** **High and structural.** Optimising a scheduler against *predicted recall* rewards showing easy items. Optimising against *observed accuracy* rewards the same. The scheduler must be optimised against delayed unaided performance on *held-out* items, or it will drift toward comfort.
- **Ethical risk.** Low, but opacity is a real cost: an unexplainable schedule erodes learner trust and agency.
- **Externalize application.** Defer. A simple, auditable, explainable scheduler beats an unexplainable learned one at this stage, and the data volume for fitting does not exist at N=1.
- **Backfire.** Model fits the learner's *gaming* behaviour and confidently schedules around it.
- **Smallest test.** Requires hundreds of learners. Offline evaluation on logged data is possible earlier but proves nothing about learning.
- **Metrics.** Primary: held-out delayed retrieval accuracy. Secondary: scheduling precision (predicted vs actual recall). Guardrail: item difficulty distribution over time (must not drift downward).

#### M-05 · Interleaved practice
*Provenance:* cognitive psychology | *Target:* discrimination, transfer | *Evidence:* moderate, with a damaging field null | **Context-dependent** · `cohort`

- **Mechanism.** Mixing item types forces discrimination between superficially similar categories and prevents the learner from inferring the required operation from block position.
- **Magnitude / horizon.** Overall *g* = 0.42 (Brunmair & Richter 2019, 59 studies); mathematics *g* = 0.34; strongest for visually similar categories such as paintings (*g* = 0.67).
- **External validity / counterevidence.** **[F] The most important counterevidence is a large field experiment reported in an EdWorkingPaper analysis of a full-year interleaving intervention: an effect on immediate assessments consistent with the meta-analytic estimate, but an estimated effect on the end-of-year cumulative assessment of about 0.04 SD, indistinguishable from zero.** Also: interleaving helped the bottom of the distribution and showed no benefit — possibly harm — at the top.
- **Goodhart risk.** Low.
- **Ethical risk.** None, beyond the general "desirable difficulty is unpleasant" issue.
- **Externalize application.** High relevance: the central error in propositional logic is misidentifying *which rule applies*. Blocked practice on modus tollens teaches "apply modus tollens"; interleaved practice teaches "recognise a modus tollens situation." **[R] Interleave rule-selection items specifically; do not interleave during initial rule acquisition.**
- **Backfire.** Interleaving too early raises cognitive load past the point of learning anything; expertise-reversal in miniature.
- **Smallest test.** Two matched rule-clusters, one taught blocked and one interleaved after initial acquisition; test rule-selection accuracy on novel proofs at 21 days.
- **Metrics.** Primary: rule-selection accuracy on unseen proof forms. Secondary: items per session. Guardrail: within-session error rate (must not exceed the frustration threshold).

#### M-06 · Contextual / representational variability
*Provenance:* cognitive psychology | *Target:* transfer | *Evidence:* moderate | **Promising** · `N=1`

- **Mechanism.** Varying surface features across encoding episodes reduces dependence on any single retrieval cue and broadens the conditions under which knowledge is accessible.
- **Magnitude / horizon.** Not separately meta-analysed at the level needed; supported indirectly via Pan & Rickard's finding that transfer is heavily moderated by response congruency, and by the pragmatic-schemas result that abstract rules transfer only when mapped to varied concrete instances.
- **External validity.** Reasonable; the mechanism is generic.
- **Goodhart risk.** Low. Notably, this is one of the few mechanisms that *directly attacks* a Goodhart failure (interface-pattern memorisation).
- **Ethical risk.** None.
- **Externalize application.** **[R] High priority.** Present the same inference rule across: symbolic form, natural-language argument, truth-table verification, and error-detection ("is this step valid?"). Vary variable letters, operator ordering, and proof direction. The doctrine "externalize every intermediate state" should not imply "always in the same notation."
- **Backfire.** Variability without a common thread reads as inconsistency and increases perceived difficulty without the discrimination benefit.
- **Smallest test.** Single-variant vs multi-variant training of two matched rule sets; delayed test in a *fifth*, untrained representation.
- **Metrics.** Primary: accuracy in an untrained representation. Secondary: none. Guardrail: acquisition-phase error rate.

#### M-07 · Desirable difficulty (as a design principle)
*Provenance:* Bjork | *Target:* retention, transfer | *Evidence:* strong as a principle, weak as an instruction | **Context-dependent** · `N=1`

- **Mechanism.** Conditions that slow apparent acquisition and increase errors during practice often improve long-term retention and transfer.
- **Magnitude / horizon.** Not a single effect; an umbrella over M-01/02/05/06/13. Its own predictive content is limited.
- **Counterevidence.** **[F] The principle is unfalsifiable as stated** — any difficulty that helps is "desirable," any that harms is "undesirable," and the distinction is drawn post hoc. It is a useful heuristic and a poor decision rule.
- **Goodhart risk.** Inverted risk: teams use it to rationalise unpleasantness.
- **Ethical risk.** Moderate — it is a ready-made justification for making a product hostile.
- **Externalize application.** Use only the *specific* difficulties with their own evidence. Never justify a design choice by appeal to desirable difficulty alone.
- **Backfire.** Product becomes unpleasant; voluntary use collapses; the strongest learning schedule in the world produces zero learning because no one runs it.
- **Smallest test.** n/a (not a mechanism).
- **Metrics.** Guardrail specifically: voluntary return rate must be monitored whenever any difficulty is increased.

#### M-08 · Target-difficulty calibration (~85% success)
*Provenance:* computational learning theory | *Target:* learning rate | *Evidence:* weak for humans | **Speculative** · `cohort`

- **Mechanism.** Learning rate is maximised at intermediate difficulty; for a broad class of gradient-descent learners the optimum sits near a 15.87% error rate.
- **Magnitude / horizon.** Wilson et al. (2019) derive the result analytically and demonstrate it in artificial neural networks and biologically-plausible perceptual-learning networks. They also map it onto flow theory, with boredom at high accuracy/low learning and anxiety at low accuracy/low learning.
- **External validity.** **[F] Weak. This is not a human educational result.** It concerns binary classification under gradient descent. Its application to proof construction — a compositional, multi-step, non-binary task — is an extrapolation across several category boundaries.
- **Goodhart risk.** **High.** "Maintain 85% success" is a *success-rate target*, and the cheapest way for a system to hit a success-rate target is to serve easier items. This is precisely the corruption the brief warns about.
- **Ethical risk.** Low.
- **Externalize application.** Use as a loose sanity band (do not let sustained accuracy sit above ~95% or below ~50%), never as an optimisation objective.
- **Backfire.** The scheduler quietly converges on trivial items and reports excellent calibration.
- **Smallest test.** Manipulate difficulty target across two item pools; measure delayed transfer, not in-session accuracy.
- **Metrics.** Primary: delayed transfer. Secondary: in-session accuracy (diagnostic only). Guardrail: mean item difficulty over time.

#### M-09 · Mastery learning / criterion gating
*Provenance:* Bloom, Keller; ITS | *Target:* retention, curriculum integrity | *Evidence:* moderate | **Promising** · `N=1`

- **Mechanism.** Advance only on demonstrated criterion; time varies, attainment is held constant.
- **Magnitude / horizon.** Embedded in the ITS results (VanLehn 2011: step-based tutoring *d* = 0.76 vs no tutoring). Steenbergen-Hu & Cooper's K-12 ITS meta-analysis found effects emerged with a *year or more* of use rather than short deployments.
- **External validity.** Good; this is standard ed-tech practice with a real evidence base.
- **Goodhart risk.** **High and already realised at Externalize.** The brief records a prior evaluation-integrity incident in which reasonable UX allowed strategic selection of easier evidence. Criterion gating creates exactly this incentive: the learner's interest is in producing *evidence that satisfies the criterion*, which is not the same as the capability.
- **Ethical risk.** Low, but gating can feel arbitrary and punitive.
- **Externalize application.** Gate on *system-selected* evidence, never learner-selected. Require that at least one criterion-satisfying attempt be on an item the learner did not choose and has not seen. Keep exploratory activity strictly outside the evidence channel, as the brief already specifies.
- **Backfire.** Learner stalls at a gate, cannot progress, and quits. Mastery gates are the most common abandonment point in ed-tech.
- **Smallest test.** Instrument evidence provenance (chosen vs assigned) and compare delayed performance on capabilities certified by each.
- **Metrics.** Primary: delayed unaided accuracy on gated capabilities. Secondary: gate pass rate. Guardrail: fraction of certifying evidence that was learner-selected (target: 0).

#### M-10 · Forgetting-aware re-surfacing ("catch it before it dies")
*Provenance:* memory-strength modelling | *Target:* retention efficiency | *Evidence:* moderate | **Strong candidate** · `N=1`

- **Mechanism.** Retrieval difficulty at the moment of practice determines the strengthening increment; retrieval that is effortful but successful strengthens most.
- **Magnitude / horizon.** Implied by the spacing-function literature (Cepeda et al. 2008: optimal gap grows with retention interval) and by the retrieval-effort account.
- **External validity.** Well-supported in verbal materials; **[O] unknown for compositional proof skills.**
- **Goodhart risk.** Moderate — see M-04. Any retrievability estimate can be gamed by a scheduler optimising the wrong objective.
- **Ethical risk.** None.
- **Externalize application.** This is the brief's own example ("schedule a retrieval challenge shortly before predicted forgetting") and it is the correct one. Implement as an explicit target-recall-probability parameter (e.g. schedule when estimated recall ≈ 0.85–0.9), stored and auditable per item.
- **Backfire.** Under-estimating strength floods the learner with review and crowds out new material; over-estimating loses items entirely.
- **Smallest test.** Compare target recall probability 0.9 vs 0.7 on matched item pools; 30-day delayed test.
- **Metrics.** Primary: 30-day retention per review minute. Secondary: reviews per session. Guardrail: new-material throughput (must not collapse to pure review).

---

### Family B — Item and interaction design

#### M-11 · Generation / externalised intermediate steps
*Provenance:* cognitive psychology; Externalize doctrine | *Target:* retention, transfer, measurement validity | *Evidence:* strong | **Strong candidate** · `N=1`

- **Mechanism.** Producing rather than recognising an answer engages retrieval and elaborative processes; requiring intermediate states additionally makes the learner's reasoning observable.
- **Magnitude / horizon.** Retrieval-practice effects (*g* = 0.50–0.61) are the closest quantitative anchor. Self-explanation prompts add *g* = 0.55 (Bisra et al. 2018, 69 effect sizes, ~5,900 learners).
- **External validity.** Good. Bisra et al. found benefits across most subject areas and for both conceptual and procedural knowledge.
- **Goodhart risk.** **Low, and this is the mechanism's underrated superpower.** Externalised intermediate states are what make rapid guessing and hint-farming *detectable*. A system that only sees final answers cannot distinguish mastery from luck; one that sees the derivation can.
- **Ethical risk.** None.
- **Externalize application.** This is already the product's doctrine. The research finding to add: **[R] the evidence is strongest when the externalised step carries *explanatory* content, not merely procedural content.** Requiring "which rule, applied to which lines" is good; additionally requiring "why this rule is licensed here" is better-evidenced. Pan & Rickard found elaborated retrieval practice added *d* = 0.23 to transfer.
- **Backfire.** Externalisation cost per item is high; throughput falls; the learner does fewer, better items and net retention may not improve. Bisra et al. themselves note the open question of whether self-explaining beats alternative uses of the same time.
- **Smallest test.** Same proofs with and without a mandatory one-line justification per step; measure delayed transfer *and* items completed per unit time.
- **Metrics.** Primary: delayed novel-proof completion. Secondary: steps externalised per session. Guardrail: retention per learner-minute (the efficiency check that decides whether the cost is worth it).

#### M-12 · Self-explanation prompts (distinct from step externalisation)
*Provenance:* Chi; ITS | *Target:* transfer | *Evidence:* strong | **Strong candidate** · `N=1`

- **Mechanism.** Prompts induce inference generation about causal/conceptual relations, filling gaps the learner would otherwise skip.
- **Magnitude / horizon.** *g* = 0.55 overall (Bisra et al. 2018).
- **External validity / counterevidence.** **[F] Important caveat the meta-analysis itself raises: prompts may deliver less in adaptive environments that already induce the same processing by a different route.** Externalize is such an environment. The marginal effect may be smaller than 0.55.
- **Goodhart risk.** Moderate. Free-text self-explanations are cheap to fake ("because the rule applies"). If self-explanation quality feeds mastery evidence, it will be gamed.
- **Ethical risk.** None.
- **Externalize application.** Prompt at *error* and at *rule-selection* moments, not uniformly. Constrain the response format (select the licensing condition from a menu of plausible-but-wrong conditions) so the response is machine-checkable and not fakeable by generic text.
- **Backfire.** Prompt fatigue; learners produce ritual non-answers; you now have noise in the evidence channel.
- **Smallest test.** Prompt-on-error vs no-prompt, matched items, delayed transfer test.
- **Metrics.** Primary: delayed transfer. Secondary: prompt completion rate. Guardrail: proportion of self-explanations that are degenerate/templated.

#### M-13 · Pretesting / prequestions
*Provenance:* cognitive psychology | *Target:* encoding of subsequent instruction | *Evidence:* strong but narrow | **Promising** · `N=1`

- **Mechanism.** An unsuccessful retrieval attempt before instruction activates a relevant mental model and directs attention during subsequent study.
- **Magnitude / horizon.** A 2025 multilevel meta-analysis found prequestions facilitated learning of the specifically prequestioned information at g = 0.66, with no evidence of general benefit for other, non-prequestioned information present in the same activity (g ≈ 0.01).
- **External validity / counterevidence.** **[F] The zero general-benefit result is the key finding and is usually omitted from popular treatments.** Prequestioning is a targeting tool, not a general primer. The same analysis found answering prequestions *correctly* moderated the benefit, raising a rich-get-richer concern.
- **Goodhart risk.** Low, if pretest responses are excluded from mastery evidence — which they must be.
- **Ethical risk.** Low; can feel like being set up to fail.
- **Externalize application.** Open a session on a new rule with 1–2 prequestions targeting exactly the distinctions the lesson will make. Explicitly mark these as non-evidential.
- **Backfire.** Repeated failure at session open is demotivating; pretesting adds time cost for item-specific benefit only.
- **Smallest test.** Prequestion half the new rules; test the prequestioned facts and the non-prequestioned facts separately at delay. (The dissociation is the whole point.)
- **Metrics.** Primary: delayed accuracy on prequestioned vs non-prequestioned content. Secondary: session-open completion. Guardrail: self-reported frustration at session open.

#### M-14 · Productive failure / explore-before-instruct
*Provenance:* Kapur | *Target:* conceptual knowledge, transfer | *Evidence:* moderate-strong | **Promising** · `cohort`

- **Mechanism.** Attempting a problem before instruction activates and differentiates prior knowledge, priming the learner to notice the structure the subsequent instruction supplies.
- **Magnitude / horizon.** *d* = 0.36, 95% CI [0.20, 0.51], from 166 experimental comparisons and >12,000 participants (Sinha & Kapur 2021), for conceptual understanding and transfer, without harming procedural knowledge.
- **External validity / counterevidence.** **[F] Two crucial moderators.** First, effects were better for secondary-and-above learners — good for Externalize's adult audience. Second, and counterintuitively, **scaffolding the exploration phase did not help**: Sinha & Kapur report *g* = −0.08 for scaffolded versus unscaffolded PS-I. The failure has to be real. Also: evidence is concentrated in STEM content; domain-general skills are under-evidenced.
- **Goodhart risk.** Moderate. If exploration attempts count as activity, learners will farm them. The brief already separates explore from graded evidence — keep that invariant.
- **Ethical risk.** Low; deliberately inducing failure requires honest framing.
- **Externalize application.** Before teaching a rule, present a proof that *needs* that rule and let the learner attempt it with the rules they have. The impasse is the point. Then instruct, explicitly connecting the failed attempts to the new rule.
- **Backfire.** For a self-directed adult with no external commitment, an engineered failure with no instructor to consolidate it is a strong quit trigger. **The consolidation phase is not optional and is where most implementations fail.**
- **Smallest test.** Two matched rules, one explore-first and one instruct-first; delayed conceptual and transfer items at 21 days.
- **Metrics.** Primary: delayed transfer to novel proof forms. Secondary: exploration attempts per new rule. Guardrail: session-abandonment rate during exploration phases.

#### M-15 · Worked examples with fading
*Provenance:* cognitive load theory | *Target:* acquisition efficiency | *Evidence:* strong for novices | **Context-dependent** · `N=1`

- **Mechanism.** Studying complete solutions reduces extraneous load during schema acquisition; progressively removing steps transfers control to the learner.
- **Magnitude / horizon.** Long-established worked-example effect; magnitude declines and reverses with expertise (expertise reversal).
- **External validity / counterevidence.** The reversal is the finding that matters: what helps a novice harms an expert. This makes it a *scheduled* mechanism, not a global one.
- **Goodhart risk.** **High.** A faded worked example is one hint away from being an answer. This is the hint-abuse surface.
- **Ethical risk.** None.
- **Externalize application.** Fade by *step position* (remove the last step first, then the last two) rather than by learner request. Learner-triggered fading collapses into hint abuse.
- **Backfire.** Illusion of fluency: studying worked examples feels like learning far more than it produces, and is a classic source of overconfidence.
- **Smallest test.** Faded-example acquisition vs problem-solving acquisition for two matched rules; delayed unaided test.
- **Metrics.** Primary: delayed unaided proof completion. Secondary: examples studied. Guardrail: gap between predicted and actual delayed performance (fluency illusion detector).

#### M-16 · Feedback design (content over timing)
*Provenance:* educational psychology | *Target:* error correction, calibration | *Evidence:* strong on heterogeneity, weak on any single prescription | **Context-dependent** · `N=1`

- **Mechanism.** Feedback supplies information that lets a learner detect and correct a discrepancy between current and target state.
- **Magnitude / horizon.** *d* = 0.48 across 435 studies, k = 994, N > 61,000 (Wisniewski, Zierer & Hattie 2020) — a downward revision from the earlier *Visible Learning* estimates of 0.70–0.79. Kluger & DeNisi's earlier review found *d* = 0.38 with about a third of effects *negative*.
- **External validity / counterevidence.** **[F] The negative third is the headline for product design.** Wisniewski et al. found impact substantially moderated by information content, and higher for cognitive/motor outcomes than for motivational/behavioural ones. Low-information feedback — bare correctness, rewards, praise — is where the harm concentrates.
- **Goodhart risk.** High: immediate correctness feedback on every step converts proof construction into hill-climbing. The learner optimises "get the green tick" step-by-step without ever holding the proof structure in mind.
- **Ethical risk.** Low.
- **Externalize application.** **[R] Withhold step-level correctness during a graded proof attempt; deliver structured, information-rich feedback at proof completion.** Bare "✗" on a step teaches the learner to guess-and-check the interface. This is a case where *less frequent, richer* feedback is better-evidenced than *immediate, thin* feedback.
- **Backfire.** Delayed feedback on a long proof means a learner reinforces a wrong path for many steps; frustration rises sharply.
- **Smallest test.** Step-immediate vs proof-completion feedback on matched proofs; measure delayed unaided completion and the number of invalid steps attempted per proof.
- **Metrics.** Primary: delayed unaided completion. Secondary: proofs completed. Guardrail: invalid-step attempt rate (a proxy for guess-and-check behaviour).

#### M-17 · Error-focused / failure-driven scaffolding
*Provenance:* ITS; productive failure | *Target:* error-type reduction | *Evidence:* moderate | **Promising** · `N=1`

- **Mechanism.** Explicitly directing attention to *what the failed attempt got wrong* rather than to the correct method.
- **Magnitude / horizon.** Sinha & Kapur's replication-and-extension work found explicit failure-driven scaffolding outperformed both unscaffolded and success-driven scaffolded exploration, against a benchmark where ordinary scaffolding gave *g* = −0.08.
- **External validity.** Undergraduate STEM; reasonable fit.
- **Goodhart risk.** Low.
- **Ethical risk.** Moderate: repeatedly foregrounding errors requires careful framing to avoid a punitive tone.
- **Externalize application.** On a failed proof, do not show the model solution first. Show *the specific licensing condition that the learner's step violated*, then let them retry. Maintain a per-learner error-type taxonomy (affirming the consequent, scope error, illicit quantifier move) and target subsequent items at the learner's top error types.
- **Backfire.** Error-focus becomes shaming; learner avoids hard items to avoid the error report.
- **Smallest test.** Error-focused vs solution-focused remediation; measure recurrence rate of the same error type at 14 days.
- **Metrics.** Primary: error-type recurrence rate. Secondary: retry rate after failure. Guardrail: post-failure session-abandonment rate.

#### M-18 · Confidence-weighted responding and calibration feedback
*Provenance:* metamemory | *Target:* calibration | *Evidence:* moderate; complicated | **Context-dependent** · `N=1`

- **Mechanism.** Eliciting a confidence judgement before feedback, then showing the learner their confidence-vs-correctness curve, trains monitoring accuracy.
- **Magnitude / horizon.** Delaying judgements of learning substantially improves *relative accuracy* — Rhodes & Tauber's meta-analysis reports *g* = 0.93 across 112 effect sizes — but the same analysis found only a modest memory benefit from delayed JOLs (*g* = 0.08). Calibration-training meta-analyses find feedback can improve calibration, though inconsistently across contexts.
- **External validity / counterevidence.** **[F] The critical negative result: with complex, educationally-realistic materials, no existing research has found that providing metacognitive judgements *directly improves learning*.** Calibration is worth pursuing as an outcome in its own right, not as a route to retention.
- **Goodhart risk.** **High and specific — this is the brief's own "manipulating confidence reports" concern.** If calibration is scored, the dominant strategy is to report low confidence on everything (guaranteeing "well-calibrated humility") or to report confidence only after mentally committing to an answer.
- **Ethical risk.** Low.
- **Externalize application.** Elicit confidence *before* the answer is submitted and *before* any feedback, on a coarse 3-point scale. Score calibration with a proper scoring rule (Brier) so that uniform low confidence is penalised. Report calibration to the learner as information, never as a gate.
- **Backfire.** Adds friction to every item for a benefit that is diagnostic rather than learning-productive.
- **Smallest test.** Confidence elicitation on half of items; compare Brier score trajectory and check for degenerate response strategies.
- **Metrics.** Primary: Brier score / calibration curve slope. Secondary: elicitation completion rate. Guardrail: variance of reported confidence (collapse toward a single value = gaming).

---

### Family C — Initiation, habit and return

#### M-19 · Implementation intentions (if–then plans)
*Provenance:* Gollwitzer | *Target:* session initiation | *Evidence:* strong | **Strong candidate** · `N=1`

- **Mechanism.** Linking a specified situational cue to a specified action delegates initiation from deliberate intention to cue-triggered automaticity, closing the intention–behaviour gap.
- **Magnitude / horizon.** *d* = 0.65 on goal attainment across 94 independent tests, with more than 8,000 participants (Gollwitzer & Sheeran 2006). Effects hold across initiation, shielding ongoing pursuit, and disengagement from failing courses of action.
- **External validity / counterevidence.** Predominantly health, academic and goal-behaviour contexts; **[A] application to opening a specific app is an inference, though a fairly short one.** Effect depends on the strength of the superordinate goal — it amplifies existing motivation rather than creating it, so it will do little for a learner who does not actually want to learn logic.
- **Goodhart risk.** **Essentially zero.** This is a rare mechanism with no gameable surface: the learner is planning their own behaviour with no reward attached.
- **Ethical risk.** **Essentially zero.** It is the learner's own plan, in the learner's own words.
- **Externalize application.** At onboarding and after any lapse, elicit a single if–then plan tied to a stable existing routine, in the learner's own text: "If it is [cue], then I will do one Externalize retrieval set." Store it, surface it verbatim in the reminder rather than sending generic copy.
- **Backfire.** Plan is made and broken; a visible broken plan can produce guilt and avoidance. Keep the plan revisable and unshamed.
- **Smallest test.** ABAB within-subject: weeks with an active if–then plan vs weeks without; measure session-initiation rate. **This is one of the few mechanisms genuinely testable at N=1.**
- **Metrics.** Primary: retrievals-at-scheduled-interval rate. Secondary: voluntary session-initiation rate. Guardrail: self-reported guilt/pressure.

#### M-20 · Cue–context stability (habit formation proper)
*Provenance:* habit research | *Target:* return | *Evidence:* moderate | **Promising** · `N=1`

- **Mechanism.** Repetition of a behaviour in a stable context builds automaticity; the cue eventually triggers the behaviour with minimal deliberation.
- **Magnitude / horizon.** A meta-analysis of physical-activity habit-formation interventions found SMD 0.40 at follow-up ≤12 weeks but only SMD 0.17 beyond 12 weeks, with action planning, habit formation, self-monitoring and prompts/cues as the most-used techniques. **[F] Habit-formation effects decay with follow-up duration, which is close to the opposite of what habit theory promises.**
- **External validity.** Physical activity; **[O] the analogy to a 5-minute cognitive task on a phone is untested and could go either way** (lower effort barrier, but also lower context specificity — a phone is everywhere, which undermines cue distinctiveness).
- **Goodhart risk.** Low.
- **Ethical risk.** Low.
- **Externalize application.** Encourage a *place-and-time* anchor rather than a time-only anchor, since phone-based behaviours have weak contextual cues by default. A session ritual (same opening screen, same first action type) supplies an internal context cue where the external one is absent.
- **Backfire.** Rigid ritual becomes a barrier when circumstances change; the learner concludes they "can't do it properly today" and does nothing.
- **Smallest test.** Fixed-context vs opportunistic scheduling over 8 weeks; measure initiation latency after cue.
- **Metrics.** Primary: retrievals at scheduled intervals. Secondary: initiation rate; self-reported automaticity (SRBAI). Guardrail: sessions initiated when the learner reports not wanting to (compulsion signal).

#### M-21 · Days-based activity incentive ("counting days")
*Provenance:* education research | *Target:* spacing behaviour → retention | *Evidence:* strong (direct RCT) | **Strong candidate** · `cohort` (approximable at `N=1`)

- **Mechanism.** Rewarding *distinct days on which practice occurred* rather than *quantity of practice* makes distributed practice the reward-maximising strategy, aligning the incentive with the strongest learning mechanism.
- **Magnitude / horizon.** YeckehZaare & Resnick (2025), two RCTs (143 students within-course; 71 instructors between-course). The counting-days group earned higher exam scores, mediated by spacing practice over more days, and the benefit was concentrated among lower-GPA students, reducing the correlation between prior GPA and course exam scores. In the between-instructor arm, both days practised and questions practised were higher under counting-days.
- **External validity / counterevidence.** University course with graded credit — an extrinsic incentive Externalize does not have. **[A] Whether a non-graded, purely informational "days" counter produces the same behaviour is an assumption.** Sample sizes are modest.
- **Goodhart risk.** **Moderate, and much lower than volume-based alternatives — this is the mechanism's whole point.** The residual exploit is "answer one trivial question per day." Closing it requires the day to count only when a *scheduled retrieval on a due item* is completed. The brief anticipates this exactly.
- **Ethical risk.** Low. It becomes an ethical problem only when the day counter is coupled to loss framing (see M-22).
- **Externalize application.** **[R] This is the single highest-value implementable finding in the report.** Replace any XP/volume metric with a days-with-qualifying-retrieval counter. A qualifying day requires ≥N due-item retrievals attempted with externalised steps. Volume beyond the qualifying threshold earns nothing.
- **Backfire.** The threshold becomes a ceiling: learners do exactly N and stop. (This is arguably fine — it is the spacing schedule doing its job — but it will look like reduced engagement.)
- **Smallest test.** Alternate 3-week blocks: days-counter visible vs volume-counter visible; measure distinct practice days, and delayed retention on the item pool practised in each block.
- **Metrics.** Primary: delayed retention on items practised per block. Secondary: distinct qualifying days. Guardrail: median retrievals per day (detect threshold-hugging *and* detect binge-cramming).

#### M-22 · Streaks with loss framing
*Provenance:* consumer apps | *Target:* return | *Evidence:* weak-to-moderate, almost entirely industry | **Effective but dangerous** · `scale`

- **Mechanism.** An accumulating counter that resets on a missed day; framed as something owned and losable, engaging loss aversion and sunk-cost reasoning.
- **Magnitude / horizon.** **[F] There is essentially no peer-reviewed causal evidence isolating streak-with-reset against a matched non-reset day counter.** What exists is industry reporting **[industry]**: Duolingo has publicly described running hundreds of streak experiments, reports that switching from XP-based to lesson-based streaks increased DAU, and that adding an eight-word explanation of the mechanic produced a measurable retention gain. Observational claims that high-streak users retain far better are confounded by selection — people who were going to persist form long streaks.
- **External validity / counterevidence.** Loss framing itself has a mixed causal record. Fryer, Levitt, List & Sadoff's teacher-incentive experiment is the strongest education-context test: pooling two waves, loss-framed incentives improved maths achievement by about 0.124 SD, with large effects in the first wave and no effects in the second; gain-framed incentives were smaller and not statistically significant at about 0.051 SD. **[F] A loss-framing effect that vanishes in wave 2 of the same experiment is a warning, not a foundation.** The broader framing literature is split roughly down the middle.
- **Goodhart risk.** **Severe and well-understood.** A reset-on-miss counter creates maximal incentive for minimum-viable activity. It is the canonical example of the brief's "preserving a streak with meaningless activity."
- **Ethical risk.** **High.** The mechanism works by manufacturing a loss that did not previously exist, then charging effort to avoid it. Loss aversion is engaged against an artefact of the product's own design. It also produces documented anxiety and, on lapse, abandonment.
- **Externalize application.** **[R] Do not implement reset-on-miss.** Implement M-21 (cumulative days, never decreasing) plus M-23 (lapse recovery). You capture the spacing benefit — which is where the learning is — without manufacturing the loss.
- **Backfire.** The brief's own concern, and it is the empirically most likely outcome: an impressive 14-day streak followed by permanent abandonment on day 15. Streak-loss abandonment is the dominant failure mode reported qualitatively across the language-learning literature.
- **Smallest test.** Cannot be responsibly tested at N=1; a reset event is a single irreversible observation. At cohort scale: reset vs no-reset day counter, primary outcome = *return rate conditional on a missed day*.
- **Metrics.** Primary: 30-day retention. Secondary: consecutive-day rate. Guardrail: **return rate after first lapse** — the single most important guardrail in this entire report.

#### M-23 · Lapse recovery / return-after-miss micro-reward
*Provenance:* behavioural science (megastudy) | *Target:* return after lapse | *Evidence:* strong for the behaviour, absent for learning | **Strong candidate** · `cohort`

- **Mechanism.** Explicitly rewarding the act of *resuming* after a break, rather than rewarding unbroken continuity, removes the "I've already broken it" abandonment logic.
- **Magnitude / horizon.** In the Milkman et al. (2021) megastudy of 54 interventions across 61,293 gym members, the top-performing intervention offered micro-rewards for returning to the gym after a missed workout. This is the strongest single result in the applied behavioural-science literature for a return-focused mechanism.
- **External validity / counterevidence.** Gym attendance, four-week horizon, with the caveat that only 8% of interventions in that megastudy produced significant measurable change after the intervention period. So: robust *during* intervention, unproven *after*.
- **Goodhart risk.** **Low-moderate.** The obvious exploit — deliberately lapsing to farm recovery rewards — is self-limiting because the lapse itself costs the learner more than the reward is worth, provided the reward is informational rather than material.
- **Ethical risk.** **Low. This is the ethically cleanest high-performing engagement mechanism in the arsenal**, because it works by removing a self-imposed barrier rather than by manufacturing a loss.
- **Externalize application.** **[R] On return after a gap, open with a short, deliberately-achievable "recovery set" of items the learner previously mastered, framed as re-establishment rather than as make-up work.** Never present a backlog. Never show what was missed. The brief's own "recovery quest" example is well-founded; this is its evidential basis.
- **Backfire.** If recovery is too easy and too rewarding, it teaches that lapsing is costless and the daily cadence dissolves.
- **Smallest test.** Requires enough lapses to observe. At small N: instrument every lapse and every return; compare return latency before and after introducing recovery sets.
- **Metrics.** Primary: post-lapse 14-day retention (does the recovery set actually restore capability?). Secondary: return-within-7-days rate after a lapse. Guardrail: lapse frequency (must not increase).

#### M-24 · Adaptive reminder scheduling
*Provenance:* ed-tech ML | *Target:* initiation | *Evidence:* moderate; small effects | **Context-dependent** · `scale`

- **Mechanism.** Choosing notification content/timing per user via bandit optimisation, with recency penalties to handle novelty decay.
- **Magnitude / horizon.** Yancey & Settles (2020) optimised millions of daily Duolingo reminders with a Recovering Difference Softmax algorithm, reporting a 0.5% increase in total daily active users and a 2% increase in new-user retention over a strong baseline.
- **External validity / counterevidence.** **[F] Read those numbers carefully. A sophisticated bandit over 200 million notification events, at one of the most engagement-optimised companies in the world, bought half a percent of DAU.** This is the best available calibration for how much notification engineering is worth: very little, at enormous cost. The paper's own framing — that novelty effects require explicit recency penalties — confirms that notification effectiveness decays with repetition.
- **Goodhart risk.** High. Notification-open rate is a textbook proxy metric; optimising it selects for alarming or emotionally manipulative copy.
- **Ethical risk.** **Moderate-to-high.** Personalised timing optimisation is precisely attention engineering. Duolingo's notification voice is widely discussed as guilt-inducing.
- **Externalize application.** **[R] Send at most one reminder per day, at a learner-chosen time, containing the learner's own if–then plan text (M-19) and the number of items due.** Do not optimise copy. Do not send re-engagement pushes after multi-day absence beyond a single one.
- **Backfire.** Notification fatigue → permissions revoked → the channel is gone permanently. This is an irreversible resource; spending it on optimisation is bad value.
- **Smallest test.** On/off reminder weeks at N=1 gives a usable within-subject signal on initiation.
- **Metrics.** Primary: retrievals at scheduled intervals. Secondary: initiation-within-2-hours-of-reminder. Guardrail: notification permission retained; self-reported annoyance.

#### M-25 · Friction reduction and default-path design
*Provenance:* HCI, choice architecture | *Target:* initiation | *Evidence:* strong in general, unmeasured here | **Strong candidate** · `N=1`

- **Mechanism.** Every decision, tap, and load between intention and first retrieval is an attrition point.
- **Magnitude / horizon.** No clean effect size for this specific application. Related evidence: the dark-patterns literature demonstrates that obstruction alone massively changes behaviour (Luguri & Strahilevitz found obstruction among the most effective manipulation strategies), which establishes the converse — that removing obstruction matters a great deal.
- **External validity.** Strong; this is one of the most robust regularities in interaction design.
- **Goodhart risk.** Low, unless "time to first item" becomes an optimisation target, in which case the system starts skipping necessary orientation.
- **Ethical risk.** None. Reducing friction on the path the learner already chose is the opposite of a dark pattern.
- **Externalize application.** App open → first due item on screen with no menu, no dashboard, no streak celebration, no daily-goal picker. **[R] Celebrations and summaries belong at session *end*, never at session start.** Every element on the opening screen that is not the first item is a tax on initiation.
- **Backfire.** Zero orientation can leave a returning learner disoriented after a long gap (handle via M-23 recovery set).
- **Smallest test.** Instrument time-from-open-to-first-response; make one change; observe. Valid at N=1.
- **Metrics.** Primary: retrievals completed per week. Secondary: time from app-open to first response; open-without-response rate. Guardrail: post-session comprehension of what was practised.

#### M-26 · Session rituals and defined stopping points
*Provenance:* game design; habit research | *Target:* return, session completion | *Evidence:* weak | **Speculative** · `N=1`

- **Mechanism.** A predictable opening and a clean, satisfying close define the unit of behaviour and make it repeatable; an ambiguous end produces either overrun or an unsatisfying trail-off.
- **Magnitude / horizon.** No direct evidence located. Adjacent support from habit research on behavioural definition.
- **Goodhart risk.** Low.
- **Ethical risk.** Low — but note the inverse mechanism (deliberately *removing* stopping points to induce continuation) is a known attention-engineering pattern and should be avoided.
- **Externalize application.** A session ends when the due queue is empty. **[R] Say so explicitly and stop.** Do not offer "one more set." A product that tells the learner they are done for today is making a credible claim about the scheduler's validity, which is itself trust-building.
- **Backfire.** Learners who want to continue feel blocked. (Permit continued practice, but mark it as exploratory and exclude it from evidence — consistent with existing product doctrine.)
- **Smallest test.** Qualitative at N=1.
- **Metrics.** Primary: n/a. Secondary: session-completion rate. Guardrail: sessions ending in abandonment mid-queue.

---

### Family D — Progress, reward, and framing

#### M-27 · Evidence-backed progress visualisation
*Provenance:* ed-tech; motivation | *Target:* perceived competence, persistence | *Evidence:* moderate (indirect) | **Strong candidate** · `N=1`

- **Mechanism.** Visible, credible progress supports perceived competence, which is a well-supported determinant of persistence under self-determination theory.
- **Magnitude / horizon.** No direct effect size for this operationalisation. Supported indirectly by the positive-feedback arm of Deci, Koestner & Ryan (1999), where positive feedback enhanced free-choice behaviour (d = 0.33) and self-reported interest (d = 0.31) — in sharp contrast to tangible rewards, which undermined both.
- **External validity.** Good. This is one of the few motivational findings that is both robust and directly actionable.
- **Goodhart risk.** **High if the progress indicator is cheap to move, near-zero if it is expensive and valid.** The whole design question is whether the bar advances on *activity* or on *delayed evidence*.
- **Ethical risk.** **Low if honest, high if inflated.** A progress bar that overstates capability is a lie the learner will act on.
- **Externalize application.** **[R] Advance capability states only on *delayed, unaided, system-selected* retrieval success — and let them regress.** A progress display that can only go up is not a measurement, it is a decoration. Regression is what makes the indicator informative, and is the strongest available signal that the product is honest.
- **Backfire.** Visible regression is demoralising. Mitigate by framing regression as scheduling information ("this needs review") rather than as loss of status.
- **Smallest test.** Compare learner predictions of their own delayed performance against actual, with and without the indicator visible — i.e. test whether the indicator improves *calibration*.
- **Metrics.** Primary: correlation between displayed capability state and actual delayed performance (**indicator validity is the primary metric, not a secondary one**). Secondary: session initiation. Guardrail: fraction of capability advances traceable to learner-selected evidence (target: 0).

#### M-28 · Goal-gradient acceleration
*Provenance:* behavioural economics; Hull | *Target:* within-session persistence | *Evidence:* moderate, pre-replication-era | **Context-dependent** · `N=1`

- **Mechanism.** Effort increases as perceived distance to a goal decreases.
- **Magnitude / horizon.** Kivetz, Urminsky & Zheng (2006) found café customers purchased more frequently as they approached a free-coffee reward, and rating-site users visited more often, rated more per visit, and were less likely to terminate sessions as they approached the threshold. Notably, participants reduced engagement after achieving the first reward and then accelerated again toward the second — the post-reward trough is part of the phenomenon.
- **External validity / counterevidence.** Consumer loyalty contexts, 2006, single-lab. The post-reward slump is a design problem, not a footnote.
- **Goodhart risk.** Moderate. Acceleration near a goal means *faster*, and faster in a learning context often means shallower.
- **Ethical risk.** Low.
- **Externalize application.** Show remaining due items as a diminishing count. Keep queues short enough that the end is always visible. **[R] Do not use goal gradients on anything except the current session's due queue** — long-horizon progress bars produce long-horizon slumps.
- **Backfire.** Rushing the last items of a session to close the bar; measurable as an accuracy drop in the final quartile of each session.
- **Smallest test.** Compare accuracy by within-session position, with and without a visible remaining count.
- **Metrics.** Primary: delayed retention of items practised in the final session-quartile. Secondary: session-completion rate. Guardrail: accuracy and response-time trend across session position.

#### M-29 · Endowed progress
*Provenance:* consumer psychology | *Target:* initial commitment | *Evidence:* moderate; single influential study | **Probably counterproductive (here)** · `cohort`

- **Mechanism.** Granting unearned initial progress shifts the reference point and triggers goal-gradient acceleration earlier.
- **Magnitude / horizon.** Nunes & Drèze (2006): car-wash loyalty cards requiring 8 stamps completed by ~19% of customers, versus ~34% for cards requiring 10 stamps with 2 pre-filled — economically identical, roughly double completion.
- **External validity / counterevidence.** One field study, 300 cards, 2006, consumer purchasing. Heavily cited, lightly replicated. **[O] Whether it holds for effortful cognitive tasks with a self-selected adult is unknown.**
- **Goodhart risk.** N/A for behaviour; **catastrophic for measurement.** Endowed progress in a *mastery* display means the system asserts capability it has no evidence for.
- **Ethical risk.** **High in this specific context.** In a loyalty card, fake progress costs the customer nothing. In a mastery model, fake progress corrupts the learner's model of their own knowledge — the exact opposite of the calibration objective.
- **Externalize application.** **[R] Do not use on capability states.** The only defensible use is on a purely cosmetic, explicitly-non-evidential onboarding counter, and even that is not worth the trust risk in a product whose value proposition is honest measurement.
- **Backfire.** Learner discovers the endowment was unearned and — correctly — stops trusting every other indicator.
- **Smallest test.** Do not run.
- **Metrics.** n/a.

#### M-30 · Extrinsic tangible rewards (XP, gems, currency, unlocks)
*Provenance:* F2P games; loyalty | *Target:* activity volume | *Evidence:* strong evidence of *harm* to intrinsic motivation | **Probably counterproductive** · `cohort`

- **Mechanism.** Contingent tangible rewards for an activity shift the perceived locus of causality from internal to external.
- **Magnitude / horizon.** Deci, Koestner & Ryan (1999), 128 experiments: engagement-contingent, completion-contingent and performance-contingent rewards undermined free-choice intrinsic motivation at d = −0.40, −0.36 and −0.28 respectively, with smaller but significant undermining of self-reported interest. The same analysis found *positive feedback* enhanced both (*d* ≈ 0.31–0.33).
- **External validity / counterevidence.** Cameron & Pierce's competing meta-analysis reached weaker conclusions; Deci et al. contest its methodology. The controversy is old and unresolved at the margins, but the direction of effect for *expected tangible* rewards is not seriously disputed. Undermining was larger for children than college students, which mildly favours an adult product.
- **Goodhart risk.** **Maximal.** XP is the paradigm case of a corruptible proxy. Every failure mode in the brief's Section 3F list is an XP-optimisation strategy.
- **Ethical risk.** Moderate. Not deceptive, but it degrades the learner's own motivation for the activity they chose.
- **Externalize application.** **[R] Do not implement a pseudo-currency or XP system.** Substitute informational positive feedback about capability, which the same meta-analysis shows to be *beneficial* where tangible rewards are harmful. This is the single clearest "the evidence says don't" in the report.
- **Backfire.** Adult learner who chose to study logic for its own sake is converted into a point-collector; if points are later removed, activity falls below baseline.
- **Smallest test.** Do not run at N=1 (the undermining effect is not reliably reversible).
- **Metrics.** If ever tested: primary = free-choice practice after rewards are withdrawn.

#### M-31 · Uncertain / variable rewards
*Provenance:* operant psychology; F2P; gambling | *Target:* repetition | *Evidence:* weak in product contexts, moderate in constrained lab settings | **Effective but dangerous** · `cohort`

- **Mechanism.** Two distinct claims are usually conflated. (a) *Variable-ratio schedules produce high, extinction-resistant response rates* — an operant-conditioning result from animal work. (b) *Uncertain reward magnitude increases effort in humans* — a consumer-psychology result.
- **Magnitude / horizon.** For (b) there is real evidence: Shen, Fishbach & Hsee (2015) found people invested more effort, time and money for an uncertain reward than for a certain reward of higher expected value — but critically, this effect arises only when people focus on the process of pursuing a reward, not when they focus on the outcome. Shen, Hsee & Talloen (2019) extended this to repetition decisions in lab and field. For (a), **[F] no adequately-controlled human product-field experiment isolating variable-ratio scheduling was located.** The claim's citation trail runs to Skinner, not to human product data.
- **External validity / counterevidence.** The boundary condition in (b) is fatal for most product applications: the moment the learner focuses on the reward rather than the activity, the effect disappears. A prominently-displayed reward system creates outcome focus by construction.
- **Goodhart risk.** High. Random rewards decouple reinforcement from performance, which is the definition of a corrupted signal.
- **Ethical risk.** **High.** This is the mechanism most directly shared with gambling, and the most likely to produce compulsive rather than intentional use.
- **Externalize application.** **[R] If used at all, gate it: variability may attach only to *what the learner discovers*, never to *whether they are rewarded*.** E.g. after a successful delayed retrieval, the system reveals which upcoming capability was unlocked — the outcome is certain, the content is a surprise. This preserves the "making the unknown known" mechanism Shen et al. identify while removing the intermittent-reinforcement structure.
- **Backfire.** Compulsive checking; erosion of the learner's ability to judge their own progress.
- **Smallest test.** Certain-content vs surprise-content reveal after delayed retrieval success; primary outcome = delayed retention, guardrail = self-reported compulsion.
- **Metrics.** Primary: delayed retention. Secondary: voluntary return. Guardrail: sessions the learner reports not having intended to start.

#### M-32 · Fresh-start effect / temporal landmarks
*Provenance:* behavioural economics | *Target:* re-initiation | *Evidence:* moderate | **Promising** · `N=1`

- **Mechanism.** Temporal landmarks (new week, month, birthday) create a psychological separation from a past self, increasing willingness to pursue aspirational goals.
- **Magnitude / horizon.** Well-replicated in search/gym/goal-setting archival data; effect sizes are modest and the mechanism is best characterised as *timing* rather than *magnitude*.
- **External validity / counterevidence.** Mostly archival and field-observational; the effect is on *initiation of attempts*, not on their success. A fresh start that fails is a failed attempt like any other.
- **Goodhart risk.** Low.
- **Ethical risk.** Low.
- **Externalize application.** Time re-engagement for a lapsed learner to a landmark rather than to a fixed day-count. Combine with M-19: a landmark is a natural moment to elicit a *revised* if–then plan.
- **Backfire.** Waiting for a landmark delays re-engagement past the point of return.
- **Smallest test.** Landmark-timed vs day-count-timed re-engagement message after a lapse.
- **Metrics.** Primary: post-return 14-day retention. Secondary: return rate. Guardrail: total elapsed lapse duration (must not increase).

#### M-33 · Commitment devices
*Provenance:* behavioural economics | *Target:* persistence | *Evidence:* moderate; demand is well-evidenced, durability is not | **Context-dependent** · `N=1`

- **Mechanism.** Voluntarily restricting one's future options to bind a present intention against future present-bias.
- **Magnitude / horizon.** In Milkman, Minson & Volpp's temptation-bundling experiment, 61% of participants chose to pay for gym-only access to tempting audiobooks after the study, indicating real demand for the commitment device. Effects on behaviour were substantial initially (see M-34) but declined.
- **External validity.** Exercise; adult; reasonable analogy.
- **Goodhart risk.** Low.
- **Ethical risk.** **Moderate and worth stating.** A commitment device the learner freely chooses is autonomy-supporting. A commitment device the product makes hard to exit is a dark pattern wearing a self-improvement costume. The exit must be as easy as the entry.
- **Externalize application.** Optional, learner-initiated: "hold me to 4 days a week this month," with a one-tap exit and no shaming on exit.
- **Backfire.** Broken commitments generate guilt; guilt generates avoidance; avoidance generates churn.
- **Smallest test.** Self-set commitment on/off across months at N=1.
- **Metrics.** Primary: retrievals at scheduled intervals. Secondary: commitment adoption rate. Guardrail: post-commitment-failure return rate.

#### M-34 · Temptation bundling
*Provenance:* behavioural economics | *Target:* initiation | *Evidence:* moderate, with an honest decay record | **Context-dependent** · `N=1`

- **Mechanism.** Pairing an immediately-gratifying "want" with a delayed-benefit "should" makes the should-behaviour instantly rewarding.
- **Magnitude / horizon.** Original field experiment: gym visits up 51% (full treatment, gym-only audiobook access) and 29% (encouragement only) versus control; treatment effects declined over time, particularly after a holiday break. The 2020 follow-up with N = 6,792 found audiobooks plus temptation-bundling encouragement raised weekly workout likelihood by 10–14% and average weekly workouts by 10–12%, during and up to seventeen weeks post-intervention — one of the better post-intervention persistence records in the literature.
- **External validity / counterevidence.** Exercise, where a bundled audiobook is genuinely compatible with the activity. **[F] Symbolic logic is cognitively saturating; there is no "want" that can be consumed simultaneously.** The bundle must therefore be adjacent (coffee, a specific chair, a specific music) rather than concurrent, which is a weaker version of the mechanism.
- **Goodhart risk.** Low.
- **Ethical risk.** None.
- **Externalize application.** Suggest an adjacent bundle during if–then plan creation. Cheap to implement (it is copy), reasonable evidence, no measurement risk.
- **Backfire.** Learner comes to require the bundle; without the coffee, no practice.
- **Smallest test.** Bundle-suggested vs not, alternating months, N=1 viable.
- **Metrics.** Primary: retrievals at intervals. Secondary: initiation rate. Guardrail: initiation rate when the bundle is unavailable.

#### M-35 · Sunk cost and escalating commitment
*Provenance:* behavioural economics; F2P | *Target:* retention | *Evidence:* strong for the bias, weak for engineered use | **Probably counterproductive** · `cohort`

- **Mechanism.** Accumulated investment increases reluctance to abandon, independent of forward-looking value.
- **Magnitude / horizon.** The bias is well-established; deliberate product exploitation of it is essentially unmeasured in disclosed research.
- **Goodhart risk.** Moderate.
- **Ethical risk.** **High.** Retaining a learner because leaving feels wasteful, rather than because staying is valuable, is retention against the learner's interest. It is also the mechanism most in tension with the brief's stated end-state (the learner should eventually need Externalize less).
- **Externalize application.** **[R] None. And note the structural conflict:** any mechanism that raises the felt cost of leaving works directly against the brief's §9 property that successful educational engagement may reduce product dependence. Mechanisms in this class should be treated as disqualified by the product's own objective function, independent of their effectiveness.
- **Backfire.** Resentment on eventual departure; poor word-of-mouth; and a learner who stays without learning.
- **Smallest test.** Do not run.
- **Metrics.** n/a.

---

### Family E — Social, scarcity, and attention engineering

#### M-36 · Leaderboards and social comparison
*Provenance:* games; gamification | *Target:* effort | *Evidence:* moderate, and substantially negative | **Probably counterproductive** · `scale`

- **Mechanism.** Ranked comparison against others engages competitive motivation and status concerns.
- **Magnitude / horizon.** Sailer & Homner (2020) found competition combined with collaboration was among the more effective configurations, but leaderboards in isolation fare poorly. Hanus & Fox's longitudinal classroom comparison found students in the gamified course (leaderboard and badges) showed less motivation, satisfaction and empowerment over time than those in the non-gamified course. Multiple studies find bottom-ranked users disengage, and a 2025 study reported negative leaderboard feedback can be worse than no feedback at all.
- **External validity / counterevidence.** Effects are strongly moderated by trait competitiveness and by leaderboard scope (relative/cohort-bounded leaderboards mitigate some harm).
- **Goodhart risk.** **Severe.** Rank is computed from a metric; whatever metric it is, learners optimise it. Duolingo's league system is widely observed to drive XP-farming on trivial content **[industry]**.
- **Ethical risk.** Moderate-high: public comparison is socially threatening and disproportionately harms the learners most in need of support.
- **Externalize application.** **[R] None.** Structurally impossible at N=1 anyway, and the evidence does not justify building it later.
- **Backfire.** Demotivation of the majority to energise a minority; measurement corruption throughout.
- **Smallest test.** Not recommended.
- **Metrics.** n/a.

#### M-37 · Social proof and normative feedback
*Provenance:* social psychology | *Target:* initiation | *Evidence:* moderate generally, unmeasured here | **Insufficient evidence** · `scale`

- **Mechanism.** Information about others' behaviour shifts perceived norms and thus own behaviour.
- **Magnitude / horizon.** Robust in energy/tax/voting domains; small effects. No located evidence in self-directed symbolic learning.
- **Goodhart risk.** Low.
- **Ethical risk.** Moderate — descriptive norms can be constructed misleadingly ("most learners practise daily" when most do not).
- **Externalize application.** Not available at N=1; low priority later. If used, only true and specific descriptive norms.
- **Metrics.** n/a at this stage.

#### M-38 · Scarcity, countdowns, and artificial urgency
*Provenance:* advertising; F2P | *Target:* immediate action | *Evidence:* moderate for conversion, none for learning | **Effective but dangerous** · `cohort`

- **Mechanism.** Perceived limited availability raises valuation and accelerates decision-making.
- **Magnitude / horizon.** Effective in commerce; the dark-patterns literature identifies urgency cues (countdown timers, low-stock messaging) as meaningfully increasing purchases, with older consumers more susceptible.
- **Goodhart risk.** High — urgency drives speed, and speed in a proof task means rapid guessing, one of the brief's named corruption modes.
- **Ethical risk.** **High.** Artificial urgency is deception when the scarcity is manufactured.
- **Externalize application.** **[R] Only where the urgency is *real*: an item is genuinely approaching its forgetting threshold.** "3 items will drop below retention threshold today" is true, informative, and creates urgency honestly. A countdown timer on a lesson is manufactured and should not be built.
- **Backfire.** Rushed sessions with poor encoding; the urgency produces exactly the shallow processing that defeats the purpose.
- **Smallest test.** Real-decay urgency messaging on/off; guardrail is response time.
- **Metrics.** Primary: retention of items practised under urgency framing. Secondary: same-day completion of at-risk items. Guardrail: median response time (a drop indicates rushing).

#### M-39 · Near-miss feedback
*Provenance:* gambling | *Target:* persistence | *Evidence:* **weak; failed replications** | **Probably counterproductive** · `cohort`

- **Mechanism.** Outcomes that appear close to a win are hypothesised to act as conditioned reinforcers sustaining play.
- **Magnitude / horizon.** **[F] The replication record is poor.** Pisklak et al. (2020) tested persistence in humans and pigeons and found no significant differences, concluding the research programme may have been misdirected from the outset. Later conceptual replications (Cherkasova et al., 2024) recovered a subjective motivation effect and a speed-of-play effect, but found the valence effect in the *opposite* direction to the original: near-misses were rated more *positively* than full misses. A pre-registered scratch-card study found near-misses raised the urge to gamble without changing gambling behaviour.
- **Goodhart risk.** N/A.
- **Ethical risk.** High if it worked; moot given the evidence.
- **Externalize application.** **[R] None.** However, note a *legitimate* adjacent mechanism: telling a learner *how close* their incorrect proof was ("your first four steps were valid; the error is at step 5") is informative feedback, not near-miss manipulation. The distinction is whether the closeness signal carries actionable information. It does in logic; it cannot in a slot machine.
- **Metrics.** n/a.

#### M-40 · Zeigarnik / unfinished-task effects
*Provenance:* classical psychology | *Target:* return | *Evidence:* weak; pre-replication-crisis | **Speculative** · `N=1`

- **Mechanism.** Interrupted tasks are held in memory more accessibly than completed ones, creating tension toward resumption.
- **Magnitude / horizon.** Classical demonstrations; modern preregistered support is thin. Widely repeated in design literature with little empirical scrutiny.
- **Goodhart risk.** Low.
- **Ethical risk.** **Depends entirely on implementation.** Deliberately interrupting a learner to create resumption pressure is manipulation. Allowing a naturally-unfinished proof to persist and be resumable is a service.
- **Externalize application.** **[R] Preserve in-progress proof state across sessions and surface it on return — but never engineer an interruption.** The brief's own framing ("use unfinished goals to encourage return while avoiding artificial withholding") is exactly right and the distinction is doing real work.
- **Backfire.** A stale unfinished proof becomes a guilt object that deters opening the app.
- **Smallest test.** State-preservation on/off; measure resumption rate and time-to-resume.
- **Metrics.** Primary: completion rate of resumed proofs. Secondary: return rate. Guardrail: age of oldest unfinished item (staleness).

#### M-41 · Loot-box / gacha reward structures
*Provenance:* F2P monetisation | *Target:* spending, repetition | *Evidence:* strong association with gambling harm | **Probably counterproductive** · `scale`

- **Mechanism.** Randomised reward containers combining variable ratio reinforcement with collection completion drives.
- **Magnitude / horizon.** The consistent finding in this literature is an association between loot-box engagement and problem-gambling severity; the causal direction remains contested.
- **Goodhart risk.** Total decoupling of reward from learning.
- **Ethical risk.** **Highest in the arsenal.** Increasing regulatory exposure in several jurisdictions.
- **Externalize application.** **[R] None. Listed for completeness because the brief requested that mechanisms not be omitted on ethical grounds alone.** The empirical case is also weak: there is no evidence that gacha structures produce learning, and the mechanism they rely on (M-31a) is itself poorly evidenced in human product contexts.
- **Metrics.** n/a.

#### M-42 · Obstruction, confirmshaming, and forced-continuity patterns
*Provenance:* dark-pattern literature | *Target:* retention, conversion | *Evidence:* **strong — these demonstrably work** | **Effective but dangerous** · `scale`

- **Mechanism.** Making the exit path costly, confusing, or socially uncomfortable.
- **Magnitude / horizon.** Luguri & Strahilevitz (2021), representative US sample: mild dark patterns more than doubled the rate at which consumers remained enrolled in an unwanted service, and aggressive dark patterns nearly quadrupled it. Their second study identified hidden information, trick questions and obstruction as the most successful manipulation strategies. **[F] Crucially: aggressive patterns triggered consumer backlash while mild ones did not — meaning the mild ones are the more insidious and the more profitable.** Less-educated subjects were more susceptible.
- **External validity.** Strong RCT, representative sample, real behavioural outcome. This is among the best-evidenced mechanisms in the entire report.
- **Goodhart risk.** N/A — it does not pretend to be about learning.
- **Ethical risk.** **Maximal.**
- **Externalize application.** **[R] None, and the report recommends the inverse as a design invariant:** make pausing, exiting, resetting and deleting trivially easy. Two reasons beyond ethics. First, obstruction retains people who are not learning, which pollutes every metric the product depends on. Second, the brief's own success condition includes reduced product dependence; obstruction is definitionally opposed to it.
- **Note for completeness.** This entry exists because the brief explicitly asked that effective-but-uncomfortable mechanisms not be sanitised away. The honest finding is that **obstruction is the most reliably effective engagement mechanism reviewed in this report, and it is also the one Externalize should most clearly refuse to use.** That combination is worth stating plainly rather than hiding behind a claim that it does not work.
- **Metrics.** n/a.

---

### 4.1 Arsenal summary table

| # | Mechanism | Target | Evidence | Goodhart | Ethics | Assessment |
|---|---|---|---|---|---|---|
| M-01 | Spaced retrieval practice | Retention/transfer | Strong | Low* | Low | **Strong candidate** |
| M-02 | Successive relearning | Retention | Strong | Med | Low | **Strong candidate** |
| M-03 | Expanding vs uniform spacing | Retention | Moderate/null | Low | None | Context-dependent |
| M-04 | Learned retrievability models | Scheduling | Moderate | High | Low | Promising (defer) |
| M-05 | Interleaving | Discrimination | Moderate | Low | None | Context-dependent |
| M-06 | Representational variability | Transfer | Moderate | Low | None | **Promising** |
| M-07 | Desirable difficulty (principle) | — | Umbrella | Inverted | Med | Context-dependent |
| M-08 | 85% difficulty target | Learning rate | Weak (non-human) | High | Low | Speculative |
| M-09 | Mastery / criterion gating | Curriculum integrity | Moderate | High | Low | Promising |
| M-10 | Forgetting-aware re-surfacing | Retention efficiency | Moderate | Med | None | **Strong candidate** |
| M-11 | Generation / externalised steps | Retention/measurement | Strong | **Low (protective)** | None | **Strong candidate** |
| M-12 | Self-explanation prompts | Transfer | Strong | Med | None | **Strong candidate** |
| M-13 | Pretesting / prequestions | Encoding | Strong (narrow) | Low | Low | Promising |
| M-14 | Productive failure | Conceptual/transfer | Moderate-strong | Med | Low | Promising |
| M-15 | Worked examples + fading | Acquisition | Strong (novices) | High | None | Context-dependent |
| M-16 | Feedback design | Correction | Strong on variance | High | Low | Context-dependent |
| M-17 | Failure-driven scaffolding | Error reduction | Moderate | Low | Med | Promising |
| M-18 | Confidence / calibration | Calibration | Moderate | High | Low | Context-dependent |
| M-19 | Implementation intentions | Initiation | Strong | **None** | **None** | **Strong candidate** |
| M-20 | Cue–context stability | Return | Moderate (decaying) | Low | Low | Promising |
| M-21 | Days-based incentive | Spacing→retention | **Strong (direct RCT)** | Med | Low | **Strong candidate** |
| M-22 | Streaks with loss framing | Return | Weak/industry | **Severe** | **High** | Effective but dangerous |
| M-23 | Lapse-recovery micro-reward | Return | Strong (behaviour) | Low-med | **Low** | **Strong candidate** |
| M-24 | Adaptive reminders | Initiation | Moderate, tiny effects | High | Med-high | Context-dependent |
| M-25 | Friction reduction | Initiation | Strong (general) | Low | None | **Strong candidate** |
| M-26 | Session rituals / stopping points | Return | Weak | Low | Low | Speculative |
| M-27 | Evidence-backed progress display | Competence | Moderate | High if cheap | Low if honest | **Strong candidate** |
| M-28 | Goal gradient | Persistence | Moderate | Med | Low | Context-dependent |
| M-29 | Endowed progress | Commitment | Moderate (1 study) | Catastrophic | High | **Probably counterproductive** |
| M-30 | XP / tangible rewards | Volume | Strong evidence of harm | **Maximal** | Med | **Probably counterproductive** |
| M-31 | Uncertain / variable rewards | Repetition | Weak in field | High | High | Effective but dangerous |
| M-32 | Fresh-start effect | Re-initiation | Moderate | Low | Low | Promising |
| M-33 | Commitment devices | Persistence | Moderate | Low | Med | Context-dependent |
| M-34 | Temptation bundling | Initiation | Moderate | Low | None | Context-dependent |
| M-35 | Sunk cost / escalation | Retention | Weak (engineered) | Med | High | **Probably counterproductive** |
| M-36 | Leaderboards | Effort | Moderate, negative | Severe | Med-high | **Probably counterproductive** |
| M-37 | Social proof | Initiation | Insufficient here | Low | Med | Insufficient evidence |
| M-38 | Scarcity / urgency | Immediate action | Moderate (commerce) | High | High | Effective but dangerous |
| M-39 | Near-miss | Persistence | **Failed replications** | n/a | High | **Probably counterproductive** |
| M-40 | Zeigarnik / unfinished | Return | Weak | Low | Depends | Speculative |
| M-41 | Loot boxes / gacha | Repetition | Harm-associated | Total | Maximal | **Probably counterproductive** |
| M-42 | Obstruction / confirmshaming | Retention | **Strong** | n/a | **Maximal** | Effective but dangerous — refuse |

\* Low for the mechanism, high for its scheduler.

---

## 5. Strongest candidates for Externalize

Ranked by expected learning value × evidence quality ÷ measurement risk, then filtered for what is testable in the current phase.

### Tier 1 — Build now, in this order

**1. Days-based qualifying-retrieval counter (M-21) replacing all volume metrics.**
Rationale: it is the only engagement mechanism reviewed with a *direct RCT showing improved exam performance mediated by spacing*. It captures what streaks actually do well (enforce a daily cadence) with none of the loss-framing harm. Implementation cost is low. Measurement risk is manageable if a "qualifying day" requires scheduled due-item retrievals with externalised steps.

**2. Forgetting-aware scheduling with an explicit, auditable target-recall parameter (M-01, M-10).**
Rationale: largest and best-replicated learning effects in the arsenal. Keep the scheduler simple and explainable; defer learned models (M-04). The parameter should be a stored, inspectable number, not an emergent property of code.

**3. Successive relearning as the criterion structure (M-02, M-09).**
Rationale: the strongest protocol available, with relearning potency effects far larger than anything on the engagement side. Redefine "criterion" for a procedural domain: correct application in a novel proof on a later day.

**4. Implementation intentions at onboarding and after every lapse (M-19).**
Rationale: *d* = 0.65, zero Goodhart surface, zero ethical cost, testable at N=1 with an ABAB design, implementable as a text field and a template. The best effort-to-evidence ratio in the report.

**5. Lapse-recovery sets (M-23).**
Rationale: the top performer in the largest behavioural megastudy ever run, ethically clean, and it addresses the brief's explicitly-flagged concern about what happens after a lapse. It is also the natural complement to a never-decreasing day counter.

**6. Friction elimination on the initiation path (M-25).**
Rationale: cheap, safe, and the effect operates on every single session rather than occasionally.

**7. Honest, regressing, evidence-backed capability display (M-27).**
Rationale: supports perceived competence via the *positive-feedback* route that Deci et al. found beneficial, rather than the tangible-reward route they found harmful. Its validity is itself a primary metric.

### Tier 2 — Build after Tier 1 is instrumented

**8. Representational variability across item types (M-06)** — directly attacks interface-pattern memorisation and is the mechanism most likely to rescue transfer, given the Cheng et al. finding about abstract-only training.

**9. Structured self-explanation at error and rule-selection points (M-12)** — *g* = 0.55, aligned with existing product doctrine, but must be format-constrained to remain machine-checkable.

**10. Proof-completion feedback rather than step-level correctness (M-16)** — a change with a real chance of being wrong, but the guess-and-check failure mode it prevents is severe.

**11. Interleaved rule-selection items after acquisition (M-05)** — moderate evidence, high domain relevance, real risk of no durable effect.

**12. Prequestions at new-rule introduction (M-13)** — cheap; benefit is item-specific only, so expectations should be calibrated accordingly.

### Explicitly rejected despite being on the brief's list

XP/pseudo-currency (M-30), leaderboards (M-36), endowed progress on capability states (M-29), reset-on-miss streaks (M-22), near-miss feedback (M-39), loot-box structures (M-41), obstruction patterns (M-42), engineered sunk cost (M-35).

**[F] Note the pattern in that rejection list: every rejected mechanism is a *reward or status* mechanism, and every Tier-1 accepted mechanism is a *scheduling, planning or information* mechanism.** This is the report's central structural finding, and it fell out of the evidence rather than being imposed on it.

---

## 6. Effective but dangerous

These are mechanisms where effectiveness is real and the danger is real. Presented so the decision is made explicitly rather than by omission.

### 6.1 Obstruction patterns (M-42) — the honest hard case

Luguri & Strahilevitz provide RCT evidence with a representative sample and a real behavioural outcome: mild dark patterns more than doubled unwanted enrolment retention, aggressive ones nearly quadrupled it, and only the aggressive variants provoked backlash. **[F] By evidence quality and effect size, this is one of the best-supported mechanisms in this entire report.** It would work on Externalize's learners.

The argument against it is not that it is ineffective. It is threefold:
1. **Measurement.** Retained non-learners pollute every metric the mastery model depends on.
2. **Objective conflict.** The brief's success condition includes eventual reduced dependence; obstruction is definitionally opposed.
3. **Asymmetric harm.** The finding that less-educated subjects were more susceptible means the harm falls hardest on learners with the least support.

**[R] Adopt the inverse as an invariant: exit, pause, reset and export must always be at most one screen away.**

### 6.2 Reset-on-miss streaks (M-22)

Effectiveness is asserted by industry and is plausible; causal isolation is absent. Danger is well-documented qualitatively (streak anxiety, post-lapse abandonment) and structurally guaranteed (minimum-viable-activity incentive). The loss-framing literature it rests on produced a headline result that **failed to replicate in wave 2 of the same experiment**.

**[R] Use the decomposition: keep the cadence, drop the reset.** This is the single most consequential design recommendation in the report, because streaks are the default thing every learning product builds.

### 6.3 Variable rewards (M-31)

The human evidence that exists (motivating-uncertainty) has a boundary condition — process focus, not outcome focus — that most implementations violate by construction. The animal-derived version has no human product evidence. Danger is high (compulsion). **[R] Permissible only in the constrained "certain reward, uncertain content" form described in M-31, and only downstream of demonstrated learning evidence.**

### 6.4 Manufactured urgency (M-38)

Works in commerce; drives speed; speed corrupts proof work. **[R] Only real urgency (genuine forgetting-threshold proximity), which is available for free in a spaced system and is honest.**

### 6.5 Adaptive notification optimisation (M-24)

Works, but the honest calibration is that a world-class implementation on 200M events bought 0.5% DAU. The ethical cost (attention engineering, guilt-inducing copy) is disproportionate to a half-percent. **[R] One learner-timed reminder containing the learner's own plan text; no copy optimisation.**

---

## 7. Popular ideas with weak or contradictory evidence

**[F] Near-miss feedback.** Pre-registered replication found no persistence effect in humans or pigeons; the authors questioned the premise of the research programme. Conceptual replications recovered some subjective effects and reversed the valence finding.

**[F] Variable-ratio reinforcement as a product mechanic.** The citation chain terminates in animal operant work. No adequately-controlled human product field experiment isolating VR scheduling was located. Widely asserted; poorly evidenced.

**[F] Points and badges as a general engagement solution.** Sailer & Homner's motivational and behavioural effects were unstable under high-rigour subsplit. Hanus & Fox found a leaderboard-and-badges course produced *declining* motivation, satisfaction and empowerment relative to an ungamified course over a semester.

**[F] Expanding spacing schedules as necessary.** Latimier et al. examined expanding vs uniform directly and did not find a reliable advantage. The SRS community treats expansion as foundational; the meta-analytic evidence does not.

**[F] The 85% rule as an educational prescription.** It is a result about gradient-descent learners, demonstrated on artificial and perceptual networks. Useful prior, not an educational finding.

**[F] Interleaving as a durable win.** *g* = 0.42 overall and *g* = 0.34 for mathematics, but a full-year field experiment estimated roughly 0.04 SD on the end-of-year cumulative assessment, and found no benefit at the top of the distribution.

**[F] Zeigarnik effects.** Pre-replication-crisis literature, heavily recycled in design writing.

**[F] "Feedback is powerful."** The revised meta-analytic estimate (*d* = 0.48) is well below the widely-cited 0.70–0.79, and roughly a third of effects in the foundational review were negative.

**[F] "Habits form and then persist."** The physical-activity habit-intervention meta-analysis found effects *shrinking* with longer follow-up (SMD 0.40 at ≤12 weeks, 0.17 beyond). The megastudy found ~8% post-intervention persistence.

**[F] Endowed progress as a general onboarding trick.** One 2006 field study with 300 cards, endlessly recycled. Not replicated in cognitively effortful domains.

**[F] Prequestions as a general primer.** Benefit is *g* = 0.66 for prequestioned content and approximately zero (*g* ≈ 0.01) for other content in the same activity.

**[F] Metacognitive judgements as a learning intervention.** With complex educational materials, no research has found that eliciting judgements directly improves learning. Calibration is a legitimate goal in itself; it is not a retention lever.

---

## 8. Cross-mechanism interactions and conflicts

### 8.1 Reinforcing combinations

| Combination | Why it compounds |
|---|---|
| M-19 (if–then) + M-25 (friction) + M-24 (one reminder) | Cue, path, and prompt attack the same failure (initiation) at three independent points |
| M-21 (days counter) + M-01/M-10 (scheduler) | The counter makes the scheduler's preferred behaviour the reward-maximising behaviour — incentive and pedagogy point the same way |
| M-23 (lapse recovery) + M-21 (never-decreasing counter) | Together they eliminate the "already broken it" logic that reset-streaks create |
| M-11 (externalised steps) + M-17 (failure-driven scaffolding) | Externalised steps make the error *locatable*, which is what makes error-focused remediation possible at all |
| M-14 (productive failure) + M-13 (prequestions) | Both create a pre-instruction impasse; prequestions are the cheap version, PF the expensive one |
| M-06 (variability) + M-05 (interleaving) | Both attack surface-pattern reliance, from the representation and the sequencing directions |
| M-27 (honest progress) + M-18 (calibration) | A regressing indicator is itself calibration feedback |

### 8.2 Direct conflicts

| Conflict | Nature | Resolution |
|---|---|---|
| M-30 (XP) vs M-27 (honest progress) | Two progress signals; the cheap one wins the learner's attention and destroys the expensive one's informational value | Do not build XP. There must be exactly one progress signal and it must be evidence-backed |
| M-08 (85% success target) vs M-01/M-05/M-07 (desirable difficulty) | A success-rate target and an error-inducing pedagogy are pulling in opposite directions | Difficulty is set by the scheduler's retrievability target, not by a success-rate controller |
| M-16 (delayed rich feedback) vs M-28 (goal gradient) | Goal gradients reward speed; delayed feedback requires the learner to hold structure without confirmation | Keep queues short so the gradient operates over few items; withhold step-correctness within an item |
| M-22 (streaks) vs M-01 (scheduler) | A streak demands daily activity; a spacing scheduler may have nothing due today | **Unresolvable in the reset form.** In the days-counter form, a day with no due items should count automatically |
| M-30/M-36 (rewards, ranks) vs SDT autonomy | Tangible rewards and comparison undermine intrinsic motivation (*d* ≈ −0.28 to −0.40) | Use informational positive feedback instead (*d* ≈ +0.31 to +0.33) |
| M-35 (sunk cost) vs brief §9 (reduced dependence) | Retention-by-cost is opposed to graduation-as-success | Disqualify the whole class on objective-function grounds |
| M-15 (worked examples) vs expertise | Reverses with expertise | Schedule by learner state, not globally |
| M-12 (self-explanation) vs M-11 (already-adaptive environment) | Bisra et al. note prompts may deliver less inside environments that already induce the processing | Expect a smaller-than-meta-analytic effect; test the increment, not the base |

### 8.3 Effects that decay, and on what schedule

- **Novelty (4–10 weeks).** Rodrigues et al. found a U-shape: decline from week 4, trough for two to six weeks, partial recovery between weeks 6 and 10. **[R] No engagement experiment shorter than 10 weeks should be treated as informative about steady-state.**
- **Notification content (days).** The Duolingo bandit required explicit recency penalties precisely because templates lose potency with repetition.
- **Habit interventions (12+ weeks).** Effects roughly halve beyond 12-week follow-up.
- **Loss framing (across waves).** Fryer et al.'s effect was large in wave 1 and absent in wave 2.
- **Temptation bundling (holidays).** Decayed notably after a break in context — a warning that a single disrupted week can end a routine.

### 8.4 Mechanisms that should change with competence

| Competence | Add | Remove |
|---|---|---|
| Novice | Worked examples, prequestions, blocked acquisition, dense feedback | — |
| Intermediate | Interleaving, representational variability, productive failure, longer spacing | Worked examples (expertise reversal), step-level correctness |
| Advanced | Transfer items, novel notation, proof critique, error-detection tasks | Scaffolds generally, most progress display, most reminders |
| Graduating | Export, self-scheduling, "you don't need this daily any more" | The product's own cadence |

**[R] Make scaffold *removal* an explicit, celebrated, instrumented event.** The brief identifies reduced dependence as a success property; if it is a success property it needs a metric and a moment. Suggested metric: *scaffold-free proof completion rate* — the proportion of proofs completed with zero hints, zero worked examples and zero step-correctness feedback. This should rise monotonically over months, and it is the closest thing to a single-number answer to "is this product working."

---

## 9. Goodhart and measurement-integrity analysis

### 9.1 The core question, applied

For every mechanism: *if Externalize rewards this, what does a rational learner learn to optimise?*

| If rewarded | Rational learner optimises | Observed corruption |
|---|---|---|
| Items completed | Item throughput | Rapid guessing; easiest-item selection |
| XP / points | Point rate per minute | Easy-task farming; trivial-content grinding |
| Consecutive days | Minimum daily action | Streak preservation via meaningless activity |
| Session count | Session opens | Open-and-close sessions |
| Accuracy | Not attempting hard items | Challenge avoidance; measured mastery inflates while real mastery stalls |
| Time in app | Idle time | Backgrounded sessions; unmeasurable engagement |
| Lesson completion | Reaching the end screen | Hint-driven completion without retention |
| Self-reported confidence (if scored) | Reporting whatever scores well | Uniform low confidence; post-hoc confidence |
| Hint-free completion | Not requesting hints when needed | Prolonged floundering; help avoidance (the *other* Aleven & Koedinger failure mode) |
| **Days with due-item retrieval + externalised steps** | **Attempting scheduled retrievals with visible reasoning** | **Residual: minimum-threshold hugging** |

**[F] The bottom row is the target state and it is not corruption-free — it is corruption-*bounded*.** No metric is un-Goodhartable. The design goal is to make the cheapest exploit *approximately equal to the desired behaviour*.

### 9.2 The known threat model from ITS research

Baker and colleagues have characterised this failure class for two decades. Gaming the system is defined as exploiting system properties to progress without meaningful engagement, canonically via systematic guessing and help abuse, and it is consistently associated with poorer learning gains in both the short and long term. Aleven & Koedinger's help-seeking modelling found that a majority of student actions in one tutor dataset represented unproductive help-seeking, with substantial hint abuse — students using hints to reach answers rather than to understand — *and* frequent help *avoidance* when help would have been beneficial.

**[F] Two implications for Externalize.** First, this is a solved-enough problem to build detectors for on day one. Second, the failure is bidirectional: over-use and under-use of help are both maladaptive, so a hint-usage metric has no good direction and cannot be optimised.

A directly relevant recent observation: an analysis of introductory biology sections reported students averaging around 88% on adaptive practice quizzes and around 54% on subsequent course examinations — a roughly 34-percentage-point gap, larger among the lowest performers. **[A] Small N (73), and I could not verify the peer-review status of this source, so treat it as illustrative rather than established.** But the pattern it illustrates — in-system practice performance wildly overstating external performance — is the exact failure Externalize's mastery model must not reproduce.

### 9.3 Detection instrumentation to build during validation

**[R] Build these before building any engagement mechanism.** They are cheap, they work at N=1, and without them no later experiment is interpretable.

| Detector | Signal | Threshold logic |
|---|---|---|
| Rapid guessing | Response time below a per-item-type floor derived from the learner's own reading speed | Flag; exclude from evidence |
| Hint abuse | Hint requested before any attempt, repeatedly, on items of established difficulty | Flag; downgrade evidence weight |
| Help avoidance | Repeated failure on an item type with zero help usage | Flag; prompt |
| Challenge avoidance | Learner-selected difficulty distribution shifting downward over time | Flag; this is the brief's prior incident |
| Interface-pattern memorisation | High accuracy on trained representation, low on untrained | **Primary transfer diagnostic** |
| Threshold hugging | Daily retrieval count clustering exactly at the qualifying minimum | Monitor only; may be benign |
| Confidence degeneracy | Variance of reported confidence collapsing | Flag; calibration channel is dead |
| Evidence provenance | Fraction of certifying evidence that was learner-selected | **Invariant: must be zero** |
| Fluency illusion | Gap between predicted and actual delayed performance | Track as a calibration outcome |
| Session-position accuracy decay | Accuracy declining across within-session position | Indicates rushing to close a goal gradient |

### 9.4 Detecting corruption without becoming adversarial

The brief asks how to detect gaming without making the product hostile to legitimate learners. **[R] Three principles:**

1. **Detectors adjust *evidence weight*, not *access*.** A flagged interaction stops counting toward mastery; it does not block the learner or trigger a warning. The learner keeps full access to everything; only the mastery model becomes sceptical.
2. **Never accuse.** Surface the *consequence* ("this one needs another look on a later day") rather than the *inference* ("you appear to be guessing"). The consequence is true regardless of intent, and a fast wrong answer from a distracted learner deserves the same treatment as one from a gaming learner.
3. **Make the honest path cheaper than the exploit.** The strongest anti-gaming measure is not detection; it is ensuring that guessing is *slower* than reasoning. If the interface requires externalised steps, a guess costs as much interaction as an attempt, and the incentive to guess largely evaporates. **[F] This is the deepest reason the "externalize every intermediate state" doctrine is a good one: it is an anti-Goodhart architecture, not just a pedagogy.**

---

## 10. Proposed learning-aligned engagement loop

The brief asks whether a loop can be constructed with seven properties. **[F] Yes, with the caveat that only steps 2–4 rest on strong evidence; steps 1, 5, 6 and 7 rest on moderate, indirect, or absent evidence respectively.**

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
                    ▼                                          │
    ┌───────────────────────────────┐                          │
    │ 1. RETURN                     │                          │
    │  if–then plan (M-19, d=.65)   │                          │
    │  + one self-timed reminder    │                          │
    │  + zero-friction open (M-25)  │                          │
    │  + lapse-recovery set (M-23)  │                          │
    └───────────────┬───────────────┘                          │
                    ▼                                          │
    ┌───────────────────────────────┐                          │
    │ 2. APPROPRIATELY DIFFICULT    │   ── strongest evidence ──│
    │    RETRIEVAL                  │                          │
    │  due items at target recall   │                          │
    │  (M-01 g=.74, M-10)           │                          │
    │  interleaved rule-selection   │                          │
    │  varied representation (M-06) │                          │
    └───────────────┬───────────────┘                          │
                    ▼                                          │
    ┌───────────────────────────────┐                          │
    │ 3. VALID EVIDENCE             │                          │
    │  externalised steps (M-11)    │                          │
    │  system-selected items only   │                          │
    │  gaming detectors → weight    │                          │
    │  confidence before answer     │                          │
    └───────────────┬───────────────┘                          │
                    ▼                                          │
    ┌───────────────────────────────┐                          │
    │ 4. MEANINGFUL PROGRESS        │                          │
    │  capability state advances    │                          │
    │  ONLY on delayed unaided      │                          │
    │  success — and can regress    │                          │
    │  (M-27; informational         │                          │
    │   feedback d≈+.33, NOT        │                          │
    │   tangible reward d≈−.36)     │                          │
    └───────────────┬───────────────┘                          │
                    ▼                                          │
    ┌───────────────────────────────┐                          │
    │ 5. PROGRESS REINFORCES RETURN │                          │
    │  days-with-qualifying-        │                          │
    │  retrieval counter (M-21)     │                          │
    │  never decreases              ├──────────────────────────┘
    │  competence → SDT persistence │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │ 6. SCAFFOLDING DECREASES      │
    │  worked examples fade         │
    │  step-feedback → proof-level  │
    │  hints → error-location only  │
    │  metric: scaffold-free rate   │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │ 7. DEPENDENCE DECREASES       │
    │  cadence lengthens as         │
    │  half-lives lengthen          │
    │  explicit graduation state    │
    │  export + easy exit           │
    └───────────────────────────────┘
```

### 10.1 Where the loop is weakest

**[O] Step 5 is the load-bearing assumption and it is not established.** The claim is that *honest, evidence-backed progress is intrinsically reinforcing enough to sustain return without extrinsic reward*. The supporting evidence is: (a) positive informational feedback enhances free-choice behaviour at *d* ≈ 0.33; (b) SDT's competence-satisfaction account; (c) the counting-days RCT, where an extrinsic grade incentive was present. **[F] There is no study demonstrating that a purely informational progress signal sustains multi-month voluntary return in a self-directed adult.** If this assumption is false, the loop does not close and the product needs either an external commitment structure or extrinsic reward — and if it needs extrinsic reward, the Deci et al. results say the intrinsic motivation will erode. That is the central risk of the whole design.

**[O] Step 7 has essentially no evidence at all.** No located research measures whether an educational product can deliberately reduce its own usage without simply losing the user. This is a genuinely novel design goal, not an under-researched one.

---

## 11. Externalize-specific implementation concepts

Each specifies target, mechanism, evidence, corruption risk, failure modes, ethics, smallest test, and the metric triple.

### C-1 · Qualifying-day counter

- **Target behaviour:** distributed practice across days.
- **Causal mechanism:** makes spacing the reward-maximising strategy (M-21).
- **Evidence:** YeckehZaare & Resnick (2025) RCTs; spacing meta-analyses.
- **Measurement corruption:** minimum-threshold hugging; trivial-item farming if "qualifying" is loosely defined.
- **Definition:** a day qualifies when the learner attempts every due item (or ≥3 if the queue is large) *with externalised steps*, on system-selected items. Days with an empty queue qualify automatically.
- **Failure modes:** threshold becomes a ceiling; learner perceives it as a streak and imports streak anxiety anyway.
- **Ethics:** low risk provided the counter never decreases and is never framed as losable.
- **Smallest test:** alternating 3-week blocks, days-counter visible vs volume-counter visible; N=1 viable with a within-subject item-pool split.
- **Primary:** delayed retention of items practised per block. **Secondary:** distinct qualifying days. **Guardrail:** median retrievals per qualifying day (detect both hugging and bingeing).

### C-2 · Recovery set on return

- **Target:** return after lapse.
- **Mechanism:** removes the "already broken it" abandonment logic (M-23).
- **Evidence:** the top-performing arm of the Milkman megastudy.
- **Corruption:** deliberate lapsing to trigger easy sets — self-limiting, and detectable as a lapse-frequency increase.
- **Design:** on return after ≥2 missed days, present 5–8 previously-mastered items, no backlog, no summary of what was missed, and re-elicit the if–then plan at the end rather than the start.
- **Failure modes:** too easy → cadence dissolves; too explicit about the lapse → shame.
- **Ethics:** low.
- **Smallest test:** instrument every lapse and return; compare return latency before/after introducing recovery sets.
- **Primary:** 14-day retention post-return. **Secondary:** return-within-7-days rate. **Guardrail:** lapse frequency.

### C-3 · Capability states that regress

- **Target:** calibration; honest perceived competence.
- **Mechanism:** informational positive feedback (M-27); calibration (M-18).
- **Evidence:** Deci et al. positive-feedback arm; the delayed-JOL accuracy literature.
- **Corruption:** none, if the state advances only on delayed, unaided, system-selected success. **This is the single most important invariant in the design.**
- **Design:** three states per capability — *unevidenced / provisional / established*. Advance to established only after a successful unaided retrieval at ≥7 days. Regress to provisional on failure at any delay. Show the underlying evidence on tap (date, item, result).
- **Failure modes:** regression demoralises; learners may stop attempting delayed retrievals to protect their states — **this would be a serious corruption and must be watched for.**
- **Ethics:** high value; honesty is the product's core proposition.
- **Smallest test:** correlate displayed states against a blind, externally-constructed proof set at 30 days.
- **Primary:** state-vs-actual correlation (indicator validity). **Secondary:** session initiation. **Guardrail:** fraction of advances traceable to learner-selected evidence — must be zero.

### C-4 · If–then plan capture and verbatim reuse

- **Target:** session initiation.
- **Mechanism:** implementation intentions (M-19).
- **Evidence:** *d* = 0.65 across 94 tests.
- **Corruption:** none.
- **Design:** free-text cue field with a template. Store verbatim. The daily reminder is the learner's own sentence plus the due-item count. Re-elicit after every lapse and at temporal landmarks (M-32).
- **Failure modes:** stale plan referencing a routine the learner no longer has.
- **Ethics:** none; the plan is the learner's.
- **Smallest test:** ABAB, plan active vs dormant, 4 weeks each. **The single most tractable N=1 experiment in this report.**
- **Primary:** retrievals at scheduled intervals. **Secondary:** initiation rate. **Guardrail:** self-reported pressure/guilt.

### C-5 · Representation rotation for every rule

- **Target:** transfer; defeat of interface-pattern memorisation.
- **Mechanism:** contextual variability (M-06); the Cheng et al. abstract-plus-concrete finding.
- **Evidence:** moderate and indirect, but the *negative* evidence for abstract-only training is strong.
- **Corruption:** this mechanism *reduces* corruption; it is the primary defence against surface-pattern mastery.
- **Design:** every inference rule is practised in ≥4 forms — symbolic derivation, natural-language argument evaluation, step-validity judgement ("is this move licensed?"), and counterexample construction. Rotate across spaced encounters. Reserve one form, never used in training, as the transfer probe.
- **Failure modes:** learners perceive the forms as unrelated content; acquisition slows.
- **Ethics:** none.
- **Smallest test:** train two matched rule sets, one single-form and one multi-form; test both in the held-out form at 21 days.
- **Primary:** held-out-form accuracy. **Secondary:** items per session. **Guardrail:** acquisition-phase error rate.

### C-6 · Proof-completion feedback with error localisation

- **Target:** prevent guess-and-check; error-type reduction.
- **Mechanism:** feedback content over frequency (M-16); failure-driven scaffolding (M-17).
- **Evidence:** Wisniewski et al. heterogeneity; Kluger & DeNisi's negative third; Sinha & Kapur's failure-driven scaffolding result.
- **Corruption:** removes a major one (step-level hill-climbing).
- **Design:** during a graded proof, no per-step correctness. At submission: identify the first invalid step and name the *violated licensing condition*, not the correct move. Allow one retry before revealing a model solution.
- **Failure modes:** long proofs with an early error waste substantial effort and frustrate.
- **Ethics:** none, provided it is explained.
- **Smallest test:** step-immediate vs completion feedback on matched proofs; measure invalid-step attempt rate.
- **Primary:** delayed unaided completion. **Secondary:** proofs completed. **Guardrail:** invalid-step attempts per proof; abandonment rate.

### C-7 · Scaffold-free rate as the headline metric

- **Target:** reduced dependence.
- **Mechanism:** operationalises the brief's §9 property.
- **Evidence:** none directly; this is a proposed instrument, not a validated one.
- **Design:** proportion of proofs completed with zero hints, zero worked examples, zero step-feedback. Tracked monthly. Shown to the learner. **[R] This should be the number the team looks at first.**
- **Failure modes:** learner avoids help when help would be beneficial (the help-avoidance failure mode) in order to raise the number.
- **Ethics:** moderate — displaying it creates the avoidance incentive. **[R] Track it internally; display it only in aggregate and without a target.**
- **Smallest test:** track from day one; no experiment needed.
- **Primary:** it *is* a primary metric. **Guardrail:** help-avoidance detector rate.

### C-8 · Session end with an explicit stop

- **Target:** trust; anti-overrun.
- **Mechanism:** defined stopping points (M-26); credibility of the scheduler.
- **Evidence:** weak. Included because the cost is near-zero and the inverse (removing stopping points) is a known attention-engineering pattern.
- **Design:** when the due queue empties, state that the day's scheduled work is complete and stop. Optional continued practice is available but explicitly marked non-evidential.
- **Ethics:** actively positive.
- **Primary:** none. **Secondary:** session-completion rate. **Guardrail:** proportion of activity occurring in non-evidential mode (if very high, the scheduler is under-serving).

---

## 12. Smallest credible experiments, ranked by value of information

| # | Uncertainty | Design | Min. N | Duration | Primary outcome |
|---|---|---|---|---|---|
| **E-1** | Does an if–then plan raise initiation for *this* learner? | ABAB within-subject, plan active/dormant | **1** | 16 wks | Retrievals at scheduled intervals |
| **E-2** | Does the capability display actually predict capability? | Blind external proof set vs displayed states | **1** | 6 wks | State–performance correlation |
| **E-3** | Does representation rotation buy held-out transfer? | Matched rule sets, single vs multi-form, held-out probe | **1** (many items) | 8 wks | Held-out-form accuracy |
| **E-4** | Does step-level feedback cause guess-and-check? | Matched proofs, step vs completion feedback | **1** | 6 wks | Invalid-step attempts/proof; delayed completion |
| **E-5** | Days-counter vs volume-counter | Alternating 3-wk blocks, split item pools | 1 (weak) → 40 (real) | 12 wks | Delayed retention per block |
| **E-6** | Does the loop close without extrinsic reward? | Longitudinal observation with no reward layer | 1 | **6 months** | Voluntary return at month 6 |
| **E-7** | Recovery set vs backlog on return | Randomise per lapse event | 30+ | 12 wks | Post-return 14-day retention |
| **E-8** | Productive failure vs instruct-first | Matched rules, randomised order | 40+ | 8 wks | Delayed transfer |
| **E-9** | Interleaved vs blocked rule-selection | Matched rule clusters | 40+ | 12 wks | Rule-selection accuracy on unseen proofs |
| **E-10** | Does a reset-streak harm post-lapse return? | Reset vs no-reset counter | 200+ | **14 wks** (novelty U-curve) | Return rate conditional on a lapse |

**[R] Run E-1 through E-4 during the validation phase. They are all N=1-viable, all target the highest-uncertainty design decisions, and none requires building an engagement layer.**

**[R] Do not run E-10 until there is a reason to. It requires the most participants, the longest duration, and the report's recommendation is not to build the mechanism regardless of the outcome.**

### 12.1 Design notes that apply to all of them

- **Delayed tests are non-negotiable.** An immediate post-test measures the wrong construct. Minimum 7 days; prefer 21–30.
- **Held-out transfer probes must be constructed before training begins** and never used for practice, or they stop being transfer probes.
- **Any engagement experiment shorter than 10 weeks is measuring the novelty U-curve, not the steady state.**
- **Within-subject item-pool splitting is what makes N=1 work.** The learner is the block; items are the units. This is only valid if the scheduler treats the pools independently and does not leak between them.
- **Pre-register the analysis, even at N=1.** Especially at N=1 — the temptation to reinterpret is proportional to the noise.

---

## 13. Adversarial critique: the strongest case that these recommendations are wrong

Stated as strongly as I can make it, because the brief asks for material disagreement to be preserved rather than resolved.

### 13.1 "You are mistaking practice for learning"

Every Tier-1 recommendation increases *scheduled retrieval attempts*. The evidence that scheduled retrieval attempts produce retention comes overwhelmingly from studies where the material is verbal pairs and the test is recall of those pairs. **Proof construction is not recall.** It is search over a rule space under constraints. It is entirely possible that spacing and retrieval effects, which are effects on *trace strength*, have little to do with the acquisition of a *search strategy* — and that the whole apparatus recommended here is optimising a variable that does not bind.

The supporting evidence for this critique is uncomfortable: Ebersbach & Barzagar Nazari found no robust distributed-practice effect on retention of mathematical *procedures*; the mathematics spacing effect (*g* = 0.26) is half the general effect; the mathematics interleaving effect (*g* = 0.34) is likewise attenuated; and the one large field test of interleaving found roughly nothing at year-end. **The pattern is that the closer the material gets to procedural mathematics, the smaller these effects become — and formal logic is more procedural than arithmetic.**

**Response.** Partially conceded. This is why C-5 (representation rotation) and the transfer probe are prioritised, and why *scaffold-free rate* rather than retrieval accuracy is proposed as the headline metric. But **[O] this remains a live and material threat to the entire design**, and no located evidence resolves it. It is the first thing a fourth research commission should investigate.

### 13.2 "The strongest effects are too small or too context-specific to justify any product complexity"

A *d* of 0.3–0.5 in a controlled study with a captive population and a graded incentive may correspond to approximately nothing in unsupervised voluntary use. Voluntary-uptake data are damning: in one distributed-practice study, only 41% of students did the recommended optional practice at all, and *fewer* did so in the distributed condition. The megastudy found 8% post-intervention persistence. The best notification bandit ever built bought 0.5% DAU.

**A simpler product with excellent pedagogy and no behavioural machinery might outperform this design**, simply by being smaller, faster, more comprehensible and less likely to break. Every mechanism above is a component that can fail, confuse, or corrupt the measurement.

**Response.** Substantially conceded, and it drives the recommendation to build almost nothing in the validation phase. But note the asymmetry: the Tier-1 list is short, and most of its items (if–then plans, friction removal, honest progress) are near-zero-complexity. The argument bites hardest against M-04, M-08, M-24 and the entire reward layer — which are already rejected or deferred.

### 13.3 "Refusing the effective mechanisms is a values choice dressed as an evidence claim"

Obstruction works (M-42, strong RCT). Loss framing sometimes works. Notification optimisation works a little. This report declines all three and offers evidential reasons — but the evidential reasons are noticeably convenient. **A sceptic should suspect that the conclusion "the ethical mechanisms are also the effective ones" is too tidy to be true, and that motivated reasoning is doing work.**

**Response.** The tidiness is real and I flag it as a possible bias in my own analysis. The specific defence is that the rejections rest on *different* grounds in each case: M-42 is rejected on measurement and objective-function grounds while conceding it works; M-22 is rejected because the mechanism decomposes and the useful half is available separately; M-30 is rejected on direct evidence of harm to the outcome we want. Only M-39 and M-31a are rejected on effectiveness grounds. **[R] A reader should weight §6.1 heavily, since it is where the report concedes most against its own conclusion.**

### 13.4 "Rejecting XP throws away the only thing that reliably gets people to open the app"

The undermining literature is about *free-choice persistence after reward withdrawal*. If Externalize never withdraws the reward, the undermining result may be irrelevant. Duolingo has an XP system, a league system, and a streak, and has an engagement profile that no purely-informational learning product has ever matched. The counterfactual "an honest product with no rewards would do as well" is not evidenced anywhere.

**Response.** This is the strongest argument against §5's rejection list and I cannot fully rebut it. Two partial replies: (a) Duolingo's engagement is not evidence about *learning*, and this report's governing principle makes that distinction decisive; (b) Hanus & Fox's longitudinal comparison found the gamified course produced *declining* motivation over a semester, which is the closest thing to a controlled test and it does not favour the XP position. But **[O] the possibility that a reward-free design simply fails to retain anyone is not ruled out**, and E-6 is designed to detect it.

### 13.5 "Adaptive scheduling will make the curriculum incoherent"

A spaced scheduler produces sessions that are bags of fragments. In a domain where the *structure* matters — where natural deduction is a system, not a list — this may actively impede the formation of the integrated schema that constitutes real understanding. The learner never sees the shape of the thing.

**Response.** Conceded as a real risk with no located evidence either way. **[R] Mitigation: keep a structural spine — periodic "whole system" sessions where the learner constructs a proof requiring many rules — outside the spaced queue.** This is untested.

### 13.6 "You are importing results from populations that share nothing with the target user"

The target user is a self-directed adult, unpaid, unsupervised, on a phone, learning symbolic logic voluntarily. The evidence base is: undergraduates in exchange for course credit; gym members; K-12 mathematics students; paid experimental participants; and language-app users pursuing a goal with far higher social utility than propositional logic. **There is no meaningful population overlap anywhere in this report.**

**Response.** Fully conceded. This is stated in §3.2 and it is the most honest thing in the document. Every effect size quoted should be discounted for it, and I have no principled discount factor to offer.

### 13.7 "The desirable-difficulty programme will simply make the product unpleasant"

Interleaving, productive failure, withheld feedback, delayed spacing, regressing progress indicators, and no rewards. **This describes a product that is unpleasant to use in every dimension, for a learner with no external obligation to use it.** The learning-science-optimal product may be a product nobody opens twice, and a product nobody opens produces exactly zero learning regardless of its effect sizes.

**Response.** This is, in my assessment, the most serious critique in this section, more serious than 13.1. It is the reason M-07 is classified as *context-dependent* rather than as a governing principle, and the reason *voluntary return rate* appears as a guardrail on every difficulty-increasing mechanism. **[R] Treat voluntary return as a hard constraint, not an objective: any difficulty increase that reduces it below baseline is rejected regardless of its retention effect.** That is a coherent way to hold the governing principle ("engagement is instrumental") without letting it license a product that is never used.

---

## 14. Open questions

Material uncertainties this investigation did not resolve, ordered by how much they would change the design.

1. **[O] Do spacing and retrieval effects hold for proof construction?** The procedural-mathematics attenuation pattern (§13.1) suggests they may not. *Highest priority.* Resolvable with a well-designed cohort study; not resolvable at N=1.
2. **[O] Can honest, evidence-backed progress alone sustain multi-month voluntary return in an unsupported adult?** The loop in §10 depends on it and nothing establishes it. E-6 addresses it weakly.
3. **[O] What is the right definition of "criterion" for a procedural skill in successive relearning?** The literature's answer (correct recall of a pair) does not translate.
4. **[O] Does a never-decreasing day counter produce the same cadence benefit as a reset streak?** This is the decomposition the whole recommendation rests on and it is untested. If the loss framing turns out to be doing most of the work, §5's Tier 1 loses its top item.
5. **[O] Does representational variability rescue transfer in formal logic specifically?** Cheng et al. is 40 years old, used the Wason selection task, and predates modern replication norms.
6. **[O] What does forgetting look like for a *rule* as opposed to an *item*?** Half-life models assume item independence. Inference rules are not independent — they compose, and practising one may maintain another. No located model handles this.
7. **[O] Is there a measurable graduation state, and what happens after it?** No located research on deliberately reducing product dependence.
8. **[O] Does the "externalize every intermediate state" doctrine impose a throughput cost that outweighs its measurement and self-explanation benefits?** Bisra et al. raise exactly this question and leave it open. Retention-per-minute (§2.7) is the metric that would answer it.
9. **[O] At what competence level should scaffolds be withdrawn?** Expertise reversal is established in principle and unspecified in practice for this domain.
10. **[O] Does interleaving help or harm the advanced learner?** The field data suggest possible harm at the top of the distribution — and Externalize's validation user is likely at the top.
11. **[O] How much does the novelty U-curve apply to non-gamified products?** Rodrigues et al. measured gamified systems; whether an unadorned tool shows the same 4-week decline and 6–10-week recovery is unknown.
12. **[O] Are the gaming detectors from ITS research transferable to a single-user context?** They were developed on classroom populations with base rates; at N=1 there is no population to calibrate against.

---

## 15. Bibliography

Ordered by section relevance. DOIs and stable links given where located. Entries marked **[industry]** are practitioner or vendor sources and carry correspondingly low evidential weight.

### Spacing, retrieval, relearning

- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin*, 132(3), 354–380.
- Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. *Psychological Science*, 19(11), 1095–1102. https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf
- Latimier, A., Peyre, H., & Ramus, F. (2021). A meta-analytic review of the benefit of spacing out retrieval practice episodes on retention. *Educational Psychology Review*, 33, 959–987. https://eric.ed.gov/?id=EJ1310148 · http://www.lscp.net/persons/ramus/docs/EPR20.pdf
- Mawson, R. D., & Kang, S. H. K. (2025). The distributed practice effect on classroom learning: A meta-analytic review of applied research. *Behavioral Sciences*, 15(6), 771. https://doi.org/10.3390/bs15060771
- Meta-analytic review of spacing and retrieval practice for mathematics learning (2025). *Educational Psychology Review*. https://doi.org/10.1007/s10648-025-10035-1
- Rowland, C. A. (2014). The effect of testing versus restudy on retention. *Psychological Bulletin*, 140(6), 1432–1463.
- Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research*, 87(3), 659–701.
- Pan, S. C., & Rickard, T. C. (2018). Transfer of test-enhanced learning: Meta-analytic review and synthesis. *Psychological Bulletin*, 144(7), 710–756. https://doi.org/10.1037/bul0000151
- Rawson, K. A., & Dunlosky, J. (2011). Optimizing schedules of retrieval practice for durable and efficient learning: How much is enough? *JEP: General*, 140(3), 283–302.
- Rawson, K. A., Dunlosky, J., & Sciartelli, S. M. (2013). The power of successive relearning. *Educational Psychology Review*, 25(4), 523–548. https://doi.org/10.1007/s10648-013-9240-4
- Rawson, K. A., Vaughn, K. E., Walsh, M., & Dunlosky, J. (2018). Investigating and explaining the effects of successive relearning on long-term retention. *JEP: Applied*, 24(1), 57–71.
- Rawson, K. A., & Dunlosky, J. (2022). Successive relearning: An underexplored but potent technique. *Current Directions in Psychological Science*. https://doi.org/10.1177/09637214221100484
- Settles, B., & Meeder, B. (2016). A trainable spaced repetition model for language learning. *ACL 2016*, 1848–1858. https://doi.org/10.18653/v1/P16-1174 · https://research.duolingo.com/papers/settles.acl16.pdf

### Practice structure, difficulty, transfer

- Brunmair, M., & Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. *Psychological Bulletin*, 145(11), 1029–1052. https://doi.org/10.1037/bul0000209
- Firth, J., Rivers, I., & Boyle, J. (2021). A systematic review of interleaving as a concept learning strategy. *Review of Education*. https://doi.org/10.1002/rev3.3266
- EdWorkingPaper (2023). The long-term distributional impacts of a full-year interleaving intervention. https://edworkingpapers.com/sites/default/files/ai23-876.pdf
- Wilson, R. C., Shenhav, A., Straccia, M., & Cohen, J. D. (2019). The Eighty Five Percent Rule for optimal learning. *Nature Communications*, 10, 4646. https://doi.org/10.1038/s41467-019-12552-4
- Sinha, T., & Kapur, M. (2021). When problem solving followed by instruction works: Evidence for productive failure. *Review of Educational Research*, 91(5), 761–798. https://doi.org/10.3102/00346543211019105
- Sinha, T., & Kapur, M. (2021b). Robust effects of the efficacy of explicit failure-driven scaffolding in problem solving prior to instruction. *Learning and Instruction*. https://doi.org/10.1016/j.learninstruc.2021.101488
- Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. *Educational Psychology Review*, 30(3), 703–725. https://doi.org/10.1007/s10648-018-9434-x
- Pan, S. C., & Carpenter, S. K. (2023). Prequestioning and pretesting effects. *Educational Psychology Review*, 35, 97. https://doi.org/10.1007/s10648-023-09814-5
- The effect of prequestions on learning: A multilevel meta-analysis (2025). *Educational Psychology Review*. https://doi.org/10.1007/s10648-025-10075-7
- Pan, S. C., & Sana, F. (2021). Pretesting versus posttesting. *JEP: Applied*, 27(2), 237–257. https://doi.org/10.1037/xap0000345

### Feedback, metacognition, calibration

- Kluger, A. N., & DeNisi, A. (1996). The effects of feedback interventions on performance. *Psychological Bulletin*, 119(2), 254–284.
- Wisniewski, B., Zierer, K., & Hattie, J. (2020). The power of feedback revisited: A meta-analysis of educational feedback research. *Frontiers in Psychology*, 10, 3087. https://doi.org/10.3389/fpsyg.2019.03087
- Rhodes, M. G., & Tauber, S. K. (2011). The influence of delaying judgments of learning on metacognitive accuracy: A meta-analytic review. *Psychological Bulletin*, 137(1), 131–148. https://pubmed.ncbi.nlm.nih.gov/21219059/
- Calibrating calibration: A meta-analysis of learning strategy instruction interventions to improve metacognitive monitoring accuracy (2021).
- Delayed metacomprehension judgments do not directly improve learning from texts (2023). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10381644/

### Tutoring systems, measurement integrity, ed-tech

- VanLehn, K. (2011). The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems. *Educational Psychologist*, 46(4), 197–221. https://doi.org/10.1080/00461520.2011.611369
- Baker, R. S. J. d., Corbett, A. T., & Koedinger, K. R. (2004). Detecting student misuse of intelligent tutoring systems. *ITS 2004*, 531–540.
- Baker, R. S. J. d., et al. (2006). Adapting to when students game an intelligent tutoring system. *ITS 2006*.
- Baker, R. S. J. d., Mitrović, A., & Mathews, M. (2010). Detecting gaming the system in constraint-based tutors. *UMAP 2010*, 267–278. https://doi.org/10.1007/978-3-642-13470-8_25
- Baker, R. S., D'Mello, S., Rodrigo, M. M. T., & Graesser, A. C. (2010). Better to be frustrated than bored. *IJHCS*, 68(4), 223–241.
- Aleven, V., & Koedinger, K. R. Help-seeking modelling in the Cognitive Tutor (production-rule help-seeking model; hint abuse and help avoidance).
- Understanding gaming the system by analyzing self-regulated learning in think-aloud protocols (2026). *LAK26*. https://doi.org/10.1145/3785022.3785025
- Schunn, C. D., & Patchan, M. (2009). *An evaluation of accelerated learning in the CMU Open Learning Initiative course "Logic & Proofs."* LRDC, University of Pittsburgh.
- What Works Clearinghouse. Open Learning Initiative intervention report. https://files.eric.ed.gov/fulltext/ED602844.pdf
- Lovett, M., Meyer, O., & Thille, C. (2008). The Open Learning Initiative: Measuring the effectiveness of the OLI statistics course in accelerating student learning. *JIME*, 2008(1).
- Steenbergen-Hu, S., & Cooper, H. (2013). Meta-analysis of the effectiveness of intelligent tutoring systems on K-12 students' mathematical learning.

### Formal reasoning and transfer

- Cheng, P. W., Holyoak, K. J., Nisbett, R. E., & Oliver, L. M. (1986). Pragmatic versus syntactic approaches to training deductive reasoning. *Cognitive Psychology*, 18(3), 293–328. https://doi.org/10.1016/0010-0285(86)90002-2 · https://reasoninglab.psych.ucla.edu/wp-content/uploads/sites/273/2021/04/Cheng_etal_1986_PragmaticVsSyntactic.pdf

### Motivation, habit, behaviour change

- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627–668. https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf
- Deci, E. L., Koestner, R., & Ryan, R. M. (2001). Extrinsic rewards and intrinsic motivation in education: Reconsidered once again. *Review of Educational Research*, 71(1), 1–27. https://doi.org/10.3102/00346543071001001
- Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. *Advances in Experimental Social Psychology*, 38, 69–119. https://doi.org/10.1016/S0065-2601(06)38002-1
- Milkman, K. L., Gromet, D., Ho, H., et al. (2021). Megastudies improve the impact of applied behavioural science. *Nature*, 600, 478–483. https://doi.org/10.1038/s41586-021-04128-4
- Milkman, K. L., Minson, J. A., & Volpp, K. G. M. (2014). Holding the *Hunger Games* hostage at the gym: An evaluation of temptation bundling. *Management Science*, 60(2), 283–299. https://doi.org/10.1287/mnsc.2013.1784
- Kirgios, E. L., Mandel, G. H., Park, Y., Milkman, K. L., Gromet, D. M., Kay, J. S., & Duckworth, A. L. (2020). Teaching temptation bundling to boost exercise: A field experiment. *OBHDP*. https://doi.org/10.1016/j.obhdp.2020.09.006
- Effects of habit formation interventions on physical activity habit strength: meta-analysis and meta-regression (2023). *IJBNPA*. https://doi.org/10.1186/s12966-023-01493-3
- Kivetz, R., Urminsky, O., & Zheng, Y. (2006). The goal-gradient hypothesis resurrected. *Journal of Marketing Research*, 43(1), 39–58. https://doi.org/10.1509/jmkr.43.1.39
- Nunes, J. C., & Drèze, X. (2006). The endowed progress effect: How artificial advancement increases effort. *Journal of Consumer Research*, 32(4), 504–512.
- Shen, L., Fishbach, A., & Hsee, C. K. (2015). The motivating-uncertainty effect. *Journal of Consumer Research*, 41(5), 1301–1315. https://doi.org/10.1086/679418
- Shen, L., Hsee, C. K., & Talloen, J. H. (2019). The fun and function of uncertainty: Uncertain incentives reinforce repetition decisions. *Journal of Consumer Research*.
- Fryer, R. G., Levitt, S. D., List, J. A., & Sadoff, S. (2022). Enhancing the efficacy of teacher incentives through framing: A field experiment. *AEJ: Policy*, 14(4), 269–299. https://doi.org/10.1257/pol.20190287
- Fryer, R. G., Levitt, S. D., List, J. A., & Sadoff, S. (2012). Enhancing the efficacy of teacher incentives through loss aversion. *NBER WP 18237*. https://www.nber.org/papers/w18237

### Gamification, streaks, engagement engineering

- Sailer, M., & Homner, L. (2020). The gamification of learning: A meta-analysis. *Educational Psychology Review*, 32, 77–112. https://doi.org/10.1007/s10648-019-09498-w
- Hamari, J., Koivisto, J., & Sarsa, H. (2014). Does gamification work? A literature review of empirical studies on gamification. *HICSS*.
- Hanus, M. D., & Fox, J. (2015). Assessing the effects of gamification in the classroom: A longitudinal study. *Computers & Education*, 80, 152–161. https://doi.org/10.1016/j.compedu.2014.08.019
- Rodrigues, L., Pereira, F. D., Toda, A. M., et al. (2022). Gamification suffers from the novelty effect but benefits from the familiarization effect. *IJETHE*, 19, 13. https://doi.org/10.1186/s41239-021-00314-6
- Examining the effectiveness of gamification as a tool promoting teaching and learning in educational settings: a meta-analysis (2023). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10591086/
- More competition, less interaction: gamifying lectures using a leaderboard reduces female students' social engagement (2025). *JCHE*. https://doi.org/10.1007/s12528-025-09438-4
- YeckehZaare, I., & Resnick, P. (2025). Counting days is a spacing incentive that unlocks the potential of low GPA students. *npj Science of Learning*, 10. https://doi.org/10.1038/s41539-025-00322-5
- Yancey, K. P., & Settles, B. (2020). A sleeping, recovering bandit algorithm for optimizing recurring notifications. *KDD '20*. https://doi.org/10.1145/3394486.3403351 · https://research.duolingo.com/papers/yancey.kdd20.pdf
- Smith, B., Jiang, X., & Peters, R. (2024). The effectiveness of Duolingo in developing receptive and productive language knowledge and proficiency. *Language Learning & Technology*, 28(1).
- Duolingo research index (data and papers). https://research.duolingo.com/
- **[industry]** Shuttleworth, J. Behind the product: Duolingo streaks (podcast interview; streak experiment history, XP→lesson streak change, explanatory-copy experiment).
- **[industry]** StriveCloud, Duolingo gamification analysis (streak wager and retention claims).
- **[industry]** Duolingo Research Report DRR-24-07, *Educators' perceptions of Duolingo efficacy* — **survey of opinions, not an outcome study.**

### Gambling, dark patterns, manipulation

- Pisklak, J. M., Yong, J. J. H., & Spetch, M. L. (2020). The near-miss effect in slot machines: A review and experimental analysis over half a century later. *Journal of Gambling Studies*, 36, 611–632. https://doi.org/10.1007/s10899-019-09891-8
- Cherkasova, M. V., et al. (2024). The near-miss effect in online slot machine gambling: A series of conceptual replications. *Journal of Experimental Psychology* (APA). https://psycnet.apa.org/fulltext/2024-81139-001.pdf
- Scratch card near-miss outcomes increase the urge to gamble, but do not impact further gambling behaviour: a pre-registered replication and extension.
- Clark, L., Lawrence, A. J., Astley-Jones, F., & Gray, N. (2009). Gambling near-misses enhance motivation to gamble. *Neuron*, 61(3), 481–490.
- Luguri, J., & Strahilevitz, L. J. (2021). Shining a light on dark patterns. *Journal of Legal Analysis*, 13(1), 43–109. https://doi.org/10.1093/jla/laaa006
- Nouwens, M., et al. (2020). Dark patterns after the GDPR: Scraping consent pop-ups and demonstrating their influence. *CHI 2020*.

### Sources consulted and down-weighted

The following categories were reviewed and are deliberately given low or zero evidential weight in this report, with reasons: vendor marketing content on gamification platforms (no disclosed method); practitioner blog syntheses of Skinner's operant work applied to apps (no human product data); survey-of-perceptions studies presented as efficacy evidence; gamification meta-analyses reporting implausible moderator effect sizes (*d* > 4), which indicate primary-literature quality problems rather than large effects.

---

## Appendix A — Claim-by-claim epistemic register

| Claim | Category | Confidence | Basis |
|---|---|---|---|
| Spaced retrieval improves delayed retention | **[K]** | High | Multiple independent meta-analyses |
| Spacing/retrieval effects hold for proof construction | **[O]** | Low | Procedural-maths attenuation suggests caution |
| Transfer effects are ~half of retention effects and decay with distance | **[K]** | High | Pan & Rickard 2018 |
| Rewarding days rather than volume improves exam performance | **[F]** | Moderate | One RCT pair, modest N, graded incentive present |
| Reset-on-miss streaks cause post-lapse abandonment | **[A]** | Low-moderate | Qualitative reports; no controlled test located |
| A non-resetting day counter captures the cadence benefit | **[A]** | Low | Untested decomposition — the design's key gamble |
| Tangible rewards undermine intrinsic motivation | **[K]** | High | Deci et al. 1999; contested at margins |
| Informational positive feedback enhances free-choice behaviour | **[K]** | Moderate-high | Same meta-analysis, positive arm |
| Near-miss effects drive persistence | **[F] — rejected** | Moderate | Pre-registered null; mixed conceptual replications |
| Variable-ratio scheduling works in human product contexts | **[O]** | Very low | No located human field evidence |
| Obstruction patterns are highly effective | **[K]** | High | Luguri & Strahilevitz RCT |
| Honest progress alone sustains multi-month voluntary return | **[O]** | Very low | The loop's load-bearing untested assumption |
| Externalised intermediate states reduce Goodhart surface | **[F]** | Moderate | Reasoned from the ITS gaming literature; not directly tested |
| Abstract-only logic training transfers poorly | **[K]** | Moderate | Cheng et al. 1986; old, pre-replication-norms |
| Novelty effects follow a ~4–10 week U-curve | **[F]** | Moderate | One large quasi-experiment |
| ~8% of behavioural interventions persist post-intervention | **[K]** | High | Milkman et al. 2021 megastudy |

---

## Appendix B — What I would tell a fourth researcher to investigate

Lines of evidence I judge material and likely to be under-explored by parallel investigators:

1. **The procedural-materials attenuation pattern.** Spacing *g* drops from 0.74 (general) to 0.26 (mathematics); interleaving from 0.42 to 0.34 and to ~0.04 in the field. Someone should establish whether this is a materials effect, a measurement effect, or an ecological-validity effect, because the answer determines whether Externalize's entire scheduling premise holds.
2. **The formal-reasoning transfer literature** (Cheng, Holyoak, Nisbett; Lehman & Nisbett; Fong, Krantz & Nisbett on statistical reasoning training). Absent from the brief, and it is the literature that speaks most directly to whether a logic tutor can produce anything worth having.
3. **The help-*avoidance* failure mode.** The gaming literature is usually read as being about hint abuse. Aleven & Koedinger found avoidance was also prevalent, and avoidance is the failure mode that a "scaffold-free rate" metric would actively *cause*.
4. **The measurement-theoretic argument against manipulation.** I have not seen this framed anywhere in the engagement literature: that in a product whose asset is a valid learner model, manipulation is self-directed data poisoning. If correct, it converts an ethics argument into an engineering argument, which is far more robust to commercial pressure.
5. **Reward-withdrawal dynamics.** The undermining literature measures free choice *after* reward removal. Every product that adds gamification is implicitly betting it will never remove it. Someone should establish what happens to a learning product's user base when a reward layer is deprecated — this is a real, observable, repeated natural experiment across the ed-tech industry and I could not find it studied.

---

*End of independent submission. Findings are not decisions.*
