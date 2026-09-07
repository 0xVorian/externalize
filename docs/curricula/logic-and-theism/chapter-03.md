# *Logic and Theism* — Chapter III detailed Externalize map

**Source:** Jordan Howard Sobel, *Logic and Theism: Arguments For and Against Beliefs in God* (Cambridge University Press, 2004)  
**Chapter:** III, “Modern Modal Ontological Arguments,” pp. 81–114  
**Status:** reviewed first detailed pass  
**Created:** 2026-09-07  
**Parent map:** [`../logic-and-theism.md`](../logic-and-theism.md)  
**Architecture:** [`../../adaptive-curriculum.md`](../../adaptive-curriculum.md)

This file maps Chapter III to reusable Externalize concepts and candidate interactions. It is not a substitute for Sobel’s text. Source descriptions are paraphrases, and graded exercises should be checked against the source section again before shipping.

## Why this chapter matters for Externalize

Chapter III is the first place where the source-driven route is materially different from a conventional logic syllabus.

A conventional course would normally teach modal semantics, operators, systems, and derivations in a pedagogically tidy order. Sobel instead gives the learner a live philosophical problem first: a valid modal ontological argument whose apparent weakness is concentrated in a possibility premise. The formal machinery is introduced because the argument needs it.

That makes Chapter III a strong test of the adaptive-curriculum thesis:

- the learner should get just enough possible-world semantics to follow the argument;
- previously mastered propositional/predicate material should be reused rather than retaught;
- `◇` and `□` should arrive as compact notation for already-understood world claims;
- the source should supply motivation and transfer cases;
- formal S5 and quantified modal logic should remain a mastery branch unless the learner wants them.

## Durable concept nodes

The chapter exercises or introduces the following source-independent nodes.

### Core reading nodes

- `possible-world`
- `actual-world`
- `truth-at-world`
- `necessity`
- `possibility`
- `modal-negation`
- `necessary-existence`
- `essential-perfection`
- `modal-consequence`
- `possibility-premise`
- `question-begging`
- `conceivability`
- `conceivability-vs-possibility`
- `a-priori-consistency`
- `rigid-actuality-reference`

### Mastery nodes

- `s5-modal-logic`
- `necessity-derivation`
- `quantifying-into-modal-context`
- `varying-world-domains`
- `existence-predicate-in-modal-logic`
- `free-quantified-modal-logic`

### Reused prerequisites from earlier chapters / canonical track

- `conditional`
- `negation`
- `modus-ponens`
- `logical-equivalence`
- `validity`
- `universal-quantifier`
- `existential-quantifier`
- `essential-vs-accidental-property`
- `existential-import`
- `indirect-proof`

---

# Route through the chapter

## III.1 — Malcolm: impossible or necessary

**Anchor:** §1, p. 81–82.

**Source focus:** Malcolm reads Anselm as treating necessary existence as a perfection. On that conception, if God exists, God exists necessarily; the live alternatives are therefore impossibility or necessity. Malcolm then needs the claim that a perfect being is not impossible.

**Requires**

- possibility vs impossibility;
- necessity;
- necessary existence;
- the difference between `if P, necessarily P` and `necessarily, if P then necessarily P` at an intuitive level.

**Introduces / exercises**

- modal trichotomy pressure: contingent / impossible / necessary;
- the move from a definition of perfection to a modal constraint on existence;
- identifying where substantive work remains after a conditional structure is accepted.

**Externalize sequence**

1. **Prerequisite:** show three world-sets for an ordinary proposition: true in some worlds only, none, all.
2. **Derive:** ask the learner to classify these as contingent, impossible, necessary.
3. **Interrogate:** give the rule `if something is perfect, it cannot exist contingently`; ask what possibilities remain for perfection.
4. **Predict:** before showing Malcolm’s next move, ask what premise must be supplied to eliminate impossibility.
5. **Transfer:** use a deliberately artificial property whose definition forces necessary existence and ask whether defining the property proves an instance.

**Likely stumbling block:** hearing “either impossible or necessary” as if it had already established the necessary horn.

**Reading exit:** learner can say that the argument’s pressure moves immediately onto the possibility of the relevant kind of being.

**Status:** reviewed.

## III.2 — Hartshorne: AP + IP

**Anchor:** §2, pp. 82–86.

**Source focus:** Sobel presents Hartshorne’s two-premise argument. `AP` (Anselm’s Principle) says, in effect, that if perfection is instantiated, it is instantiated necessarily. `IP` (the Intuitive Postulate) says that a perfect being is possible. Sobel then walks through the inference using possible-world columns: possibility gives a world in which perfection is instantiated; AP holds across worlds; from the world in which perfection is instantiated, necessary perfection follows; necessity then yields perfection in the actual world as well.

**Requires**

- `P → □P`;
- `◇P`;
- modus ponens;
- truth at a world vs truth at the actual world.

**Introduces / exercises**

- possible-world semantics as an executable proof aid;
- distinction between a premise being necessary and its consequent being necessary;
- S5-style propagation from possibility of a necessary state to necessity.

**Externalize sequence**

1. **World cards first:** three cards: actual world, witness possible world, other worlds.
2. Put `◇P` on the actual-world card and require the learner to select a witness world where `P` holds.
3. Put `□(P → □P)` into the persistent premise tray; Externalize automatically displays the conditional at each world.
4. Ask the learner to apply modus ponens in the witness world to derive `□P` there.
5. Ask what `□P` means visually: place `P` on every world card, including the actual world.
6. Only then compress the state to modal notation and replay the proof without world cards.

**Key design point:** this is exactly the sort of derivation where “externalize every intermediate state” has real value. The user should never have to remember which world licensed which line.

**Reading exit:** learner can reconstruct why AP + IP yields actual perfection and, in Sobel’s enhanced presentation, necessary perfection.

**Mastery exit:** learner can derive the result in the modal proof system of Appendix B without the world-card scaffold.

**Status:** reviewed closely.

## III.2.2–III.2.x — relation to Anselm

**Source focus:** Sobel treats Hartshorne’s argument as a modern modal transcription of the major argument of *Proslogion* II: Anselm’s “exists in the mind” becomes modal possibility, and the major inferential shape is retained in clearer modern notation.

**Externalize opportunity**

- side-by-side representation transformation:
  - Anselmian language;
  - possible-world paraphrase;
  - modal symbols.

**Exercise:** hide one column and ask the learner to reconstruct the translation, then ask which version makes the inferential burden easiest to see.

**Transfer value:** demonstrates that formalization can expose structure without changing the philosophical claim.

**Status:** sampled/reviewed for the central relation.

## III.3 — Plantinga’s “fly in the ointment” and Sobel’s reply

**Anchor:** §3, pp. 86–88.

**Source focus:** Plantinga objects to a version that combines possibility of perfection with necessary existence as a perfection: this gets a necessarily existing being that is only possibly perfect, not straightforwardly a perfect being. Sobel argues this is not fully fair to Hartshorne because Hartshorne’s conception also builds in necessary or essential perfection, not merely necessary existence.

**Requires**

- de re / object-level property tracking across worlds at an intuitive level;
- necessary existence vs necessary possession of a property;
- essential perfection.

**Introduces / exercises**

- separating `x exists in every world` from `x is perfect in every world`;
- diagnosing a conclusion that is weaker/different from the intended one;
- charitable reconstruction of an argument.

**Externalize sequence**

1. Show one object persisted across three world cards.
2. Toggle `exists` on in every world but `perfect` only in one.
3. Ask whether this satisfies necessary existence, essential perfection, both, or neither.
4. Present Plantinga’s target conclusion and ask what is still missing.
5. Add Hartshorne’s stronger constraint and replay.

**Likely stumbling block:** collapsing necessary existence and essential perfection because both are represented with `□`.

**Reading exit:** learner can distinguish a necessarily existing possibly-perfect being from an essentially perfect necessary existent.

**Status:** reviewed.

## III.4 — alternative Anselmian formulations

**Anchor:** §4, pp. 88–89.

**Source focus:** Sobel compares stronger and weaker formulations that redistribute work between the perfection principle and the possibility premise. Some versions move from sentential modal logic into quantified modal logic because they quantify into modal contexts and track an individual across worlds.

**Requires**

- sentential vs quantified modal reasoning;
- existence-entailing predicates;
- essential-property formulation.

**Introduces / exercises**

- same philosophical burden represented by different formal decompositions;
- why apparently small changes in premise form change the required logic;
- `only existents can be P` vs `anything P is necessarily existent and P`.

**Externalize sequence**

- give two logically related formulations as dependency graphs;
- ask which premise is stronger and which possibility premise must compensate;
- badge each formulation with the minimum engine required: sentential modal vs quantified modal.

**Reading exit:** learner understands why the modal ontology debate is not tied to one exact formalization.

**Mastery detour:** formal derivations of the stronger quantified variants.

**Status:** reviewed/sampled.

## III.5 — “It’s the possibility!”

**Anchor:** §5, pp. 89–90.

**Source focus:** Sobel makes explicit that the difficult premise is the possibility premise. Hartshorne himself calls the postulate of logical possibility the hardest part to justify. Sobel rejects a Leibnizian presumption that whatever has not been proved impossible may be presumed possible, using van Inwagen’s “knowno” style counterpressure: such a policy can license incompatible presumptions.

**Requires**

- possibility premise;
- consistency of a set of commitments;
- distinction between `not proved impossible` and `proved possible`.

**Introduces / exercises**

- burden of proof for modal premises;
- epistemic ignorance vs metaphysical possibility;
- incompatible possibility presumptions.

**Externalize sequence**

1. Give three statuses: `proved impossible`, `not known impossible`, `established possible`.
2. Ask the learner to sort claims into them.
3. Construct two claims each not known impossible but jointly inconsistent under the argument’s modal consequences.
4. Ask what goes wrong with the rule `if not disproved, treat as possible`.
5. Return to IP and pin it as the unresolved node in the proof graph.

**Reading exit:** learner no longer treats `◇P` as a weak or automatically innocent premise merely because it contains a possibility operator.

**Status:** reviewed.

## III.6 — the question-begging charge

**Anchor:** §6, pp. 90–91.

**Source focus:** critics argue that, once the Anselmian conception of perfection is fixed, the possibility premise is equivalent to—or in some formulations stronger than—the necessary-existence conclusion. In Hartshorne’s original setup, AP makes `◇P` equivalent to `□P`; therefore the apparently modest possibility premise already carries the conclusion’s modal force.

**Requires**

- logical equivalence;
- analytic/definitional premise vs substantive premise;
- question-begging as an epistemic/dialectical complaint rather than invalidity.

**Externalize sequence**

1. Keep AP fixed as a rule card.
2. Have the learner derive `◇P → □P`.
3. Give `□P → ◇P` separately as the easy reverse direction.
4. Collapse the two into `◇P ↔ □P` under AP.
5. Ask: if your premise is equivalent to your conclusion under the agreed definition, what has the argument taught a skeptic?
6. Contrast this with an ordinary mathematical proof whose premises are necessary but not merely a renamed target.

**Critical distinction:** Sobel’s criticism here is not “the argument is invalid.” Quite the opposite: the modern modal arguments are logically clean. The question is whether their key premise has independent warrant.

**Reading exit:** learner can explain why validity and question-begging are different diagnostics.

**Status:** reviewed closely.

## III.7 — the friends’ response: heuristic advantage

**Anchor:** §7, pp. 91–92.

**Source focus:** defenders reply that necessary premises and necessary conclusions are normal in demonstrations, so equivalence alone cannot automatically be a vice. Their stronger reply is epistemic: a possibility premise may be easier to know than the corresponding necessity because one may inspect a concept, find it coherent or conceivable, and thereby gain access to possibility.

**Requires**

- logical vs epistemic relations;
- proof vs justification;
- concept coherence.

**Introduces / exercises**

- `P entails Q` vs `P is epistemically easier to establish than Q`;
- heuristic advantage;
- the proposed bridge from conceivability/coherence to possibility.

**Externalize sequence**

- present two equivalent propositions under a background theory and ask whether they must be equally easy to justify;
- use simple mathematical equivalences where one direction is cognitively easier;
- then ask what extra epistemic principle would make `conceivable(P)` evidence for `◇P`.

**Reading exit:** learner sees why the debate cannot stop at formal equivalence; it turns on access to modal truth.

**Status:** reviewed.

## III.8 — conceivability does not entail possibility

**Anchor:** §8, pp. 92–96.

**Source focus:** Sobel treats this as the heart of the objection. Absence of an a priori discoverable contradiction is not sufficient for logical/metaphysical possibility. He develops Rowe-style artificial predicates such as “magican” and the analogous “dragoon” case to show that a concept can be understandable and a priori coherent while its instantiation is impossible because the definition reaches back to contingent facts about the actual world. He distinguishes a priori consistency from logical consistency and discusses the more modest idea that richer conceivability might be defeasible evidence for possibility, while arguing that this does not rescue the Anselmian possibility premises because those premises have been defined so that possibility entails actuality/necessity.

**Requires**

- actual-world reference;
- rigid reference to actuality;
- a priori vs a posteriori information;
- conceptual coherence vs metaphysical possibility.

**Introduces / exercises**

- actuality-sensitive predicates;
- a priori consistency vs logical possibility;
- counterexample to `conceivable → possible`;
- defeasible evidence vs proof;
- why a source of evidence can fail exactly in cases where the proposition encodes actuality.

**Externalize sequence**

1. **Prerequisite:** fix `@` as a rigid label for the actual world.
2. Define an artificial predicate whose satisfaction at any world depends partly on what is true at `@`.
3. Let the learner inspect the definition and confirm that no contradiction is visible from meanings alone.
4. Reveal/assume an actual-world fact that makes the predicate impossible to instantiate.
5. Ask the learner to distinguish:
   - understandable description;
   - a priori coherent description;
   - imaginable scenario;
   - metaphysically possible scenario.
6. **Transfer:** invent a new actuality-sensitive predicate and construct the same pattern.
7. Return to perfect-being possibility and ask whether merely understanding the concept can establish `◇P` when the concept itself makes `◇P` entail actuality/necessity.

**This is an especially valuable Externalize exercise family.** It converts a subtle modal-epistemology point into an executable dependency: one definition edge points back to `@`, and the learner can literally see why facts about actuality matter to what is possible.

**Likely stumbling blocks**

- treating `I can imagine the words without contradiction` as the same as metaphysical possibility;
- failing to notice that a predicate may encode actual-world facts inside its satisfaction conditions;
- thinking Sobel denies all evidential relevance of conceivability rather than denying the entailment and questioning its usefulness in this special setting.

**Reading exit:** learner can produce a counterexample to the unrestricted conceivability-to-possibility principle and explain why it bears on IP.

**Mastery exit:** learner can formulate the actuality-sensitive counterexample with world-relative semantics and modal notation.

**Status:** reviewed closely.

## III.9 — from proof to rational permission

**Anchor:** §9, pp. 96–98.

**Source focus:** Sobel discusses Plantinga’s more modest claim. Plantinga accepts that his best modal ontological argument is question-begging as a proof for someone who does not already accept the conclusion, but argues that accepting the possibility premise can still be rational; the argument would then support the rational acceptability of theism rather than prove its truth. Sobel presses the gap between saying the premise is rationally acceptable and actually showing that the relevant maximal-greatness concept is coherent/possible.

**Requires**

- proof vs rational permission;
- dialectical audience;
- premise acceptability vs truth.

**Introduces / exercises**

- different success criteria for arguments;
- proof, persuasion, consistency, rational permissibility;
- audience-relative dialectical force.

**Externalize sequence**

1. Tag an argument with possible goals: `prove`, `show consistency`, `license belief`, `shift burden`, `explain consequences`.
2. Ask which goal survives if a skeptic will not accept the first premise.
3. Present two learners with different prior commitments and show how the same valid argument can have different dialectical force without changing its validity.
4. Ask what evidence would still be needed to justify the possibility premise itself.

**Reading exit:** learner can distinguish “valid conditional route from P” from “proof of P” and from “P is rationally permissible to believe.”

**Status:** reviewed.

---

# Appendix A — possible worlds

**Anchor:** pp. 99–104.

Sobel’s appendix develops possible worlds as comprehensive ways things might have been, distinguishes truth/actuality at worlds, warns against treating possible worlds as merely stories, and frames a logic in terms of what world-sentences settle.

## Reading-track extraction

The learner needs only:

- a possible world is a total/comprehensive way things might have been;
- a proposition can be true at one world and false at another;
- the actual world is the world that is actual, but modal claims quantify over possible worlds;
- `□P` corresponds to truth at all relevant possible worlds;
- `◇P` corresponds to truth at at least one relevant possible world.

**Externalize interaction:** world cards should visibly distinguish the selected actual world from merely possible cards without implying that the others are fictional narratives or parallel physical universes.

## Mastery extraction

- world-sentences as comprehensive descriptions;
- truth at a world via entailment from the world-sentence;
- relationship between a semantics of worlds and formal modal validity.

**Status:** sampled/reviewed for the role needed by Chapter III.

---

# Appendix B — modal logic

## B1 — Sentential Modal Calculus (S5)

**Anchor:** pp. 105–108.

Sobel extends sentential logic with `□` and `◇`, modal rules, and a necessity-derivation form. He explicitly treats Hartshorne/Plantinga/Gödel as using S5-style modalities: necessity as truth at all possible worlds and possibility as truth at some possible world.

**Mastery-only by default**

- primitive/derived modal rules;
- modal negation;
- necessity derivation constraints;
- S5 principles such as the propagation of possibility/necessity used by the ontological argument.

**Externalize presentation:** proof lines need a visible modal-scope lane showing which outside premises are admissible inside a necessity derivation, analogous to subproof scope in Fitch-style natural deduction.

## B2 — formal Hartshorne derivation

**Anchor:** pp. 108–110.

This is the natural mastery checkpoint after §2. The learner first solves the argument with world cards, then with compressed modal notation, then finally in Sobel’s derivation system.

**Scaffold withdrawal sequence**

1. all worlds visible;
2. worlds collapsed but semantic glosses visible;
3. only modal symbols plus rule names;
4. blank proof step(s);
5. full derivation from AP and IP.

This is a useful exemplar of progress as **doing the same reasoning with less external support**.

## B3 — quantified modal logic

**Anchor:** pp. 110–114.

Sobel extends the system with quantifiers, identity, and an existence predicate `E!`, using world-specific domains that may overlap, coincide, or be disjoint, while requiring each world-domain to be nonempty. Constants can designate an individual in the universal domain even when that individual does not exist at a particular world.

**Mastery concepts**

- varying domains;
- universal domain vs world-domain;
- cross-world identity/designation;
- `E!x` as world-relative existence;
- predicates applying at a world even when their subject is not in that world’s existence domain, under Sobel’s chosen free semantics.

**Externalize interaction:** use a matrix with objects as rows and worlds as columns. Each cell exposes `exists here?` separately from predicates true here. This makes the semantics concrete before quantified formulas are introduced.

**Status:** sampled/reviewed for the semantic architecture; exact rule-by-rule authoring deferred.

---

# Chapter-level exercise families

These should be reusable beyond Sobel.

## 1. World-card propagation

Input:

- one or more modal premises;
- finite toy set of worlds sufficient to illustrate the inference.

Learner action:

- place propositions on worlds;
- propagate necessity/possibility constraints;
- identify contradiction or target conclusion.

Skills:

- `necessity`, `possibility`, `modal-consequence`.

## 2. Modal-property matrix

Rows are individuals; columns are worlds; cells separately track existence and properties.

Skills:

- necessary existence;
- essential vs accidental properties;
- quantified modal interpretation.

## 3. Possibility-premise pressure test

Given a valid modal argument, the learner must identify which premise is substantive and classify the support offered for it:

- definition;
- independent argument;
- conceivability;
- lack of known contradiction;
- empirical evidence;
- stipulation.

Skills:

- argument interrogation;
- modal epistemology;
- question-begging diagnosis.

## 4. Conceivable-but-not-possible constructor

The learner builds an actuality-sensitive predicate in a toy language, then observes how an empirical fact about `@` can make its instantiation impossible despite a priori coherence.

Skills:

- conceivability vs possibility;
- actual-world reference;
- a priori vs a posteriori support.

## 5. Argument-goal classifier

Given a valid argument plus audience commitments, classify what it achieves:

- proof;
- conditional consequence;
- consistency demonstration;
- rational permission;
- persuasion for this audience;
- no dialectical gain.

Skills:

- validity vs dialectical force;
- proof vs rational acceptability.

---

# Recommended source-driven route

For a learner reading Sobel rather than taking a modal-logic course, the minimal route should be:

1. `possible-world` — world cards;
2. `necessity` / `possibility` — all/some world classification;
3. III.1 Malcolm — identify the unresolved possibility horn;
4. III.2 Hartshorne — execute AP + IP on world cards;
5. `essential-perfection` vs `necessary-existence` — modal-property matrix;
6. III.5–III.6 — inspect the possibility premise and equivalence under AP;
7. III.7–III.8 — test the proposed conceivability bridge with actuality-sensitive counterexamples;
8. III.9 — distinguish proof from rational permission;
9. optional mastery branch: Appendix B1/B2;
10. later, when IV or another source requires it, Appendix B3 quantified modal logic.

This is intentionally **not** the order of a standard modal-logic textbook. It is the shortest concept path that preserves the argumentative structure of Sobel’s chapter.

---

# What this teaches us about the adaptive curriculum architecture

Chapter III suggests several requirements that should remain source-independent.

1. **Concept mastery must be separable from notation mastery.** A learner may understand possible-world semantics before knowing `◇` and `□` fluently.
2. **Routes need temporary source-local goals.** “Understand why IP is the pressure point” is a Chapter III goal, not a universal concept node.
3. **Source packs need transformations, not just examples.** Anselmian wording → world semantics → modal notation is itself pedagogical content.
4. **Mastery is multidimensional.** Reading competence, world-model manipulation, modal translation, and formal derivation should not collapse into one `modal-logic` score.
5. **Scaffolding state belongs to learner × capability.** World cards can disappear after the learner repeatedly reconstructs the same reasoning cleanly.
6. **A new source can contribute reusable exercise families.** The actuality-sensitive “conceivable but not possible” pattern is useful far beyond philosophy of religion.

## Next audit target

Chapter IV should be mapped next, but not as “more modal logic.” The main new challenge is the change in logical level: properties themselves become quantified over, and Gödel’s route proves a possibility theorem rather than simply taking an Anselmian possibility premise as given. The Chapter III learner state should therefore feed directly into IV while only the genuinely new higher-order machinery is introduced.