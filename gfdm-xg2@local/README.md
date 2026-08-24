# GuitarFreaks / DrumMania XG2 local server

Local restoration plugin for K32 DrumMania XG2 and K33 GuitarFreaks XG2.

## Restored features

- Card registration, player profiles, name changes and K32/K33 independent saves.
- Standard/Classic score records with best-score merging, Clear/FC/Excellent,
  achievement, rank and combo persistence.
- XG/Classic Skill totals and per-song Skill composition, Ability emblems,
  recent-play data and Trophy persistence.
- Live Point and XG2+ progression, all 48 Result/Records reward icons, Custom
  selections, SECRET MUSIC and MASTER chart grants.
- Group creation/search/membership, Group icons, shared Group Live Point,
  Community play/event logs and Cooperation Challenge progress/rewards.
- Persistent three-song Shop Trial results and fixed 200-place rankings.
- Archived game/event settings, Demo data, lobby matching, collaboration
  registration, information endpoints and cabinet/facility registration.
- Facility links used by the game:
  `http://eagate.573.jp` and `http://am.573.jp`.

## Profile WebUI

The card profile page provides:

- player-name editing;
- merged Records score viewing;
- K32/K33 Skill objects with song names (Standard 25+25; Classic 14+36+LONG 3);
- default game-mode adjustment (Practice, Standard or Classic);
- read-only K32/K33 saved Custom-state summaries;
- Group icon adjustment for the Group owner (native icon range 0-9).

Score and Skill views are read-only. Settings use server-side validation and
write-back verification; raw profile JSON and shared Custom/Live Point slots
are not exposed for editing.

## Notes

K32 and K33 keep personal progress separately. Group membership and Group
progress are intentionally shared across both games.

`tests/protocol-smoke.ps1` writes test cards, scores, Groups and event data.
Run it only on a disposable Core using fresh savedata and loopback port 8084;
never run it against the live 8083 instance.
