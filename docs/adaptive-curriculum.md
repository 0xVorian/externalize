# Adaptive curriculum: canonical concepts, source routes, and context packs

**Status:** Phase A–C pilot **implementation** is in the runtime (logic-foundations route, Chapter II Sobel slice, skip/retrieve/teach planner). Remaining book chapters stay out of scope until the pilot is used. The Phase B **product** gate — whether the slice actually returns a learner to Sobel faster and with better understanding — remains pending usage/manual validation.  
**Created:** 2026-09-07  
**Origin:** discussion prompted by using Jordan Howard Sobel's *Logic and Theism* as a reading target

## Thesis

Externalize should not have one immutable linear curriculum.

The durable thing should be a **source-independent graph of concepts and capabilities**. A conventional logic course is one route through that graph. A book such as *Logic and Theism* is another route: it asks for some of the same concepts in a different order, supplies motivating problems and examples, and introduces additional concepts when the text requires them.

The learner should therefore be able to experience Externalize in at least two ways:

- **Canonical track** — a conventional progression through symbolic logic and related formal tools.
- **Source-driven track** — learn the exact prerequisite machinery needed to understand a chosen book, paper, problem set, or other source, then immediately apply it to that source.

A new source should enrich and reroute the curriculum, not fork the learner into a separate universe of duplicated skills.

## Why this has merit

The idea is more than cosmetic theming.

A source-driven route changes three pedagogically important things:

1. **Motivation.** The learner encounters a formal tool because it unlocks something they already want to understand, rather than because a syllabus says it comes next.
2. **Timing.** Prerequisites can be taught just before use. Knowledge that is already demonstrated can be skipped.
3. **Transfer.** The same concept can be encountered in multiple domains. Mastery of quantifier scope learned through a logic lesson can be reused in Sobel; a later economics or mathematics book can exercise the same skill with different surface content.

Externalize already has the beginnings of the right substrate: `content/prerequisites.json` is a concept graph, while progress and SRS are keyed to skills and assessed evidence. The architectural move is therefore to make the graph, rather than the current sequential lesson order, the primary curriculum object.

## The important constraint

**Do not build one curriculum per book.**

That would create duplicated concepts, fragmented mastery state, inconsistent definitions, and an authoring burden that grows linearly with every source.

Instead, model a book as a **route + source context** over a reusable concept graph.

The source may justify adding a genuinely new concept node. It should not create a second node for a concept Externalize already knows merely because the book gives it a different example or notation.

## Proposed model

### 1. Canonical concept graph

Nodes represent durable knowledge and capabilities independent of any one source.

Examples:

- proposition
- negation
- conjunction
- quantifier
- existential import
- scope of negation
- definite-description scope
- validity
- countermodel
- indirect proof
- possible world
- necessity / possibility
- essential vs accidental property
- S5 principles
- first-order quantified modal logic
- causal chain
- infinite regress
- conditional probability
- Bayesian confirmation
- power set
- cardinality
- Cantor's theorem
- expected utility
- infinite utility / hyperreal extension

Edges express prerequisites. The graph should remain small and conceptual rather than mirroring every authored lesson.

### 2. Capability dimensions

Knowing a concept is not one bit.

For a concept such as quantification, Externalize may separately track whether the learner can:

- recognize it;
- explain it in ordinary language;
- translate to and from notation;
- evaluate an instance;
- use it in an argument;
- detect a misuse;
- construct a counterexample or countermodel;
- transfer it to a new context.

This extends the existing principle that recognition, translation, evaluation, and proof construction are distinct skills.

### 3. Routes

A route is a pedagogical path through the graph.

Examples:

- `logic-foundations`
- `logic-and-theism-reading`
- `logic-and-theism-mastery`
- later: a route generated around another book or problem domain

A route specifies **what becomes relevant when**, not a separate definition of the concept.

A route may branch conditionally. If the learner already demonstrates a prerequisite, Externalize should bypass its introductory lesson and perhaps use one transfer check instead.

### 4. Source/context packs

A source pack binds durable concepts to a particular source.

For each source anchor it can contain:

- source identifier and bibliographic metadata;
- chapter/section/page anchor;
- concepts required before the passage;
- concepts introduced or exercised by the passage;
- likely stumbling blocks;
- source-specific examples or exercises;
- prompts that work from abstraction toward the source's own example;
- prediction prompts that stop before the author's next move;
- source-specific notation or terminology;
- depth recommendation: reading vs mastery;
- provenance and confidence of the mapping.

Source packs should contain paraphrases, metadata, and short necessary quotations only. They should not reproduce copyrighted books.

### 5. Learner state belongs to concepts, not routes

If the learner masters quantifier scope in the canonical logic route, the *Logic and Theism* route should know that.

If the learner later demonstrates the same concept in Sobel, that should strengthen the same underlying capability state and count as transfer evidence.

Route-specific state is still useful for things such as:

- current place in a book;
- which source examples have been seen;
- predictions already attempted;
- whether the learner chose reading or mastery depth for a section.

But mastery should remain portable.

### 6. Just-in-time remediation planner

Before a source section, the planner compares:

- concepts required by the section;
- the learner's demonstrated capability state;
- the selected depth.

It then chooses the smallest useful intervention:

- no detour;
- one retrieval check;
- a source-specific concrete example;
- a short canonical micro-lesson;
- a longer prerequisite branch;
- a mastery sequence including notation/proofs.

The objective is **minimum sufficient scaffolding**, not completion of an arbitrary syllabus.

## Source-driven interaction modes

A source pack can invoke several modes without changing the underlying concept model.

### Prerequisite

Teach only the machinery needed before the next passage.

### Derive

Work from concrete cases or intuitions until the learner can reconstruct the abstraction the source is about to use.

### Predict

Stop before the author's application or next inferential move and ask the learner to produce it.

### Interrogate

After reading, identify premises, hidden assumptions, scope changes, invalid steps, counterexamples, or rival explanations.

### Formalize

Move from the prose argument into explicit notation, derivation, model, probability calculation, or other formal representation.

### Transfer

Require a fresh example not taken from the source. This is important evidence that the learner has acquired the concept rather than memorized the passage.

## Reading vs mastery depth

Source routes should support at least two depths.

### Reading

Goal: understand the author's argument well enough to continue intelligently.

Technical appendices and long derivations can be deferred when they are not required for continuity. The route teaches just enough formal machinery to understand what the formalization is doing and why it matters.

### Mastery

Goal: reconstruct and manipulate the formal machinery independently.

This route can require full symbolization, derivations, countermodels, modal proof steps, Bayesian calculations, Cantorian arguments, and decision-theoretic exercises where the source supports them.

Depth should be selectable section by section rather than globally.

## Example: one concept, several routes

Consider existential quantification and the ambiguity of English `a`.

**Canonical route:** learn universal vs existential quantification through neutral examples, symbolization, and model checks.

**Sobel route:** encounter the distinction because Descartes needs an existential conclusion but the premises support only a conditional/general claim. Externalize first elicits ordinary-language examples where `a` does and does not carry existential commitment, then returns to the ontological argument.

The durable concept is the same. The motivation and exercise sequence differ.

## What a second book should do

When another source is added:

1. Map its sections to existing concept nodes.
2. Reuse existing capability evidence.
3. Add source-specific examples and prompts where they improve understanding.
4. Add new durable concept nodes only when the source genuinely requires machinery the graph lacks.
5. Record new cross-context exercises as transfer opportunities for existing concepts.

Over time, the graph becomes richer while individual source packs remain comparatively thin.

## Risks and guardrails

### Risk: overfitting to source order

A book's exposition order is not automatically the best learning order.

**Guardrail:** source order determines when a concept becomes relevant; the prerequisite graph determines what must be supplied first.

### Risk: duplicated concepts

Each source invents its own version of `quantifier-scope`, `Bayes`, etc.

**Guardrail:** concept IDs are canonical; source packs reference them.

### Risk: endless prerequisite detours

A hard book could turn every reading session into a separate course.

**Guardrail:** reading depth asks for the minimum machinery required for comprehension and allows formal mastery to be deferred.

### Risk: source-specific pattern matching

A learner succeeds only because they recognize the book's example.

**Guardrail:** finish important sequences with a source-independent transfer check.

### Risk: curriculum explosion

Adding books creates an authoring problem too large for a personal project.

**Guardrail:** mappings should be incrementally authorable. A useful source pack can begin with chapter-level anchors and the next few sections the learner is actually reading; it need not be exhaustively authored before use.

## Relationship to the current implementation

The current system already provides several useful primitives:

- `content/prerequisites.json` — concept/prerequisite graph;
- skill-tagged progress and SRS;
- separate lesson/exercise data and engine behavior;
- scaffold withdrawal after clean performance;
- Explore mode that does not contaminate mastery evidence.

The likely architectural extension is therefore not a rewrite. It is to separate three things that are currently more tightly coupled:

1. **concept graph** — durable knowledge;
2. **route** — sequencing and conditional navigation;
3. **source pack** — examples, anchors, prompts, terminology, and provenance.

No implementation change should be made until at least one real source map has been authored far enough to expose the minimum data model we actually need.

## First proving source: *Logic and Theism*

Sobel is a useful proving source because the book repeatedly changes representational machinery:

- ordinary-language semantic distinctions;
- predicate logic and quantifier scope;
- descriptions and negation scope;
- modal logic and possible worlds;
- quantified modal logic;
- causal regress and explanation;
- conditional probability and Bayes;
- Cantorian set theory;
- rational-choice theory and infinities.

The companion map lives in [`curricula/logic-and-theism.md`](curricula/logic-and-theism.md).

## Validation criterion

This direction earns its complexity only if a source-driven route can do all of the following better than the current linear course:

- get the learner back into the chosen source faster;
- skip concepts already demonstrated;
- teach missing prerequisites at the moment they become useful;
- reuse mastery across sources;
- produce transfer beyond the source's own examples;
- remain understandable as data rather than becoming a bespoke tutoring program per book.

If those properties do not materialize in the *Logic and Theism* pilot, keep the canonical curriculum and discard the extra abstraction.
