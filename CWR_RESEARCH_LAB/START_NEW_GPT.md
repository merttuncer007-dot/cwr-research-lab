# Start a New CWR Instance v2

## ChatGPT

Upload only `Matroyshka.zip` and write `Başlat.` The loader first tries one
`rehydrate_lab` call. If the live bridge is unavailable it uses the verified
offline bootstrap in the ZIP; live connectivity is optional, not a readiness
gate.

Without the ZIP, send `CHATGPT_GIT_START_PROMPT.txt`. It fetches one static public
bootstrap file and does not walk the Git history or content-object tree.

## Codex

Open the extracted package/workspace and run:

```cmd
CWR_RESEARCH_LAB\rehydrate.cmd
```

or ask Codex to execute the `MATRYOSHKA.txt` CODEX route. The deterministic pass
verifies every content object and the chronology index without loading every byte
into model context. Exact evidence remains retrievable from SQLite by locator.

## Success criterion

The instance is ready when archive integrity and the research pointer pass. Open
integrity warnings remain visible. Plugin/tunnel/Git availability affects working
mode, not the validity of a verified local/static snapshot.


