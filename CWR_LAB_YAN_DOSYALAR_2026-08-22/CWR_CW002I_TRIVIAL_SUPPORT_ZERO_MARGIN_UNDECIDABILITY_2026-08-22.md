# COLD WAR RENAISSANCE — CW-002I
## Rabin actual automata × leaktightness × Rote × contractive matrix semigroups
### Trivial support, exponential mixing, undecidable zero-margin reachability
Date: 2026-08-22
Status: EXACT SYNTHESIS / STRONG COROLLARIES; CORE UNDECIDABILITY FROM ROTE 2025

## 1. Question inherited from CW-002G/H

The previous wave asked whether

- leaktightness, which excludes asymptotic probability leaks, and
- stationary zero-margin undecidability, which survives under positive doubly-stochastic mixing,

are two forms of the same obstruction.

They are not.

They are sharply separable.

The key observation is elementary but decisive:

\[
\boxed{
\text{every finite strictly-positive stochastic generator family is leaktight.}
}
\]

Rote's 2025 undecidability construction uses strictly positive doubly-stochastic generators.

Therefore stationary-cutpoint undecidability occurs **inside the leaktight class**.

---

# 2. Positive products have a uniform entry floor

Let

\[
\Sigma=\{P_a:a\in A\}
\]

be a finite family of \(n\times n\) row-stochastic matrices with

\[
P_a(i,j)>0
\qquad
\forall a,i,j.
\]

Set

\[
\eta
=
\min_{a,i,j}P_a(i,j)
>0.
\]

Take any nonempty word

\[
w=a_1\cdots a_k.
\]

Write

\[
P_w=QP_{a_k}.
\]

Since \(Q\) is stochastic,

\[
(P_w)_{ij}
=
\sum_rQ_{ir}P_{a_k}(r,j)
\ge
\eta\sum_rQ_{ir}
=
\eta.
\]

Hence:

### Theorem CW-002I.1 — Uniform product positivity

For every nonempty word,

\[
\boxed{
(P_w)_{ij}\ge\eta
\qquad
\forall i,j.
}
\]

This is stronger than merely saying every product has full support.

No transition probability in a nonempty product can even become smaller than the fixed floor \(\eta\).

---

# 3. Every finite positive PFA is leaktight

A leak in the Fijalkow–Gimbert–Kelmendi–Oualhadj sense requires a sequence of words \(w_m\) and recurrent states \(r,q\) such that

\[
P(r\xrightarrow{w_m}q)>0
\quad\forall m,
\]

but

\[
P(r\xrightarrow{w_m}q)\to0.
\]

Theorem CW-002I.1 makes this impossible for nonempty words, since every positive transition probability is at least \(\eta\).

The empty word cannot create a leak either.

Therefore:

### Theorem CW-002I.2 — Actual automata are leaktight

\[
\boxed{
\text{Every finite strictly-positive probabilistic automaton is leaktight.}
}
\]

This is an immediate consequence of the classical definition; no novelty is claimed for the observation itself.

---

# 4. The Boolean support monoid is trivial

Let

\[
U
=
\mathbf1_{n\times n}
\]

be the universal Boolean relation.

Every positive generator has Boolean support \(U\).

Since

\[
U\odot U=U
\]

under Boolean matrix multiplication, every nonempty word also has support \(U\).

Thus the Boolean transition/support monoid is only

\[
\boxed{
\{I,U\}.
}
\]

The same phenomenon persists asymptotically because every nonempty stochastic product has entries bounded below by \(\eta\).

Therefore:

- no support edge disappears;
- no leak edge can exist;
- stabilization of the full relation remains the full relation.

So positive automata are the regime where support-based asymptotic pathology is maximally absent.

---

# 5. Rote's fixed positive construction lives inside this trivial-support regime

Rote's 2025 Theorem 1(b) provides:

- \(n=7\);
- six **fixed** positive doubly-stochastic \(7\times7\) matrices
  \[
  D_1,\ldots,D_6;
  \]
- a fixed single accepting state, say coordinate \(1\);
- cutpoint
  \[
  \lambda=\frac17;
  \]
- only the rational starting distribution \(\pi\) varies;

such that deciding whether

\[
\boxed{
\exists w:
\pi D_w e_1>\frac17
}
\]

is undecidable.

Because the matrices are fixed and strictly positive:

1. the automaton is leaktight;
2. its Boolean support monoid is \(\{I,U\}\);
3. the extended support behavior has no leaks.

Because the matrices are doubly stochastic, the uniform law

\[
u=\frac17\mathbf1
\]

is invariant under every generator.

Because the family is finite and positive, there is a uniform Dobrushin coefficient

\[
\rho<1
\]

such that

\[
\boxed{
TV(\pi D_w,u)
\le
\rho^{|w|}
TV(\pi,u)
\qquad
\forall w.
}
\]

Therefore:

### Theorem CW-002I.3 — Trivial-support undecidable halfspace reachability

There exists a **fixed**, finite, rational, leaktight, uniformly exponentially mixing stochastic semigroup on the \(7\)-simplex whose Boolean support monoid has only two elements,

\[
\{I,U\},
\]

but for which membership of a rational initial point in

\[
\boxed{
\mathcal B
=
\left\{
\pi:
\exists w,\ 
(\pi D_w)_1>\frac17
\right\}
}
\]

is undecidable.

This is a direct corollary/reinterpretation of Rote's theorem plus the positivity lemmas above.

No claim is made that Rote stated it in this dynamical-systems language.

---

# 6. Fixed contracting IFS interpretation

Define affine maps on the probability simplex

\[
F_i(x)=xD_i.
\]

Each map fixes \(u\) and contracts total variation uniformly:

\[
TV(F_i(x),u)
\le
\rho TV(x,u).
\]

Hence every switched trajectory satisfies

\[
x_w\to u
\]

uniformly as \(|w|\to\infty\).

Yet reachability of the open halfspace

\[
H^+
=
\left\{
x:x_1>\frac17
\right\}
\]

from a rational initial point is undecidable.

Thus:

\[
\boxed{
\text{global uniform convergence to one common fixed point}
}
\]

does not make exact transient halfspace reachability decidable.

This is a standalone switched-systems/verification corollary.

A quick collision search found broad undecidability results for affine and piecewise-affine reachability, but not this exact "fixed uniformly contracting simplex IFS with common fixed point and halfspace target" formulation.

Novelty remains unresolved.

---

# 7. Contractive-shell embedding lemma

Rote's positivity transformation admits a clean abstract formulation.

Let

\[
J=\frac1n\mathbf1\mathbf1^\top
\]

and let \(C_a\) be rational matrices satisfying

\[
C_a\mathbf1=\mathbf1,
\qquad
\mathbf1^\top C_a=\mathbf1^\top,
\]

but not necessarily nonnegative.

Choose \(\alpha>0\) sufficiently small that

\[
\boxed{
D_a=(1-\alpha)J+\alpha C_a
}
\]

is strictly positive for every \(a\).

Then every \(D_a\) is positive doubly stochastic.

Let

\[
u=\frac1n\mathbf1^\top
\]

and let \(v\) be any row vector with

\[
v\mathbf1=0.
\]

Then

\[
vJ=0,
\qquad
uD_a=u,
\qquad
vD_a=\alpha vC_a.
\]

Therefore, for a word \(w\) of length \(k\),

### Theorem CW-002I.4 — Contractive-shell identity

\[
\boxed{
(u+v)D_w
=
u+\alpha^k vC_w.
}
\]

More generally, whenever \(u+\varepsilon v\) is a probability distribution,

\[
\boxed{
(u+\varepsilon v)D_wf-uf
=
\varepsilon\alpha^k vC_wf.
}
\]

Thus:

- the magnitude of every signed deviation is multiplied by \(\alpha^k\);
- its sign is inherited exactly from the signed core computation \(vC_wf\).

The positive stochastic matrices form a **mixing shell** around a signed matrix-semigroup computation.

This mechanism is essentially Rote's positivity step, abstracted as a reusable lemma.

---

# 8. Radial decay does not kill directional computation

CW-002I.4 exposes the geometry.

Write a probability state as

\[
x=u+v,
\qquad
v\mathbf1=0.
\]

The uniform stationary component \(u\) is fixed.

The zero-sum tangent component evolves as

\[
\boxed{
v\mapsto\alpha vC_a.
}
\]

So the dynamics splits into:

\[
\text{radial magnitude}
\quad\times\quad
\text{signed/projective direction}.
\]

The radial factor \(\alpha^k\) tends exponentially to zero.

But a zero-margin predicate

\[
(u+\alpha^kvC_w)f>uf
\]

reduces exactly to

\[
\boxed{
vC_wf>0.
}
\]

The vanishing amplitude is irrelevant to the sign.

Hence undecidable computation can survive in the **direction/sign of an exponentially shrinking tangent vector**.

This explains why mixing, Dobrushin contraction, and support stabilization all fail to resolve the stationary-boundary problem.

They control magnitude or support.

The undecidable information lives in signed direction.

---

# 9. Two orthogonal asymptotic pathologies

The previous frontier can now be answered.

## Pathology A — probability leakage

A transition probability stays positive at every finite stage but tends to zero:

\[
p_m>0,
\qquad
p_m\to0.
\]

This causes support/limit noncommutation.

Leaktightness is designed to exclude the recurrent version of this pathology.

## Pathology B — zero-margin signed computation

All stochastic transition probabilities remain uniformly positive:

\[
P_w(i,j)\ge\eta.
\]

The support monoid is trivial and no leak exists.

Nevertheless a signed deviation

\[
x_w-u
\]

shrinks to zero while its side relative to a hyperplane encodes an undecidable predicate.

Rote's construction realizes this pathology.

Therefore:

### Theorem CW-002I.5 — Orthogonality of leaktightness and zero-margin hardness

\[
\boxed{
\text{Leaktightness does not exclude stationary zero-margin undecidability.}
}
\]

More strongly, the undecidability occurs in a maximally nonleaking full-support regime.

So CWR-BP-135 is resolved negatively:

\[
\boxed{
\text{the two computability boundaries are not the same obstruction.}
}
\]

---

# 10. Rabin 1963 versus Rote 2025: isolation is the real boundary

Rabin called strictly-positive probabilistic automata **actual automata**.

His 1963 theorem shows that actual automata with an **isolated cutpoint** recognize only definite events; he also proved stability under sufficiently small perturbations in this regime.

Now consider a positive common-stationary uniformly contracting automaton.

For an output \(f\),

\[
\mu P_wf\to\nu f
\]

uniformly over all words of growing length.

Thus the stationary cutpoint

\[
\boxed{
\lambda_\ast=\nu f
}
\]

can never be isolated: arbitrarily long words have output arbitrarily close to \(\lambda_\ast\).

Rote places undecidability precisely at this nonisolated stationary cutpoint.

Hence a 62-year phase boundary emerges:

\[
\boxed{
\text{Rabin: positive + isolated cutpoint}
\Rightarrow
\text{finite/definite behavior};
}
\]

\[
\boxed{
\text{Rote: positive + nonisolated stationary cutpoint}
\Rightarrow
\text{undecidability can survive}.
}
\]

Strict positivity was never the decisive simplifier by itself.

The decisive regularity was **isolation/margin**.

---

# 11. Off-boundary precision-to-time law

Suppose:

\[
\nu P_a=\nu,
\qquad
\max_a\delta(P_a)\le\rho<1.
\]

Let

\[
b=\nu f
\]

and threshold

\[
\lambda=b+\gamma,
\qquad
\gamma>0.
\]

From CW-002H,

\[
|\mu P_wf-b|
\le
C\rho^{|w|},
\]

with

\[
C=\operatorname{osc}(f)TV(\mu,\nu).
\]

Therefore only lengths

\[
|w|
<
N_\gamma
\]

can possibly cross the upper threshold, where

\[
\boxed{
N_\gamma
=
\left\lceil
\frac{\log(\gamma/C)}
{\log\rho}
\right\rceil
}
\]

in the nontrivial regime.

If there are \(m\) generators, brute-force search examines at most

\[
\sum_{k<N_\gamma}m^k.
\]

For fixed \(m,\rho,C\),

\[
m^{N_\gamma}
=
O\left(
\gamma^{-\kappa}
\right),
\]

where

\[
\boxed{
\kappa
=
\frac{\log m}{|\log\rho|}.
}
\]

Thus robust threshold verification has a polynomial upper bound in inverse margin \(1/\gamma\) for a fixed contracting system.

At

\[
\gamma=0
\]

the finite horizon disappears, and Rote shows undecidability can return.

This is a quantitative precision/computability singularity.

---

# 12. Numerical sanity check

A signed doubly-stochastic core \(C_1,C_2\) was wrapped in a positive shell

\[
D_i=(1-\alpha)J+\alpha C_i
\]

with

\[
\alpha=0.12.
\]

Every binary word up to length \(8\) was checked.

For a zero-sum perturbation \(v\),

\[
(u+v)D_w
=
u+\alpha^{|w|}vC_w
\]

held to floating-point accuracy.

Maximum error:

\[
1.7\times10^{-16}.
\]

All tested nonempty products had full support with a fixed positive entry floor.

The scalar output deviation decayed exponentially while matching the sign-scaled signed-core computation exactly.

---

# 13. Literature ownership

## Classical / directly sourced

- Rabin 1963: actual automata, isolated cutpoints, definite events, stability.
- Fijalkow et al. 2015: leaktightness, leaks, extended Markov monoid.
- Rote 2025: positive/doubly-stochastic undecidability, fixed matrices, stationary cutpoint \(1/7\), positivity transformation.
- Dobrushin/Seneta: contraction of stochastic matrices.

## Exact CWR deductions

- finite positive automata are leaktight;
- positive support monoid is \(\{I,U\}\);
- Rote's fixed automaton therefore gives undecidability inside a leaktight trivial-support uniformly mixing semigroup;
- leaktightness and stationary zero-margin undecidability are orthogonal;
- the Rote positivity transformation is abstracted as the contractive-shell identity;
- fixed uniformly contracting simplex-halfspace reachability is undecidable as a direct corollary.

These deductions are mathematically exact.

Their novelty as formulations remains under collision audit.

---

# Verdict

The previous question is resolved.

\[
\boxed{
\text{leak pathology}
\neq
\text{stationary zero-margin hardness}.
}
\]

In fact Rote's hardest positive examples have:

- no support loss;
- no leaks;
- trivial Boolean support dynamics;
- a common stationary distribution;
- uniform exponential mixing.

The undecidable computation lives entirely in the **sign of a vanishing zero-sum perturbation**.

This shifts the next CWR frontier from support asymptotics to signed/projective tangent dynamics and robust-versus-exact verification.
