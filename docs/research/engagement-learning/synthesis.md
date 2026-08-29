# Externalize engagement and durable-learning research synthesis

## Status

**Investigative synthesis — findings and recommendations, not product decisions.**

This document synthesizes three independent frontier-model investigations commissioned around one governing principle:

> **Engagement is instrumental. Learning is the objective.**

The reports are evidence and candidate reasoning, not authority. Agreement among models is not treated as evidence. The synthesis compares evidence, assumptions, counterevidence, uncertainty, and explanatory strength, and preserves material dissent.

## Research question

How can Externalize exploit the strongest known mechanisms for motivation, habit formation, attention and repeated engagement while preserving—or improving—retrieval strength, transfer, calibration and genuine mastery?

Primary outcomes are delayed retention, transfer, calibration, time-to-mastery, voluntary return, and reduction in scaffolding. Session length, DAU, XP, streaks, and similar activity metrics are proxies at best and are not objectives.

## Source reports

- [`reports/gpt-5.6-sol.md`](reports/gpt-5.6-sol.md) — GPT-5.6 Sol.
- [`reports/grok.md`](reports/grok.md) — Grok; faithful text extraction of the submitted PDF.
- [`reports/opus-5.md`](reports/opus-5.md) — Opus 5.

The common research brief and frontier-model prompt are preserved alongside this synthesis.

## Strongest evidence-backed learning mechanisms

The reports converge on a core that is well supported independently of their agreement: retrieval practice, spacing, successive relearning, informative feedback, generation/self-explanation, worked examples with fading, appropriately timed interleaving, calibration training, and transfer probes.

Relevant evidence highlighted in the reports includes:

- Retrieval practice: meta-analytic benefits around `g ≈ 0.50–0.70` versus restudy depending on synthesis and comparison; transfer benefits are meaningful but heterogeneous.
- Spacing: exceptionally mature evidence; the useful interval depends on the desired retention horizon rather than a universal daily cadence.
- Successive relearning: strong results when criterion retrieval is regained across spaced sessions, though much direct work is in definition/vocabulary settings and external validity to proof construction remains an open question.
- Self-explanation: meta-analytic benefit around `g ≈ 0.55`.
- Interleaving: positive average effects, including in mathematics, but moderator-dependent; novices may benefit from blocked introduction before discrimination-heavy interleaving.
- Worked examples and fading: strong support for novices under high element interactivity, with expertise-reversal evidence warning against permanent scaffolding.
- Step-level tutoring and feedback: useful evidence exists, but field effects and assistance/hint policy are substantially less settled than the broad proposition that feedback helps.

The practical implication is not “add pedagogy and then gamify it.” It is to make the cognitively useful act the rewarded act, and make return cheap enough that learners perform that act at useful memory intervals.

## Findings

### 1. Delayed learning evidence must remain authoritative over activity metrics

Externalize should evaluate interventions by what learners can later retrieve, transfer, and solve unaided, not by how much behavior the intervention generates inside the app. Any mechanism that improves opens, streaks, XP, or session volume while degrading delayed performance is a failure by the governing objective.

### 2. Spacing plus retrieval is the strongest evidence-backed core around which return behavior can be organized

The reports differ on many engagement mechanisms but not on the underlying learning value of effortful retrieval separated by useful delays. A return is valuable insofar as it creates a useful retrieval opportunity; return frequency is not intrinsically valuable.

### 3. Engagement interventions have stronger evidence for getting people to start than for improving what they do once started

Behavioral mechanisms such as implementation intentions, defaults, low friction, reminders, cues, and lapse recovery have a plausible role around session initiation. Once a learning episode starts, conventional learning science should dominate the design.

This yields a useful default division—not yet an invariant:

- **Outside/before the session:** cueing, implementation intentions, low friction, reminder timing, lapse recovery.
- **Inside the session:** retrieval, spacing, feedback, fading, interleaving, calibration, transfer.

### 4. Session initiation is a plausible habit target; formal reasoning is not established as one

Habit evidence supports stable cue → open Externalize → attempt due retrieval. It does not justify treating valid symbolic inference itself as something that should become automatic through the same mechanism. Formal reasoning remains deliberative and working-memory-intensive for a substantial period, and desirable difficulties may deliberately increase effort.

### 5. Cadence incentive is more defensible than volume incentive

Opus highlighted unusually direct evidence from YeckehZaare & Resnick (2025), *npj Science of Learning*, “Counting days is a spacing incentive that unlocks the potential of low GPA students.” Two randomized studies compared incentives based on questions answered with incentives based on days on which practice occurred. Counting practice days encouraged spacing and improved exam performance, particularly among lower-GPA students.

This is unusually relevant evidence for Externalize because it aligns an engagement incentive with a learning mechanism. Its limits matter: the studies involved course/grading incentives, not voluntary adult mobile learning, and they do not directly establish that a never-decreasing practice-days counter is superior to a reset streak in Externalize.

### 6. Reset-on-miss streaks are not justified by current learning evidence

Streak representations can causally influence behavior, but evidence that reset-on-miss streaks improve durable learning is lacking. Once a streak becomes valuable, it also creates an optimization target distinct from mastery. That invites minimum-effort preservation behavior and can corrupt the evidence stream used by the learner model.

A conventional streak therefore should not be added merely because it is commercially common.

### 7. Lapse recovery looks unusually promising and underexploited relative to streak preservation

Milkman et al.'s large 2021 gym megastudy found that many interventions increased behavior during the intervention while few produced measurable post-intervention change; one of the strongest interventions rewarded returning after a missed workout. Transfer from gym attendance to learning is inferential, but the broader design intuition is attractive: make returning after a lapse easy and salient rather than making the lapse itself a failure state.

For Externalize, a lapse may even create a useful memory interval. The resulting hypothesis is to treat return after absence as a valuable retrieval opportunity, not as restoration of a damaged engagement score.

### 8. XP, leaderboards, pseudo-currency, hearts, fake scarcity, near-misses and casino-style variable rewards currently lack compelling learning-aligned justification

The research deliberately examined mechanisms from F2P games, gambling, social media and consumer behavior. There is evidence that several can change behavior. That is not evidence that they improve learning.

Their deeper risk in Externalize is epistemic: they can create a second reward economy in which users rationally optimize visible proxies rather than capability. Tutoring research on gaming the system—systematic guessing, bottom-out hint use, and related strategies—shows that interaction metrics can diverge from learning. Dark patterns are therefore not only ethical risks; they can become attacks on the validity of the learner model.

### 9. Near-miss and variable-reward folklore is weaker and less transferable than product mythology suggests

Grok is more willing than Opus to treat casino-derived mechanisms as behaviorally potent, while Opus emphasizes the weakness of evidence for importing variable-ratio reinforcement claims into ordinary product use. Preregistered near-miss work supports effects on subjective motivation/urge in some gambling tasks but shows more mixed effects on subsequent behavior.

The synthesis does not need to resolve this dispute to reach a product-relevant conclusion: these mechanisms are not evidenced learning interventions, and Externalize has no demonstrated need that would justify the measurement corruption and motivational risks they introduce.

### 10. Progress itself may be the best reward if it remains epistemically expensive

Visible progress is defensible when it represents capability supported by later, system-chosen evidence. Progress becomes dangerous when activity can cheaply manufacture it.

Grok's “two-clock” idea is useful analytically: an engagement clock is cheap and frequent; a mastery clock is slower and evidence-backed. Exposing both prominently, however, risks creating two games. The stronger current synthesis is:

> **one authoritative visible progress model, with behavioral machinery underneath it rather than a second advancement currency.**

Capability should remain prestigious progress. Cadence, if ever exposed, should be contextual/history information rather than an XP-like parallel status system.

### 11. Scaffolding probably needs to fade with expertise; whether Externalize's exact intermediate-state requirement should fade remains open

All three reports challenge the permanence—not the novice usefulness—of “externalize every intermediate state.” Expertise-reversal and cognitive-load research imply that scaffolds useful during acquisition can become redundant or obstructive once schemas develop.

This does **not** authorize changing the doctrine. A consequential unresolved question remains:

> Does mandatory externalization eventually inhibit unaided symbolic reasoning, or is explicit intermediate-state construction itself part of the target competence Externalize intends to teach?

That must be tested rather than decided by analogy.

### 12. Transfer away from Externalize's exact interface must eventually be part of mastery evidence

A learner can appear fluent because the interface supplies recognition cues, state decomposition, or a familiar representation. Genuine mastery should therefore eventually survive representation changes, reduced scaffolding, and novel problems. The exact transfer criterion remains to be designed.

### 13. Mobile-first is an assumption worth challenging, not a conclusion to reverse

Grok explicitly raises a possible collision between mobile-first interaction and high-element-interactivity proof construction. A phone may be excellent for cues, retrieval and short practice while harder construction might benefit from a larger surface. This is a legitimate open question, not evidence that Externalize should stop being mobile-first.

## Material disagreements preserved

| Question | GPT-5.6 Sol | Grok | Opus 5 | Synthesis |
|---|---|---|---|---|
| Streaks | Test activity vs evidence streak vs none | Potentially usable if tied to valid retrieval and recovery | Decompose the mechanism: keep cadence, drop reset-on-miss | Opus's decomposition is currently strongest; no streak justified yet |
| Dark mechanics | Potentially potent but risky; test selectively | Often behaviorally potent but hazardous to calibration | Reputation often exceeds evidence; mostly not worth complexity | Closer to Opus, while retaining Grok's warning about behavior/measurement corruption |
| Immediate experimentation | Several N=1 tests | Prioritize learning architecture and assistance questions | Instrument first; run only N=1-valid tests | Opus/GPT hybrid: validate mastery/transfer and baseline failure modes first |
| Externalization | Should adaptively fade | Challenges permanence under expertise reversal | Challenges permanence and proposes transfer testing | Important consequential open question; no doctrine change authorized |

Agreement in this table is not itself evidence. The retained synthesis is based on the underlying studies, reasoning and applicability to Externalize.

## Challenge before commitment

The strongest case against adding an engagement layer now is that the project has not established an engagement bottleneck.

Different observed failures imply different interventions:

- “I like this and learning works, but I forget to open it” points toward initiation mechanics.
- “I open willingly but practice feels repetitive” points toward task/learning-loop design rather than streaks.
- “I use it frequently but do not retain” means engagement mechanics are largely irrelevant and may obscure the real problem.
- “The capability display says I know things I cannot later do” is a mastery-model integrity problem and should outrank engagement work.

Adding rewards before diagnosing the failure mode would contaminate the validation baseline and create new explanatory variables.

## Recommended validation hypotheses

These are recommendations for investigation, not authorized product changes.

1. **Mastery validity.** Does the visible capability model predict performance on held-out, delayed problems?
2. **Externalization transfer.** As competence rises, does reduced scaffolding improve or damage delayed unaided performance?
3. **Representation transfer.** Can the same capability be demonstrated when the interface representation changes?
4. **Initiation.** Does a simple cue / implementation-intention ritual materially increase actual scheduled retrievals without creating a reward economy?

Only if voluntary return emerges as a material bottleneck should the first engagement-specific comparison be something like:

> **neutral learning-aligned cadence + good lapse recovery vs baseline**

before escalating to reset streaks, loss framing, currencies, or other engagement machinery.

## N=1 experimental notes from the reports

Opus provides the most explicit validation-oriented experiment hierarchy. Its N=1-friendly proposals include initiation/if–then planning, testing whether capability display predicts held-out performance, representation rotation, and checking whether step-level feedback induces guess-and-check behavior. Other questions—reset-streak harm, lapse-recovery policy, interleaving, productive failure—likely require substantially more observations or participants for credible inference.

Useful methodological cautions from the reports:

- short experiments can mistake novelty dynamics for durable effects;
- delayed tests should generally be measured at meaningful delays rather than immediately;
- held-out probes should be defined before training when possible;
- within-subject item-pool splitting can make personal validation more informative;
- learning endpoints should be primary, with engagement outcomes secondary;
- stopping rules matter: a good learning product should know when more activity today is counterproductive.

## Current recommendation

**Do not start a gamification sprint.**

Keep the baseline clean and instrument it well enough to distinguish initiation, experience, retention, calibration and mastery-model failures. Validate capability truthfulness and transfer before adding a new engagement economy.

The leading engagement hypothesis, should return later become the bottleneck, is:

> **learning-aligned cadence, not engagement volume.**

The leading design caution is:

> **do not let a proxy reward become easier to optimize than genuine capability.**

## Decisions

None created by this synthesis.

Any future adoption of streaks, cadence displays, scaffold fading, notification policy, a changed externalization doctrine, or other consequential mechanism requires an explicit project decision after the relevant uncertainty has been reduced.