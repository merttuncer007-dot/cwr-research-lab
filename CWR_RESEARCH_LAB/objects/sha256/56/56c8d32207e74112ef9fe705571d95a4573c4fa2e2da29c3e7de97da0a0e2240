# COLD WAR RENAISSANCE — CW-002M
## Turakainen/Rote × phase coding × positive bistochastic shells
### Binary fixed positive doubly-stochastic undecidability from stationary-cutpoint PFAs
Date: 2026-08-22
Status: EXACT REDUCTION; GENERIC BINARY BISTOCHASTIC UNDECIDABILITY CLASSICAL, FIXED-TWO-MATRIX STRENGTHENING COLLISION OPEN

## 1. Why this wave exists

CW-002L showed that arbitrary bistochastic computation can be simulated by positive reversible microsteps, but the construction used a forced alternating clock.

The next goal was to reduce the generator count and separate two issues:

1. alphabet/generator compression;
2. reversibility of each microstep.

A collision search found that binary probabilistic automata with doubly-stochastic transition matrices are already classical through Turakainen-type constructions. A 2008 survey records undecidable strict/non-strict emptiness for a 25-state binary PFA with doubly-stochastic matrices.

Therefore:

\[
\boxed{
\text{binary + doubly-stochastic + undecidable}
}
\]

is not a novelty target.

However, Rote's 2025 fixed-system theorem gives six **fixed** positive doubly-stochastic \(7\times7\) matrices with only the starting distribution varying, while his binary fixed theorem is not stated to preserve double stochasticity.

This suggests a narrower question:

> Can the fixed six-matrix bistochastic system be compressed to **two fixed positive doubly-stochastic matrices**, still with only the initial distribution variable?

The answer is yes by a simple phase code.

---

# 2. Source problem

Let

\[
P_1,\ldots,P_k
\]

be rational \(n\times n\) doubly-stochastic matrices.

Let \(\pi\) be an initial row distribution and \(j\) a target state.

The source stationary cutpoint is

\[
\boxed{\lambda=\frac1n.}
\]

We ask whether there exists a source word

\[
v=i_1\cdots i_m
\]

such that

\[
(\pi P_v)_j>\frac1n.
\]

The same reduction preserves non-strict inequality.

---

# 3. Phase-coded binary simulator

Set

\[
N=k+1.
\]

Use phase states

\[
q\in\{0,1,\ldots,k\}.
\]

Phase \(0\) means "execute no source letter."

Each phase carries an inner state space consisting of two \(n\)-state copies:

- active copy;
- passive copy.

Thus inner dimension is

\[
d=2n,
\]

and total lifted dimension is

\[
\boxed{
D=Nd=2(k+1)n.
}
\]

Define block matrices

\[
Q_0=I_{2n},
\]

and for \(i=1,\ldots,k\),

\[
\boxed{
Q_i=
\begin{pmatrix}
P_i&0\\
0&I_n
\end{pmatrix}.
}
\]

Every \(Q_i\) is doubly stochastic.

---

# 4. Two binary generators

Let the binary alphabet be

\[
\{a,b\}.
\]

## Generator \(X\): phase advance

\(X\) cyclically advances phase:

\[
q\mapsto q+1\pmod N,
\]

and leaves the inner state unchanged.

In block form,

\[
X_{q,q+1}=I_{2n}
\]

with indices modulo \(N\).

Hence \(X\) is a permutation matrix and is doubly stochastic.

## Generator \(Y\): phase-conditioned execution

Let

\[
\boxed{
Y=
\operatorname{diag}(Q_0,Q_1,\ldots,Q_k).
}
\]

Thus \(b\) executes:

- identity at phase \(0\);
- source letter \(P_i\) on the active copy at phase \(i\);
- identity on the passive copy in every phase.

\(Y\) is also doubly stochastic.

---

# 5. Lifted initial distribution and stationary threshold

Let

\[
u=\frac1n\mathbf1^\top
\]

be any convenient passive reference law; uniform is natural.

Choose active mass

\[
\boxed{
c=\frac1{2N}.
}
\]

Define the inner initial distribution

\[
\boxed{
\sigma=
\left(
c\pi,\,
(1-c)u
\right).
}
\]

Place all phase mass initially at phase \(0\):

\[
\widehat\pi=e_0\otimes\sigma.
\]

Choose as the sole accepting/target state:

\[
f=e_0\otimes(e_j,0).
\]

Since

\[
D=2Nn,
\]

the uniform stationary cutpoint of the lifted bistochastic system is

\[
\boxed{
\frac1D=\frac1{2Nn}.
}
\]

And because

\[
c\cdot\frac1n
=
\frac1{2Nn},
\]

the source and target stationary thresholds match exactly after scaling.

---

# 6. Decoding an arbitrary binary word

Take an arbitrary binary word

\[
w\in\{a,b\}^\ast.
\]

Track a phase variable \(q\).

- reading \(a\): \(q\leftarrow q+1\pmod N\);
- reading \(b\) at phase \(q=i>0\): append source letter \(i\);
- reading \(b\) at phase \(0\): append nothing.

Let

\[
\operatorname{dec}(w)
\]

be the source word obtained by this rule.

Because \(Y\) does not change phase, the final phase depends only on the number of \(a\)'s modulo \(N\).

### Theorem CW-002M.1 — Exact unshelled decoding

If the final phase is nonzero, then

\[
\boxed{
\widehat\pi X/Y(w) f=0.
}
\]

If the final phase is \(0\), then

\[
\boxed{
\widehat\pi X/Y(w) f
=
c\,
(\pi P_{\operatorname{dec}(w)})_j.
}
\]

### Proof

The phase blocks are disjoint.

If the final phase is nonzero, the state has no mass in the target phase-\(0\) block.

If the final phase is \(0\), the active copy has undergone exactly the source matrices corresponding to those \(b\)'s read at phases \(1,\ldots,k\). The passive copy never contributes to the target coordinate. Initial active mass is \(c\).

QED.

---

# 7. Every source word is representable

A source letter \(i\in\{1,\ldots,k\}\) can be encoded by the binary loop

\[
\boxed{
a^i\,b\,a^{N-i}.
}
\]

Starting at phase \(0\):

1. \(a^i\) moves to phase \(i\);
2. \(b\) executes \(P_i\);
3. \(a^{N-i}\) returns to phase \(0\).

Concatenating these loops represents every source word.

Thus the decoder is surjective onto source words.

---

# 8. Exact cutpoint equivalence before positivity

For a binary word ending at phase \(0\),

\[
\widehat\pi X/Y(w)f
>
\frac1D
\]

iff

\[
c(\pi P_{\operatorname{dec}(w)})_j
>
c\frac1n,
\]

iff

\[
\boxed{
(\pi P_{\operatorname{dec}(w)})_j>\frac1n.
}
\]

If the binary word ends at nonzero phase,

\[
0<\frac1D,
\]

so it can never create a false positive.

Conversely every source word has a phase-\(0\) encoding.

Therefore:

### Theorem CW-002M.2 — Binary bistochastic stationary-cutpoint reduction

\[
\boxed{
\exists v:
(\pi P_v)_j>\frac1n
}
\]

iff

\[
\boxed{
\exists w\in\{a,b\}^\ast:
\widehat\pi X/Y(w)f>\frac1D.
}
\]

Equality and non-strict threshold relations are preserved as well.

The reduction also preserves the empty-word case: binary words whose decoder is empty and end at phase \(0\) reproduce the source empty-word value.

---

# 9. Strict positivity by a common mixing shell

The binary matrices \(X,Y\) have zeros.

Let

\[
J_D=\frac1D\mathbf1\mathbf1^\top
\]

and choose rational

\[
0<\alpha<1.
\]

Define

\[
\boxed{
\widetilde X
=
(1-\alpha)J_D+\alpha X,
}
\]

\[
\boxed{
\widetilde Y
=
(1-\alpha)J_D+\alpha Y.
}
\]

Then both are:

- rational;
- strictly positive;
- doubly stochastic.

Because \(X,Y\) are doubly stochastic,

\[
J_DX=XJ_D=J_D,
\qquad
J_DY=YJ_D=J_D.
\]

Therefore, for any binary word \(w\) of length \(L\),

\[
\boxed{
\widetilde P_w
=
J_D+\alpha^L(P_w-J_D).
}
\]

For any probability initial law and the one-state final indicator \(f\),

\[
\boxed{
\widehat\pi\widetilde P_wf-\frac1D
=
\alpha^L
\left(
\widehat\pi P_wf-\frac1D
\right).
}
\]

Hence the sign relative to the stationary cutpoint is preserved **for every binary word**, valid or invalid.

### Theorem CW-002M.3 — Positive binary bistochastic reduction

Any stationary-cutpoint PFA with \(k\) rational doubly-stochastic \(n\times n\) generators reduces effectively to a PFA with:

\[
\boxed{
2\text{ rational strictly-positive doubly-stochastic generators}
}
\]

on

\[
\boxed{
D=2(k+1)n
}
\]

states, with one target state and stationary cutpoint

\[
\boxed{
1/D.
}
\]

Strict and non-strict cutpoint emptiness are preserved.

---

# 10. Fixed-system corollary from Rote 2025

Rote's Theorem 1(b) supplies:

- six fixed positive doubly-stochastic \(7\times7\) matrices;
- one fixed accepting state;
- cutpoint \(1/7\);
- only the rational initial distribution varies;
- strict cutpoint emptiness is undecidable.

Apply CW-002M.3 with

\[
k=6,
\qquad
n=7.
\]

Then

\[
N=7,
\]

and

\[
\boxed{
D=2\cdot7\cdot7=98.
}
\]

### Corollary CW-002M.4 — Two fixed positive bistochastic matrices

There exist two **fixed** rational strictly-positive doubly-stochastic

\[
\boxed{
98\times98
}
\]

matrices \(A,B\), and one fixed target state, such that the following problem is undecidable:

> Input only a rational initial distribution \(\mu\).  
> Decide whether there exists a binary word \(w\) with
> \[
> \boxed{
> \mu P_w e_j>\frac1{98}.
> }
> \]

This is an exact corollary of Rote's fixed six-matrix theorem plus the phase-code reduction.

### Collision status

Binary doubly-stochastic PFA undecidability itself is classical; survey literature records a 25-state binary doubly-stochastic construction through Turakainen.

The narrower "two **fixed** positive doubly-stochastic matrices, only initial distribution variable" formulation was not found in this wave's collision search.

Therefore:

\[
\boxed{
\text{the corollary is mathematically proved, but novelty remains unresolved}.
}
\]

---

# 11. Comparison with Rote's binary constructions

Rote 2025 also gives binary positive PFA undecidability:

- two positive \(18\times18\) matrices in the variable-automaton setting;
- two fixed positive \(28\times28\) matrices in the fixed-system/variable-start setting.

However those binary theorems are not stated as doubly stochastic.

Rote explicitly distinguishes properties such as positivity and double stochasticity when they are preserved.

CW-002M trades dimension for bistochasticity:

\[
\boxed{
28\text{ states, fixed binary positive}
}
\]

versus

\[
\boxed{
98\text{ states, fixed binary positive doubly-stochastic}.
}
\]

This is a structural tradeoff, not a claim of optimality.

---

# 12. Compression of the reversible-clock theorem

CW-002L takes a bistochastic source alphabet and converts each source generator into a positive symmetric reversible action kernel plus one positive symmetric clock kernel.

If we first compress Rote's fixed six-matrix source by CW-002M, we obtain only two fixed positive bistochastic source generators on \(98\) states.

Apply CW-002L.

State dimension doubles:

\[
98\to196.
\]

Generator count becomes:

\[
\boxed{
2\text{ reversible actions}+1\text{ reversible clock}=3.
}
\]

### Corollary CW-002M.5 — Three fixed positive reversible kernels suffice with periodic forcing

There exist three fixed rational strictly-positive symmetric doubly-stochastic

\[
\boxed{
196\times196
}
\]

kernels \(S_0,S_1,C\) such that, given only the initial distribution, it is undecidable whether some periodically alternating word

\[
\boxed{
S_{i_1}C
S_{i_2}C
\cdots
S_{i_m}C
}
\]

crosses the stationary target cutpoint

\[
\boxed{
1/196.
}
\]

This improves the generator count in CW-002L from seven fixed reversible kernels to three, at the cost of a larger state space.

Again, the clock/regular-language restriction remains.

---

# 13. Why the phase code succeeds where the reversible lift still needs a clock

The binary bistochastic phase code is self-validating.

Invalid binary words that end in the wrong phase have exact target value

\[
0,
\]

and the positive shell keeps them strictly below the stationary threshold.

Therefore arbitrary free binary words cause no false positives.

The reversible symmetric lift is different.

A word such as

\[
S_iS_j
\]

does not merely land in a harmless wrong phase; it generates transpose-coupled macro-products such as

\[
P_iP_j^\top.
\]

Thus free reversible words can create genuinely new dynamics.

The remaining clock-removal problem is therefore structural, not just an alphabet-coding problem.

---

# 14. Exact computational test

A toy source with:

- \(k=2\);
- \(n=2\);
- two rational doubly-stochastic generators;

was compressed to:

\[
N=3,
\qquad
D=12.
\]

Every binary word of length \(1,\ldots,7\) was exhaustively checked with exact rational arithmetic.

For every word:

- final phase \(0\) gave exactly
  \[
  c\times\text{decoded source acceptance};
  \]
- final phase nonzero gave exactly \(0\);
- positive shell gave exactly
  \[
  \frac1D+\alpha^L\left(v-\frac1D\right).
  \]

Maximum symbolic residual:

\[
\boxed{0}.
\]

---

# 15. New research questions

The exact reduction opens several independent directions:

1. Can the state blowup
   \[
   2(k+1)n
   \]
   be reduced while preserving double stochasticity, positivity, a single target state, and the stationary cutpoint?

2. Can two fixed positive doubly-stochastic matrices with variable-start undecidability be realized below \(98\) states?

3. Can the passive-copy trick be eliminated while keeping the target cutpoint exactly uniform?

4. Can a similar phase code preserve symmetry/reversibility directly, eliminating CW-002L's extra clock?

5. What is the optimal state/generator tradeoff for fixed stochastic systems with undecidable cutpoint reachability?

6. Is there a universal two-generator coding theorem for broader classes such as reversible, unistochastic, or orthostochastic kernels?

---

# Verdict

Binary bistochastic undecidability is classical.

The new exact contribution of this wave is a simple **phase-code theorem** preserving:

- double stochasticity;
- strict positivity;
- stationary cutpoint;
- one target state;
- fixed-system/variable-start structure.

Applied to Rote's fixed theorem, it yields:

\[
\boxed{
2\text{ fixed positive doubly-stochastic }98\times98\text{ matrices}
}
\]

with undecidable stationary-cutpoint reachability as the initial distribution varies.

Combined with the reversible microstep lift:

\[
\boxed{
3\text{ fixed positive reversible }196\times196\text{ kernels}
}
\]

already suffice under a two-phase periodic schedule.

The unrestricted free-switching reversible problem remains untouched and is still the next frontier.
