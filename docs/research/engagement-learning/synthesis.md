# Engagement & Durable Learning — Multi-model Synthesis

**Date:** 2026-08-29  
**Status:** Research synthesis; recommendations are not product decisions.  
**Inputs:** three independent frontier-model investigations (GPT-5.6 Sol, Grok, Opus 5), followed by evidence-level comparison and targeted verification of consequential claims.

## Executive conclusion

The research improves Externalize’s epistemic position but **does not justify adding a gamification layer now**.

The strongest common conclusion is not “find better rewards.” It is:

> **Make the cognitively useful act the rewarded act, make returning to that act cheap, and do not create a cheaper proxy game.**

The evidence is asymmetric. Retrieval practice, spacing, successive relearning, worked examples/fading, self-explanation, interleaving under appropriate conditions, and transfer testing have substantially stronger claims to durable learning than XP, streaks, loot, near-misses, hearts, scarcity, or leaderboards. Most classic engagement machinery has evidence for changing behavior, not for improving delayed learning.

The current baseline validation period should therefore remain clean. First establish what failure Externalize actually has: learning, transfer, return, persistence, mobile usability, or something else.

## Process and provenance

The three reports were produced independently from the same brief. Their agreement is **not** treated as evidence. This synthesis compares underlying evidence, assumptions, reasoning, counterevidence, external validity, and project relevance.

### Known project state

- Graded evidence is already distinguished from Explore/activity.
- Progress claims are intended to derive from graded evidence rather than time, activity, or arbitrary XP.
- A prior evaluation-integrity flaw demonstrated that allowing learners to choose easier evidence can corrupt mastery claims.
- Current priority is sustained real use/validation, not feature expansion.

### Research findings

The findings below are supported by the investigation but are not automatically binding design constraints.

## Findings that survive synthesis

### F1 — Valid learning events should be authoritative over activity

Delayed learning evidence should dominate product claims of progress. Opens, minutes, sessions, XP, streak length, and completion can be useful diagnostics, but are not evidence of mastery.

This reinforces rather than overturns the existing graded-evidence direction.

### F2 — Retrieval + spacing is the strongest spine for return behavior

The best-supported reason to bring a learner back is not “daily engagement” in the abstract. It is to produce effortful retrieval at useful lags. Successive relearning combines retrieval, spacing, and repeated criterion attainment and is particularly promising, although much of its strongest evidence is on simpler material than multi-step proofs.

Implication: a future return system should schedule cognitively useful retrieval, not manufacture activity.

### F3 — Engagement science is stronger for **initiation** than for improving the cognitive work after entry

Implementation intentions, stable cues, friction reduction, reminders, lapse recovery, and related mechanisms plausibly affect whether a session begins. Once inside a session, cognitive/educational evidence should generally dominate the design.

This is a default, not an invariant: some motivational effects operate during difficult work, but “behavior design outside / learning science inside” is a useful decomposition.

### F4 — Habitize the doorway, not formal inference

Habit research most directly supports making a simple initiation action increasingly cue-driven: e.g. a stable context → open Externalize → begin due retrieval.

It does not establish that high-element-interactivity symbolic reasoning becomes a habit in the same sense. Formal reasoning remains deliberative for a long time; desirable difficulties often deliberately increase deliberation.

### F5 — Cadence is a more defensible incentive target than volume

Opus identified unusually relevant 2025 randomized evidence comparing rewards for **days practised** with rewards for **questions completed**. Days-based incentives produced more distributed practice and better exam performance. This provides direct support for cadence/distribution as a legitimate target rather than raw exercise volume.

Important limitation: this was an academic incentive context, not a voluntary adult consumer logic app. It supports a hypothesis, not an Externalize feature decision.

### F6 — Conventional reset-on-miss streaks are not justified

The evidence does not establish that destroying a visible streak after one missed day improves durable learning. Streaks have obvious Goodhart and lapse risks: minimum qualifying activity, late-night junk practice, anxiety, and abandonment after loss.

A more promising decomposition is to preserve the useful component—practice cadence—without deleting historical achievement. Example hypothesis: “practised on 17 appropriately spaced days” rather than “17-day streak; miss tomorrow and return to zero.”

This is a leading engagement hypothesis, not yet a product decision.

### F7 — Lapse recovery deserves more attention than streak preservation

Large-scale behavioral evidence suggests interventions can improve behavior while active yet rarely persist after withdrawal; notably, in the 2021 Milkman et al. gym megastudy the strongest intervention rewarded returning after a missed workout.

For Externalize, a lapse should plausibly become a recovery/retrieval opportunity rather than a failure state. “You missed several days; here is one worthwhile thing to retrieve now” is better aligned with both memory and behavior than a destroyed counter.

### F8 — Auxiliary reward economies are a measurement-integrity hazard

XP, coins, leagues, battle passes, achievements, easy streak qualifiers, and similar systems create a second objective. A rational learner can optimize that objective instead of mastery.

This is documented both in intelligent-tutoring “gaming the system” research and in qualitative learning-app evidence. The project’s own earlier easy-evidence flaw is the same class of problem.

The core risk is epistemic as much as ethical: an auxiliary economy can make the learner model wrong.

### F9 — The “externalize every intermediate state” doctrine has an important expertise-reversal challenge

All three reports independently raise a consequential concern: scaffolding and explicit intermediate-state requirements that help novices may become redundant load as schemas develop.

The evidence for worked examples, fading, cognitive load, and expertise reversal is substantial. Logic-specific Hyperproof/Openproof work also suggests representation-by-learner interactions matter.

However, the transfer from that literature to Externalize’s exact doctrine remains inferential. Externalization may be more than scaffolding; disciplined explicit reasoning may itself be part of the target skill.

Therefore this is **not a decision to weaken the doctrine**. It becomes a high-priority open question:

> Does mandatory externalization eventually inhibit unaided symbolic reasoning, or is continued explicit intermediate reasoning part of the competence Externalize intends to teach?

### F10 — Transfer away from the exact interface must eventually matter

A learner can become good at an interface without acquiring portable logical competence. Mastery evidence should eventually include delayed, unaided, and representationally varied problems. The exact representation and timing remain open.

### F11 — Mobile-first is an assumption worth testing, not protecting

High element interactivity plus phone UI may create extraneous load. Grok makes the strongest version of this challenge. There is enough cognitive-load evidence to justify testing phone reconstruction against a larger surface; there is not enough Externalize-specific evidence to conclude mobile-first is wrong.

### F12 — The strongest “dark” mechanisms contain less unique treasure than expected

Near misses, variable reinforcement, artificial scarcity, hearts/energy, and similar mechanisms can affect behavior, but their popular reputations often exceed the quality/relevance of evidence for durable learning. Newer near-miss work in particular complicates the simple “near miss causes persistent play” story.

Even where such mechanisms move engagement, they commonly create a reward channel decoupled from truth or skill. That is especially hostile to a logic tutor whose objective includes calibration.

## Important disagreement among the reports

### Streaks

- **GPT-5.6 Sol:** treat evidence-based streak vs activity streak vs none as an empirical question.
- **Grok:** a valid-retrieval streak may be usable with slack/recovery, but remains dangerous.
- **Opus 5:** decompose the mechanism; preserve days-practised/cadence, remove reset-on-miss loss framing.

**Synthesis:** Opus currently offers the strongest design hypothesis because it preserves the part with direct learning-relevant evidence while avoiding an unnecessary loss mechanism. It still needs Externalize-specific testing.

### Dark engagement mechanisms

- **Grok:** more willing to treat several casino/F2P mechanisms as behaviorally strong but hostile to learning/calibration.
- **Opus:** more skeptical that the strongest folklore claims survive careful empirical review.
- **GPT-5.6 Sol:** intermediate position; selective experiments only if a real engagement problem emerges.

**Synthesis:** take behavioral potency seriously, but do not infer educational value. There is no current justification for contaminating the baseline with casino-style mechanics.

### Two clocks

Grok proposes an engagement clock and mastery clock. The decomposition is analytically useful, but visibly presenting two prestigious progress systems risks recreating Goodhart: users optimize the easier one.

**Preferred formulation:** one authoritative visible capability/progress model, with behavioral/cadence instrumentation underneath it. A cadence display, if eventually used, should be historical/contextual rather than a second advancement currency.

## Open questions

These remain material and should not be silently closed:

1. Does visible capability state predict delayed held-out performance?
2. Does mandatory intermediate-state externalization eventually become redundant load?
3. Does fading externalization improve or damage delayed unaided performance?
4. Does competence transfer across representations and away from Externalize’s UI?
5. Is mobile-first compatible with serious multi-step reconstruction, or does a larger surface materially improve learning?
6. What knowledge-component grain makes spacing/successive relearning tractable for logic?
7. Do adult voluntary learners tolerate retrieval-first and delayed confirmation without school/course coercion?
8. Is voluntary return actually a bottleneck in the current product?
9. If return is a bottleneck, is neutral cadence + strong lapse recovery sufficient before loss-framed mechanisms are considered?
10. Does any sophisticated personalized scheduler beat a simple robust spacing policy enough to justify complexity?
11. What hint policy preserves learning without making legitimate struggle feel punitive?
12. How much representational variability is needed to detect interface-pattern learning?

## Recommended validation hypotheses

These are recommendations for investigation, not authorized implementation commitments.

### H1 — Mastery validity

**Question:** Does the visible capability model predict performance on held-out, delayed problems?

**Why first:** If it does not, engagement optimization would accelerate use of an invalid measurement system.

**Primary evidence:** delayed unaided held-out performance.

### H2 — Externalization transfer / fading

**Question:** As competence rises, does reducing compulsory externalization improve or damage delayed unaided reasoning?

Compare continued full externalization with carefully staged fading. Do not change the doctrine permanently based on cognitive-load theory alone.

### H3 — Representation transfer

**Question:** Can the same capability be demonstrated when presentation/input format changes?

This tests whether the learner acquired logic rather than Externalize-specific interaction patterns.

### H4 — Initiation

**Question:** Does a simple stable cue / implementation intention materially increase scheduled valid retrieval without introducing a reward economy?

This is the lowest-risk engagement experiment if baseline use shows an initiation problem.

## What not to build yet

Do not infer authorization for:

- XP or pseudo-currency;
- global leaderboards/leagues;
- battle passes;
- hearts/lives/energy tied to errors;
- fake scarcity or countdowns;
- loot/variable-ratio cosmetic rewards;
- casino-style near-miss animation;
- infinite “one more” session chaining;
- reset-on-miss streaks;
- sophisticated notification personalization;
- a permanent change to the externalization doctrine.

These are not permanently forbidden. They currently lack sufficient project-specific justification relative to their complexity, Goodhart risk, or ethical cost.

## Leading engagement hypothesis if baseline return fails

Do **not** begin with “streak vs no streak.”

First test:

> **neutral learning cadence + good lapse recovery vs baseline**

A plausible implementation would acknowledge cumulative appropriately spaced practice without deleting history after a miss, and after a lapse route the learner directly to one worthwhile due retrieval. Capability progress remains authoritative.

Only if a genuine return problem remains after lower-risk mechanisms should loss-framed engagement be considered.

## Adversarial challenge to this synthesis

The strongest case against this direction is that voluntary persistence, not pedagogy, may be the binding constraint. A beautifully incentive-compatible tutor that nobody opens teaches nobody. Desirable difficulty can make a consumer product unpleasant; strict mastery evidence can feel stingy; adult hobbyists may not find formal logic intrinsically rewarding enough for informational progress alone; and many lab/classroom effects may shrink badly in a mobile voluntary context.

Those objections do **not** justify adding generic gamification now. They justify keeping engagement as a first-class uncertainty and being willing to escalate if clean baseline evidence shows that people learn when they use Externalize but simply do not return.

The opposite failure is also possible: Externalize may already be sufficiently engaging, while retention, transfer, or mobile cognitive load is the real bottleneck. Adding engagement machinery before diagnosing the failure would obscure the baseline and close design space without evidence.

## Current recommendation

> **Keep the baseline clean. Instrument it better. Validate whether Externalize teaches what it claims to teach, including delayed transfer and the externalization/fading question. Treat “learning-aligned cadence, not engagement volume” as the leading engagement hypothesis, not yet as product behavior.**

If voluntary return later emerges as the bottleneck, start with initiation friction, stable cues, neutral cadence, and non-shaming lapse recovery before escalating to loss-framed or casino-derived mechanics.

## Source reports

See `reports/` for the three independent submissions. They are preserved as research evidence, including disagreement and speculative material; this synthesis is intentionally not a replacement for them.