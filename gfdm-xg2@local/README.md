# GuitarFreaks / DrumMania XG2 local server

Local restoration plugin for the K32 (DrumMania) and K33
(GuitarFreaks) game builds.

Implemented routes:

- cabinet registration and global game settings
- demo/hit-chart startup data
- new-player registration and returning-player lookup
- player customization and unlock data
- end-of-game profile persistence
- per-song and per-chart best score, achievement, rank, combo and
  Clear/FC/Excellent persistence, independently merged and isolated by
  K32/K33, XG/Classic/Practice, player kind and sequence slot
- late-XG2 free-song, boss, event, information and collaboration data
- full rival/profile readback and XG score containers
- persistent group creation, lookup, listing, joining, editing and withdrawal
- persistent Community Log play/event rings (15/5 member slots and 15/5 group
  slots), including recovered group-create/join history
- persistent Cooperation Challenge selection plus per-player and per-group
  progress for the 26 GF and 26 DM definitions recovered from `coop_data.xml`
- persistent shop-trial configuration, submissions and 200-place rankings
- local lobby registration, exclusion filtering, expiry and candidate matching
- local shop-championship standings derived from persisted player sessions
- persistent jubeat collaboration registration and reward checks
- information-image endpoint defaults

Archive feature switches (all require a CORE restart):

- `xg2_plus_enabled`, `xg2_plus_term` and `xg2_plus_unlock_policy` control the
  15-step XG2+ LivePoint unlock campaign. The archive default is fully open.
- `xg_extra_rush_level` selects the XG EXTRA RUSH level (the recovered final
  XG2 level is 15; the independent V-era level remains 14).
- `live_point_term` advertises the recovered LivePoint/group season.
- `shop_trial_enabled` controls the local three-song Shop Event.
- `shop_championship_term` and `group_competition_term` default to off while
  their historical seasons remain opt-in. `cooperation_challenge_enabled`
  defaults to on and provides the recovered GF/DM catalog and persistent
  progress; preset Community Log comments and reward-grant side effects remain
  future work.
- `append_festival_mode` supports `off`, `active` and the archive-friendly
  `ended` state. In `ended`, the reward song remains available without an
  active-event notice.

Scores created by older revisions did not record enough dimensions to decide
whether they belonged to GF/DM, XG/Classic or Practice. They are retained in
the database but intentionally not returned; new plays rebuild cleanly without
copying an E/0 result into every chart or mode. XG uses sequence slots 1-8,
while the Classic response uses the client's required one-slot offset.

The recovered result screen confirms that uploaded `result_rank` is an
ascending raw value (`0=E/FAILED` through `6=SS`); `-1` is reserved for an
unplayed response slot. `skill_perc` is `-1` on failure or the `0..10000`
achievement value. Raw score, achievement, rank, combo and
Clear/FC/Excellent are merged independently, so a high-score FAILED play
cannot erase an earlier clear and a lower-score play can still improve the
stored achievement. Response serialization also takes the best value again
if an interrupted historical write left duplicate chart documents.

Historical campaign data and thresholds were reconstructed from the archived
GuitarFreaks XG2 / DrumMania XG2 guide and then checked against the recovered
client's receive routines and local music database:

- https://bemaniwiki.com/?GuitarFreaksXG2%EF%BC%86DrumManiaXG2
- https://bemaniwiki.com/?GuitarFreaksXG2%EF%BC%86DrumManiaXG2/%E9%9A%A0%E3%81%97%E8%A6%81%E7%B4%A0
- https://bemaniwiki.com/?GuitarFreaksXG2%EF%BC%86DrumManiaXG2/GROUP

Every game-specific service name recovered from the client is explicitly
routed. Requests and any unexpected fallback traffic remain visible in the
developer log while the remaining online behavior is restored.

The recovered 2011-12-28 `libshare-pj.dll` receive routines are the
authoritative protocol reference. The archived `area573/v8_server` K32
implementation is used only as an older behavioral comparison.

`games_decrypted.xml` is also used for the recovered route and outer payload
catalog. Its K32/K33 `gametop` and `gameend` bodies are compiled placeholders,
so score and Community structures are derived from the client receive/send
routines instead of guessing from the older V8 implementation.

`tests/protocol-smoke.ps1` writes cards, scores, groups and event data. Run it
only against a disposable CORE with an isolated port and savedata directory,
never against the live 8083 instance. It verifies both K32 and K33 routing,
independent score-record merging, FAILED/success transitions, duplicate
submission idempotence, mode/kind isolation, late game-info arrays, card
lookup, profile loading, the full group lifecycle, Community Log persistence,
the 26-item Cooperation catalogs, lobby, fixed-size shop-trial rankings,
collaboration and assert-report serialization. Add
`-CooperationChallengeEnabled` when that switch is enabled in `config.ini`.
