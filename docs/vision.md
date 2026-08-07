# Vision & Brief

**Status:** provisional workspace concept  
**Created:** 2026-08-06  
**Origin:** live conversation

## Core idea

Build a Duolingo-style application or game for learning symbolic logic through short lessons, immediate feedback, repetition, and visible intermediate steps.

The primary user is the repository owner. The design should compensate for difficulty holding large symbolic structures in working memory rather than assuming that the learner can mentally retain an entire derivation.

## Design principle

**The application should externalize every intermediate state.**

The learner should rarely need to remember what was established several steps earlier. Relevant premises, substitutions, truth values, dependencies, and available rules should remain visible or easily recoverable.

The interface should prefer small explicit transformations over large jumps described as obvious.

## Possible learning path

### 1. Symbols and basic translation

- propositions and sentence letters
- negation
- conjunction
- disjunction
- conditional
- biconditional
- parentheses and scope
- translating ordinary-language statements into symbols
- translating symbolic expressions back into ordinary language

### 2. Truth-functional reasoning

- evaluating expressions under an assignment
- building truth tables one column at a time
- tautology, contradiction, and contingency
- logical equivalence
- consistency and inconsistency
- validity through truth tables
- finding counterexamples to invalid arguments

### 3. Natural deduction

- identifying premises and conclusions
- direct derivations
- introduction and elimination rules
- conditional proof
- proof by contradiction
- subproof scope
- selecting the next justified step
- repairing invalid proof steps
- constructing proofs from draggable or typed steps

### 4. Predicate logic

- predicates, names, and variables
- universal and existential quantification
- negated quantifiers
- scope and binding
- translating quantified statements
- simple models and countermodels
- quantifier rules in natural deduction
- identity, if useful later

## Exercise types

- Multiple-choice identification of operators, scope, or valid transformations
- Drag-and-drop construction of symbolic expressions
- Ordinary language to symbols and symbols to ordinary language
- Interactive truth tables with one missing cell or column at a time
- Find an assignment that makes all premises true and the conclusion false
- Choose the applicable inference rule
- Reorder proof steps
- Fill one missing proof step
- Explain why a proposed step is invalid
- Construct a small model satisfying a quantified sentence
- Compare two expressions and determine whether they are equivalent

## Feedback principles

The application should not merely display wrong.

Feedback should identify the local error, for example:

- the negation applies only to the nearest expression
- the antecedent and consequent were reversed
- the proposed assignment does not keep every premise true
- the cited rule cannot be applied inside the current scope
- the variable is not free for substitution
- the conclusion may be true, but it does not follow from the selected premises

Where possible, the learner should correct the existing attempt rather than restart the entire exercise.

## Working-memory support

Potential features:

- persistent display of premises and target conclusion
- colour or shape coding for matching subexpressions
- collapsible proof dependencies
- visible rule prerequisites
- automatic indentation and scope highlighting
- a history of previous transformations
- named intermediate expressions
- optional hints that reveal one dependency at a time
- the ability to pin facts or rules beside the exercise
- replay of the completed derivation as a sequence of small transformations

The system should never rely on colour alone for meaning.

## Game loop

A possible session structure:

1. Introduce one concept with a minimal example
2. Ask several recognition questions
3. Require one guided construction
4. Mix the concept with previously learned material
5. End with a small challenge requiring transfer rather than repetition
6. Schedule weak concepts for later review

Lessons should be short enough to begin without psychological ceremony.

## Progression and repetition

- spaced repetition based on demonstrated errors rather than simple completion
- separate tracking for recognition, translation, evaluation, and proof construction
- periodic mixed reviews to prevent rules from being learned only in isolation
- mastery based on successful retrieval across several sessions
- optional streaks or daily goals, but no punishment severe enough to make returning unpleasant
- a visible map of concepts and prerequisites

## Tone and presentation

The tone should be intelligent, direct, and lightly playful rather than childish.

Possible thematic framing:

- arguments as machines to inspect
- invalid inferences as bugs
- countermodels as adversarial tests
- proofs as dependency graphs
- lessons as investigations rather than school exercises

The product should avoid decorative gamification that obscures whether the learner actually understands the rule.

## Minimal viable prototype

A useful first prototype could include only propositional logic:

- operator reference
- ordinary-language translation exercises
- expression evaluation under truth assignments
- interactive truth tables
- validity challenges using counterexamples
- a small spaced-repetition queue
- local progress storage

Natural deduction and predicate logic can follow once the basic interaction model proves useful.

## Success criterion

The project succeeds if it makes symbolic reasoning easier to practise regularly and reduces the amount of state the learner must retain mentally.

It does not need to become a commercial platform. A small application that reliably teaches its creator propositional and predicate logic would already satisfy the original purpose.
