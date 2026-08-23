# CWR Rehydration Capsule

schema: cwr.rehydration-capsule.v2
snapshot_id: 2de3676e40b54a9117351ad755db85a859614520c60e98c51ff3560d3b5f7720
ready_for_instruction: yes
working_mode: verified_snapshot
live_bridge_available: not_checked

## Research pointer

- latest confirmed byproduct: CWR-BP-220
- next byproduct: CWR-BP-221
- last completed wave: CW-002P — Rank-one PSD sign reachability as a finite signed-walk problem
- current frontier: rank-two PSD / symmetric matrix-semigroup scalar-sign reachability
- immediate attack: rank ≤ 2 PSD projective normal form; collide with 2×2 rational semigroups, Möbius dynamics, zero-in-corner and mortality.

## Verified coverage

- blobs: 75/75
- occurrences indexed: 176
- documents indexed: 75
- conversation turns indexed chronologically: 88
- byproducts indexed: 220
- registry artifact boundary: CWR-BP-212

## Integrity issues (preserved, not hidden)

- [WARNING] registry_tail_missing: Confirmed state reaches BP-220, but available registry artifacts reach only BP-212.
- [INFO] autonomy_disabled: Autonomous research macros are intentionally disabled in lab v1.

## Context contract

The capsule is the verified working-state projection, not a replacement for canonical evidence.
Exact bytes remain addressable by document ID and SHA-256 in the local database/object store.
Retrieve full records or cited line ranges only when the active query needs them.
An unavailable MCP bridge changes connectivity mode; it does not invalidate a verified local/static snapshot.

## Canonical kernel

# CWR Lab Kernel v1

## Amaç

20. yüzyılın birbirinden kopuk güçlü araştırma programlarını çağdaş matematik, hesaplama ve AI araçlarıyla kontrollü interaction cell'lere sokmak; terk edilmiş veya sınırda kalmış fikirlerden exact, bağımsız değeri olan byproduct'lar üretmek.

Üretim hedefin kendisidir; byproduct sözcüğü “önemsiz yan ürün” değil, ana teoriden bağımsız yaşayabilen kalıcı araştırma düğümü anlamına gelir.

## Epistemik omurga

Her araştırma dalgası şu döngüyü izler:

1. **Frontier seç:** Tek cümlelik, karar verilebilir bir hedef ve açık sözleşme belirle.
2. **Interaction hypothesis:** Eski program A'nın mekanizması ile program B'nin sınırlamasının nerede temas ettiğini yaz.
3. **Cheap destructive test:** En küçük boyut, uç durum, degeneracy, commutativity/rank/support/margin ayrımı veya bilgisayar cebiriyle adayı öldürmeye çalış.
4. **Exact core:** Hayatta kalan ifadeyi varsayımlarıyla teorem/lemma/reduction biçiminde ispatla.
5. **Finite check:** Kanıtın yerine geçmeyecek sembolik/sayısal kontrol üret; seed, kod, exact arithmetic ve beklenen invariant'ı kaydet.
6. **Collision/ownership audit:** Birincil kaynaklarda aynı çekirdeği ara. Klasik motor, CWR çıkarımı ve unresolved novelty parçalarını ayrı yaz.
7. **Status:** `SEED`, `ACTIVE`, `PROVISIONAL`, `PROVED`, `EXACT`, `CLASSICAL-COLLISION`, `CORRECTION`, `PROMOTE` veya `RETIRED` statüsünü kanıt düzeyine göre ata.
8. **Harvest:** Sonuç ana teoriden bağımsız değer taşıyorsa append-only byproduct olarak kaydet. Başarısız dalı da neden başarısız olduğuyla koru.
9. **State transition:** Frontier, next ID, source ledger, artifact ve integrity kayıtlarını güncelle; checkpoint al.

## Exactness-last, interaction-first

Exactness laboratuvarın vazgeçilmez bitiş kriteridir; başlangıç filtresi değildir. Önce verimli interaction kurulur, sonra yanlış iddia en ucuz testle öldürülür, kalan çekirdek exact hale getirilir. Bu, “constraint'e erken düşüp” olası byproduct alanını kapatmayı engeller.

## Kalıcı ayrımlar

- Ham konuşma ≠ kanonik state.
- Sayısal doğrulama ≠ ispat.
- Bibliyografik keşif ≠ kaynak okuma.
- Klasik teorem ≠ CWR'nin yeni çıkarımı.
- Matematiksel doğruluk ≠ novelty.
- Yerel reversible adım ≠ composition-stable reversibility.
- Support davranışı ≠ vanishing signed tangent davranışı.
- Generalized output ≠ tek accepting-coordinate sözleşmesi.

## Veri ilkeleri

- Registry append-only'dir; düzeltme eski kaydı silmez, status event ekler.
- Aynı bytes tek içerik nesnesidir; her isim/kopya ayrı provenance occurrence'dır.
- Her iddia mümkünse source locator, okuma kapsamı, proof artifact ve collision statüsüne bağlanır.
- Son state eski handoff'a üstün gelir, fakat çelişki kayıt altına alınır.
- Rehydration önce kernel/state, sonra kanonik registry/source ledger, sonra yalnız ilgili artifacts; tam transkript en son provenance kurtarma içindir.


## Canonical state

# CWR Lab State — Recovered 2026-08-23

## Confirmed research pointer

- Latest confirmed byproduct: `CWR-BP-220`.
- Next byproduct: `CWR-BP-221`.
- Last completed wave: `CW-002P — Rank-one PSD sign reachability as a finite signed-walk problem`.
- Current frontier: `rank-two PSD / symmetric matrix-semigroup scalar-sign reachability`.
- Immediate attack: rank ≤ 2 PSD projective normal form; collide with 2×2 rational semigroups, Möbius dynamics, zero-in-corner and mortality.

## Active high-value nodes

- `CWR-BP-198`: rational symmetric matrix-semigroup scalar-sign reachability.
- `CWR-BP-201`: generalized-output versus single-target reversible reachability gap.
- `CWR-BP-211`: PSD symmetric-semigroup scalar-sign frontier.
- `CWR-BP-220`: rank-one PSD signed-walk classification and finite witnesses.

## Available canonical-material boundary

- Available registry snapshot: v0.19 through `CWR-BP-212`.
- BP-213–220 are confirmed by the full conversation's final assistant turn and summarized there.
- The referenced v0.20 registry, CW-002P full theorem note, exact check file and refreshed handoff/bundle are not physically present in the supplied archive.
- Until recovered, BP-213–220 must be marked `TRANSCRIPT-CONFIRMED / CANONICAL-ARTIFACT-MISSING`, not reconstructed as verbatim canonical entries.

## Safety and truth conditions

- Do not claim pre-account-switch raw transcript recovery beyond files actually present.
- Do not claim books/papers were read cover-to-cover unless the source ledger explicitly says so.
- Preserve failed branches and classical collisions.
- The latest confirmed state wins over older handoffs, but every conflict remains queryable.
- Autonomous macros remain disabled.


