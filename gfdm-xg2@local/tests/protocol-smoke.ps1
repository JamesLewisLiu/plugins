param(
  [string]$Endpoint = 'http://127.0.0.1:8083/',
  [switch]$CooperationChallengeEnabled,
  [int]$ExpectedEapassValidDays = 365,
  [int]$ExpectedXgBossLevel = 15,
  [int]$ExpectedDemoMusicId = 1845,
  [int]$ExpectedDemoSequenceMode = 1,
  [int]$ExpectedDemoStartMs = 58500,
  [int]$ExpectedDemoDurationMs = 9800
)

$ErrorActionPreference = 'Stop'
$endpoint = $Endpoint
$memorialDay = [int](Get-Date -Format 'MMdd')
$xg2PlusMusic = @(1837, 1865, 1833, 1869, 1816, 1872, 1820, 1868, 1827, 1844, 1866, 1840, 1871, 1815, 1825)
$xg2PlusBorders = @(4000, 8000, 12000, 16000, 20000, 24000, 28000, 32000, 36000, 40000, 44000, 48000, 52000, 56000, 60000)
$cooperationEventIds = @{
  K33 = @(1, 2, 3, 4, 5, 16, 7, 8, 9, 10, 11, 12, 13, 14, 15, 6, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26)
  K32 = @(1, 2, 3, 4, 5, 16, 7, 8, 9, 10, 11, 12, 13, 14, 15, 6, 17, 27, 19, 20, 21, 22, 23, 24, 25, 26)
}

function Get-NumberArray {
  param([Parameter(Mandatory = $true)]$Node)

  return @(([string]$Node.'#text') -split ' ' |
    Where-Object { $_ -ne '' } |
    ForEach-Object { [int]$_ })
}

function Assert-NumberArray {
  param(
    [Parameter(Mandatory = $true)]$Node,
    [Parameter(Mandatory = $true)][int[]]$Expected,
    [Parameter(Mandatory = $true)][string]$Context
  )

  $actual = @(Get-NumberArray $Node)
  if ([int]$Node.__count -ne $Expected.Count -or
      $actual.Count -ne $Expected.Count -or
      ($actual -join ' ') -ne ($Expected -join ' ')) {
    throw "$Context returned '$($actual -join ' ')' instead of '$($Expected -join ' ')'"
  }
}

function Assert-XGSecretRegularUnlocked {
  param(
    [Parameter(Mandatory = $true)]$MusicIds,
    [Parameter(Mandatory = $true)]$SequenceMasks,
    [Parameter(Mandatory = $true)][string]$Context
  )

  $ids = @(Get-NumberArray $MusicIds)
  $masks = @(Get-NumberArray $SequenceMasks)
  if ($ids.Count -ne $masks.Count) {
    throw "$Context returned mismatched music-id and sequence-mask arrays"
  }
  for ($index = 0; $index -lt $ids.Count; $index++) {
    if ([int]$ids[$index] -ge 0 -and (([int]$masks[$index] -band 4) -eq 0)) {
      throw "$Context music $($ids[$index]) is missing the REGULAR unlock bit in mask $($masks[$index])"
    }
  }
}

function Get-MusicData {
  param(
    [Parameter(Mandatory = $true)]$Container,
    [Parameter(Mandatory = $true)][int]$MusicId
  )

  return @($Container.musicdata) |
    Where-Object { [int]$_.musicid -eq $MusicId } |
    Select-Object -First 1
}

function Assert-FailedScoreEncoding {
  param(
    [Parameter(Mandatory = $true)]$Container,
    [Parameter(Mandatory = $true)][int]$MusicId,
    [Parameter(Mandatory = $true)][int]$SeqMode,
    [Parameter(Mandatory = $true)][int]$AchievementSlot,
    [Parameter(Mandatory = $true)][int]$RankSlot,
    [Parameter(Mandatory = $true)][int]$RankStart,
    [Parameter(Mandatory = $true)][int]$RankEnd,
    [Parameter(Mandatory = $true)][int]$ExpectedAchievement,
    [Parameter(Mandatory = $true)][int]$ExpectedRank,
    [Parameter(Mandatory = $true)][string]$Context,
    [int[]]$ExpectedFlags = @()
  )

  $music = Get-MusicData $Container $MusicId
  if ($null -eq $music) {
    throw "$Context is missing music $MusicId"
  }
  $mdata = @(Get-NumberArray $music.mdata)
  foreach ($slot in @($AchievementSlot, $RankSlot, $RankStart, $RankEnd)) {
    if ($slot -ge $mdata.Count) {
      throw "$Context mdata is missing slot $slot"
    }
  }
  if ([int]$mdata[$AchievementSlot] -ne $ExpectedAchievement) {
    throw "$Context achievement slot $AchievementSlot returned '$($mdata[$AchievementSlot])' instead of '$ExpectedAchievement'"
  }
  if ([int]$mdata[$RankSlot] -ne $ExpectedRank) {
    throw "$Context rank slot $RankSlot returned '$($mdata[$RankSlot])' instead of '$ExpectedRank'"
  }
  foreach ($slot in $RankStart..$RankEnd) {
    if ($slot -ne $RankSlot -and [int]$mdata[$slot] -ne -1) {
      throw "$Context unplayed rank slot $slot returned '$($mdata[$slot])' instead of '-1'"
    }
  }

  $flags = @(Get-NumberArray $music.flag)
  $expectedPlayedBits = 1 -shl $SeqMode
  if ($ExpectedFlags.Count -eq 0) {
    $ExpectedFlags = @(0, 0, 0, $expectedPlayedBits)
  }
  if ([int]$music.flag.__count -ne 4 -or
      $flags.Count -ne 4 -or
      ($flags -join ' ') -ne ($ExpectedFlags -join ' ')) {
    throw "$Context flags returned '$($flags -join ' ')' instead of '$($ExpectedFlags -join ' ')'"
  }
}

function Assert-MusicAbsent {
  param(
    [Parameter(Mandatory = $true)]$Container,
    [Parameter(Mandatory = $true)][int]$MusicId,
    [Parameter(Mandatory = $true)][string]$Context
  )

  if ($null -ne (Get-MusicData $Container $MusicId)) {
    throw "$Context unexpectedly contains music $MusicId"
  }
}

function Invoke-GameRequest {
  param(
    [Parameter(Mandatory = $true)][string]$Model,
    [Parameter(Mandatory = $true)][string]$Payload
  )

  $request = "<call model=`"$Model`:J:A:A:2011122800`" srcid=`"01020304050607080900`">$Payload</call>"
  $response = $request |
    curl.exe -sS -H 'Content-Type: application/octet-stream' -H 'X-Compress: none' --data-binary '@-' $endpoint
  return [xml]($response -join "`n")
}

function Invoke-ScoreResult {
  param(
    [Parameter(Mandatory = $true)][string]$Model,
    [Parameter(Mandatory = $true)][string]$Refid,
    [Parameter(Mandatory = $true)][string]$Mode,
    [Parameter(Mandatory = $true)][int]$MusicId,
    [Parameter(Mandatory = $true)][int]$SeqMode,
    [Parameter(Mandatory = $true)][int]$Score,
    [Parameter(Mandatory = $true)][int]$SkillPercent,
    [Parameter(Mandatory = $true)][int]$ResultRank,
    [int]$Kind = 0,
    [int]$MusicType = 1,
    [int]$Clear = 0,
    [int]$AutoClear = 0,
    [int]$Flags = 0,
    [int]$FullCombo = 0,
    [int]$Excellent = 0,
    [int]$Combo = 0,
    [int]$SkillPoint = 0
  )

  $payload = "<gameend method=`"regist`"><gamemode mode=`"game_mode`"/><mode __type=`"str`">$Mode</mode><player card=`"use`" no=`"1`"><playerinfo><refid __type=`"str`">$Refid</refid></playerinfo><playdata><kind __type=`"s8`">$Kind</kind><musicid __type=`"s32`">$MusicId</musicid><music_type __type=`"s8`">$MusicType</music_type><seqmode __type=`"s8`">$SeqMode</seqmode><clear __type=`"u8`">$Clear</clear><auto_clear __type=`"u8`">$AutoClear</auto_clear><score __type=`"u32`">$Score</score><flags __type=`"u32`">$Flags</flags><fullcombo __type=`"u8`">$FullCombo</fullcombo><excellent __type=`"u8`">$Excellent</excellent><combo __type=`"u32`">$Combo</combo><skill_point __type=`"s32`">$SkillPoint</skill_point><skill_perc __type=`"s32`">$SkillPercent</skill_perc><result_rank __type=`"s8`">$ResultRank</result_rank></playdata></player></gameend>"
  return Invoke-GameRequest $Model $payload
}

function Assert-Response {
  param(
    [Parameter(Mandatory = $true)]$Xml,
    [Parameter(Mandatory = $true)][string]$Module
  )

  if ($Xml.response.FirstChild.Name -ne $Module) {
    throw "Expected response module '$Module', got '$($Xml.response.FirstChild.Name)'"
  }
  if ($Xml.response.FirstChild.status -ne '0') {
    throw "Module '$Module' returned status '$($Xml.response.FirstChild.status)'"
  }
}

function Assert-GroupDataPayload {
  param(
    [Parameter(Mandatory = $true)]$Node,
    [Parameter(Mandatory = $true)][string]$Context
  )

  foreach ($field in @(
    @{ Name = 'member_did'; Type = 's32'; Count = 10 },
    @{ Name = 'secret_music_id'; Type = 's32'; Count = 5 },
    @{ Name = 'secret_music_seq'; Type = 's32'; Count = 5 },
    @{ Name = 'reward_music_id'; Type = 's32'; Count = 20 },
    @{ Name = 'reward_music_seq'; Type = 's32'; Count = 20 },
    @{ Name = 'item'; Type = 's32'; Count = 26 }
  )) {
    $value = $Node.($field.Name)
    if ([string]$value.__type -ne $field.Type -or [int]$value.__count -ne $field.Count) {
      throw "$Context $($field.Name) is not $($field.Type)[$($field.Count)]"
    }
  }

  $playerGroupLogs = @($Node.p_group_log.log)
  $eventGroupLogs = @($Node.e_group_log.log)
  if ($playerGroupLogs.Count -ne 15 -or $eventGroupLogs.Count -ne 5) {
    throw "$Context does not contain the required 15/5 group log slots"
  }
  foreach ($log in @($playerGroupLogs + $eventGroupLogs)) {
    if ([string]$log.did.__type -ne 's32' -or
        [string]$log.logid.__type -ne 's32' -or
        [string]$log.param.__type -ne 'str' -or
        [string]$log.ctime.__type -ne 'str') {
      throw "$Context contains a malformed group log slot"
    }
  }

  $players = @($Node.member.player)
  if ($players.Count -ne 10) {
    throw "$Context does not contain the required ten player slots"
  }
  foreach ($player in $players) {
    if ([string]$player.emblem.__type -ne 'u8' -or [int]$player.emblem.__count -ne 3) {
      throw "$Context player is missing emblem u8[3]"
    }
    if (@($player.p_log_data.log).Count -ne 15 -or
        @($player.e_log_data.log).Count -ne 5 -or
        @($player.customchallenge.custom).Count -ne 3) {
      throw "$Context player is missing the required 15/5 logs or three challenges"
    }
    foreach ($log in @(@($player.p_log_data.log) + @($player.e_log_data.log))) {
      if ([string]$log.logid.__type -ne 's32' -or
          [string]$log.attrib.__type -ne 's32' -or
          [string]$log.param.__type -ne 'str' -or
          [string]$log.ctime.__type -ne 'str') {
        throw "$Context contains a malformed player log slot"
      }
    }
    foreach ($custom in @($player.customchallenge.custom)) {
      if ([string]$custom.param.__type -ne 'str' -or
          [string]$custom.ctime.__type -ne 'str' -or
          [string]$custom.is_valid.__type -ne 'bool') {
        throw "$Context contains a malformed custom-challenge slot"
      }
    }
  }

  if ($null -ne $Node.group_comment -or
      $null -ne $Node.player_comment -or
      $null -ne $Node.customchallenge -or
      $null -ne $Node.cooperation_challenge) {
    throw "$Context still contains misplaced optional group fields"
  }
}

function Get-IndexedLog {
  param(
    [Parameter(Mandatory = $true)]$Container,
    [Parameter(Mandatory = $true)][int]$Index
  )

  return @($Container.log) |
    Where-Object { [int]$_.index -eq $Index } |
    Select-Object -First 1
}

function Assert-LogSlot {
  param(
    [Parameter(Mandatory = $true)]$Container,
    [Parameter(Mandatory = $true)][int]$Index,
    [Parameter(Mandatory = $true)][int]$LogId,
    [Parameter(Mandatory = $true)][int]$Attrib,
    [Parameter(Mandatory = $true)][string]$Param,
    [Parameter(Mandatory = $true)][string]$Context
  )

  $log = Get-IndexedLog $Container $Index
  if ($null -eq $log) {
    throw "$Context is missing log index $Index"
  }
  if ([int]$log.logid.'#text' -ne $LogId -or
      [int]$log.attrib.'#text' -ne $Attrib -or
      [string]$log.param.'#text' -ne $Param) {
    throw "$Context log index $Index returned logid/attrib/param '$($log.logid.'#text')/$($log.attrib.'#text')/$($log.param.'#text')' instead of '$LogId/$Attrib/$Param'"
  }
}

function Assert-GroupCreationLog {
  param(
    [Parameter(Mandatory = $true)]$Node,
    [Parameter(Mandatory = $true)][string]$Context
  )

  $creationLog = @($Node.p_group_log.log) |
    Where-Object { [int]$_.logid.'#text' -eq 1 } |
    Select-Object -First 1
  if ($null -eq $creationLog -or
      [string]::IsNullOrWhiteSpace([string]$creationLog.ctime.'#text')) {
    throw "$Context did not persist a group-creation log in p_group_log"
  }
}

function Assert-GroupCooperationCatalog {
  param(
    [Parameter(Mandatory = $true)]$Node,
    [Parameter(Mandatory = $true)][int[]]$ExpectedEventIds,
    [Parameter(Mandatory = $true)][string]$Context
  )

  $challenges = @($Node.group_coope.cooperation_challenge)
  if ($challenges.Count -ne 26) {
    throw "$Context returned $($challenges.Count) Cooperation Challenges instead of 26"
  }
  $actualEventIds = @($challenges | ForEach-Object { [int]$_.eventid })
  if (($actualEventIds -join ' ') -ne ($ExpectedEventIds -join ' ')) {
    throw "$Context returned event IDs '$($actualEventIds -join ' ')' instead of '$($ExpectedEventIds -join ' ')'"
  }
  foreach ($challenge in $challenges) {
    if ([string]$challenge.total_score.__type -ne 'u32' -or
        [string]$challenge.valid_time.__type -ne 'str' -or
        [string]::IsNullOrWhiteSpace([string]$challenge.valid_time.'#text')) {
      throw "$Context event $($challenge.eventid) is missing total_score u32 or valid_time str"
    }
  }
}

function Assert-PlayerCooperationScore {
  param(
    [Parameter(Mandatory = $true)]$Player,
    [Parameter(Mandatory = $true)][int]$EventId,
    [Parameter(Mandatory = $true)][int]$ExpectedScore,
    [Parameter(Mandatory = $true)][string]$Context
  )

  $challenge = @($Player.cooperation_challenge) |
    Where-Object { [int]$_.eventid -eq $EventId } |
    Select-Object -First 1
  if ($null -eq $challenge -or
      [string]$challenge.score.__type -ne 'u32' -or
      [int]$challenge.score.'#text' -ne $ExpectedScore) {
    throw "$Context did not return event $EventId score $ExpectedScore"
  }
}

foreach ($model in @('K32', 'K33')) {
  $facility = Invoke-GameRequest $model '<facility method="get"/>'
  Assert-Response $facility 'facility'
  if ([string]$facility.response.facility.share.eapass.valid.__type -ne 'u16' -or
      [int]$facility.response.facility.share.eapass.valid.'#text' -ne $ExpectedEapassValidDays) {
    throw "$model facility did not return e-AMUSEMENT PASS validity $ExpectedEapassValidDays"
  }

  $shop = Invoke-GameRequest $model '<shopinfo method="regist"><shop><locationid __type="str">ea</locationid></shop></shopinfo>'
  Assert-Response $shop 'shopinfo'
  if ([string]$shop.response.shopinfo.data.cabid.'#text' -ne '1') {
    throw "$model shop registration did not return cabid 1"
  }
  if ([string]$shop.response.shopinfo.data.locationid.'#text' -ne 'ea' -or
      $null -eq $shop.response.shopinfo.temperature.is_send) {
    throw "$model shop registration is missing the late-K33 location/temperature fields"
  }

  $game = Invoke-GameRequest $model '<gameinfo method="get"><shop><locationid __type="str">LOCAL</locationid><cabid __type="u32">1</cabid></shop></gameinfo>'
  Assert-Response $game 'gameinfo'
  if ([string]$game.response.gameinfo.v_free_music.free_music.'#text' -ne '262143') {
    throw "$model gameinfo returned an unexpected V free-music mask"
  }
  if ([int]$game.response.gameinfo.xg_free_music.free_music.__count -ne 155) {
    throw "$model gameinfo did not return 155 XG unlock slots"
  }
  if ([int]$game.response.gameinfo.xg_free_music.free_seq.__count -ne 155) {
    throw "$model gameinfo did not return 155 XG sequence masks"
  }
  Assert-XGSecretRegularUnlocked `
    $game.response.gameinfo.xg_free_music.free_music `
    $game.response.gameinfo.xg_free_music.free_seq `
    "$model gameinfo SECRET MUSIC"
  if (-not $game.response.gameinfo.info.info_plus) {
    throw "$model gameinfo is missing the late-XG2 info tree"
  }
  if ([int]$game.response.gameinfo.plus.term.'#text' -ne 15) {
    throw "$model gameinfo did not enable XG2+ term 15"
  }
  Assert-NumberArray $game.response.gameinfo.plus.music_list $xg2PlusMusic "$model gameinfo XG2+ music list"
  Assert-NumberArray $game.response.gameinfo.plus.border_list $xg2PlusBorders "$model gameinfo XG2+ border list"
  if ([int]$game.response.gameinfo.xg_bossdata.division.'#text' -ne $ExpectedXgBossLevel -or
      [int]$game.response.gameinfo.v_bossdata.division.'#text' -ne 14) {
    throw "$model gameinfo did not return XG/V boss divisions $ExpectedXgBossLevel/14"
  }

  $demo = Invoke-GameRequest $model '<demodata method="get"><shop><locationid __type="str">LOCAL</locationid></shop><hitchart_nr __type="u16">100</hitchart_nr></demodata>'
  Assert-Response $demo 'demodata'
  if ([string]$demo.response.demodata.hitchart.nr -ne '0' -or
      [int]$demo.response.demodata.bossdata.border.__count -ne 10 -or
      [int]$demo.response.demodata.v_bossdata.border.__count -ne 9 -or
      [int]$demo.response.demodata.groupcompetition.reward_music.__count -ne 3 -or
      [int]$demo.response.demodata.trialdata.musicid.__count -ne 5 -or
      [int]$demo.response.demodata.trialdata.grade_border.__count -ne 15 -or
      [int]$demo.response.demodata.plus.music_list.__count -ne 15 -or
      [int]$demo.response.demodata.plus.border_list.__count -ne 15) {
    throw "$model demo response is missing its parser-minimum zero-value skeleton"
  }
  if ([int]$demo.response.demodata.plus.term.'#text' -ne 15) {
    throw "$model demodata did not enable XG2+ term 15"
  }
  Assert-NumberArray $demo.response.demodata.plus.music_list $xg2PlusMusic "$model demodata XG2+ music list"
  Assert-NumberArray $demo.response.demodata.plus.border_list $xg2PlusBorders "$model demodata XG2+ border list"
  if ([int]$demo.response.demodata.bossdata.division.'#text' -ne $ExpectedXgBossLevel -or
      [int]$demo.response.demodata.bossdata.division.'#text' -ne
        [int]$game.response.gameinfo.xg_bossdata.division.'#text') {
    throw "$model demodata and gameinfo returned inconsistent XG boss divisions"
  }
  Assert-NumberArray `
    $demo.response.demodata.trialdata.musicid `
    @(
      $ExpectedDemoMusicId,
      $ExpectedDemoStartMs,
      $ExpectedDemoDurationMs,
      $ExpectedDemoStartMs,
      $ExpectedDemoDurationMs
    ) `
    "$model demodata Demo transport"
  Assert-NumberArray `
    $demo.response.demodata.trialdata.grade_border `
    (@($ExpectedDemoSequenceMode) + @(0) * 14) `
    "$model demodata Demo sequence transport"
  if ($demo.response.demodata.info -or
      $demo.response.demodata.hitchart.data -or
      $demo.response.demodata.myshop_rank.shopchamp.representation -or
      $demo.response.demodata.shopchamp_ranking.data) {
    throw "$model demo response advertises optional online/event content"
  }

  $card = Invoke-GameRequest $model '<cardutil method="check"><card no="1"><refid __type="str">SMOKE-UNKNOWN</refid><uid __type="str">SMOKE-CARD</uid></card></cardutil>'
  Assert-Response $card 'cardutil'
  if ([string]$card.response.cardutil.card.state -ne '0') {
    throw "$model unknown-card check did not return state 0"
  }

  $top = Invoke-GameRequest $model '<gametop method="get"><player no="1"><refid __type="str">SMOKE-UNKNOWN</refid></player></gametop>'
  Assert-Response $top 'gametop'
  if ([int]$top.response.gametop.player.xg_secret_music_id.__count -ne 155) {
    throw "$model gametop did not return 155 XG secret-music slots"
  }
  Assert-XGSecretRegularUnlocked `
    $top.response.gametop.player.xg_secret_music_id `
    $top.response.gametop.player.xg_secret_music_seq `
    "$model gametop SECRET MUSIC"
  if (-not $top.response.gametop.player.xg) {
    throw "$model gametop is missing the XG score container"
  }
  if ([string]$top.response.gametop.player.xg_finish.'#text' -ne '1' -or
      $null -ne $top.response.gametop.player.xg.xg_finish) {
    throw "$model gametop xg_finish is not at the player root"
  }
  foreach ($field in @('max_clear_difficulty', 'max_fullcombo_difficulty', 'max_excellent_difficulty')) {
    if ([string]$top.response.gametop.player.v_recentdata.$field.__type -ne 's8') {
      throw "$model gametop v_recentdata/$field is missing or has the wrong type"
    }
  }
  $battleRounds = @($top.response.gametop.player.battledata.history.round)
  if ($battleRounds.Count -ne 10) {
    throw "$model gametop did not return the 10 required battle-history rounds"
  }
  foreach ($round in $battleRounds) {
    if ([string]$round.emblem.__type -ne 'u8' -or [int]$round.emblem.__count -ne 3) {
      throw "$model gametop battle-history round is missing emblem u8[3]"
    }
  }

  $guestEnd = Invoke-GameRequest $model '<gameend method="regist"><gamemode mode="game_mode"/><player card="unuse" no="1"><playdata><musicid __type="s32">1853</musicid><seqmode __type="s8">1</seqmode><score __type="u32">0</score></playdata></player></gameend>'
  Assert-Response $guestEnd 'gameend'

  $rival = Invoke-GameRequest $model '<gametop method="get_rival"><player no="1" rival_id="0"><refid __type="str">SMOKE-UNKNOWN</refid></player></gametop>'
  Assert-Response $rival 'gametop'
  if ([int]$rival.response.gametop.player.xg_secret_music_id.__count -ne 155 -or
      -not $rival.response.gametop.player.battledata) {
    throw "$model rival profile did not return the full late-XG2 player payload"
  }

  $group = Invoke-GameRequest $model '<groupentry method="regist"/>'
  Assert-Response $group 'groupentry'
  if (-not $group.response.groupentry.groupdata) {
    throw "$model group entry is missing groupdata"
  }
  if ([string]$group.response.groupentry.groupdata.groupid -ne '0') {
    throw "$model empty group state did not return groupid 0"
  }
  if ([string]$group.response.groupentry.groupdata.state -ne '1') {
    throw "$model invalid group-entry request did not return failure state 1"
  }

  $emptyGroup = Invoke-GameRequest $model '<groupdata method="get"><group><groupid __type="s32">0</groupid><refid __type="str">SMOKE-UNKNOWN</refid></group></groupdata>'
  Assert-Response $emptyGroup 'groupdata'
  if ([string]$emptyGroup.response.groupdata.groupdata.groupid -ne '0') {
    throw "$model empty groupdata.get did not return groupid 0"
  }
  Assert-GroupDataPayload $emptyGroup.response.groupdata.groupdata "$model empty groupdata.get"

  $groups = Invoke-GameRequest $model '<grouplist method="get"/>'
  Assert-Response $groups 'grouplist'
  if (@($groups.response.grouplist.grouplist.group).Count -ne 3) {
    throw "$model group list did not return the three protocol slots"
  }
  foreach ($groupSlot in @($groups.response.grouplist.grouplist.group)) {
    $groupPlayers = @($groupSlot.member.player)
    if ($groupPlayers.Count -ne 10) {
      throw "$model group list slot did not return member/player with ten players"
    }
    foreach ($groupPlayer in $groupPlayers) {
      if ([string]$groupPlayer.emblem.__type -ne 'u8' -or [int]$groupPlayer.emblem.__count -ne 3) {
        throw "$model group list player is missing emblem u8[3]"
      }
    }
  }

  $groupSearch = Invoke-GameRequest $model '<groupsearch method="groupid_search"><groupid __type="s32">1999999999</groupid></groupsearch>'
  Assert-Response $groupSearch 'groupsearch'

  $groupCreate = Invoke-GameRequest $model '<groupcreate method="regist"><group><group_name __type="str">SMOKE</group_name><icon __type="s32">0</icon><refid __type="str">SMOKE-UNKNOWN</refid><is_recruitment __type="bool">1</is_recruitment></group></groupcreate>'
  Assert-Response $groupCreate 'groupcreate'

  $withdrawal = Invoke-GameRequest $model '<groupwithdrawal method="regist"><refid __type="str">SMOKE-UNKNOWN</refid></groupwithdrawal>'
  Assert-Response $withdrawal 'groupwithdrawal'

  # Profile-space data is valid only after the core card manager has created
  # the refid.  Using a made-up refid here makes Asphyxia correctly cancel the
  # write and pollutes the development log with a misleading warning.
  $cardId = if ($model -eq 'K32') { 'E00400000000F032' } else { 'E00400000000F033' }
  $inquiry = Invoke-GameRequest $model "<cardmng method=`"inquire`" cardid=`"$cardId`" cardtype=`"1`" update=`"0`"/>"
  $inquiryStatus = [string]$inquiry.response.cardmng.status
  if ($inquiryStatus -eq '112') {
    $allocation = Invoke-GameRequest $model "<cardmng method=`"getrefid`" cardid=`"$cardId`" cardtype=`"1`" newflag=`"0`" pass=`"1234`"/>"
    Assert-Response $allocation 'cardmng'
    $groupRefid = [string]$allocation.response.cardmng.refid
  } elseif ($inquiryStatus -eq '0') {
    $groupRefid = [string]$inquiry.response.cardmng.refid
  } else {
    throw "$model card inquiry returned unexpected status '$inquiryStatus'"
  }
  if ([string]::IsNullOrWhiteSpace($groupRefid)) {
    throw "$model core card manager did not return a refid"
  }

  $register = Invoke-GameRequest $model "<cardutil method=`"regist`"><data><refid __type=`"str`">$groupRefid</refid><name __type=`"str`">SMOKE</name><chara __type=`"s32`">1</chara></data></cardutil>"
  Assert-Response $register 'cardutil'

  $registered = Invoke-GameRequest $model "<cardutil method=`"check`"><card no=`"1`"><refid __type=`"str`">$groupRefid</refid><uid __type=`"str`">$cardId</uid></card></cardutil>"
  Assert-Response $registered 'cardutil'
  if ([string]$registered.response.cardutil.card.state -ne '2' -or
      [string]$registered.response.cardutil.card.name.'#text' -ne 'SMOKE') {
    throw "$model registered profile was not persisted"
  }

  $beforeEnd = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid></player></gametop>"
  Assert-Response $beforeEnd 'gametop'
  $beforePlayCount = [int]$beforeEnd.response.gametop.player.play_cnt.'#text'
  $roundTripStyles = @(0) * 50
  $roundTripStyles[1] = 7
  $roundTripStyles[16] = 2
  $roundTripStyles[49] = 9
  $roundTripStyleText = $roundTripStyles -join ' '
  $zeroPlaystyleText = (@(0) * 50) -join ' '
  $roundTripTrophies = @(-1) * 19
  $roundTripTrophies[4] = 1
  $roundTripTrophies[5] = 2
  $roundTripTrophies[18] = 17
  $roundTripTrophyText = $roundTripTrophies -join ' '
  $roundTripEmblem = @(1, 3, 2)
  $roundTripEmblemText = $roundTripEmblem -join ' '
  $roundTripCustomItems = @(0) * 48
  $roundTripCustomItems[31] = 11
  $roundTripCustomItems[39] = 3
  $roundTripCustomItems[41] = 5
  $roundTripCustomItems[42] = 7
  $roundTripCustomItems[46] = 9
  $roundTripCustomItemText = $roundTripCustomItems -join ' '
  $skinPackItems = @(200001..200011) + (@(0) * 37)
  $recentMusicIds = @(1823, 1838, 1843, 1506, 1422, 1834, 1853) + (@(-1) * 13)
  $recentMaxComboRates = @(100, 96, 92, 88, 84, 80, 76) + (@(0) * 13)
  $recentPerfectRates = @(99, 95, 91, 87, 83, 79, 75) + (@(0) * 13)
  $recentMissRates = @(0, 1, 2, 3, 4, 5, 6) + (@(0) * 13)
  $vRecentMusicIds = @(1853) + (@(-1) * 19)
  $vRecentClear = @(1) + (@(0) * 19)
  $vRecentFlags = @(3) + (@(0) * 19)
  $vRecentDifficulty = @(7) + (@(0) * 19)
  $vRecentComboRates = @(93) + (@(0) * 19)
  $vRecentPerfectRates = @(89) + (@(0) * 19)
  $classicSkill = if ($model -eq 'K32') { 2232 } else { 2233 }
  $standardSkill = if ($model -eq 'K32') { 1232 } else { 1233 }
  $classicSkillPoint = if ($model -eq 'K32') { 1102 } else { 1103 }
  $standardSkillPoint = if ($model -eq 'K32') { 1202 } else { 1203 }
  $beginnerSkill = if ($model -eq 'K32') { 3232 } else { 3233 }
  $kindOneSkill = if ($model -eq 'K32') { 4232 } else { 4233 }
  $classicRank = 4
  $standardRank = 3
  $beginnerRank = 2
  $kindOneRank = 1
  $misalignedStageMusicId = if ($model -eq 'K32') { 29032 } else { 29033 }
  $endPayload = "<gameend method=`"regist`"><gamemode mode=`"game_mode`"/><mode __type=`"str`">classic</mode><modedata><stage><musicid __type=`"s32`">$misalignedStageMusicId</musicid></stage></modedata><player card=`"use`" no=`"1`"><playerinfo><refid __type=`"str`">$groupRefid</refid><emblem __type=`"u8`" __count=`"3`">$roundTripEmblemText</emblem><playstyles __type=`"s32`" __count=`"50`">$roundTripStyleText</playstyles><trophy_list __type=`"s32`" __count=`"19`">$roundTripTrophyText</trophy_list><item __type=`"s32`" __count=`"48`">$roundTripCustomItemText</item><info_level __type=`"u8`">4</info_level><customize><shutter __type=`"u8`">3</shutter><auto __type=`"u8`">1</auto><random __type=`"u8`">2</random><skin __type=`"u32`">8</skin><meter_custom __type=`"u8`" __count=`"3`">1 2 3</meter_custom></customize><info><log __type=`"u32`">1</log><coope_challenge __type=`"u32`">1</coope_challenge></info><groupdata groupid=`"0`"><pdata><icon __type=`"s32`">16</icon><icon_back __type=`"s32`">2</icon_back><coope_eventid __type=`"s32`">1</coope_eventid><log_num __type=`"s32`">1</log_num><play_log><index __type=`"s32`">1</index><logid __type=`"s32`">2</logid><attrib __type=`"s32`">1</attrib><param __type=`"str`">812,1853</param></play_log></pdata></groupdata><live_point __type=`"s32`">2903</live_point><get_live_point __type=`"s32`">300</get_live_point></playerinfo><playdata><kind __type=`"s8`">0</kind><musicid __type=`"s32`">1853</musicid><music_type __type=`"s8`">1</music_type><seqmode __type=`"s8`">1</seqmode><skill_point __type=`"s32`">$classicSkillPoint</skill_point><skill_perc __type=`"s16`">$classicSkill</skill_perc><result_rank __type=`"s8`">$classicRank</result_rank><score __type=`"u32`">12345</score></playdata></player></gameend>"
  $technicalPayload = "<xg_recent><clear_num __type=`"u32`">7</clear_num><full_clear_num __type=`"u32`">6</full_clear_num><exc_clear_num __type=`"u32`">5</exc_clear_num><max_clear_difficulty __type=`"s32`">975</max_clear_difficulty><max_fullcombo_clear_difficulty __type=`"s32`">950</max_fullcombo_clear_difficulty><max_excellent_clear_difficulty __type=`"s32`">925</max_excellent_clear_difficulty><musicid __type=`"s32`" __count=`"20`">$($recentMusicIds -join ' ')</musicid><maxcombo_rate __type=`"s8`" __count=`"20`">$($recentMaxComboRates -join ' ')</maxcombo_rate><perfect_rate __type=`"s8`" __count=`"20`">$($recentPerfectRates -join ' ')</perfect_rate><miss_rate __type=`"s8`" __count=`"20`">$($recentMissRates -join ' ')</miss_rate><max_s_clear_difficulty __type=`"s32`">900</max_s_clear_difficulty><max_ss_clear_difficulty __type=`"s32`">875</max_ss_clear_difficulty></xg_recent><v_recent><clear_num __type=`"u32`">4</clear_num><full_clear_num __type=`"u32`">3</full_clear_num><exc_clear_num __type=`"u32`">2</exc_clear_num><max_clear_difficulty __type=`"s8`">90</max_clear_difficulty><max_fullcombo_difficulty __type=`"s8`">80</max_fullcombo_difficulty><max_excellent_difficulty __type=`"s8`">70</max_excellent_difficulty><musicid __type=`"s32`" __count=`"20`">$($vRecentMusicIds -join ' ')</musicid><clear __type=`"s8`" __count=`"20`">$($vRecentClear -join ' ')</clear><flags __type=`"u32`" __count=`"20`">$($vRecentFlags -join ' ')</flags><difficulty __type=`"s8`" __count=`"20`">$($vRecentDifficulty -join ' ')</difficulty><combo_rate __type=`"s8`" __count=`"20`">$($vRecentComboRates -join ' ')</combo_rate><perfect_rate __type=`"s8`" __count=`"20`">$($vRecentPerfectRates -join ' ')</perfect_rate></v_recent>"
  $endPayload = $endPayload.Replace('</info><groupdata', "</info>$technicalPayload<groupdata")
  $firstEnd = Invoke-GameRequest $model $endPayload
  Assert-Response $firstEnd 'gameend'
  $retryEnd = Invoke-GameRequest $model $endPayload
  Assert-Response $retryEnd 'gameend'
  if ([string]$firstEnd.response.gameend.player.emblem.__type -ne 'u8' -or
      [int]$firstEnd.response.gameend.player.emblem.__count -ne 3 -or
      [string]$firstEnd.response.gameend.player.live_point.__type -ne 's32') {
    throw "$model gameend response is missing the K33 emblem/live_point fields"
  }
  Assert-NumberArray $firstEnd.response.gameend.player.emblem $roundTripEmblem "$model Ability emblem"
  Assert-NumberArray $firstEnd.response.gameend.player.xg_item $skinPackItems "$model XG2 Skin pack grants"
  Assert-NumberArray $firstEnd.response.gameend.player.xg_recentdata.maxcombo_rate $recentMaxComboRates "$model gameend XG recent combo rates"
  Assert-NumberArray $firstEnd.response.gameend.player.xg_recentdata.perfect_rate $recentPerfectRates "$model gameend XG recent perfect rates"
  Assert-NumberArray $firstEnd.response.gameend.player.xg_recentdata.miss_rate $recentMissRates "$model gameend XG recent miss rates"
  if ([int]$firstEnd.response.gameend.player.live_point.'#text' -ne 2903 -or
      [int]$retryEnd.response.gameend.player.live_point.'#text' -ne 2903) {
    throw "$model double-counted get_live_point even though live_point already contained it"
  }
  if ([int]$firstEnd.response.gameend.player.v_skill.point.'#text' -ne $classicSkillPoint -or
      [int]$firstEnd.response.gameend.player.v_skill.all_point.'#text' -ne $classicSkillPoint) {
    throw "$model gameend did not return the persisted Classic Skill fields"
  }
  Assert-NumberArray $firstEnd.response.gameend.player.trophy_list $roundTripTrophies "$model gameend trophy list"
  if ([int]$retryEnd.response.gameend.player.play_cnt.'#text' -ne
      [int]$firstEnd.response.gameend.player.play_cnt.'#text') {
    throw "$model gameend retry did not replay the original logical response"
  }
  $afterEnd = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid></player></gametop>"
  Assert-Response $afterEnd 'gametop'
  if ([int]$afterEnd.response.gametop.player.play_cnt.'#text' -ne ($beforePlayCount + 1)) {
    throw "$model duplicate gameend request incremented play count more than once"
  }
  if ([int]$afterEnd.response.gametop.player.live_point.'#text' -ne 2903 -or
      [int]$afterEnd.response.gametop.player.v_skill.'#text' -ne $classicSkillPoint -or
      [int]$afterEnd.response.gametop.player.v_all_skill.'#text' -ne $classicSkillPoint) {
    throw "$model did not round-trip Live Point and Classic Skill fields"
  }
  Assert-NumberArray $afterEnd.response.gametop.player.emblem $roundTripEmblem "$model gametop Ability emblem"
  Assert-NumberArray $afterEnd.response.gametop.player.item $roundTripCustomItems "$model custom item state"
  Assert-NumberArray $afterEnd.response.gametop.player.xg_recentdata.musicid $recentMusicIds "$model gametop XG recent music IDs"
  Assert-NumberArray $afterEnd.response.gametop.player.xg_recentdata.maxcombo_rate $recentMaxComboRates "$model gametop XG recent combo rates"
  Assert-NumberArray $afterEnd.response.gametop.player.xg_recentdata.perfect_rate $recentPerfectRates "$model gametop XG recent perfect rates"
  Assert-NumberArray $afterEnd.response.gametop.player.xg_recentdata.miss_rate $recentMissRates "$model gametop XG recent miss rates"
  $vRecentNodes = @($afterEnd.response.gametop.player.v_recentdata.recent)
  if ($vRecentNodes.Count -ne 20 -or
      [int]$vRecentNodes[0].musicid -ne 1853 -or
      [int]$vRecentNodes[0].clear.'#text' -ne 1 -or
      [int]$vRecentNodes[0].flags.'#text' -ne 3 -or
      [int]$vRecentNodes[0].difficulty.'#text' -ne 7 -or
      [int]$vRecentNodes[0].combo_rate.'#text' -ne 93 -or
      [int]$vRecentNodes[0].perfect_rate.'#text' -ne 89) {
    throw "$model did not round-trip the 20-entry V recent history"
  }

  # A cabinet can occasionally upload the previously-read total in
  # live_point while placing the actual increment in get_live_point.  A new
  # card check starts a new credit/session, so the same wire payload must now
  # advance 2903 by 300 exactly once instead of being mistaken for a retry.
  $nextCredit = Invoke-GameRequest $model "<cardutil method=`"check`"><card><refid __type=`"str`">$groupRefid</refid></card></cardutil>"
  Assert-Response $nextCredit 'cardutil'
  $fallbackEnd = Invoke-GameRequest $model $endPayload
  Assert-Response $fallbackEnd 'gameend'
  $fallbackRetry = Invoke-GameRequest $model $endPayload
  Assert-Response $fallbackRetry 'gameend'
  if ([int]$fallbackEnd.response.gameend.player.live_point.'#text' -ne 3203 -or
      [int]$fallbackRetry.response.gameend.player.live_point.'#text' -ne 3203) {
    throw "$model did not apply stale live_point + get_live_point exactly once"
  }
  $afterFallback = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid></player></gametop>"
  Assert-Response $afterFallback 'gametop'
  if ([int]$afterFallback.response.gametop.player.live_point.'#text' -ne 3203) {
    throw "$model did not persist the fallback Live Point total"
  }
  Assert-NumberArray $afterEnd.response.gametop.player.trophy_list $roundTripTrophies "$model gametop trophy list"
  $storedStyles = @(([string]$afterEnd.response.gametop.player.xg_playstyle.'#text') -split ' ' | Where-Object { $_ -ne '' })
  if ([int]$afterEnd.response.gametop.player.mode.'#text' -ne 2) {
    throw "$model CLASSIC did not round-trip as SELECT MODE value 2"
  }
  if ([int]$afterEnd.response.gametop.player.xg_playstyle.__count -ne 50 -or
      [int]$storedStyles[1] -ne 7 -or
      [int]$storedStyles[16] -ne 2 -or
      [int]$storedStyles[49] -ne 9) {
    throw "$model did not round-trip the 50-slot XG playstyle"
  }
  if ([int]$afterEnd.response.gametop.player.info.log.'#text' -ne 1) {
    throw "$model did not persist the Community Log tutorial state"
  }
  $secretIds = @(Get-NumberArray $afterEnd.response.gametop.player.xg_secret_music_id)
  $secretSeqs = @(Get-NumberArray $afterEnd.response.gametop.player.xg_secret_music_seq)
  $xPlanIndex = -1
  for ($secretIndex = 0; $secretIndex -lt $secretIds.Count; $secretIndex++) {
    if ([int]$secretIds[$secretIndex] -eq 1834) {
      $xPlanIndex = $secretIndex
      break
    }
  }
  if ($xPlanIndex -lt 0 -or [int]$secretSeqs[$xPlanIndex] -ne 15) {
    throw "$model did not return the complete tutorial X-Plan sequence mask 15"
  }
  $expectedCoopeState = if ($CooperationChallengeEnabled) { 1 } else { 0 }
  if ([int]$afterEnd.response.gametop.player.info.coope_challenge.'#text' -ne $expectedCoopeState) {
    throw "$model Cooperation Challenge state did not match -CooperationChallengeEnabled=$CooperationChallengeEnabled"
  }
  if ([int]$afterEnd.response.gametop.player.customize.shutter.'#text' -ne 3 -or
      [int]$afterEnd.response.gametop.player.customize.auto.'#text' -ne 1 -or
      [int]$afterEnd.response.gametop.player.customize.random.'#text' -ne 2 -or
      [int]$afterEnd.response.gametop.player.customize.skin.'#text' -ne 8 -or
      [string]$afterEnd.response.gametop.player.customize.meter_custom.'#text' -ne '1 2 3') {
    throw "$model did not round-trip customize/settings fields"
  }
  Assert-FailedScoreEncoding $afterEnd.response.gametop.player.standard 1853 1 2 11 11 19 $classicSkill $classicRank "$model classic score container"
  Assert-MusicAbsent $afterEnd.response.gametop.player.standard $misalignedStageMusicId "$model classic score from misaligned modedata.stage"

  $standardEnd = Invoke-GameRequest $model "<gameend method=`"regist`"><gamemode mode=`"game_mode`"/><mode __type=`"str`">standard</mode><player card=`"use`" no=`"1`"><playerinfo><refid __type=`"str`">$groupRefid</refid><playstyles __type=`"s32`" __count=`"50`">$zeroPlaystyleText</playstyles><info><log __type=`"u32`">0</log></info><groupdata groupid=`"0`"><pdata><play_log><index __type=`"s32`">3</index><logid __type=`"s32`">3</logid><attrib __type=`"s32`">1</attrib><param __type=`"str`">813,1853</param></play_log><event_log><index __type=`"s32`">3</index><logid __type=`"s32`">32</logid><attrib __type=`"s32`">2</attrib><param __type=`"str`">2,3</param></event_log></pdata></groupdata></playerinfo><playdata><kind __type=`"s8`">0</kind><musicid __type=`"s32`">1853</musicid><music_type __type=`"s8`">1</music_type><seqmode __type=`"s8`">1</seqmode><skill_point __type=`"s32`">$standardSkillPoint</skill_point><skill_perc __type=`"s16`">$standardSkill</skill_perc><result_rank __type=`"s8`">$standardRank</result_rank><score __type=`"u32`">22345</score></playdata></player></gameend>"
  Assert-Response $standardEnd 'gameend'
  $afterStandard = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $afterStandard 'gametop'
  if ([int]$afterStandard.response.gametop.player.mode.'#text' -ne 1) {
    throw "$model STANDARD did not round-trip as SELECT MODE value 1"
  }
  if ([int]$afterStandard.response.gametop.player.xg_skill.'#text' -ne $standardSkillPoint -or
      [int]$afterStandard.response.gametop.player.xg_all_skill.'#text' -ne $standardSkillPoint) {
    throw "$model did not round-trip the XG Skill fields"
  }
  $afterStandardStyles = @(Get-NumberArray $afterStandard.response.gametop.player.xg_playstyle)
  if ([int]$afterStandardStyles[16] -ne 2 -or
      [int]$afterStandard.response.gametop.player.info.log.'#text' -ne 1) {
    throw "$model allowed stale gameend data to revoke the one-shot Community tutorial state"
  }
  Assert-FailedScoreEncoding $afterStandard.response.gametop.player.xg 1853 1 1 9 9 16 $standardSkill $standardRank "$model standard score container"
  Assert-FailedScoreEncoding $afterStandard.response.gametop.player.standard 1853 1 2 11 11 19 $classicSkill $classicRank "$model classic score after standard play"

  # The cabinet uploads one play at a time.  Score, achievement, rank and the
  # Clear/FC/Excellent states are independent records: a lower-score play may
  # improve achievement, while a later higher-score FAILED play must not erase
  # any of those improvements.
  $betterAchievement = Invoke-ScoreResult $model $groupRefid 'standard' 1853 1 20000 7000 5 -Clear 1 -FullCombo 1 -Combo 150 -SkillPoint 2000
  Assert-Response $betterAchievement 'gameend'
  $afterBetterAchievement = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $afterBetterAchievement 'gametop'
  Assert-FailedScoreEncoding $afterBetterAchievement.response.gametop.player.xg 1853 1 1 9 9 16 7000 5 "$model lower-score achievement/FC merge" @(2, 0, 2, 2)

  $higherScoreWorseRecord = Invoke-ScoreResult $model $groupRefid 'standard' 1853 1 50000 6000 4 -Excellent 1 -Combo 50 -SkillPoint 1500
  Assert-Response $higherScoreWorseRecord 'gameend'
  $afterHigherScore = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $afterHigherScore 'gametop'
  Assert-FailedScoreEncoding $afterHigherScore.response.gametop.player.xg 1853 1 1 9 9 16 7000 5 "$model higher-score worse rank/Excellent merge" @(2, 2, 2, 2)

  $failedAfterSuccess = Invoke-ScoreResult $model $groupRefid 'standard' 1853 1 60000 -1 0
  Assert-Response $failedAfterSuccess 'gameend'
  $failedRetry = Invoke-ScoreResult $model $groupRefid 'standard' 1853 1 60000 -1 0
  Assert-Response $failedRetry 'gameend'
  if ([int]$failedRetry.response.gameend.player.play_cnt.'#text' -ne
      [int]$failedAfterSuccess.response.gameend.player.play_cnt.'#text') {
    throw "$model duplicate score submission incremented play count"
  }
  $afterFailedRetry = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $afterFailedRetry 'gametop'
  Assert-FailedScoreEncoding $afterFailedRetry.response.gametop.player.xg 1853 1 1 9 9 16 7000 5 "$model FAILED-after-success merge" @(2, 2, 2, 2)

  $failedFirst = Invoke-ScoreResult $model $groupRefid 'standard' 1855 1 90000 -1 0
  Assert-Response $failedFirst 'gameend'
  $afterFailedFirst = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $afterFailedFirst 'gametop'
  Assert-FailedScoreEncoding $afterFailedFirst.response.gametop.player.xg 1855 1 1 9 9 16 -1 0 "$model initial FAILED score"

  $successAfterFailure = Invoke-ScoreResult $model $groupRefid 'standard' 1855 1 100 4500 2 -Clear 1
  Assert-Response $successAfterFailure 'gameend'
  $afterSuccess = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $afterSuccess 'gametop'
  Assert-FailedScoreEncoding $afterSuccess.response.gametop.player.xg 1855 1 1 9 9 16 4500 2 "$model success-after-FAILED merge" @(0, 0, 2, 2)

  $beginnerEnd = Invoke-GameRequest $model "<gameend method=`"regist`"><gamemode mode=`"game_mode`"/><mode __type=`"str`">beginner</mode><player card=`"use`" no=`"1`"><playerinfo><refid __type=`"str`">$groupRefid</refid></playerinfo><playdata><kind __type=`"s8`">0</kind><musicid __type=`"s32`">1853</musicid><music_type __type=`"s8`">1</music_type><seqmode __type=`"s8`">1</seqmode><skill_perc __type=`"s16`">$beginnerSkill</skill_perc><result_rank __type=`"s8`">$beginnerRank</result_rank><score __type=`"u32`">32345</score></playdata></player></gameend>"
  Assert-Response $beginnerEnd 'gameend'
  $afterBeginner = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $afterBeginner 'gametop'
  if ([int]$afterBeginner.response.gametop.player.mode.'#text' -ne 0) {
    throw "$model PRACTICE/beginner did not round-trip as SELECT MODE value 0"
  }
  Assert-FailedScoreEncoding $afterBeginner.response.gametop.player.xg 1853 1 1 9 9 16 7000 5 "$model standard score after beginner play" @(2, 2, 2, 2)
  Assert-FailedScoreEncoding $afterBeginner.response.gametop.player.standard 1853 1 2 11 11 19 $classicSkill $classicRank "$model classic score after beginner play"

  $kindOneEnd = Invoke-GameRequest $model "<gameend method=`"regist`"><gamemode mode=`"game_mode`"/><mode __type=`"str`">standard</mode><player card=`"use`" no=`"1`"><playerinfo><refid __type=`"str`">$groupRefid</refid></playerinfo><playdata><kind __type=`"s8`">1</kind><musicid __type=`"s32`">1853</musicid><music_type __type=`"s8`">1</music_type><seqmode __type=`"s8`">1</seqmode><skill_perc __type=`"s16`">$kindOneSkill</skill_perc><result_rank __type=`"s8`">$kindOneRank</result_rank><score __type=`"u32`">42345</score></playdata></player></gameend>"
  Assert-Response $kindOneEnd 'gameend'
  $kindOneTop = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">1</kind></request></player></gametop>"
  Assert-Response $kindOneTop 'gametop'
  Assert-FailedScoreEncoding $kindOneTop.response.gametop.player.xg 1853 1 1 9 9 16 $kindOneSkill $kindOneRank "$model kind=1 standard score container"
  Assert-MusicAbsent $kindOneTop.response.gametop.player.standard 1853 "$model kind=1 classic score container"
  $kindZeroAgain = Invoke-GameRequest $model "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $kindZeroAgain 'gametop'
  Assert-FailedScoreEncoding $kindZeroAgain.response.gametop.player.xg 1853 1 1 9 9 16 7000 5 "$model kind=0 score after kind=1 play" @(2, 2, 2, 2)
  Assert-FailedScoreEncoding $kindZeroAgain.response.gametop.player.standard 1853 1 2 11 11 19 $classicSkill $classicRank "$model kind=0 classic score after kind=1 play"

  $otherModel = if ($model -eq 'K32') { 'K33' } else { 'K32' }
  $otherModelTop = Invoke-GameRequest $otherModel "<gametop method=`"get`"><player no=`"1`"><refid __type=`"str`">$groupRefid</refid><request><kind __type=`"s8`">0</kind></request></player></gametop>"
  Assert-Response $otherModelTop 'gametop'
  Assert-MusicAbsent $otherModelTop.response.gametop.player.xg 1853 "$model score requested through $otherModel"
  Assert-MusicAbsent $otherModelTop.response.gametop.player.standard 1853 "$model classic score requested through $otherModel"

  $created = Invoke-GameRequest $model "<groupcreate method=`"regist`"><group><group_name __type=`"str`">$model GROUP</group_name><icon __type=`"s32`">1</icon><refid __type=`"str`">$groupRefid</refid><is_recruitment __type=`"bool`">1</is_recruitment></group></groupcreate>"
  Assert-Response $created 'groupcreate'
  $createdGroupId = [int]$created.response.groupcreate.groupdata.groupid
  if ($createdGroupId -lt 1000000000 -or
      $createdGroupId -gt 2147483647 -or
      ([string]$createdGroupId).Length -ne 10) {
    throw "$model registered player received non-searchable GroupID '$createdGroupId'"
  }
  if ([string]$created.response.groupcreate.groupdata.state -ne '0') {
    throw "$model group-create response is missing state 0"
  }
  Assert-GroupDataPayload $created.response.groupcreate.groupdata "$model group create"
  $createdPlayer = @($created.response.groupcreate.groupdata.member.player)[0]
  Assert-NumberArray $createdPlayer.emblem $roundTripEmblem "$model group-create Ability emblem"
  if ([int]$createdPlayer.skill.'#text' -ne 2000) {
    throw "$model group-create member Skill did not select the Ability colour band"
  }
  $expectedCoopeEventId = if ($CooperationChallengeEnabled) { 1 } else { 0 }
  if ([int]$createdPlayer.icon.'#text' -ne 16 -or
      [int]$createdPlayer.icon_back.'#text' -ne 2 -or
      [int]$createdPlayer.log_num.'#text' -ne 5 -or
      [int]$createdPlayer.coope_eventid.'#text' -ne $expectedCoopeEventId) {
    throw "$model did not round-trip Community Log state"
  }
  Assert-LogSlot $createdPlayer.p_log_data 1 2 1 '812,1853' "$model first player play log"
  Assert-LogSlot $createdPlayer.p_log_data 3 3 1 '813,1853' "$model second player play log"
  Assert-LogSlot $createdPlayer.p_log_data 4 5 1 "$memorialDay,1853" "$model generated FULL COMBO log"
  Assert-LogSlot $createdPlayer.p_log_data 5 7 1 "$memorialDay,1853" "$model generated EXCELLENT log"
  Assert-LogSlot $createdPlayer.e_log_data 2 1 2 "$memorialDay,1834" "$model generated X-Plan tutorial event log"
  Assert-LogSlot $createdPlayer.e_log_data 3 32 2 '2,3' "$model second player event log"
  $xPlanRewardLogs = @(
    @($createdPlayer.e_log_data.log) | Where-Object {
      [int]$_.logid.'#text' -eq 1 -and [string]$_.param.'#text' -match ',1834(?:,|$)'
    }
  )
  if ($xPlanRewardLogs.Count -ne 1) {
    throw "$model generated the one-time X-Plan tutorial reward $($xPlanRewardLogs.Count) times"
  }

  if ($CooperationChallengeEnabled) {
    Assert-GroupCooperationCatalog $created.response.groupcreate.groupdata $cooperationEventIds[$model] "$model group-create Cooperation catalog"
    $baselineEventOne = @($created.response.groupcreate.groupdata.group_coope.cooperation_challenge) |
      Where-Object { [int]$_.eventid -eq 1 } |
      Select-Object -First 1
    $coopeBaselineTotal = [int]$baselineEventOne.total_score.'#text'
    $coopePayload = "<gameend method=`"regist`"><gamemode mode=`"game_mode`"/><mode __type=`"str`">standard</mode><player card=`"use`" no=`"1`"><playerinfo><refid __type=`"str`">$groupRefid</refid><groupdata groupid=`"$createdGroupId`"><pdata><coope_eventid __type=`"s32`">1</coope_eventid><log_num __type=`"s32`">0</log_num><play_log><index __type=`"s32`">9</index><logid __type=`"s32`">5</logid><attrib __type=`"s32`">1</attrib><param __type=`"str`">814,1854</param></play_log></pdata><player_coope><cooperation_challenge eventid=`"1`"><score __type=`"u32`">10</score><get_score __type=`"u32`">10</get_score></cooperation_challenge></player_coope></groupdata></playerinfo><playdata><kind __type=`"s8`">0</kind><musicid __type=`"s32`">1854</musicid><music_type __type=`"s8`">1</music_type><seqmode __type=`"s8`">1</seqmode><skill_perc __type=`"s16`">10</skill_perc><result_rank __type=`"s8`">1</result_rank><score __type=`"u32`">10</score></playdata></player></gameend>"
    $coopeEnd = Invoke-GameRequest $model $coopePayload
    Assert-Response $coopeEnd 'gameend'
    $coopeRetry = Invoke-GameRequest $model $coopePayload
    Assert-Response $coopeRetry 'gameend'
  }

  $loadedGroup = Invoke-GameRequest $model "<groupdata method=`"get`"><group><groupid __type=`"s32`">$createdGroupId</groupid><refid __type=`"str`">$groupRefid</refid></group></groupdata>"
  Assert-Response $loadedGroup 'groupdata'
  if ([int]$loadedGroup.response.groupdata.groupdata.groupid -ne $createdGroupId) {
    throw "$model groupdata.get did not return the requested group"
  }
  Assert-GroupDataPayload $loadedGroup.response.groupdata.groupdata "$model groupdata.get"
  Assert-GroupCreationLog $loadedGroup.response.groupdata.groupdata "$model groupdata.get"
  $loadedPlayer = @($loadedGroup.response.groupdata.groupdata.member.player) |
    Where-Object { [int]$_.did -eq [int]$createdPlayer.did } |
    Select-Object -First 1
  if ($null -eq $loadedPlayer) {
    throw "$model groupdata.get did not return the group creator"
  }
  Assert-NumberArray $loadedPlayer.emblem $roundTripEmblem "$model loaded group-member Ability emblem"
  if ([int]$loadedPlayer.skill.'#text' -ne 2000) {
    throw "$model loaded group-member Skill did not select the Ability colour band"
  }
  Assert-LogSlot $loadedPlayer.p_log_data 1 2 1 '812,1853' "$model loaded first player play log"
  Assert-LogSlot $loadedPlayer.p_log_data 3 3 1 '813,1853' "$model loaded second player play log"
  Assert-LogSlot $loadedPlayer.p_log_data 4 5 1 "$memorialDay,1853" "$model loaded generated FULL COMBO log"
  Assert-LogSlot $loadedPlayer.p_log_data 5 7 1 "$memorialDay,1853" "$model loaded generated EXCELLENT log"
  Assert-LogSlot $loadedPlayer.e_log_data 2 1 2 "$memorialDay,1834" "$model loaded generated X-Plan tutorial event log"
  Assert-LogSlot $loadedPlayer.e_log_data 3 32 2 '2,3' "$model loaded second player event log"
  if ($CooperationChallengeEnabled) {
    if ([int]$loadedPlayer.log_num.'#text' -ne 9) {
      throw "$model lower incoming log_num did not preserve the index-9 high-water mark"
    }
    Assert-LogSlot $loadedPlayer.p_log_data 9 5 1 '814,1854' "$model higher-index player log with lower log_num"
    Assert-PlayerCooperationScore $loadedPlayer 1 10 "$model loaded player Cooperation progress"
    Assert-GroupCooperationCatalog $loadedGroup.response.groupdata.groupdata $cooperationEventIds[$model] "$model loaded Cooperation catalog"
    $eventOne = @($loadedGroup.response.groupdata.groupdata.group_coope.cooperation_challenge) |
      Where-Object { [int]$_.eventid -eq 1 } |
      Select-Object -First 1
    $expectedCoopeTotal = $coopeBaselineTotal + 10
    if ($null -eq $eventOne -or [int]$eventOne.total_score.'#text' -ne $expectedCoopeTotal) {
      throw "$model duplicate Cooperation progress request returned group total_score '$($eventOne.total_score.'#text')' instead of baseline+10 '$expectedCoopeTotal'"
    }
  }

  $groupDataRegist = Invoke-GameRequest $model "<groupdata method=`"regist`"><refid __type=`"str`">$groupRefid</refid><groupdata groupid=`"$createdGroupId`"><group_comment/><player_comment/></groupdata></groupdata>"
  Assert-Response $groupDataRegist 'groupdata'
  if ([string]$groupDataRegist.response.groupdata.groupdata.state.__type -ne 's32' -or
      [int]$groupDataRegist.response.groupdata.groupdata.state.'#text' -ne 0) {
    throw "$model groupdata.regist did not return typed state s32=0"
  }

  $found = Invoke-GameRequest $model "<groupsearch method=`"groupid_search`"><groupid __type=`"s32`">$createdGroupId</groupid></groupsearch>"
  Assert-Response $found 'groupsearch'
  if ([string]$found.response.groupsearch.groupsearch.state -ne '0') {
    throw "$model could not find a newly created group"
  }
  if ([int]$found.response.groupsearch.groupsearch.group.groupid -ne $createdGroupId) {
    throw "$model group search returned an invalid group payload"
  }

  $groupsAfterCreate = Invoke-GameRequest $model '<grouplist method="get"/>'
  Assert-Response $groupsAfterCreate 'grouplist'
  if (-not (@($groupsAfterCreate.response.grouplist.grouplist.group) | Where-Object { [int]$_.groupid -eq $createdGroupId })) {
    throw "$model newly created group is missing from the group list"
  }

  $leaveCreated = Invoke-GameRequest $model "<groupwithdrawal method=`"regist`"><refid __type=`"str`">$groupRefid</refid></groupwithdrawal>"
  Assert-Response $leaveCreated 'groupwithdrawal'

  $lobby = Invoke-GameRequest $model '<lobby method="request"><lobbydata/></lobby>'
  Assert-Response $lobby 'lobby'

  $lobbyKind = if ($model -eq 'K32') { 32 } else { 33 }
  $lobbyA = Invoke-GameRequest $model "<lobby method=`"request`"><lobbydata><time><expire __type=`"u32`">30</expire></time><address><ip __type=`"str`">10.0.$lobbyKind.1</ip></address><requirement><kind __type=`"u8`">$lobbyKind</kind></requirement><player><refid __type=`"str`">LOBBY-$model-A</refid><class __type=`"u8`">0</class><bpoint __type=`"s32`">0</bpoint><skill __type=`"s32`">0</skill><win __type=`"u32`">0</win><lose __type=`"u32`">0</lose><draw __type=`"u32`">0</draw><last __type=`"u8`">0</last></player><req_cnt __type=`"u32`">1</req_cnt><shop><cabid __type=`"u32`">1</cabid><locationid __type=`"str`">LOCAL</locationid></shop><soft><version __type=`"str`">2011122800</version></soft><exclude nr=`"0`"/><check><attestid __type=`"str`">00AABBCCDDEEFF00000001</attestid></check></lobbydata></lobby>"
  Assert-Response $lobbyA 'lobby'

  $lobbyB = Invoke-GameRequest $model "<lobby method=`"request`"><lobbydata><time><expire __type=`"u32`">30</expire></time><address><ip __type=`"str`">10.0.$lobbyKind.2</ip></address><requirement><kind __type=`"u8`">$lobbyKind</kind></requirement><player><refid __type=`"str`">LOBBY-$model-B</refid><class __type=`"u8`">0</class><bpoint __type=`"s32`">0</bpoint><skill __type=`"s32`">0</skill><win __type=`"u32`">0</win><lose __type=`"u32`">0</lose><draw __type=`"u32`">0</draw><last __type=`"u8`">0</last></player><req_cnt __type=`"u32`">1</req_cnt><shop><cabid __type=`"u32`">1</cabid><locationid __type=`"str`">LOCAL</locationid></shop><soft><version __type=`"str`">2011122800</version></soft><exclude nr=`"0`"/><check><attestid __type=`"str`">00AABBCCDDEEFF00000002</attestid></check></lobbydata></lobby>"
  Assert-Response $lobbyB 'lobby'
  if ([string]$lobbyB.response.lobby.lobbydata.candidate.address.ip.'#text' -ne "10.0.$lobbyKind.1" -or
      [string]$lobbyB.response.lobby.lobbydata.candidate.check.attestid.'#text' -ne '00AABBCCDDEEFF00000001') {
    throw "$model lobby did not return a compatible local candidate"
  }

  $trial = Invoke-GameRequest $model '<shoptrial method="get"/>'
  Assert-Response $trial 'shoptrial'
  if ([string]$trial.response.shoptrial.cabid.'#text' -ne '1') {
    throw "$model shop trial is missing cabinet metadata"
  }

  $trialRanking = Invoke-GameRequest $model '<shoptrial method="ranking_get"/>'
  Assert-Response $trialRanking 'shoptrial'
  if (@($trialRanking.response.shoptrial.shoptrial.data).Count -ne 200) {
    throw "$model shop trial ranking did not return the 200 protocol slots"
  }

  $trialCabid = if ($model -eq 'K32') { 32 } else { 33 }
  $trialDid = if ($model -eq 'K32') { 3201 } else { 3301 }
  $trialRegister = Invoke-GameRequest $model "<shoptrial method=`"regist`"><shop><cabid __type=`"u32`">$trialCabid</cabid><round __type=`"u32`">7</round><title __type=`"str`">$model SMOKE TRIAL</title><pref __type=`"u32`">1</pref><start_date __type=`"str`">2026-01-01 00:00</start_date><end_date __type=`"str`">2027-01-01 00:00</end_date><musicid __type=`"s32`" __count=`"3`">1 2 3</musicid><is_valid __type=`"bool`">1</is_valid></shop><player><did __type=`"s32`">$trialDid</did><name __type=`"str`">SMOKE</name><seqmode __type=`"s32`" __count=`"3`">0 1 2</seqmode><point __type=`"s32`" __count=`"3`">100 200 300</point><total_point __type=`"s32`">600</total_point><result __type=`"bool`">1</result></player></shoptrial>"
  Assert-Response $trialRegister 'shoptrial'
  if ([string]$trialRegister.response.shoptrial.is_valid.'#text' -ne '1') {
    throw "$model shop trial registration was not persisted"
  }

  $storedTrial = Invoke-GameRequest $model "<shoptrial method=`"get`"><shop><cabid __type=`"u32`">$trialCabid</cabid><round __type=`"u32`">7</round></shop></shoptrial>"
  Assert-Response $storedTrial 'shoptrial'
  if ([string]$storedTrial.response.shoptrial.title.'#text' -ne "$model SMOKE TRIAL" -or
      [string]$storedTrial.response.shoptrial.start_date.'#text' -ne '2026-01-01 00:00:00' -or
      [string]$storedTrial.response.shoptrial.end_date.'#text' -ne '2027-01-01 00:00:00') {
    throw "$model shop trial configuration or minute-to-second date normalization could not be loaded"
  }

  $storedRanking = Invoke-GameRequest $model "<shoptrial method=`"ranking_get`"><shop><cabid __type=`"u32`">$trialCabid</cabid><round __type=`"u32`">7</round></shop></shoptrial>"
  Assert-Response $storedRanking 'shoptrial'
  if ([int]$storedRanking.response.shoptrial.shoptrial.data[0].did.'#text' -ne $trialDid -or
      [int]$storedRanking.response.shoptrial.shoptrial.data[0].total_point.'#text' -ne 600) {
    throw "$model shop trial ranking did not return the persisted result"
  }

  $myshop = Invoke-GameRequest $model '<myshop method="regist"/>'
  Assert-Response $myshop 'myshop'
  if (-not $myshop.response.myshop.shop) {
    throw "$model myshop response is missing the shop node"
  }
  $shopChampionshipState = [int]$myshop.response.myshop.is_valid_shopchamp.'#text'
  if ($shopChampionshipState -notin @(0, 1) -or
      -not $myshop.response.myshop.shop_shopchampionship.now_entry.shopchamp -or
      -not $myshop.response.myshop.player_shopchampionship.now_entry.shopchamp) {
    throw "$model myshop response is missing valid shop-championship data"
  }

  $texture = Invoke-GameRequest $model '<infodata method="get"/>'
  Assert-Response $texture 'infodata'
  if (-not $texture.response.infodata.texture) {
    throw "$model infodata response is missing the texture node"
  }

  $collabo = Invoke-GameRequest $model '<jubeat_collabo method="check"/>'
  Assert-Response $collabo 'jubeat_collabo'

  $collaboRefid = "SMOKE-COLLABO-$model"
  $collaboRegister = Invoke-GameRequest $model "<jubeat_collabo method=`"regist`"><refid __type=`"str`">$collaboRefid</refid></jubeat_collabo>"
  Assert-Response $collaboRegister 'jubeat_collabo'
  if ([int]$collaboRegister.response.jubeat_collabo.save_state.'#text' -ne 1) {
    throw "$model collaboration registration was not persisted"
  }
  $collaboStored = Invoke-GameRequest $model "<jubeat_collabo method=`"check`"><refid __type=`"str`">$collaboRefid</refid></jubeat_collabo>"
  Assert-Response $collaboStored 'jubeat_collabo'
  if ([string]$collaboStored.response.jubeat_collabo.j_gfdm.'#text' -ne '1') {
    throw "$model collaboration check did not return the stored state"
  }

  $assertReport = Invoke-GameRequest $model '<assert_report method="regist"><message __type="str">smoke</message></assert_report>'
  Assert-Response $assertReport 'assert_report'
}

Write-Output 'K32/K33 startup protocol smoke test passed.'

