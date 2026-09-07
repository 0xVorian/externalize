# Chapter VII — Look ’Round! Arguments from Design

**Source:** Jordan Howard Sobel, *Logic and Theism*, Chapter VII, pp. 238–297  
**Status:** reviewed  
**Role in source-driven curriculum:** first full move from deductive proof to probabilistic confirmation and competing explanatory hypotheses

## Why this chapter matters for Externalize

Chapter VII is where the book changes epistemic machinery again. Chapters II–VI mostly ask whether conclusions follow deductively from premises. Chapter VII asks instead how evidence should alter confidence among **competing explanations**.

This makes it a key transition chapter for the adaptive curriculum:

```text
deductive validity
  -> explanatory comparison
  -> probability
  -> conditional probability
  -> likelihood
  -> priors
  -> Bayes
  -> posterior comparison
```

The pedagogical risk is substantial: learners often collapse all of the following into “how likely is the hypothesis?”

- `P(H)` — prior probability;
- `P(E|H)` — likelihood / predictive fit;
- `P(H|E)` — posterior probability;
- whether E confirms H at all;
- whether H is better than its competitors.

Externalize should make those quantities visibly different objects before introducing equations.

## Durable concept nodes

### Reused

- `hypothesis`
- `explanation`
- `evidence`
- `conditional`
- `partition`
- `necessity-vs-probability`
- `argument-strength`

### New or substantially extended

- `comparative-explanation`
- `total-evidence`
- `alternative-hypothesis`
- `intrinsic-plausibility`
- `predictive-power`
- `probability`
- `conditional-probability`
- `prior-probability`
- `likelihood`
- `posterior-probability`
- `bayes-theorem`
- `confirmation`
- `disconfirmation`
- `null-hypothesis`
- `probability-partition`
- `background-information`
- `cumulative-evidence`

## Capability dimensions

Track separately whether the learner can:

- distinguish deductive proof from evidential support;
- identify competing hypotheses;
- distinguish `P(E|H)` from `P(H|E)`;
- compare hypotheses using priors and likelihoods;
- update on more than one piece of evidence;
- notice when new evidence reverses an earlier ranking;
- keep “supports H” distinct from “makes H more probable than every rival”;
- detect omitted alternatives or an incomplete partition;
- assess whether a claim concerns total evidence or cherry-picked evidence.

---

## VII.1 — Cleanthes’ design argument

Sobel presents Cleanthes as arguing from observed order and apparent purposive adaptation in nature to an intelligent designer. The important logical point is that the argument is **not best understood as a simple analogy**. Its role is to evaluate a causal/explanatory hypothesis.

### Externalize sequence

1. Show an unfamiliar object with regular internal structure.
2. Offer several possible origins:
   - deliberate construction;
   - random assembly;
   - self-organizing process;
   - unknown cause.
3. Ask which observation favors which hypothesis and why.
4. Only afterward introduce the analogy angle: one explanation may be suggested because the effect resembles known artifacts.
5. Ask whether resemblance itself proves the cause is similar.

### Key lesson

The learner should leave §1 able to say:

> The evidence does not deductively entail a designer; it may instead make a designer hypothesis more or less plausible relative to alternatives.

This sets the epistemic target for the rest of the chapter.

---

## VII.2 — How to assess explanatory hypotheses

Sobel identifies several dimensions of explanatory assessment and insists on a **particular discussion of the evidence** rather than stopping at an intuitively striking fit.

### Core distinctions

#### Total evidence

One must consider not just the evidence first cited in favor of a theory but all relevant available evidence, including facts that count against it.

#### Alternative hypotheses

An explanation is not supported merely because it explains something. The relevant question is how it performs against competitors.

#### Intrinsic plausibility

How plausible is the hypothesis before the target evidence is taken into account?

#### Would-have-had predictive power

How expected would the evidence have been if the hypothesis were true?

### Externalize sequence

1. **Forensic toy case:** suspect has motive and means.
2. Ask for a confidence judgment.
3. Add alibi evidence.
4. Ask whether the original evidence disappeared — it did not — and why confidence can nonetheless decrease.
5. Introduce two rival suspects.
6. Separate:
   - prior plausibility;
   - likelihood of the evidence under each suspect hypothesis;
   - posterior confidence.

This should make “total evidence” emotionally obvious before formal probability.

### Transfer goal

Learner should be able to challenge the claim `E strongly supports H` with two questions:

1. Compared with what alternatives?
2. Given what other relevant evidence?

---

## VII.3 — Probability and conditional probability

Sobel treats probabilities as degrees of confidence and introduces conditional probabilities before Bayes.

### Externalize representation

Do not begin with formulas. Begin with **state cards**:

- current confidence in H;
- imagined condition E;
- resulting confidence in H if E were known.

Then introduce notation:

- `P(H)`;
- `P(H|E)`;
- `P(E|H)`.

### Crucial exercise family: reverse the conditional

Give paired questions such as:

- probability of a positive test if disease is present;
- probability disease is present given a positive test.

Or, staying neutral:

- probability the marble is yellow given barrel A;
- probability it came from barrel A given that it is yellow.

Require the learner to choose the direction **before seeing any numbers**.

### Source example

Sobel’s barrel/marble setup is ideal because the conditional probabilities in one direction can be read directly from barrel composition, while the reverse conditional is the quantity of interest and requires Bayes.

### Reading exit

Learner can distinguish plain probability from conditional probability and can state why `P(H|E)` and `P(E|H)` need not match.

---

## VII.4 — Bayes’s theorems

Sobel introduces a two-hypothesis form and a finite-partition generalization.

For a hypothesis H against alternatives, the posterior depends on two factors:

- prior plausibility of each hypothesis;
- likelihood of the evidence under each hypothesis.

### Externalize sequence

1. Show priors as starting weights on hypotheses.
2. Show likelihoods as how strongly each hypothesis “predicts” the observed evidence.
3. Multiply prior × likelihood for each hypothesis.
4. Normalize across the partition.
5. Only then reveal the algebraic Bayes formula.

### Visual model

A mobile-friendly implementation could use **hypothesis columns**:

```text
Hypothesis A
prior: 0.33
likelihood of Y: 0.90
raw support: 0.297

Hypothesis B
prior: 0.17
likelihood of Y: 0.60
raw support: 0.100

Hypothesis C
prior: 0.50
likelihood of Y: 0.40
raw support: 0.200
```

Then normalize the raw supports to posterior shares.

This externalizes the intermediate state exactly in the spirit of the project.

### Null / none-of-the-above

Sobel notes that available explanatory hypotheses may fail to form a full partition. Externalize should therefore teach a `none of these` slot rather than silently forcing one candidate to be true.

### Reading exit

Learner understands Bayes as **reweighting competitors**, not as a mysterious formula for turning evidence into truth.

### Mastery exit

Learner can calculate posterior probabilities for a finite partition and explain each term.

---

## VII.5 — Particular discussion of the evidence

This is where the formal machinery is applied back to Hume.

Sobel organizes Hume’s discussion around:

- alternative designer hypotheses;
- non-designer hypotheses;
- order/apparent design as favorable evidence;
- apparently unnecessary evil and other evidence that may count against the traditional Religious Hypothesis;
- comparative prior plausibility and predictive fit.

The barrel example immediately before this section is deliberately analogous: evidence `Y` initially favors barrel A, but additional evidence `R` can reverse the ranking and make C the best-supported barrel.

### Externalize sequence

1. Use a neutral three-hypothesis toy example.
2. Add favorable evidence E1.
3. Let learner update and commit to a ranking.
4. Add E2 that is awkward for the current favorite.
5. Recalculate.
6. Ask which statements remain true:
   - E1 still favors H;
   - total evidence favors H;
   - H is most probable.
7. Return to Hume and map E1/E2 to source evidence only after the structure is secure.

### High-value lesson

**Evidence can continue to support a hypothesis locally while the total evidence makes another hypothesis preferable.**

This is a reusable epistemic concept far beyond theology.

---

## VII.6 — Hume’s philosophical theism

Sobel reads Hume as ending with something weaker and vaguer than Cleanthes’ traditional designer: some intelligence or intelligences may still have seemed to Hume the best of the available explanations of apparent design.

### Externalize task: conclusion-strength ladder

Display possible conclusions from strongest to weakest:

1. traditional perfect God designed nature;
2. one powerful benevolent designer;
3. one intelligent designer of unknown moral character;
4. some intelligence or intelligences played some role;
5. no designer conclusion warranted.

Ask what the evidence would have to establish to move between levels.

This directly reuses the `conclusion-strength` capability from Chapters V–VI.

---

## VII.7 — New facts and new theories

Sobel then reassesses the design argument using scientific information and theories unavailable to Hume. His source-level claim is that evolutionary theory changes the comparative explanatory landscape and removes the designer hypothesis from serious scientific competition for biological apparent design.

### Curriculum lesson, independent of the historical conclusion

The important reusable principle is:

> **Posterior support is relative to the evidence and hypothesis set actually available.**

A hypothesis can be rationally favored at one historical stage and lose support when:

- new evidence appears;
- a new competitor appears;
- likelihood estimates change;
- prior plausibilities change with background knowledge.

### Externalize sequence

1. Give only hypotheses H1 and H2; let H1 win.
2. Add H3, which predicts the evidence better.
3. Recompute posteriors.
4. Emphasize that H1 did not become logically inconsistent; it became less well-supported comparatively.

This is a strong **dynamic-curriculum** analogue: the learner’s model of a question can change when new conceptual options become available.

---

## VII.8 — Millennial design arguments

This section revisits contemporary forms of design reasoning and asks whether newer formulations improve on the older argument.

### Externalize strategy

Do not create separate one-off lessons for every modern design argument. Map them onto the same reusable schema:

```text
H = design hypothesis
A = alternatives
E = target evidence
B = background knowledge

ask:
- prior plausibility?
- P(E|H)?
- P(E|A)?
- omitted alternatives?
- total relevant evidence?
```

This turns later design arguments into **transfer exercises** for Bayesian explanation rather than curriculum forks.

---

## VII.9 — Why leave God-like beings out of otherwise natural explanations?

Sobel’s concluding recommendation is connected to the comparative explanatory framework: where natural explanations already account for the relevant phenomena, adding God-like beings is not explanatorily helpful.

### Externalize task: explanatory contribution test

Given a proposed explanation containing component X, ask:

1. Remove X.
2. Does the remaining theory predict the evidence equally well?
3. Does X improve fit, prior plausibility, simplicity, or scope?
4. If not, what work is X doing?

This generalizes to `explanatory redundancy` as a possible concept node.

---

# Appendix — Swinburne’s teleological and cumulative arguments

The appendix is ideal for Mastery/Transfer mode because it tests whether the learner can resist a common mistake about **cumulative confirmation**.

### Curriculum opportunity

Several pieces of evidence can each individually confirm a hypothesis, but combining them requires attention to dependence and to how the combined evidence behaves under H and alternatives. One cannot simply add “confirmation points.”

### Externalize sequence

1. Give two independent pieces of evidence; compute sequential updates.
2. Give two highly dependent pieces of evidence; show why naïve multiplication overcounts.
3. Ask whether each piece individually confirms H.
4. Ask whether the conjunction confirms H more strongly and under what assumptions.
5. Only then map the exercise to Swinburne’s cumulative strategy.

### Architectural finding

The SRS/content model should allow **evidence bundles** with dependency metadata. A cumulative-evidence exercise is not just a list of independent updates.

---

# Reading route for Chapter VII

```text
explanatory hypothesis
  -> alternatives + total evidence
  -> probability as confidence
  -> conditional probability
  -> reverse-conditional distinction
  -> priors + likelihoods
  -> Bayes update
  -> multiple competing hypotheses
  -> sequential / cumulative evidence
```

The reading route should front-load intuition and postpone formula manipulation until the learner can verbally identify `P(H)`, `P(E|H)`, and `P(H|E)`.

# Mastery route

Adds:

- probability axioms used by Sobel;
- conditional-probability calculations;
- derivation/use of Bayes for H vs ¬H;
- finite-partition Bayes;
- sequential updating;
- confirmation/disconfirmation measures;
- cumulative-evidence dependence.

# Candidate exercise families contributed to Externalize

- `deductive-vs-evidential-classifier`
- `total-evidence-update`
- `hypothesis-set-builder`
- `conditional-direction-selector`
- `prior-likelihood-posterior-sorter`
- `bayes-column-normalizer`
- `new-evidence-ranking-reversal`
- `none-of-the-above-partition`
- `cumulative-evidence-dependence`
- `explanatory-redundancy-test`

# Architectural findings from Chapter VII

1. **Probability state should be visibly externalized.** Priors, likelihoods, raw weights, and posteriors should never be collapsed into one opaque answer.
2. **Conditional direction is a distinct skill.** `P(H|E)` vs `P(E|H)` errors deserve their own error tag and review scheduling.
3. **Hypothesis sets are first-class curriculum objects.** Evidence is meaningful only relative to alternatives.
4. **The “none of the above” state matters.** The engine should not force exhaustive confidence into authored hypotheses unless they really form a partition.
5. **Historical/source changes can be modeled as background-information changes.** This suggests a general mechanism for book-based learning where later sections revise earlier rational conclusions without treating earlier reasoning as a mistake.
6. **Evidence bundles need dependency semantics.** Cumulative confirmation cannot safely be implemented as independent multiplication by default.

# Validation target

At Reading depth, the learner should be able to answer without the text:

1. Why is the design argument evidential rather than demonstrative?
2. Why do alternative hypotheses matter?
3. What is the difference between a prior, a likelihood, and a posterior?
4. Why is `P(H|E)` not the same as `P(E|H)`?
5. How can new evidence reverse an earlier ranking while the original evidence still favors H locally?
6. Why can adding a new explanatory competitor rationally reduce confidence in a previously favored hypothesis?

If the learner can perform those moves in a neutral barrel/forensic scenario and then transfer them back to Hume, Externalize has captured the chapter’s real machinery rather than merely paraphrasing its theology.