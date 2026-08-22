# Retrieval and Rehydration Policy

Yeni bir oturumun amacı eski asistanın üslubunu taklit etmek değil, aynı kanonik state ve yöntemden deterministik biçimde yeniden başlamaktır.

## Okuma sırası

1. `LAB_KERNEL.md`
2. `LAB_STATE.md`
3. `doctor` sonucu ve açık integrity issues
4. En güncel erişilebilir registry kayıtları
5. Source-reading ledger
6. Sorguya göre FTS ile seçilen theorem/handoff/check parçaları
7. Yalnız provenance veya kayıp kayıt kurtarma gerekirse tam konuşma

## Context paketi kuralları

- Her alıntı `document id`, dosya adı, SHA-256 ve satır/chunk locator taşır.
- Yeni ve eski snapshot çakışırsa newer state açıkça belirtilir.
- Duplicate dosyalar arama skorunu yapay biçimde büyütmez; içerik bir kez indekslenir.
- “Canonical artifact missing” kaydı context içinde görünür kalır.
- Paket, model context sınırına göre ilgili parçaları seçer; veritabanı tam arşivi korumaya devam eder.

## Gelecek vector search

SQLite FTS yerel kaynak-of-truth'tur. İstenirse sonraki etapta aynı chunk kimlikleri ve metadata ile uzak vector store ikincil retrieval katmanı olabilir. Uzak indeks authoritative olmayacak; sonuçlar yerel SHA-256/document kimliklerine geri bağlanacaktır.
