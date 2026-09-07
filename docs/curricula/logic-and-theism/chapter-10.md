# Chapter X — “God Knows (Go Figure)”

**Source:** Jordan Howard Sobel, *Logic and Theism*, Chapter X, pp. 369–400  
**Status:** reviewed  
**Role in source-driven curriculum:** introduces Cantorian set theory through a concrete paradox of reflective knowledge, then tests whether the set-theoretic representation rather than omniscience should be abandoned

## Why this chapter matters for Externalize

Chapter X may be the strongest demonstration yet of the adaptive-curriculum idea.

A conventional logic/mathematics course could teach power sets, cardinality, one-to-one mappings, and Cantor’s theorem in isolation. Sobel gives the learner a reason to care first:

> An omniscient knower knows every truth, including truths about what it knows. If all of its known propositions form a set, the subsets of that set appear to generate still more distinct truths for it to know. Cantor then seems to force the knower to know more propositions than its complete stock of known propositions contains.

The source therefore supplies the **problem before the mathematics**. Externalize can exploit that order:

```text
reflective knowledge puzzle
  -> tiny finite knowledge sets
  -> subsets
  -> power set
  -> one-to-one mapping
  -> cardinality
  -> diagonal argument
  -> Cantor
  -> return to omniscience
  -> inspect which premise should be surrendered
```

This is exactly the kind of route a source-driven curriculum can make much more compelling than a generic set-theory track.

---

# Durable concept nodes

## Reused

- `set`
- `identity`
- `indirect-proof`
- `countermodel`
- `quantification`
- `self-reference`
- `argument-premise-audit`
- `conclusion-strength`

## New or substantially extended

- `reflective-knowledge`
- `complete-self-knowledge`
- `subset`
- `power-set`
- `one-to-one-correspondence`
- `mapping-into`
- `mapping-onto`
- `cardinality`
- `cantor-theorem`
- `diagonal-construction`
- `set-vs-totality`
- `collected-one-vs-uncollected-many`
- `proper-class-or-nonset-collector`
- `actual-knowledge`
- `virtual-knowledge`
- `stratified-omniscience`
- `proposition-aboutness`
- `diagonal-proposition`

## Capability dimensions

Track separately whether the learner can:

- enumerate subsets of a finite set;
- construct a power set;
- compare cardinalities by pairing;
- understand why an infinite set can match a proper subset;
- perform the diagonal construction against a proposed set↔power-set pairing;
- transfer Cantor’s theorem into an argument about knowledge;
- identify the collector premise (`all known propositions form a set/totality`) as distinct from omniscience itself;
- distinguish actual from virtual knowledge;
- distinguish `there are all these things` from `there is one collection containing all these things`;
- inspect self-reference/aboutness assumptions in diagonal arguments.

---

# X.1 — The reflective-knowledge problem

Sobel opens with a simple escalation.

An omniscient being would know everything. It would therefore know that it knows everything. For every proposition it knows, it would know that it knows it. It would know analogous truths about each pair, trio, and more generally each set of propositions it knows.

That raises the motivating question: would complete reflective knowledge require the being, impossibly, to know **more than it knows**?

## Externalize sequence

Start finite.

Suppose a knower K knows only:

```text
p
q
```

Now ask what reflective truths it could know:

```text
K knows p
K knows q
K knows p and q
K knows neither member of {}
...
```

Do not yet claim a paradox. Instead ask what combinatorial object indexes the possible selections of K’s known propositions.

The learner should discover `subsets` before the term `power set` appears.

## Reading exit

Learner understands why **self-knowledge multiplies the propositions relevant to knowledge** and why set theory enters the chapter at all.

---

# X.2 — The primary set-centered argument

## Source-derived structure

Sobel’s primary argument uses:

1. For every knower, there is a set containing exactly the propositions that knower knows.
2. An omniscient knower knows every true proposition.
3. Every set S has a power set `Pow(S)` containing all subsets of S.
4. For every subset K′ of a knower’s set K of known propositions, there is a distinct true proposition saying, of the knower and K′, that the knower knows each member of K′.
5. Cantor’s theorem: `Pow(S)` has greater cardinality than S.
6. Therefore there is no omniscient being.

For reductio, assume omniscient O and let CK be the set of everything O knows. Each subset of CK yields a distinct true reflective proposition, which O must know. CK therefore contains at least as many propositions as its power set has members. Cantor says it cannot. Contradiction.

Sobel notes that the argument would, if sound, establish something stronger than the impossibility of omniscience: it would rule out complete introspective knowledge of the relevant kind.

## Externalize sequence

1. Use `K={p,q}`.
2. Build `Pow(K) = {∅,{p},{q},{p,q}}`.
3. Attach one reflective truth to each subset.
4. Observe that four reflective truths are generated from a two-member knowledge set.
5. Repeat with three propositions: 8 subsets.
6. Ask what happens as the base set grows.
7. Only then state the infinite/general problem and Cantor’s theorem.

## Critical discipline

The finite examples are motivation, **not yet the proof**. A finite knower can simply enlarge its knowledge set. The paradox concerns a set claimed already to contain **all** the propositions known by an omniscient and Cantor’s result that no set can catch up with its own power set.

## Reading exit

Learner can identify every premise in the knowledge→power-set→new-truths→contradiction chain.

---

# X.2.2 — Grim’s related set-centered arguments

Sobel discusses two related arguments from Patrick Grim:

- an omniscient’s conceptions of properties would form a set, but Cantorian reasoning yields more properties than those conceptions can cover;
- there cannot be a set of all truths, given a proposed one-to-one correspondence between subsets of a truth-set and further true propositions.

Sobel also records technical pressure on the latter construction under some theories of propositions, so Externalize should **not** flatten all three arguments into one generic `Cantor disproves omniscience` exercise.

## Externalize mode

**Compare proofs.** Keep a common skeleton visible and swap only the contested premise:

```text
collector of known propositions
collector of conceptions
collector of all truths
```

Ask which correspondence generates the oversized family in each case and which assumptions about propositions are needed.

---

# X.3–X.4 — From sets to “totalities,” then trim the argument

Sobel asks whether the problem depends on demanding too much set theory. He introduces a weaker notion of a **totality**, then reformulates the argument using only what is needed: subtotalities, mappings, and a Cantor-like principle for totalities.

The trimmed conclusion has the same shape:

- the totality CK of an omniscient’s knowledge would have a distinct known proposition corresponding to each subtotality of CK;
- every totality has more subtotalities than members;
- therefore CK would contain more propositions than it contains.

## Externalize sequence

1. Show the original proof dependency graph.
2. Disable set-specific axioms one by one.
3. Ask whether the contradiction still goes through with weaker collector assumptions.
4. Highlight the **minimal surviving commitments**.

This is a reusable form of **proof minimization**:

> Which assumptions are genuinely load-bearing, and which were merely part of the first formalization?

## Architectural finding

Externalize should support **argument variants sharing a skeleton**. A learner should be able to compare `set version` and `totality version` without duplicating the entire lesson.

---

# X.5 — Subtotalities, mappings, and “more than”

Sobel develops tools for comparing multiplicities even when ordinary set membership cannot safely be assumed.

## Concepts to teach

- subset/subtotality;
- mapping into;
- mapping onto;
- one-to-one correspondence;
- cardinal comparison by mapping rather than counting.

## Externalize representation

Use literal pairing interactions:

```text
A: a1 a2 a3
B: b1 b2 b3
```

Learner draws/taps pairs until every element on each side is paired exactly once.

Then show infinite examples where ordinary counting intuition fails, e.g. natural numbers paired with even numbers.

This must precede cardinality notation.

## Reading exit

Learner can explain “same size” and “more than” in terms of possible mappings, including for infinite collections.

---

# X.6 — Manys need not be Ones

This section is conceptually important and should not be reduced to technical set theory.

Sobel draws on Cantor and Cartwright to separate:

- there being many things of a kind about which we can speak generally;
- there being a **single collecting object** — set, class, totality, collection — whose members are exactly those things.

He is sympathetic to the thought that some `Manys` do not form any collecting `One`.

This becomes the route by which omniscience can escape the earlier Cantorian arguments: perhaps all truths are there and are knowable, while **there is no set-like object containing all of them**.

## Externalize sequence

1. Give a familiar finite collection: objects → set.
2. Give Russell-style/problematic predicates where naive collection causes trouble.
3. Ask separately:
   - can we quantify/speak generally about these objects?
   - must there therefore be an object collecting them?
4. Introduce the `Many ≠ necessarily One` distinction.

## Critical source discipline

This is not simply `proper classes solve everything`. Sobel reviews possible nonset collectors and is pessimistic that a replacement collector suitable for all omniscient knowledge can be found. His eventual move is more radical: **do without a collecting One altogether**.

## Reading exit

Learner can identify the hidden move from plural/general talk to collection existence.

---

# X.7 — Taking the measure of the challenges

Sobel reviews ways to resist the Cantorian arguments.

He is not confident that one can save a single collection of all an omniscient knows by replacing sets with another `nonset something else`. He therefore provisionally capitulates on the **collector**, not on omniscience.

## Externalize task: premise triage

Display the primary argument with confidence sliders/commitments for:

```text
P1: every knower’s knowledge forms a set/totality
P2: omniscient knows every truth
P3+: Cantorian / proposition-generation machinery
```

Ask: if the contradiction is accepted, which premise is least costly to abandon?

The exercise should permit multiple philosophical responses but make the downstream consequences explicit.

## Reading exit

Learner understands that the contradiction underdetermines what should be rejected.

---

# X.8 — Omniscience without a complete collector

Sobel offers two responses.

## X.8.1 — Seamless complete actual knowledge

One can say that all truths are known, while denying that those truths form a set or any collecting One. An omniscient could have each truth fully and actually in mind even though there is no single collection of all those truths.

This is deliberately difficult to picture, but it blocks the initial collector premise.

## X.8.2–X.8.3 — Stratified, partly collected omniscience

Sobel finds a compromise more attractive:

- the knowledge fully/actually before the omniscient mind at a time forms a set;
- not everything known need be simultaneously fully actual;
- some knowledge is **virtual**, derivable/recoverable by perfect reflection or deduction;
- total knowledge can therefore be complete even though the currently fully actual portion is always bounded/collected.

He illustrates actual vs fully actual vs virtual knowledge using ordinary mathematical knowledge, then scales the distinction radically upward for an omniscient.

## Externalize sequence

This section almost directly describes Externalize’s own cognitive philosophy.

Use three layers:

```text
ACTIVE
facts currently expanded in working state

AVAILABLE
facts already possessed and instantly retrievable

DERIVABLE
facts obtainable without new external evidence from possessed bases
```

Then ask whether `knows p` must mean `p is simultaneously represented in active state`.

### Important architectural resonance

This maps closely to Externalize’s original principle that relevant state can be **visible or recoverable** rather than all mentally active at once.

But do not identify human external memory with Sobel’s divine virtual knowledge. The analogy is pedagogical/product-level, not a claim about the source.

## Reading exit

Learner can state how stratified omniscience attempts to preserve knowledge of every truth without requiring one simultaneously actual set of every known proposition.

---

# X.9 — Divine knowledge: Sobel’s guarded recommendation

Sobel explicitly commends the stratified conception to theologians, while presenting it cautiously.

On this model:

- fully actual divine knowledge is always circumscribed and therefore incomplete;
- total actual + virtual knowledge extends to every truth;
- any virtually known truth can be made fully actual immediately when needed;
- there is no meaningful `as much as possible` maximal set of fully actual knowledge, because the Cantorian reasoning implies there is always additional reflective truth available beyond any such set.

## Externalize sequence

1. Give an `actual basis` of fixed size.
2. Add perfect deduction/reflection operators.
3. Generate a requested truth on demand.
4. Ask whether completeness should be measured by simultaneous representation or guaranteed availability.
5. Compare:
   - `all currently active`;
   - `all retrievable`;
   - `all derivable`.

## Product finding

This suggests a useful **knowledge-state model for Externalize itself**:

- `active scaffold`;
- `mastered/retrievable concept`;
- `derivable capability`.

A learner should not have to keep mastered information displayed merely because the curriculum depends on it; Externalize can expose it on demand.

---

# X.10–X.12 — Grim’s radical challenge and Sobel’s resistance

Grim’s later/core argument aims deeper than the set-centered arguments. It attempts to show, without relying on a set of all truths, that there cannot coherently be a proposition about **all truths**. If successful, we could not even coherently formulate omniscience as knowledge of every truth.

The pressure uses a Russell-style `aboutness` diagonal construction: propositions are divided according to whether they are among the things they are about, and a troublesome diagonal proposition is generated.

## Sobel’s response

Sobel resists the argument rather than omniscience. He thinks there are ordinary-looking propositions about all true propositions and is more willing to reject the implicit **proposition-existence / separation principles** needed to generate the pathological diagonal proposition.

His final stance is therefore asymmetric:

- reject the claim that every knower’s complete knowledge must form a set/totality;
- retain the ordinary proposition that an omniscient knows every true proposition;
- deny that every apparently specifiable diagonal condition must correspond to a proposition.

He acknowledges the cost: the theory of propositions/aboutness must restrict which descriptions genuinely determine propositions.

## Externalize sequence

1. Start with Russell-style self-membership classification on sets to establish the diagonal pattern.
2. Transfer to proposition `aboutness` only after the structural move is understood.
3. Mark every point where the argument goes from:
   - a condition we can write;
   - to a proposition corresponding to that condition.
4. Ask whether that **existence step** is licensed.
5. Compare two repairs:
   - deny propositions about all truths;
   - deny unrestricted diagonal proposition formation.
6. Display what each repair sacrifices.

## Architectural finding

Externalize needs to distinguish:

```text
syntactically describable condition
semantically coherent content
existent proposition/object in the theory
```

This is the same general lesson encountered earlier with possible beings and task descriptions: **linguistic availability does not guarantee ontological/formal availability**.

## Reading exit

Learner can explain why Sobel rejects Grim’s strongest argument even while accepting much of the Cantorian pressure behind the earlier ones.

---

# Appendix — Cantorian set theory

The appendix provides exactly the mathematical substrate that the source-driven route needs.

## A1 — power sets

For finite S, enumerate every subset including ∅ and S itself.

### Externalize exercise

Use inclusion toggles for `{a,b,c}`. Every binary inclusion pattern becomes one subset. The learner sees `2^3 = 8` rather than memorizing it.

## A2 — cardinalities

Teach same cardinality through one-to-one pairing. Crucially, an infinite set can have the same cardinality as a proper subset, such as naturals and evens.

### Externalize exercise

Pair:

```text
0 ↔ 0
1 ↔ 2
2 ↔ 4
3 ↔ 6
...
```

Ask why “proper subset” no longer guarantees “smaller” for infinite sets.

## A3 — Cantor’s theorem and diagonalization

Sobel gives a diagonal proof that no mapping from S onto `Pow(S)` can succeed.

### Externalize sequence

1. Display a candidate table pairing each `sᵢ` with a subset `Sᵢ`.
2. Highlight the diagonal membership cells.
3. Construct `S*` by flipping each diagonal choice.
4. Compare S* to every listed subset.
5. Observe that S* differs from row i at least at element `sᵢ`.
6. Therefore S* is a subset of S missing from the allegedly exhaustive pairing.

This should be interactive rather than algebraic. The **flip-the-diagonal** action is the conceptual heart.

## A4 — cardinality of power sets

For finite n, `|Pow(S)| = 2^n`; Cantor generalizes the strict inequality to every cardinality, including infinite ones.

## Reading vs Mastery

**Reading:** understand the diagonal construction and why the power set cannot be paired exhaustively with its base set.

**Mastery:** reproduce the argument abstractly and work comfortably with cardinality definitions and infinite examples.

---

# Reading route for Chapter X

```text
reflective knowledge
  -> subsets from selections
  -> power set
  -> pairing / cardinality
  -> diagonal construction
  -> Cantor theorem
  -> apply to collected knowledge
  -> distinguish Many from collecting One
  -> actual vs virtual knowledge
  -> proposition-existence / aboutness limits
```

This route should **not** begin with a generic set-theory lesson. The reflective-knowledge puzzle should create the demand for the mathematics.

# Mastery route

Adds:

- formal cardinality definitions;
- infinite one-to-one correspondences;
- proof of Cantor’s theorem;
- reconstruct the primary and Grim set-centered arguments;
- compare set vs totality formulations;
- analyze mapping-based cardinal comparisons for uncollected multiplicities;
- reconstruct the aboutness diagonal and identify the proposition-existence assumption Sobel rejects.

# Candidate exercise families contributed to Externalize

- `reflective-knowledge-expander`
- `subset-enumerator`
- `power-set-builder`
- `cardinality-pairing`
- `infinite-proper-subset-pairing`
- `diagonal-subset-constructor`
- `cantor-transfer-to-knowledge`
- `collector-premise-audit`
- `many-vs-one-classifier`
- `actual-virtual-knowledge-sorter`
- `proposition-existence-step-audit`
- `argument-repair-cost-comparison`

# Architectural findings from Chapter X

1. **The source can supply motivation before prerequisites.** Teach Cantor because the learner first encounters a problem that needs Cantor.
2. **Finite toy models need an explicit bridge to infinite/general proofs.** They build intuition but must not masquerade as the theorem.
3. **Collection existence is a distinct concept.** Quantifying over many things does not automatically justify a set/object containing them.
4. **Externalize should represent active, retrievable, and derivable knowledge separately.** Sobel’s stratified omniscience unexpectedly suggests a useful learner-state distinction.
5. **Diagonal arguments deserve a reusable interaction primitive.** The same pattern recurs across set theory, self-reference, and proposition aboutness.
6. **Object-generation assumptions must be visible.** “For every describable condition, there exists an object/proposition corresponding to it” is a substantive rule, not free syntax.
7. **Argument repair should expose costs.** Rejecting the collector premise, rejecting proposition-existence principles, or rejecting omniscience each preserves different commitments.
8. **Source-specific philosophical disputes can sit atop stable mathematical mastery.** Cantor’s theorem can be graded objectively even while the application to omniscience remains contestable.

# Validation target

At Reading depth, the learner should be able to answer without the text:

1. Why does reflective knowledge generate a power-set-shaped problem?
2. What is a power set?
3. Why can no set be put into one-to-one correspondence with its own power set?
4. How does that fact produce Sobel’s primary challenge to omniscience?
5. Which premise can be rejected without rejecting Cantor’s theorem or omniscience itself?
6. What does `Many without a collecting One` mean?
7. How does stratified actual/virtual knowledge respond to the challenge?
8. What extra assumption does Sobel challenge in Grim’s final diagonal argument about propositions?

If a learner starts from a two- or three-proposition reflective-knowledge puzzle, independently discovers the need to consider subsets, learns the diagonal argument, and then returns able to identify the exact collector premise under pressure, this chapter would be a flagship demonstration of source-driven Externalize.