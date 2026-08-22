CWR RESEARCH LAB - OZEL PLUGIN KURULUM PAKETI

Bu paket public Plugins Directory icin degildir. Yerel/private marketplace paketidir.
Yalniz ZIP dosyasini verdiginiz kisiler paketi kurabilir.

ONEMLI GIZLILIK UYARISI

ZIP, plugin kodunun yaninda CWR veritabanini ve arsiv nesnelerini de tasir.
Dosyaya erisen kisi arsivdeki icerigi okuyabilir. Paketi yalniz guvendiginiz kisilerle paylasin.
Dosya sahipligi tek basina sifreleme veya kimlik dogrulama saglamaz.

KURULUM (WINDOWS)

1. ZIP'i kalici bir klasore tamamen cikartin. Kurulumdan sonra bu klasoru silmeyin veya tasimayin.
2. PowerShell'i acin ve cikartilan klasore gidin.
3. Su komutlari calistirin:

   Set-ExecutionPolicy -Scope Process Bypass
   .\INSTALL_CWR_PRIVATE_PLUGIN.ps1

   Yalniz dosya butunlugunu kontrol etmek icin:

   .\INSTALL_CWR_PRIVATE_PLUGIN.ps1 -VerifyOnly

4. ChatGPT/Codex masaustu uygulamasini tamamen kapatip yeniden acin.
5. Plugins Directory icinde yerel "Personal" kaynagindan CWR Research Lab'i kontrol edin.
6. Yeni bir task acin ve "Show the current CWR lab state" yazin.

PAKETIN YAPMADIKLARI

- Public plugin kataloguna gondermez veya yayinlamaz.
- Internet uzerinde MCP sunucusu acmaz.
- Otomatik Git commit/push yapmaz.
- Arastirma kaydi, byproduct veya wave uretmez.
- CWR veritabanini degistirmez; MCP araclari salt-okunurdur.

ChatGPT web yuzeyinde yerel MCP calismasi garanti edilmez. Bu paket ChatGPT/Codex masaustu
uygulamasindaki local marketplace dagitimi icin hazirlanmistir.
