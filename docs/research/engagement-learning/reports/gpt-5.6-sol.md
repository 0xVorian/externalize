# Externalize: Engagement as an Instrument for Durable Mastery

## Independent frontier-model research submission

> **Governing principle:** Engagement is instrumental. Learning is the objective.

## Epistemic status

**Knowns** are project states specified by the Externalize brief or findings supported by relatively mature evidence. **Findings** are conclusions from this investigation. **Assumptions** are propositions that remain unvalidated for adult mobile symbolic-logic learning. **Recommendations** are research-backed design hypotheses, not product decisions. **Open questions** remain materially uncertain.

Evidence grades used here:

- **A:** replicated causal evidence and/or strong meta-analytic support relevant to learning.
- **B:** credible causal evidence, but important limits in population, outcome, duration, or domain.
- **C:** correlational, highly heterogeneous, short-term, indirect, or substantially extrapolated evidence.
- **D:** largely theoretical, industry folklore, or insufficient disclosed evidence.

No grade means “guaranteed to work in Externalize.” Symbolic logic on a phone is a distinctive combination of formal reasoning, interface mediation, repeated practice, and voluntary learning.

# 1. Executive synthesis

The strongest conclusion is not that Externalize should become more game-like. It is that **the learning algorithm and the engagement algorithm should become the same loop wherever possible**.

The most defensible mechanisms are retrieval practice, spacing, successive relearning, informative feedback, generation/self-explanation, adaptive scaffold fading, calibration training, and appropriately varied transfer probes. Retrieval practice produces not only retention benefits but meaningful transfer: a meta-analysis covering 192 transfer effects from 122 experiments found a mean transfer benefit of **d = 0.40**, though transfer varied substantially with the relationship between practiced and final tasks. Spacing is exceptionally well established, with a synthesis of 839 assessments showing that the spacing interval that maximizes retention depends on the desired retention interval. Successive relearning combines these two mechanisms by practicing to criterion and then regaining criterion across spaced sessions.

This changes how “engagement” should be conceptualized. A return is valuable when it causes a cognitively useful retrieval at an appropriate time. A streak is valuable only if preserving it requires useful learning evidence. A notification is valuable only if the session it triggers creates incremental durable learning. A progress animation is valuable only if the progress corresponds to evidence that survives delay, representation changes, reduced scaffolding, and novel problems.

A second strong conclusion is that **Externalize should optimize session initiation much more aggressively than it optimizes within-session continuation**. Habit evidence supports making initiation reliably cued and low-friction. Repetition in stable contexts increases automaticity; habit formation is highly variable and often much slower than popular “21-day” claims. The desirable habit is therefore something like **“after coffee, open Externalize and attempt my due retrieval set”**, not “solve formal logic automatically.”

Third, **scaffolding must decline as competence rises**. The project doctrine “externalize every intermediate state” is excellent as a novice-learning heuristic but is too strong as a permanent invariant. Adaptive fading of worked examples has produced superior delayed transfer relative to fixed fading and standard tutored problem solving, and expertise-reversal research predicts that supports useful to novices can become redundant or obstructive as knowledge grows. Genuine mastery should eventually include successful reasoning when Externalize no longer requires every intermediate state.

Fourth, **progress itself is potentially the best reward**, but only if the progress signal is epistemically expensive to obtain. Positive, informative competence feedback is much safer than arbitrary reward tokens. Feedback meta-analysis suggests meaningful average effects but large dependence on information content. Self-determination research likewise suggests that intrinsic interest and personally endorsed value are more favorable long-run motivational bases than externally controlled motivation. Expected tangible rewards can reduce subsequent free-choice intrinsic motivation under several contingencies, whereas positive feedback can increase it.

Fifth, commercially familiar engagement mechanisms split into three classes:

1. **Useful alignment tools:** implementation intentions, good defaults, low friction, stable cues, lapse recovery, meaningful progress, targeted notifications.
2. **Behaviorally potent but learning-unproven tools:** streaks, goal gradients, endowed progress, temptation bundling, social comparison, loss framing.
3. **Potent and structurally dangerous tools:** near misses, variable-ratio reinforcement, artificial scarcity, punitive losses, pseudo-currency escalation, and designs whose purpose is to remove stopping opportunities.

Notifications can causally increase proximal app opens without necessarily increasing durable engagement. Loss-framed incentives can increase target behavior while effects disappear after incentives stop. Near misses causally increase gambling persistence despite being objectively unsuccessful outcomes. These are demonstrations of behavioral control, not demonstrations of better education.

Sixth, **streaks deserve neither blanket rejection nor enthusiasm**. Experimental consumer-behavior work shows that merely representing a sequence as an intact versus broken logged streak changes subsequent behavior independent of actual behavioral history. This is compelling evidence that streak representation is behaviorally active. It is almost no evidence that streaks improve learning. It also implies a Goodhart problem: once the streak becomes a valued goal, the rational learner will do the minimum activity that preserves it. Externalize should therefore test an **evidence streak** or **return rhythm**, not an opening streak, and should make lapse repair cheap.

Seventh, **generic gamification is too heterogeneous to be treated as a mechanism**. Educational meta-analyses report positive average effects but substantial heterogeneity. Serious-game evidence shows learning and retention benefits in some comparisons without a reliable motivation advantage over conventional instruction. “Gamification works” is therefore an unusably coarse proposition.

Eighth, **attention engineering can directly damage learning**. Notifications can interrupt unrelated cognition even when users do not interact with the phone, and irrelevant “seductive details” have a small but reliable negative effect on learning. Every celebration, animation, sound, currency system, and narrative layer should therefore justify the working-memory and attentional resources it consumes.

Ninth, **Goodhart effects should be modeled as an adversarial optimization problem rather than treated as misconduct**. Intelligent-tutoring research documents systematic guessing and repeated hint requests used to advance without learning. Conversely, “wheel-spinning” research documents learners who persist but fail to master because they lack prerequisites, strategies, or effective instruction. Externalize must detect both excessive ease and unproductive difficulty.

Finally, the system should explicitly accept a commercially unusual endpoint: **successful learning may reduce future app dependence**. A learner who can reliably solve novel problems unaided, after delay, with calibrated confidence should be allowed to “graduate” capability areas rather than be artificially retained.

# 2. Important corrections and challenges to the research brief

## Challenge 1 — “Externalize every intermediate state” cannot remain universal

**Finding:** explicit reasoning is pedagogically useful during acquisition, but permanent mandatory externalization risks expertise reversal, excess cognitive load, and interface dependence.

**Recommendation:** reformulate the doctrine operationally as:

> Externalize enough intermediate state to make reasoning inspectable during acquisition; progressively withdraw compulsory externalization as independent competence emerges.

Externalization itself should become a scaffold whose removal is tested.

## Challenge 2 — the evidence hierarchy is too publication-type-centric

A meta-analysis can pool immediate tests, weak controls, heterogeneous outcomes, and biased studies. A small preregistered field experiment with a delayed transfer endpoint may be more decision-relevant than a broad meta-analysis of “engagement.”

Evidence should be graded jointly on:

**causal identification × learning endpoint × delay × transfer distance × population × task similarity × measurement integrity × replication.**

## Challenge 3 — “optimal scheduling” is known in principle, not yet for individual Externalize learners

Spacing is established. The proposition that Externalize can accurately predict each user's forgetting curve well enough to beat simpler scheduling rules is an **assumption**, not a known.

## Challenge 4 — capability visualization is itself an intervention

Making capability states visible can alter task choice, confidence reports, hint use, and willingness to attempt hard material. It is therefore not merely UI. Visible capability should be experimentally evaluated as a motivational and Goodhart intervention.

## Challenge 5 — habit formation should target initiation, not whole-task execution

Formal reasoning should remain deliberative. Habit science is best used to make **starting the correct learning episode automatic**, after which cognition should remain attentive.

## Challenge 6 — “redirecting” dark patterns toward learners' interests is plausible, not established

A mechanism's object can change without changing its collateral effects. A loss-framed streak tied to retrieval can still generate guilt. A variable reward after mastery can still shift motivation toward reward anticipation. A leaderboard based on transfer can still demoralize lower-ranked learners.

## Challenge 7 — “meaningful activity streak” does not solve Goodhart automatically

If learners select tasks, they can preserve a meaningful-retrieval streak by repeatedly retrieving their easiest mastered items. The system must control enough of the evidence distribution.

## Challenge 8 — more personalization is not automatically better

Interest personalization is promising, but personalized difficulty, timing, context, and content are separate hypotheses requiring validation.

## Challenge 9 — a good educational product needs stopping rules as much as continuation rules

F2P design often asks “how do we get one more action?” Externalize should also ask when the learner is cognitively saturated, already successful for today, or better served by sleep and spacing.

# 3. Evidence map

| Research tradition | Best-supported conclusion | Evidence | Externalize implication |
|---|---|---|---|
| Retrieval practice | Effortful retrieval improves retention and can transfer | A | Make recall/problem reconstruction a default session event |
| Spacing | Distributed encounters improve later memory; useful interval depends on retention horizon | A | Schedule returns around due learning, not arbitrary daily quotas |
| Successive relearning | Criterion retrieval repeated across spaced sessions is powerful | A− | Natural architecture for long-run capability maintenance |
| Generation / self-explanation | Generating rather than reading improves learning | A− | Require predictions, proof steps, explanations before reveal |
| Feedback | Meaningful average benefit, highly dependent on information | A− | Error-specific feedback should dominate praise/points |
| Worked examples / fading | Strong novice support; adaptive fading can improve delayed transfer | A−/B+ | Explicit-state doctrine should fade with competence |
| Productive failure | Problem solving before instruction can improve later learning under suitable designs | B+ | Short prediction/attempt phases may prime instruction |
| Calibration training | Monitoring accuracy is trainable | B+ | Confidence should be elicited and corrected |
| Autonomy / choice | Bounded agency can improve motivation and effort | B+ | Give agency without handing over certification evidence selection |
| Habits | Stable contexts and repetition build automaticity slowly and variably | B | Habitualize the start ritual |
| Implementation intentions | If-then plans improve goal attainment | B | “After X, I do my retrieval set” |
| Notifications | Strong proximal effects on opens; weak evidence for durable learning | B opens / D learning | Trigger useful due sessions; optimize learning per notification |
| Streaks | Logged representation causally alters behavior | B behavior / D learning | Evidence criteria plus forgiving recovery |
| Defaults | Strong context-dependent choice effects | A− choice / C learning | Make pedagogically valuable next action easiest |
| Goal gradient | Perceived proximity can accelerate action | B consumer behavior | Make genuine capability milestones proximal |
| Loss framing | Can change behavior, often transient | B behavior / D learning | High autonomy/guilt risk |
| Near miss / random rewards | Strong gambling persistence mechanisms | B gambling / D learning | Evidence of power, not suitability |
| Gamification | Positive average effects with major heterogeneity | B− | Decompose mechanics |
| Serious games | Modest learning/retention benefits; motivation advantage unreliable | B | Game shell optional |
| ITS/adaptive tutoring | Effectiveness varies by system/comparator | B | “Adaptive” is not itself evidence |
| ITS gaming / wheel-spinning | Interaction metrics can diverge from learning | B+ | Measurement integrity must be architectural |
| Seductive details / attention | Irrelevant engaging material can reduce learning | A− | Engagement flourishes carry cognitive cost |

# 4. Mechanism Arsenal

## Learning mechanisms

### 1. Retrieval practice
- **Provenance:** cognitive psychology.
- **Mechanism:** effortful retrieval strengthens later accessibility and retrieval routes.
- **Target:** retention, transfer.
- **Evidence:** A; transfer meta-analysis mean d≈0.40.
- **Durability:** strong delayed evidence.
- **External validity:** excellent conceptual fit, though much literature uses verbal materials.
- **Goodhart risk:** medium if learner chooses only easy retrieval.
- **Ethical risk:** low.
- **Externalize application:** each return begins with system-selected due retrieval/proof reconstruction probes.
- **Backfire:** identical repeated forms create item memorization.
- **Test:** retrieval vs matched restudy; delayed novel-form test.
- **Primary metric:** delayed unassisted transfer.
- **Secondary:** completion/return.
- **Guardrail:** repeated-item vs novel-item advantage.
- **Assessment:** **Strong candidate.**

### 2. Spaced practice
- **Mechanism:** delayed reactivation makes retrieval effortful and strengthens later memory.
- **Evidence:** A.
- **Externalize:** due queues using robust interval heuristics before sophisticated personalization.
- **Goodhart:** low.
- **Backfire:** excessive spacing creates repeated failure.
- **Test:** two preregistered spacing policies with equal attempts.
- **Primary:** 21/42-day retention.
- **Secondary:** due-session initiation.
- **Guardrail:** failure/frustration and practice burden.
- **Assessment:** **Strong candidate.**

### 3. Successive relearning
- **Mechanism:** attain criterion, then regain it across spaced sessions.
- **Evidence:** A−.
- **Externalize:** capability becomes maintained only after successful retrieval on multiple dates and varied forms.
- **Goodhart:** medium if criterion uses repeated identical items.
- **Backfire:** over-practice of narrow patterns.
- **Test:** criterion-once vs criterion-across-sessions.
- **Primary:** delayed novel transfer.
- **Secondary:** return.
- **Guardrail:** practice burden per retained capability.
- **Assessment:** **Strong candidate.**

### 4. Interleaving
- **Mechanism:** alternating confusable categories forces discrimination and strategy selection.
- **Evidence:** B+; moderator-dependent.
- **Externalize:** mix transformations, rule selection, counterexample identification and proof-step choices after initial acquisition.
- **Backfire:** premature interleaving overwhelms novices.
- **Primary:** novel rule-selection accuracy.
- **Assessment:** **Strong candidate after initial acquisition.**

### 5. Generation effect
- **Mechanism:** self-production creates richer encoding than reading.
- **Evidence:** A−; meta-analytic effect around 0.40 SD with substantial moderators.
- **Externalize:** predict a rewrite/proof step before reveal.
- **Goodhart:** medium if UI exposes patterns.
- **Backfire:** uncorrected generated misconceptions.
- **Assessment:** **Strong candidate.**

### 6. Self-explanation
- **Mechanism:** articulate conceptual relationships and infer missing links.
- **Evidence:** A−; meta-analytic g≈.55.
- **Externalize:** selective “Why is this transformation licensed?” prompts.
- **Goodhart:** boilerplate explanations.
- **Backfire:** excessive prompts interrupt flow.
- **Primary:** delayed transfer.
- **Guardrail:** explanation time without learning gain.
- **Assessment:** **Strong candidate, selectively deployed.**

### 7. Worked examples
- **Mechanism:** reduce extraneous search while novice schemas form.
- **Evidence:** A−.
- **Externalize:** inspectable proof traces with rule rationale.
- **Goodhart:** surface imitation.
- **Backfire:** passive reading/example dependence.
- **Assessment:** **Strong candidate for novices.**

### 8. Adaptive scaffold fading
- **Mechanism:** reduce examples/hints/required externalization as competence rises.
- **Evidence:** A−/B+.
- **Externalize:** progressively remove labels, candidate rules and forced intermediate-state entry.
- **Goodhart:** mastery model may fade too early.
- **Primary:** delayed unaided transfer.
- **Guardrail:** errors/frustration after fade.
- **Assessment:** **Strong candidate; major brief correction.**

### 9. Informative corrective feedback
- **Mechanism:** identifies error and relevant distinction/rule.
- **Evidence:** A−.
- **Externalize:** classify errors and provide minimal diagnostic feedback before answer reveal.
- **Goodhart:** answer dumping.
- **Primary:** recurrence of same error on delayed novel items.
- **Assessment:** **Strong candidate.**

### 10. Feedback timing / answer withholding
- **Evidence:** B+, heterogeneous.
- **Externalize:** immediate correctness/error-class signal, progressively explicit explanation after another attempt.
- **Goodhart:** bottom-out clicking.
- **Assessment:** **Context-dependent, likely hybrid.**

### 11. Productive failure
- **Mechanism:** initial attempt activates prior knowledge and exposes gaps.
- **Evidence:** B+; meta-analytic g≈.36 under suitable designs.
- **Externalize:** short attempt before new-rule explanation.
- **Goodhart:** do not reward struggle time.
- **Backfire:** novices infer hostility.
- **Assessment:** **Promising.**

### 12. Pretesting / prediction
- **Mechanism:** committing before instruction focuses attention.
- **Evidence:** B.
- **Externalize:** low-stakes prediction before explanation.
- **Goodhart:** random tapping.
- **Assessment:** **Promising.**

### 13. Mastery-based progression
- **Mechanism:** continue targeted work until criterion.
- **Evidence:** B+.
- **Externalize:** unlock using multiple forms, delayed evidence and independent trials.
- **Goodhart:** very high if criterion transparent/easy.
- **Backfire:** trapped wheel-spinning.
- **Assessment:** **Strong candidate only with integrity and escape routes.**

### 14. Overlearning
- **Evidence:** B; moderate retention benefits, task/delay dependent.
- **Externalize:** limited extra practice for foundational primitives, preferably spaced.
- **Goodhart:** easy XP farming.
- **Assessment:** **Context-dependent.**

### 15. Representational/contextual variability
- **Mechanism:** prevents knowledge binding to one cue pattern.
- **Evidence:** B.
- **Externalize:** vary notation, layout, wording, equivalence direction and distractors.
- **Goodhart:** actively protects against interface memorization.
- **Backfire:** too much variability too early.
- **Assessment:** **Strong candidate.**

### 16. Confidence judgment + calibration feedback
- **Mechanism:** explicit prediction followed by outcome comparison.
- **Evidence:** B+.
- **Externalize:** probabilistic confidence sampling; never directly reward confidence reports.
- **Goodhart:** reporting middling confidence to optimize score.
- **Primary:** calibration/Brier error on delayed tests.
- **Assessment:** **Strong candidate.**

### 17. Interest personalization
- **Evidence:** B; promising effects on interest/retention, thinner transfer evidence.
- **Externalize:** personalize scenario framing while keeping formal transfer tests standardized.
- **Goodhart:** optimizing fun topic rather than skill.
- **Backfire:** seductive details.
- **Assessment:** **Promising but easy to overstate.**

### 18. Curiosity / information gaps
- **Mechanism:** uncertainty plus anticipated resolution creates attentional value.
- **Evidence:** B−/C+.
- **Externalize:** genuine logic questions: equivalence prediction, proof completion, counterexample search.
- **Backfire:** ornamental mystery adds load.
- **Assessment:** **Promising.**

## Motivation, habit, return and progress mechanisms

### 19. Autonomy-supportive bounded choice
- **Evidence:** B+.
- **Externalize:** choose topic order among diagnostically equivalent options, session length or representation—not certification difficulty.
- **Goodhart:** severe if learner controls evidence selection.
- **Assessment:** **Strong candidate with protected evidence selection.**

### 20. Competence feedback / meaningful progress
- **Evidence:** B+.
- **Externalize:** capability states move only after delayed independent evidence; describe what learner can now do.
- **Goodhart:** progress thresholds invite gaming.
- **Assessment:** **Strong candidate.**

### 21. Implementation intentions
- **Mechanism:** if-then cue links context to initiation.
- **Evidence:** B; classic meta-analysis d≈.65.
- **Externalize:** “After lunch/on train/after coffee, do my five-minute due set.”
- **Goodhart:** low.
- **Assessment:** **Strong low-cost candidate.**

### 22. Stable-context initiation ritual
- **Evidence:** B.
- **Externalize:** one-tap proof pulse in a self-chosen recurring context.
- **Backfire:** travel/weekend context disruption.
- **Assessment:** **Strong candidate.**

### 23. Default next action + friction reduction
- **Evidence:** A− for choice architecture; learning consequence indirect.
- **Externalize:** home screen defaults to highest expected-value learning action.
- **Goodhart:** dangerous if default optimizes activity rather than learning.
- **Assessment:** **Strong candidate.**

### 24. Specific proximal goals / subgoals
- **Evidence:** B+.
- **Externalize:** “Regain criterion on contraposition,” not “earn 50 XP.”
- **Goodhart:** stated quantity becomes optimization target.
- **Assessment:** **Strong candidate.**

### 25. Goal-gradient effect
- **Evidence:** B for consumer behavior.
- **Externalize:** authentic capability arcs with clear distance to meaningful milestone.
- **Goodhart:** threshold farming.
- **Backfire:** post-goal drop-off.
- **Assessment:** **Promising if attached to real capability.**

### 26. Endowed progress
- **Evidence:** B for loyalty behavior.
- **Externalize:** credit genuine diagnostic prior knowledge, never fake mastery.
- **Ethics:** problematic if progress is fictitious.
- **Assessment:** **Context-dependent.**

### 27. Fresh-start effects
- **Evidence:** C+/B−, primarily archival/observational.
- **Externalize:** lapse-recovery framing around natural landmarks without erasing capability.
- **Backfire:** postponing restart until Monday.
- **Assessment:** **Promising, cheap.**

### 28. Temptation bundling
- **Evidence:** B; behavioral effects can decay.
- **Externalize:** optional satisfying logic puzzles or visual proof reveals after a meaningful due set.
- **Goodhart:** rushing learning to reach reward.
- **Assessment:** **Context-dependent.**

### 29. Commitment devices
- **Evidence:** B/C, domain dependent.
- **Externalize:** reversible, user-authored weekly retrieval commitment; no monetary penalty.
- **Backfire:** commitment failure causes abandonment.
- **Assessment:** **Promising only as opt-in.**

### 30. Challenge-skill calibration / flow conditions
- **Evidence:** C+/B−; much correlational.
- **Externalize:** select problems by expected learning gain and uncertainty, not fixed success-rate target.
- **Goodhart:** fixed accuracy targets cause under-challenge.
- **Assessment:** **Promising principle; flow rhetoric exceeds evidence.**

### 31. Streaks
- **Evidence:** B for behavior / D for learning.
- **Externalize:** if tested, streak requires a system-selected meaningful retrieval event.
- **Goodhart:** very high.
- **Ethics:** guilt/loss pressure.
- **Backfire:** minimum activity and post-break abandonment.
- **Assessment:** **Promising but dangerous to measurement.**

### 32. Streak repair / lapse recovery
- **Evidence:** B−.
- **Externalize:** automatic grace or short recovery retrieval; no purchased freeze economy.
- **Assessment:** **Stronger than punitive streak loss.**

### 33. Targeted notifications
- **Evidence:** B for immediate opens; D for learning.
- **Externalize:** notify when a high-value retrieval is due within an opted-in window.
- **Goodhart:** CTR optimization.
- **Backfire:** interruption, habituation, reactance.
- **Primary:** incremental retained knowledge per notification.
- **Assessment:** **Promising only with learning-value optimization.**

### 34. Unfinished-task resumption / deliberate stopping points
- **Evidence:** B−; resumption tendency better supported than Zeigarnik memory advantage.
- **Externalize:** finish after real micro-success while previewing the next unresolved question.
- **Ethics:** do not artificially withhold earned completion.
- **Assessment:** **Speculative; reject Zeigarnik folklore.**

## Gamification, commercial and dark-pattern mechanisms

### 35. XP / points / tangible performance rewards
- **Evidence:** B for behavior, mixed motivation consequences.
- **Externalize:** if used, cosmetic and downstream of protected learning evidence; never a mastery input.
- **Goodhart:** extreme.
- **Backfire:** converts logic into point production.
- **Assessment:** **Context-dependent; activity XP probably counterproductive.**

### 36. Badges, achievements and collections
- **Evidence:** C+/B−; component evidence inconsistent.
- **Externalize:** only for epistemically meaningful feats, separate from mastery scoring.
- **Goodhart:** achievement hunting.
- **Assessment:** **Insufficient evidence as a priority.**

### 37. Leaderboards / social comparison
- **Evidence:** B for behavior / C for learning.
- **Externalize:** prefer private self-comparison or cooperative mastery challenges; avoid global rank.
- **Goodhart:** farming, cheating, challenge avoidance.
- **Ethics:** anxiety/status pressure.
- **Assessment:** **Effective but dangerous; weak priority.**

### 38. Loss framing / endowed loss
- **Evidence:** B for behavior / D for learning; effects can vanish after incentive removal.
- **Externalize:** if tested, only mild optional cosmetic loss, never capability or paid value.
- **Goodhart:** minimum compliance.
- **Ethics:** guilt/anxiety.
- **Assessment:** **Effective but dangerous.**

### 39. Lottery rewards
- **Evidence:** B−; not reliably superior even in behavior-change trials.
- **Externalize:** little justification.
- **Ethics:** gambling-like structure.
- **Assessment:** **Insufficient evidence / low priority.**

### 40. Variable-ratio / surprise reinforcement
- **Evidence:** B for gambling theory / D for education.
- **Externalize:** no core progression using random-ratio reinforcement; at most rare optional cosmetic delight after real learning.
- **Goodhart:** very high.
- **Ethics:** high manipulation/compulsion risk.
- **Assessment:** **Effective but dangerous; generally avoid.**

### 41. Near misses
- **Evidence:** B+ for gambling persistence.
- **Externalize:** pedagogical “almost correct” feedback must be accurate; never engineer artificial almost-wins.
- **Goodhart:** persistence independent of cognition.
- **Ethics:** very high.
- **Backfire:** distorted calibration, frustration, compulsion.
- **Assessment:** **Effective but dangerous; do not adopt.**

### 42. Scarcity / countdowns / FOMO
- **Evidence:** B/C for consumer conversion; not learning.
- **Externalize:** only genuine deadlines/due-window salience, never fabricated disappearing lessons or rewards.
- **Goodhart:** rushed activity.
- **Assessment:** **Artificial scarcity probably counterproductive.**

### 43. Daily login rewards / escalating calendars
- **Evidence:** D for educational benefit.
- **Externalize:** replace login reward with genuine spaced-retrieval maintenance opportunity.
- **Goodhart:** near-maximal—opening becomes learned behavior.
- **Assessment:** **Probably counterproductive in canonical F2P form.**

### 44. Battle-pass / quest-chain progression
- **Evidence:** D for learning as a commercial bundle.
- **Externalize:** non-expiring capability expedition could preserve structural clarity without FOMO/activity rewards.
- **Goodhart:** quest optimization.
- **Assessment:** **Speculative once dark components are removed.**

### 45. Sunk cost / escalating commitment
- **Evidence:** B/C; real but moderator-dependent.
- **Externalize:** do not induce continuation with “you already invested X days.”
- **Goodhart:** encourages continuation when restructuring/stopping is rational.
- **Ethics:** high if intentionally induced.
- **Assessment:** **Probably counterproductive.**

# 5. Strongest candidates for Externalize

1. **Spacing + retrieval + successive relearning** — repeated engagement directly produces durable memory and transfer.
2. **Adaptive scaffold fading + unaided transfer checks** — enforces decreasing product dependence.
3. **Diagnostic feedback + error-specific correction** — improves cognition and creates meaningful competence feedback.
4. **Protected capability progress based on delayed evidence** — makes real learning rewarding and farming unrewarding.
5. **Calibration prompts and feedback** — attacks illusions of mastery.
6. **Stable initiation cue + implementation intention + low-friction default** — improves return without distorting cognition.
7. **System-selected challenge with wheel-spinning rescue** — prevents both easy farming and hopeless persistence.
8. **Generation/self-explanation before hints** — turns interaction into reasoning evidence.
9. **Lapse-tolerant rhythm/recovery** — compatible with habit evidence and long-run return.
10. **Due-retrieval notifications, micro-randomized** — proximal behavioral mechanism tied directly to learning opportunity.
11. **Representation variation/interleaving** — defense against interface-specific memorization.
12. **Curiosity/pretesting around real logic uncertainty** — makes content itself rewarding.

# 6. Effective-but-dangerous mechanisms

## Near misses
Near misses increase persistence in randomized gambling experiments and can increase desire to continue despite being failures. Artificial “almost won” framing would damage calibration.

## Loss framing
Loss framing can change behavior strongly, but post-intervention decay matters. A streak reset is effectively a loss frame. Its motivating feature and abandonment risk are closely related.

## Variable reinforcement
Random reinforcement can produce persistent responding, but human effects are more cognitively mediated than simplistic “dopamine slot machine” accounts imply. There is no strong evidence that random rewards improve durable learning better than predictable competence feedback.

## Social comparison
Competition can increase behavior, but ranking creates educational pathologies: discouraging competence information, farming incentives, and challenge avoidance.

## Hard streaks
Streaks partly work because losing them matters. The product should therefore estimate post-break churn as carefully as pre-break maintenance.

## Artificial scarcity
Scarcity says “do this now before it disappears,” whereas learning science often says “stop now and retrieve later.” This is a structural conflict.

# 7. Popular ideas with weak/contradictory evidence

- **“It takes 21 days to form a habit.”** Unsupported; habit formation varies dramatically.
- **“Never break the chain.”** Too strong; a single missed opportunity need not derail habit formation.
- **“The Zeigarnik effect makes unfinished tasks more memorable.”** Recent meta-analysis does not support a general unfinished-task memory advantage; resumption is better supported.
- **“Variable rewards are always more engaging.”** Overgeneralized from operant/gambling models and not established for learning.
- **“Gamification works.”** Too coarse; effects are heterogeneous and bundles confound mechanisms.
- **“Games are more motivating.”** Not reliably supported relative to conventional instruction.
- **“Flow means target about 80% success.”** No strong universal causal basis.
- **“More feedback is better.”** False; information content and answer leakage matter.
- **“More personalization is better.”** Unsupported as a generic claim.
- **“More engagement means better learning.”** Directly undermined by tutor gaming and wheel-spinning.
- **“Interesting decoration improves attention and therefore learning.”** Seductive details can reduce learning and transfer.

# 8. Cross-mechanism interactions and conflicts

## Synergies

- **Spacing × retrieval × notifications:** notification points to a pedagogically due retrieval.
- **Retrieval × confidence judgments:** memory and calibration evidence from one event.
- **Generation × feedback:** learner produces diagnostic error; feedback repairs it.
- **Worked examples × adaptive fading × transfer probes:** novice-to-independence progression.
- **Stable cue × implementation intention × low-friction default:** improves initiation without casino mechanics.
- **Capability progress × goal gradient:** proximity motivates useful effort if evidence is protected.
- **Streak repair × fresh start:** prevents “I ruined everything” interpretation.
- **Interleaving × representational variability:** fights rule-selection and interface memorization.

## Conflicts

- **XP × desirable difficulty:** rational XP maximizers choose easy problems.
- **Accuracy goals × transfer:** learners avoid revealing challenge.
- **Hard streaks × spacing:** daily action can cause needless reviews.
- **Variable rewards × intrinsic interest:** attention shifts toward reward anticipation.
- **Leaderboards × calibrated challenge:** ranking creates safe-task farming.
- **Notifications × attention:** improving Externalize opens can interrupt other cognition.
- **Permanent externalization × expertise:** novice scaffold becomes expert constraint.
- **Productive failure × wheel-spinning:** useful initial struggle can become harmful persistence.
- **Gamification decoration × cognitive load:** visual excitement becomes seductive detail.
- **Completion pressure × spacing:** “finish tonight” can be worse than stopping and relearning tomorrow.

# 9. Goodhart / measurement-integrity analysis

The key question is:

> **What is the cheapest rational policy for maximizing what the UI visibly rewards?**

| Rewarded proxy | Rational learner policy | Corruption | Protection |
|---|---|---|---|
| Daily streak | Minimum qualifying action | Empty/trivial activity | System-selected qualifying evidence; tolerate lapses |
| XP | Farm best XP/minute | Easy loops, rapid guessing | XP never feeds mastery; cap repeated-task value |
| Accuracy % | Avoid hard material | Apparent competence rises | Qualify/hide raw accuracy; ensure challenge |
| Lesson completion | Click/hint to end | Completion without retention | Delayed probes; completion ≠ mastery |
| Time in app | Stay open/work slowly | Inflated engagement | Never positive mastery evidence |
| Speed | Memorize UI patterns | Brittle fast responses | Novel layouts and transfer tests |
| Number of problems | Choose short/easy | Quantity without learning | Weight evidence by diagnosticity/novelty/assistance |
| Hint-free rate | Avoid useful help | Worse learning | Assistance allowed; separate assisted from independent evidence |
| Hint use | Exhaust hints | Tutor gaming | Progressive hints; bottom-out answer does not certify |
| High confidence | Always report high | Calibration destroyed | Never reward confidence level |
| Calibration score | Report middling probability | Scoring-rule gaming | Sparse hidden evaluation |
| Mastery threshold | Practice templates | Threshold overfit | Item families, delay, varied representations |
| Progress bar | Optimize shortest path | Curriculum imbalance | Multi-source latent evidence |
| Difficulty choice | Pick easy | Challenge avoidance | Bounded choice + protected diagnostic sampling |
| Persistence | Continue hopelessly | Wheel-spinning | Detect non-learning trajectory and intervene |
| “No mistakes” | Avoid exploration | Productive failure disappears | Separate Explore from Evidence |
| Social rank | Maximize comparative volume | Farming/cheating | Prefer self-comparison or standardized diagnostic sets |
| Streak freeze currency | Strategically manipulate misses | Calendar gaming | Free sparse recovery; no freeze economy |

## Architectural integrity rules

1. Separate learning interactions from certification interactions.
2. Do not expose every mastery threshold.
3. Sample novel probes.
4. Delay some evidence.
5. Audit transfer.
6. Model assistance explicitly.
7. Measure learning per unit attention, not just learning per session.
8. Detect suspicious patterns without moralizing.
9. Detect wheel-spinning separately from gaming.
10. Include graduation metrics: less scaffolding and less maintenance practice are positive outcomes.

# 10. Proposed learning-aligned engagement loop

1. **Self-chosen stable cue** — implementation intention.
2. **Low-friction return** — app opens to a short high-value due set.
3. **Effortful retrieval before support** — predict/generate/reconstruct.
4. **Diagnostic feedback** — classify error and give minimal useful intervention.
5. **Adaptive support** — hints/examples where needed; wheel-spinning triggers prerequisite repair.
6. **Protected evidence sample** — system-selected, varied, unassisted tasks.
7. **Delayed capability update** — progress from durable evidence, not activity.
8. **Competence reward** — e.g. “Yesterday this needed three prompts; today you solved a novel form unaided.”
9. **Deliberate stopping point** — stop when marginal learning value falls.
10. **Schedule future retrieval** — next natural reason to return.
11. **Lapse-safe recovery** — missing a window does not erase progress.
12. **Fade product dependence** — prompts and review frequency decline with mastery.

Desired dynamic:

> **return → effortful cognition → valid evidence → real progress → satisfying competence → later return → less support required**

Not:

> open → tap → XP → streak → notification → tap → XP.

# 11. Externalize-specific implementation concepts

## Proof Pulse
A 2–5 item, 2–5 minute system-selected due retrieval set as the home-screen default. Completing it is not automatically mastery evidence; individual responses may be.

## Capability Rings, not XP bars
Represent meaningful capabilities with evidence stages such as **acquired → retrieved later → transferred → independent**. No stage moves from time or taps.

## Fade Mode
Remove supports one at a time as evidence strengthens: rule labels, candidate steps, intermediate prompts, compulsory state entry. Requested support remains available but independent success is distinct evidence.

## Counterexample Hunt
Before explaining why an equivalence fails, ask the learner to predict whether a counterexample exists and find it. Combines curiosity, productive failure and generation.

## Error Memory
Show meaningful progress such as:

> Scope mistakes: 7 → 2 → 0 across three independent checks.

## Recovery Lane
After a lapse:

> Nothing was lost. Two ideas are due for recovery.

No red reset, lost currency or punishment.

## Trust-but-Verify sampling
Learners choose practice freely; capability updates periodically depend on hidden-form system-selected probes.

## Confidence Lens
On a sample of evidence items, request confidence and later show calibration patterns. Never reward confidence level directly.

## End on a win—with a real open question
Finish after useful work is complete, show earned progress, and preview tomorrow’s conceptual question. Never withhold an earned explanation artificially.

## Graduation states
Mastered capabilities become maintenance-only and appear less often. Reduced product dependence is treated as success.

# 12. Smallest credible experiments

## Experiment 1 — activity streak vs evidence streak vs no streak
- **A:** opening/session streak.
- **B:** system-selected meaningful retrieval required.
- **C:** no streak, capability progress only.
- **Primary:** delayed novel transfer.
- **Secondary:** return and lapse recovery.
- **Guardrails:** trivial-task proportion, rapid guessing, post-break churn, anxiety.

## Experiment 2 — permanent externalization vs adaptive fading
- **Primary:** delayed unaided transfer in an interface requiring fewer/no explicit states.
- **Secondary:** persistence.
- **Guardrail:** errors/frustration after fading.
- **Importance:** directly tests a central project doctrine.

## Experiment 3 — capability progress vs activity progress
- **A:** evidence-backed capability visualization.
- **B:** completion/XP visualization.
- **C:** minimal progress UI.
- **Primary:** delayed transfer and calibration.
- **Guardrails:** easy-task selection, attempts/minute, hint use.

## Experiment 4 — due-learning notification micro-randomized trial
At each eligible due event, randomize notification vs silence.
- **Primary:** incremental probability that due material is successfully retrieved days later.
- **Secondary:** open rate.
- **Core estimand:** retained learning caused per notification sent.

## Experiment 5 — challenge allocation
Compare learner-selected difficulty, adaptive assignment, and bounded choice among diagnostically equivalent tasks.
- **Primary:** novel transfer.
- **Guardrail:** easy-task preference and wheel-spinning.

## Experiment 6 — hint architecture
Immediate bottom-out hints vs progressive hints requiring another attempt/explanation.
- **Primary:** delayed independent solving.
- **Guardrails:** hint exhaustion, repeated guessing, frustration.

## Experiment 7 — lapse recovery
Hard streak reset vs forgiving recovery vs no-streak neutral restart.
- **Primary:** learning accumulated over following 14/28 days.
- **Secondary:** return latency.
- **Guardrail:** guilt/avoidance and minimum-effort recovery.

## Experiment 8 — retrieval scheduler
Simple robust spacing heuristic vs proposed personalized forgetting model, with equal allowable practice.
- **Primary:** fixed-horizon retention/transfer.
- **Secondary:** sessions required.
- **Guardrail:** attempts and frustration.

## Experiment 9 — reward contingency
- **A:** cosmetic reward after any session.
- **B:** reward after delayed learning evidence.
- **C:** competence feedback only.
- **Primary:** delayed transfer after rewards are removed.
- **Guardrail:** task farming and interest.

## Experiment 10 — representation robustness
Fixed UI patterns vs controlled representational variability.
- **Primary:** equivalent logic problems in novel visual/textual format.
- **Guardrail:** immediate training performance.

# 13. Adversarial critique

The strongest criticism is that these recommendations may **overfit cognitive-science laboratory effects to a voluntary mobile product**.

Retrieval and spacing are robust, but much canonical evidence concerns words, facts or classroom materials. Symbolic logic combines conceptual knowledge with procedural strategy selection, and users may not voluntarily tolerate experimentally optimal difficulty.

Perhaps Externalize's dominant bottleneck is simply getting users to practice enough. If a manipulative mechanism doubles meaningful practice, its indirect learning benefit could swamp modest per-session pedagogical gains. The correct estimand is:

> probability of returning × useful cognition per return × learning per unit cognition × persistence over time.

A weaker learning session repeated ten times can beat an ideal session completed twice.

Capability progress may also be too delayed to motivate. Durable evidence arrives after time has passed. Immediate arbitrary rewards could potentially bridge the gap before competence becomes perceptible.

Self-determination evidence should not be overinterpreted causally. External rewards may be less harmful for users who already regard symbolic logic instrumentally.

The critique of permanent externalization may also be premature. Formal written derivation can itself be part of expert logic practice. Fading should identify which external states are pedagogical scaffolds and which belong to expert performance.

Goodhart defenses can harm perceived agency. Hidden probes and protected thresholds may make progress feel opaque: “Why did five correct answers not move my capability?”

“Graduation” conflicts with product survival if the business benefits from recurring usage. Organizational incentives can later distort even a well-designed metric hierarchy.

The proposed architecture is complex: scheduler + mastery model + transfer sampler + assistance model + calibration model + error model + habit layer + integrity detectors. Complexity itself creates failure modes.

Finally, many effects summarized here come from heterogeneous meta-analyses. The best product might simply be:

> excellent curriculum + retrieval + spacing + good feedback + extremely polished UX

with almost none of the behavioral machinery investigated here.

That simpler hypothesis should remain alive until field data reject it.

# 14. Open questions

1. What is the dominant current failure mode: forgetting, failure to start, difficulty, boredom, friction, low perceived value, or curriculum gaps?
2. Does explicit intermediate-state entry produce later independent reasoning or interface dependence?
3. What transfer distance defines symbolic-logic mastery?
4. Can individualized retrieval scheduling beat simple robust heuristics?
5. Can capability progress provide enough immediate reward to eliminate XP?
6. Does an evidence streak reduce Goodhart behavior or shift farming to easiest qualifying evidence?
7. How much short-term failure maximizes learning without harming voluntary return?
8. What are the earliest reliable wheel-spinning signals?
9. Can hint use be treated as learning while protecting independent mastery?
10. Which intermediate steps should disappear with expertise?
11. Does logic-generated curiosity improve return after novelty fades?
12. Do notifications create incremental learning or only move planned sessions earlier?
13. What happens after notification withdrawal?
14. What happens after reward withdrawal?
15. What happens after the first broken streak?
16. Can social comparison ever be diagnostically fair?
17. How should capability uncertainty be communicated?
18. Do users value being told they need less practice?
19. Is identity/value formation a stronger long-run mechanism than product mechanics?
20. What is the correct business metric when educational success reduces usage?

# 15. Bibliography / source links

## Durable learning

- Rowland, C. A. (2014). *The effect of testing versus restudy on retention: A meta-analytic review of the testing effect.* Psychological Bulletin. https://pubmed.ncbi.nlm.nih.gov/25150680/
- Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). *Rethinking the Use of Tests: A Meta-Analysis of Practice Testing.* Review of Educational Research. https://journals.sagepub.com/doi/full/10.3102/0034654316689306
- Butler, A. C. (2010). *Repeated testing produces superior transfer of learning relative to repeated studying.* https://pubmed.ncbi.nlm.nih.gov/20804289/
- Pan, S. C., & Rickard, T. C. (2018). *Transfer of test-enhanced learning: Meta-analytic review and synthesis.* https://doi.org/10.1037/bul0000151
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). *Distributed practice in verbal recall tasks: A review and quantitative synthesis.* https://pubmed.ncbi.nlm.nih.gov/16719566/
- Brunmair, M., & Richter, T. (2019). *Similarity matters: A meta-analysis of interleaved learning and its moderators.* https://pubmed.ncbi.nlm.nih.gov/31556629/
- Rawson, K. A., & Dunlosky, J. (2022). *Successive Relearning: An Underexplored but Potent Technique for Obtaining and Maintaining Knowledge.* https://www.psychologicalscience.org/journals/current-directions/09637214221100484/
- Bertsch, S., Pesta, B. J., Wiscott, R., & McDaniel, M. A. (2007). *The generation effect: A meta-analytic review.* https://pubmed.ncbi.nlm.nih.gov/17645161/
- Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). *Inducing Self-Explanation: A Meta-Analysis.* https://eric.ed.gov/?id=EJ1186664
- Wisniewski, B., Zierer, K., & Hattie, J. (2020). *The Power of Feedback Revisited.* https://pubmed.ncbi.nlm.nih.gov/32038429/
- Salden, R. et al. (2009). *Worked Examples and Tutored Problem Solving: Redundant or Synergistic Forms of Support?* https://onlinelibrary.wiley.com/doi/10.1111/j.1756-8765.2008.01011.x
- Sinha, T., & Kapur, M. (2021). *When Problem Solving Followed by Instruction Works: Evidence for Productive Failure.* https://journals.sagepub.com/doi/10.3102/00346543211019105
- Kulik, C. L. C., Kulik, J. A., & Bangert-Drowns, R. L. (1990). *Effectiveness of Mastery Learning Programs: A Meta-Analysis.* https://journals.sagepub.com/doi/10.3102/00346543060002265
- Lin, L., Lin, X., Zhang, X., & Ginns, P. (2024). *The Personalized Learning by Interest Effect on Interest, Cognitive Load, Retention, and Transfer.* https://eric.ed.gov/?id=EJ1435667

## Motivation and habit

- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). *A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation.* https://pubmed.ncbi.nlm.nih.gov/10589297/
- Cerasoli, C. P., Nicklin, J. M., & Ford, M. T. (2014). *Intrinsic motivation and extrinsic incentives jointly predict performance: A 40-year meta-analysis.* https://pubmed.ncbi.nlm.nih.gov/24491020/
- Howard, J. L. et al. (2021). *Student Motivation and Associated Outcomes: A Meta-Analysis From Self-Determination Theory.* https://www.psychologicalscience.org/journals/perspectives/1745691620966789/
- Patall, E. A., Cooper, H., & Robinson, J. C. (2008). *The effects of choice on intrinsic motivation and related outcomes.* https://pubmed.ncbi.nlm.nih.gov/18298272/
- Gollwitzer, P. M., & Sheeran, P. (2006). *Implementation Intentions and Goal Achievement.* https://doi.org/10.1016/S0065-2601%2806%2938002-1
- Lally, P. et al. (2010). *How are habits formed: Modelling habit formation in the real world.* https://doi.org/10.1002/ejsp.674
- Stojanovic, M., Grund, A., & Fries, S. (2022). *Context Stability in Habit Building Increases Automaticity and Goal Attainment.* https://www.frontiersin.org/articles/10.3389/fpsyg.2022.883795/full
- Milkman, K. L., Minson, J. A., & Volpp, K. G. M. (2014). *Holding the Hunger Games Hostage at the Gym.* https://doi.org/10.1287/mnsc.2013.1784
- Dai, H., Milkman, K. L., & Riis, J. (2014). *The Fresh Start Effect.* https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1901

## Engagement and behavioral engineering

- Silverman, J., & Barasch, A. (2023). *On or Off Track: How (Broken) Streaks Affect Consumer Decisions.* https://doi.org/10.1093/jcr/ucac029
- Bell, L. et al. (2023). *How Notifications Affect Engagement With a Behavior Change App: Results From a Micro-Randomized Trial.* https://pmc.ncbi.nlm.nih.gov/articles/PMC10337295/
- Jachimowicz, J. M. et al. (2019). *When and why defaults influence decisions: a meta-analysis of default effects.* https://www.cambridge.org/core/journals/behavioural-public-policy/article/when-and-why-defaults-influence-decisions-a-metaanalysis-of-default-effects/67AF6972CFB52698A60B6BD94B70C2C0
- Kivetz, R., Urminsky, O., & Zheng, Y. (2006). *The Goal-Gradient Hypothesis Resurrected.* https://journals.sagepub.com/doi/full/10.1509/jmkr.43.1.39
- Patel, M. S. et al. (2016). *Framing Financial Incentives to Increase Physical Activity Among Overweight and Obese Adults.* https://pmc.ncbi.nlm.nih.gov/articles/PMC6029433/
- Kassinove, J. I., & Schare, M. L. (2001). *Effects of the “near miss” and the “big win” on persistence at slot machine gambling.* https://pubmed.ncbi.nlm.nih.gov/11419232/
- Clark, L. et al. (2009). *Gambling near-misses enhance motivation to gamble and recruit win-related brain circuitry.* https://pubmed.ncbi.nlm.nih.gov/19217383/
- Delfabbro, P. et al. (2023). *The complex nature of human operant gambling behaviour involving slot games.* https://www.sciencedirect.com/science/article/pii/S0306460322003069
- Roth, S., Robbert, T., & Straus, L. (2015). *On the sunk-cost effect in economic decision-making: a meta-analytic review.* https://link.springer.com/article/10.1007/s40685-014-0014-8
- Ghibellini, R., & Meier, B. (2025). *Interruption, recall and resumption: a meta-analysis of the Zeigarnik and Ovsiankina effects.* https://www.nature.com/articles/s41599-025-05000-w

## Gamification, tutoring and attention

- Sailer, M., & Homner, L. (2020). *The Gamification of Learning: a Meta-analysis.* https://doi.org/10.1007/s10648-019-09498-w
- Bai, S., Hew, K. F., & Huang, B. (2020). *Does gamification improve student learning outcome?* https://doi.org/10.1016/j.edurev.2020.100322
- Wouters, P. et al. (2013). *A meta-analysis of the cognitive and motivational effects of serious games.* https://doi.org/10.1037/a0031311
- VanLehn, K. (2011). *The Relative Effectiveness of Human Tutoring, Intelligent Tutoring Systems, and Other Tutoring Systems.* https://www.tandfonline.com/doi/full/10.1080/00461520.2011.611369
- Steenbergen-Hu, S., & Cooper, H. (2013). *A meta-analysis of the effectiveness of intelligent tutoring systems on K–12 students’ mathematical learning.* https://doi.org/10.1037/a0032447
- Baker, R. S., Corbett, A. T., Koedinger, K. R., & Wagner, A. Z. (2004). *Off-Task Behavior in the Cognitive Tutor Classroom: When Students “Game the System”.* https://pact.cs.cmu.edu/koedinger/pubs/Baker%2C%20Corbett%2C%20Koedinger%20Wagner_2004.pdf
- Stothart, C., Mitchum, A., & Yehnert, C. (2015). *The attentional cost of receiving a cell phone notification.* https://pubmed.ncbi.nlm.nih.gov/26121498/
- Cheng, C. et al. (2026). *Seductive Details, Cognitive Load, and Learning Outcomes: A Multi-level Meta-analysis and MASEM.* https://doi.org/10.1007/s10648-025-10099-z

# Bottom line

The most promising Externalize strategy is not to borrow the engagement surface of casinos or free-to-play games and hope that learning survives underneath it.

It is to borrow their **behavioral precision** while changing what is reinforced.

- Make the easiest action a useful action.
- Make the return cue point to due retrieval.
- Make effort generate diagnostic information.
- Make progress depend on delayed independent evidence.
- Make competence itself visible and rewarding.
- Make lapses recoverable.
- Make easy farming worthless.
- Make unproductive struggle trigger instruction rather than more struggle.
- Make scaffolding disappear as expertise grows.
- When the learner genuinely no longer needs Externalize very often, count that as success.

Dark-pattern research still matters because it reveals how powerfully representation, loss, uncertainty, proximity and interruption can control behavior. But those mechanisms should face a stricter burden of proof than ordinary pedagogy: **they must increase durable learning after accounting for the strategies they induce, survive withdrawal, preserve calibrated agency, and outperform less manipulative alternatives.**

At present, the evidence clears that bar for very few of them.
