# COLD WAR RENAISSANCE — CW-002B
## Birkhoff × Atar–Zeitouni × Le Cam × Wald
### Pathwise history-adaptive future-information stopping
Date: 2026-08-22
Status: PROVISIONAL EXACT CROSS-SCHOOL THEOREM; GENERIC FILTER CONTRACTION IS CLASSICAL

## 1. Why CW-002 needed another school

CW-002 established the sharp ex-ante theorem

\[
r(E_{t:\infty})
\le
\left(1-\frac1m\right)\eta(T_{0:t}),
\]

where \(r\) is the one-sided Le Cam deficiency to the best null experiment.

That theorem is unconditional.

Conditioning on an observed history can make ordinary total-variation Bayes updates expand, so a naive Wald-style "stop after any history" conclusion is invalid.

The nonlinear-filtering literature gives the missing tool.

Atar–Zeitouni (1997) explicitly study exponential filter stability and memory length using Birkhoff's projective contraction coefficient. Budhiraja–Ocone and later Hilbert-metric filtering work use the same projective mechanism. McDonald–Yüksel instead derive expectation-level total-variation contraction from joint Dobrushin coefficients.

The key projective fact is that Bayesian normalization and positive coordinatewise likelihood multiplication are harmless in Hilbert metric.

That is exactly the structure needed for a history-uniform theorem.

---

# 2. Finite positive hidden Markov model

Let

\[
\mathcal X=\{1,\ldots,m\}.
\]

Let \(T\) be a strictly positive row-stochastic transition matrix:

\[
T_{ij}>0.
\]

At time \(s\), after transition, an observation \(Y_s=y_s\) has strictly positive likelihood vector

\[
g_{y_s}
=
(g(y_s|1),\ldots,g(y_s|m))
\in(0,\infty)^m.
\]

Write

\[
D_{y_s}
=
\operatorname{diag}(g_{y_s}).
\]

For an initial state hypothesis

\[
X_0=x,
\]

the conditional filter after a realized observation history

\[
h_n=(y_1,\ldots,y_n)
\]

is generated recursively by

\[
\pi_{s+1}^{x,h}
=
\operatorname{Norm}
\left(
\pi_s^{x,h}T D_{y_{s+1}}
\right),
\]

starting from

\[
\pi_0^x=\delta_x.
\]

Strict positivity makes every history with positive observation reference density admissible for every initial state hypothesis after the first transition.

---

# 3. Hilbert projective metric

For strictly positive probability vectors \(p,q\), define

\[
d_H(p,q)
=
\log
\frac{
\max_i p_i/q_i
}{
\min_i p_i/q_i
}.
\]

It is invariant under separate positive rescaling:

\[
d_H(ap,bq)=d_H(p,q).
\]

For a strictly positive matrix \(A\), let

\[
\Delta(A)
=
\sup_{p,q>0}
d_H(pA,qA)
\]

be the projective diameter.

Birkhoff's contraction theorem gives

\[
d_H(pA,qA)
\le
\tau(A)d_H(p,q),
\]

where

\[
\boxed{
\tau(A)
=
\tanh\left(\frac{\Delta(A)}4\right)
<1.
}
\]

For a positive finite matrix,

\[
\Delta(A)
=
\log
\max_{i,j,k,\ell}
\frac{A_{ik}A_{j\ell}}
{A_{i\ell}A_{jk}}.
\]

---

# 4. Observation multiplication is projectively invisible

For any strictly positive diagonal matrix \(D\),

\[
\boxed{
\Delta(AD)=\Delta(A).
}
\]

Indeed every cross ratio is unchanged:

\[
\frac{
(A_{ik}D_{kk})(A_{j\ell}D_{\ell\ell})
}{
(A_{i\ell}D_{\ell\ell})(A_{jk}D_{kk})
}
=
\frac{A_{ik}A_{j\ell}}
{A_{i\ell}A_{jk}}.
\]

Hence

\[
\boxed{
\tau(TD_y)=\tau(T)
}
\]

for every positive observation \(y\).

Bayesian normalization is also invisible because Hilbert metric is projective.

Therefore every realized filter update has the same worst-case contraction factor, independently of the observation value.

This is a classical reason Hilbert geometry is so effective in nonlinear filtering.

---

# 5. Uniform pathwise filter contraction from point-mass initial states

The initial point masses are not in the positive cone interior, so their mutual Hilbert distance is infinite.

But after one positive transition they enter the interior.

For any initial states \(x,x'\),

\[
d_H(
\pi_1^{x,h},
\pi_1^{x',h}
)
\le
\Delta(T).
\]

Every subsequent update contracts by \(\tau(T)\).

### Theorem CW-002B.1 — History-uniform projective forgetting

For every positive observation history \(h_n\), every pair \(x,x'\), and \(n\ge1\),

\[
\boxed{
d_H(
\pi_n^{x,h},
\pi_n^{x',h}
)
\le
\Delta(T)\tau(T)^{n-1}.
}
\]

The bound is deterministic and pathwise.

It contains no probability over observation histories.

### Proof

First step:

\[
\pi_1^{x,h}
=
\operatorname{Norm}(\delta_xTD_{y_1}).
\]

By the definition of projective diameter and
\(\Delta(TD_{y_1})=\Delta(T)\),

\[
d_H(\pi_1^{x,h},\pi_1^{x',h})
\le\Delta(T).
\]

For each later step, Birkhoff contraction and diagonal invariance yield

\[
d_H(\pi_{s+1}^{x,h},\pi_{s+1}^{x',h})
\le
\tau(T)
d_H(\pi_s^{x,h},\pi_s^{x',h}).
\]

Iterate.

QED.

---

# 6. Hilbert distance controls total variation

Using the standard convention

\[
\operatorname{TV}(p,q)
=
\frac12\sum_i|p_i-q_i|,
\]

one has

\[
\boxed{
\operatorname{TV}(p,q)
\le
\tanh\left(\frac{d_H(p,q)}4\right).
}
\]

This bound is sharp already for two-point distributions.

Therefore CW-002B.1 gives:

\[
\boxed{
\operatorname{TV}
(
\pi_n^{x,h},
\pi_n^{x',h}
)
\le
\beta_n,
}
\]

where

\[
\boxed{
\beta_n
=
\tanh
\left(
\frac{
\Delta(T)\tau(T)^{n-1}
}{4}
\right).
}
\]

Again this holds for every realized history.

---

# 7. Entire future tail after the observed history

Fix history \(h_n\).

From time \(n\) onward, allow the entire future observation path

\[
Y_{n+1:\infty}.
\]

For a fixed future observation/control protocol, the conditional future law depends on the initial-state hypothesis \(x\) only through the current filter:

\[
P_x(
Y_{n+1:\infty}\in\cdot
\mid
h_n
)
=
\pi_n^{x,h}G_{n,h},
\]

for a Markov kernel

\[
G_{n,h}:
\mathcal X
\rightsquigarrow
\mathcal Y^{\mathbb N}.
\]

Data processing gives

\[
\operatorname{TV}
(
P_x(\text{future}|h_n),
P_{x'}(\text{future}|h_n)
)
\le
\beta_n.
\]

Thus the entire infinite future cannot re-expand the projectively forgotten initial-state distinction.

---

# 8. Conditional Le Cam null deficiency

For the conditional future-tail experiment

\[
E_{n,h}
:
x
\mapsto
P_x(
Y_{n+1:\infty}\in\cdot
\mid h_n
),
\]

define its standard-TV radius from a null experiment:

\[
r(E_{n,h})
=
\inf_q
\sup_x
\operatorname{TV}(E_{n,h,x},q).
\]

If \(m=|\mathcal X|\), use the uniform mixture of the \(m\) future-tail rows as a null center.

A family with pairwise TV diameter at most \(\beta\) has radius at most

\[
\left(1-\frac1m\right)\beta.
\]

Therefore:

### Theorem CW-002B.2 — Pathwise future-tail Le Cam horizon

For every observation history \(h_n\),

\[
\boxed{
r(E_{n,h})
\le
\left(1-\frac1m\right)
\tanh
\left(
\frac{
\Delta(T)\tau(T)^{n-1}
}{4}
\right).
}
\]

This is a history-uniform decision-theoretic bound on the **entire remaining future**.

For every bounded normalized decision problem about the initial state, the benefit obtainable from all future observations after \(h_n\) over a state-independent experiment is bounded by the same quantity through Le Cam's risk interpretation.

---

# 9. A genuine Wald-style stopping rule

Define

\[
B_n
=
\left(1-\frac1m\right)
\tanh
\left(
\frac{
\Delta(T)\tau(T)^{n-1}
}{4}
\right).
\]

If

\[
B_n\le\varepsilon,
\]

then, after **every possible positive observation history of length \(n\)**, the entire infinite future has at most \(\varepsilon\) residual normalized decision value about the initial state.

Hence the deterministic stopping time

\[
\boxed{
N_\varepsilon
=
\min\{n\ge1:B_n\le\varepsilon\}
}
\]

is pathwise valid.

Unlike CW-002's ex-ante Dobrushin horizon, this statement survives conditioning on the realized observation history.

It is therefore genuinely suitable as a Wald-style stopping certificate under the strict-positivity contract.

---

# 10. Controlled / feedback extension

Suppose the transition matrix depends on an action:

\[
T_u,
\qquad
u\in\mathcal U,
\]

and the action at time \(s\) is chosen by an arbitrary feedback policy from the observed history.

Given the same realized history, the policy selects the same current action for all initial-state hypotheses.

Assume every \(T_u\) is strictly positive.

Let

\[
\Delta_u=\Delta(T_u),
\qquad
\tau_u=\tanh(\Delta_u/4).
\]

For the realized action sequence \(u_0,\ldots,u_{n-1}\),

\[
\boxed{
d_H(
\pi_n^{x,h},
\pi_n^{x',h}
)
\le
\Delta_{u_0}
\prod_{s=1}^{n-1}\tau_{u_s}.
}
\]

Therefore:

\[
\boxed{
r(E_{n,h}^{\gamma})
\le
\left(1-\frac1m\right)
\tanh
\left[
\frac{
\Delta_{u_0}
\prod_{s=1}^{n-1}\tau_{u_s}
}{4}
\right].
}
\]

This is a **history-adaptive** bound because the realized action sequence can depend on the observed history.

A policy-independent certificate follows from

\[
\bar\Delta=\sup_u\Delta_u,
\qquad
\bar\tau=\sup_u\tau_u<1.
\]

Then

\[
r(E_{n,h}^{\gamma})
\le
\left(1-\frac1m\right)
\tanh
\left(
\frac{\bar\Delta\bar\tau^{n-1}}4
\right)
\]

for every policy and history.

McDonald–Yüksel obtain a different controlled result in expected total variation under a joint Dobrushin condition. The present projective route is stronger pathwise under a much stronger positivity hypothesis.

---

# 11. Numerical destructive check

For

\[
T=
\begin{pmatrix}
0.70&0.20&0.10\\
0.15&0.70&0.15\\
0.10&0.25&0.65
\end{pmatrix},
\]

the exact projective quantities are approximately

\[
\Delta(T)=3.817712325957,
\]

\[
\tau(T)=0.741781178354.
\]

For each

\[
n\in\{1,2,3,5,8,12\},
\]

1000 arbitrary strictly positive observation-likelihood sequences were generated.

Filters were initialized from all three point masses.

No violation occurred for either

\[
d_H\le\Delta(T)\tau(T)^{n-1}
\]

or

\[
TV\le
\tanh(
\Delta(T)\tau(T)^{n-1}/4
).
\]

The largest Hilbert numerical excess was floating-point scale.

This is a sanity check, not a proof.

---

# 12. Literature ownership

## Birkhoff 1957

Projective contraction of positive operators is classical.

## Atar–Zeitouni 1997

They explicitly use Birkhoff contraction to study exponential nonlinear-filter stability and memory length, including almost-sure stability and smoother stability.

Thus "Hilbert metric gives pathwise filter forgetting" is not new.

## Budhiraja–Ocone 1997

Hilbert metric/Birkhoff contraction is used for discrete-time filter stability under bounded observation noise.

## McDonald–Yüksel 2019/2020

They derive an expectation-level total-variation filter contraction with coefficient

\[
(1-\delta(T))(2-\delta(Q))
\]

and note almost-sure convergence consequences; controlled extensions are also given.

## Le Cam

Deficiency translates experiment approximation into worst-case downstream decision loss.

### CWR-specific synthesis candidate

The narrow cross-school result is:

\[
\boxed{
\text{Birkhoff pathwise filter memory}
\to
\text{conditional entire-future experiment}
\to
\text{Le Cam null deficiency}
\to
\text{Wald-style residual decision stopping}.
}
\]

A dedicated search is still required to determine whether this exact future-tail deficiency formulation has appeared before.

No novelty claim is made yet.

---

# 13. Boundary: zero likelihoods and nonpositive transitions

Strict positivity is a real constraint.

If:

- transition matrices contain structural zeros;
- observation likelihoods vanish;
- support changes with the realized observation;

then Hilbert distances can become infinite and a one-step uniform Birkhoff contraction may disappear.

This does not end the program.

It creates the next interaction problem:

\[
\boxed{
\text{positive blocks / Doeblin words / support graphs}
\to
\text{intermittent projective contraction}
\to
\text{future-tail deficiency horizon}.
}
\]

The literature on mixing blocks, primitive matrices, random matrix products, and nonergodic filters is the correct next input.

---

# Verdict

CW-002's ex-ante theorem can indeed be upgraded to a history-uniform stopping statement, but not by Dobrushin TV contraction alone.

The missing 20th-century tool was Birkhoff's projective geometry.

Under strict positivity:

\[
\boxed{
r(E_{n,h})
\le
\left(1-\frac1m\right)
\tanh
\left(
\frac{
\Delta(T)\tau(T)^{n-1}
}{4}
\right)
\quad
\forall h.
}
\]

This bounds the decision value of the entire infinite future after every observed history.

That is the exact interaction product of:

\[
\text{Birkhoff}
\times
\text{nonlinear filtering}
\times
\text{Le Cam}
\times
\text{Wald}.
\]
