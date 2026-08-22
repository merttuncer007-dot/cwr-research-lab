# CWR / DCSG LAB HANDOFF — 2026-08-22

## Purpose
This file is a continuity checkpoint for starting a new ChatGPT conversation without losing the research state.

## Current Cold War Renaissance state
- Canonical registry: `COLD_WAR_RENAISSANCE_BYPRODUCT_REGISTRY.md`
- Latest snapshot: `COLD_WAR_RENAISSANCE_BYPRODUCT_REGISTRY_v0_18.md`
- Registry currently reaches **CWR-BP-202**.
- Next new byproduct ID: **CWR-BP-203**.
- Current main thread: **CW-002**, especially the transition from reversible Markov verification to symmetric matrix-semigroup sign reachability.

## Latest theorem line
The most recent research note is:

`CWR_CW002N_HADAMARD_TANGENT_STOCHASTICIZATION_2026-08-22.md`

Main exact reduction:

For rational symmetric source matrices `A_i`, a Hadamard tangent embedding

`Phi(A) = (1/m) B A B^T`

is multiplicative and transpose preserving. For sufficiently small rational `epsilon`,

`S_i = J + epsilon Phi(A_i)`

are strictly positive symmetric doubly-stochastic Markov kernels and

`S_w = J + epsilon^|w| Phi(A_w)`.

With suitable rational probability initial law `mu` and generalized output `f in [0,1]^m`,

`mu S_w f - 1/2 = positive_constant * epsilon^|w| * x^T A_w y`.

Therefore unrestricted positive reversible stochastic switching contains the scalar-sign problem for rational symmetric matrix semigroups.

## Current highest-priority frontier
**CWR-BP-198 — Symmetric matrix-semigroup scalar sign frontier**

Given rational symmetric generators `A_1,...,A_k` and rational vectors `x,y`, decide whether

`exists w : x^T A_w y > 0`.

This is now the cleanest route to the unrestricted reversible-switching problem.

If this problem is undecidable, the Hadamard stochasticization immediately transfers that undecidability to unrestricted free products of strictly-positive symmetric doubly-stochastic kernels, under the explicit generalized-output contract.

If it is decidable, that would explain a genuine computability regularization caused by symmetric generators.

## Important surviving distinction
CWR-BP-201 remains open:

The current unrestricted reduction uses a generalized output vector `f in [0,1]^m`.

It does **not** yet reduce to a literal single accepting-state indicator while preserving symmetric positive generators.

Do not silently conflate:
- generalized halfspace output;
- single target-state acceptance.

## Recent chain of notes
- CW-002E: weighted pair synchronization undecidability.
- CW-002F: strict positivity / uniform scrambling decidability island.
- CW-002G: leaktight support-limit interpretation.
- CW-002H: stationary-cutpoint singularity.
- CW-002I: trivial-support zero-margin undecidability.
- CW-002J: stationary-cutpoint / LRS dictionary.
- CW-002K: reversibility gives arbitrary-dimensional one-generator discrete decidability.
- CW-002L: periodically forced reversible microsteps can be undecidable.
- CW-002M: binary bistochastic phase coding.
- CW-002N: Hadamard tangent stochasticization; clock-removal reduced to symmetric semigroup sign reachability.

## Research discipline
- Continue in Turkish.
- New research is PROVISIONAL/SCRATCH unless explicitly promoted.
- Preserve every independent byproduct; never delete an old entry, only update status.
- Collision-audit every novelty candidate.
- Do not claim primary sources were read cover-to-cover.
- Distinguish theorem, numerical check, collision, conjecture, and open question.
- Exactness/impossibility is the final validation target, not the initial filter.

## Archive discipline
This ZIP contains the generated CWR/DCSG lab artifacts present in `/mnt/data` at archive creation time.
A SHA-256 manifest is included.
