# COLD WAR RENAISSANCE — CW-002L
## Detailed balance × symmetric dilation × Rote PFA undecidability
### Reversible microsteps can implement an undecidable nonreversible macro-dynamics
Date: 2026-08-22
Status: EXACT REDUCTION UNDER A PERIODIC/REGULAR SWITCHING SCHEDULE; UNRESTRICTED REVERSIBLE-WORD PROBLEM STILL OPEN IN THIS LAB

## 1. Question inherited from CW-002K

For one rational reversible Markov kernel, exact discrete halfspace and hyperplane reachability are decidable because detailed balance makes the operator self-adjoint in the stationary inner product and therefore removes complex spectral phases.

The unresolved question was whether this survives switching among reversible kernels.

The answer is already negative under a very weak timing resource:

\[
\boxed{
\text{each instantaneous kernel reversible}
+
\text{a fixed two-phase clock}
}
\]

is enough to recover the full cutpoint undecidability of general doubly-stochastic probabilistic automata.

The unrestricted free-word problem over reversible generators is not resolved by this construction, because the reduction uses an alternating regular schedule.

---

# 2. Symmetric dilation of a bistochastic kernel

Let

\[
P\in\mathbb Q_{\ge0}^{n\times n}
\]

be doubly stochastic.

Define the \(2n\times2n\) block matrix

\[
\boxed{
A(P)
=
\begin{pmatrix}
0&P\\
P^\top&0
\end{pmatrix}.
}
\]

Also define the block-swap clock

\[
\boxed{
K
=
\begin{pmatrix}
0&I\\
I&0
\end{pmatrix}.
}
\]

Then:

1. \(A(P)\) is symmetric;
2. \(K\) is symmetric;
3. both are nonnegative;
4. both are doubly stochastic.

Moreover,

\[
\boxed{
A(P)K
=
\begin{pmatrix}
P&0\\
0&P^\top
\end{pmatrix}.
}
\]

Thus one arbitrary bistochastic step can be simulated by **two symmetric bistochastic microsteps**:

\[
P
\quad\leadsto\quad
A(P)\,K.
\]

For a word

\[
w=i_1\cdots i_k,
\]

\[
\boxed{
A(P_{i_1})K
\cdots
A(P_{i_k})K
=
\begin{pmatrix}
P_w&0\\
0&P_{i_1}^\top\cdots P_{i_k}^\top
\end{pmatrix}.
}
\]

Only the upper block will be used.

---

# 3. Correct lifted initial distribution

Let

\[
u=\frac1n\mathbf1^\top
\]

be the uniform row distribution.

Given an original initial distribution \(\pi\), define

\[
\boxed{
\widehat\pi
=
\left(
\frac12\pi,\,
\frac12u
\right).
}
\]

After an encoded word \(A(P_{i_1})K\cdots A(P_{i_k})K\),

\[
\widehat\pi
\mapsto
\left(
\frac12\pi P_w,\,
\frac12u
\right),
\]

because \(uP_i^\top=u\) for every doubly-stochastic \(P_i\).

For an upper-block target coordinate \(j^+\),

\[
\boxed{
\widehat\pi
A(P_{i_1})K\cdots A(P_{i_k})K
e_{j^+}
=
\frac12(\pi P_w)_j.
}
\]

The uniform stationary baseline in \(2n\) states is

\[
\frac1{2n}.
\]

Therefore

\[
\boxed{
\widehat\pi
A(P_{i_1})K\cdots A(P_{i_k})K
e_{j^+}
-
\frac1{2n}
=
\frac12
\left[
(\pi P_w)_j-\frac1n
\right].
}
\]

So the stationary-threshold sign is preserved exactly.

---

# 4. Making every reversible microstep strictly positive

The matrices above have zeros.

Let

\[
J_{2n}
=
\frac1{2n}\mathbf1\mathbf1^\top
\]

and choose rational

\[
0<\alpha<1.
\]

For every symmetric doubly-stochastic matrix \(B\), define its positive shell

\[
\boxed{
\mathcal S_\alpha(B)
=
(1-\alpha)J_{2n}
+
\alpha B.
}
\]

Then \(\mathcal S_\alpha(B)\) is:

- rational;
- strictly positive;
- symmetric;
- doubly stochastic.

For any doubly-stochastic \(B,C\),

\[
BJ=JB=J,
\]

so

\[
(B-J)(C-J)=BC-J.
\]

Hence for any word \(B_1\cdots B_m\),

\[
\boxed{
\mathcal S_\alpha(B_1)\cdots
\mathcal S_\alpha(B_m)
=
J
+
\alpha^m(B_1\cdots B_m-J).
}
\]

This is the exact positive-shell identity.

---

# 5. Sign-preserving reversible microstep simulation

Define

\[
S_i
=
\mathcal S_\alpha(A(P_i)),
\]

and

\[
C
=
\mathcal S_\alpha(K).
\]

Every \(S_i\) and \(C\) is strictly positive symmetric doubly stochastic, hence reversible with respect to the uniform distribution on \(2n\) states.

For an original word \(w=i_1\cdots i_k\), consider the alternating microstep schedule

\[
\boxed{
S_{i_1}C
S_{i_2}C
\cdots
S_{i_k}C.
}
\]

The shell identity yields

\[
S_{i_1}C\cdots S_{i_k}C
=
J
+
\alpha^{2k}
\left(
A(P_{i_1})K\cdots A(P_{i_k})K-J
\right).
\]

Therefore:

### Theorem CW-002L.1 — Reversible microstep sign preservation

\[
\boxed{
\widehat\pi
S_{i_1}C\cdots S_{i_k}C
e_{j^+}
-
\frac1{2n}
=
\frac{\alpha^{2k}}2
\left[
(\pi P_w)_j-\frac1n
\right].
}
\]

Since

\[
\alpha^{2k}/2>0,
\]

the sign is exactly preserved.

Thus a stationary cutpoint question for an arbitrary bistochastic PFA is transformed into the same stationary cutpoint question for a process in which **every individual time step satisfies detailed balance**.

---

# 6. Fixed reversible system with undecidable alternating-control reachability

Rote's 2025 theorem provides:

- six fixed positive doubly-stochastic \(7\times7\) matrices
  \[
  P_1,\ldots,P_6;
  \]
- fixed target state \(j\);
- stationary cutpoint
  \[
  1/7;
  \]
- variable rational starting distribution \(\pi\);

such that deciding whether

\[
\exists w:
(\pi P_w)_j>\frac17
\]

is undecidable.

Apply the construction with

\[
n=7.
\]

We obtain:

- six fixed positive symmetric doubly-stochastic action kernels
  \[
  S_1,\ldots,S_6;
  \]
- one fixed positive symmetric doubly-stochastic clock kernel \(C\);
- state dimension
  \[
  14;
  \]
- target stationary cutpoint
  \[
  1/14;
  \]
- initial distribution
  \[
  \widehat\pi=(\pi/2,u/2).
  \]

### Theorem CW-002L.2 — Periodically forced reversible switching is undecidable

It is undecidable, given only the rational initial distribution \(\widehat\pi\), whether there exist \(k\ge1\) and choices

\[
i_1,\ldots,i_k\in\{1,\ldots,6\}
\]

such that

\[
\boxed{
\widehat\pi
S_{i_1}C
S_{i_2}C
\cdots
S_{i_k}C
e_{j^+}
>
\frac1{14}.
}
\]

All seven kernels are fixed, rational, strictly positive, symmetric, and doubly stochastic.

Thus the system is instantaneously reversible at every microstep.

The only control is the choice of one of six reversible action kernels at odd phases; the same reversible clock kernel is forced at even phases.

---

# 7. Five-generator nonfixed version

Rote also gives undecidability with four positive doubly-stochastic \(7\times7\) transition matrices when the automaton itself is part of the instance.

The same construction yields:

\[
\boxed{
4\text{ reversible action kernels}
+
1\text{ reversible clock}
}
\]

on \(14\) states.

Therefore the periodically constrained reachability problem is already undecidable with five positive symmetric doubly-stochastic microstep kernels when the matrices are input.

---

# 8. Why this does not yet solve the unrestricted free-word problem

The proof relies on the regular language

\[
\boxed{
L=
(S_1+\cdots+S_6)C
\;^\ast
}
\]

more explicitly, words of the form

\[
S_{i_1}C\cdots S_{i_k}C.
\]

If arbitrary words over

\[
\{S_1,\ldots,S_6,C\}
\]

are permitted, invalid products such as

\[
S_iS_j
\]

need not correspond to an original PFA word.

Before the positive shell,

\[
A(P_i)A(P_j)
\]

contains blocks involving

\[
P_iP_j^\top,
\]

so false threshold crossings are possible in principle.

Therefore:

\[
\boxed{
\text{unrestricted switching among reversible kernels remains unresolved here}.
}
\]

The current theorem is a periodic/regular-control undecidability theorem.

---

# 9. The clock is not a cosmetic device

The identity

\[
A(P)K
=
\operatorname{diag}(P,P^\top)
\]

shows what the clock does.

A reversible symmetric kernel cannot itself encode a directed nonreversible operator \(P\) on the same block.

But two reversible microsteps can:

1. \(A(P)\) moves across the bipartite lift and applies \(P\);
2. \(K\) restores orientation without changing the encoded upper-block distribution.

Thus directed computation appears as a **two-step holonomy** of reversible moves.

This suggests a general principle:

\[
\boxed{
\text{local detailed balance}
\not\Rightarrow
\text{global reversible computation under time ordering}.
}
\]

The noncommutativity is stored in temporal composition.

---

# 10. Product reversibility is exactly what fails

For matrices symmetric in the same inner product,

\[
(PQ)^\ast=QP.
\]

Hence

\[
PQ
\]

is self-adjoint iff

\[
PQ=QP.
\]

The numerical test in this wave explicitly found

\[
S_iC\ne CS_i
\]

and therefore

\[
S_iC
\]

is not symmetric even though both factors are positive symmetric stochastic matrices.

So the theorem does not contradict CW-002K.

CW-002K studies powers of **one fixed self-adjoint operator**.

CW-002L uses products of **noncommuting self-adjoint operators**.

That distinction is the computational phase boundary.

---

# 11. Commuting reversible families

Suppose

\[
P_1,\ldots,P_m
\]

are all reversible with respect to one \(\pi\) and pairwise commute.

Then their self-adjoint representatives

\[
\Pi^{1/2}P_a\Pi^{-1/2}
\]

are commuting real symmetric matrices.

Hence they are simultaneously orthogonally diagonalizable.

For a word with Parikh counts

\[
k=(k_1,\ldots,k_m),
\]

a scalar observable has the form

\[
\boxed{
F(k)
=
c_0
+
\sum_{r=1}^d
c_r
\prod_{a=1}^m
\theta_{a,r}^{k_a}.
}
\]

Thus order no longer matters; only the exponent vector in

\[
\mathbb N^m
\]

matters.

This is a multivariate exponential-Diophantine sign problem rather than a general noncommutative matrix-semigroup problem.

No blanket decidability theorem for strict halfspace reachability in this exact class is asserted here.

---

# 12. Collision: commutativity alone is not enough

Bell's work on polynomially ambiguous probabilistic automata proves undecidability of strict and non-strict cutpoint emptiness even for commutative PFA transition matrices under the corresponding restricted/letter-monotonic input regimes.

Thus:

\[
\boxed{
\text{commutativity by itself does not remove PFA hardness}.
}
\]

The potentially special regime is:

\[
\boxed{
\text{commutativity}
+
\text{common reversible/self-adjoint structure}.
}
\]

That is a substantially stronger spectral constraint.

---

# 13. Gibson factorization revisited

Gibson's 1976 theorem states, over a field, that doubly-stochastic matrices admit products of symmetric doubly-stochastic matrices under algebraic hypotheses, and in general three symmetric factors suffice in the stated field setting.

However those algebraic factors need not be nonnegative stochastic kernels.

CW-002L provides a different factorization:

\[
P
\leadsto
A(P)K
\]

after a \(2\times\) state lift.

Its advantages:

- both factors are genuinely nonnegative stochastic;
- both are symmetric;
- after the \(J+\alpha(\cdot-J)\) shell, both are strictly positive.

Its cost:

- a state-space doubling;
- a forced phase/clock structure.

Thus there is a clean tradeoff:

\[
\boxed{
\text{algebraic same-dimension factorization}
\quad\text{vs}\quad
\text{positive stochastic lifted factorization with timing}.
}
\]

---

# 14. Numerical exact verification

A rational \(3\)-state example with two nonsymmetric doubly-stochastic kernels was lifted to \(6\) states.

With

\[
\alpha=1/10,
\]

all three microstep matrices \(S_1,S_2,C\) were verified to be:

- symmetric;
- strictly positive;
- doubly stochastic.

For every binary original word of length \(1,\ldots,4\), exact symbolic arithmetic verified

\[
\widehat\pi S_{i_1}C\cdots S_{i_k}Ce_{j^+}
-\frac16
=
\frac{\alpha^{2k}}2
\left[
\pi P_we_j-\frac13
\right]
\]

with residual exactly zero.

The product \(S_1C\) was explicitly nonsymmetric, confirming that reversible microsteps generate nonreversible macro-dynamics.

---

# 15. New phase diagram

We now have:

## One reversible generator

Discrete hyperplane/halfspace reachability:
\[
\boxed{\text{decidable in arbitrary dimension}.}
\]

## Periodically forced switching among positive reversible generators

Even with a fixed \(14\)-state system:
\[
\boxed{\text{undecidable}.}
\]

## Unrestricted free switching among reversible generators

\[
\boxed{\text{open in the current audit}.}
\]

## Pairwise commuting common-reversible generators

Simultaneously diagonalizable:
\[
\boxed{\text{reduces to multivariate exponential sign geometry}.}
\]

Exact decidability frontier:
under audit.

This sharply localizes the next problem.

---

# Verdict

Detailed balance is a computability regularizer only for a single self-adjoint operator, or potentially for sufficiently commutative families.

It is **not stable under time ordering**.

Two positive reversible microsteps can implement one arbitrary bistochastic computational step after a state-space lift.

Therefore:

\[
\boxed{
\text{instantaneous reversibility}
\not\Rightarrow
\text{algorithmic simplicity of switched dynamics}.
}
\]

The next exact target is to remove the forced clock/regular-language restriction, or prove that the unrestricted reversible semigroup genuinely defines a decidable island.
