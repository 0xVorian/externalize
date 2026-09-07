# *Logic and Theism* — Chapter IV detailed Externalize map

**Source:** Jordan Howard Sobel, *Logic and Theism: Arguments For and Against Beliefs in God* (Cambridge University Press, 2004)  
**Chapter:** IV, “Kurt Gödel’s Ontologischer Beweis,” pp. 115–167  
**Status:** reviewed first detailed pass  
**Created:** 2026-09-07  
**Parent map:** [`../logic-and-theism.md`](../logic-and-theism.md)  
**Architecture:** [`../../adaptive-curriculum.md`](../../adaptive-curriculum.md)

This file maps Chapter IV to reusable Externalize concepts and candidate interactions. It preserves Sobel’s argumentative structure but does not reproduce the chapter.

## Why Chapter IV is a qualitatively new test

Chapter III stayed mostly at the level of propositions: possibility, necessity, and a valid route from a possibility premise to necessary existence. Chapter IV raises the logical level.

Gödel’s system quantifies over properties, treats `positive` as a property of properties, defines God-likeness through possession of all positive properties, defines essence and necessary existence, proves that every positive property is possibly instantiated, and then proves necessary existence of a God-like being. Sobel’s central worries are therefore not the same as in Chapter III:

- the proof does **not** merely assume the possibility of a God-like being;
- the interpretation of `positive` becomes crucial;
- the formal theorem may fail to have the theological significance its terminology suggests;
- the system yields modal collapse, making every truth necessary;
- repairs such as Anderson’s show that changing the axiomatics can preserve some formal goals while altering the philosophical burden.

For Externalize, this means the source-driven route must add genuinely new machinery rather than simply reuse Chapter III.

## Durable concept nodes

### Core reading nodes

- `property-as-object`
- `property-of-properties`
- `higher-order-quantification`
- `positive-property`
- `complement-property`
- `god-like-definition`
- `essence`
- `necessary-existence-definition`
- `possibility-from-positive-property`
- `theorem-dependency-graph`
- `formal-result-vs-interpretation`
- `theological-significance-gap`
- `modal-collapse`
- `axiom-revision`

### Mastery nodes

- `third-order-quantified-modal-logic`
- `property-abstraction`
- `quantification-into-modal-context`
- `s5-higher-order-reasoning`
- `formal-derivation-godel`
- `anderson-emendation`

### Reused prerequisites

- `necessity`
- `possibility`
- `s5-modal-logic`
- `quantified-modal-logic`
- `essential-property`
- `necessary-existence`
- `validity`
- `logical-equivalence`
- `proof-vs-justification`

---

# Route through the chapter

## IV.1 — what kind of proof this is

**Anchor:** §1, pp. 115–117.

**Source focus:** Sobel presents the proof from Gödel/Scott notes as a formal axiomatic theory of positive properties, essences, and necessary existence. Its structure is Leibnizian: establish the possibility of a God-like being, establish that such a being is either impossible or necessary, then conclude necessity. Unlike Chapter III, the possibility is itself proved within the system rather than simply postulated from conceivability.

**Requires**

- Chapter III possibility/necessity distinction;
- theorem vs axiom;
- formal derivation.

**Externalize sequence**

1. Re-display Chapter III’s argument graph with `◇G` as an unsupported premise.
2. Replace that premise with a box labelled `to be proved`.
3. Ask what new kind of machinery would be needed to derive possibility from claims about properties.
4. Reveal the move to quantification over properties.

**Reading exit:** learner understands why Sobel says the Chapter III conceivability objection does not directly apply to Gödel’s proof.

**Status:** reviewed.

## IV.2 — language and logical level

**Anchor:** §2, pp. 117–118.

**Source focus:** the language has ordinary object variables plus variables over properties. `P` is a predicate of properties. Property expressions can occur in term-like positions and as predicates. Sobel describes the logic as capable of being third-order quantified S5 modal logic with identity and abstraction, with quantification into modal contexts.

**Requires**

- first-order predicate logic;
- distinction between individual and property;
- quantifier binding;
- modal scope.

**Introduces / exercises**

- sorted variables;
- quantifying over properties;
- property complement;
- property abstraction;
- higher-order type discipline.

**Externalize sequence**

1. **Type ladder:** objects → properties of objects → properties of properties.
2. Give statements and ask what each variable ranges over.
3. Render expressions with type badges rather than relying on Greek/Latin letter conventions alone.
4. Ask the learner to reject ill-typed substitutions.
5. Only then show the compressed notation used by Sobel.

**Likely stumbling block:** reading `P(φ)` as if `φ` named an individual property in the same sense that `P(a)` would predicate something of an individual.

**Reading exit:** learner can explain in plain language what it means to say that `positive` is a property of properties.

**Mastery exit:** learner can track the sorts of variables and property abstractions without visual type badges.

**Status:** reviewed.

## IV.3.1 — what does “positive” mean?

**Anchor:** §3.1, pp. 118–120.

**Source focus:** Sobel stresses that Gödel’s primitive `positive` lacks a single settled interpretation. He distinguishes a moral/aesthetic reading from a more logical/ontological reading and treats the proof as, in effect, a proof in search of an interpretation strong enough to make the axioms plausible and the conclusion religiously significant.

**Requires**

- primitive term vs defined term;
- formal consistency vs intended interpretation;
- semantic underdetermination.

**Introduces / exercises**

- one formal predicate receiving multiple candidate interpretations;
- axiom plausibility under an interpretation;
- conclusion significance under an interpretation.

**Externalize sequence**

1. Show the same abstract axiom under two candidate glosses for `positive`.
2. Ask whether each gloss makes the axiom plausible.
3. Ask whether the gloss would make a being with all positive properties worshipful.
4. Keep separate meters for `formal consequence`, `axiom plausibility`, and `theological relevance`.

**Reading exit:** learner does not treat the word “positive” as self-interpreting.

**Status:** reviewed.

## IV.3.2 — Axioms 1–2 and Theorem 1: positive properties are possibly instantiated

**Anchor:** §3.2, pp. 119–122.

**Source focus:** Axiom 1 says, for each property and its complement, exactly one is positive. Axiom 2 says that a property necessarily entailed by a positive property is positive. From these, Gödel derives Theorem 1: every positive property is possibly instantiated. Sobel examines the plausibility of the axioms under candidate interpretations of positivity.

**Requires**

- complement property;
- entailment between properties;
- impossibility as necessary non-instantiation;
- contradiction.

**Externalize sequence**

1. Build a toy universe of properties with explicit complements.
2. Apply Axiom 1 as a binary classification constraint.
3. Draw entailment arrows between properties and apply Axiom 2 as closure.
4. For Theorem 1, suppose a positive property is impossible to instantiate.
5. Propagate this to the impossible property (non-self-identity in Sobel/Scott’s proof pattern) and expose the clash with Axiom 1.
6. Replay the proof with symbols only after the graph is understood.

**Key pedagogical point:** the learner should see *why* possibility is derived rather than memorizing `P(φ) → ◇∃xφ(x)`.

**Reading exit:** learner can state the role of Axioms 1–2 in making positive properties possible.

**Mastery exit:** learner can reconstruct the formal proof of Theorem 1.

**Status:** reviewed closely.

## IV.3.2–IV.3.3 — God-likeness and possibility

**Source focus:** Gödel defines a God-like being as one possessing every positive property, then adds the axiom that God-likeness itself is positive. Combined with Theorem 1, that yields the possibility of a God-like being.

**Requires**

- universal quantification over properties;
- definition by property intersection;
- Theorem 1.

**Externalize sequence**

1. Give a finite toy set of positive properties.
2. Ask what an individual must have to count as `God-like` in the toy model.
3. Ask what extra claim is required before Theorem 1 can be applied to the `God-like` property itself.
4. Reveal Axiom 3 as that bridge.

**Likely stumbling block:** treating the definition of God-likeness as enough to make God-likeness positive.

**Reading exit:** learner can identify Axiom 3 as substantive rather than merely definitional.

**Status:** reviewed.

## IV.3.2.4–IV.3.3 — positivity is necessary; essence; necessary existence

**Anchor:** late §3, pp. 122–125.

**Source focus:** Axiom 4 makes positivity itself necessary. Gödel then defines an essence of an individual as a property the individual has that necessarily entails every property the individual has. Theorem 2 says God-likeness is the essence of any God-like being. Necessary Existence is defined via necessary instantiation of an individual’s essences, and Axiom 5 declares Necessary Existence positive.

**Requires**

- essential property;
- property entailment;
- necessity of predicates/properties;
- quantification over properties.

**Introduces / exercises**

- essence as a maximally informative property in Gödel’s system;
- difference between merely existing necessarily and having Gödelian Necessary Existence;
- a property (`NE`) becoming positive and therefore possessed by any God-like being.

**Externalize sequence**

1. Give an individual with a set of properties.
2. Ask which candidate property would qualify as an essence under the rule “necessarily entails every property of this individual.”
3. Visualize an essence as a root node whose necessary entailment closure covers the individual’s property set.
4. Introduce `NE` only after essence is operational.
5. Ask what follows for a God-like being once `NE` is declared positive.

**Likely stumbling block:** equating Gödel’s `Necessary Existence` definition with the simple formula `□E!x`.

**Reading exit:** learner can distinguish the technical defined property `NE` from ordinary necessary existence.

**Status:** reviewed.

## IV.4 — Theorem 3: necessarily, a God-like being exists

**Anchor:** §4, pp. 125–128.

**Source focus:** Sobel expands Scott’s proof sketch. God-likeness entails possession of `NE`; God-likeness is the essence of any God-like being; from these, existence of a God-like being entails necessary existence of a God-like being. Theorem 1 plus Axiom 3 already gave the possibility of a God-like being. S5 then carries possibility of necessity to necessity.

**Requires**

- Chapter III S5 modal move;
- Theorem 1;
- definition of God-likeness;
- Theorem 2;
- Axiom 5.

**Externalize sequence**

Use a persistent theorem dependency graph:

```text
A1 + A2 -> T1: positive -> possibly instantiated
A3 + T1 -> ◇∃xGx
Def G + A5 -> God-like -> NE
T2 -> God-like -> G is essence
Def NE + T2 -> ∃xGx -> □∃xGx
◇∃xGx + (∃xGx -> □∃xGx) + S5 -> □∃xGx
```

Learner actions:

1. identify which nodes establish possibility;
2. identify which establish the `if actual then necessary` bridge;
3. reuse the Chapter III modal move rather than reteach it;
4. collapse the graph progressively into formal notation.

**Adaptive-curriculum win:** Chapter III mastery should remove almost all scaffolding from the final S5 step; only the new higher-order route to the premises needs teaching.

**Reading exit:** learner can explain the proof architecture without following every formal derivation.

**Mastery exit:** learner can reproduce Scott/Sobel’s formal route to Theorem 3.

**Status:** reviewed closely.

## IV.5 — “Would that be God, could it be God?”

**Anchor:** §5, pp. 128–132.

**Source focus:** Sobel now separates the formal theorem from its theological interpretation. The system proves existence of a being with all positive properties, but whether such a being is God depends entirely on how `positive` is interpreted. Further theorems imply that God-like beings have only positive properties and that their properties are necessarily instantiated. Sobel asks whether any interpretation making the axioms true also makes a God-like being worshipful in the ordinary/theological sense developed in Chapter I.

**Requires**

- Chapter I core criterion / worship-worthiness;
- formal theorem vs interpretation;
- necessary instantiation.

**Introduces / exercises**

- formal label vs ordinary-language significance;
- theorem strengthening revealing unintended consequences;
- interpretation adequacy test.

**Externalize sequence**

1. Hide the label `God-like`; call the formal object simply `G-object`.
2. Show only the properties guaranteed by the system.
3. Ask whether those guarantees suffice for worship-worthiness, omniscience, goodness, power, etc.
4. Only then restore the historical label and ask whether it prejudiced interpretation.
5. Compare multiple candidate meanings of `positive` and score them separately for axiom plausibility and theological adequacy.

**Important design principle:** Externalize should deliberately strip suggestive names from formal objects when testing semantic significance. This guards against label-driven inference.

**Reading exit:** learner can say why proving `∃xGx` in the formal system is not automatically proving the existence of God.

**Status:** reviewed.

## IV.6 — modal collapse

**Anchor:** §6, pp. 132–135.

**Source focus:** Sobel derives or discusses stronger consequences of the system, including that every existent is a necessary existent and, more dramatically, that every truth is necessary. The system therefore collapses actuality, possibility, and necessity in a way that removes contingency.

**Requires**

- contingent vs necessary truth;
- modal distinction;
- theorem consequence tracing.

**Introduces / exercises**

- modal collapse;
- system-level unintended consequence;
- local proof success vs global theory failure.

**Externalize sequence**

1. Start with a mundane contingent proposition such as `this coin landed heads`.
2. Ask what it means for it to be contingent: true here, false at some other possible world.
3. Add Theorem 9 (`Q → □Q`) as a global system rule.
4. Watch the alternative world disappear as inconsistent with the theory.
5. Repeat for existence of an ordinary contingent object.
6. Ask what philosophical commitments are lost if every true proposition becomes necessary.

**This is a flagship Externalize interaction.** “Modal collapse” should not initially be a phrase to memorize; the learner should watch a world-space shrink until no contingent alternatives remain.

**Likely stumbling block:** treating modal collapse as merely an odd theorem about God rather than a theorem about *all truths* in the system.

**Reading exit:** learner can explain modal collapse operationally and why Sobel treats it as an unwanted result.

**Mastery exit:** learner can trace the dependency of the collapse theorem on the relevant property/essence assumptions.

**Status:** reviewed closely.

## IV.7 — concluding recommendations and revision

**Anchor:** §7, pp. 135–143.

**Source focus:** Sobel considers whether the system should be modified, including pressure on Axiom 5 and the relation between necessary existence and worship-worthiness. He discusses Anderson-style emendations that weaken Gödel’s Axiom 1 and revise positivity/essence/God-likeness so that modal collapse can be avoided while preserving a necessary-existence theorem for a revised God-like* notion. He remains concerned that formal God-likeness may still fail to secure ordinary worshipful attributes.

**Requires**

- axiom dependency;
- theory revision;
- preserving target theorem while removing unwanted consequence.

**Introduces / exercises**

- minimal repair;
- theorem regression testing;
- philosophical cost of formal repair.

**Externalize sequence**

1. Treat the theory like a codebase with tests:
   - keep: possibility theorem;
   - keep if possible: necessary God-like existence;
   - remove: modal collapse;
   - preserve: philosophically plausible interpretation.
2. Remove or weaken one axiom at a time.
3. Display which theorems stop deriving.
4. Compare Gödel and Anderson variants as dependency graphs rather than blocks of formulas.
5. Ask whether the repaired formal object is any closer to a worshipful being.

**Reading exit:** learner understands that formal repair and theological success are separate objectives.

**Status:** reviewed/sampled; exact Anderson derivations remain mastery material.

---

# Appendices A–C

## Appendix A — Gödel’s handwritten notes

**Role:** provenance and interpretive evidence. Useful for advanced readers investigating what Gödel may have meant by `positive`, but not needed for the reading route.

**Externalize mode:** `Interrogate source` rather than graded logic exercise. Put competing interpretations beside the relevant handwritten remark and explicitly label interpretive uncertainty.

## Appendix B — Scott’s notes

**Role:** compact canonical proof sketch: positive-property axioms, Theorem 1, God-like definition, essence, Necessary Existence, and the final theorem.

**Mastery checkpoint:** learner should be able to annotate every line with which concept/dependency from the chapter map it uses.

## Appendix C — derivations

**Role:** formal confirmation in the extended modal proof system, plus Anderson emendations.

**Scaffold withdrawal**

1. theorem dependency graph;
2. partial derivation with rule names;
3. missing lines;
4. complete reconstruction;
5. compare Gödel vs Anderson derivations.

**Status:** sampled; detailed rule-by-rule mapping deferred until the quantified modal proof engine exists.

---

# Reusable exercise families contributed by Chapter IV

## 1. Type-check the logic

Given a higher-order formula, identify whether each symbol denotes/ranges over an individual, property, or property of properties. Reject ill-typed substitutions.

**Reusable for:** set theory, type theory, semantics, higher-order logic.

## 2. Axiom plausibility under interpretation

Keep the formal axiom fixed; swap interpretations of a primitive predicate. Ask separately:

- is the axiom plausible?
- does the resulting theorem mean what we care about?

**Reusable for:** formal ethics, economics, metaphysics, mathematical modelling.

## 3. Theorem dependency graph

Learner reconstructs the route from axioms/definitions to a target theorem. Intermediate theorems remain pinned and can be collapsed only after mastery.

**Reusable for:** all proof-heavy sources.

## 4. Label stripping

Replace semantically loaded names (`God-like`, `positive`) with neutral placeholders. Ask what the formal theory actually guarantees before restoring the labels.

**Reusable for:** any field where suggestive terminology risks smuggling conclusions into interpretation.

## 5. Theory regression testing

Given an unwanted theorem, modify one axiom and inspect which desired and undesired consequences survive.

**Reusable for:** axiomatic mathematics, formal philosophy, specification design, software-like reasoning about theories.

## 6. Modal-collapse visualizer

Represent worlds explicitly; apply a global theorem that all truths are necessary; watch alternative truth assignments/worlds become inaccessible or inconsistent.

**Reusable for:** modal logic broadly.

---

# Recommended source-driven route

For the reading track:

1. reuse Chapter III necessity/possibility without reteaching;
2. teach higher-order type distinction;
3. introduce `positive` as an uninterpreted primitive first;
4. derive Theorem 1 in a toy property graph;
5. define God-likeness and derive its possibility;
6. teach Gödelian essence and `NE` just enough for Theorem 3;
7. replay the Chapter III S5 move with minimal support;
8. strip the label `God-like` and test theological significance;
9. visualize modal collapse;
10. treat Anderson as optional theory-repair exploration.

For mastery, add:

- full higher-order symbolization;
- Scott-note reconstruction;
- Appendix C derivations;
- explicit dependency analysis of modal collapse;
- Anderson emendation derivations.

---

# Architecture lessons from Chapter IV

1. **The concept graph needs levels/types.** `property`, `property-of-property`, and `individual` cannot be represented as a flat vocabulary without losing important constraints.
2. **Routes need semantic as well as formal goals.** “Derive Theorem 3” and “understand whether Theorem 3 is theologically significant” are different competencies.
3. **Primitive-term interpretation should be represented explicitly.** A source pack may attach candidate interpretations to one canonical formal node without making them separate concepts.
4. **Loaded labels are pedagogical state.** Externalize should be able to temporarily neutralize terminology to test what follows from structure alone.
5. **Theory-level debugging is a distinct exercise class.** Chapter IV is not just proof construction; it asks whether the axiom system has consequences we can accept.
6. **Cross-source reuse is already visible.** Chapter III supplies the modal final step; Chapter I supplies the criterion for whether a formal being would count as God; Chapter IV only needs to teach what is new between those layers.

## Next audit target

Chapter V is already sampled in the parent map, but it should now receive the same detailed treatment. It shifts from a priori modal demonstration to an ordinary deductive argument from causal premises, which will test whether the same adaptive architecture works when the representation changes from possible worlds/theorem graphs to causal dependency graphs.