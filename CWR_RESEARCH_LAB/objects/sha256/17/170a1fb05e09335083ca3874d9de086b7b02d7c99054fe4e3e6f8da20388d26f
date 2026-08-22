# CWR / DCSG LAB ENTITY v1

Bu paket, lab'ın "chat hafızası"na bağlı olmadan yeniden kurulabilmesi için tasarlanmış kalıcı çekirdektir.

Ana fikir:

**ChatGPT oturumu lab değildir. ChatGPT, lab veritabanına bağlanan geçici bir istemcidir.**

Bu nedenle yeni sohbette bütün eski konuşmaları yeniden okutmak yerine:
1. `LAB_BOOTSTRAP.md`
2. `LAB_KERNEL.md`
3. `LAB_STATE.md`
4. yalnız ilgili araştırma modülleri / kaynak kayıtları

yüklenir veya bağlı depodan çekilir.

Ham konuşmalar immutable kanıt katmanında tutulur; canonical theorem/claim/source kayıtları ayrıca normalize edilir.

## Katmanlar

- `raw/` — değiştirilmeyen konuşma ve kaynak arşivi (bu starter pakette henüz kullanıcı konuşma dump'ları yok).
- `canonical/` — authoritative registry, handoff ve source ledger.
- `lab.sqlite` — queryable metadata, byproduct registry, artifact catalog ve full-text chunks.
- `LAB_KERNEL.md` — lab'ın çalışma refleksleri / metodolojisi.
- `LAB_STATE.md` — şu anki frontier, ID sayaçları, son checkpoint.
- `LAB_BOOTSTRAP.md` — yeni chat rehydration protokolü.
- `LAB_INGEST_PROTOCOL.md` — yeni konuşmaların ve kaynakların nasıl içeri alınacağı.
- `LAB_RETRIEVAL_POLICY.md` — önce lab içi arama, sonra gerekiyorsa web.
- `scripts/ingest_conversations.py` — archived `.txt/.md` konuşmaları veritabanına eklemek için başlangıç scripti.

## Dayanıklılık ilkesi

Hiçbir canonical bilgi yalnızca sohbet içinde yaşamamalı. Her research wave sonunda:
- yeni theorem/byproduct kayıtları registry'ye eklenir;
- source ledger güncellenir;
- `LAB_STATE.md` güncellenir;
- değişen dosyaların hash'i manifest'e yazılır;
- Git/Drive gibi harici kalıcı depoya push/upload yapılır.
