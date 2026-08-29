# Externalize — Independent Research Report
**Engagement, Durable Learning, and the Ethical Use of Behavioral Mechanisms**
**Author:** Independent frontier-model investigation (initial submission)
**Date:** 29 August 2026
**Status:** Investigative findings. Not a product decision.
**Governing principle used:** Engagement is instrumental. Learning is the
objective. A mechanism that increases sessions, streaks, XP, or time-in-app
while degrading delayed retention or transfer is a failure.
--## Epistemic legend
- **Knowns:** established empirical regularities, or project facts taken as
given from the brief.
- **Assumptions:** propositions used provisionally.
- **Findings:** conclusions this investigation supports.
- **Open questions:** uncertainties that remain material.
- **Recommendations:** reasoned proposals, not owner decisions.
Agreement among sources is not itself evidence. Company adoption is not itself
evidence. Immediate performance is not delayed learning.
--## 1. Executive synthesis
### 1.1 The research question is slightly malformed
The brief asks how Externalize can *exploit the strongest known mechanisms for
motivation, habit, attention, and repeated engagement* while *preserving or
improving* durable retention, transfer, calibration, and mastery.
That framing treats engagement machinery as independently stackable onto
pedagogy. The evidence does not support that architecture.
**Finding.** The interventions with the strongest causal evidence for *durable
learning* (retrieval practice, spacing with an appropriate lag, successive
relearning, worked-example fading, self-explanation, interleaving of confusable
procedures) typically *lower* immediate performance, *feel* harder, and *reduce*
fluency during the session. The interventions with the strongest causal evidence
for *session volume* (variable-ratio rewards, near-misses, aggressive dark
patterns, loss-framed streaks, hearts/lives, scarcity countdowns) typically *do
not* produce delayed learning gains, and several actively corrupt the behavior
that learning requires.
The product problem is therefore not “add engagement on top of a good tutor.” It
is:
> Make the cognitively useful act the only rewarded act, and make returning
cheap enough that the learner will do that act on the schedule the memory system
needs.
### 1.2 What the evidence actually supports
**Knowns (learning).**
- Retrieval practice beats restudy for delayed retention. Rowland (2014) metaanalysis: overall *g* = 0.50 vs restudy across 159 studies; 81% of comparisons
favor testing; effects larger at delays ≥24 h (*g* ≈ 0.69) than at short delays

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 1 of 46

(*g* ≈ 0.41), and can reverse at delays of minutes. Adesope, Trevisan &
Sundararajan (2017): practice testing vs nontesting conditions *g* = 0.61
(fixed) / 0.70 (random). Recall tests beat recognition. Feedback helps when
initial retrieval fails.
- Spacing is among the most reliable effects in memory. Cepeda et al. (2006)
quantitative synthesis of 839 assessments: optimal interstudy interval
*increases* with desired retention interval; a practical ratio is roughly 10–20%
of the target retention interval at multi-day delays, declining toward 5–10% at
year-scale delays. Too-short gaps cost more than modestly too-long gaps.
Expanding schedules are *not* clearly superior to equal spacing; Karpicke &
Roediger (2007) found expanding retrieval better at 10 minutes and *worse* at 2
days. The important difficulty is delaying the first retrieval so it is
effortful.
- Successive relearning (criterion retrieval + spaced relearning sessions) is,
for durable knowledge, a stronger construct than either testing or spacing
alone. Rawson et al. (2018): one-week recall ~20% after a single session vs ~80%
after three spaced relearning-to-criterion sessions (*d* ≈ 4.19 in that
contrast). Initial overlearning is largely overwritten by later relearning
(relearning-override effect). The efficient prescription from Rawson & Dunlosky
(2011) is roughly: initial criterion of about three successful recalls, then
about three widely spaced relearning sessions.
- Interleaving of *similar* categories/procedures improves later discrimination.
Brunmair & Richter (2019): overall *g* = 0.42; mathematics *g* = 0.34; visual
materials larger; words can reverse (*g* = −0.39). Taylor & Rohrer (2010),
holding spacing constant, roughly doubled one-day math test scores (77% vs 38%)
while *impairing* practice-session performance. The mechanism is strategy
selection, not mere spacing.
- Worked examples help novices; fading plus principle prompts supports near and
far transfer (Atkinson, Renkl & Merrill, 2003). Self-explanation prompts: Bisra
et al. (2018) *g* = 0.55. Generation vs reading: Bertsch et al. (2007) *d* =
0.40. Both are moderated by element interactivity.
- Mastery learning programs: Kulik, Kulik & Bangert-Drowns (1990) average *d* =
0.52 on end-of-instruction exams. Intelligent tutoring systems: VanLehn (2011)
step-based ITS *d* ≈ 0.76 vs no tutoring in lab-ish evaluations; Kulik &
Fletcher (2016) median 0.66; Ma et al. (2014) *g* = 0.41. Large-scale field
effectiveness is smaller. The RAND Cognitive Tutor Algebra I RCT found a null in
year 1 and a modest high-school effect in year 2 of implementation. Alignment of
test to taught skills inflates lab ITS effects.
- Immediate performance is a bad proxy for learning (Soderstrom & Bjork, 2015).
This is not a slogan. It is the central measurement fact for a product that
currently risks confusing session completion with capability.
**Knowns (motivation and return).**
- Implementation intentions (if–then plans) have a medium-to-large effect on
goal attainment: Gollwitzer & Sheeran (2006) *d* = 0.65. Mental contrasting plus
implementation intentions (WOOP/MCII) is the better-specified protocol because
contrasting creates commitment; if–then plans automate initiation.
- Specific, difficult goals beat “do your best”: Locke & Latham meta-analytic
*d* typically 0.42–0.80, contingent on feedback, commitment, and ability.
- Expected tangible rewards contingent on engagement or completion undermine
subsequent free-choice intrinsic motivation (Deci, Koestner & Ryan, 1999:
engagement-contingent *d* ≈ −0.40; completion-contingent *d* ≈ −0.36; unexpected
rewards do not). Verbal informational feedback can enhance it. This is the
crowding-out result gamification literature keeps rediscovering.
- Habit automaticity for *simple, daily, context-stable* behaviors follows an
asymptotic curve. Lally et al. (2010): median 66 days to 95% of asymptote, range
18–254 days; a single missed day did not materially derail the curve; many
missed days did. This is *not* evidence that proving arguments becomes automatic
in 66 days.
- Goal-gradient and endowed-progress effects are real in loyalty-card field
experiments (Kivetz, Urminsky & Zheng, 2006; Nunes & Drèze, 2006: endowed 10-

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 2 of 46

stamp card with 2 free stamps ≈ 34% completion vs ≈ 19% for a blank 8-stamp
card). After the reward is claimed, effort collapses (post-reward reset),
hardest among those who accelerated most.
- Temptation bundling works initially and decays (Milkman, Minson & Volpp, 2014:
+51% gym visits early; decline over nine weeks, especially after a break).
Fresh-start landmarks increase *initiation* of aspirational behavior (Dai,
Milkman & Riis, 2014); they do not by themselves produce maintenance.
- Push notifications can move short-horizon engagement. Duolingo’s
sleeping/recovering-bandit experiment (Yancey et al., KDD 2020): +0.5% DAU,
+0.4% lessons, +2% new-user recurring retention over two weeks. These are
business metrics, not learning metrics. Notification effects often habituate
(micro-randomized trials in physical activity show early lifts that shrink).
**Knowns (engagement machinery from games, casinos, dark patterns).**
- Variable-ratio reinforcement produces high response rates and extinction
resistance. That is a century-old operant fact. Near-misses recruit win-related
striatal/insula circuitry and increase desire to continue despite being
objective losses (Clark et al., 2009, *Neuron*). Gambling severity predicts
midbrain response to near-misses (Habermas? No: Chase & Clark / related 2010 *J
Neurosci* line). Loot-box research associates these mechanics with problemgambling scores. This is causal for *continued play*, not for *learning*.
- Dark patterns change compliance with large effects. Luguri & Strahilevitz
(2021): mild dark patterns roughly doubled consent (11% → 26%); aggressive more
than tripled it (→ 42%); less-educated users were disproportionately affected. A
2023 systematic review of user experiments concludes DMPs significantly alter
behavior and that education/nudges rarely neutralize them.
- Gamification of learning: Sailer & Homner (2020) small-to-moderate effects on
cognitive (*g* = 0.49), motivational (*g* = 0.36), and behavioral (*g* = 0.25)
outcomes, with high heterogeneity; motivational/behavioral effects were unstable
under high-rigor splits. Serious games: Wouters et al. (2013) *d* = 0.29
learning, *d* = 0.36 retention, and **nonsignificant motivation** (*d* = 0.26,
*p* > .05). Games can teach without being more motivating than ordinary
instruction. That result is widely ignored by product folklore.
- Duolingo’s own efficacy literature is weak as causal evidence (Vesselinov &
Grego 2012: industry-funded, self-selected, high attrition, no RCT, WebCAPE
form-focused). Qualitative work on Duolingo (Hadi Mogavi et al., L@S 2022, “When
Gamification Spoils Your Learning”) documents users farming XP, protecting
streaks with trivial activity, and treating leagues as the goal. That is a field
existence proof of Goodharting in a learning app.
- “Gaming the system” in ITS (Baker, Corbett, Koedinger and colleagues): hint
abuse and systematic guessing are negatively correlated with learning; other
off-task behavior is not. Harmful gaming concentrates on the skills the student
knows least. Interventions that merely delay hints can induce students to err
rapidly on purpose to unlock help (Murray & VanLehn, 2005). Detection-plusremediation is more promising than blanket friction.
### 1.3 The load-bearing finding for Externalize
**Finding.** Habit research and learning research are about different behaviors.
- Habit (Wood; Lally; Gardner): a simple action, in a stable context, repeated
until cue-driven automaticity reduces deliberation.
- Symbolic-logic mastery: a high-element-interactivity, working-memory-taxing,
strategy-selection skill that remains *goal-directed* for a long time. Desirable
difficulties *increase* deliberation.
Externalize can plausibly habitize **session initiation** (sit down, open the
app, start the next retrieval). It cannot, on present evidence, habitize **valid
inference**. Treating “daily streak” as a proxy for “the skill is becoming
automatic” is a category error.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 3 of 46

A second load-bearing finding: **symbolic logic is exactly the kind of material
for which “desirable difficulties” become undesirable if working memory is
already full.** Chen, Kalyuga, Sweller and colleagues argue that testing and
generation effects shrink or reverse under high element interactivity.
Hyperproof research (Stenning, Cox, Oberlander; Barwise & Etchemendy) shows
aptitude-by-treatment interactions in logic tutoring: the same representational
regime helps some learners and harms others. Externalize’s doctrine of
externalizing intermediate state is therefore not an unalloyed good. It is a
cognitive-load intervention whose value depends on expertise. That is the
expertise-reversal effect applied to the product’s core pedagogy.
### 1.4 What this investigation recommends as a research stance (not a ship
decision)
The highest expected-value system is a **two-clock architecture**:
1. **Engagement clock (cheap, daily):** a stable cue, an if–then plan, a short
initiation ritual, and a retrieval-first session whose *minimum viable unit* is
effortful, unaided reconstruction of an intermediate state — not opening the
app, not watching a solution, not farming easy items.
2. **Mastery clock (expensive, delayed):** capability credit is granted
primarily by *later* unaided retrieval and transfer items, not by same-session
success. Progress visualization is tied to the mastery clock. The engagement
clock may show “you did today’s work”; it must not say “you now know this.”
Streaks, XP, notifications, and endowed progress can be pointed at the
engagement clock **only if** they cannot be satisfied except by mastery-clockvalid behavior. Variable-ratio loot, near-misses, hearts-as-error-punishment,
leaderboards of XP, and scarcity of *learning content* should be treated as
effective-but-dangerous or probably counterproductive.
Uncertainty is high on: (a) whether adult volunteer users of a mobile logic app
will tolerate desirable difficulty without a course grade; (b) whether
intermediate-state externalization transfers to unaided paper-and-pencil or real
argument; (c) whether any streak design can be made lapse-safe without becoming
a meaningless insurance product.
--## 2. Important corrections and challenges to the research brief
The brief is unusually well specified. Several of its assumptions should still
be challenged rather than inherited.
### Challenge 1. “Habit formation” is the wrong name for the hard part
The brief lists cue–routine–reward, streaks, daily goals, and session rituals
alongside retrieval and transfer as if they were one stack. **Assumption in the
brief:** a learning habit is of the same kind as a flossing habit. **Finding:**
Wood’s context-dependent automaticity applies to low-deliberation actions in
stable contexts. Effortful reasoning is not that. The transferable piece is
*initiation*. The non-transferable piece is the cognitive work. Products that
collapse these (Duolingo’s “daily lesson = learning”) systematically Goodhart.
### Challenge 2. Daily practice is in tension with optimal spacing
Streaks and daily goals push *item-level* massing. Cepeda’s ridgeline says the
optimal gap for remembering something for a month is on the order of days, not
minutes, and for remembering it for a year is on the order of weeks.
**Finding:** the resolution is daily *sessions* containing *interleaved, lagged
items*, not daily re-practice of yesterday’s item. A streak that requires
redoing today’s lesson is pedagogically wrong even if it is commercially right.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 4 of 46

### Challenge 3. Expanding-interval folklore is oversold
The brief lists spaced practice and SuperMemo-style scheduling as if expanding
intervals were the established optimum. **Finding:** Landauer & Bjork (1978)
expanding retrieval is better at *short* delays; Karpicke & Roediger (2007)
equal spacing (really: delayed first test) is better at 2-day delays. SM2/Anki/FSRS are engineering approximations with user-level observational
support, not RCTs on symbolic logic. Do not treat SuperMemo as a scientific
result.
### Challenge 4. Overlearning is not a free lunch
The brief lists overlearning. **Finding:** within a single session, extra
successful retrievals help until the next relearning session, which then
overrides the initial-criterion effect (Rawson & Dunlosky 2011; Vaughn et al.
2016). For a product that will re-prompt, burning session time on overlearning
is inefficient. Successive relearning is the better construct.
### Challenge 5. Zeigarnik is mostly folklore; Ovsiankina is the real effect
The brief lists Zeigarnik/Ovsiankina together. A 2025 meta-analysis (Ghibellini
& Meier, *Humanities & Social Sciences Communications*) finds **no general
memory advantage for unfinished tasks** (Zeigarnik) and a **reliable resumption
tendency** (Ovsiankina; weighted resumption around two-thirds). Designers who
“leave things unfinished so they will be remembered” are citing the wrong
effect. Designers who “leave a clear next step so return is cheap” are citing
the effect that replicates.
### Challenge 6. Mobile-first plus high element interactivity is a collision,
not a given
**Assumption in the brief:** the product is mobile-first, so interventions
should be designed for phones. **Finding:** the testing effect and generation
effect are weaker when working memory is already taxed (Chen et al.; van Gog &
Sweller 2015). Symbolic logic has high element interactivity. Phone UI adds
extraneous load. A research program that treats “mobile-first” as an unexamined
constraint may be selecting *against* the conditions under which the strongest
learning effects appear. The brief should allow the possibility that hard
construction belongs on a larger surface, with the phone used for retrieval
prompts and return cues.
### Challenge 7. “Externalize every intermediate state” is a hypothesis with a
known moderator
**Project known:** this is the central pedagogical doctrine. **Finding:** it
maps onto self-explanation, worked examples, and step-based tutoring — all
evidence-backed for novices — and onto expertise reversal once the learner has
schemas. If Externalize never fades the requirement to externalize, it will, on
CLT evidence, become redundant load and feel controlling (SDT). Scaffolding that
cannot recede violates the brief’s own success criterion that learners
“eventually need less scaffolding.”
### Challenge 8. ITS lab effect sizes will not appear in a consumer app
VanLehn/Kulik numbers (0.6–0.8σ) are not a forecast for Externalize. They come
from school-embedded tutors, locally aligned tests, and students who must show
up. RAND field effects were smaller and delayed a year. MOOCs and consumer
language apps show that voluntary adult persistence, not pedagogy, is the
binding constraint. **Finding:** Externalize’s validation period will be limited
by *return after difficulty*, not by the existence of testing effects.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 5 of 46

### Challenge 9. Gamification meta-analyses do not license a points–badges–
leaderboards layer
Sailer & Homner’s cognitive *g* = 0.49 is heterogeneous, often confounded with
better instructional design in the gamified arm, and motivational effects were
*not* stable under rigor splits. Wouters found learning without motivation
gains. Hadi Mogavi et al. document misuse. **Finding:** “gamify it” is not an
evidence-based move. Specific mechanics must be evaluated against delayed
learning and Goodharting, which is what this report does.
### Challenge 10. The brief underweights the assistance dilemma and overweights
casino mechanics as if they were equally unspecified
Koedinger & Aleven’s assistance dilemma (how much help to give vs withhold) is
the *central* unsolved design problem for a step-based logic tutor. Variableratio schedules are *not* an unsolved scientific problem; they are a solved
engagement problem with a known harm profile. The research program should spend
more experimental capital on assistance, fading, and evidence rules than on
loot-box variants.
### Challenge 11. “Redirect dark patterns toward the learner’s interests” is
possible only for a narrow subset
**Finding.** A mechanism can be redirected when the *action it forces* is
identical to the learning-useful action (e.g., streak credit only for delayed
unaided retrieval). It cannot be redirected when the mechanism’s power comes
from *decoupling* action from outcome (near-miss, variable-ratio cosmetics, fake
scarcity of content). Those mechanisms work *because* they scramble the
correspondence between effort and result. Learning requires that correspondence.
### Challenge 12. Growth mindset, grit, learning styles, and “21-day habits”
should not enter the arsenal as serious candidates
Sisk et al. (2018): mindset–achievement *r* ≈ .10; intervention *d* ≈ 0.08, with
possible benefits for at-risk students. Pashler et al. (2008): no adequate
evidence for meshing instruction to learning styles. The 21-day habit figure is
folklore; Lally’s median is 66 days for simple behaviors. These are popular, not
strong.
### What the brief got right (and this investigation will not walk back)
- Engagement is instrumental; proxy metrics are not success.
- Dark patterns should be studied, not sanitized.
- Goodharting is first-class.
- Distinguish immediate performance from delayed learning.
- After-lapse behavior matters more than streak length.
- Explore activity must not count as mastery evidence.
- The previous evaluation-integrity failure (strategic easy-item selection) is
the same phenomenon as Baker’s “gaming the system.”
- Research findings are not product decisions.
--## 3. Evidence map
| Tradition | What it is strong for | Strongest sources | External validity to
adult mobile symbolic logic | Main threat |
|---|---|---|---|---|
| Retrieval practice / testing effect | Delayed retention vs restudy | Rowland
2014; Adesope et al. 2017; Roediger & Karpicke 2006 | High for propositional
content; *open* for multi-step proofs under high load | Short-delay reversal;
recognition tests; failed retrieval without feedback |

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 6 of 46

| Spacing / lag | Long-term retention; schedule shape | Cepeda et al. 2006,
2008, 2009 | High for *when* to re-ask; low for *what* a session should contain
| Daily-product incentives vs optimal lag |
| Successive relearning | Durable maintenance, efficiency | Bahrick 1979; Rawson
& Dunlosky 2011, 2022; Rawson et al. 2018 | High conceptually; most studies use
definitions/vocab, not proofs | Time cost; dropout from criterion grind |
| Interleaving | Discrimination / strategy selection | Brunmair & Richter 2019;
Rohrer, Dedrick & Stershic 2015; Rohrer et al. 2020 RCT; Taylor & Rohrer 2010 |
High for choosing among similar inference rules; low for dissimilar topics |
Feels worse; novices may need blocking first |
| CLT / worked examples / expertise reversal | Novice acquisition of procedures
| Sweller; Atkinson, Renkl & Merrill 2003; Kalyuga; Tetzlaff et al. 2025 MA |
High: logic is the home domain of worked examples | Must fade; mobile extraneous
load |
| Self-explanation / generation | Inference-making, example use | Chi et al.
1989; Bisra et al. 2018; Bertsch et al. 2007 | Directly aligned with
“externalize intermediate state” | Shallow templated “explanations”; load |
| Feedback timing | Error correction vs spacing of correct items | Kulik & Kulik
1988; Butler, Karpicke & Roediger 2007; Mullet et al. 2014; Smith & Kimball 2010
| Mixed: lab often favors delay; classrooms often favor immediate | Learner
preference ≠ learning |
| Pretesting / errorful learning / hypercorrection | Encoding of subsequent
instruction | Richland, Kornell & Kao 2009; Kornell, Hays & Bjork 2009;
Butterfield & Metcalfe 2001, 2006 | Promising for “try before instruction”; risk
of frustration | Feedback required; not for high-stakes first exposures without
support |
| Productive failure / PS-I | Conceptual knowledge, sometimes transfer | Kapur
2014; Sinha & Kapur on fidelity; replication 2021 | Uncertain on mobile, solo,
adult, short sessions | High design-fidelity requirements; dropout |
| Metacognitive calibration | Study-time allocation | Nelson & Dunlosky 1991
delayed JOL; Koriat UWP; Dunlosky & Rawson | High if confidence is elicited
after delay, not as a gameable slider | Learners will fake confidence if it is
rewarded |
| Mastery learning / BKT / ITS | Individualized practice to criterion | Bloom;
Kulik et al. 1990; Corbett & Anderson 1995; VanLehn 2011; Kulik & Fletcher 2016
| Medium: school ITS ≠ consumer app | Local tests inflate effects; gaming;
guess/slip |
| Field homework tutors | Real learning in the wild | ASSISTments RCTs (IES/WWC)
| Medium (K-12 math, teacher-in-the-loop) | Externalize has no teacher |
| Logic-specific tutoring | Representation and transfer in logic | Hyperproof /
Openproof; Stenning & Oberlander; Cox et al. | **Highest topical relevance,
small literature** | Aptitude-by-treatment interactions |
| SDT / crowding-out | When rewards hurt interest | Deci, Koestner & Ryan 1999,
2001; Ryan & Deci | High for voluntary adult use | Does not imply “no feedback”
|
| Goal setting | Performance given commitment | Locke & Latham 1990, 2002 |
Medium; easy to set the wrong goal (XP vs capability) | Specificity toward a bad
metric |
| Implementation intentions / MCII | Initiation | Gollwitzer & Sheeran 2006;
Oettingen | High for “open the app after coffee”; not for proof quality |
Requires a real cue |
| Habit automaticity | Simple repeated acts | Lally et al. 2010; Wood | **Low
for reasoning; high for initiation** | Overgeneralization |
| Goal-gradient / endowed progress | Acceleration toward a visible goal | Kivetz
et al. 2006; Nunes & Drèze 2006 | High for completion of a finite quest;
dangerous post-reward | Reset collapse; fake progress |
| Temptation bundling / fresh start | Initiation, decaying | Milkman et al.
2014; Dai et al. 2014 | Medium; bundling *during* proof may harm attention |
Decay; attentional conflict |
| Notifications | Short-run DAU | Yancey et al. 2020; Morrison et al. 2017 PLOS
ONE | High for return; none for learning | Habituation; cue dependence;
annoyance |

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 7 of 46

| Streaks / freezes | Loss-averse return | Duolingo engineering blogs + Hadi
Mogavi et al. 2022; little independent RCT on learning | High for *return*;
negative for *what is returned to* | Lapse shame; farming |
| Gamification MAs | Small, messy learning effects | Sailer & Homner 2020;
Hamari line | Low as a blanket | Confounds; novelty |
| Serious games | Learning without extra motivation | Wouters et al. 2013 |
Medium | “Game” ≠ PBL layer |
| Gambling / near-miss / VR | Continued play, harm | Clark et al. 2009; Skinner;
loot-box reviews | High for engagement; **hostile to calibration** | Addictionlike persistence |
| Dark patterns | Compliance | Luguri & Strahilevitz 2021; systematic review
2023 | High for opt-in/notification permission; unethical as pedagogy |
Disproportionate harm; trust |
| Social comparison / leaderboards | Some people try harder; some quit |
Festinger; education gamification qualitative | Low-medium for a solitary logic
practice | Identity threat; farming |
| “Gaming the system” | Measurement integrity | Baker et al. 2004–; Aleven &
Koedinger help-seeking | **Directly on-point** | Adversarial UX if mishandled |
Independent line of evidence this investigation weights more heavily than
product folklore: **Hyperproof aptitude-by-treatment interactions**,
**relearning-override**, **Wouters’ null on motivation**, **Ghibellini & Meier
2025 on Zeigarnik**, **Chen/Sweller on undesirable difficulties under high
load**, and **Baker’s harmful-vs-nonharmful gaming distinction**.
--## 4. Mechanism arsenal
Format for each entry: name; domain; mechanism of action; target; evidence
quality; magnitude; time horizon; external validity; counterevidence; Goodhart
risk; ethical risk; Externalize application; backfire; smallest test; primary
learning metric; secondary engagement metric; guardrail; assessment.
Evidence quality: **A** meta-analysis / systematic review with useful
moderators; **B** replicated experiments or strong field RCTs; **C** mixed /
single-lab / industry with methods disclosed; **D** theory, qualitative, or
folklore.
--### 4.1 Retrieval practice (testing effect)
- **Domain:** Cognitive psychology of memory.
- **Mechanism:** Effortful retrieval strengthens later access (and, with
feedback, corrects errors). Bifurcation: successfully retrieved items move to a
high-strength distribution; unretrieved items do not — hence feedback’s
importance.
- **Target:** Retention, later transfer when tests require the same processes.
- **Evidence:** **A.** Rowland 2014 *g* = 0.50 vs restudy; Adesope 2017 *g* ≈
0.61–0.70 vs nontesting.
- **Magnitude:** Medium. Larger for recall than recognition; larger at delays ≥1
day; larger when initial retrieval succeeds or when failures receive feedback.
- **Horizon:** Days to months in typical studies; years in successive-relearning
programs.
- **External validity:** Good for facts, definitions, steps that can be
prompted. For full proofs, the “test” must be reconstruction, not recognition of
a legal formula.
- **Counterevidence:** Restudy can win at very short delays. High-load complex
materials can shrink the effect (van Gog & Sweller 2015; Chen et al.).
- **Goodhart:** Multiple-choice farming, rapid guessing, cue-dependent “tests”
that never require generation of intermediate structure.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 8 of 46

- **Ethics:** Low if framed as practice; high if high-stakes and punitive.
- **Application:** Every return session opens on *unaided reconstruction* of a
prior intermediate state, not a recap.
- **Backfire:** Failed retrieval without feedback; test anxiety; fluency
collapse causing quit.
- **Test:** Within-user A/B: session starts with retrieval vs restudy of
yesterday’s derivation; 7-day delayed novel-item test.
- **Primary learning:** 7-day unaided reconstruction accuracy.
- **Secondary engagement:** Session completion given retrieval-first.
- **Guardrail:** Quit rate on retrieval-first sessions; hint use.
- **Assessment:** **Strong candidate.**
### 4.2 Distributed practice / optimal lag
- **Domain:** Memory; Cepeda–Pashler–Rohrer–Wixted line.
- **Mechanism:** Study events separated in time; optimal ISI scales with desired
RI; too-short ISI wastes the second encoding on residual short-term strength.
- **Target:** Retention.
- **Evidence:** **A.** Cepeda et al. 2006; 2008 *Psychological Science*
ridgeline; 2009 optimizing distributed practice.
- **Magnitude:** Large at long RIs (e.g., threefold recall differences at 1-year
tests in the web-scale work). Average distributed-vs-massed benefit ~15
percentage points in the long-RI subset of the 2006 review.
- **Horizon:** Weeks to years.
- **External validity:** High for scheduling *reviews*. Uncertain for “how mixed
can a 12-minute mobile session be.”
- **Counterevidence:** Expanding vs equal is not settled in SuperMemo’s favor
(Karpicke & Roediger 2007).
- **Goodhart:** “Due today” queues that users cram or swipe away; users lowering
ease to farm.
- **Ethics:** Low.
- **Application:** Item scheduler targeting ~80–90% retrievability at the
*capability* grain, not daily restudy of the same problem.
- **Backfire:** Huge due-queues; forgotten items feel like failure; daily streak
fights long ISI.
- **Test:** Assign reviews at 1 day vs ~10–20% of a 30-day RI; 30-day delayed
test.
- **Primary:** 30-day retention.
- **Secondary:** Review completion rate.
- **Guardrail:** Queue abandonment.
- **Assessment:** **Strong candidate.**
### 4.3 Successive relearning
- **Domain:** Applied memory (Bahrick; Rawson & Dunlosky).
- **Mechanism:** Retrieve-to-criterion in session *n*, wait, retrieve-tocriterion again. Combines testing, spacing, and mastery. Relearning overrides
initial overlearning.
- **Target:** Retention, efficient relearning, maintenance.
- **Evidence:** **A/B.** Multiple large lab and classroom studies; not as many
independent labs as testing-effect proper.
- **Magnitude:** Very large in the reported contrasts (e.g., 20% vs 80% at one
week). Treat as an upper bound from definition-learning, not a forecast for
proofs.
- **Horizon:** Weeks to months after the last relearning session; Bahrick-scale
years with continued relearning.
- **External validity:** Materials are mostly key-term definitions and
vocabulary. Proofs take longer per trial; criterion may need to be “critical
lemmas,” not whole arguments.
- **Counterevidence:** Time-consuming; students find it cumbersome (Rawson &
Dunlosky 2022).
- **Goodhart:** Criterion of shallow paraphrases; users memorizing the prompt–

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 9 of 46

response pair.
- **Ethics:** Low–moderate (can feel like drill).
- **Application:** Capability is not marked stable until reconstructed to
criterion in ≥3 sessions at expanding lags.
- **Backfire:** Early dropout from grind; false mastery if criterion items are
too similar.
- **Test:** 1 vs 3 relearning sessions to criterion on a small rule set; 21-day
transfer test.
- **Primary:** Delayed transfer.
- **Secondary:** Time-to-criterion across sessions (should fall).
- **Guardrail:** Dropout; total time.
- **Assessment:** **Strong candidate** — the highest-leverage *learning*
mechanism if persistence can be obtained.
### 4.4 Interleaving (and contextual interference)
- **Domain:** Skill learning; math education.
- **Mechanism:** Mixing similar problem types forces discrimination and strategy
selection; also induces spacing as a side effect. Discrimination, not spacing,
is the distinctive mechanism (Taylor & Rohrer 2010).
- **Target:** Transfer, discrimination, retention.
- **Evidence:** **A.** Brunmair & Richter 2019; classroom RCTs by Rohrer et al.
- **Magnitude:** Small–medium overall (*g* ≈ 0.34 math); large in some tightly
controlled math experiments (scores doubled).
- **Horizon:** Days to the next cumulative exam; longer if combined with
spacing.
- **External validity:** High for choosing among inference rules that look
similar (e.g., which introduction/elimination rule). Low when categories are
dissimilar (blocking may win). Words/expository text can reverse.
- **Counterevidence:** Blocking often better *during* acquisition and for
dissimilar categories; novices may need an initial blocked example.
- **Goodhart:** Random mix that never repeats a type enough to form a schema.
- **Ethics:** Low; it feels worse, which is the point.
- **Application:** After a short blocked introduction of a rule, practice sets
mix confusable rules. Never a whole session of one template.
- **Backfire:** Confusion, perceived incoherence, quit.
- **Test:** Blocked vs interleaved practice of two confusable rules; 1-day test
requiring rule *selection*.
- **Primary:** Rule-selection accuracy on mixed test.
- **Secondary:** Session-level perceived difficulty / completion.
- **Guardrail:** Error spirals; rage-quit.
- **Assessment:** **Strong candidate** after a novice example phase.
### 4.5 Worked examples with fading and principle prompts
- **Domain:** Cognitive load theory; example-based learning.
- **Mechanism:** Novices study completed solutions (lowers extraneous load,
builds schemas); steps are faded; prompts force principle identification
(Atkinson, Renkl & Merrill 2003: medium-to-large near and far transfer without
extra time).
- **Target:** Acquisition, near/far transfer, later independence.
- **Evidence:** **A/B.** Large CLT literature; expertise-reversal meta-analysis
(Tetzlaff et al. 2025) as the boundary condition.
- **Magnitude:** Medium–large for novices vs unguided problem solving; reverses
for experts.
- **Horizon:** Schema construction over sessions; must fade or it becomes
redundant.
- **External validity:** Direct. Logic is a worked-example domain. Mobile
screens may wreck example readability.
- **Counterevidence:** Expertise reversal; passive copying of examples without
self-explanation.
- **Goodhart:** “I watched the example” counted as mastery.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 10 of 46

- **Ethics:** Low.
- **Application:** New rule: example → faded example with “why this step” → full
problem. Examples never grant capability credit.
- **Backfire:** Copying; never fading; experts annoyed.
- **Test:** Example–problem pairs vs faded+principle prompts; near and far
transfer, same time on task.
- **Primary:** Far-transfer accuracy.
- **Secondary:** Time on task.
- **Guardrail:** Copy-paste / screenshot behavior; later hint dependence.
- **Assessment:** **Strong candidate**, with mandatory fade.
### 4.6 Self-explanation
- **Domain:** Cognitive science (Chi); instructional psychology.
- **Mechanism:** Learner generates inferences about why a step is licensed,
filling gaps in examples.
- **Target:** Conceptual knowledge, transfer, reduced later scaffolding.
- **Evidence:** **A.** Bisra et al. 2018 *g* = 0.55; Chi, Bassok, Lewis, Reimann
& Glaser 1989.
- **Magnitude:** Medium. Conceptual prompts > purely metacognitive prompts
(moderator in the MA).
- **Horizon:** Same-session to delayed tests in the literature; durability as a
*habit of mind* is less measured.
- **External validity:** Extremely high — this *is* “externalize intermediate
state” if the explanation is the license, not a vibe.
- **Counterevidence:** Shallow prompts (“explain”) yield shallow text; high load
can wipe the benefit; some students already self-explain and prompts add little.
- **Goodhart:** Generic phrases, LLM-generated explanations pasted in, “because
of the rule” without instantiation.
- **Ethics:** Low.
- **Application:** Force a structured justification object (rule name +
substitution + discharged assumptions), not free text. Grade the object. Fade
the required explicitness with expertise.
- **Backfire:** Typing burden on mobile; ritualized junk explanations.
- **Test:** Structured justification vs answer-only vs free-text explain;
delayed transfer.
- **Primary:** Transfer; later performance with justifications hidden.
- **Secondary:** Time per item.
- **Guardrail:** Explanation uniqueness / template detection; success with
scaffolding removed.
- **Assessment:** **Strong candidate** if structured, not if chatty.
### 4.7 Generation (vs studying completed work)
- **Domain:** Memory (Slamecka & Graf 1978).
- **Mechanism:** Producing the item (or step) rather than reading it.
- **Target:** Retention.
- **Evidence:** **A.** Bertsch, Pesta, Wiscott & McDaniel 2007, 86 studies, *d*
= 0.40.
- **Magnitude:** Small–medium; mixed-list designs inflate it.
- **Horizon:** Typical lab delays.
- **External validity:** Good for filling a missing step; dangerous as “generate
a whole proof from nothing” for novices (CLT).
- **Counterevidence:** Can be an *undesirable* difficulty under high element
interactivity (Chen et al. 2018).
- **Goodhart:** Generating a trivial token.
- **Ethics:** Low.
- **Application:** Fade: generate the *next* justification, not the whole tree,
until schemas exist.
- **Backfire:** Floundering; random symbol salad.
- **Test:** Generate-next-step vs study-next-step in faded examples; delayed
reconstruction.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 11 of 46

- **Primary:** Delayed reconstruction.
- **Secondary:** Errors during generation.
- **Guardrail:** Time-to-give-up.
- **Assessment:** **Promising**, gated by expertise.
### 4.8 Pretesting / unsuccessful retrieval before instruction
- **Domain:** Memory; “test before study.”
- **Mechanism:** Failed attempt to answer enhances later encoding of the answer
(attention to the question; search of related knowledge). Not the same as
productive failure’s classroom design.
- **Target:** Retention of subsequently presented material.
- **Evidence:** **B.** Richland, Kornell & Kao 2009; Kornell, Hays & Bjork 2009.
Feedback/study after the attempt is required.
- **Magnitude:** Small–medium in lab trivia/prose; not a replacement for
instruction.
- **Horizon:** Same-day to days.
- **External validity:** Good as a 30-second “what do you think this sequent
needs?” Poor as a 15-minute failed proof with no teaching.
- **Counterevidence:** Errors can persist without feedback; frustration.
- **Goodhart:** Random guessing to skip to the explanation.
- **Ethics:** Moderate if it feels like being set up to fail.
- **Application:** One targeted pre-question before a new rule, then
instruction. Not a session of floundering.
- **Backfire:** Demoralization; error perseveration.
- **Test:** Pretest+study vs study-only of a new rule; 2-day test.
- **Primary:** 2-day accuracy.
- **Secondary:** Affect / continue rate.
- **Guardrail:** Self-reported humiliation; skip-to-answer rate.
- **Assessment:** **Promising** in micro form.
### 4.9 Productive failure / problem-solving before instruction (PS-I)
- **Domain:** Learning sciences (Kapur).
- **Mechanism:** Generate suboptimal solutions, activate/differentiate prior
knowledge, then see canonical instruction that contrasts with those attempts.
- **Target:** Conceptual knowledge, transfer.
- **Evidence:** **B**, with a serious fidelity caveat. Kapur 2014 and later work
show benefits when design criteria are met; “When Productive Failure Fails”
attributes many nulls to low fidelity (task, participation, social surround). A
2021 *Learning and Instruction* replication supports scaffolded failure-driven
PS-I.
- **Magnitude:** Often medium on conceptual tests when faithful; unreliable
otherwise.
- **Horizon:** Conceptual tests typically delayed days; not a habit mechanism.
- **External validity:** Low–medium for *solo mobile* short sessions. Original
designs are classroom, collaborative, longer.
- **Counterevidence:** Direct instruction often wins on procedural fluency and
when PF is poorly built (Kirschner, Sweller & Clark 2006 remains the opposing
pole).
- **Goodhart:** “I struggled, therefore I learned” without the instruction
phase.
- **Ethics:** Moderate (designed failure).
- **Application:** Occasional “invent a rule for this pattern” *explore*
episodes that are *explicitly not mastery evidence*, followed by a canonical
worked example. Do not daily-PF.
- **Backfire:** Quit; misconception consolidation if instruction is skipped.
- **Test:** Only after a dedicated explore mode exists; compare PF vs examplefirst on a new concept, with a conceptual posttest.
- **Primary:** Conceptual / transfer test.
- **Secondary:** Completion of the instruction phase.
- **Guardrail:** Dropout during struggle.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 12 of 46

- **Assessment:** **Context-dependent** — not a mobile default.
### 4.10 Immediate vs delayed feedback
- **Domain:** Instructional psychology.
- **Mechanism:** Immediate feedback prevents error perseveration and is
motivating; delayed feedback spaces the correct information and may reduce
interference from the error (delay-retention effect).
- **Target:** Error correction, retention, transfer (Mullet, Butler et al. 2014:
delay can help transfer despite student preference for immediate).
- **Evidence:** **A**, but **split**. Kulik & Kulik 1988: applied classroom
studies favor immediate; lab MC studies often favor delay. Subsequent lab work
(Butler et al. 2007; Smith & Kimball 2010) often favors delay for long-term
retention.
- **Magnitude:** Inconsistent; do not quote a single *d*.
- **Horizon:** Delay benefits show on delayed tests, not always on immediate
acquisition tests.
- **External validity:** For *step-level* logic on mobile, immediate
*correct/incorrect on the step* is probably required to prevent garbage trees.
Delayed *explanatory* feedback (why) can be a second event.
- **Counterevidence:** Learners hate delay; in the wild they may disengage.
- **Goodhart:** Answer-until-correct that becomes a slot machine.
- **Ethics:** Low.
- **Application:** Binary step validity immediate; principle explanation as a
spaced second look, especially after high-confidence errors (see
hypercorrection).
- **Backfire:** Delayed binary feedback on a proof = unusable product.
- **Test:** Immediate step check vs end-of-item check; delayed reconstruction.
- **Primary:** Delayed accuracy.
- **Secondary:** Frustration; completion.
- **Guardrail:** Illegal-proof rate; time lost in dead ends.
- **Assessment:** **Context-dependent** — split step-check from explanation.
### 4.11 Hypercorrection of high-confidence errors
- **Domain:** Metacognition (Butterfield & Metcalfe 2001, 2006).
- **Mechanism:** Surprising corrective feedback to a high-confidence error
captures attention and is better encoded; also, people often have latent
knowledge of the correct answer.
- **Target:** Error correction, calibration.
- **Evidence:** **B.** Robust in trivia/general knowledge; less mapped for
procedural logic.
- **Magnitude:** Reliable qualitative effect; not typically reported as a large
*d* for product planning.
- **Horizon:** Subsequent retest.
- **External validity:** Requires eliciting confidence. If confidence is
rewarded, it will be faked.
- **Counterevidence:** Overconfidence on procedures may not have the same
latent-knowledge structure as trivia.
- **Goodhart:** Users learn to report low confidence always, or high confidence
if “being wrong while sure” is narratively praised.
- **Ethics:** Low if confidence is private.
- **Application:** After a committed step, optional confidence; if highconfidence error, force attention to a contrastive example. Do not put
confidence on a leaderboard.
- **Backfire:** Gameable confidence; shame.
- **Test:** Confidence-elicited vs not, on items with feedback; correction rate
on high-confidence errors.
- **Primary:** Correction durability.
- **Secondary:** Willingness to rate confidence.
- **Guardrail:** Degenerate confidence distributions.
- **Assessment:** **Promising** as a feedback amplifier, not as a game.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 13 of 46

### 4.12 Delayed judgments of learning (calibration)
- **Domain:** Metamemory.
- **Mechanism:** Cue-only delayed JOLs force a retrieval attempt and are far
more accurate than immediate JOLs (Nelson & Dunlosky 1991). Practice can produce
underconfidence-with-practice (Koriat et al. 2002).
- **Target:** Calibration, restudy allocation.
- **Evidence:** **A/B** in lab lists; educational transfer mixed.
- **Magnitude:** Delayed-JOL resolution can approach ceiling in cue-only
paradigms; absolute calibration still biased.
- **Horizon:** Controls restudy in the next minutes to days.
- **External validity:** Useful if it *changes what is practiced*. Useless as a
decorative “how sure are you?”
- **Counterevidence:** JOLs can be altered by framing and then change study
choices even when learning is unchanged (Metcalfe & Finn).
- **Goodhart:** If restudy is optional and aversive, users claim they know it.
- **Ethics:** Low.
- **Application:** After a delay, cue the problem without the derivation; user
predicts reconstructability; then they must try. Discrepancy is the lesson.
- **Backfire:** Extra friction; UWP demoralization.
- **Test:** Delayed JOL+retrieve vs proceed-to-new-content; 7-day retention of
old items.
- **Primary:** Calibration (absolute error) and retention.
- **Secondary:** Extra time.
- **Guardrail:** “I know it” skip rate vs actual.
- **Assessment:** **Promising.**
### 4.13 Mastery learning / knowledge tracing
- **Domain:** Educational measurement; ITS.
- **Mechanism:** Do not advance until a knowledge component is at a mastery
threshold (Bloom; BKT: P(L0), learn, guess, slip).
- **Target:** Complete acquisition, reduced later failure.
- **Evidence:** **A.** Kulik et al. 1990 *d* = 0.52 on exams. BKT predicts tutor
performance reasonably (Corbett & Anderson 1995). Field ITS mixed.
- **Magnitude:** Medium in program evaluations; inflated when tests match the
tutor.
- **Horizon:** End of unit; not automatically long-term without relearning.
- **External validity:** Works when KCs are well defined. Logic needs a KC model
finer than “lesson 7.” Guess/slip on multiple choice will lie.
- **Counterevidence:** Time to mastery varies enormously; slow learners may be
trapped; BKT equity issues with fixed parameters.
- **Goodhart:** Easy-item selection to trip the threshold (the project’s own
past failure); hint-inflated “corrects.”
- **Ethics:** Moderate if lock-out is harsh.
- **Application:** Mastery of a *capability* requires delayed unaided items, not
same-session criterion only. BKT-like tracking is a *prior*, not a display.
- **Backfire:** Gatekeeping; farming; despair.
- **Test:** Same-session mastery vs delayed-confirmation mastery; 14-day
transfer.
- **Primary:** Delayed transfer.
- **Secondary:** Items to “mastery.”
- **Guardrail:** Easy-item proportion; hint-assisted corrects.
- **Assessment:** **Strong candidate** if the evidence rule is delayed and
unaided; **effective but dangerous** if the bar is same-session success.
### 4.14 Step-based intelligent tutoring / assistance calibration
- **Domain:** ITS (VanLehn; Koedinger & Aleven assistance dilemma).
- **Mechanism:** Feedback at the step, not only the answer; help that is neither
absent (flounder) nor complete (shallow processing).

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 14 of 46

- **Target:** Acquisition efficiency, learning vs time.
- **Evidence:** **A** for step-based > answer-based in VanLehn 2011 (*d* ≈ 0.76
vs 0.31 in that grouping — interpret cautiously). Assistance dilemma itself is
**open** as a solved engineering problem.
- **Magnitude:** Lab ITS large; field smaller.
- **Horizon:** Course-scale.
- **External validity:** Externalize is already a step-based tutor in doctrine.
The unsolved part is *when* to hint.
- **Counterevidence:** Help abuse; delayed-hint designs that students game by
erring fast (Murray & VanLehn 2005).
- **Goodhart:** Hint sequences that terminate in the answer become an answer
button.
- **Ethics:** Low–moderate.
- **Application:** Hints cost a *mastery-clock* penalty (this item cannot
certify the KC). Conceptual hint before bottom-out. Detect rapid hint-chaining
(Baker).
- **Backfire:** Legitimate strugglers punished; adversarial feel.
- **Test:** Bottom-out hints available vs conceptual-only vs delayed; learning
gains vs gaming rate.
- **Primary:** Delayed KC test.
- **Secondary:** Time; hint depth.
- **Guardrail:** Harmful-gaming detector rate; frustration.
- **Assessment:** **Strong candidate** (this *is* the product); hint policy is
the experiment.
### 4.15 Expertise reversal / adaptive fading of scaffolds
- **Domain:** CLT.
- **Mechanism:** Support that helps novices becomes redundant load and can
reduce autonomy for experts.
- **Target:** Efficiency, independence, motivation.
- **Evidence:** **A.** Expertise-reversal literature; 2025 meta-analysis
(Tetzlaff et al.).
- **Magnitude:** Interaction effects are the point; main effects of “more help”
are the wrong summary.
- **Horizon:** Across skill acquisition.
- **External validity:** Directly predicts that perpetual “externalize
everything” will bite advanced users.
- **Counterevidence:** Premature fading causes floundering (assistance dilemma).
- **Goodhart:** Users claiming expertise to skip; or never opting out of
scaffolds.
- **Ethics:** Low.
- **Application:** Fade required explicitness as delayed success accumulates.
Offer “unaided mode” as an achievement of *skill*, not a cosmetic unlock.
- **Backfire:** Fading too fast.
- **Test:** Yoked fading vs never-fade vs user-chosen fade; delayed unaided
performance and perceived autonomy.
- **Primary:** Unaided delayed performance.
- **Secondary:** Perceived competence/autonomy.
- **Guardrail:** Error explosions after fade.
- **Assessment:** **Strong candidate.**
### 4.16 Elaborative interrogation
- **Domain:** Memory strategies (Pressley; Dunlosky et al. 2013: moderate
utility).
- **Mechanism:** Answering “why is this true?” links to prior knowledge.
- **Target:** Factual/conceptual retention.
- **Evidence:** **B.** Moderate-utility rating in Dunlosky et al. 2013; weaker
evidence in mathematics than in facts.
- **Magnitude:** Moderate for facts given prior knowledge.
- **Horizon:** Typical study–test delays.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 15 of 46

- **External validity:** In logic, “why is this step licensed?” *is* the domain.
That is closer to self-explanation of proofs than to “why does the sky look
blue.”
- **Counterevidence:** Needs a knowledge base; empty why-questions fail.
- **Goodhart:** Canned why-answers.
- **Ethics:** Low.
- **Application:** Collapse into structured self-explanation (4.6) rather than a
separate feature.
- **Backfire:** Verbalism without syntax.
- **Test:** Fold into 4.6 rather than a separate experiment unless you have
fact-like content (definitions of validity, etc.).
- **Primary:** Delayed definition + use.
- **Secondary:** Time.
- **Guardrail:** Hollow answers.
- **Assessment:** **Promising** as a subset of self-explanation, not a distinct
product pillar.
### 4.17 Overlearning
- **Domain:** Skill/memory.
- **Mechanism:** Continue practice past criterion in one session.
- **Target:** Short-term retention, automaticity.
- **Evidence:** **B**, with a negative efficiency result for long-term given
relearning. Driskell et al. 1992 found overlearning benefits that decay; Rohrer
& Taylor 2006: overlearning helped little for delayed math vs distributed
practice; Rawson line: relearning overrides initial criterion.
- **Magnitude:** Short-term yes; long-term weak if relearning will occur.
- **Horizon:** Hours to a few days unless distributed.
- **External validity:** A mobile session that overlearns one item is time
stolen from other items.
- **Counterevidence:** Relearning-override; opportunity cost.
- **Goodhart:** XP for extra reps on easy items.
- **Ethics:** Low.
- **Application:** Do not reward extra same-session reps past a small criterion.
Put the time into a later session.
- **Backfire:** Boredom; illusion of mastery from fluency.
- **Test:** Extra same-session reps vs save time for day-3 relearning; delayed
test.
- **Primary:** Delayed recall per minute invested.
- **Secondary:** Enjoyment.
- **Guardrail:** Easy-item farming.
- **Assessment:** **Probably counterproductive** as a featured loop; **contextdependent** for perceptual automaticity of symbol reading only.
### 4.18 Contextual variability / transfer-appropriate processing
- **Domain:** Memory (encoding specificity; TAP; Barnett & Ceci 2002 transfer
taxonomy).
- **Mechanism:** Retrieval succeeds when processes/cues match; variability of
examples supports transfer to new surfaces; far transfer is rare and taxonomybound.
- **Target:** Transfer.
- **Evidence:** **A** conceptually; **B** empirically (mixed far-transfer).
Stenning et al. found transfer from logic courses to verbal reasoning *and* ATI
with Hyperproof.
- **Magnitude:** Near transfer common; far transfer small and fragile.
- **Horizon:** Transfer tests are the right horizon; they are expensive.
- **External validity:** If Externalize only ever uses one UI for proofs,
learners will memorize the interface. Variability of representation is not
optional for “genuine mastery.”
- **Counterevidence:** Too much variability too soon = high load.
- **Goodhart:** Superficial reskins that leave the same click path.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 16 of 46

- **Ethics:** Low.
- **Application:** Same capability tested in at least two representations (e.g.,
tree vs linear proof vs “which premise is unused”). Occasional paper-like
unaided mode.
- **Backfire:** Incoherence; user feels the curriculum is random.
- **Test:** Single-format vs dual-format practice; transfer to a withheld
format.
- **Primary:** Withheld-format accuracy.
- **Secondary:** Practice accuracy (may fall).
- **Guardrail:** Confusion; dropout.
- **Assessment:** **Strong candidate** for *mastery evidence*; do not skip
because it hurts session metrics.
### 4.19 Implementation intentions (if–then plans)
- **Domain:** Motivation / self-regulation (Gollwitzer).
- **Mechanism:** Link a situational cue to a response; automates *initiation*.
- **Target:** Initiation, return.
- **Evidence:** **A.** *d* = 0.65 (Gollwitzer & Sheeran 2006). Stronger when the
goal is real and the cue is specific.
- **Magnitude:** Medium–large for enactment of intended behaviors.
- **Horizon:** Days to weeks in typical studies; not a substitute for skill.
- **External validity:** Excellent for “after I pour coffee, I open Externalize
and do the due retrieval.” Poor for “if I see a sequent, then I will think
deeply.”
- **Counterevidence:** Weak goals + vague cues = null. Replication quality
varies by domain; health-behavior MAs are smaller than the original omnibus.
- **Goodhart:** Users form a plan to open the app and do a 5-second action.
- **Ethics:** Low (user-authored).
- **Application:** Onboarding: pick a daily cue; generate one if–then; the app
reminds *at that cue*, not at a random “we miss you.”
- **Backfire:** Reminder at the wrong time; plan to do something too big.
- **Test:** Cue-tied if–then vs generic daily reminder vs none; 28-day
initiation rate *and* valid-retrieval rate.
- **Primary:** Valid retrievals / week.
- **Secondary:** Sessions / week.
- **Guardrail:** Empty opens.
- **Assessment:** **Strong candidate** for the engagement clock.
### 4.20 Mental contrasting + implementation intentions (WOOP / MCII)
- **Domain:** Oettingen + Gollwitzer.
- **Mechanism:** Contrast desired future with the obstacle that blocks it
(creates expectancy-dependent commitment), then if–then on the obstacle.
- **Target:** Commitment + initiation.
- **Evidence:** **B.** Multiple experiments; less omnibus-meta than
implementation intentions alone.
- **Magnitude:** Medium where expectancies are favorable; *reduces* commitment
when expectancy is low (that is a feature: drop impossible goals).
- **Horizon:** Weeks.
- **External validity:** Good for “I want to actually learn logic, obstacle is
evening fatigue, plan is 12 minutes after lunch.”
- **Counterevidence:** Positive-fantasy-only can *reduce* effort (Oettingen). A
product that only sells the dream of being a logician may harm.
- **Goodhart:** Ritual WOOP screens nobody means.
- **Ethics:** Low.
- **Application:** A 3-minute exercise at onboarding and after lapses, not a
daily chore.
- **Backfire:** Confronting low expectancy causes uninstall (honest, but
commercially painful).
- **Test:** MCII vs implementation-intention-only vs none; 28-day valid
practice.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 17 of 46

- **Primary:** Valid practice days.
- **Secondary:** Retention in app.
- **Guardrail:** Uninstall after the exercise.
- **Assessment:** **Promising.**
### 4.21 Specific difficult goals (goal-setting theory)
- **Domain:** Organizational psychology (Locke & Latham).
- **Mechanism:** Direct attention, energize, persist, cue strategy search — *if*
the goal is specific, difficult, committed, and feedback exists.
- **Target:** Performance, persistence.
- **Evidence:** **A.** *d* ≈ 0.42–0.80 vs do-your-best.
- **Magnitude:** Medium–large on the *targeted* performance.
- **Horizon:** Task duration; new goals needed after attainment (and watch postreward reset).
- **External validity:** If the goal is “3 valid reconstructions of due items,”
it helps. If the goal is “30 XP,” it helps XP.
- **Counterevidence:** Wrong goal; goals in uncertain learning tasks sometimes
need *learning goals* not performance goals; ability limits.
- **Goodhart:** Extreme. This is the mechanism that *implements* Goodhart.
- **Ethics:** Moderate if goals are controlling.
- **Application:** Default daily goal = N *due retrievals at appropriate
difficulty*, not N minutes, not N items of any kind.
- **Backfire:** Easy-item completion; anxiety; cheating.
- **Test:** Process goal (due retrievals) vs time goal vs XP goal vs none;
delayed learning and farming rate.
- **Primary:** Delayed capability.
- **Secondary:** Goal hit rate.
- **Guardrail:** Difficulty of items used to hit the goal; hint rate.
- **Assessment:** **Context-dependent** — **strong** if pointed at valid
retrieval; **effective but dangerous** otherwise.
### 4.22 Self-efficacy / perceived competence
- **Domain:** Bandura; SDT competence.
- **Mechanism:** Belief one can do the task increases choice, effort,
persistence. Built by *enactive mastery* at calibrated difficulty, not by pep
talks.
- **Target:** Persistence, return after failure.
- **Evidence:** **A.** Multon, Brown & Lent 1991: self-efficacy–academic
outcomes relation substantial (often cited around *r* ≈ .38 in academic samples
— treat as correlational). Experimental support via success experiences.
- **Magnitude:** Medium correlational; causal path is “success at a hard-enough
task.”
- **Horizon:** Ongoing.
- **External validity:** High. Logic failure is identity-threatening.
- **Counterevidence:** Inflated efficacy from easy farming crashes on first hard
item.
- **Goodhart:** Easy wins to keep a confidence graph up.
- **Ethics:** Low if honest.
- **Application:** Visible *capability* growth from delayed items. Early wins
via faded examples, not via baby problems that never recur.
- **Backfire:** Helplessness from poorly calibrated difficulty.
- **Test:** Adaptive difficulty targeting ~70–80% unaided step success vs 95% vs
50%; 14-day retention and return after failure.
- **Primary:** Delayed learning.
- **Secondary:** Return after a failed item.
- **Guardrail:** Average item difficulty chosen by users when they have choice.
- **Assessment:** **Strong candidate** as a *constraint on difficulty policy*,
not as a badge.
### 4.23 Autonomy support (SDT) vs controlling rewards

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 18 of 46

- **Domain:** Self-determination theory.
- **Mechanism:** Controlling contingent rewards shift perceived locus of
causality outward and undermine free-choice interest (Deci et al. 1999).
Informational feedback and choice support autonomy and competence.
- **Target:** Voluntary persistence, quality of motivation.
- **Evidence:** **A.** Reward-undermining meta-analysis; large SDT literature.
Causal for free-choice time in lab; field education mixed but directionally
consistent.
- **Magnitude:** Engagement-contingent rewards *d* ≈ −0.40 on free-choice
intrinsic motivation.
- **Horizon:** After rewards stop, the hole shows. During rewards, behavior can
look great.
- **External validity:** Critical for a voluntary adult app. School ITS can
ignore this because attendance is coerced.
- **Counterevidence:** Boring tasks with no intrinsic interest can benefit from
rewards (not everything is crowded out). Symbolic logic may be interesting *or*
aversive depending on the person.
- **Goodhart:** “Optional” that isn’t.
- **Ethics:** High if ignored — this is the ethical core of dark patterns.
- **Application:** Rewards, if any, informational and unexpected; never the
reason for the activity. Choice of *which due item* among a small set, not
choice of *difficulty to farm*.
- **Backfire:** Too much choice (overload); no structure.
- **Test:** Informational progress vs XP-for-completion vs none; free-choice
return in week 4 after “rewards” equalized.
- **Primary:** Week-4 delayed test.
- **Secondary:** Free-choice sessions after incentive change.
- **Guardrail:** Self-reported “I do it for the points.”
- **Assessment:** **Strong candidate** as a design constraint. XP-for-engagement
is **probably counterproductive** for long-run interest.
### 4.24 Expectancy-value / utility framing
- **Domain:** Eccles & Wigfield.
- **Mechanism:** Engagement ≈ expectancy of success × value (intrinsic, utility,
attainment) minus cost.
- **Target:** Initiation, persistence.
- **Evidence:** **A** as a correlational/developmental framework; fewer clean
RCTs that “increase utility value” in apps. Hulleman & Harackiewicz utilityvalue interventions exist in classrooms (often small, heterogeneous).
- **Magnitude:** Utility-value writing interventions: small, sometimes only for
low-expectancy students.
- **Horizon:** Semester-scale in school studies.
- **External validity:** Adult learners who opened a logic app already have some
value. The binding constraint is cost (difficulty, time, confusion), not a
brochure about why logic matters.
- **Counterevidence:** Preaching utility can feel controlling.
- **Goodhart:** Fake “real world” examples that trivialize the logic.
- **Ethics:** Low.
- **Application:** Occasional authentic argument (news, law, math) as *transfer
items*, which simultaneously raise value and test transfer.
- **Backfire:** Cheesy applied examples; time away from core skill.
- **Test:** Weekly authentic-transfer item vs not; 6-week continuation and
transfer.
- **Primary:** Transfer.
- **Secondary:** Continuation.
- **Guardrail:** Time stolen from core practice.
- **Assessment:** **Promising** as authentic transfer, not as marketing copy.
### 4.25 Identity-based motivation

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 19 of 46

- **Domain:** Oyserman.
- **Mechanism:** When an identity is active, difficulty is interpreted as
importance (“this is what people like me do”) vs impossibility.
- **Target:** Persistence through difficulty.
- **Evidence:** **B.** Experimental identity-cueing studies; not a large
education-product RCT literature.
- **Magnitude:** Context-specific, often small–medium, sensitive to cueing.
- **Horizon:** Situational (minutes to days) unless repeatedly cued.
- **External validity:** “I am someone who can follow an argument” is a
plausible identity. “I am a 400-day streaker” is a competing identity (Hadi
Mogavi et al.).
- **Counterevidence:** If difficulty is cued as “you’re not a logic person,” it
will hurt. Growth-mindset-as-slogan is not a substitute (Sisk *d* ≈ 0.08).
- **Goodhart:** Identity badges as cosmetics.
- **Ethics:** Moderate (identity is intimate).
- **Application:** Frame desirable difficulty as diagnostic of real skill, not
of personal defect. Do not build identity around streak number.
- **Backfire:** Identity threat after errors; exclusive “logician” branding.
- **Test:** Difficulty-as-importance copy vs difficulty-as-threat vs none, on a
hard item; persistence and next-session return. Preregister. Expect small
effects.
- **Primary:** Persistence on the hard item.
- **Secondary:** Return.
- **Guardrail:** Shame; dropout.
- **Assessment:** **Speculative** as a feature; **promising** as copy/framing
hygiene.
### 4.26 Curiosity / information-gap (Loewenstein; Kang et al. 2009)
- **Domain:** Motivation; cognitive neuroscience of curiosity.
- **Mechanism:** Moderate confidence that one does *not* quite know produces an
inverted-U of curiosity; people spend resources to close the gap. Closing the
gap is rewarding (prediction error on *information*, not on loot).
- **Target:** Initiation of the next item; encoding (curiosity can enhance later
memory for the answer).
- **Evidence:** **B.** Kang et al. 2009 and replications of the inverted-U;
memory benefits of curiosity states replicated in several labs.
- **Magnitude:** Medium for information-seeking; memory effects smaller and
material-dependent.
- **Horizon:** Item-level, seconds to minutes; not a 90-day habit.
- **External validity:** High if the gap is “which rule applies” or “what’s
wrong with this step.” Low if the gap is “what’s in the mystery chest.”
- **Counterevidence:** Gaps also produce frustration (workplace information-gap
work). Too-large gaps → anxiety, not curiosity.
- **Goodhart:** Fake mysteries; clickbait prompts.
- **Ethics:** Low if the information *is* the content; high if used as a
cliffhanger to force another session of ads.
- **Application:** End a session on a well-posed, *solvable-tomorrow* puzzle
whose answer is a real capability, not a cosmetic. This is the learning-aligned
version of a cliffhanger.
- **Backfire:** Unfinished *confusing* states; rumination.
- **Test:** Session end at a complete item vs at a posed next-problem
(Ovsiankina+curiosity) vs at a loot cliffhanger; next-day return *and* solution
quality.
- **Primary:** Next-day solution quality.
- **Secondary:** Next-day return.
- **Guardrail:** Frustration; unsolicited session lengthening.
- **Assessment:** **Promising** when the gap is epistemic; **effective but
dangerous** when the gap is a loot box.
### 4.27 Temptation bundling

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 20 of 46

- **Domain:** Behavioral economics (Milkman, Minson, Volpp 2014).
- **Mechanism:** Restrict a “want” (audiobook) to co-occur with a “should”
(gym).
- **Target:** Initiation.
- **Evidence:** **B.** One strong field experiment: +51% gym visits initially;
decay over 9 weeks; 61% would *pay* for the commitment device after.
- **Magnitude:** Medium early; not durable through a break (Thanksgiving).
- **Horizon:** Weeks, decaying.
- **External validity:** Gym+audiobook is compatible dual-task. Proof
construction is not compatible with a podcast. Bundling *after* the session
(reward) is just a reward and re-enters crowding-out.
- **Counterevidence:** Decay; attentional conflict.
- **Goodhart:** Users “bundle” by playing the app in the background.
- **Ethics:** Low if user-chosen.
- **Application:** Allow users to pair a *post-session* treat they already want,
or a location cue (only at the desk). Do not dual-task during items.
- **Backfire:** Divided attention; decay.
- **Test:** Only if users opt in; compare bundled post-session reward vs not;
quality of work during session.
- **Primary:** Item quality / delayed test.
- **Secondary:** Session initiation.
- **Guardrail:** Rapid-guessing during bundled sessions.
- **Assessment:** **Context-dependent**; weak for concurrent bundles.
### 4.28 Fresh start / temporal landmarks
- **Domain:** Dai, Milkman, Riis 2014.
- **Mechanism:** Landmarks close a mental account (“that was old me”) and raise
aspirational initiation.
- **Target:** Re-initiation after lapse; onboarding.
- **Evidence:** **B.** Archival field evidence (Google “diet,” gym visits, goal
commitments). Later work on retirement savings nudges.
- **Magnitude:** Detectable population-level spikes; individual effects modest.
- **Horizon:** Initiation, not maintenance. New Year’s resolutions are the
existence proof of *failure* of maintenance.
- **External validity:** Use after a broken streak *instead of* shame. “New
week, new attempt” is on-label. Do not wait for Monday to schedule reviews the
memory model needs now.
- **Counterevidence:** Spikes without scaffolding produce failed resolutions.
- **Goodhart:** Users delaying work until a landmark.
- **Ethics:** Low.
- **Application:** Lapse recovery copy uses a landmark; scheduler does *not*
wait.
- **Backfire:** Procrastination to Monday.
- **Test:** Post-lapse recovery UI with landmark framing vs “you broke your
streak” vs neutral; 14-day re-engagement and valid retrievals.
- **Primary:** Valid retrievals after lapse.
- **Secondary:** Reopen rate.
- **Guardrail:** Delay-to-Monday.
- **Assessment:** **Promising** for recovery, not for weekly batching of
learning.
### 4.29 Goal-gradient (progress toward a finite goal)
- **Domain:** Hull; Kivetz, Urminsky & Zheng 2006.
- **Mechanism:** Effort rises as remaining distance shrinks; people accelerate.
- **Target:** Completion of a finite unit.
- **Evidence:** **B.** Café field data; song-rating website; illusion of
progress also works.
- **Magnitude:** ~20% faster coffee purchases near the reward in the café study
(popular summary of Kivetz et al.).
- **Horizon:** Within a goal cycle. **Post-reward reset** is the neglected half.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 21 of 46

- **External validity:** Good for “finish these 5 due reconstructions.” Bad as
an infinite streak (no finish line — that’s loss aversion, not goal gradient).
- **Counterevidence:** After reward, the people who accelerated most disengage
hardest.
- **Goodhart:** Shrinking remaining distance by shrinking quality.
- **Ethics:** Low–moderate.
- **Application:** Finite “today’s due set” with a progress bar. After
completion, stop. Do not auto-chain into “just one more” that massacres spacing.
- **Backfire:** Post-goal collapse; rushing last items.
- **Test:** Visible remaining due-items vs XP bar vs none; last-item quality and
next-day return.
- **Primary:** Last-item quality; delayed test.
- **Secondary:** Completion rate.
- **Guardrail:** Time-per-item drop on last items (rushing).
- **Assessment:** **Promising** for finite daily due sets; **effective but
dangerous** if chained infinitely.
### 4.30 Endowed progress
- **Domain:** Nunes & Drèze 2006; also Kivetz illusion-of-progress arm.
- **Mechanism:** Artificial head start reframes the task as underway; completion
rises (car wash: ~34% vs ~19%).
- **Target:** Initiation of a finite program.
- **Evidence:** **B.** Field experiments on loyalty cards.
- **Magnitude:** Large on completion of the *same remaining work*.
- **Horizon:** One cycle.
- **External validity:** Onboarding “you’ve already mapped your first
capability” may help. Fake stamps on *mastery* would be measurement fraud.
- **Counterevidence:** If the endowment is seen as a trick, it can backfire
(moderator: reason offered for endowment).
- **Goodhart:** Fake mastery.
- **Ethics:** **High** if used on the mastery clock; **moderate** if used on a
clearly cosmetic onboarding bar.
- **Application:** Onboarding progress on *setup* (cue chosen, first example
studied), never on capability.
- **Backfire:** Trust loss; inflated self-assessment.
- **Test:** Endowed onboarding checklist vs empty; completion of first *real*
retrieval. Do not endow mastery.
- **Primary:** First delayed retrieval success.
- **Secondary:** Onboarding completion.
- **Guardrail:** Calibration error.
- **Assessment:** **Context-dependent**; **effective but dangerous** on mastery
displays.
### 4.31 Context-stable cueing (habit automaticity)
- **Domain:** Wood; Lally et al. 2010.
- **Mechanism:** Repeat behavior in the same context until the cue elicits the
action with less deliberation.
- **Target:** Initiation automaticity.
- **Evidence:** **B.** Lally: 66 days median, huge variance; missed single days
OK. Wood: context change disrupts habits (habit discontinuity).
- **Magnitude:** Automaticity *can* form; time is long; many never plateau in 12
weeks.
- **Horizon:** 2–8+ months for simple acts.
- **External validity:** Cue = “desk after lunch → open due list.” Not cue =
“see a ∀ → automatically prove.”
- **Counterevidence:** Context disruption (travel, weekends) kills the habit.
Notifications as cues create *reminder dependence*, which is not the same as
context habit (and may prevent it).
- **Goodhart:** The automatic act becomes “open app, dismiss.”
- **Ethics:** Low.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 22 of 46

- **Application:** Help the user pick one context. Measure initiation in that
context. Do not claim the reasoning is habitual.
- **Backfire:** Rigid context; failure when context breaks with no recovery
plan.
- **Test:** Context-stable plan vs notification-only; 66-day automaticity (SRHI)
*and* valid work.
- **Primary:** Valid work frequency.
- **Secondary:** SRHI; initiation latency after cue.
- **Guardrail:** Empty opens; failure after travel week.
- **Assessment:** **Strong candidate** for initiation; **insufficient evidence**
for skill automaticity.
### 4.32 Reminders and push notifications
- **Domain:** HCI; JITAI; Duolingo KDD 2020.
- **Mechanism:** External cue when the internal cue is not yet habitual.
- **Target:** Return, session initiation.
- **Evidence:** **C/B.** Duolingo: +0.5% DAU, +2% new-user recurring retention
(two weeks). Morrison et al. 2017: more frequent notifications increased *views*
of notifications without increasing actual intervention *usage*. Physicalactivity MRTs: early effects, habituation. A 9-week language RCT (weaker
journal) reported higher adherence under notifications but **sharp drop when
notifications stopped** (cue dependence).
- **Magnitude:** Small on DAU at Duolingo scale (commercially meaningful at
millions of users; not a learning revolution).
- **Horizon:** Days–weeks; habituation thereafter.
- **External validity:** High for return. Zero implied learning.
- **Counterevidence:** Uninstall; stress; cue dependence; intelligent timing not
always better than daily (Morrison).
- **Goodhart:** Optimize open rate; send guilt-owl at 11:30 pm; user does 10
seconds of junk.
- **Ethics:** **High** (attention extraction, sleep, guilt).
- **Application:** User-chosen time; content = “your due retrieval of X is at
the forgetting edge,” not “don’t lose your streak.” Cooldown after ignores.
Never punish muting.
- **Backfire:** Notification deafness; association of the app with nagging.
- **Test:** Cue-time reminder vs streak-guilt vs none; valid retrievals,
mute/uninstall at 28 days.
- **Primary:** Valid retrievals.
- **Secondary:** Opens from notification.
- **Guardrail:** Mute rate; uninstall; late-night sessions as a negative, not a
win.
- **Assessment:** **Promising** if informational and user-timed; **effective but
dangerous** as guilt/variable spam.
### 4.33 Streaks (loss-framed consecutive days)
- **Domain:** Consumer apps; loss aversion (Kahneman & Tversky); Duolingo
practice.
- **Mechanism:** Accumulated counter becomes a reference point; breaking it is
coded as a loss. Not a goal-gradient (no terminal goal). Not habit automaticity.
- **Target:** Daily return.
- **Evidence:** **C.** Ubiquitous industry use; Duolingo internal: streaks
motivate extension, breaks demotivate; freeze increased DAU +0.38% (company
blog, methods not fully disclosed). Hadi Mogavi et al. 2022: qualitative
evidence of streak farming and anxiety. Independent RCTs on *learning* from
streaks: essentially absent.
- **Magnitude:** Unknown for learning. For engagement, internally claimed to be
large for some users, catastrophic after breaks for others.
- **Horizon:** Works until first serious lapse, then may invert.
- **External validity:** High for daily open. The brief is correct that 14-day
streaks that die at day 15 can be worse than no streak.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 23 of 46

- **Counterevidence:** Shame, avoidance, meaningless activity, bedtime “just
keep it alive.”
- **Goodhart:** **Extreme.** Anything that counts as a day will be the day.
- **Ethics:** **High** (guilt, compulsion).
- **Application:** If used at all: a day counts only if ≥1 *mastery-clock-valid*
retrieval at appropriate difficulty. Provide slack (see freeze). After a break,
do not display a tombstone; go to recovery (4.35).
- **Backfire:** Farming; night-time junk; permanent churn at first miss.
- **Test:** No streak vs any-open streak vs valid-retrieval streak; 56-day
delayed learning, lapse recovery, and farming rate. **This is a high-value
experiment.**
- **Primary:** Delayed capability.
- **Secondary:** Active days.
- **Guardrail:** Median seconds per “streak day”; % of streak days that are
junk; churn after first miss.
- **Assessment:** **Effective but dangerous.** Valid-retrieval streaks are
**promising**; any-open streaks are **probably counterproductive** for learning.
### 4.34 Streak freeze / slack in goals
- **Domain:** Goal research (some evidence that rigid rules reduce motivation);
Duolingo freeze.
- **Mechanism:** Insurance reduces the expected catastrophe of a miss, so people
are willing to *start* a streak and less likely to abandon after a planned miss.
Also an admission that the streak’s power is loss.
- **Target:** Lapse survival.
- **Evidence:** **C.** Company A/B (+0.38% DAU). Related: research on “emergency
reserves” in goals (e.g., Cornell/UPenn-adjacent work on slack). Not a learning
literature.
- **Magnitude:** Small on DAU at scale.
- **Horizon:** Ongoing.
- **External validity:** Slack that is *earned by learning* is different from
slack that is purchased with gems.
- **Counterevidence:** Insurance can license skip days; pay-to-win freeze.
- **Goodhart:** Users living on freezes.
- **Ethics:** Moderate; selling freezes is extractive.
- **Application:** Automatic freeze after a week of *valid* work, not a shop
item. Cap. Never require payment.
- **Backfire:** Streak becomes fictional.
- **Test:** Valid-streak with 1 freeze/week vs rigid vs no streak; junk-day rate
and 56-day learning.
- **Primary:** Delayed learning.
- **Secondary:** Continuation after a miss.
- **Guardrail:** Freeze utilization vs valid work.
- **Assessment:** **Context-dependent**; necessary if streaks exist.
### 4.35 Lapse recovery / restart mechanics
- **Domain:** Habit discontinuity; fresh start; clinical relapse models (more
mature than app design).
- **Mechanism:** The first miss is a high-risk identity event (“I’m not a person
who does this”). Recovery should recode it as expected, restore a small
competent action, and *not* reset mastery.
- **Target:** Return after miss.
- **Evidence:** **C/D** in apps; stronger analog in addiction/exercise relapse.
Lally: one miss ≠ death of automaticity; many misses do. Industry folklore
overweights “don’t break the chain” relative to “repair the chain.”
- **Magnitude:** Unknown. Possibly the highest-ROI *engagement* design if
streaks are used.
- **Horizon:** 48–72 hours after a miss.
- **External validity:** Directly what the brief asked.
- **Counterevidence:** Over-forgiving recovery that never requires valid work.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 24 of 46

- **Goodhart:** Recovery quests that are easier than real work.
- **Ethics:** Low if supportive; high if “come back, you failure.”
- **Application:** “Your capabilities are intact. Due: one reconstruction at the
forgetting edge.” No flame animation.
- **Backfire:** Nagging recovery sequences.
- **Test:** Tombstone vs recovery-quest (easy junk) vs recovery-one-valid-item;
14-day re-engagement *and* item difficulty.
- **Primary:** Valid item after lapse.
- **Secondary:** Reopen.
- **Guardrail:** Difficulty of recovery items.
- **Assessment:** **Strong candidate** (under-studied, high relevance).
### 4.36 Unfinished-task resumption (Ovsiankina), not Zeigarnik memory
- **Domain:** Lewin school; 2025 meta-analysis.
- **Mechanism:** People tend to resume interrupted tasks (~2/3). Memory
advantage for unfinished tasks does **not** generally replicate.
- **Target:** Return.
- **Evidence:** **A** (2025 MA): Ovsiankina yes; Zeigarnik no.
- **Magnitude:** High resumption rates in lab interruption paradigms; app
translation uncertain.
- **Horizon:** Hours to a day.
- **External validity:** “Leave a proof with the next step obvious” is a cheap
return cue. “Leave a confusing mess” is load, not a hook.
- **Counterevidence:** Open loops cause rumination and can harm well-being
(Baumeister/Masicampo: plans can discharge the tension without doing the task —
so a *plan* may replace the return).
- **Goodhart:** Artificial interruption of a finished thought to force another
session (“your energy ran out”).
- **Ethics:** **High** if used as a dark pattern (forced mid-item logout).
**Low** if the user stops themselves with a noted next step.
- **Application:** User-initiated stop saves a “next step is…” card. Do not kill
a session mid-item for energy/hearts.
- **Backfire:** Cognitive leftover stress; artificial energy systems.
- **Test:** Natural save-with-next-step vs forced energy-out vs complete-itemonly stopping; next-day resumption and affect.
- **Primary:** Quality of resumed work.
- **Secondary:** Resumption rate.
- **Guardrail:** Negative affect; perceived manipulation.
- **Assessment:** **Promising** as user-owned next-step; **effective but
dangerous** as forced interruption. Zeigarnik-as-memory: **insufficient evidence
/ folklore**.
### 4.37 Friction reduction and defaults (choice architecture)
- **Domain:** Behavioral economics; Fogg; Thaler & Sunstein.
- **Mechanism:** Reduce steps to the target action; default the useful option.
- **Target:** Initiation.
- **Evidence:** **A** for defaults in other domains (organ donation, 401(k)).
**C** for learning apps.
- **Magnitude:** Defaults can be huge for *one-time* administrative choices; for
daily cognitive work, reducing login friction helps little if the work itself is
the cost.
- **Horizon:** Immediate.
- **External validity:** One-tap to *due retrieval* is good. Defaulting “easy
practice” is bad.
- **Counterevidence:** Too little friction on hints = gaming. Fogg’s “tiny
habits” can shrink the behavior to something that is no longer learning (the
“tiny” failure mode).
- **Goodhart:** Default path is the farm path.
- **Ethics:** Moderate (defaults are powerful and often unnoticed).
- **Application:** Home screen = the single next due reconstruction. Not a

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 25 of 46

dashboard of games. Hints behind friction; start-of-session behind none.
- **Backfire:** Tiny-habit version of logic that never hurts (and never
teaches).
- **Test:** Home = due item vs home = menu; valid retrievals / open.
- **Primary:** Valid retrievals / open.
- **Secondary:** Opens.
- **Guardrail:** Hint rate; time-to-first-valid-attempt.
- **Assessment:** **Strong candidate** if the default *is* the useful act.
### 4.38 Variable-ratio / intermittent reinforcement
- **Domain:** Operant psychology; gambling; F2P.
- **Mechanism:** Unpredictable reward produces high, extinction-resistant
responding.
- **Target:** Persistence of responding.
- **Evidence:** **A** in animals and gambling. **A** for harm association in
loot boxes. **None** for delayed academic learning.
- **Magnitude:** Very large for responding; orthogonal to truth.
- **Horizon:** Persistent until burnout or harm.
- **External validity:** Will increase taps. Will not increase valid inference.
The “aligned” version (unpredictable *which due item* appears) is just
interleaving, which is already justified without casino packaging.
- **Counterevidence:** Crowding-out; addiction-like use; Hadi Mogavi misuse.
- **Goodhart:** The ratio is defined on whatever you count.
- **Ethics:** **Very high.**
- **Application:** Do not use cosmetic VR. If anything is unpredictable, let it
be *which legitimate problem* is next (interleaving), with no jackpot animation.
- **Backfire:** Compulsion, evening use, trust loss, calibration damage (the
world of proofs is *not* a slot machine; teaching people to expect random payoff
harms the epistemic goal).
- **Test:** Do not A/B loot boxes on learners. If forced: interleaving with vs
without VR animation; learning identical, compulsion and session length as
guardrails — expect engagement up, learning flat, guardrails red.
- **Primary:** Delayed learning (expect null).
- **Secondary:** Session length.
- **Guardrail:** Compulsive-use items; late-night use; “can’t stop” reports.
- **Assessment:** **Effective but dangerous.** Cosmetic VR: **probably
counterproductive** to the epistemic aims of a logic app. Interleaving-withoutcasino: use 4.4 instead.
### 4.39 Near-misses
- **Domain:** Gambling neuroscience (Clark et al. 2009).
- **Mechanism:** Losses that resemble wins recruit win circuitry and increase
desire to continue; felt as *less pleasant* than full misses but more
motivating.
- **Target:** Continue playing.
- **Evidence:** **A/B** in gambling; replicated neural and behavioral effects.
Associated with problem gambling severity.
- **Magnitude:** Reliable motivation-to-continue; negative affect.
- **Horizon:** Immediate.
- **External validity:** “You almost had the right rule” as *formative feedback*
is pedagogy. “Two cherries and a lemon” as a UI is gambling. The difference is
whether the nearness is *informational about the domain*.
- **Counterevidence:** Frustration; illusion of control (Langer 1975) — people
overestimate skill in chance settings. In logic, illusion of control is a
*calibration failure*.
- **Goodhart:** Designing problems so users “almost” win regardless of
understanding.
- **Ethics:** **Very high** as a casino mechanic. **Low** as contrastive
feedback (“you used ∃E incorrectly; the miss was here”).
- **Application:** Contrastive error feedback. Never animate almost-rewards.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 26 of 46

Never imply that luck was involved.
- **Backfire:** Teaching that logic is luck; chasing.
- **Test:** Not as a gamification experiment. As feedback: contrastive near-miss
explanation vs generic “wrong”; correction durability.
- **Primary:** Correction durability.
- **Secondary:** Continue-to-next-item.
- **Guardrail:** Illusion-of-control questionnaire; desire-to-continue after
errors that *should* cause reflection.
- **Assessment:** Casino near-miss: **effective but dangerous / probably
counterproductive** for calibration. Contrastive feedback: **strong candidate**
(already part of tutoring).
### 4.40 Loss framing, hearts, lives, energy
- **Domain:** Prospect theory; F2P session control.
- **Mechanism:** Errors cost a scarce resource; loss aversion makes people play
“safe”; energy gates session length to drive return/monetization.
- **Target:** Carefulness; session cap; return.
- **Evidence:** **C.** Industry-standard. Pedagogically backwards relative to
errorful learning, pretesting, and hypercorrection: *errors with feedback are
learning events*. Punishing them reduces information-seeking and increases hint
use and easy-item selection.
- **Magnitude:** Strong for cautious play and session end. Anti-learning if
errors are the signal.
- **Horizon:** Session.
- **External validity:** Direct. A logic tutor that takes a heart for a wrong
elimination rule is training avoidance of hard steps.
- **Counterevidence:** Errorful learning literature; Baker harmful gaming on the
least-known steps.
- **Goodhart:** Never attempt hard steps; hint before risking a heart.
- **Ethics:** **High** (artificial scarcity of the right to learn).
- **Application:** Do not use hearts. If session length must be capped, cap by
*cognitive fatigue* or user-chosen time, not by error count.
- **Backfire:** Hint abuse; easy farming; evening rage.
- **Test:** If a stakeholder insists: hearts vs error-as-information; hint rate,
difficulty attempted, delayed learning. Predict hearts win engagement-of-a-sort
and lose learning.
- **Primary:** Delayed learning; difficulty attempted.
- **Secondary:** Session length.
- **Guardrail:** Hint rate; % of errors that are “never tried.”
- **Assessment:** **Probably counterproductive** for learning. **Effective but
dangerous** for monetized session gating.
### 4.41 Scarcity, countdowns, FOMO
- **Domain:** Cialdini; marketing; dark patterns.
- **Mechanism:** Limited time/quantity increases perceived value and impulsive
action (Barton, Zlatevska & Oppewal 2022 meta-analysis of product scarcity on
purchase intent).
- **Target:** Immediate action.
- **Evidence:** **A** for purchase intent. **None** for durable learning. Fake
scarcity, once detected, destroys trust.
- **Magnitude:** Medium on conversion; quantity scarcity sometimes > time
scarcity in ads (Aggarwal et al. 2011).
- **Horizon:** Immediate; habituation; cynicism.
- **External validity:** “This review is due because you are about to forget” is
*true* scarcity of a memory opportunity — aligned. “Your chest expires in
3:00:00” is fake.
- **Counterevidence:** Impulse, regret, uninstall.
- **Goodhart:** Users cram before expiry, massing practice.
- **Ethics:** **High** when false; **low** when the countdown is a real
forgetting model.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 27 of 46

- **Application:** Countdown only as predicted forgetting of a real item. Never
fake limited content.
- **Backfire:** Cramming; distrust.
- **Test:** True forgetting-edge prompt vs fake 24h chest; cramming vs spacing,
30-day retention.
- **Primary:** 30-day retention.
- **Secondary:** Immediate open.
- **Guardrail:** Trust items; massing.
- **Assessment:** True memory scarcity: **promising**. Fake scarcity:
**effective but dangerous.**
### 4.42 Leaderboards, leagues, social comparison
- **Domain:** Festinger; gamification.
- **Mechanism:** Rank information motivates some (upward comparison,
competition) and demotivates others (identity threat, hopelessness). Combining
competition with collaboration was a Sailer & Homner moderator for *behavioral*
outcomes.
- **Target:** Effort, return.
- **Evidence:** **C** for learning apps; Sailer moderator analyses; extensive
qualitative harm (Duolingo leagues: XP racing).
- **Magnitude:** Heterogeneous; means hide that tails go both ways.
- **Horizon:** Novelty then either grind or quit.
- **External validity:** Logic skill is not visible as XP. Any leaderboard of
points becomes a farming contest (Hadi Mogavi et al.).
- **Counterevidence:** Demotivation of bottom ranks; cheating; relatedness harm.
- **Goodhart:** **Extreme** (XP per hour).
- **Ethics:** **High.**
- **Application:** If social at all: optional small groups sharing a *hard
problem*, not a rank of minutes. No global XP league.
- **Backfire:** Farming; shame; privacy.
- **Test:** No social vs optional co-problem vs XP league; learning, farming,
dropout by initial skill quantile.
- **Primary:** Delayed learning by quantile.
- **Secondary:** DAU.
- **Guardrail:** Bottom-quantile churn; XP per learning-item.
- **Assessment:** XP leaderboards: **probably counterproductive.** Optional
collaborative problems: **speculative / promising.**
### 4.43 XP, levels, achievements, collections, battle passes, quests, pseudocurrency
- **Domain:** F2P progression systems.
- **Mechanism:** Token reinforcement, endowed progress, goal-gradient on a metabar, unlocking, completion bias. Battle pass = finite season goal-gradient +
FOMO.
- **Target:** Session volume, monetization, “sense of progress.”
- **Evidence:** **C.** Sailer & Homner small effects with confounds. Industry:
these systems demonstrably move playtime. Learning: Hadi Mogavi et al. misuse.
Wouters: games teach without extra motivation — so the *game fiction* is not the
active pedagogical ingredient.
- **Magnitude:** Large for playtime in games; small/unstable for learning in
MAs.
- **Horizon:** Novelty (weeks) then either job-like grind or exit. Post-season
reset.
- **External validity:** Tokens decouple progress-feeling from capability unless
the token is *only* issued by the mastery clock.
- **Counterevidence:** Crowding-out; farming; post-reward reset.
- **Goodhart:** **The definition of the problem.**
- **Ethics:** Moderate–high.
- **Application:** The only “XP” that exists is evidence on the mastery clock.
Cosmetic collections if users want them, uncoupled from unlocking *content they

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 28 of 46

need to learn*. No pay-to-progress.
- **Backfire:** Entire motivational system pointed at the token.
- **Test:** Mastery-clock-only progress vs XP-for-any-action; 8-week delayed
test and farming.
- **Primary:** Delayed test.
- **Secondary:** Sessions.
- **Guardrail:** % of actions that are low-evidence.
- **Assessment:** Decoupled tokens: **probably counterproductive.** Masteryclock progress bars: **strong candidate** (see 4.29, 4.13). Battle pass of
*cosmetics*: **speculative** and likely distracting. Battle pass of
*curriculum*: just a syllabus with FOMO — **effective but dangerous.**
### 4.44 Session chaining / “just one more” / infinite feed
- **Domain:** HCI of infinite scroll; game “one more turn” (Civ); peak-end rule
(Kahneman).
- **Mechanism:** Remove stopping cues; open a new loop at the moment of closure;
people remember peaks and ends, so a good end increases return probability.
- **Target:** Session length, return.
- **Evidence:** **C** for infinite scroll and session length (attention-economy
products). Peak-end is **B** in experience-evaluation studies. Learning: longer
sessions can *mass* practice and cause fatigue, harming the next day’s
retrieval.
- **Magnitude:** Large for time-on-app in social media. Unknown for logic
quality.
- **Horizon:** That evening; possibly worse sleep.
- **External validity:** A 12-minute session with a clean end and a posed next
due item is enough. Infinite “one more problem” fights spacing and fatigue.
- **Counterevidence:** Fatigue, massing, regret, sleep.
- **Goodhart:** Time-in-app as success.
- **Ethics:** **High** if stopping cues are removed.
- **Application:** Default stop when today’s due set is done (goal-gradient
complete). Offer *one* optional extra only if it is a *spaced* item, not a
massed repeat. End on a competence peak (successful reconstruction), not a
failure (peak-end).
- **Backfire:** Fatigue; “I was on it for an hour and remember nothing.”
- **Test:** Hard stop at due-set vs “one more” vs infinite; delayed retention
per minute; sleep/regret.
- **Primary:** Delayed retention / minute.
- **Secondary:** Session length.
- **Guardrail:** Late-night use; next-day performance.
- **Assessment:** Infinite chain: **probably counterproductive.** Clean stop
after due set, good ending: **promising.**
### 4.45 Social proof, reciprocity, public commitment
- **Domain:** Cialdini; commitment research.
- **Mechanism:** Others’ behavior as a cue; public commitment raises the cost of
inconsistency; reciprocity creates obligation.
- **Target:** Initiation, persistence.
- **Evidence:** **B** in other domains (hotel towels, etc.). Education: public
commitment mixed; can become performance-avoidance.
- **Magnitude:** Medium for one-shot compliance; unclear for months of study.
- **Horizon:** Short unless the social structure is real.
- **External validity:** Fake “2,000 people learned this today” is a dark
pattern. A real study partner is relatedness (SDT) and is different.
- **Counterevidence:** Fake proof detected → trust collapse. Public commitment
can increase anxiety and cheating.
- **Goodhart:** Performative sharing.
- **Ethics:** High if fabricated; low if true relatedness.
- **Application:** Optional human relatedness; never fabricated counts.
Reciprocity: if you ever ask for notifications, give value first (the due item),

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 29 of 46

don’t extract first.
- **Backfire:** Creepy social, privacy.
- **Test:** True optional partner vs fabricated social proof vs none; trust and
continuation.
- **Primary:** 8-week learning.
- **Secondary:** Opt-in to social.
- **Guardrail:** Trust; privacy complaints.
- **Assessment:** Fabricated social proof: **effective but dangerous.** Real
optional relatedness: **promising**, not required for a v1.
### 4.46 Commitment devices / deposit contracts
- **Domain:** Behavioral economics (Ariely; stickK; gym deposits).
- **Mechanism:** Precommit to a penalty for non-performance, raising the cost of
lapse.
- **Target:** Persistence.
- **Evidence:** **B.** People will pay for constraints (Milkman bundling;
various deposit RCTs in exercise/savings). Effects often real and sometimes
large for the selected people who *choose* the device.
- **Magnitude:** Medium among self-selected committers; low take-up.
- **Horizon:** Contract length; relapse after.
- **External validity:** A subset of adult learners might stake money on “3
valid sessions/week.” Most will not. Penalty for *learning quality* is
unworkable (you cannot fairly judge).
- **Counterevidence:** Low take-up; inequity; people commit to the wrong metric.
- **Goodhart:** Commit to opens, then farm.
- **Ethics:** **High** if the company collects the forfeit.
- **Application:** Optional, user-chosen, forfeit to a charity, metric = valid
retrieval days. Never default-on.
- **Backfire:** Aversive association; dropout from the contract and the app.
- **Test:** Offer-only experiment; take-up, valid days, learning among takers vs
similar non-takers (selection!).
- **Primary:** Delayed learning among takers.
- **Secondary:** Take-up.
- **Guardrail:** Financial stress; metric farming.
- **Assessment:** **Context-dependent**; **promising** for a minority; do not
build the product around it.
### 4.47 Adaptive difficulty / flow / challenge–skill matching
- **Domain:** Flow theory (Csikszentmihalyi); ITS adaptivity; Vygotsky ZPD.
- **Mechanism:** Match challenge to skill: too easy = boredom/farming; too hard
= anxiety/quit.
- **Target:** Persistence, efficient learning.
- **Evidence:** **B** that extreme mismatch is bad. **C** that “flow state” is a
useful product construct — flow research in education is messy, self-report
heavy. Assistance dilemma is the operational version.
- **Magnitude:** Calibrated ~70–85% success is a common tutoring heuristic, not
a law.
- **Horizon:** Session to course.
- **External validity:** High. The previous evaluation-integrity failure *was*
users choosing easier evidence. Adaptivity that lets users opt into easy is the
bug.
- **Counterevidence:** User-chosen difficulty ≠ optimal. Flow can be achieved on
farmable tasks (games).
- **Goodhart:** Keep success rate high by lowering difficulty.
- **Ethics:** Low.
- **Application:** System-chosen difficulty on the mastery clock; user can
choose *among items at that difficulty*, not the difficulty itself.
- **Backfire:** “The app is unfair”; felt incoherence if adaptivity jumps
topics.
- **Test:** User-chosen difficulty vs system-chosen targeting 75% unaided;

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 30 of 46

farming and delayed learning.
- **Primary:** Delayed learning.
- **Secondary:** Session affect.
- **Guardrail:** Mean difficulty; success rate inflation.
- **Assessment:** **Strong candidate** as system-chosen difficulty. Flow-asaesthetic: **insufficient evidence.**
### 4.48 Personalization of schedule and content (beyond BKT)
- **Domain:** Adaptive learning industry; SRS (FSRS/SM-2); notification bandits.
- **Mechanism:** Fit timing and item choice to the user.
- **Evidence:** **B** for *item scheduling* from spacing science (the model can
be simple and still beat massing). **C** for rich ML personalization of
*curriculum* — many products, few transparent learning RCTs. Duolingo
notification bandit: small DAU effects. Adaptive educational games SLR (2020):
only ~10 relevant papers, poor reporting.
- **Magnitude:** Spacing vs massing is large. Extra personalization beyond a
decent lag model: often small.
- **Horizon:** Ongoing.
- **External validity:** Do not wait for a deep model. A Cepeda-ratio scheduler
plus a KC list is enough to test.
- **Counterevidence:** Incoherent curriculum; privacy; overfitting to gaming.
- **Goodhart:** Model learns that the user “knows” items they hinted through.
- **Ethics:** Moderate (data).
- **Application:** Personalize *when* to retrieve a KC. Do not personalize away
from interleaving of confusable KCs. Do not personalize notifications more than
user-chosen time until the simple version is proven.
- **Backfire:** Creepy; jumpy sequence.
- **Test:** Fixed syllabus with spaced reviews vs SM-2-like vs fancy model; 30day retention per minute. Fancy must beat simple by enough to justify
complexity.
- **Primary:** Retention / minute.
- **Secondary:** Queue completion.
- **Guardrail:** Curriculum incoherence ratings; gaming-inflated parameters.
- **Assessment:** Spacing personalization: **strong candidate.** Deep
everything-personalization: **speculative**, easy to overfit.
### 4.49 Growth mindset interventions
- **Domain:** Dweck; contested.
- **Mechanism:** Belief that ability can grow increases challenge-seeking.
- **Evidence:** **A.** Sisk et al. 2018: overall intervention *d* ≈ 0.08;
correlational *r* ≈ .10. National Study of Learning Mindsets: pre-registered
benefits concentrated in lower-achieving students. Macnamara & Burgoyne 2023 vs
Yeager commentaries: heterogeneity is the story.
- **Magnitude:** Very small on average; possibly worthwhile at population scale
in schools; not a product differentiator.
- **Horizon:** Grades over a year in school RCTs.
- **External validity:** Adult hobbyist logicians are not the NSLM population.
- **Counterevidence:** Failed replications of praise studies; author-incentive
concerns in some MAs.
- **Goodhart:** Mindset posters while farming easy items.
- **Ethics:** Low.
- **Application:** Do not build a mindset module. Do not praise “effort” for
hinted solutions. If anything, borrow the *narrow* idea: interpret struggle as
normal, which identity-based motivation also says.
- **Backfire:** Empty pep.
- **Test:** Not in the first experimental tranche.
- **Primary:** n/a
- **Secondary:** n/a
- **Guardrail:** n/a
- **Assessment:** **Insufficient evidence** of product-relevant effects;

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 31 of 46

**probably counterproductive** as a featured intervention (opportunity cost).
### 4.50 Microlearning / bite-size lessons as such
- **Domain:** Corporate L&D; mobile learning marketing.
- **Mechanism:** Claimed: small chunks fit phones and busy lives.
- **Evidence:** **D/C.** The causal literature is thin and confounded with
spacing, retrieval, and time-on-task. Bite-size can *help* if it implements
spacing and retrieval; it *hurts* if it fragments high-element-interactivity
content below the grain needed to form a schema (CLT).
- **Magnitude:** Unknown as an isolated factor.
- **Horizon:** Marketing cycle.
- **External validity:** A 90-second “lesson” cannot hold a derivation of any
interest. A 12-minute retrieval set can.
- **Counterevidence:** Element interactivity; expertise needs whole procedures.
- **Goodhart:** Complete 50 micro-lessons, none of which is a proof.
- **Ethics:** Low.
- **Application:** Size sessions to the *schema grain*, not to a dopaminefriendly timer. Phone can still deliver a 12-minute block.
- **Backfire:** Fragmentation.
- **Test:** 4×3 min vs 1×12 min with same items and spacing; delayed
reconstruction of multi-step items.
- **Primary:** Multi-step delayed reconstruction.
- **Secondary:** Completion.
- **Guardrail:** Fragmented-item success vs whole-proof success.
- **Assessment:** **Context-dependent.** As a slogan: **insufficient evidence.**
As “short sessions that still contain a whole reasoning unit”: **promising.**
--## 5. Strongest candidates for Externalize
Ranked by expected *learning* value × engagement value × evidence × measurement
integrity ÷ (implementation cost × risk). This is a research ranking, not a
roadmap.
| Rank | Mechanism | Why it wins here |
|---|---|---|
| 1 | Retrieval-first sessions + successive relearning on a KC model | Strongest
learning evidence; defines the mastery clock |
| 2 | Optimal-lag scheduling (even a crude Cepeda-ratio / SM-2) | Strongest
*when* evidence; fights daily massing |
| 3 | Structured self-explanation / intermediate-state objects, with fading |
The product doctrine, evidence-backed, must fade |
| 4 | Worked examples → faded generation of the next step | Novice on-ramp for
high-load material |
| 5 | Interleaving of confusable rules after a short blocked intro |
Transfer/discrimination; logic-native |
| 6 | System-chosen difficulty; user chooses among items *at* that difficulty |
Prevents the known easy-evidence failure |
| 7 | Implementation intentions on a stable personal cue | Best evidence for
*initiation* without casino mechanics |
| 8 | Default home screen = next due unaided reconstruction | Friction on the
right act |
| 9 | Lapse recovery that preserves mastery and asks for one valid item |
Brief’s own highest-risk engagement failure mode |
| 10 | Progress visualization tied only to delayed unaided evidence | Goalgradient without fake mastery |
| 11 | Hint policy: conceptual first, bottom-out blocks certification |
Assistance dilemma + Baker |
| 12 | Representational variability as a *test* of mastery | Transfer; antiinterface-pattern |

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 32 of 46

| 13 | Informational, user-timed reminders at the forgetting edge |
Notifications without guilt-owl |
| 14 | Contrastive feedback on errors (especially high-confidence) |
Hypercorrection + tutoring |
| 15 | Finite daily due-set with a clean stop | Goal-gradient without infinite
scroll |
If only three things are experimentally developed in a validation period: **(1)
mastery-clock evidence rules, (2) retrieval-first due list with lag scheduling,
(3) lapse recovery that does not shame.** Everything else is secondary.
--## 6. Effective-but-dangerous mechanisms
These *work* on behavior. They are not folklore. They should be in the design
conversation because they will be proposed, and because some have a narrow
aligned use.
| Mechanism | What it effectively does | Why it is dangerous here | Narrow
aligned remnant |
|---|---|---|---|
| Streaks as loss aversion | Daily return | Farming; post-lapse churn; guilt;
sleep | Count only valid retrievals; freeze as earned slack; recovery UI |
| Variable-ratio cosmetics | Compulsive continuation | Extinction-resistant
junk; calibration as luck | None. Use interleaving instead |
| Near-miss animation | Desire to continue after loss | Illusion of control;
negative affect | Contrastive *informational* nearness |
| Hearts/energy | Session cap; caution; monetization | Punishes the learning
event (error+feedback) | Cap by time/fatigue, not errors |
| Fake scarcity / countdowns | Immediate open | Cramming; distrust | True
forgetting-edge only |
| XP / leagues / battle pass | Playtime, novelty | Goodhart, crowding-out, postseason collapse | Mastery-clock bar only |
| Dark-pattern defaults (nagging permission, confirm-shaming) | Compliance
(Luguri large effects) | Disproportionate harm; trust; autonomy | Defaults that
select the *due item*, fully visible |
| Forced interruption (energy out mid-item) | Ovsiankina resumption +
monetization | Manipulation; incomplete schemas | User-owned next-step card |
| Endowed *mastery* | Completion of onboarding | Measurement fraud | Endow setup
tasks only |
| Notifications with guilt and variable copy | DAU | Cue dependence, annoyance,
11:30 pm junk | User-timed informational |
| Social proof fabrication | Conversion | Trust | Real optional relatedness |
| Commitment deposits collected by the firm | Persistence among takers |
Extractive; wrong metric | Optional charity forfeit |
**Finding.** The ethically uncomfortable mechanism with the *best* claim to
alignment is **loss aversion pointed at a valid-retrieval streak**, plus
**earned slack**, plus **non-shaming recovery**. It is still dangerous. It is
not as dangerous as VR loot, hearts, or fake scarcity. The ethically
uncomfortable mechanism with the *worst* claim to alignment is **near-miss +
variable ratio**, because its power is the *decoupling* of outcome from skill —
the opposite of calibration.
--## 7. Popular ideas with weak, contradictory, or oversold evidence
- **Zeigarnik effect as a memory booster.** 2025 meta-analysis: no general
effect. Use Ovsiankina/resumption, or just write a next-step note.
- **Expanding-interval superiority (classic SuperMemo story).** Karpicke &

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 33 of 46

Roediger 2007: expanding helps short-term, equal/delayed-first helps long-term.
FSRS/SM-2 may still be decent *engineering*, but the theory pitch is oversold.
- **Overlearning as a featured strategy.** Inefficient given planned relearning.
- **Gamification (PBL) as such.** Sailer effects heterogeneous; motivational arm
unstable; Duolingo misuse; Wouters: games can teach without being more
motivating.
- **Duolingo as proof that streaks teach language, hence they will teach
logic.** Efficacy studies are not RCTs; qualitative data show metric gaming;
language recognition ≠ proof construction.
- **21-day habits.** False. Lally median 66 days, simple behaviors, huge
variance.
- **Growth mindset modules.** Average *d* ≈ 0.08.
- **Learning styles.** Pashler et al. 2008: no adequate evidence.
- **Grit as a lever.** Largely conscientiousness (Credé et al. 2017); not a
product feature.
- **Flow as a design target.** Vague self-report construct; easy to fake with
farmable tasks.
- **Intelligent notification ML as a must.** Morrison 2017: intelligent timing
did not beat daily; Duolingo bandit effects are small DAU. User-chosen time
first.
- **Productive failure as a daily mobile mechanic.** Fidelity requirements and
session length make this a rare event, not a loop.
- **Leaderboards of learning.** They become leaderboards of the proxy.
- **Bite-size microlearning as a scientific result.** Usually a packaging claim.
CLT can go the other way.
- **“Make it more fun with points.”** Crowding-out + Goodhart. Fun that is *in
the problem* (curiosity about the sequent) is different and is already covered
by information-gap.
- **Immediate feedback always.** Not what the lab delay-retention literature
says; also not “delay everything.” Split step-validity from delayed explanation.
- **Personalization as a slogan.** Spacing yes; deep ML curriculum no, until
simple loses.
--## 8. Cross-mechanism interactions and conflicts
### Reinforcing combinations (learning-aligned)
- **Cue (4.31) + if–then (4.19) + default due item (4.37) + retrieval (4.1) +
lag (4.2) + successive relearning (4.3).** This is the spine.
- **Worked example (4.5) + structured self-explanation (4.6) + fade (4.15) +
generate next step (4.7).** Novice on-ramp.
- **Interleaving (4.4) + delayed mixed tests (4.18).** Discrimination +
transfer.
- **System difficulty (4.47) + mastery evidence delay (4.13) + hint
certification penalty (4.14).** Anti-farming.
- **Finite due-set gradient (4.29) + clean stop (4.44) + informational
forgetting-edge reminder (4.32/4.41 true).** Return without infinite scroll.
- **High-confidence error (4.11) + contrastive feedback (4.39 remnant) + later
relearning (4.3).** Error as gold.
### Conflicts (do not stack blindly)
| Conflict | What happens |
|---|---|
| Daily streaks vs optimal item lag | Users restudy today’s item to save the
flame; massing |
| XP-for-completion vs retrieval | Users avoid retrieval-first because it
threatens completion |
| Hearts vs errorful learning | Users hint-out or skip hard KCs (Baker harmful
gaming) |

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 34 of 46

| Variable rewards vs calibration | Learners treat correctness as luck |
| Endowed mastery vs evaluation integrity | Repeats the project’s known failure
|
| Infinite “one more” vs spacing and fatigue | Massed evening session, weak
next-day retrieval |
| Notifications vs context habits | Reminder dependence; habit never attaches to
the world |
| Autonomy (SDT) vs controlling streaks/guilt | Short-run compliance, long-run
avoidance |
| Productive failure vs mobile session length | Insufficient time for the
instruction phase |
| Interleaving vs novice worked examples | Mix too early → load explosion |
| Never-fade externalization vs expertise reversal | Advanced users experience
redundant load and control |
| Leaderboards vs relatedness | Social comparison kills optional community |
| Fresh-start “wait until Monday” vs due reviews | Memory model ignored |
| Tiny habits vs schema grain | Behavior shrinks below a learnable unit |
| Goal-gradient on cosmetics vs mastery clock | Two clocks; users pick the easy
clock |
### Novelty and decay
Expect **weeks-scale novelty** for any new token, league, or animation
(gamification MAs often short-duration). Expect **decay** for temptation
bundling, notification copy, and fresh-start spikes. Expect **habitization of
initiation** on a 2–3 month scale *if* the cue is stable — not habitization of
proving. Expect **post-reward reset** after any finite pass. Design for the
decay, or do not introduce the mechanic.
### Expertise-contingent switching
| Stage | Lean on | Fade |
|---|---|---|
| Novice | Worked examples, principle prompts, blocked intro, more immediate
step feedback, lower interleaving | Pure generation, mixed tests as the only
diet |
| Intermediate | Interleaving, retrieval-first, delayed JOLs, successive
relearning | Constant examples, heavy hints |
| Advanced | Unaided mode, representational variability, transfer items, userauthored goals | Mandatory intermediate-state forms, daily baby items |
### Motivational interventions that undermine desirable difficulty
Any mechanic that makes *feeling successful now* the reinforcer (XP, hearts
remaining, league rank, streak-at-risk junk session) will be in a zero-sum fight
with retrieval, interleaving, and delayed tests, which make *feeling
unsuccessful now* the learning signal. **Finding:** you cannot maximize both
same-session fluency and delayed learning. The product must pick delayed
learning and then use engagement tools only to get the user to show up for the
unpleasant-effective thing.
--## 9. Goodhart / measurement-integrity analysis
### 9.1 The rational-learner question
For every metric *M* that Externalize rewards, ask what policy a rational, timepoor user follows. The project already observed one policy: **choose easier
evidence**. That is not a moral failure. It is the correct response to a scoring
rule.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 35 of 46

| If you reward… | Rational policy | Learning effect |
|---|---|---|
| Opens | Open and leave | None |
| Minutes | Leave the app running; slow tapping | Negative (time without
retrieval) |
| Item completions | Easiest items, templates | Negative (Baker-like) |
| Accuracy | Avoid hard KCs; overuse hints | Negative on the items that matter |
| Streak days | Minimum qualifying action | Depends entirely on the qualifier |
| XP | Highest XP/minute (leagues) | Negative (Hadi Mogavi et al.) |
| Hint-free same-session mastery | Same-session grind, then forget | Weak
delayed retention |
| Delayed unaided reconstruction of varied items | Practice that actually
transfers | Positive, if the user stays |
**Finding.** The only scoring rule that is approximately incentive-compatible
with mastery is: **credit that expires unless refreshed by delayed, unaided,
format-varied success, with hinted successes ineligible.**
That rule is harder to love. It is the job.
### 9.2 Known gaming patterns (map onto Externalize)
From ITS (Baker, Aleven, Murray & VanLehn) and Duolingo (Hadi Mogavi et al.):
1. Rapid hint chain to bottom-out.
2. Systematic guessing (especially if multiple choice).
3. Intentional fast errors to unlock delayed help.
4. Re-doing a known easy item (Mostow story re-reading analog).
5. Interface-pattern memory (click the same region).
6. Streak-preserving micro-sessions.
7. League racing before the weekly reset.
8. Inflating confidence or deflating it if either is rewarded.
9. Explore-mode activity submitted as graded evidence.
10. Choosing the easier of two “or” paths for a capability (the project’s prior
bug).
### 9.3 Detection without becoming adversarial
Baker’s result: **other off-task behavior did not predict poor learning; gaming
did.** So do not punish pauses, slowness, or exploration. Punish (or, better,
*decertify*) patterns that exploit the *scoring rule*.
Practical detectors (research-grade, not a police state):
- Hint depth × time-to-hint on low-P(known) steps (harmful gaming).
- Item selection entropy: if the user can choose, do they only pick high-success
KCs?
- Template overlap of justifications.
- Session duration < some seconds with streak credit requested.
- Accuracy conditioned on hint-free, delay > 24 h, and withheld format.
Response: **this attempt does not move the mastery clock.** It can still move a
private “practice” log. Scooter-the-tutor style extra practice on the gamed step
helped learning in Baker 2006 — but some students then gamed *to get* the
extras. So extras should be less fun than doing it right, or simply required for
certification without being a prize.
### 9.4 Two clocks, restated as measurement
- **Practice log:** everything the user does. Useful for coaching. Not a grade.
- **Capability state:** posterior over KCs updated primarily by delayed,
unaided, hint-free, format-varied items. Shown to the user as the progress that

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 36 of 46

“counts.”
If the UI shows one number, show the capability state. If it shows two, the user
will optimize the easier. **Assumption to test:** adults who downloaded a logic
app will tolerate an honest, slower progress bar. **Open question:** they might
not; then the product has a market problem, not a measurement problem, and
lowering the bar would repeat the integrity failure.
--## 10. Proposed learning-aligned engagement loop
This is a **recommendation** for experimental design, not a ship spec.
```
[Stable life cue]
→ [If–then: open Externalize]
→ [Home is the next due KC at forgetting edge]
→ [Unaided reconstruction of intermediate state]
→ [Immediate step validity; no hearts]
→ [If fail: contrastive feedback; item remains ineligible
for mastery]
→ [If succeed unaided and delayed: update capability]
→ [Short mixed set: interleaved confusable rules]
→ [Stop when due set done; optional next-step card]
→ [Capability bar moves only on the mastery clock]
→ [If miss a day: recovery = one valid due item; no tombstone]
→ [As capability rises: fade required externalization]
→ [Occasional withheld-format transfer item]
→ [Independence: user can pass a paper-like unaided set; app use can
decline]
```
The last arrow is a success criterion. A loop that cannot end in reduced
dependence is an engagement product, not a learning product.
Session shape (hypothesis): 10–20 minutes, schema-grain intact, retrieval-heavy,
one clean ending. Phone is acceptable if the justification object is structured
(taps, not essays). If reconstruction quality is worse on phone than on a large
surface, **that is a finding that should change the mobile-first assumption**,
not a UI bug to paper over.
--## 11. Externalize-specific implementation concepts
Each concept is a testable object, not an invariant.
### 11.1 Due reconstruction (forgetting-edge retrieval)
- **Target:** Return triggers useful retrieval.
- **Causal idea:** Spacing + testing.
- **Corruption:** Swiping through; using last session’s screenshot.
- **Failure:** Queue from hell; too-hard first item after lapse.
- **Ethics:** Low.
- **Experiment:** Randomize lag; 30-day retention.
- **Primary:** Delayed reconstruction.
- **Secondary:** Due-item completion.
- **Guardrail:** Skip/hint rate on due items.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 37 of 46

### 11.2 Certification window
- **Target:** Valid mastery evidence.
- **Causal idea:** Delayed test; successive relearning.
- **Corruption:** Cram at the window; hinted attempts.
- **Failure:** Users never certify; feel stuck.
- **Ethics:** Low if transparent.
- **Experiment:** Same-session vs 48h certification.
- **Primary:** 14-day transfer.
- **Secondary:** Certification rate.
- **Guardrail:** Time-to-first-certify; rage.
### 11.3 Justification object (the doctrine, operationalized)
- **Target:** Externalize intermediate state in a gradeable way.
- **Causal idea:** Self-explanation + step-based ITS.
- **Corruption:** Templates; copied graphs.
- **Failure:** Mobile input hell.
- **Ethics:** Low.
- **Experiment:** Structured object vs answer-only vs free text.
- **Primary:** Transfer; later unaided.
- **Secondary:** Time/item.
- **Guardrail:** Template entropy.
### 11.4 Fade slider the user does not own
- **Target:** Independence.
- **Causal idea:** Expertise reversal.
- **Corruption:** Users find a way to re-enable full scaffold for certification
items.
- **Failure:** Fade too fast.
- **Ethics:** Low.
- **Experiment:** Yoked fade vs never vs user-controlled.
- **Primary:** Unaided delayed.
- **Secondary:** Perceived autonomy.
- **Guardrail:** Post-fade error spikes.
### 11.5 Valid-day (if a streak exists)
- **Target:** Daily initiation of *useful* work.
- **Causal idea:** Loss aversion aligned to retrieval.
- **Corruption:** Easiest due item; freeze abuse.
- **Failure:** Churn at first miss.
- **Ethics:** High.
- **Experiment:** See 4.33 test.
- **Primary:** Delayed capability.
- **Secondary:** Valid days.
- **Guardrail:** Seconds/valid-day; post-miss churn.
### 11.6 Recovery card
- **Target:** Post-lapse return.
- **Causal idea:** Fresh start + one mastery experience + Lally “one miss is
OK.”
- **Corruption:** Recovery items too easy.
- **Failure:** Users ignore cards.
- **Ethics:** Low if non-shaming.
- **Experiment:** See 4.35.
- **Primary:** Valid item within 72h of lapse.
- **Secondary:** Reopen.
- **Guardrail:** Difficulty of recovery items.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 38 of 46

### 11.7 Contrastive miss
- **Target:** Error correction without casino near-miss.
- **Causal idea:** Hypercorrection + worked-example contrast.
- **Corruption:** Generic “not quite.”
- **Failure:** Extra UI noise.
- **Ethics:** Low.
- **Experiment:** Contrastive vs generic feedback.
- **Primary:** Durable correction.
- **Secondary:** Continue rate.
- **Guardrail:** Time; confusion.
### 11.8 Withheld-format probe
- **Target:** Transfer; anti-interface learning.
- **Causal idea:** TAP; Hyperproof variability.
- **Corruption:** Users skip probes if optional; if required, they may churn.
- **Failure:** Feels like a different app.
- **Ethics:** Low.
- **Experiment:** 20% of certification items in withheld format.
- **Primary:** Withheld-format accuracy.
- **Secondary:** Certification completion.
- **Guardrail:** Churn at probes.
### 11.9 Cue onboarding (WOOP once)
- **Target:** Initiation habit.
- **Causal idea:** MCII + Lally context.
- **Corruption:** Fake cue (“whenever”).
- **Failure:** Feels like a worksheet.
- **Ethics:** Low.
- **Experiment:** WOOP vs reminder-only.
- **Primary:** Valid days in days 14–28 (after novelty).
- **Secondary:** Day-1–7 sessions.
- **Guardrail:** Uninstall at onboarding.
### 11.10 Explore sandbox that cannot certify
- **Target:** Preserve play/curiosity without polluting evidence.
- **Causal idea:** Project known (explore ≠ mastery) + SDT autonomy.
- **Corruption:** UI that still looks like progress.
- **Failure:** Nobody uses it, or everybody lives there to avoid tests.
- **Ethics:** Low.
- **Experiment:** Visual distinction + explicit “this will not count”; measure
contamination of capability estimates.
- **Primary:** Uncontaminated delayed test.
- **Secondary:** Explore use.
- **Guardrail:** Time in explore vs certify.
--## 12. Smallest credible experiments for the highest-value uncertainties
Order by expected information per participant-week. Prefer preregistration,
delayed tests, and guardrail metrics. N below is order-of-magnitude for a
*personal-use validation*, not a journal ITS RCT.
| ID | Uncertainty | Design | N / duration | Primary | Guardrail | Decision it
informs |
|---|---|---|---|---|---|---|
| E1 | Does retrieval-first beat recap-first *in this app*? | Within-user or A/B
session start | 40–80 users, 3 weeks + 7-day test | 7-day reconstruction | Quit

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 39 of 46

on first screen | Core loop |
| E2 | Same-session mastery vs delayed certification | Two evidence rules | 60+,
4 weeks + 14-day transfer | Transfer | Time-to-progress despair | Mastery model
|
| E3 | Any-open streak vs valid-retrieval streak vs none | Three-arm | 90+, 8
weeks | Delayed capability | Junk days; post-miss churn | Whether to touch
streaks |
| E4 | System vs user difficulty | Two-arm | 60+, 4 weeks | Delayed learning |
Mean difficulty | Repeat of integrity failure? |
| E5 | Structured justification vs answer-only | Two-arm | 50+, 3 weeks +
transfer | Transfer; later unaided | Time; mobile pain | Doctrine ROI |
| E6 | Blocked intro + interleave vs blocked-only | Two-arm | 50+, 2 weeks +
mixed test | Rule selection | Confusion quit | Practice mix |
| E7 | Cue-if–then vs guilt notification vs none | Three-arm | 90+, 4 weeks |
Valid days in week 4 | Mute/uninstall | Return system |
| E8 | Lapse recovery variants | Triggered when a miss happens | Eventrandomized | Valid item in 72h | Recovery-item easiness | Post-lapse |
| E9 | Fade vs never-fade scaffolds | Two-arm, intermediate users | 40
intermediates | Unaided delayed | Error spike | Expertise reversal |
| E10 | Phone vs larger surface for reconstruction | Within-user, same items |
30 who have both | Reconstruction quality | Time | Mobile-first assumption |
| E11 | Hint bottom-out vs conceptual-only vs delayed | Three-arm | 60+ |
Delayed KC; gaming rate | Frustration | Assistance |
| E12 | Does a crude lag scheduler beat daily restudy of yesterday? | Two-arm |
50+, 30-day test | 30-day retention | Queue abandonment | SRS investment |
**E3, E2, E4, and E10 are the experiments most likely to falsify inherited
product assumptions.** E10 is the one most likely to be skipped by a mobilefirst team and the one this investigation flags as independently important.
Do not run a loot-box or hearts experiment unless the goal is to *document harm*
for a decision memo. The expected value of “maybe hearts are fine” is low given
the errorful-learning conflict.
--## 13. Adversarial critique: the strongest case that these recommendations are
wrong
A serious opponent would say:
**1. Persistence is the binding constraint, and you are underweighting it.**
Voluntary adult use of a hard cognitive tutor will collapse without something
that feels as compelling as a streak or a league. Your two-clock system is
incentive-compatible and empty, because the room is empty. Duolingo’s learning
is mediocre *and* it created a daily practice habit at global scale; a purist
tutor that five people use for a year is a worse learning intervention in
aggregate. The RAND Cognitive Tutor result already showed that implementation
and showing-up dominate lab pedagogy. You cited it and then designed as if
pedagogy were the scarce resource.
**2. Desirable difficulties will simply make the product unpleasant.**
Soderstrom & Bjork tell researchers to ignore fluency; users are not
researchers. Interleaving, delayed tests, and unaided reconstruction will raise
dropout in week 1, and you will never observe the week-4 learning gain. The
Chen/Sweller high-load caveat is not a moderator to manage; it is a prediction
that *your core content plus your core methods will fail together on a phone*.
**3. Effect sizes that survive translation are small.** Sailer *g* ≈ 0.25–0.49,
Wouters *d* ≈ 0.29, field ITS ≈ 0.2 in year 2, notification +0.5% DAU, mindset
*d* = 0.08. You are proposing a complex two-clock architecture whose
*incremental* benefit over “a decent sequence of problems with answers” may be

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 40 of 46

smaller than the engineering cost, especially for a validation-period product
that should not expand features.
**4. Successive relearning evidence is the wrong grain.** Rawson’s *d* = 4 on
key-term definitions will not appear for multi-step logic. Time-to-criterion on
proofs will be so long that users never finish a session. You will recreate the
mastery-learning trap: slow learners imprisoned by a bar they cannot clear.
**5. Measurement purity is a product death spiral.** If hinted work cannot
certify, users will experience the app as stingy and unfair. Baker-style
detectors will feel adversarial. You will optimize integrity and lose the
relationship. Explore-vs-graded is theoretically clean and UX-hell.
**6. Crowding-out is overstated for this task.** Deci’s free-choice paradigm
used interesting puzzles in labs. People already do not find natural deduction
intrinsically delicious. Token rewards might *add* motivation to a low-interest
task rather than crowd out a high-interest one. The brief’s adult volunteer
population is mixed; some are puzzle people, many will not be.
**7. You romanticize autonomy.** Luguri-sized effects show that people can be
moved. If the ethical constraint is “the learner remains meaningfully
autonomous,” you have defined away a large part of the engagement toolbox the
brief asked you to take seriously. A paternalist could argue that a validretrieval streak *is* autonomy-compatible because the user installed the app to
learn, and you are helping them defeat their present bias. Your SDT caution is a
taste, not a finding.
**8. Hyperproof ATI cuts both ways.** Individual differences mean a single
doctrine (“always externalize”) is already wrong — including *your* faded
version, which is still one policy. The research program might need learner
types, which you called speculative when industry says “personalize.”
**9. Habitizing initiation is still unproven for aversive tasks.** Lally’s
participants chose *their own* easy health behaviors. “After coffee, reconstruct
a sequent” may never automaticize. If–then plans have smaller effects in some
health MAs than *d* = 0.65. You may be hanging the engagement clock on a hook
that will not hold.
**10. The two-clock story is still a story.** No consumer learning product has
published a clean RCT in which a mastery clock plus aligned streak beat a simple
daily lesson on *delayed transfer* at 8–12 weeks without catastrophic dropout.
Until E3+E2 exist, the synthesis is a hypothesis dressed as an architecture.
**What this investigation still holds after that critique.** Points 2, 3, 6, and
10 are the most serious. They do not license hearts, XP leagues, or fake
scarcity; they license *humility about complexity* and *ruthless experiment
E3/E2/E10*. They also license a simpler product: excellent worked examples,
retrieval, spacing, honest progress — and almost no behavioral machinery. **That
simpler product is a live alternative and may win.** The arsenal above is not an
argument for building all of it. It is an argument for knowing which pieces have
evidence if the simple product fails *because people do not return*.
--## 14. Open questions
1. Will adult volunteers tolerate retrieval-first, interleaved, delayedcertification logic practice without a grade or a teacher?
2. Does externalizing intermediate state transfer to unaided paper,
conversation, or novel formalisms, or only to Externalize’s UI?
3. What is the element-interactivity threshold at which testing/generation
reverse for *this* curriculum on *this* device?

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 41 of 46

4. Phone vs larger surface: is mobile-first compatible with the doctrine?
5. What KC grain (rule, schema, proof-pattern) makes successive relearning
tractable?
6. Can a valid-retrieval streak survive first lapses without becoming fictional
(freeze) or cruel (tombstone)?
7. Does any notification policy beat a user-chosen alarm the user already has?
8. Hint policy: can decertification of hinted items be made fair for legitimate
strugglers?
9. How much representational variability is needed to defeat interface-pattern
learning?
10. For whom (ATI) does Hyperproof-like graphical vs sentential vs hybrid help?
11. Is curiosity about *sequents* enough intrinsic reward to make tokens
unnecessary (SDT vs crowding-out for this task)?
12. What session length maximizes delayed learning per minute without harming
return?
13. After capability is high, will users actually leave (success) or will the
engagement clock keep them in a farm?
14. Can capability displays be understood and trusted, or do they become a new
gameable object?
15. What is the minimum viable social relatedness, if any, that helps
persistence without leagues?
16. How do weekend/travel context shifts break initiation habits, and what
recovery works?
17. Are high-confidence errors in *proof steps* hypercorrected like trivia, or
is the latent-knowledge story false for procedures?
18. Does pretesting a sequent help or merely annoy?
19. Will structured self-explanation on mobile be too slow to survive contact
with users?
20. Is the simpler product (no streaks, no XP, great pedagogy) better in a 12week delayed-transfer bake-off? **This is the question the rest of the list
exists to answer.**
--## 15. Bibliography (selected; primary and high-quality secondary)
Learning and memory
- Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use
of tests: A meta-analysis of practice testing. *Review of Educational Research*.
https://doi.org/10.3102/0034654316689306
- Bahrick, H. P. (1979). Maintenance of knowledge: Questions about memory we
forgot to ask. *Journal of Experimental Psychology: General*.
- Bertsch, S., Pesta, B. J., Wiscott, R., & McDaniel, M. A. (2007). The
generation effect: A meta-analytic review. *Memory & Cognition*.
https://doi.org/10.3758/BF03193441
- Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing
self-explanation: A meta-analysis. *Educational Psychology Review*.
https://doi.org/10.1007/s10648-018-9434-x
- Brunmair, M., & Richter, T. (2019). Similarity matters: A meta-analysis of
interleaved learning. *Psychological Bulletin*.
https://doi.org/10.1037/bul0000209
- Butterfield, B., & Metcalfe, J. (2001). Errors committed with high confidence
are hypercorrected. *JEP: LMC*. https://doi.org/10.1037/0278-7393.27.6.1491
- Butterfield, B., & Metcalfe, J. (2006). The correction of errors committed
with high confidence. *Metacognition and Learning*.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006).
Distributed practice in verbal recall tasks: A review and quantitative
synthesis. *Psychological Bulletin, 132*(3), 354–380.
https://doi.org/10.1037/0033-2909.132.3.354
- Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008).
Spacing effects in learning: A temporal ridgeline of optimal retention.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 42 of 46

*Psychological Science*. https://doi.org/10.1111/j.1467-9280.2008.02209.x
- Cepeda, N. J., Coburn, N., Rohrer, D., Wixted, J. T., Mozer, M. C., & Pashler,
H. (2009). Optimizing distributed practice. *Experimental Psychology*.
- Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989).
Self-explanations: How students study and use examples in learning to solve
problems. *Cognitive Science, 13*, 145–182.
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T.
(2013). Improving students’ learning with effective learning techniques.
*Psychological Science in the Public Interest*.
https://doi.org/10.1177/1529100612453266
- Karpicke, J. D., & Roediger, H. L. (2007). Expanding retrieval practice
promotes short-term retention, but equally spaced retrieval enhances long-term
retention. *JEP: LMC, 33*, 704–719. https://doi.org/10.1037/0278-7393.33.4.704
- Kornell, N., Hays, M. J., & Bjork, R. A. (2009). Unsuccessful retrieval
attempts enhance subsequent learning. *JEP: LMC*.
- Kulik, J. A., & Kulik, C.-L. C. (1988). Timing of feedback and verbal
learning. *Review of Educational Research*.
https://doi.org/10.3102/00346543058001079
- Nelson, T. O., & Dunlosky, J. (1991). When people’s judgments of learning are
extremely accurate: The delayed-JOL effect. *Psychological Science*.
- Rawson, K. A., & Dunlosky, J. (2011). Optimizing schedules of retrieval
practice for durable and efficient learning. *JEP: General, 140*, 283–302.
https://doi.org/10.1037/a0023956
- Rawson, K. A., & Dunlosky, J. (2022). Successive relearning: An underexplored
but potent technique. *Current Directions in Psychological Science*.
https://doi.org/10.1177/09637214221100484
- Rawson, K. A., Vaughn, K. E., Walsh, M., & Dunlosky, J. (2018). Investigating
and explaining the effects of successive relearning on long-term retention. (See
also related *JEP: Applied* / *Journal of Educational Psychology* successiverelearning reports, e.g. benefits on multiple outcomes,
https://doi.org/10.1037/edu0000693)
- Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect.
*JEP: Applied*.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning.
*Psychological Science*.
- Rohrer, D., Dedrick, R. F., & Stershic, S. (2015). Interleaved practice
improves mathematics learning. *Journal of Educational Psychology*.
- Rohrer, D., Dedrick, R. F., Hartwig, M. K., & Cheung, C.-N. (2020). A
randomized controlled trial of interleaved mathematics practice. *Journal of
Educational Psychology*.
- Rowland, C. A. (2014). The effect of testing versus restudy on retention: A
meta-analytic review of the testing effect. *Psychological Bulletin, 140*, 1432–
1463. https://doi.org/10.1037/a0037559
- Soderstrom, N. C., & Bjork, R. A. (2015). Learning versus performance.
*Perspectives on Psychological Science*.
- Taylor, K., & Rohrer, D. (2010). The effects of interleaved practice. *Applied
Cognitive Psychology*. https://doi.org/10.1002/acp.1598
Cognitive load, examples, expertise, failure
- Atkinson, R. K., Renkl, A., & Merrill, M. M. (2003). Transitioning from
studying examples to solving problems: Effects of self-explanation prompts and
fading. *Journal of Educational Psychology, 95*, 774–783.
https://doi.org/10.1037/0022-0663.95.4.774
- Chen, O., Castro-Alonso, J. C., Paas, F., & Sweller, J. (2018). Undesirable
difficulty effects in the learning of high-element interactivity materials.
*Frontiers in Psychology*. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6099118/
- Kapur, M. (2014). Productive failure in learning math. *Cognitive Science*.
https://doi.org/10.1111/cogs.12107
- Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise
reversal effect. *Educational Psychologist*.
- Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). Why minimal guidance

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 43 of 46

during instruction does not work. *Educational Psychologist*.
- Sweller, J., & Cooper, G. A. (1985). The use of worked examples as a
substitute for problem solving in learning algebra. *Cognition and Instruction*.
- Tetzlaff, L., et al. (2025). A cornerstone of adaptivity: A meta-analysis of
the expertise reversal effect. *Learning and Instruction*.
- van Gog, T., & Sweller, J. (2015). Not new, but nearly forgotten: The testing
effect decreases or even disappears as the complexity of learning materials
increases. *Educational Psychology Review*.
ITS, mastery, gaming the system, assistance
- Aleven, V., & Koedinger, K. R. (2000/2002). Help seeking and hint abuse in
Cognitive Tutors. (Various ITS proceedings / *Cognitive Science* help-seeking
papers.)
- Baker, R. S., Corbett, A. T., Koedinger, K. R., & Wagner, A. Z. (2004). Offtask behavior in the Cognitive Tutor classroom. (And Baker, Corbett & Koedinger,
ITS 2004: detecting misuse.)
https://pact.cs.cmu.edu/koedinger/pubs/Baker,%20Corbett,%20Koedinger%20ITS04.pdf
- Baker, R. S. J. d., et al. (2006). Adapting to when students game an
intelligent tutoring system. *ITS 2006*. Best paper.
https://learninganalytics.upenn.edu/ryanbaker/Baker175.pdf
- Corbett, A. T., & Anderson, J. R. (1995). Knowledge tracing. *User Modeling
and User-Adapted Interaction*. https://doi.org/10.1007/BF01099821
- Koedinger, K. R., & Aleven, V. (2007). Exploring the assistance dilemma in
experiments with Cognitive Tutors. *Educational Psychology Review*.
- Kulik, C.-L. C., Kulik, J. A., & Bangert-Drowns, R. L. (1990). Effectiveness
of mastery learning programs: A meta-analysis. *Review of Educational Research,
60*, 265–299.
- Kulik, J. A., & Fletcher, J. D. (2016). Effectiveness of intelligent tutoring
systems: A meta-analytic review. *Review of Educational Research*.
https://doi.org/10.3102/0034654315581420
- Ma, W., Adesope, O. O., Nesbit, J. C., & Liu, Q. (2014). Intelligent tutoring
systems and learning outcomes: A meta-analysis. *Journal of Educational
Psychology*. https://doi.org/10.1037/a0037123
- Murray, R. C., & VanLehn, K. (2005). Effects of dissuading unnecessary help
requests while providing proactive help. *AIED / ITS* (intentional fast errors
to unlock delayed help).
- Pane, J. F., et al. (RAND). Cognitive Tutor Algebra I effectiveness trial.
https://www.rand.org/pubs/research_briefs/RB9746.html
- VanLehn, K. (2011). The relative effectiveness of human tutoring, intelligent
tutoring systems, and other tutoring systems. *Educational Psychologist, 46*,
197–221. https://doi.org/10.1080/00461520.2011.611369
- ASSISTments homework RCTs: IES/WWC study records, e.g.
https://www.ies.ed.gov/ncee/WWC/Study/94267
Logic education
- Barwise, J., & Etchemendy, J. (1994). *Hyperproof*. CSLI / Openproof project.
https://openproof.gradegrinder.net/heterogeneous.html
- Stenning, K., Cox, R., & Oberlander, J. (1995). Contrasting the cognitive
effects of graphical and sentential logic teaching. *Language and Cognitive
Processes*. https://doi.org/10.1080/01690969508407099
Motivation, goals, habits, intentions
- Dai, H., Milkman, K. L., & Riis, J. (2014). The fresh start effect.
*Management Science*. https://doi.org/10.1287/mnsc.2014.1901
- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of
experiments examining the effects of extrinsic rewards on intrinsic motivation.
*Psychological Bulletin*. https://selfdeterminationtheory.org/wpcontent/uploads/2014/04/1999_DeciKoestnerRyan_Meta.pdf
- Deci, E. L., Koestner, R., & Ryan, R. M. (2001). Extrinsic rewards and

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 44 of 46

intrinsic motivation in education: Reconsidered once again. *Educational
Psychologist*.
- Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal
achievement: A meta-analysis. *Advances in Experimental Social Psychology, 38*,
69–119.
- Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How
are habits formed: Modelling habit formation in the real world. *European
Journal of Social Psychology*. https://doi.org/10.1002/ejsp.674
- Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of
goal setting and task motivation. *American Psychologist, 57*, 705–717.
- Milkman, K. L., Minson, J. A., & Volpp, K. G. (2014). Holding the Hunger Games
hostage at the gym: An evaluation of temptation bundling. *Management Science*.
https://doi.org/10.1287/mnsc.2013.1784
- Multon, K. D., Brown, S. D., & Lent, R. W. (1991). Relation of self-efficacy
beliefs to academic outcomes: A meta-analytic investigation. *Journal of
Counseling Psychology*.
- Oettingen, G., & Gollwitzer, P. M. Work on mental contrasting and MCII/WOOP
(e.g., Oettingen, 2012/2014 syntheses).
- Oyserman, D., & Destin, M. (2010). Identity-based motivation. *The Counseling
Psychologist*.
- Wood, W., & Rünger, D. (2016). Psychology of habit. *Annual Review of
Psychology*. (Context-dependent habit account.)
Progress, loss, loyalty
- Kahneman, D., & Tversky, A. (1979). Prospect theory. *Econometrica*.
- Kivetz, R., Urminsky, O., & Zheng, Y. (2006). The goal-gradient hypothesis
resurrected. *Journal of Marketing Research, 43*, 39–58.
https://doi.org/10.1509/jmkr.43.1.39
- Nunes, J. C., & Drèze, X. (2006). The endowed progress effect. *Journal of
Consumer Research*.
Curiosity
- Kang, M. J., et al. (2009). The wick in the candle of learning: Epistemic
curiosity activates reward circuitry and enhances memory. *Psychological
Science*.
- Loewenstein, G. (1994). The psychology of curiosity: A review and
reinterpretation. *Psychological Bulletin*.
Gamification, games, language apps, notifications
- Hadi Mogavi, R., Guo, B., Zhang, Y., Haq, E.-U., Hui, P., & Ma, X. (2022).
When gamification spoils your learning: A qualitative case study of gamification
misuse in a language-learning app. *Proceedings of the Ninth ACM Conference on
Learning @ Scale (L@S ’22)*, 175–188. https://doi.org/10.1145/3491140.3528274 /
https://arxiv.org/abs/2203.16175
- Sailer, M., & Homner, L. (2020). The gamification of learning: A metaanalysis. *Educational Psychology Review*. https://doi.org/10.1007/s10648-01909498-w
- Vesselinov, R., & Grego, J. (2012). Duolingo effectiveness study. Industryfunded report. https://comparelanguageapps.com/reports/DuolingoReport_Final.pdf
- Wouters, P., van Nimwegen, C., van Oostendorp, H., & van der Spek, E. D.
(2013). A meta-analysis of the cognitive and motivational effects of serious
games. *Journal of Educational Psychology, 105*, 249–265.
https://doi.org/10.1037/a0031311
- Yancey, K., et al. (2020). A sleeping, recovering bandit algorithm for
optimizing recurring notifications. *KDD*.
https://research.duolingo.com/papers/yancey.kdd20.pdf
- Morrison, L. G., et al. (2017). Timing and frequency of push notifications.
*PLOS ONE*. https://doi.org/10.1371/journal.pone.0169162

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 45 of 46

Gambling, dark patterns, scarcity
- Clark, L., Lawrence, A. J., Astley-Jones, F., & Gray, N. (2009). Gambling
near-misses enhance motivation to gamble and recruit win-related brain
circuitry. *Neuron*. https://doi.org/10.1016/j.neuron.2009.04.035
- Luguri, J., & Strahilevitz, L. J. (2021). Shining a light on dark patterns.
*Journal of Legal Analysis*.
- Gray, C. M., et al. / Mathur et al. systematic reviews of dark-pattern user
experiments (2023). See Marshini Chetty group SLR:
https://www.marshini.net/_files/ugd/15c022_336085bdf00349be8fef4d7617600bcb.pdf
- Barton, B., Zlatevska, N., & Oppewal, H. (2022). Scarcity tactics in
marketing: A meta-analysis. *Journal of the Academy of Marketing Science* (as
cited in TMSM reviews).
Zeigarnik / Ovsiankina
- Ghibellini, R., & Meier, B. (2025). Interruption, recall and resumption: A
meta-analysis of the Zeigarnik and Ovsiankina effects. *Humanities and Social
Sciences Communications*. https://doi.org/10.1038/s41599-025-05000-w
- MacLeod, C. M. (2020). Zeigarnik and von Restorff: The memory effects and the
stories behind them. *Memory & Cognition*. (Historical/replication discussion.)
Mindset / styles (negative-control citations)
- Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning styles:
Concepts and evidence. *Psychological Science in the Public Interest*.
- Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L., & Macnamara, B. N.
(2018). To what extent and under which circumstances are growth mind-sets
important to academic achievement? Two meta-analyses. *Psychological Science*.
https://doi.org/10.1177/0956797617739704
- Credé, M., Tynan, M. C., & Harms, P. D. (2017). Much ado about grit: A metaanalytic synthesis. *Journal of Personality and Social Psychology*.
Transfer
- Barnett, S. M., & Ceci, S. J. (2002). When and where do we apply what we
learn? A taxonomy for far transfer. *Psychological Bulletin, 128*, 612–637.
https://doi.org/10.1037/0033-2909.128.4.612
--## Closing distinction
**Known:** Retrieval, spacing, successive relearning, worked-example fading, and
structured self-explanation have a different grade of evidence than streaks, XP,
and loot. Immediate fluency is not delayed learning. Gaming the measurement
system is documented in ITS and in Duolingo.
**Assumption used provisionally:** Adult users of Externalize want mastery more
than they want a flame, *if* progress is visible and fair.
**Finding:** The highest-value design is a two-clock system in which engagement
mechanics, if used at all, can only be satisfied by delayed unaided retrieval,
and in which scaffolding recedes. Casino mechanics that decouple payoff from
skill cannot be redirected without losing the property that made them effective.
**Open:** Whether anyone will show up for that system on a phone.
**Recommendation:** Run E2, E3, E4, and E10 before building a progression layer.
Consider the simpler product — excellent pedagogy, honest capability, cue-based
return, no tokens — as a first-class competitor to the full arsenal, not as a
straw man.

:

https://dpaste.com/789YD5VBP.txt

29/08/2026, 10 18
Page 46 of 46

