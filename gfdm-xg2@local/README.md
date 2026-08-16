# GuitarFreaks / DrumMania XG2 local server

Local restoration plugin for the K32 (DrumMania) and K33
(GuitarFreaks) game builds.

Implemented routes:

- cabinet registration and global game settings
- demo/hit-chart startup data
- new-player registration and returning-player lookup
- profile WebUI page for changing an existing XG2 player name, with refid,
  existence, length and unsafe-character validation
- player customization and unlock data, including the client's complete
  48-slot Custom state and all 11 recovered category-2 Skin packs used by
  Attack Effect, Judge Text, Combo, Notes, Shutter and Preset lists
- end-of-game profile persistence, including Live Point, the fixed 19-slot
  Trophy list, XG/Classic Skill aggregates, the independent Ability emblem and
  recent technical-status history, and a persisted gameend receipt that remains
  idempotent across a CORE restart
- per-song and per-chart best score, achievement, rank, combo and
  Clear/FC/Excellent persistence, independently merged and isolated by
  K32/K33, XG/Classic/Practice, player kind and sequence slot
- late-XG2 free-song, boss, event, information and collaboration data
- full rival/profile readback and XG score containers
- persistent group creation, lookup, listing, joining, editing and withdrawal
- persistent Community Log play/event rings (15/5 member slots and 15/5 group
  slots), including recovered group-create/join history, one-time recovery of
  the Community tutorial's X-Plan event log, and automatic Excellent/SS/FC/S
  result logs when the cabinet omits its own play-log upload
- monotonic Community tutorial state: stale gameends cannot lower `info.log`
  or `xg_playstyle[16]`, and tutorial-complete profiles receive X-Plan's
  recovered `11 | 14 = 15` XG sequence mask
- SECRET MUSIC serialization treats MDB `xg_seq_flag` as chart metadata rather
  than a complete player-unlock mask and explicitly includes the REGULAR bit;
  this restores the REGULAR rows whose difficulty values are present in MDB
- searchable Group IDs use the client's strict 10-digit signed-s32 range
  (`1000000000..2147483647`); legacy short IDs and member profiles are migrated
  together on the next normal profile/group request
- persistent Cooperation Challenge selection plus per-player and per-group
  progress for the 26 GF and 26 DM definitions recovered from `coop_data.xml`
- persistent shop-trial configuration, submissions and 200-place rankings
- local lobby registration, exclusion filtering, expiry and candidate matching
- local shop-championship standings derived from persisted player sessions
- persistent jubeat collaboration registration and reward checks
- information-image endpoint defaults

Archive feature switches are read on every request and can be changed from the
WebUI without restarting CORE:

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
- `eapass_valid_days` controls the `share/eapass/valid:u16` value used by the
  card-eject play-data expiry message. The archive default is 365 days.
- `demo_music_id`, `demo_sequence_mode`, `demo_start_ms` and
  `demo_duration_ms` control the patched attract Demo song, raw chart slot,
  playback start and segment duration.

CORE v1.60b normally handles `facility.get` before a game plugin can see it.
This installation therefore uses a minimal v1.60b route-override build: an
explicitly registered plugin route is tried before the matching built-in route,
while the plugin's general `Unhandled` fallback remains after all built-ins.
The reproducible source patch and verified x64 artifact are stored under
`.diagnostics/asphyxia-core-v1.60b-xg2-route-override`; the original executable
is backed up separately in `.diagnostics`.

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

The client uploads per-chart `skill_point` values rather than a trustworthy
profile total. The plugin therefore rebuilds each mode's totals from persisted
schema-2 scores: the best chart per song, XG2-new-song top 25 plus old-song top
25 for displayed Skill, and every song's best chart for the protocol
`all_point` aggregate. `all_point` is not Ability. Ability is the separate
animal-shaped technical-status icon carried by `emblem[1]` (one of four types)
and `emblem[2]` (0..2 for LV1..LV3); its colour is selected from the Skill band.
The plugin persists that emblem independently for K32/K33 together with the
20-entry `xg_recent` and `v_recent` histories, then returns it through card,
profile, gameend and Group-member responses. Old profiles use the neutral 0/0
icon until the cabinet calculates and uploads a real status after play.

Real K33 traffic shows that `playerinfo/live_point` normally already contains
the current credit's `get_live_point` award. The server saves the maximum of
the retained total, the uploaded total, and retained total plus the award. This
avoids double-counting normal uploads while still recovering a cabinet that
uploads the previously-read base value. `3750` is a client-side progression
threshold, not a server total. A card-check session number and compact gameend
receipt are persisted so an identical retry after a CORE restart cannot add the
award or play count again.

The Custom screen does not derive its Skin choices from the legacy
`shutter_list`, `judge_logo_list`, `skin_list` or `attack_effect_list` fields.
`gametop.player.item:s32[48]` is the current Custom state and is returned by the
cabinet as `gameend.player.playerinfo.item`; the plugin persists that array
without collapsing it into the older split fields. The recovered client treats
category-2 item IDs `200001..200011` as 11 Skin packs. They are returned in the
fixed 48-slot `gameend.player.xg_item` grant array, which populates the Attack
Effect, Judge Text, Combo, Notes, Shutter and Preset option lists. The verified
selection indexes are Shutter 31, Attack Effect 39, Judge Text 41, Combo 42 and
Notes 46; Shutter additionally retains the native BLACK value 98.

The same 48-slot item array also carries the Live Point milestone markers.
`game.dll sub_1007A400` pops one reached-but-unrecorded milestone per result
screen (thresholds 2500/3750/5000/7500/8750/11250 and then +15000 per eight
entries) and records it as the self-describing marker `item[m - 1] = m`, which
is what real captures show growing `[1] -> [1,2] -> [1,2,3]` one credit at a
time. A boot that has not replayed its milestones yet uploads fewer markers,
so the plugin merges uploads per slot and never lets a stale boot drop an
already-recorded marker; Custom selection slots keep following the upload.

Group Challenge completion display: `coop_data.xml` gives every event a goal,
and the client compares the `group_coope` total against it. Because every
challenge prize is already granted through the archived policy (skin packs
`200001..200011` plus the fully unlocked SECRET MUSIC catalog),
`cooperation_challenge_completion=completed` reports each total at its goal so
the challenge list shows the cleared state those prizes belong to, while the
member contribution scores and the persisted group totals stay real. Switching
the setting to `progression` returns to the raw accumulated totals.

Historical campaign data and thresholds were reconstructed from the archived
GuitarFreaks XG2 / DrumMania XG2 guide and then checked against the recovered
client's receive routines and local music database:

- https://bemaniwiki.com/?GuitarFreaksXG2%EF%BC%86DrumManiaXG2
- https://bemaniwiki.com/?GuitarFreaksXG2%EF%BC%86DrumManiaXG2/%E9%9A%A0%E3%81%97%E8%A6%81%E7%B4%A0
- https://bemaniwiki.com/?GuitarFreaksXG2%EF%BC%86DrumManiaXG2/GROUP

The companion patch set is registered for both software identities that share
this installation's DLLs: `K32:J:A:A:2011031100` and
`K33:J:A:A:2011122800`. The discarded `libshare-pj.dll` COIN trampoline is no
longer present: TEST I/O reads the raw GitaDora Coin input, while Spice's global
Insert Coin hotkey changes credit stock. Both launch scripts run
`configure-xg2-coin.ps1`, which binds an otherwise-unbound GitaDora Coin input
to F1 while preserving an explicit user binding. The AUTOPLAY patch forces the
judge routine's local automatic mode after timing data is valid, keeps GF
sustains active until the chart's native release point, and triggers every
Wailing direction at frame 50 of its 60-frame window without setting the global
Demo/debug flags. The Select Music timer's own tail call to the shared decrement
routine remains replaced with an early return.
The server-configurable Demo patch reads five signed values and one chart-slot
value from the disabled `demodata/trialdata` transport, then applies the same
code caves to the shared K32/K33 `game.dll`.
Both launch scripts load the same patch configuration; real gameplay validation
is still required separately for GF and DM.

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
submission idempotence (including a CORE restart), Live Point total/increment
semantics, Skill/all-point, Ability emblem, XG/V recent history and 19-slot
Trophy round-trips, all 11 XG2 Skin-pack grants, the complete 48-slot Custom
state across a CORE restart, mode/kind isolation,
late game-info arrays, card
lookup, profile loading, the full group lifecycle, Community Log persistence,
one-time X-Plan tutorial recovery, result-log priority and tutorial-state
rollback protection, REGULAR availability for every valid SECRET MUSIC slot,
10-digit searchable Group IDs, `facility/share/eapass/valid`, consistent
`gameinfo`/`demodata` EXTRA RUSH division, the Demo transport values, the
26-item Cooperation catalogs, lobby,
fixed-size shop-trial rankings, collaboration and assert-report serialization. Add
`-CooperationChallengeEnabled` when that switch is enabled in `config.ini`.

The player-name WebUI event was additionally validated against an isolated
8084 Core and copied savedata: the page rendered, the name was persisted and
returned by `gametop.get`, a 13-character name was rejected with HTTP 400, and
a missing profile was rejected with HTTP 404. AUTOPLAY's sustain/Wailing changes
have IDA-level control-flow and byte validation but, together with COIN MECH,
still require real GF/DM cabinet-flow validation.
