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
