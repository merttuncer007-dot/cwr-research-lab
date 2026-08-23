# Start a New GPT/Codex Session

## ChatGPT: public mirror'dan eklentisiz yükleme

Yeni ChatGPT sohbetine repo kökündeki `CHATGPT_GIT_START_PROMPT.txt` içeriğini
gönderin. ChatGPT önce `CHATGPT_START_HERE.md` dosyasını, ardından orada yazan
zorunlu kanonik dosyaları public GitHub mirror `main` dalından yükler. Sahibin
bağlı GitLab kaynağı varsa onu kanonik yazma kaynağı olarak ayrıca doğrular. Başarılı yüklemenin
kanıtı `CWR LAB LOADED` raporudur; erişemediği dosyayı okumuş saymasına izin
verilmez.

Tek giriş bağlantısı:

`https://raw.githubusercontent.com/merttuncer007-dot/cwr-research-lab/main/CHATGPT_START_HERE.md`

## Yerel Codex/GPT oturumu

Yeni oturumda bu klasörü çalışma alanı olarak açın ve modele şunu söyleyin:

> Bu klasördeki CWR laboratuvarını kaldığı yerden devral. Önce `AGENTS.md`, `LAB_KERNEL.md`, `LAB_STATE.md` ve `exports/NEXT_SESSION_CONTEXT.md` dosyalarını oku. Ardından `./lab.ps1 doctor` çalıştır. Sohbet geçmişini source-of-truth sayma; SQLite ve hash'li artifacts kanoniktir. Registry'nin fiziksel kopyası BP-212'de bittiği için BP-213–220'yi yalnız transcript-confirmed/missing-artifact statüsüyle kullan. Sonraki ID BP-221, frontier rank-two PSD scalar-sign reachability. Yeni wave başlamadan `LAB_WAVE_PROTOCOL.md` sözleşmesini uygula.

Başka bir konu için önce context paketi üretin:

```powershell
.\lab.ps1 context --query "aranacak konu" --output .\exports\MY_CONTEXT.md
```

Tam konuşma yalnız eksik provenance kurtarma için okunur; normal devamda yeniden baştan okutulmaz.

