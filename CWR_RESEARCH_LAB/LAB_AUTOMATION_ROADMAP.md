# Automation Roadmap — Disabled by Default

Amaç ileride araştırma dalgalarını makrolarla tekrarlanabilir kılmaktır; bu sürüm kendi kendine araştırma başlatmaz.

## Aşama 1 — mevcut sürüm

- Content-addressed ingest
- SQLite + FTS
- Source/read-scope ayrımı
- Deterministic context export
- Doctor ve checkpoint
- Wave template

## Aşama 2 — insan onaylı yardımcı makrolar

- Frontier'dan interaction-cell adayları üretme
- Karşıörnek/test kuyruğu
- Birincil kaynak collision checklist'i
- Claim/status diff'i
- Her dış ağ veya Git işlemi öncesi açık onay

## Aşama 3 — kontrollü tekrar döngüsü

- Sabit bütçe ve durdurma koşulu
- Her wave için insan onay kapısı
- Exact/provisional ayrımını zorlayan validator
- Kaynak ve artifact olmadan promotion engeli
- Başarısız branch arşivleme

## Aşama 4 — otonomi adayı

Yalnız şu invariants uzun süreli testlerle sağlanırsa:

- state kaybından deterministic recovery,
- kaynak sahipliği hatalarının ölçülmesi,
- false novelty ve false proof oranlarının kabul sınırı,
- dış side-effect izinlerinin ayrı tutulması,
- bütçe, durdurma ve insan override mekanizması.

Autonomy üretim hacmi için değil, aynı epistemik protokolü güvenilir biçimde tekrar etmek için değerlendirilmelidir.
