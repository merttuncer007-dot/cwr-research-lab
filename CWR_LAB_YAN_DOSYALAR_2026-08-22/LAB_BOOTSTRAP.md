# LAB_BOOTSTRAP — new Chat / new device loader

Yeni bir ChatGPT sohbetinde önce bu dosyayı ver/bağlı depodan açtır.

## Rehydration order

1. `LAB_KERNEL.md` — çalışma refleksleri.
2. `LAB_STATE.md` — current frontier ve counters.
3. `canonical/COLD_WAR_RENAISSANCE_BYPRODUCT_REGISTRY.md` — mevcut topic/theorem/failure inventory.
4. `canonical/CWR_SOURCE_READING_LEDGER_2026-08-22.md` — daha önce gerçekten incelenmiş kaynaklar.
5. Sadece current frontier ile ilgili artifact'ları `LAB_CATALOG.md` veya `lab.sqlite` üzerinden bul ve oku.
6. Ham konuşma dump'larını yalnız provenance/detail recovery gerektiğinde aç.

## Zorunlu davranış

- Lab'ı sıfırdan yeniden kurma.
- Daha önce local archive'da bulunan literature work'ü web'de baştan yapma.
- Önce local retrieval yap.
- Registry append-only.
- Yeni byproduct ID'sini `LAB_STATE.md`den al.
- Her wave sonunda registry + source ledger + state + manifest güncellensin.
- Yeni chatte "aynı instance'ı taklit etmeye" çalışma; bu dosyalar üzerinden deterministik rehydration yap.

## Yeni chate gönderilecek kısa komut

> Bu paket CWR/DCSG labının authoritative persistent state'idir. Önce LAB_KERNEL ve LAB_STATE'i oku; sonra canonical registry ve source ledger'ı local source of truth olarak kullan. Current frontier için LAB_CATALOG/lab.sqlite'dan ilgili artifact'ları getir. Aynı literature araştırmasını web'de sıfırdan tekrarlama; web'i yalnız local arşiv yetersizse veya fresh collision audit gerekiyorsa kullan. Registry append-only kalsın ve yeni ID LAB_STATE'teki sıradan devam et.
