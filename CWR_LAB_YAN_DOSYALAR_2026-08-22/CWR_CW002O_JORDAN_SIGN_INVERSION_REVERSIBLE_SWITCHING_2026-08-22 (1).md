# COLD WAR RENAISSANCE — CW-002O
## Wigner–Yanase Jordan products × reversible Markov switching × Kenison stochastic reachability
### Sign inversion appears after two PSD reversible steps, before complex spectral phase
Date: 2026-08-22
Status: EXACT SYNTHESIS; CORE JORDAN-PRODUCT OBSTRUCTION CLASSICAL

## 1. Literature correction first

CW-002K treated exact equality reachability for one reversible Markov chain as a classical transfer whose explicit Markov-chain collision was still open.

That status was too weak.

George Kenison's 2022 preprint "What is decidable about the Stochastic Reachability Problem?" states explicitly:

> Proposition 16. The Stochastic Reachability Problem with initialisation \((K,x,y,r)\) is decidable if \(K\) is associated with a reversible Markov chain.

The proof is exactly the real-spectrum/Skolem argument:

- reversibility implies real eigenvalues and diagonalizability;
- \(x^\top K^ny-r\) is an LRS with real characteristic roots;
- the relevant real-root Skolem instance is decidable.

Therefore the exact-equality result in CWR-BP-160 is a **direct classical collision**, not merely an unlocated transfer.

The later 2025 real-root Positivity result is still needed for the stronger all-dimensional strict halfspace crossing theorem of CW-002K.

---

# 2. A narrower symmetry question

CW-002N showed that unrestricted products of positive symmetric stochastic kernels can recover non-self-adjoint macro-dynamics.

The next natural restriction is stronger:

\[
\boxed{
S_i\succeq0
}
\]

for every reversible microstep.

Thus each \(S_i\) is:

- symmetric;
- stochastic;
- positive semidefinite;
- hence has spectrum in \([0,1]\).

Does this suppress zero-margin sign changes?

For one step: yes.

For two noncommuting steps: no.

---

# 3. Matched tangent observable

Let

\[
u=\frac1m\mathbf1^\top
\]

be the uniform stationary law.

Take a zero-sum tangent vector

\[
g\in\mathbf1^\perp.
\]

Choose small positive \(\delta,\gamma\) so that

\[
\mu=u+\delta g^\top
\]

is a probability distribution and

\[
f=b\mathbf1+\gamma g
\]

lies in a desired bounded output range, e.g. \(f\in[0,1]^m\).

For any doubly-stochastic word \(S_w\),

\[
uS_w=u,
\qquad
S_w\mathbf1=\mathbf1.
\]

Hence

\[
\boxed{
\mu S_wf-b
=
\delta\gamma\,g^\top S_wg.
}
\]

This is a "matched" initial/observable perturbation: the same tangent direction is used on both sides.

---

# 4. One PSD reversible step cannot invert the sign

If

\[
S=S^\top\succeq0,
\]

then

\[
g^\top Sg\ge0.
\]

Therefore:

### Theorem CW-002O.1 — One-step no-inversion law

For a positive-semidefinite reversible kernel and a matched tangent observable,

\[
\boxed{
\mu Sf\ge b.
}
\]

A single PSD detailed-balance step cannot drive the matched observable below its stationary baseline.

---

# 5. Commuting PSD reversible families cannot invert at any word length

Let

\[
S_1,\ldots,S_k
\]

be pairwise commuting real symmetric PSD matrices.

They are simultaneously orthogonally diagonalizable:

\[
S_i=U\Lambda_iU^\top,
\qquad
\Lambda_i\ge0.
\]

For every word \(w\),

\[
S_w
=
U
\left(
\prod_i\Lambda_i^{n_i(w)}
\right)
U^\top
\succeq0.
\]

Thus:

### Theorem CW-002O.2 — Commuting PSD matched-correlation barrier

For every word over a commuting PSD reversible family,

\[
\boxed{
g^\top S_wg\ge0.
}
\]

Equivalently,

\[
\boxed{
\mu S_wf\ge b
\qquad
\forall w.
}
\]

So matched stationary-boundary crossing is impossible.

This is an unconditional decidability island: the answer to "does the matched observable ever fall below baseline?" is simply **no**.

---

# 6. Two noncommuting PSD factors are enough

For symmetric \(A,B\),

\[
x^\top ABx
\]

is a real scalar and equals its transpose:

\[
x^\top ABx=x^\top BAx.
\]

Therefore

\[
\boxed{
x^\top ABx
=
\frac12
x^\top(AB+BA)x.
}
\]

The matrix

\[
A\circ B
=
\frac12(AB+BA)
\]

is the Jordan product.

Thus two-step sign inversion occurs exactly when the Jordan product has a negative direction.

This obstruction is classical.

Wigner and Yanase (1964) explicitly note that

\[
AB+BA
\]

need not be positive definite even when both \(A\) and \(B\) are positive definite; by continuity their discussion gives positive-definite examples with a negative eigenvalue in the anticommutator.

So the generic two-factor obstruction is prior art.

The new task is to place it inside strictly-positive reversible stochastic dynamics.

---

# 7. Rational source witness

Take

\[
A=
\begin{pmatrix}
1&-2\\
-2&5
\end{pmatrix},
\qquad
C=
\begin{pmatrix}
1&0\\
0&4
\end{pmatrix}.
\]

Both are rational symmetric positive definite.

Take

\[
x=
\begin{pmatrix}
-3\\-1
\end{pmatrix}.
\]

Then

\[
\boxed{
x^\top ACx=-1.
}
\]

Thus the Jordan product has a negative direction.

Yet each individual quadratic response is positive because \(A,C\succ0\).

---

# 8. Stochasticizing the witness

Use the \(4\times4\) Sylvester Hadamard tangent embedding from CW-002N.

Let \(B_H\) consist of two nonconstant Hadamard columns and

\[
\Phi(M)=\frac14B_HMB_H^\top.
\]

Set

\[
J=\frac14\mathbf1\mathbf1^\top,
\qquad
\varepsilon=\frac1{40}.
\]

Define

\[
S_1=J+\varepsilon\Phi(A),
\]

\[
S_2=J+\varepsilon\Phi(C).
\]

Exact calculation gives:

\[
S_1=
\begin{pmatrix}
21/80&11/40&9/40&19/80\\
11/40&5/16&3/16&9/40\\
9/40&3/16&5/16&11/40\\
19/80&9/40&11/40&21/80
\end{pmatrix},
\]

\[
S_2=
\begin{pmatrix}
9/32&43/160&37/160&7/32\\
43/160&9/32&7/32&37/160\\
37/160&7/32&9/32&43/160\\
7/32&37/160&43/160&9/32
\end{pmatrix}.
\]

Both matrices are:

\[
\boxed{
\text{rational, entrywise strictly positive, symmetric, doubly stochastic, PSD}.
}
\]

Their spectra are nonnegative.

---

# 9. Exact two-step stochastic sign inversion

Choose

\[
\mu=
\left(
21/100,\,
27/100,\,
23/100,\,
29/100
\right)
\]

and

\[
f=
\left(
3/10,\,
3/5,\,
2/5,\,
7/10
\right)^\top.
\]

The stationary baseline is

\[
b=\frac12.
\]

Exact rational arithmetic gives:

### One reversible PSD step

\[
\boxed{
\mu S_1f-\frac12
=
\frac1{10000}>0.
}
\]

### Repeating the same PSD kernel

\[
\boxed{
\mu S_1^2f-\frac12
=
\frac1{400000}>0.
}
\]

### Two different noncommuting PSD reversible kernels

\[
\boxed{
\mu S_1S_2f-\frac12
=
-\frac1{800000}<0.
}
\]

So the observable crosses from above its stationary baseline to below it after two locally positive/self-adjoint steps.

---

# 10. Minimality

A one-step inversion is impossible under the matched PSD contract because

\[
g^\top Sg\ge0.
\]

CW-002O constructs a two-step inversion.

Therefore:

### Theorem CW-002O.3 — Minimal sign-inversion length

Within the class of positive-semidefinite reversible kernels and matched tangent observables,

\[
\boxed{
2
}
\]

is the minimum number of noncommuting steps required for stationary-baseline sign inversion.

This is distinct from CW-002N's phase-resurrection result:

- sign inversion requires only \(2\) PSD reversible factors;
- a nonreal eigenvalue pair in the product of positive-definite symmetric factors first requires \(3\).

Thus sign complexity appears **before** complex spectral phase.

---

# 11. Important correction to the phase narrative

CW-002K emphasized that single-operator reversibility removes complex phase arithmetic.

That remains exact.

But for switched systems it would be too strong to say that computational difficulty can return only when complex eigenvalues return.

CW-002O shows a prior mechanism:

\[
\boxed{
\text{Jordan-product indefiniteness / nonnormal directional sign change}.
}
\]

At length two, \(S_1S_2\) can have positive real spectrum while its quadratic numerical range already crosses the negative half-line.

So there are at least two composition defects:

1. **Jordan sign defect** — appears at two factors;
2. **complex phase defect** — can appear at three positive-definite factors.

The first is strictly earlier.

---

# 12. Exact two-step criterion

For matched direction \(g\),

\[
g^\top S_1S_2g<0
\]

iff

\[
g^\top
\left(
\frac{S_1S_2+S_2S_1}{2}
\right)
g<0.
\]

Therefore a two-step inversion exists iff the Jordan product

\[
\boxed{
S_1\circ S_2
=
\frac12(S_1S_2+S_2S_1)
}
\]

is not PSD on the relevant tangent subspace.

This gives a polynomial-time two-step test: compute the smallest eigenvalue of the symmetric Jordan product restricted to \(\mathbf1^\perp\).

For longer words the analogue becomes the symmetric part

\[
\frac12(S_w+S_w^\top),
\]

because

\[
g^\top S_wg
=
g^\top
\frac{S_w+S_w^\top}{2}
g.
\]

This suggests a new verification object:

\[
\boxed{
\text{wordwise Hermitian/Jordan shadow}
}
\]

rather than the spectrum of the nonsymmetric product itself.

---

# 13. A stronger no-crossing condition than reversibility

Reversibility alone says each generator is self-adjoint.

It does not control products.

Pairwise commutation plus PSD says much more:

\[
\boxed{
S_w\succeq0
\quad
\forall w.
}
\]

Thus:

\[
\boxed{
\text{commuting + PSD + reversible}
}
\]

is a genuinely composition-stable sign-regularity condition.

This is stronger than:

- each generator reversible;
- each generator PSD;
- each generator positive definite.

All three individually permit two-step sign inversion once noncommutativity is allowed.

---

# 14. Relation to the symmetric-semigroup sign frontier

CW-002N reduced unrestricted reversible generalized-PFA reachability to

\[
\exists w:
x^\top A_wy>0
\]

for rational symmetric generators.

CW-002O identifies a tractable diagonal slice of this problem:

\[
\boxed{
x=y,\quad
A_i\succeq0,\quad
[A_i,A_j]=0.
}
\]

There the sign is always nonnegative.

Dropping only commutativity is enough to permit negative values in two steps.

Thus any undecidability proof for the symmetric-semigroup sign problem cannot rely on the mere existence of negative one-step modes; it can arise from composition geometry even when every generator is PSD.

Whether PSD symmetric generators already suffice for full scalar-sign undecidability remains open in this audit.

---

# 15. Numerical/exact verification

All identities above were checked with exact rational symbolic arithmetic.

The generated \(4\times4\) stochastic kernels are strictly positive, symmetric, doubly stochastic, and PSD.

The exact sign values are:

\[
+1/10000
\]

after \(S_1\),

\[
+1/400000
\]

after \(S_1^2\),

and

\[
-1/800000
\]

after \(S_1S_2\).

No floating-point argument is used in the theorem.

---

# 16. Literature ownership

## Kenison 2022

Explicit reversible-Markov equality reachability decidability is prior art.

## Wigner–Yanase 1964

Indefiniteness of \(AB+BA\) for positive-definite \(A,B\) is classical.

## Jordan-product spectral literature

Bounds and sign behavior of

\[
AB+BA
\]

for positive matrices have a substantial classical literature.

## CWR synthesis

The exact stochastic statement retained here is:

\[
\boxed{
\text{commuting PSD reversible switching forbids matched sign inversion,}
}
\]

while

\[
\boxed{
\text{two noncommuting positive PSD reversible Markov steps already permit it.}
}
\]

The explicit \(4\)-state rational stochastic witness and its role in the computability phase diagram remain under collision audit.

---

# Verdict

The next obstruction after single-chain reversibility is not complex spectrum.

It is noncommutative Jordan geometry.

For matched stationary observables:

\[
\boxed{
\text{one PSD reversible step: no sign inversion},
}
\]

\[
\boxed{
\text{commuting PSD reversible family: no sign inversion at any length},
}
\]

but

\[
\boxed{
\text{two noncommuting PSD reversible steps: sign inversion is possible}.
}
\]

Thus the first composition-induced failure of spectral positivity occurs at length two, one step before complex spectral phase can appear.
