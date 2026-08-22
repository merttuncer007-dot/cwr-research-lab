# CWR ChatGPT Git Rehydration Protocol

Bu dosya, CWR Research Lab'i **özel CWR eklentisi olmadan** yeni bir ChatGPT
sohbetine GitLab üzerinden yüklemek için tek kanonik giriş noktasıdır.

## Repository identity

- GitLab project: `merttuncer07/cwr-research-lab`
- Canonical branch: `main`
- Project URL: `https://gitlab.com/merttuncer07/cwr-research-lab`
- This loader's raw URL:
  `https://gitlab.com/merttuncer07/cwr-research-lab/-/raw/main/CHATGPT_START_HERE.md`

ChatGPT GitLab'a bağlıysa projeyi bağlı GitLab kaynağından aç. Bağlı kaynak
yoksa yukarıdaki proje/raw URL'lerini dene. Erişim başarısızsa dosyaları okumuş
gibi davranma; kullanıcıdan bu dosyayı veya aşağıdaki zorunlu dosyaları
yüklemesini iste.

## Mandatory load order

Aşağıdaki dosyaları `main` dalından ve tam olarak bu sırayla oku:

1. `CHATGPT_START_HERE.md`
2. `CWR_RESEARCH_LAB/AGENTS.md`
3. `CWR_RESEARCH_LAB/LAB_KERNEL.md`
4. `CWR_RESEARCH_LAB/LAB_STATE.md`
5. `CWR_RESEARCH_LAB/exports/NEXT_SESSION_CONTEXT.md`

Yeni araştırma dalgası başlatılacaksa ayrıca şunları oku:

6. `CWR_RESEARCH_LAB/LAB_WAVE_PROTOCOL.md`
7. `CWR_RESEARCH_LAB/LAB_RETRIEVAL_POLICY.md`

Tam arşivi, bütün konuşmayı, `objects/sha256/` ağacını veya tüm eski registry
sürümlerini başlangıçta okuma. Bunları yalnız zorunlu dosyaların işaret ettiği
somut provenance/kanıt ihtiyacında aç.

## Source-of-truth order

Çelişki halinde öncelik sırası:

1. `CWR_RESEARCH_LAB/data/lab.sqlite3` içindeki kanonik kayıtlar ve doğrulanmış
   checkpoint'ler (erişilebilir ve sorgulanabilir olduğunda),
2. `CWR_RESEARCH_LAB/LAB_STATE.md`,
3. `CWR_RESEARCH_LAB/exports/NEXT_SESSION_CONTEXT.md`,
4. kanonik registry/source artifacts,
5. eski handoff dosyaları,
6. sohbet belleği.

SQLite GitLab arayüzünden sorgulanamıyorsa bunu belirt; metin dosyalarındaki
kanıt sınırını aşma. `TRANSCRIPT-CONFIRMED / CANONICAL-ARTIFACT-MISSING`
kayıtlarını kesin/verbatim kanonik kayıt gibi yeniden üretme.

## Required initialization response

Zorunlu dosyaları okuduktan sonra araştırmaya hemen başlama. Önce yalnız şu
yükleme raporunu üret:

```text
CWR LAB LOADED
repository: merttuncer07/cwr-research-lab
branch: main
files_read: [gerçekte okunan dosyalar]
latest_confirmed_byproduct: ...
next_byproduct: ...
current_frontier: ...
integrity_limit: ...
ready_for_instruction: yes|no
```

Her alanı okunan dosyalardan çıkar. Erişilemeyen veya doğrulanamayan alanı
`unknown` yaz; tahmin etme. `files_read` listesine yalnız içeriği gerçekten
alınmış dosyaları koy.

## Operating contract after loading

- Sohbet geçmişini laboratuvarın kendisi veya source-of-truth sayma.
- Kaynak bulundu, ilgili bölüm okundu, kanıt denetlendi ve eser baştan sona
  okundu iddialarını ayır.
- Yeni iddia için önce ucuz yıkıcı test, sonra exact core, finite check ve
  collision/ownership audit uygula.
- Kullanıcı açıkça istemeden GitLab'a yazma, commit/push yapma, dış sisteme veri
  gönderme veya otonom araştırma makrolarını başlatma.
- Oturum sonunda kalıcılaştırılacak değişiklikleri kullanıcıya dosya bazında
  listele; yazma yetkisi yoksa uygulanabilir patch/handoff üret.

