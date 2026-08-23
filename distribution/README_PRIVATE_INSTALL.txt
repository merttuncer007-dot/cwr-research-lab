CWR RESEARCH LAB - OZEL PLUGIN KURULUM PAKETI

Bu paket public Plugins Directory icin degildir. Yerel/private marketplace paketidir.
Yalniz ZIP dosyasini verdiginiz kisiler paketi kurabilir.

ONEMLI GIZLILIK UYARISI

ZIP, plugin kodunun yaninda CWR veritabanini ve arsiv nesnelerini de tasir.
Dosyaya erisen kisi arsivdeki icerigi okuyabilir. Paketi yalniz guvendiginiz kisilerle paylasin.
Dosya sahipligi tek basina sifreleme veya kimlik dogrulama saglamaz.

KURULUM (WINDOWS)

1. ZIP'i bir klasore tamamen cikartin.
2. `KURULUMU_BASLAT.cmd` dosyasina cift tiklayin. Kurucu once butun hash'leri
   dogrular, sonra paketi LOCALAPPDATA altinda kalici ve kullaniciya ozel bir
   dizine kopyalar. Cikartilan gecici klasore bagimli kalmaz.
3. Komut satirindan kurmak isterseniz cikartilan klasorde sunu calistirin:

   Set-ExecutionPolicy -Scope Process Bypass
   .\INSTALL_CWR_PRIVATE_PLUGIN.ps1

   Yalniz dosya butunlugunu kontrol etmek icin:

   .\INSTALL_CWR_PRIVATE_PLUGIN.ps1 -VerifyOnly

4. Plugin araclari mevcut task'ta gorunmezse yeni bir Codex task'i acin.
5. Plugins Directory icinde yerel "CWR Private" kaynagindan CWR Research Lab'i kontrol edin.
6. Yeni bir task acin ve "Show the current CWR lab state" yazin.

YABANCI BILGISAYAR / BASKA KULLANICI

- Paket Git parolasi, token, SSH private key, OpenAI API key, tunnel key veya
  makineye bagli DPAPI secret tasimaz.
- Paket kendi icinde tam bir offline CWR snapshot'i tasir; Codex ilk acilista GitLab
  erisimi olmasa da bu snapshot'i kullanabilir.
- Yabanci kullanici uzak arsive public, read-only GitHub mirror'dan ulasir:
  https://github.com/merttuncer007-dot/cwr-research-lab
  GitLab hesabi veya token gerekmez. GitLab sahibin kanonik yazma kaynagi olarak
  private kalir.
- ChatGPT web, yerel Codex plugin ZIP'ini sohbet icinden isletim sistemine kuramaz.
  ChatGPT icin kullanicinin kendi OpenAI/Platform hesabi, gelistirici modu app
  baglantisi ve kendi Secure MCP Tunnel kimligi gerekir. Sahibin tunnel key'i veya
  DPAPI dosyasi baskasina kopyalanmaz.

PAKETIN YAPMADIKLARI

- Public plugin kataloguna gondermez veya yayinlamaz.
- Internet uzerinde MCP sunucusu acmaz.
- Otomatik Git commit/push yapmaz.
- Arastirma kaydi, byproduct veya wave uretmez.
- CWR veritabanini degistirmez; MCP araclari salt-okunurdur.

ChatGPT web yuzeyinde yerel MCP calismasi garanti edilmez. Bu paket ChatGPT/Codex masaustu
uygulamasindaki local marketplace dagitimi icin hazirlanmistir.

