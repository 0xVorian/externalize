# *Logic and Theism* — Externalize curriculum map

**Source:** Jordan Howard Sobel, *Logic and Theism: Arguments For and Against Beliefs in God* (Cambridge University Press, 2004)  
**Status:** active first-pass map  
**Created:** 2026-09-07  
**Purpose:** use a real, difficult book to test source-driven curriculum routing

This document maps the book to reusable Externalize concepts and candidate interactions. It is not a summary of the book and should not reproduce it. Source anchors are chapter/section/page references; descriptions below are paraphrases.

The architecture behind this map is described in [`../adaptive-curriculum.md`](../adaptive-curriculum.md).

## Mapping discipline

Each mapped source unit should eventually record:

- `anchor` — chapter/section/pages;
- `requires` — durable concept prerequisites;
- `introduces` — concepts the passage can teach;
- `exercises` — concepts the passage can exercise;
- `stumblingBlocks` — likely failure modes;
- `modes` — Prerequisite / Derive / Predict / Interrogate / Formalize / Transfer;
- `depth` — what is needed for Reading vs Mastery;
- `provenance` — source-derived vs mapping inference;
- `reviewStatus` — how closely the actual section has been inspected.

### Review-status labels

- **reviewed** — section text inspected closely enough to map specific inferential moves or examples;
- **sampled** — representative text inspected, but not yet exhaustively mapped;
- **structure-only** — mapping currently rests on the book's contents/preface and should be validated against the section before authoring graded exercises.

## What the book demands from the learner

Sobel explicitly introduces formal machinery as required and keeps many formal derivations/models in appendices. Across the book, the main reusable substrate is:

1. ordinary-language argument structure;
2. propositional connectives and scope;
3. quantification and existential commitment;
4. descriptions, negation, and scope;
5. validity, indirect proof, derivation, model, countermodel;
6. possible worlds, necessity, possibility, essential properties;
7. quantified modal logic;
8. causal and explanatory structure, including infinite regress;
9. plain and conditional probability, then Bayesian confirmation;
10. sets, power sets, mappings, cardinality, Cantor's theorem;
11. decision theory, expected value, and infinite/hyperreal values.

This should become a dependency graph rather than a compulsory linear syllabus.

## Proposed source routes

### `logic-and-theism-reading`

Goal: keep the learner moving through Sobel with enough formal understanding to follow the arguments intelligently.

Rules:

- teach missing prerequisites just in time;
- skip long derivations when Sobel himself marks them as nonessential to continuity;
- require reconstruction of the central inferential move before proceeding;
- use formal appendices as optional deep dives unless a later section depends on them.

### `logic-and-theism-mastery`

Goal: reconstruct the formal machinery rather than merely follow it.

Adds:

- complete symbolization;
- explicit derivation steps;
- model/countermodel construction;
- modal proof work;
- numerical Bayes problems;
- Cantorian constructions;
- decision-theoretic calculations.

The user should be able to choose Reading or Mastery per section.

---

# Whole-book map

| Chapter | Source pages | Main reusable machinery | Externalize opportunity | Status |
|---|---:|---|---|---|
| I | 3–25 | names/descriptions, reference, existence vs nature, necessary/essential vs merely actual properties, possible-world framing, normative conditions | concept sorting, boundary cases, possible-world diagrams, necessary/sufficient-condition tests | reviewed/sampled |
| II | 29–80 | quantified logic, existential import, ambiguity of `a`, descriptions, negation scope, indirect proof, validity, models/countermodels | derive the ambiguity before revealing Sobel's use; debug invalid proofs; build countermodels | reviewed/sampled |
| III | 81–114 | sentential modal logic, possible worlds, necessity/possibility, possibility premises, conceivability vs possibility, quantified modal logic | world-grid exercises, modal consequence games, challenge possibility assumptions | structure-only |
| IV | 115–167 | higher-order quantified modal reasoning, positive properties, essence, necessary existence, modal collapse | scaffold definitions independently, toy domains, reconstruct theorem chain, inspect collapse | sampled/structure-only |
| V | 168–199 | predicate formalization of causal chains, generating vs sustaining causes, regress, uniqueness, gap from first cause to God | causal graphs, finite/infinite chains, premise inspection, distinguish historical from sustaining dependence | sampled |
| VI | 200–237 | contingency, sufficient reason, necessary vs contingent explanation, cosmological argument structure | explanation-chain games, aggregate-vs-member explanation, premise pressure tests | structure-only |
| VII | 238–297 | causal explanation, plain/conditional probability, Bayes, design inference | competing-hypothesis tasks, likelihood comparison, staged Bayesian updating | structure-only |
| VIII | 298–344 | miracles/laws, testimonial evidence, Bayes, witness reliability, lotteries, Condorcet | witness/base-rate simulations, testimony aggregation, likelihood-ratio intuition | sampled/structure-only |
| IX | 345–368 | omnipotence, possibility, essential properties, combinations of divine attributes | classify tasks, distinguish logical impossibility from inability, modal counterexamples | structure-only |
| X | 369–400 | reflective omniscience, sets/totalities, mappings, power sets, cardinality, Cantor | finite-set build-up to diagonal reasoning; reconstruct challenge to omniscience | structure-only |
| XI | 401–435 | demonstrative vs evidential atheology, evidential evil, Bayesian confirmation | entailment-vs-evidence classification, competing likelihoods, Rowe-style case analysis | structure-only |
| XII | 436–498 | logical problem of evil, possible worlds, best-world arguments, creatability, freedom/foreknowledge | world editing, incompatibility tests, better-world counterexamples, modal freedom exercises | sampled/structure-only |
| XIII | 499–538 | practical vs theoretical reasons, decision matrices, Bayesian rational choice, rival hypotheses, infinities/hyperreals | interactive payoff matrices, assumption toggles, expected-value calculations, infinity failure modes | structure-only |

---

# Detailed map: Chapter I

## I.1–I.3 — what is being asked when existence is in question

**Source focus:** before asking whether a named thing exists, Sobel insists that we need enough of a characterization to know what kind of referent is at issue. He distinguishes proper-name reference from descriptive content and develops the special role he thinks `God` plays.

**Requires**

- object-language vs metalinguistic talk;
- name vs description;
- existence claim vs characterization claim.

**Introduces / exercises**

- referential success and failure;
- empty names;
- conditions under which an existence question is well-posed;
- distinction between a name's bearer and descriptions speakers associate with it.

**Externalize sequence**

1. **Derive:** present invented names with progressively richer descriptions and ask when an existence investigation becomes possible.
2. **Interrogate:** classify statements as about a name, a concept, or a purported referent.
3. **Transfer:** construct a case where two people use different descriptions but successfully refer to the same thing.
4. **Predict:** before Sobel moves from ordinary names to `God`, ask which parts of the preceding analysis will transfer and which may be special.

**Likely stumbling block:** conflating `we can use a name meaningfully` with `the name has a bearer`.

**Reading exit:** learner can explain why the nature/identification question logically precedes the existence question without assuming that a referent actually exists.

**Status:** reviewed.

## I.4–I.6 — worship-worthiness, perfect-being theology, and essentiality

**Source focus:** Sobel treats worthiness of worship as the semantic/core attitudinal constraint and then relates this to philosophical and traditional conceptions of divine greatness. He distinguishes merely possessing an attribute from possessing it essentially, using possible-world language.

**Requires**

- property attribution;
- necessity vs actuality at an intuitive level;
- possible worlds as total ways things might have been.

**Introduces / exercises**

- necessary vs sufficient conditions for being a god under different conceptions;
- omnipotence / omniscience / perfect goodness as proposed greatness dimensions;
- essential vs merely actual property;
- contingent vs necessary existence;
- truth at a world vs truth at every world where an object exists.

**Externalize sequence**

1. **Prerequisite:** three-world toy model: `X exists and is P`, `X exists and is not P`, `X does not exist`.
2. **Derive:** ask what would have to be true for `X is essentially P`.
3. **Formalize:** introduce the distinction between `X is essentially P` and `necessarily, X is P`, especially when X need not exist in every world.
4. **Transfer:** use ordinary examples such as a person being educated, a geometric object having a defining property, or an artefact having a contingent colour.
5. **Interrogate:** ask whether worship-worthiness entails every traditional divine attribute, or whether those are further theological/philosophical commitments.

**Likely stumbling blocks**

- treating `essentially P` as identical to `necessarily P` without attending to existence;
- confusing a semantic/core condition with a full traditional theology;
- assuming the historical order of ideas must match Sobel's explanatory order.

**Reading exit:** learner can read the rest of the book while keeping `perfect`, `essentially perfect`, and `necessarily existent` distinct.

**Mastery detour:** modal symbolization of essential predication.

**Status:** reviewed.

## I.7–I.8 — can there be a god without a perfect being, or a perfect being without a god?

**Source focus:** Sobel separates perfect-being metaphysics from the attitudinal/normative criterion and explores cases where these come apart.

**Introduces / exercises**

- counterexample construction against alleged biconditionals;
- objective vs subjective/normative conditions;
- testing definitions using edge cases.

**Externalize sequence**

1. State candidate biconditionals such as `god iff perfect being`.
2. Ask the learner to attack each direction separately.
3. Generate a being that is very great but not maximally perfect; ask whether the core criterion is still met.
4. Generate a perfect being in a normative framework where worship is never objectively appropriate; ask what follows.

**Reading exit:** learner sees that later existence arguments may establish a being with some formal property without automatically establishing `God` under every conception.

**Status:** reviewed/sampled.

---

# Detailed map: Chapter II

Chapter II is the strongest initial proving ground for source-driven Externalize because Sobel repeatedly argues that apparently deep metaphysical proofs fail for comparatively local logical reasons.

## II.1 — what an ontological demonstration claims to do

**Source focus:** an ontological proof aims to establish existence without contingent premises. Sobel contrasts necessary truth with contingent fact and notes that necessary existence is not incoherent simply because ordinary objects are contingent.

**Requires**

- premise / conclusion;
- deductive validity;
- necessary vs contingent proposition.

**Externalize sequence**

- classify arguments by whether a contingent premise is doing work;
- contrast `necessarily, some prime lies between 20 and 25` with ordinary existence claims;
- ask what kind of conclusion a demonstration from necessary premises could establish.

**Status:** reviewed.

## II.2 — Descartes: universal claim vs existential conclusion

**Core map:** Sobel's decisive criticism is that the English sentence `A supremely perfect being exists` can slide between a general/hypothetical reading and an existential reading. The premises can support the former without establishing that any such being exists.

**Requires**

- universal quantification;
- existential quantification;
- conditional;
- existential import;
- indirect proof;
- validity vs soundness.

**Introduces / exercises**

- ambiguity of indefinite articles;
- vacuous truth;
- why a definition can constrain anything satisfying it without guaranteeing an instance;
- countermodel as a decisive validity test.

**Externalize sequence**

1. **Derive:** ordinary-language examples in which `A F is G` means `Any F is G` and examples in which it reports that at least one F exists.
2. **Formalize:** map the two readings to universal-conditional and existential-conjunctive forms.
3. **Predict:** ask which reading Descartes needs for his conclusion.
4. **Interrogate:** derive what actually follows from `every perfect being has every perfection` plus `existence is a perfection`.
5. **Countermodel:** set the domain so that nothing is a perfect being; inspect which premises remain true and why the existential conclusion fails.
6. **Transfer:** use a fresh invented property that includes `exists` by stipulation and show why that still does not instantiate the kind.

**Likely stumbling blocks**

- thinking `all F are G` entails `some F is G`;
- treating a true conditional with an empty antecedent class as evidence for an instance;
- focusing prematurely on whether existence is a property rather than the validity defect Sobel isolates.

**Reading exit:** learner can state in one sentence why the proof does not establish existential import.

**Mastery exit:** learner can construct a countermodel and symbolize both readings without help.

**Status:** reviewed closely.

## II.3 — Spinoza, Russell, and scope of descriptions under negation

**Core map:** Sobel interprets the argument through Russellian descriptions and argues that a bridging sentence involving `the infinite substance` and negation changes scope across two inferential roles. One reading is supported by the earlier premises but cannot support the conclusion; the other can support the later inference but is not established by the earlier premises.

**Requires**

- uniqueness / definite descriptions;
- identity;
- negation scope;
- existential quantification;
- validity and model checking.

**Introduces / exercises**

- narrow vs wide scope of a definite description relative to negation;
- one sentence expressing materially different propositions;
- bridge-premise scope shift;
- why informal reasoning can silently optimize an ambiguous sentence differently at different stages.

**Externalize sequence**

1. Start with ordinary `the F is not G` examples where either the description or negation has wider scope.
2. Render both readings visually with nested scope boxes.
3. Give an argument where a bridging sentence must keep one fixed interpretation from introduction to elimination.
4. Only then return to Sobel's reconstruction and ask the learner to identify which reading is needed at each step.
5. Build the simple model in which the premises are true and the intended conclusion false.

**Reading exit:** learner can explain the scope switch without needing the complete Russellian formalism.

**Mastery detour:** Russellian definite-description notation plus derivations/models from the appendices.

**Status:** sampled closely enough to identify the central scope mechanism; full subsection audit still needed.

## II.4 — Anselm: existence in the mind, existential premise, and the burden of the preliminary argument

**Core map:** Sobel distinguishes a universal result from the existential result Anselm actually needs, reconstructs the main argument, and puts pressure on the preliminary move from understanding a description to there being an object of that description in the mind. He connects this to the later modal issue of conceivability vs possibility.

**Requires**

- existential instantiation/generalization;
- indirect proof;
- universal vs existential statement;
- concept/description vs object falling under it.

**Externalize sequence**

1. Separate `I understand the phrase F` from `there is an F in my mind`.
2. Use fictional/impossible descriptions to test the inference.
3. Reconstruct the main reductio while pinning the existential premise visibly.
4. Ask which step carries the real burden once the remainder is granted.
5. Defer the full conceivability/possibility issue into Chapter III, creating a visible dependency link.

**Reading exit:** learner knows why Sobel says the preliminary argument does the substantive work.

**Status:** reviewed.

## II.5 and Appendices — Kant, symbolization, derivations, models, inference rules

**Current mapping:** the section and appendices clearly support a formal mastery branch involving existence claims, symbolization, derivation, model construction, and inference rules. The exact lesson decomposition should wait for a closer section audit rather than being inferred only from headings.

**Status:** structure-only for §5; appendix role confirmed by the book's preface and chapter structure.

---

# Chapter III — modal ontological arguments

**Source anchors:** Chapter III, pp. 81–114; possible-world appendix pp. 99–104; modal-logic appendix pp. 105–114.

**Concept nodes likely required**

- `possible-world`
- `actual-world`
- `necessity`
- `possibility`
- `s5-accessibility`
- `modal-consequence`
- `conceivability-vs-possibility`
- `possibility-premise`
- `question-begging`
- `quantified-modal-logic`

**Candidate route**

1. Concrete world cards before modal symbols.
2. `true here / true somewhere / true everywhere` classification.
3. Translate to `◇` / `□` only after the world semantics is secure.
4. Reconstruct the Hartshorne/Plantinga inferential shape.
5. Make the possibility premise a separately inspectable object.
6. Generate descriptions that are understandable/conceivable yet not thereby logically possible.
7. End with the epistemic question: if the argument is valid, what licenses the possibility premise?

**Reading depth:** understand the modal move and the dispute over possibility.

**Mastery depth:** appendix B, including formal sentential modal reasoning and quantified modal logic.

**Status:** structure-only; next detailed audit target after Chapter II.

---

# Chapter IV — Gödel's proof

**Source anchors:** pp. 115–167.

The opening material confirms that the proof is framed through a theory of positive properties, essence, and necessary existence, in quantified modal logic, with the possibility of a God-like being proved rather than merely assumed.

**Concept nodes**

- properties as objects of quantification;
- positive property;
- God-like being;
- essence;
- necessary existence;
- higher-order quantification;
- quantified modal derivation;
- modal collapse.

**Externalize strategy**

Do not present the proof as one object. Make each definition executable in a tiny toy domain, then compose them.

Possible sequence:

1. first-order predicates vs quantifying over properties;
2. toy `positive` classification with deliberately artificial properties;
3. instantiate `God-like` in the toy domain;
4. inspect each axiom independently;
5. build the theorem dependency graph;
6. replay the proof one dependency at a time;
7. introduce modal collapse as a property of the resulting system and ask the learner to identify what it would mean for contingency.

**Status:** sampled/structure-only.

---

# Chapter V — Aquinas and first causes

**Source anchors:** pp. 168–199.

Sampled text confirms that Sobel formally articulates causal premises, treats the ban on an infinite regress as the heart of the argument, distinguishes generating from sustaining efficient causation, and separately examines the gap between a first cause and the intended conclusion about God.

**Concept nodes**

- causal relation;
- priority relation;
- irreflexive / asymmetric / transitive relation;
- generating cause;
- sustaining cause;
- causal chain;
- infinite regress;
- first member / first cause;
- uniqueness;
- conclusion-strength / inferential gap.

**Externalize sequence**

1. Draw a causal DAG for a familiar generated object.
2. Contrast it with a sustaining dependency (e.g. a system whose continued state depends on a presently operating support).
3. Ask which causes must coexist with their effects.
4. Build finite causal chains and identify what `no infinite regress` does and does not supply.
5. Ask whether every chain must share one first cause.
6. Ask whether a historical first cause must still exist now.
7. Ask what further premise is needed to identify a first cause with God.

This chapter is especially good for **argument debugging as dependency-graph inspection**.

**Status:** sampled.

---

# Chapter VI — contingency and sufficient reason

**Source anchors:** pp. 200–237.

**Confirmed from book structure/preface:** the chapter examines Leibnizian cosmological reasoning from contingent premises and ultimate reasons, with comparisons to ontological and first-cause arguments.

**Candidate concepts**

- contingent fact / being;
- necessary fact / being;
- sufficient reason;
- explanation chain;
- explanation of member vs explanation of totality;
- regress of reasons;
- modal status of an explanans.

**Candidate Externalize tasks**

- `Why?` chains where every local step is explained but the learner must ask whether the whole obtains an explanation;
- classify explanations as causal, grounding, or merely redescriptive;
- compare a first-cause argument with an ultimate-reason argument using the same dependency diagram but different edge meanings.

**Status:** structure-only; must be validated section by section before graded authoring.

---

# Chapter VII — design and Bayesian confirmation

**Source anchors:** pp. 238–297.

**Confirmed from preface/contents:** causal-explanation assessment leads into plain and conditional probability and Bayes, then back into arguments from design and Swinburne.

**Concept nodes**

- hypothesis;
- evidence;
- likelihood;
- prior probability;
- posterior probability;
- conditional probability;
- Bayes theorem;
- competing causal explanation;
- cumulative evidence.

**Externalize sequence**

1. Start with two mundane competing explanations and one observation.
2. Ask which hypothesis makes the observation more expected.
3. Only then introduce `P(E|H)`.
4. Separate likelihood from posterior probability.
5. Add priors.
6. Build Bayes numerically.
7. Return to design and ask exactly which probabilistic quantity each argumentative claim concerns.

**Status:** structure-only.

---

# Chapter VIII — miracles and testimony

**Source anchors:** pp. 298–344.

Sampled text confirms that Sobel distinguishes miracle evidence from direct evidence for God and develops testimony through Bayesian analysis, witness reliability, and lottery examples.

**Concept nodes**

- rare event / base rate;
- testimony as evidence;
- witness reliability;
- false positive / false report;
- posterior odds;
- independent vs dependent testimony;
- lottery reasoning;
- aggregation of witnesses.

**Externalize sequence**

1. A rare event with a fallible witness, initially without formulas.
2. Learner predicts whether `90% reliable` means `90% chance the rare event occurred`.
3. Reveal base-rate dependence numerically.
4. Add a second witness and vary independence.
5. Translate the intuition into Bayes.
6. Return to miracle testimony.

This is a high-value chapter for concrete examples because the common intuitive error is easy to reproduce outside theology.

**Status:** sampled/structure-only.

---

# Chapter IX — omnipotence

**Source anchors:** pp. 345–368.

**Confirmed from contents/preface:** the chapter tests omnipotence alone, essential omnipotence, necessary everlasting existence with omnipotence, and combinations with other attributes.

**Concept nodes**

- ability / task;
- logically possible state of affairs;
- self-referential task descriptions;
- essential property;
- compatibility of attributes.

**Candidate Externalize tasks**

- classify candidate `tasks` as coherent, logically impossible, or merely difficult;
- separate `cannot do X` from `there is no coherent X to do`;
- possible-world matrices for `omnipotent here` vs `essentially omnipotent`;
- pairwise compatibility checks with other divine attributes.

**Status:** structure-only.

---

# Chapter X — omniscience and Cantor

**Source anchors:** pp. 369–400; set-theory appendix pp. 394–400.

**Confirmed from contents/preface:** Sobel develops challenges using reflective knowledge, totalities, mappings, and Cantorian set theory, then provides an appendix on power sets, cardinalities, and Cantor's theorem.

**Concept nodes**

- set;
- subset;
- power set;
- one-to-one mapping;
- cardinality;
- Cantor's theorem;
- diagonal argument;
- reflective knowledge;
- totality / subtotality.

**Externalize sequence**

1. Build all subsets of `{a}`.
2. Build all subsets of `{a,b}`.
3. Observe `2^n` growth.
4. Attempt to pair members of a finite set with all subsets.
5. Generalize to Cantor's theorem using the diagonal subset.
6. Only then map the formal structure onto Sobel's challenge concerning reflective knowledge.

**Reading depth:** intuitive force of the cardinality problem.

**Mastery depth:** proof of Cantor's theorem and exact mapping argument.

**Status:** structure-only.

---

# Chapter XI — evidential arguments from evil

**Source anchors:** pp. 401–435.

**Confirmed from preface/contents:** the chapter distinguishes demonstrative atheologies from evidential arguments and treats Rowe's arguments plus a Bayesian issue.

**Concept nodes**

- incompatibility vs disconfirmation;
- evidence;
- likelihood ratio;
- prior/posterior belief;
- explanatory alternative;
- skeptical response.

**Externalize sequence**

- classify arguments as deductive or evidential;
- for a concrete observation, compare `P(E|theism)` and `P(E|alternative)` without yet asking for a posterior;
- make the missing prior assumptions explicit;
- construct different rational agents with different background information and inspect whether evidence moves them identically.

**Status:** structure-only.

---

# Chapter XII — logical problem of evil and freedom

**Source anchors:** pp. 436–498.

Sampled material confirms that Sobel treats the logical problem as aimed at the nonmodal core of perfect-being theism and separately develops modal questions around best worlds and omniscience/freedom.

**Concept nodes**

- consistency / incompatibility;
- possible world;
- best world;
- better-than relation;
- creatable world;
- guaranteed outcome / bet;
- free action;
- foreknowledge;
- necessity of the past / modal scope.

**Externalize sequence**

1. Express the classical problem as a consistency test rather than an emotional case.
2. Give a tiny model with attributes and an evil fact; ask what additional premise creates contradiction.
3. Move to best-world reasoning: allow the learner to edit one feature and ask whether the result is genuinely a possible/creatable better world.
4. Separate `better possible`, `better creatable`, and `better guaranteed`.
5. For freedom/foreknowledge, use timelines plus possible-world branches to keep temporal and modal claims distinct.

**Status:** sampled/structure-only.

---

# Chapter XIII — Pascalian wagers

**Source anchors:** pp. 499–538.

**Confirmed from preface/contents:** the chapter treats practical reasons for belief through probabilities and values, then varies costs, reward policies, competing God hypotheses, punishments, commensurability, and willful belief; the appendix introduces hyperreals for decision theory.

**Concept nodes**

- theoretical vs practical reason;
- action/belief option;
- state of world;
- payoff/utility;
- probability;
- expected utility;
- dominated option;
- rival hypotheses;
- infinite utility;
- hyperreal / infinitesimal extension.

**Externalize sequence**

1. Start with a finite 2×2 decision matrix unrelated to religion.
2. Compute expected values.
3. Return to a simple Pascal matrix.
4. Add one complication at a time: cost, alternative reward policy, rival god, punishment, epistemic value.
5. Let the learner predict which previous conclusion breaks after each change.
6. Introduce infinite utility only once ordinary expected-value mechanics are secure.
7. Show why `∞` can destroy ordinary comparison; use the hyperreal appendix only in Mastery depth.

**Status:** structure-only.

---

# Cross-book reusable concept graph seeded by Sobel

This book suggests several additions beyond the current propositional-logic prerequisite graph. These are candidate durable nodes, not yet implementation commitments.

```text
proposition
  -> quantifier
     -> existential-import
     -> quantifier-scope
        -> definite-description-scope
  -> validity
     -> indirect-proof
     -> countermodel

possible-world
  -> necessity-possibility
     -> essential-property
     -> s5-modal-reasoning
        -> quantified-modal-logic

causal-relation
  -> causal-chain
     -> infinite-regress
     -> first-cause

conditional-probability
  -> likelihood
  -> bayes-theorem
     -> bayesian-confirmation
     -> testimony-evidence

set
  -> subset
     -> power-set
  -> mapping
     -> cardinality
        -> cantor-theorem

probability
  -> expected-utility
     -> infinite-utility
        -> hyperreal-decision-theory
```

Dependencies between these families still need careful normalization. For example, quantified modal logic also depends on quantification, and the Bayes path should reuse whatever probability concepts are introduced earlier rather than define parallel nodes.

# First implementation experiment

Do **not** implement the entire map.

The cheapest useful experiment is Chapter II §2 (Descartes), because Externalize can already support much of the required propositional/scope reasoning and the missing predicate-logic capability is already under design.

A source-driven prototype for that section should test whether Externalize can:

1. detect that the learner needs universal vs existential quantification;
2. teach or retrieve it with neutral examples;
3. move into a source-shaped derivation exercise;
4. keep the two readings of the English sentence simultaneously visible;
5. let the learner construct the countermodel;
6. finish with a fresh transfer example;
7. write mastery evidence back to the same canonical quantifier/scope concepts used by the conventional logic route.

If this feels substantially better than reading the section plus taking a generic logic lesson, the adaptive-route hypothesis has earned further implementation work.

# Next mapping work

Priority order:

1. Audit Chapter III section by section and turn the possible-world/modal material into explicit concept dependencies.
2. Complete Chapter II §5 and appendices, with Reading vs Mastery separation.
3. Audit Chapter V because it tests whether Externalize generalizes from symbolic syntax to causal/dependency graphs.
4. Audit Chapters VII–VIII because Bayes provides a second formal domain with excellent concrete examples.
5. Audit Chapter X because Cantor tests whether the same architecture can teach genuinely mathematical machinery.
6. Finish XI–XIII after the supporting modal/Bayesian/decision-theory nodes are stable.

The map should remain useful while incomplete. We should expand it in the order the book is actually being read rather than blocking use on exhaustive authoring.
