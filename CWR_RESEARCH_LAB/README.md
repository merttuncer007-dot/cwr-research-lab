# CWR Persistent Research Lab

Bu klasör sohbetten bağımsız, yerel ve yeniden kurulabilir araştırma laboratuvarıdır.

Ana ilke:

> Sohbet laboratuvar değildir. Sohbet, kalıcı laboratuvara bağlanan geçici bir araştırmacıdır.

Laboratuvar üç şeyi birbirine karıştırmadan saklar:

1. **Ham kanıt ve provenance:** konuşmalar, dosyalar, ZIP üyeleri, isimleri ve SHA-256 kimlikleri.
2. **Kanonik araştırma durumu:** doğrulanmış son sayaç, aktif frontier, açık çelişkiler ve checkpoint'ler.
3. **Yöntem:** bir sonraki araştırmacının aynı epistemik disiplini uygulaması için kernel, wave protokolü ve taşınabilir skill.

## Hızlı başlangıç

PowerShell'de bu klasöre geçin:

```powershell
.\lab.ps1 status
.\lab.ps1 search "rank two PSD"
.\lab.ps1 context --query "rank two PSD scalar sign" --output .\exports\NEXT_CONTEXT.md
```

Yeni bir GPT/Codex oturumunda önce [AGENTS.md](AGENTS.md), [LAB_KERNEL.md](LAB_KERNEL.md), [LAB_STATE.md](LAB_STATE.md) ve üretilen context paketini verin. Tüm transkripti yeniden okutmak yalnız provenance kurtarma gerektiğinde yapılmalıdır.

## Komutlar

```text
init                         Veritabanını ve dizinleri kurar
ingest PATH...               Dosya/klasörleri ve ZIP üyelerini içerir
status                       Laboratuvarın kanonik durumunu gösterir
search QUERY                 Yerel tam metin araması yapar
context --query QUERY        Yeni oturum için kaynaklı context paketi üretir
doctor                       SQLite, hash, sayaç ve state tutarlılığını denetler
checkpoint --label LABEL     Tutarlı DB kopyası ve SHA-256 manifesti üretir
add-paper ...                Makale veya özetini okuma kapsamıyla kaydeder
new-wave ...                 Araştırma dalgası için doldurulabilir kayıt açar
```

`data/lab.sqlite3` tek sorgulanabilir veritabanıdır. `objects/sha256/` içerik-adresli ham nesneleri taşır. Aynı içerik bir kez saklanır; her fiziksel dosya adı ve her ZIP üyesi `occurrences` tablosunda ayrı provenance kaydıdır.

## Bilinen başlangıç bütünlük durumu

Mevcut fiziksel registry v0.19, CWR-BP-212'de biter. Tam konuşmanın son cevabı ve `LAB_STATE.md`, CWR-BP-213–220'nin üretildiğini ve sıradaki kaydın BP-221 olduğunu doğrular; ancak konuşmada bağlantı olarak görünen registry v0.20, CW-002P notu ve ilgili güncel bundle bu klasöre fiziksel ek olarak ulaşmamıştır. Sistem bu kuyruğu “kurtarılabilir fakat canonical dosyası eksik” şeklinde işaretler; sessizce uydurmaz.

## Otomasyon sınırı

Makrolar/autonomous waves bu sürümde varsayılan olarak kapalıdır. Önce deterministik ingest, source ledger, status geçişleri, checkpoint ve rehydration güvenilir hale getirilmiştir. Sonraki aşama [LAB_AUTOMATION_ROADMAP.md](LAB_AUTOMATION_ROADMAP.md) içindeki kapılara bağlıdır.

## ChatGPT ve Codex plugin bağlantısı

Repo kökündeki `plugins/cwr-research-lab/` paketi bu laboratuvara salt-okunur MCP erişimi verir. Codex için yerel stdio, ChatGPT için aynı araçları sunan Streamable HTTP taşıması bulunur. Plugin araştırma kaydı üretmez, veritabanını değiştirmez ve GitLab'a otomatik push yapmaz; `gitlab_backup_status` yalnız yerel yedek durumunu denetler.

## ChatGPT için eklentisiz GitLab açılışı

Yeni bir ChatGPT sohbetinde repo kökündeki `CHATGPT_GIT_START_PROMPT.txt`
metnini kullanın. Bu prompt `CHATGPT_START_HERE.md` kanonik yükleyicisine gider;
ChatGPT yalnız gerekli kernel, state ve session-context dosyalarını `main`
dalından sırayla okur ve başlamadan önce doğrulanabilir `CWR LAB LOADED` raporu
verir. GitLab erişimi yoksa protokol fail-closed davranır ve okunmamış içeriği
varmış gibi göstermez.
