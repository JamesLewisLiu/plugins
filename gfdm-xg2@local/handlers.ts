type Profile = {
  collection: 'profile';
  did?: number;
  groupId?: number;
  shopLocationId?: string;
  shopCabId?: number;
  name: string;
  chara: number;
  lastMode: number;
  modeEncodingVersion: number;
  style: number;
  style2: number;
  xgPlaystyle: number[];
  infoState: PlayerInfoState;
  communityIcon: number;
  communityIconBack: number;
  communityLogNum: number;
  communityCoopeEventId: number;
  communityCoopeEventIds: { [gameCode: string]: number };
  communityCoopeScores: CooperationScore[];
  communityPlayLogs: CommunityLog[];
  communityEventLogs: CommunityLog[];
  communitySchemaVersion: number;
  communityTutorialRewardVersion: number;
  /** Legacy single-log field, retained only for migration. */
  communityEventLog?: CommunityEventLog;
  secretMusic: number[];
  secretChara: number;
  syogo: number[];
  perfect: number;
  great: number;
  good: number;
  poor: number;
  miss: number;
  playCount: number;
  livePoint: number;
  plusLivePoint: number;
  trophyList: number[];
  skillData: { [key: string]: SkillTotals };
  technicalStatus: { [gameCode: string]: TechnicalStatus };
  gameendSession?: number;
  lastGameendReceipt?: GameendReceipt;
  customItems: number[];
  shutter: number;
  infoLevel: number;
  nameDisp: number;
  auto: number;
  random: number;
  judgeLogo: number;
  skin: number;
  movie: number;
  attackEffect: number;
  layout: number;
  targetSkill: number;
  comparison: number;
  meterCustom: number[];
};

type CommunityLog = {
  index: number;
  logId: number;
  attrib: number;
  param: string;
  ctime: string;
};

type CommunityEventLog = CommunityLog;

type SkillTotals = {
  xgSkill: number;
  xgAllSkill: number;
  vSkill: number;
  vAllSkill: number;
};

type XgRecentData = {
  clearNum: number;
  fullClearNum: number;
  excellentClearNum: number;
  maxClearDifficulty: number;
  maxFullComboDifficulty: number;
  maxExcellentDifficulty: number;
  maxSClearDifficulty: number;
  maxSsClearDifficulty: number;
  musicIds: number[];
  maxComboRates: number[];
  perfectRates: number[];
  missRates: number[];
};

type VRecentData = {
  clearNum: number;
  fullClearNum: number;
  excellentClearNum: number;
  maxClearDifficulty: number;
  maxFullComboDifficulty: number;
  maxExcellentDifficulty: number;
  musicIds: number[];
  clear: number[];
  flags: number[];
  difficulty: number[];
  comboRates: number[];
  perfectRates: number[];
};

type TechnicalStatus = {
  // game.dll renders ABL_EMB<type><level><skill-colour>.  The two Ability
  // indices are transported as emblem[1] and emblem[2]; emblem[0] is the
  // ordinary player emblem/chara field.
  abilityType: number;
  abilityLevel: number;
  xgRecent: XgRecentData;
  vRecent: VRecentData;
};

type GroupLog = {
  index: number;
  did: number;
  logId: number;
  param: string;
  ctime: string;
};

type CooperationScore = {
  gameCode: string;
  eventId: number;
  score: number;
};

type GroupCooperationScore = {
  gameCode: string;
  eventId: number;
  totalScore: number;
  validTime: string;
};

type PlayerInfoState = {
  mode: number;
  boss: number;
  addMusic: number;
  freeMusic: number;
  freeSeq: number;
  indies: number;
  jukebox: number;
  trial: number;
  topRanker: number;
  log: number;
  coopeChallenge: number;
  customChallenge: number;
  groupCompe: number;
  groupTrial: number;
  group: number;
  shopChamp: number;
  groupLevel: number;
  livePoint: number;
  texture: number;
  groupmemberRecruitment: number;
};

type Shop = {
  collection: 'shop';
  locationId: string;
  cabid: number;
  name: string;
  pref: number;
  systemId: string;
  softwareId: string;
  hardwareId: string;
  updatedAt: number;
};

type Score = {
  collection: 'score';
  schemaVersion?: number;
  gameCode: string;
  playMode: 'beginner' | 'standard' | 'classic' | 'unknown';
  kind: number;
  musicType: number;
  musicId: number;
  seqMode: number;
  score: number;
  clear: number;
  autoClear: number;
  flags: number;
  fullCombo: number;
  excellent: number;
  combo: number;
  skillPoint: number;
  skillPercent: number;
  resultRank: number;
  difficulty: number;
  comboRate: number;
  perfectRate: number;
  attempts: number;
  updatedAt: number;
};

type Group = {
  collection: 'group';
  groupId: number;
  name: string;
  icon: number;
  ownerRefid: string;
  memberRefids: string[];
  isRecruitment: boolean;
  livePoint: number;
  createdAt: number;
  playLogs?: GroupLog[];
  eventLogs?: GroupLog[];
  cooperationScores?: GroupCooperationScore[];
};

type ShopTrial = {
  collection: 'shop_trial';
  cabid: number;
  round: number;
  title: string;
  pref: number;
  startDate: string;
  endDate: string;
  musicIds: number[];
  isValid: boolean;
  updatedAt: number;
};

const PROFILE_NAME_MAX_LENGTH = 12;

export const changeProfileName = async (data: any, send?: WebUISend) => {
  const refid = String((data && data.refid) || '').trim().toUpperCase();
  if (!/^[0-9A-F]{16}$/.test(refid)) {
    if (send) send.error(400, 'Invalid profile reference ID.');
    return;
  }

  const profile = await DB.FindOne<Profile>(refid, { collection: 'profile' });
  if (!profile) {
    if (send) send.error(404, 'XG2 profile not found.');
    return;
  }

  const name = String((data && data.name) || '').trim().normalize('NFC');
  if (!name) {
    if (send) send.error(400, 'Player name cannot be empty.');
    return;
  }
  if (Array.from(name).length > PROFILE_NAME_MAX_LENGTH) {
    if (send) {
      send.error(
        400,
        `Player name must be ${PROFILE_NAME_MAX_LENGTH} characters or fewer.`
      );
    }
    return;
  }
  if (/[\u0000-\u001F\u007F<>&]/.test(name)) {
    if (send) send.error(400, 'Player name contains unsupported characters.');
    return;
  }

  await DB.Update<Profile>(
    refid,
    { collection: 'profile' },
    { $set: { name } }
  );
  const updated = await DB.FindOne<Profile>(refid, { collection: 'profile' });
  if ((!updated || updated.name !== name) && send) {
    send.error(409, 'Player name was not updated.');
  }
};

type ShopTrialEntry = {
  collection: 'shop_trial_entry';
  cabid: number;
  round: number;
  did: number;
  refid: string;
  name: string;
  seqmode: number[];
  point: number[];
  totalPoint: number;
  result: boolean;
  isValid: boolean;
  updatedAt: number;
};

type LobbyEntry = {
  collection: 'lobby_entry';
  refid: string;
  ip: string;
  attestId: string;
  kind: number;
  excluded: string[];
  expiresAt: number;
  updatedAt: number;
};

type CollaboState = {
  collection: 'collabo_state';
  refid: string;
  gfdmRegistered: boolean;
  jubeatConfirmed: boolean;
  saveState: number;
  updatedAt: number;
};

type GameendReceipt = {
  session: number;
  fingerprint: string;
  processedAt: number;
  playCount: number;
  nowTime: string;
};

const playSessions: { [refid: string]: number } = {};
const gameendReceipts: { [refid: string]: GameendReceipt } = {};
let groupIdMigrationPromise: Promise<void> | null = null;

const I = (type: string, value: any, attr?: KAttrMap): any =>
  (K.ITEM as any)(type, value, attr);
const A = (type: string, value: any[], attr?: KAttrMap): any =>
  (K.ARRAY as any)(type, value, attr);
const zeros = (count: number) => Array(count).fill(0);
const negatives = (count: number) => Array(count).fill(-1);
const XG_PLAYSTYLE_COUNT = 50;
const CUSTOM_ITEM_COUNT = 48;
const TROPHY_COUNT = 19;
const SCORE_SCHEMA_VERSION = 2;
const COMMUNITY_SCHEMA_VERSION = 2;
const COMMUNITY_TUTORIAL_REWARD_VERSION = 1;
const MEMBER_PLAY_LOG_COUNT = 15;
const MEMBER_EVENT_LOG_COUNT = 5;
const GROUP_PLAY_LOG_COUNT = 15;
const GROUP_EVENT_LOG_COUNT = 5;
const GROUP_ID_MIN = 1000000000;
const GROUP_ID_MAX = 2147483647;
const X_PLAN_MUSIC_ID = 1834;
const X_PLAN_TUTORIAL_UNLOCK_MASK = 14;
const XG_REGULAR_UNLOCK_MASK = 4;
// Category 2 item packs populate the Attack Effect, Judge Text, Combo,
// Notes, Shutter and Preset skin lists.  The recovered client recognizes
// pack IDs 1..11 as category * 100000 + item ID.
const XG2_SKIN_PACK_ITEMS = Array.from(
  { length: 11 },
  (_value, index) => 200001 + index
).concat(zeros(CUSTOM_ITEM_COUNT - 11));
const XG_MDATA_DEFAULT = [-1]
  .concat(Array(8).fill(-2))
  .concat(Array(11).fill(0));
const CLASSIC_MDATA_DEFAULT = [-1, -1]
  .concat(Array(9).fill(-2))
  .concat(Array(9).fill(0));
const XG2_PLUS_MUSIC = [
  1837, 1865, 1833, 1869, 1816,
  1872, 1820, 1868, 1827, 1844,
  1866, 1840, 1871, 1815, 1825,
];
const XG2_PLUS_BORDERS = [
  4000, 8000, 12000, 16000, 20000,
  24000, 28000, 32000, 36000, 40000,
  44000, 48000, 52000, 56000, 60000,
];
const GROUP_COMPETITION_REWARDS: { [term: number]: number[] } = {
  1: [811, 1405, 810],
  2: [1628, 836, 1408],
  3: [837, 613, 1460],
  4: [1611, 1626, 703],
};
const ARCHIVE_EVENT_START = '2011-03-09 00:00:00';
const ARCHIVE_EVENT_END = '2037-12-31 23:59:59';
const COOPERATION_EVENT_IDS: { [gameCode: string]: number[] } = {
  // coop_data.xml contains exactly 26 local definitions for each game.  K33
  // is GuitarFreaks; K32 is DrumMania and uses event 27 instead of GF's 18.
  K33: [
    1, 2, 3, 4, 5, 16, 7, 8, 9, 10, 11, 12, 13,
    14, 15, 6, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  ],
  K32: [
    1, 2, 3, 4, 5, 16, 7, 8, 9, 10, 11, 12, 13,
    14, 15, 6, 17, 27, 19, 20, 21, 22, 23, 24, 25, 26,
  ],
};

function configBoolean(key: string, fallback: boolean): boolean {
  const value = U.GetConfig(key);
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return !['0', 'false', 'off', 'no'].includes(String(value).toLowerCase());
}

function configInteger(key: string, fallback: number, min: number, max: number): number {
  const raw = U.GetConfig(key);
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return Math.max(min, Math.min(max, fallback));
  }
  const parsed = Number(raw);
  const value = Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
  return Math.max(min, Math.min(max, value));
}

function configString(key: string, fallback: string): string {
  const value = U.GetConfig(key);
  return value === undefined || value === null || value === ''
    ? fallback
    : String(value);
}

function appendFestivalMode(): 'off' | 'active' | 'ended' {
  const value = configString('append_festival_mode', 'ended');
  return value === 'off' || value === 'active' ? value : 'ended';
}

function xg2PlusTerm(): number {
  return configBoolean('xg2_plus_enabled', true)
    ? configInteger('xg2_plus_term', 15, 0, 15)
    : 0;
}

function xg2PlusUnlockPolicy(): string {
  const value = configString('xg2_plus_unlock_policy', 'all_unlocked');
  return value === 'original_progression' ? value : 'all_unlocked';
}

function xg2PlusPayload(): any {
  const term = xg2PlusTerm();
  return {
    term: I('u8', term),
    music_list: A(
      's32',
      XG2_PLUS_MUSIC.slice(0, term).concat(negatives(15 - term))
    ),
    border_list: A(
      's32',
      XG2_PLUS_BORDERS.slice(0, term).concat(zeros(15 - term))
    ),
  };
}

function xg2PlusLimit(): number {
  const term = xg2PlusTerm();
  return term > 0 ? XG2_PLUS_BORDERS[term - 1] : -1;
}

function profilePlusLivePoint(profile: Profile): number {
  const limit = xg2PlusLimit();
  if (limit < 0) return -1;
  if (xg2PlusUnlockPolicy() === 'all_unlocked') return limit;
  return Math.max(0, Math.min(limit, profile.plusLivePoint || 0));
}

function livePointTerm(): number {
  return configInteger('live_point_term', 6, 0, 6);
}

function xgBossPayload(): any {
  return {
    division: I('u8', configInteger('xg_extra_rush_level', 15, 0, 15)),
    border: A('u8', zeros(10)),
    extra_border: I('u8', 90),
    bsc_encore_border: I('u8', 92),
    adv_encore_border: I('u8', 93),
    ext_encore_border: I('u8', 94),
    ult_encore_border: I('u8', 95),
    bsc_climax_border: I('u8', 95),
    adv_climax_border: I('u8', 95),
    ext_climax_border: I('u8', 95),
    ult_climax_border: I('u8', 95),
  };
}

function vBossPayload(): any {
  return {
    division: I('u8', 14),
    border: A('u8', zeros(9)),
    extra_border: I('u8', 90),
    bsc_encore_border: I('u8', 92),
    adv_encore_border: I('u8', 93),
    ext_encore_border: I('u8', 94),
    bsc_premium_border: I('u8', 95),
    adv_premium_border: I('u8', 95),
    ext_premium_border: I('u8', 95),
  };
}

function demoConfiguration(): {
  musicId: number;
  sequenceMode: number;
  startMs: number;
  durationMs: number;
} {
  return {
    musicId: configInteger('demo_music_id', 1845, 0, 99999),
    sequenceMode: configInteger('demo_sequence_mode', 1, 0, 8),
    startMs: configInteger('demo_start_ms', 58500, 0, 600000),
    durationMs: configInteger('demo_duration_ms', 9800, 300, 120000),
  };
}

function shopChampionshipTerm(): number {
  return configInteger('shop_championship_term', 0, 0, 4);
}

function groupCompetitionTerm(): number {
  return configInteger('group_competition_term', 0, 0, 4);
}

function shopChampionshipPayload(): any {
  const term = shopChampionshipTerm();
  return K.ATTR(
    { term: String(term) },
    {
      state: I('u8', term > 0 ? 1 : 0),
      start: I('str', term > 0 ? ARCHIVE_EVENT_START : ''),
      end: I('str', term > 0 ? ARCHIVE_EVENT_END : ''),
    }
  );
}

function groupCompetitionPayload(): any {
  const term = groupCompetitionTerm();
  return K.ATTR(
    { term: String(term) },
    {
      state: I('u8', term > 0 ? 1 : 0),
      start: I('str', term > 0 ? ARCHIVE_EVENT_START : ''),
      end: I('str', term > 0 ? ARCHIVE_EVENT_END : ''),
      reward_music: A('s32', GROUP_COMPETITION_REWARDS[term] || negatives(3)),
    }
  );
}

function groupLevel(livePoint: number): number {
  return Math.max(1, Math.min(13, Math.floor(Math.max(0, livePoint) / 30000) + 1));
}

function cooperationChallengeEnabled(): boolean {
  return configBoolean('cooperation_challenge_enabled', true);
}

function cooperationEventIds(gameCode: string): number[] {
  return (COOPERATION_EVENT_IDS[gameCode] || COOPERATION_EVENT_IDS.K33).slice();
}

function requestGameCode(info: any): string {
  const model = String((info && info.model) || '').toUpperCase();
  const match = model.match(/K3[23]/);
  return match ? match[0] : model.split(':')[0] || 'UNKNOWN';
}

function requestPlayMode(data: any): Score['playMode'] {
  const value = $(data).str('mode', '').toLowerCase();
  return value === 'beginner' || value === 'standard' || value === 'classic'
    ? value
    : 'unknown';
}

function normalizeNumbers(values: number[] | undefined, count: number, fill = 0): number[] {
  return (values || []).slice(0, count).concat(
    Array(Math.max(0, count - (values || []).length)).fill(fill)
  );
}

function normalizeCustomItems(values: number[] | undefined): number[] {
  return normalizeNumbers(values, CUSTOM_ITEM_COUNT).map(value =>
    clampInteger(value, -1, 0x7fffffff)
  );
}

function normalizeTrophyList(values: number[] | undefined): number[] {
  return normalizeNumbers(values, TROPHY_COUNT, -1).map(value => {
    const trophy = Math.floor(Number(value));
    return Number.isFinite(trophy) && trophy >= 0 ? Math.min(99, trophy) : -1;
  });
}

function mergeTrophyList(previous: number[] | undefined, incoming: number[]): number[] {
  const merged = normalizeTrophyList(previous);
  const normalizedIncoming = normalizeTrophyList(incoming);
  for (let index = 0; index < TROPHY_COUNT; index++) {
    if (normalizedIncoming[index] >= 0) {
      // Trophy variants are progressive within each fixed category slot.  A
      // stale cabinet must not replace an already-earned icon with an older
      // value, while -1 means "no update" rather than "delete this trophy".
      merged[index] = Math.max(merged[index], normalizedIncoming[index]);
    }
  }
  return merged;
}

function clampS32(value: any): number {
  return Math.max(0, Math.min(0x7fffffff, Math.floor(Number(value) || 0)));
}

function clampInteger(value: any, minimum: number, maximum: number): number {
  return Math.max(
    minimum,
    Math.min(maximum, Math.floor(Number(value) || 0))
  );
}

function normalizeMusicIds(values: number[] | undefined): number[] {
  return normalizeNumbers(values, 20, -1).map(value =>
    clampInteger(value, -1, 0x7fffffff)
  );
}

function normalizeRates(values: number[] | undefined): number[] {
  return normalizeNumbers(values, 20).map(value => clampInteger(value, 0, 100));
}

function normalizeS8Values(values: number[] | undefined): number[] {
  return normalizeNumbers(values, 20).map(value => clampInteger(value, 0, 0x7f));
}

function normalizeU32Values(values: number[] | undefined): number[] {
  return normalizeNumbers(values, 20).map(clampU32);
}

function emptyXgRecentData(): XgRecentData {
  return {
    clearNum: 0,
    fullClearNum: 0,
    excellentClearNum: 0,
    maxClearDifficulty: 0,
    maxFullComboDifficulty: 0,
    maxExcellentDifficulty: 0,
    maxSClearDifficulty: 0,
    maxSsClearDifficulty: 0,
    musicIds: negatives(20),
    maxComboRates: zeros(20),
    perfectRates: zeros(20),
    missRates: zeros(20),
  };
}

function emptyVRecentData(): VRecentData {
  return {
    clearNum: 0,
    fullClearNum: 0,
    excellentClearNum: 0,
    maxClearDifficulty: 0,
    maxFullComboDifficulty: 0,
    maxExcellentDifficulty: 0,
    musicIds: negatives(20),
    clear: zeros(20),
    flags: zeros(20),
    difficulty: zeros(20),
    comboRates: zeros(20),
    perfectRates: zeros(20),
  };
}

function emptyTechnicalStatus(): TechnicalStatus {
  return {
    abilityType: 0,
    abilityLevel: 0,
    xgRecent: emptyXgRecentData(),
    vRecent: emptyVRecentData(),
  };
}

function normalizeXgRecentData(value: Partial<XgRecentData> | undefined): XgRecentData {
  const source = value || {};
  return {
    clearNum: clampU32(source.clearNum),
    fullClearNum: clampU32(source.fullClearNum),
    excellentClearNum: clampU32(source.excellentClearNum),
    maxClearDifficulty: clampS32(source.maxClearDifficulty),
    maxFullComboDifficulty: clampS32(source.maxFullComboDifficulty),
    maxExcellentDifficulty: clampS32(source.maxExcellentDifficulty),
    maxSClearDifficulty: clampS32(source.maxSClearDifficulty),
    maxSsClearDifficulty: clampS32(source.maxSsClearDifficulty),
    musicIds: normalizeMusicIds(source.musicIds),
    maxComboRates: normalizeRates(source.maxComboRates),
    perfectRates: normalizeRates(source.perfectRates),
    missRates: normalizeRates(source.missRates),
  };
}

function normalizeVRecentData(value: Partial<VRecentData> | undefined): VRecentData {
  const source = value || {};
  return {
    clearNum: clampU32(source.clearNum),
    fullClearNum: clampU32(source.fullClearNum),
    excellentClearNum: clampU32(source.excellentClearNum),
    maxClearDifficulty: clampInteger(source.maxClearDifficulty, 0, 0x7f),
    maxFullComboDifficulty: clampInteger(source.maxFullComboDifficulty, 0, 0x7f),
    maxExcellentDifficulty: clampInteger(source.maxExcellentDifficulty, 0, 0x7f),
    musicIds: normalizeMusicIds(source.musicIds),
    clear: normalizeS8Values(source.clear),
    flags: normalizeU32Values(source.flags),
    difficulty: normalizeS8Values(source.difficulty),
    comboRates: normalizeRates(source.comboRates),
    perfectRates: normalizeRates(source.perfectRates),
  };
}

function normalizeTechnicalStatus(value: Partial<TechnicalStatus> | undefined): TechnicalStatus {
  const source = value || {};
  return {
    // tex_gf_ability.bin contains ABL_EMB types 1..4 and levels 0..2;
    // 0/0 selects the neutral placeholder for a profile with no play history.
    abilityType: clampInteger(source.abilityType, 0, 4),
    abilityLevel: clampInteger(source.abilityLevel, 0, 2),
    xgRecent: normalizeXgRecentData(source.xgRecent),
    vRecent: normalizeVRecentData(source.vRecent),
  };
}

function technicalStatusKey(gameCode: string): string {
  return gameCode.toUpperCase();
}

function profileTechnicalStatus(profile: Profile, gameCode: string): TechnicalStatus {
  return normalizeTechnicalStatus(
    profile.technicalStatus && profile.technicalStatus[technicalStatusKey(gameCode)]
  );
}

function profileEmblem(profile: Profile | null, gameCode: string): number[] {
  if (!profile) return [0, 0, 0];
  const technical = profileTechnicalStatus(profile, gameCode);
  return [profile.chara, technical.abilityType, technical.abilityLevel];
}

function uploadedTechnicalStatus(playerInfo: any, previous: TechnicalStatus): TechnicalStatus {
  const emblem = playerInfo.numbers('emblem', []);
  const xgElement = playerInfo.element('xg_recent');
  const vElement = playerInfo.element('v_recent');
  const xg = xgElement ? $(xgElement.obj) : null;
  const v = vElement ? $(vElement.obj) : null;

  const xgRecent = xg
    ? normalizeXgRecentData({
        clearNum: xg.number('clear_num', previous.xgRecent.clearNum),
        fullClearNum: xg.number('full_clear_num', previous.xgRecent.fullClearNum),
        excellentClearNum: xg.number('exc_clear_num', previous.xgRecent.excellentClearNum),
        maxClearDifficulty: xg.number(
          'max_clear_difficulty',
          previous.xgRecent.maxClearDifficulty
        ),
        maxFullComboDifficulty: xg.number(
          'max_fullcombo_clear_difficulty',
          previous.xgRecent.maxFullComboDifficulty
        ),
        maxExcellentDifficulty: xg.number(
          'max_excellent_clear_difficulty',
          previous.xgRecent.maxExcellentDifficulty
        ),
        maxSClearDifficulty: xg.number(
          'max_s_clear_difficulty',
          previous.xgRecent.maxSClearDifficulty
        ),
        maxSsClearDifficulty: xg.number(
          'max_ss_clear_difficulty',
          previous.xgRecent.maxSsClearDifficulty
        ),
        musicIds: xg.numbers('musicid', previous.xgRecent.musicIds),
        maxComboRates: xg.numbers('maxcombo_rate', previous.xgRecent.maxComboRates),
        perfectRates: xg.numbers('perfect_rate', previous.xgRecent.perfectRates),
        missRates: xg.numbers('miss_rate', previous.xgRecent.missRates),
      })
    : previous.xgRecent;

  const vRecent = v
    ? normalizeVRecentData({
        clearNum: v.number('clear_num', previous.vRecent.clearNum),
        fullClearNum: v.number('full_clear_num', previous.vRecent.fullClearNum),
        excellentClearNum: v.number('exc_clear_num', previous.vRecent.excellentClearNum),
        maxClearDifficulty: v.number(
          'max_clear_difficulty',
          previous.vRecent.maxClearDifficulty
        ),
        maxFullComboDifficulty: v.number(
          'max_fullcombo_difficulty',
          previous.vRecent.maxFullComboDifficulty
        ),
        maxExcellentDifficulty: v.number(
          'max_excellent_difficulty',
          previous.vRecent.maxExcellentDifficulty
        ),
        musicIds: v.numbers('musicid', previous.vRecent.musicIds),
        clear: v.numbers('clear', previous.vRecent.clear),
        flags: v.numbers('flags', previous.vRecent.flags),
        difficulty: v.numbers('difficulty', previous.vRecent.difficulty),
        comboRates: v.numbers('combo_rate', previous.vRecent.comboRates),
        perfectRates: v.numbers('perfect_rate', previous.vRecent.perfectRates),
      })
    : previous.vRecent;

  return normalizeTechnicalStatus({
    abilityType: emblem.length > 1 ? emblem[1] : previous.abilityType,
    abilityLevel: emblem.length > 2 ? emblem[2] : previous.abilityLevel,
    xgRecent,
    vRecent,
  });
}

function nextGameendSession(current: any): number {
  const value = clampS32(current);
  return value >= 0x7fffffff ? 1 : value + 1;
}

function compactRequestFingerprint(data: any): string {
  const serialized = JSON.stringify(data);
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < serialized.length; index++) {
    const code = serialized.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193);
    second = Math.imul(second ^ code, 0x85ebca6b) + index | 0;
  }
  return `${serialized.length}:${(first >>> 0).toString(16)}:${(second >>> 0).toString(16)}`;
}

function emptySkillTotals(): SkillTotals {
  return { xgSkill: 0, xgAllSkill: 0, vSkill: 0, vAllSkill: 0 };
}

function skillStorageKey(gameCode: string, kind: number): string {
  return `${gameCode.toUpperCase()}:${Math.max(0, Math.floor(kind))}`;
}

function modeSkillTotals(scores: Score[], playMode: Score['playMode']): [number, number] {
  const perMusic: { [musicId: string]: number } = {};
  for (const score of scores) {
    if (score.playMode !== playMode) continue;
    const musicId = Math.floor(Number(score.musicId));
    if (musicId < 0) continue;
    const point = clampS32(score.skillPoint);
    perMusic[String(musicId)] = Math.max(perMusic[String(musicId)] || 0, point);
  }

  const entries = Object.keys(perMusic).map(musicId => ({
    musicId: Number(musicId),
    point: perMusic[musicId],
  }));
  const descending = (left: { point: number }, right: { point: number }) =>
    right.point - left.point;
  // XG2's displayed Skill uses the best 25 XG2 songs plus the best 25 older
  // songs.  MDB first_ver identifies the complete XG2 set as 1800..1873 for
  // both K32 and K33.  all_point is a separate protocol aggregate over every
  // stored song; it is not the animal-shaped Ability emblem.
  const newSkill = entries
    .filter(value => value.musicId >= 1800 && value.musicId <= 1873)
    .sort(descending)
    .slice(0, 25)
    .reduce((sum, value) => sum + value.point, 0);
  const oldSkill = entries
    .filter(value => value.musicId < 1800 || value.musicId > 1873)
    .sort(descending)
    .slice(0, 25)
    .reduce((sum, value) => sum + value.point, 0);
  const allSkill = entries.reduce((sum, value) => sum + value.point, 0);
  return [clampS32(newSkill + oldSkill), clampS32(allSkill)];
}

function calculateSkillTotals(
  scores: Score[],
  gameCode: string,
  kind: number
): SkillTotals {
  const relevant = scores.filter(score =>
    score.schemaVersion === SCORE_SCHEMA_VERSION &&
    score.gameCode === gameCode &&
    score.kind === kind
  );
  const [xgSkill, xgAllSkill] = modeSkillTotals(relevant, 'standard');
  const [vSkill, vAllSkill] = modeSkillTotals(relevant, 'classic');
  return { xgSkill, xgAllSkill, vSkill, vAllSkill };
}

function recoverScoreTrophies(
  trophyList: number[] | undefined,
  scores: Score[],
  gameCode: string,
  kind: number
): number[] {
  const recovered = normalizeTrophyList(trophyList);
  const relevant = scores.filter(score =>
    score.schemaVersion === SCORE_SCHEMA_VERSION &&
    score.gameCode === gameCode &&
    score.kind === kind
  );
  // These three values were captured from the real XG2 client.  They provide
  // a safe lazy migration for profiles whose earlier server response erased
  // the trophy list before this field was persisted.
  if (relevant.some(score => score.fullCombo > 0)) recovered[4] = Math.max(recovered[4], 1);
  if (relevant.some(score => score.excellent > 0)) recovered[5] = Math.max(recovered[5], 2);
  if (relevant.some(score => score.playMode === 'standard' && score.skillPoint > 0)) {
    recovered[18] = Math.max(recovered[18], 17);
  }
  return recovered;
}

function sameNumbers(left: number[] | undefined, right: number[]): boolean {
  const normalized = normalizeTrophyList(left);
  return normalized.every((value, index) => value === right[index]);
}

function sameSkillTotals(left: SkillTotals | undefined, right: SkillTotals): boolean {
  return !!left &&
    left.xgSkill === right.xgSkill &&
    left.xgAllSkill === right.xgAllSkill &&
    left.vSkill === right.vSkill &&
    left.vAllSkill === right.vAllSkill;
}

async function hydrateProfileProgress(
  refid: string,
  profile: Profile,
  gameCode: string,
  kind: number,
  suppliedScores?: Score[]
): Promise<{ skills: SkillTotals; trophyList: number[] }> {
  if (!refid) return { skills: emptySkillTotals(), trophyList: normalizeTrophyList(profile.trophyList) };
  const scores = suppliedScores || await DB.Find<Score>(refid, { collection: 'score' }) as Score[];
  const skills = calculateSkillTotals(scores, gameCode, kind);
  const trophyList = recoverScoreTrophies(profile.trophyList, scores, gameCode, kind);
  const key = skillStorageKey(gameCode, kind);
  const skillData = { ...(profile.skillData || {}), [key]: skills };
  if (!sameSkillTotals(profile.skillData && profile.skillData[key], skills) ||
      !sameNumbers(profile.trophyList, trophyList)) {
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      { $set: { skillData, trophyList } }
    );
  }
  profile.skillData = skillData;
  profile.trophyList = trophyList;
  return { skills, trophyList };
}

function skillResponse(point: number, allPoint: number): any {
  return {
    point: I('s32', point),
    rank: I('u32', 1),
    total_nr: I('u32', 1),
    all_point: I('s32', allPoint),
    all_rank: I('u32', 1),
    all_total_nr: I('u32', 1),
  };
}

function clampU32(value: any): number {
  return Math.max(0, Math.min(0xffffffff, Math.floor(Number(value) || 0)));
}

function normalizeAchievement(value: any): number {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number >= 0
    ? Math.min(10000, number)
    : -1;
}

function normalizeResultRank(value: any): number {
  const number = Math.floor(Number(value));
  // The result screen converts the uploaded raw rank with `7 - rawRank`:
  // 0 is E/FAILED and 6 is SS.  -1 is reserved for an unplayed response slot.
  return Number.isFinite(number) ? Math.max(0, Math.min(6, number)) : 0;
}

function mergeBestScore(previous: Score, incoming: Score): Score {
  // Score-bound metadata follows the best score play.  The fields below are
  // independent records in XG2 and must not regress just because another play
  // happened to have a higher raw score.
  const best = incoming.score >= previous.score
    ? { ...incoming }
    : { ...previous, updatedAt: incoming.updatedAt };
  best.clear = Math.max(previous.clear, incoming.clear);
  best.autoClear = Math.max(previous.autoClear, incoming.autoClear);
  best.fullCombo = Math.max(previous.fullCombo, incoming.fullCombo);
  best.excellent = Math.max(previous.excellent, incoming.excellent);
  best.combo = Math.max(previous.combo, incoming.combo);
  best.skillPoint = Math.max(previous.skillPoint, incoming.skillPoint);
  best.skillPercent = Math.max(
    normalizeAchievement(previous.skillPercent),
    normalizeAchievement(incoming.skillPercent)
  );
  best.resultRank = Math.max(
    normalizeResultRank(previous.resultRank),
    normalizeResultRank(incoming.resultRank)
  );
  best.comboRate = Math.max(previous.comboRate, incoming.comboRate);
  best.perfectRate = Math.max(previous.perfectRate, incoming.perfectRate);
  best.attempts = previous.attempts || 0;
  return best;
}

function strictProtocolTime(value = Date.now()): string {
  return new Date(value).toISOString().slice(0, 19).replace('T', ' ');
}

function normalizeCommunityLogs(
  values: CommunityLog[] | undefined,
  capacity: number
): CommunityLog[] {
  const byIndex: { [index: string]: CommunityLog } = {};
  for (const raw of values || []) {
    const index = Math.floor(Number(raw && raw.index) || 0);
    const logId = Math.floor(Number(raw && raw.logId) || 0);
    if (index <= 0 || logId <= 0) continue;
    byIndex[String(index)] = {
      index,
      logId,
      attrib: Math.floor(Number(raw.attrib) || 0),
      param: String(raw.param || '').slice(0, 128),
      ctime: String(raw.ctime || strictProtocolTime()),
    };
  }
  return Object.keys(byIndex)
    .map(index => byIndex[index])
    .sort((left, right) => left.index - right.index)
    .slice(-capacity);
}

function mergeCommunityLogs(
  existing: CommunityLog[] | undefined,
  incoming: any[],
  capacity: number
): CommunityLog[] {
  const merged = normalizeCommunityLogs(existing, capacity);
  for (const reader of incoming) {
    const index = reader.number('index', 0);
    const logId = reader.number('logid', 0);
    if (index <= 0 || logId <= 0) continue;
    const next: CommunityLog = {
      index,
      logId,
      attrib: reader.number('attrib', 0),
      param: reader.str('param', '').slice(0, 128),
      // Gameend uploads do not contain ctime; the server timestamps receipt.
      ctime: strictProtocolTime(),
    };
    const old = merged.findIndex(value => value.index === index);
    if (old >= 0) merged.splice(old, 1);
    merged.push(next);
  }
  return normalizeCommunityLogs(merged, capacity);
}

function communityMemorialDay(value = Date.now()): number {
  const date = new Date(value);
  return (date.getMonth() + 1) * 100 + date.getDate();
}

function communityMusicParam(musicId: number, value = Date.now()): string {
  return `${communityMemorialDay(value)},${musicId}`;
}

function communityLogMusicId(log: CommunityLog): number {
  const parts = String(log && log.param || '').split(',');
  const musicId = Math.floor(Number(parts[1]));
  return Number.isFinite(musicId) ? musicId : -1;
}

function hasXPlanTutorialLog(logs: CommunityLog[] | undefined): boolean {
  return (logs || []).some(log =>
    log.logId === 1 && communityLogMusicId(log) === X_PLAN_MUSIC_ID
  );
}

function nextCommunityLogIndex(
  highWater: number,
  playLogs: CommunityLog[],
  eventLogs: CommunityLog[]
): number {
  return playLogs.concat(eventLogs).reduce(
    (maximum, log) => Math.max(maximum, log.index),
    Math.max(0, highWater)
  ) + 1;
}

function resultCommunityLogId(result: any): number {
  if (result.number('excellent', 0) > 0) return 7;
  const rank = normalizeResultRank(result.number('result_rank', 0));
  if (rank === 6) return 3;
  if (result.number('fullcombo', 0) > 0) return 5;
  if (rank === 5) return 2;
  return 0;
}

function normalizeCooperationScores(values: CooperationScore[] | undefined): CooperationScore[] {
  const scores: { [key: string]: CooperationScore } = {};
  for (const raw of values || []) {
    const gameCode = String(raw && raw.gameCode || '').toUpperCase();
    const eventId = Math.floor(Number(raw && raw.eventId) || 0);
    if (!COOPERATION_EVENT_IDS[gameCode] || !cooperationEventIds(gameCode).includes(eventId)) {
      continue;
    }
    const key = `${gameCode}:${eventId}`;
    const score = clampU32(raw.score);
    if (!scores[key] || score > scores[key].score) {
      scores[key] = { gameCode, eventId, score };
    }
  }
  return Object.keys(scores).map(key => scores[key]);
}

function defaultInfoState(): PlayerInfoState {
  return {
    mode: 0,
    boss: 0,
    addMusic: 0,
    freeMusic: 0,
    freeSeq: 0,
    indies: 0,
    jukebox: 0,
    trial: 0,
    topRanker: 0,
    log: 0,
    coopeChallenge: 0,
    customChallenge: 0,
    groupCompe: 0,
    groupTrial: 0,
    group: 0,
    shopChamp: 0,
    groupLevel: 0,
    livePoint: 0,
    texture: 0,
    groupmemberRecruitment: 0,
  };
}

function modeNumber(value: string, fallback: number): number {
  switch (value.toLowerCase()) {
    case 'beginner':
      return 0;
    case 'standard':
      return 1;
    case 'classic':
      return 2;
    default:
      return fallback;
  }
}

// Songs marked as XG secret in the recovered 2011-12-28 music database.
// The late XG2 client accepts at most 155 (music id, sequence mask) pairs.
const XG_SECRET_MUSIC: Array<[number, number]> = [
  [5, 73], [12, 73], [129, 11], [208, 9], [308, 11], [318, 11],
  [404, 11], [502, 75], [510, 75], [513, 11], [537, 75], [603, 75],
  [610, 75], [613, 75], [700, 75], [703, 75], [706, 75], [708, 75],
  [738, 75], [802, 75], [805, 75], [810, 75], [811, 75], [836, 75],
  [837, 75], [1003, 75], [1006, 75], [1011, 75], [1104, 75],
  [1109, 75], [1113, 75], [1115, 75], [1122, 75], [1123, 75],
  [1124, 75], [1201, 75], [1206, 75], [1218, 75], [1304, 11],
  [1309, 11], [1400, 11], [1405, 11], [1408, 11], [1409, 11],
  [1460, 11], [1505, 11], [1512, 11], [1521, 11], [1605, 11],
  [1611, 11], [1614, 11], [1626, 11], [1628, 11], [1705, 11],
  [1801, 11], [1802, 11], [1803, 11], [1805, 11], [1806, 11],
  [1807, 11], [1811, 11], [1813, 11], [1814, 11], [1815, 11],
  [1816, 11], [1818, 11], [1820, 11], [1821, 11], [1822, 11],
  [1823, 11], [1824, 11], [1825, 11], [1826, 11], [1827, 11],
  [1828, 11], [1829, 11], [1831, 11], [1833, 11], [1834, 11],
  [1837, 11], [1838, 11], [1839, 11], [1840, 11], [1841, 11],
  [1842, 11], [1843, 11], [1844, 11], [1852, 11], [1865, 11],
  [1866, 11], [1868, 11], [1869, 11], [1871, 11], [1872, 11],
  [1873, 11],
];

// xg_seq_flag is MDB chart metadata, not a complete player-unlock mask.  The
// archived server exposes every listed SECRET MUSIC chart, so explicitly add
// the REGULAR bit that the client tests when it builds the difficulty list.
function archivedXgSecretSequenceMask(mdbSequenceFlag: number): number {
  return mdbSequenceFlag | XG_REGULAR_UNLOCK_MASK;
}

const protocolTime = () =>
  new Date().toISOString().replace('T', ' ').replace('Z', '+00:00');

function inactiveInfo(extra: any = {}): any {
  return {
    division: I('u8', 0),
    state: I('u8', 0),
    ...extra,
  };
}

function crc8(value: string): number {
  let crc = 0;
  for (let index = 0; index < value.length; index++) {
    let c = value.charCodeAt(index) & 0xff;
    for (let bit = 8; bit > 0; bit--) {
      const test = c ^ crc;
      crc >>= 1;
      if (test & 1) crc ^= 0x8c;
      c >>= 1;
    }
  }
  return crc;
}

function refidFrom(data: any, path: string): string {
  const value = $(data).str(path, '');
  return value.includes('|') ? value.split('|')[0] : value;
}

function didFromRefid(refid: string): number {
  let value = 2166136261;
  for (let index = 0; index < refid.length; index++) {
    value ^= refid.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 1) || 1;
}

function requestRefid(data: any): string {
  for (const path of ['refid', 'player.refid', 'group.refid', 'data.refid']) {
    const value = refidFrom(data, path);
    if (value) return value;
  }
  return '';
}

function requestGroupId(data: any): number {
  for (const path of ['groupid', 'group.groupid', 'player.groupid']) {
    const value = $(data).number(path, 0);
    if (value > 0) return value;
  }
  const groupdata = (data as any).groupdata;
  const attributeValue = Number(
    groupdata && groupdata['@attr'] ? groupdata['@attr'].groupid || 0 : 0
  );
  if (attributeValue > 0) return attributeValue;
  return 0;
}

function defaultProfile(name = 'PLAYER', chara = 0): Profile {
  return {
    collection: 'profile',
    did: 0,
    groupId: 0,
    shopLocationId: '',
    shopCabId: 0,
    name,
    chara,
    lastMode: 0,
    modeEncodingVersion: 2,
    style: 2097152,
    style2: 0,
    xgPlaystyle: [2097152, 0].concat(zeros(48)),
    infoState: defaultInfoState(),
    communityIcon: chara,
    communityIconBack: 0,
    communityLogNum: 0,
    communityCoopeEventId: 0,
    communityCoopeEventIds: {},
    communityCoopeScores: [],
    communityPlayLogs: [],
    communityEventLogs: [],
    communitySchemaVersion: COMMUNITY_SCHEMA_VERSION,
    communityTutorialRewardVersion: 0,
    secretMusic: zeros(32),
    secretChara: 0,
    syogo: [0, 0],
    perfect: 0,
    great: 0,
    good: 0,
    poor: 0,
    miss: 0,
    playCount: 0,
    livePoint: 0,
    plusLivePoint: 0,
    trophyList: negatives(TROPHY_COUNT),
    skillData: {},
    technicalStatus: {},
    customItems: zeros(CUSTOM_ITEM_COUNT),
    shutter: 0,
    infoLevel: 0,
    nameDisp: 0,
    auto: 0,
    random: 0,
    judgeLogo: 0,
    skin: 0,
    movie: 0,
    attackEffect: 0,
    layout: 0,
    targetSkill: 0,
    comparison: 0,
    meterCustom: zeros(3),
  };
}

function isSearchableGroupId(groupId: number): boolean {
  return Number.isSafeInteger(groupId) &&
    groupId >= GROUP_ID_MIN &&
    groupId <= GROUP_ID_MAX;
}

function availableGroupId(used: Set<number>, preferred = GROUP_ID_MIN): number {
  let candidate = Math.max(GROUP_ID_MIN, Math.trunc(preferred));
  while (candidate <= GROUP_ID_MAX && used.has(candidate)) candidate++;
  if (candidate <= GROUP_ID_MAX) return candidate;
  candidate = GROUP_ID_MIN;
  while (candidate < preferred && used.has(candidate)) candidate++;
  if (candidate < preferred) return candidate;
  throw new Error('No signed-s32 10-digit GroupID remains available');
}

async function migrateSearchableGroupIds(): Promise<void> {
  const groups = await DB.Find<Group>({ collection: 'group' });
  const used = new Set<number>(
    groups.map(group => group.groupId).filter(isSearchableGroupId)
  );
  const legacyIdMap = new Map<number, number>();
  const ordered = groups.slice().sort(
    (left, right) =>
      (left.groupId || 0) - (right.groupId || 0) ||
      (left._id || '').localeCompare(right._id || '')
  );

  for (const group of ordered) {
    const oldGroupId = Number(group.groupId) || 0;
    if (isSearchableGroupId(oldGroupId)) continue;
    const deterministic = oldGroupId > 0
      ? GROUP_ID_MIN + oldGroupId
      : GROUP_ID_MIN;
    const newGroupId = availableGroupId(
      used,
      deterministic <= GROUP_ID_MAX ? deterministic : GROUP_ID_MIN
    );
    used.add(newGroupId);
    if (!legacyIdMap.has(oldGroupId)) legacyIdMap.set(oldGroupId, newGroupId);
    await DB.Update<Group>(
      group._id
        ? ({ collection: 'group', _id: group._id } as any)
        : {
            collection: 'group',
            groupId: oldGroupId,
            ownerRefid: group.ownerRefid,
          },
      { $set: { groupId: newGroupId } }
    );
    group.groupId = newGroupId;
  }

  // Repair both normal migrations and a previous interrupted migration.  The
  // persisted member list is authoritative when a profile still points at an
  // old short GroupID after the group document itself was already upgraded.
  const memberGroupIds = new Map<string, number>();
  for (const group of ordered) {
    if (!isSearchableGroupId(group.groupId)) continue;
    for (const refid of group.memberRefids || []) {
      if (refid && !memberGroupIds.has(refid)) {
        memberGroupIds.set(refid, group.groupId);
      }
    }
  }
  const profiles = await DB.Find<Profile>(null, { collection: 'profile' });
  for (const profile of profiles) {
    const refid = profile.__refid || '';
    if (!refid) continue;
    const oldGroupId = Number(profile.groupId) || 0;
    let newGroupId = memberGroupIds.get(refid);
    if (newGroupId === undefined && legacyIdMap.has(oldGroupId)) {
      newGroupId = legacyIdMap.get(oldGroupId);
    }
    if (newGroupId === undefined && oldGroupId > 0 && !isSearchableGroupId(oldGroupId)) {
      newGroupId = 0;
    }
    if (newGroupId !== undefined && newGroupId !== oldGroupId) {
      await DB.Update<Profile>(
        refid,
        { collection: 'profile' },
        { $set: { groupId: newGroupId } }
      );
    }
  }
}

async function ensureSearchableGroupIds(): Promise<void> {
  if (!groupIdMigrationPromise) {
    groupIdMigrationPromise = migrateSearchableGroupIds();
  }
  try {
    await groupIdMigrationPromise;
  } catch (error) {
    groupIdMigrationPromise = null;
    throw error;
  }
}

async function findProfile(refid: string): Promise<Profile | null> {
  await ensureSearchableGroupIds();
  const stored = await DB.FindOne<Profile>(refid, { collection: 'profile' });
  if (!stored) return null;
  const legacyInfo = defaultInfoState();
  const legacyPlaystyle = normalizeNumbers(
    stored.xgPlaystyle || [stored.style || 0, stored.style2 || 0],
    XG_PLAYSTYLE_COUNT
  );
  // Profiles created before info-state persistence already completed at
  // least one game.  Avoid replaying the Community Log introduction once
  // more during the schema migration; subsequent gameends save exact values.
  if ((stored.playCount || 0) > 0) {
    if (!stored.infoState) legacyInfo.log = 1;
    if (!stored.xgPlaystyle) legacyPlaystyle[16] = 2;
  }
  const legacyMode = stored.modeEncodingVersion === 2
    ? (stored.lastMode === undefined ? 0 : stored.lastMode)
    : stored.lastMode === 4
      ? 2
      : stored.lastMode === 2
        ? 1
        : stored.lastMode === 1
          ? 0
           : 0;
  const legacyEventLogs = normalizeCommunityLogs(
    stored.communityEventLogs || (stored.communityEventLog ? [stored.communityEventLog] : []),
    MEMBER_EVENT_LOG_COUNT
  );
  const legacySelectedEvent = stored.communityCoopeEventId || (
    stored.communitySchemaVersion !== COMMUNITY_SCHEMA_VERSION &&
    cooperationChallengeEnabled() &&
    (stored.groupId || 0) > 0 &&
    (stored.playCount || 0) > 0
      ? 1
      : 0
  );
  const selectedEvents = {
    ...(stored.communityCoopeEventIds || {}),
  };
  if (legacySelectedEvent > 0 && selectedEvents.K33 === undefined) {
    selectedEvents.K33 = legacySelectedEvent;
  }
  const normalizedInfoState: PlayerInfoState = {
    ...legacyInfo,
    ...(stored.infoState || {}),
    // Cooperation Challenge is a group feature.  While it is enabled, every
    // group member must keep the feature bit set; treating this as a normal
    // one-shot information flag made the menu disappear after gameend.
    coopeChallenge:
      cooperationChallengeEnabled() && (stored.groupId || 0) > 0
        ? Math.max(1, (stored.infoState && stored.infoState.coopeChallenge) || 0)
        : (stored.infoState && stored.infoState.coopeChallenge) || legacyInfo.coopeChallenge,
  };
  let communityLogNum =
    stored.communityLogNum === undefined && (stored.playCount || 0) > 0
      ? 1
      : stored.communityLogNum || 0;
  let communityEventLogs = legacyEventLogs;
  let tutorialRewardVersion = Math.max(0, stored.communityTutorialRewardVersion || 0);
  const tutorialLogAlreadyStored = hasXPlanTutorialLog(communityEventLogs);
  const tutorialComplete =
    normalizedInfoState.log > 0 || legacyPlaystyle[16] >= 2 || tutorialLogAlreadyStored;
  let tutorialMigrationChanged = false;

  // Older server revisions preserved the tutorial flag but dropped the event
  // log created by the client.  Restore the one-time X-Plan reward lazily so a
  // returning profile receives it before the next Community Log screen.
  if (tutorialRewardVersion < COMMUNITY_TUTORIAL_REWARD_VERSION) {
    if (tutorialLogAlreadyStored) {
      tutorialRewardVersion = COMMUNITY_TUTORIAL_REWARD_VERSION;
      tutorialMigrationChanged = true;
    } else if (tutorialComplete) {
      const index = nextCommunityLogIndex(
        communityLogNum,
        normalizeCommunityLogs(stored.communityPlayLogs, MEMBER_PLAY_LOG_COUNT),
        communityEventLogs
      );
      communityEventLogs = normalizeCommunityLogs(
        communityEventLogs.concat({
          index,
          logId: 1,
          attrib: 2,
          param: communityMusicParam(X_PLAN_MUSIC_ID),
          ctime: strictProtocolTime(),
        }),
        MEMBER_EVENT_LOG_COUNT
      );
      communityLogNum = Math.max(communityLogNum, index);
      tutorialRewardVersion = COMMUNITY_TUTORIAL_REWARD_VERSION;
      tutorialMigrationChanged = true;
    }
  }
  if (tutorialRewardVersion >= COMMUNITY_TUTORIAL_REWARD_VERSION && legacyPlaystyle[16] < 2) {
    legacyPlaystyle[16] = 2;
    tutorialMigrationChanged = true;
  }

  const customItems = normalizeCustomItems(stored.customItems);
  const customItemMigrationChanged = !stored.customItems;
  if (!stored.customItems) {
    // The old split customize schema never covered the complete 48-slot
    // client state.  Preserve only the three mappings proven by the menu
    // dispatcher instead of guessing the Combo/Notes slots.
    customItems[31] = clampInteger(stored.shutter, 0, 98);
    customItems[39] = clampInteger(stored.attackEffect, 0, 11);
    customItems[41] = clampInteger(stored.judgeLogo, 0, 11);
  }

  const profile: Profile = {
    ...defaultProfile(),
    ...stored,
    secretMusic: stored.secretMusic || zeros(32),
    syogo: stored.syogo || [0, 0],
    meterCustom: stored.meterCustom || zeros(3),
    lastMode: legacyMode,
    modeEncodingVersion: 2,
    xgPlaystyle: legacyPlaystyle,
    infoState: normalizedInfoState,
    communityIcon:
      stored.communityIcon === undefined ? stored.chara || 0 : stored.communityIcon,
    communityIconBack: stored.communityIconBack || 0,
    communityLogNum,
    communityCoopeEventId: legacySelectedEvent,
    communityCoopeEventIds: selectedEvents,
    communityCoopeScores: normalizeCooperationScores(stored.communityCoopeScores),
    communityPlayLogs: normalizeCommunityLogs(
      stored.communityPlayLogs,
      MEMBER_PLAY_LOG_COUNT
    ),
    communityEventLogs,
    communitySchemaVersion: COMMUNITY_SCHEMA_VERSION,
    communityTutorialRewardVersion: tutorialRewardVersion,
    livePoint: Math.max(0, stored.livePoint || 0),
    plusLivePoint: Math.max(0, stored.plusLivePoint || 0),
    trophyList: normalizeTrophyList(stored.trophyList),
    skillData: stored.skillData || {},
    technicalStatus: stored.technicalStatus || {},
    customItems,
  };
  if (tutorialMigrationChanged || customItemMigrationChanged) {
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      {
        $set: {
          xgPlaystyle: profile.xgPlaystyle,
          infoState: profile.infoState,
          communityLogNum: profile.communityLogNum,
          communityEventLogs: profile.communityEventLogs,
          communitySchemaVersion: COMMUNITY_SCHEMA_VERSION,
          communityTutorialRewardVersion: profile.communityTutorialRewardVersion,
          customItems: profile.customItems,
        },
      }
    );
  }
  return profile;
}

async function findShop(locationId = '', cabid = 0): Promise<Shop | null> {
  if (locationId) {
    const byLocation = await DB.FindOne<Shop>({
      collection: 'shop',
      locationId,
    });
    if (byLocation) return byLocation;
  }
  if (cabid > 0) {
    const byCabinet = await DB.FindOne<Shop>({ collection: 'shop', cabid });
    if (byCabinet) return byCabinet;
  }
  const shops = await DB.Find<Shop>({ collection: 'shop' });
  shops.sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0));
  return shops[0] || null;
}

export const shopRegist: EPR = async (_info, data, send) => {
  const shop = (data as any).shop ? $(data).element('shop') : $(data);
  const locationId = shop.str('locationid', 'LOCAL');
  const previous = await findShop(locationId);
  const stored: Shop = {
    collection: 'shop',
    locationId,
    cabid: previous ? previous.cabid : 1,
    name: shop.str('name', previous ? previous.name : 'LOCAL SHOP').slice(0, 25),
    pref: shop.number('pref', previous ? previous.pref : 0),
    systemId: shop.str('systemid', previous ? previous.systemId : ''),
    softwareId: shop.str('softwareid', previous ? previous.softwareId : ''),
    hardwareId: shop.str('hardwareid', previous ? previous.hardwareId : ''),
    updatedAt: Date.now(),
  };
  await DB.Upsert<Shop>(
    { collection: 'shop', locationId },
    { $set: stored }
  );
  await send.object({
    data: {
      cabid: I('u32', stored.cabid),
      locationid: I('str', locationId),
      is_send: I('u8', 1),
    },
    temperature: {
      is_send: I('bool', false),
    },
  });
};

export const gameinfoGet: EPR = async (_info, _data, send) => {
  const vFreeMusic = 262143;
  const originalPlusProgression =
    xg2PlusTerm() > 0 && xg2PlusUnlockPolicy() === 'original_progression';
  const festivalMode = appendFestivalMode();
  const freeSongs = (originalPlusProgression
    ? XG_SECRET_MUSIC.filter(value => !XG2_PLUS_MUSIC.includes(value[0]))
    : XG_SECRET_MUSIC).filter(
      value => festivalMode !== 'off' || value[0] !== 1843
    );
  const ids = freeSongs.map(value => value[0]);
  const sequences = freeSongs.map(value => archivedXgSecretSequenceMask(value[1]));
  const xgFreeMusic = ids.concat(negatives(155 - ids.length));
  const xgFreeSequence = sequences.concat(zeros(155 - sequences.length));
  const tag = crc8(String(vFreeMusic + ids.reduce((sum, value) => sum + value, 0)));
  const now = protocolTime();
  const emptyPeriod = {
    state: I('u8', 0),
    start: I('str', now),
    end: I('str', now),
  };
  await send.object({
    xg_free_music: {
      free_music: A('s32', xgFreeMusic),
      free_seq: A('u16', xgFreeSequence),
    },
    v_free_music: {
      free_music: I('u32', vFreeMusic),
      free_seq: I('u32', vFreeMusic),
    },
    tag: I('u8', tag),
    xg_bossdata: xgBossPayload(),
    v_bossdata: vBossPayload(),
    plus: xg2PlusPayload(),
    trialdata: {
      trialid: I('s8', -1),
      state: I('u8', 0),
      musicid: A('s32', negatives(5)),
      start: I('str', now),
      end: I('str', now),
      grade_border: A('s32', zeros(15)),
    },
    jukebox: {
      division: I('s8', 0),
      state: I('u8', 0),
      musicid: A('s32', negatives(35)),
      start: I('str', now),
      end: I('str', now),
    },
    jukebox_plus: {
      division: I('s8', 0),
      state: I('u8', 0),
      musicid: A('s32', negatives(35)),
      start: I('str', now),
      end: I('str', now),
    },
    shopchamp: shopChampionshipPayload(),
    groupcompetition: groupCompetitionPayload(),
    battle: { battle_play: I('u8', 0) },
    is_collabo: I('u8', festivalMode === 'active' ? 1 : 0),
    is_stage_bonus: I('u8', 0),
    is_groupmember_recruitment: I('u8', 0),
    groupmember_recruitment: {
      start: I('str', now),
      end: I('str', now),
    },
    is_powerful_drug: I('u8', 0),
    live_point: { division: I('u8', livePointTerm()) },
    group_level: { division: I('u8', livePointTerm()) },
    effect: I('u32', 0),
    comment_kind: I('s32', 0),
    infodata: {
      no: I('s32', -1),
      size: I('u32', 0),
      name: I('str', ''),
      sumtype: I('str', ''),
      sum: I('str', ''),
    },
    info: {
      info_trial: inactiveInfo({
        kind: I('u8', 0),
        trialid: I('s8', -1),
        musicid: I('s32', -1),
        start: I('str', now),
        end: I('str', now),
        message_1: I('str', ''),
        message_2: I('str', ''),
      }),
      info_ranker: inactiveInfo({
        trialid: I('s8', -1),
        ranking: {
          rank: I('u32', 0),
          name: I('str', ''),
          point: I('u32', 0),
          is_another_ranker: I('u8', 0),
        },
      }),
      info_ranker2: inactiveInfo({
        trialid: I('s8', -1),
        ranking: {
          rank: I('u32', 0),
          name: I('str', ''),
          point: I('u32', 0),
          is_another_ranker: I('u8', 0),
        },
      }),
      info_mode: inactiveInfo({ mode: I('u8', 0) }),
      info_boss: inactiveInfo(),
      info_add_music: inactiveInfo({
        musicid: A('s32', negatives(8)),
        message: I('str', ''),
      }),
      info_indies_music: inactiveInfo({ musicid: A('s32', negatives(9)) }),
      info_free_music: inactiveInfo({ musicid: A('s32', negatives(2)) }),
      info_free_music_2: inactiveInfo({
        musicid: A('s32', negatives(4)),
        message: I('str', ''),
      }),
      info_free_seq: inactiveInfo({
        musicid: A('s32', negatives(35)),
        message: I('str', ''),
      }),
      info_free_seq_2: inactiveInfo({
        musicid: A('s32', negatives(4)),
        message: I('str', ''),
      }),
      info_topranker: inactiveInfo({
        start: I('str', now),
        end: I('str', now),
      }),
      info_sound_track: inactiveInfo({ start: I('str', now) }),
      info_jukebox: inactiveInfo(),
      info_message: inactiveInfo({ message: I('str', '') }),
      info_collabo: inactiveInfo(),
      info_group_lv: inactiveInfo(),
      info_live_point: inactiveInfo(),
      info_texture: inactiveInfo(),
      info_groupmember_recruitment: inactiveInfo({
        start: I('str', now),
        end: I('str', now),
      }),
      info_shopchamp: {
        shopchamp: shopChampionshipPayload(),
      },
      info_groupcompe: {
        groupcompetition: groupCompetitionPayload(),
      },
      info_plus: inactiveInfo(),
    },
    assert_report_state: I('u8', 0),
    reboot_state: I('u8', 0),
  });
};

export const demodataGet: EPR = async (_info, _data, send) => {
  // K32/K33 reject a completely empty module before the title/demo state
  // manager is created.  Keep only the containers that the receiver parses
  // unconditionally and disable every advertised online/event feature.
  const demo = demoConfiguration();
  await send.object({
    hitchart: K.ATTR({ nr: '0' }),
    bossdata: xgBossPayload(),
    v_bossdata: vBossPayload(),
    battle: { battle_play: I('u8', 0) },
    groupcompetition: groupCompetitionPayload(),
    is_valid_shopchamp_data: I('bool', shopChampionshipTerm() > 0),
    shopchamp: shopChampionshipPayload(),
    myshop_rank: {
      shopchamp: {
        locationid: I('str', ''),
        shopname: I('str', ''),
        live_point: I('s32', 0),
        rank: I('u32', 0),
        nr: I('u32', 0),
      },
    },
    shopchamp_ranking: {},
    is_stage_bonus: I('u8', 0),
    is_groupmember_recruitment: I('u8', 0),
    groupmember_recruitment: {
      start: I('str', ''),
      end: I('str', ''),
    },
    is_powerful_drug: I('u8', 0),
    live_point: { division: I('u8', livePointTerm()) },
    group_level: { division: I('u8', livePointTerm()) },
    trialdata: {
      trialid: I('s8', -1),
      state: I('u8', 0),
      // The disabled Trial container provides six parser-safe transport
      // slots for the optional client Demo patch.  The original receiver
      // always stores these values even when trialid is -1, while the event
      // state remains disabled.
      musicid: A('s32', [
        demo.musicId,
        demo.startMs,
        demo.durationMs,
        demo.startMs,
        demo.durationMs,
      ]),
      grade_border: A(
        's32',
        [demo.sequenceMode].concat(zeros(14))
      ),
    },
    plus: xg2PlusPayload(),
    infodata: {
      no: I('s32', -1),
      size: I('u32', 0),
      name: I('str', ''),
      sumtype: I('str', ''),
      sum: I('str', ''),
    },
    assert_report_state: I('u8', 0),
    temperature: { is_send: I('bool', false) },
  });
};

export const facilityGet: EPR = async (_info, _data, send) => {
  await send.object({
    location: {
      id: I('str', 'ea'),
      country: I('str', 'JP'),
      region: I('str', 'JP-13'),
      name: I('str', 'CORE'),
      type: I('u8', 0),
      countryname: I('str', 'UNKNOWN'),
      countryjname: I('str', '不明'),
      regionname: I('str', 'CORE'),
      regionjname: I('str', 'CORE'),
      customercode: I('str', 'AXUSR'),
      companycode: I('str', 'AXCPY'),
      latitude: I('s32', 6666),
      longitude: I('s32', 6666),
      accuracy: I('u8', 0),
    },
    line: {
      id: I('str', '.'),
      class: I('u8', 0),
    },
    portfw: {
      globalip: I('ip4', '127.0.0.1'),
      globalport: I('u16', 5700),
      privateport: I('u16', 5700),
    },
    public: {
      flag: I('u8', 1),
      name: I('str', 'UNKNOWN'),
      latitude: I('str', '0'),
      longitude: I('str', '0'),
    },
    share: {
      eapass: {
        valid: I(
          'u16',
          configInteger('eapass_valid_days', 365, 1, 999)
        ),
      },
      eacoin: {
        notchamount: I('s32', 0),
        notchcount: I('s32', 0),
        supplylimit: I('s32', 100000),
      },
      url: {
        eapass: I('str', 'CORE v1.60b'),
        arcadefan: I('str', 'CORE v1.60b'),
        konaminetdx: I('str', 'CORE v1.60b'),
        konamiid: I('str', 'CORE v1.60b'),
        eagate: I('str', 'CORE v1.60b'),
      },
    },
  });
};

export const cardutilCheck: EPR = async (info, data, send) => {
  const card = $(data).element('card');
  const refid = refidFrom(card.obj, 'refid');
  const profile = await findProfile(refid);
  const body: any = {};
  if (profile) {
    const gameCode = requestGameCode(info);
    const progress = await hydrateProfileProgress(refid, profile, gameCode, 0);
    const technical = profileTechnicalStatus(profile, gameCode);
    // A successful card check begins a new play session.  K33 does not send a
    // transaction id with gameend.  Persist the generation so a Core restart
    // between the first response and a network retry cannot apply Live Point,
    // play count, trophies, or scores twice.  The next card check advances the
    // generation, so a later legitimate credit may still produce an identical
    // gameend payload.
    const session = nextGameendSession(profile.gameendSession);
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      { $set: { gameendSession: session } }
    );
    profile.gameendSession = session;
    playSessions[refid] = session;
    delete gameendReceipts[refid];
    Object.assign(body, {
      name: I('str', profile.name),
      emblem: A('u8', [profile.chara, technical.abilityType, technical.abilityLevel]),
      did: I('s32', profile.did || didFromRefid(refid)),
      groupid: I('s32', profile.groupId || 0),
      xg_skill: I('s32', progress.skills.xgSkill),
      xg_all_skill: I('s32', progress.skills.xgAllSkill),
      v_skill: I('s32', progress.skills.vSkill),
      v_all_skill: I('s32', progress.skills.vAllSkill),
      penalty: I('u8', 0),
    });
  }
  await send.object({
    card: K.ATTR(
      { no: '1', state: profile ? '2' : '0' },
      body
    ),
  });
};

export const cardutilRegist: EPR = async (_info, data, send) => {
  const registration = $(data).element('data');
  const refid = refidFrom(registration.obj, 'refid');
  const profile = defaultProfile(
    registration.str('name', 'PLAYER'),
    registration.number('chara', 0)
  );
  profile.did = didFromRefid(refid);
  await DB.Upsert<Profile>(
    refid,
    { collection: 'profile' },
    { $set: profile }
  );
  await send.object({
    card: K.ATTR(
      { regist: '0' },
      {
        is_succession: I('s8', 0),
        did: I('s32', profile.did),
        groupid: I('s32', profile.groupId || 0),
      }
    ),
  });
};

function blankBattleRound(): any {
  return K.ATTR(
    { before: '0' },
    {
      battle_class: I('u8', 0),
      defeat_class: I('s8', 0),
      rival_type: I('s8', 0),
      name: I('str', '0'),
      shopname: I('str', '0'),
      emblem: A('u8', [0, 0, 0]),
      chara_icon: I('u8', 0),
      pref: I('u8', 0),
      skill: I('s32', 0),
      battle_rate: I('s32', 0),
      syogo: A('s16', [0, 0]),
      result: I('s8', 0),
      seqmode: A('s8', [0, 0]),
      score_type: A('s8', [0, 0]),
      musicid: A('s32', [0, 0]),
      score: A('s32', [0, 0]),
      rival_score: A('s32', [0, 0]),
      flags: A('u32', [0, 0]),
      score_diff: A('s32', [0, 0]),
      item: A('s16', [0, 0]),
      select_type: A('s8', [0, 0]),
      round_result: A('s8', [0, 0]),
      gold_star_hist: I('u8', 0),
    }
  );
}

function blankMusicRound(): any {
  return K.ATTR(
    { before: '0' },
    {
      point: I('s16', 0),
      my_select_musicid: I('s32', 0),
      my_select_result: I('s8', 0),
      rival_select_musicid: I('s32', 0),
      rival_select_result: I('s8', 0),
    }
  );
}

function battleData(profile: Profile): any {
  return {
    tag: I('u8', 0),
    bp: I('u32', 0),
    battle_rate: I('s32', 0),
    battle_class: I('u8', 0),
    class_point: I('s32', 0),
    class_sub_point: I('s32', 0),
    point: I('s16', 0),
    rensyo: I('u16', 0),
    win: I('u32', 0),
    lose: I('u32', 0),
    score_type: I('u8', 0),
    strategy_item: I('s16', 0),
    production_item: I('s16', 0),
    draw: I('u32', 0),
    max_class: I('u8', 0),
    max_rensyo: I('u16', 0),
    vip_rensyo: I('u16', 0),
    max_defeat_skill: I('s32', 0),
    max_defeat_battle_rate: I('s32', 0),
    gold_star: I('u32', 0),
    random_select: I('u32', 0),
    enable_bonus_bp: I('u8', 0),
    type_normal: I('u32', 0),
    type_perfect: I('u32', 0),
    type_combo: I('u32', 0),
    area_id_list: A('u8', zeros(60)),
    area_win_list: A('u32', zeros(60)),
    area_lose_list: A('u32', zeros(60)),
    area_draw_list: A('u32', zeros(60)),
    perfect: I('u32', profile.perfect),
    great: I('u32', profile.great),
    good: I('u32', profile.good),
    poor: I('u32', profile.poor),
    miss: I('u32', profile.miss),
    history: { round: Array(10).fill(0).map(blankBattleRound) },
    music_hist: { round: Array(20).fill(0).map(blankMusicRound) },
  };
}

function recentData(value?: XgRecentData): any {
  const recent = normalizeXgRecentData(value);
  return {
    clear_num: I('u32', recent.clearNum),
    full_clear_num: I('u32', recent.fullClearNum),
    exc_clear_num: I('u32', recent.excellentClearNum),
    max_clear_difficulty: I('s32', recent.maxClearDifficulty),
    max_fullcombo_clear_difficulty: I('s32', recent.maxFullComboDifficulty),
    max_excellent_clear_difficulty: I('s32', recent.maxExcellentDifficulty),
    max_s_clear_difficulty: I('s32', recent.maxSClearDifficulty),
    max_ss_clear_difficulty: I('s32', recent.maxSsClearDifficulty),
    musicid: A('s32', recent.musicIds),
    maxcombo_rate: A('s8', recent.maxComboRates),
    perfect_rate: A('s8', recent.perfectRates),
    miss_rate: A('s8', recent.missRates),
  };
}

function vRecentData(value?: VRecentData): any {
  const recent = normalizeVRecentData(value);
  return {
    clear_num: I('u32', recent.clearNum),
    full_clear_num: I('u32', recent.fullClearNum),
    exc_clear_num: I('u32', recent.excellentClearNum),
    max_clear_difficulty: I('s8', recent.maxClearDifficulty),
    max_fullcombo_difficulty: I('s8', recent.maxFullComboDifficulty),
    max_excellent_difficulty: I('s8', recent.maxExcellentDifficulty),
    recent: recent.musicIds.map((musicId, index) =>
      K.ATTR(
        { musicid: String(musicId) },
        {
          difficulty: I('s8', recent.difficulty[index]),
          combo_rate: I('s8', recent.comboRates[index]),
          flags: I('u32', recent.flags[index]),
          clear: I('s8', recent.clear[index]),
          perfect_rate: I('s8', recent.perfectRates[index]),
        }
      )
    ),
  };
}

function scoreMusicData(scores: Score[], classic = false): any[] {
  const byMusic: { [key: string]: Score[] } = {};
  for (const score of scores) {
    const key = String(score.musicId);
    (byMusic[key] || (byMusic[key] = [])).push(score);
  }
  return Object.keys(byMusic).map(key => {
    // XG2 does not use zero as the generic "not played" value.  Its native
    // initializer uses -1/-2 for the first nine sequence slots; returning
    // zero for all 20 makes every available Guitar/Bass chart look FAILED.
    const mdata = (classic ? CLASSIC_MDATA_DEFAULT : XG_MDATA_DEFAULT).slice();
    const flag = zeros(4);
    const sdata = [-1, 0];
    // mdata contains two parallel blocks: achievement first, rank second.
    // Zero is rank E, so every unplayed rank slot must explicitly be -1.
    const firstRankSlot = classic ? 11 : 9;
    const lastRankSlot = classic ? 19 : 16;
    for (let slot = firstRankSlot; slot <= lastRankSlot; slot++) {
      mdata[slot] = -1;
    }
    for (const score of byMusic[key]) {
      // XG uses its canonical slot directly (1..8).  The legacy/Classic
      // receiver deliberately stores the same canonical slot at +1 (2..10).
      const slot = classic ? score.seqMode + 1 : score.seqMode;
      const validCanonicalSlot = classic
        ? score.seqMode >= 1 && score.seqMode <= 9
        : score.seqMode >= 1 && score.seqMode <= 8;
      if (validCanonicalSlot && slot < mdata.length) {
        // skill_perc is already the 0.01% achievement value.  A failed chart
        // uploads -1 and must remain -1; converting it to zero makes unrelated
        // charts appear to have a fabricated 0% result.
        // Merge again while serializing.  The schema key is unique in normal
        // operation, but an interrupted/racing historical write can leave two
        // documents for the same chart; response order must never decide which
        // achievement or rank the cabinet sees.
        mdata[slot] = Math.max(
          mdata[slot],
          normalizeAchievement(score.skillPercent)
        );
        const rankSlot = classic
          ? 10 + score.seqMode
          : 8 + score.seqMode;
        mdata[rankSlot] = Math.max(
          mdata[rankSlot],
          normalizeResultRank(score.resultRank)
        );

        // These are four independent chart-state bitmaps, not one 64-bit
        // bitmap: full combo, excellent, clear, and attempted/played.
        // Protocol bit zero is reserved; canonical sequence slot 1 begins at
        // bit one.  The client later remaps these network bits into its
        // part-specific internal Guitar/Bass/Open layouts.
        const bit = 1 << score.seqMode;
        flag[3] |= bit;
        if (score.clear > 0) flag[2] |= bit;
        if (score.fullCombo > 0) flag[0] |= bit;
        if (score.excellent > 0) flag[1] |= bit;
      }
    }
    return K.ATTR(
      { musicid: key },
      {
        mdata: A('s16', mdata),
        flag: A('u16', flag),
        sdata: A('s16', sdata),
      }
    );
  });
}

export const gametopGet: EPR = async (info, data, send) => {
  const playerRequest = $(data).element('player');
  const refid = refidFrom(playerRequest.obj, 'refid');
  const profile = (await findProfile(refid)) || defaultProfile();
  const requestElement = playerRequest.element('request');
  const requestedKind = requestElement
    ? requestElement.number('kind', 0)
    : 0;
  const gameCode = requestGameCode(info);
  const technical = profileTechnicalStatus(profile, gameCode);
  const scores = refid
    ? ((await DB.Find<Score>(refid, { collection: 'score' })) as Score[])
    : [];
  const progress = await hydrateProfileProgress(
    refid,
    profile,
    gameCode,
    requestedKind,
    scores
  );
  const currentScores = scores.filter(score =>
    score.schemaVersion === SCORE_SCHEMA_VERSION &&
    score.gameCode === gameCode &&
    score.kind === requestedKind
  );
  const xgMusicdata = scoreMusicData(
    currentScores.filter(score => score.playMode === 'standard')
  );
  const classicMusicdata = scoreMusicData(
    currentScores.filter(score => score.playMode === 'classic'),
    true
  );
  const shop = await findShop(
    profile.shopLocationId || '',
    profile.shopCabId || 0
  );
  const originalPlusProgression =
    xg2PlusTerm() > 0 && xg2PlusUnlockPolicy() === 'original_progression';
  const unlockedPlusIds = originalPlusProgression
    ? XG2_PLUS_MUSIC.filter(
        (_musicId, index) => profilePlusLivePoint(profile) >= XG2_PLUS_BORDERS[index]
      )
    : XG2_PLUS_MUSIC;
  const secretMusic: Array<[number, number]> = (originalPlusProgression
    ? XG_SECRET_MUSIC.filter(
        value => !XG2_PLUS_MUSIC.includes(value[0]) || unlockedPlusIds.includes(value[0])
      )
    : XG_SECRET_MUSIC).filter(
      value => appendFestivalMode() !== 'off' || value[0] !== 1843
    ).map(value => {
      let sequenceMask = archivedXgSecretSequenceMask(value[1]);
      if (
        value[0] === X_PLAN_MUSIC_ID &&
        profile.communityTutorialRewardVersion >= COMMUNITY_TUTORIAL_REWARD_VERSION
      ) {
        sequenceMask |= X_PLAN_TUTORIAL_UNLOCK_MASK;
      }
      return [value[0], sequenceMask] as [number, number];
    });
  const secretIds = secretMusic.map(value => value[0]).concat(
    negatives(155 - secretMusic.length)
  );
  const secretSequences = secretMusic.map(value => value[1]).concat(
    zeros(155 - secretMusic.length)
  );
  const xgPlaystyle = normalizeNumbers(
    profile.xgPlaystyle,
    XG_PLAYSTYLE_COUNT
  );
  const vSecretSum = profile.secretMusic.reduce(
    (sum, value) => sum + Math.max(0, value || 0),
    0
  );
  const tag = crc8(
    String(
      vSecretSum +
        secretIds.filter(value => value >= 0).reduce((a, b) => a + b, 0)
    )
  );
  const player = {
    player_type: I('u8', 0),
    name: I('str', profile.name),
    emblem: A('u8', [profile.chara, technical.abilityType, technical.abilityLevel]),
    xg_skill: I('s32', progress.skills.xgSkill),
    xg_all_skill: I('s32', progress.skills.xgAllSkill),
    v_skill: I('s32', progress.skills.vSkill),
    v_all_skill: I('s32', progress.skills.vAllSkill),
    live_point: I('s32', profile.livePoint),
    plus_live_point: I('s32', profilePlusLivePoint(profile)),
    my_rival_id: I('str', '0'),
    play_cnt: I('u32', profile.playCount),
    mode: I('u8', profile.lastMode),
    xg_favorite_music: A('s32', negatives(20)),
    xg_favorite_music_2: A('s32', negatives(20)),
    xg_favorite_music_3: A('s32', negatives(20)),
    xg_secret_music_id: A('s32', secretIds),
    xg_secret_music_seq: A('u16', secretSequences),
    v_favorite_music: A('s32', negatives(20)),
    v_favorite_music_2: A('s32', negatives(20)),
    v_favorite_music_3: A('s32', negatives(20)),
    v_secret_music: A('u16', profile.secretMusic),
    xg_playstyle: A('s32', xgPlaystyle),
    info_level: I('u8', profile.infoLevel),
    trophy_list: A('s32', progress.trophyList),
    rival_id_1: I('str', ''),
    rival_id_2: I('str', ''),
    rival_id_3: I('str', ''),
    mtime: I('str', protocolTime()),
    group_withdrawal_state: I('s32', 0),
    item: A('s32', normalizeCustomItems(profile.customItems)),
    myshop: {
      locationid: I('str', shop ? shop.locationId : ''),
      shopname: I('str', shop ? shop.name : ''),
    },
    jubeat_collabo: {
      gfdm_j: I('bool', false),
      j_gfdm: I('bool', false),
      save_state: I('s32', 0),
    },
    syogo_list: A('s16', negatives(200)),
    badge_list: A('s16', negatives(200)),
    favorite_music: A('s16', negatives(20)),
    favorite_music_2: A('s16', negatives(20)),
    favorite_music_3: A('s16', negatives(20)),
    secret_music: A('u16', profile.secretMusic),
    style: I('u32', profile.style),
    style_2: I('u32', profile.style2),
    shutter_list: I('u32', 0),
    judge_logo_list: I('u32', 0),
    skin_list: I('u32', 0),
    movie_list: I('u32', 0),
    attack_effect_list: I('u32', 0),
    idle_screen: I('u32', 0),
    chance_point: I('s32', 0),
    failed_cnt: I('s32', 0),
    secret_chara: I('u32', profile.secretChara),
    mode_beginner: I('u16', 0),
    mode_standard: I('u16', 0),
    mode_battle_global: I('u16', 0),
    mode_battle_local: I('u16', 0),
    mode_quest: I('u16', 0),
    v3_skill: I('s32', -1),
    v4_skill: I('s32', -1),
    old_ver_skill: I('s32', -1),
    customize: {
      shutter: I('u8', profile.shutter),
      info_level: I('u8', profile.infoLevel),
      name_disp: I('u8', profile.nameDisp),
      auto: I('u8', profile.auto),
      random: I('u8', profile.random),
      judge_logo: I('u32', profile.judgeLogo),
      skin: I('u32', profile.skin),
      movie: I('u32', profile.movie),
      attack_effect: I('u32', profile.attackEffect),
      layout: I('u8', profile.layout),
      target_skill: I('u8', profile.targetSkill),
      comparison: I('u8', profile.comparison),
      meter_custom: A('u8', profile.meterCustom),
    },
    tag: I('u8', tag),
    battledata: battleData(profile),
    battle_aniv: {
      get: {
        category_ver: A('u16', zeros(11)),
        category_genre: A('u16', zeros(11)),
      },
    },
    info: {
      mode: I('u32', profile.infoState.mode),
      boss: I('u32', profile.infoState.boss),
      add_music: I('u32', profile.infoState.addMusic),
      free_music: I('u32', profile.infoState.freeMusic),
      free_seq: I('u32', profile.infoState.freeSeq),
      indies: I('u32', profile.infoState.indies),
      jukebox: I('u32', profile.infoState.jukebox),
      trial: I('u32', profile.infoState.trial),
      topranker: I('u32', profile.infoState.topRanker),
      log: I('u32', profile.infoState.log),
      coope_challenge: I(
        'u32',
        cooperationChallengeEnabled()
          ? profile.groupId
            ? Math.max(1, profile.infoState.coopeChallenge)
            : profile.infoState.coopeChallenge
          : 0
      ),
      custom_challenge: I('u32', profile.infoState.customChallenge),
      group_compe: I('u32', profile.infoState.groupCompe),
      group_trial: I('u32', profile.infoState.groupTrial),
      group: I('u32', profile.infoState.group),
      shopchamp: I('u32', profile.infoState.shopChamp),
      group_lv: I('u32', profile.infoState.groupLevel),
      live_point: I('u32', profile.infoState.livePoint),
      texture: I('u32', profile.infoState.texture),
      groupmember_recruitment: I(
        'u32',
        profile.infoState.groupmemberRecruitment
      ),
    },
    xg_recentdata: recentData(technical.xgRecent),
    v_recentdata: vRecentData(technical.vRecent),
    quest: {
      quest_rank: I('u8', 0),
      star: I('u32', 0),
      fan: I('u64', 0),
      qdata: A('u32', zeros(39)),
      test_data: A('u32', zeros(12)),
    },
    championship: { playable: A('s32', zeros(4)) },
    ranking: { skill_rank: I('s32', 0) },
    xg: K.ATTR(
      { nr: String(xgMusicdata.length) },
      { musicdata: xgMusicdata }
    ),
    standard: K.ATTR(
      { nr: String(classicMusicdata.length) },
      { musicdata: classicMusicdata, finish: I('u8', 1) }
    ),
    xg_finish: I('u8', 1),
    finish: I('u8', 1),
  };
  await send.object({ player: K.ATTR({ no: '1' }, player) });
};

export const customizeRegist: EPR = async (_info, data, send) => {
  const player = $(data).element('player');
  const refid = refidFrom(player.obj, 'refid');
  const syogo = player
    .element('syogodata.get')
    .elements('syogo')
    .map(value => value.number('', 0));
  if (refid && syogo.length) {
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      { $set: { syogo } }
    );
  }
  await send.object({ player: K.ATTR({ no: '1', state: '2' }) });
};

export const gameendRegist: EPR = async (requestInfo, data, send) => {
  const player = $(data).element('player');
  const playerInfoElement = player.element('playerinfo');
  const playerInfo = $(playerInfoElement ? playerInfoElement.obj : {});
  const refid = refidFrom(playerInfo.obj, 'refid');
  const existing = (refid ? await findProfile(refid) : null) || defaultProfile();
  const requestTime = Date.now();
  const requestFingerprint = compactRequestFingerprint(data);
  const playSession = refid
    ? playSessions[refid] || clampS32(existing.gameendSession)
    : 0;
  const previousReceipt = refid
    ? gameendReceipts[refid] || existing.lastGameendReceipt
    : undefined;
  const isDuplicate = !!(
    previousReceipt &&
    previousReceipt.session === playSession &&
    previousReceipt.fingerprint === requestFingerprint
  );
  const responsePlayCount = isDuplicate
    ? previousReceipt!.playCount
    : existing.playCount + 1;
  const responseNowTime = isDuplicate
    ? previousReceipt!.nowTime
    : new Date(requestTime).toISOString();
  const customizeElement = playerInfo.element('customize');
  const customize = $(customizeElement ? customizeElement.obj : {});
  const incomingCustomItems = playerInfo.numbers('item', []);
  const savedCustomItems = incomingCustomItems.length > 0
    ? normalizeCustomItems(incomingCustomItems)
    : normalizeCustomItems(existing.customItems);
  const playstyles = playerInfo.numbers('playstyles', []);
  const infoElement = playerInfo.element('info');
  const info = $(infoElement ? infoElement.obj : {});
  const playMode = requestPlayMode(data);
  const gameCode = requestGameCode(requestInfo);
  const stages = $(data).elements('modedata.stage');
  const results = player.elements('playdata');
  const responseKind = results.length > 0 ? results[0].number('kind', 0) : 0;
  const incomingEmblem = playerInfo.numbers('emblem', []);
  const previousTechnical = profileTechnicalStatus(existing, gameCode);
  const savedTechnical = isDuplicate
    ? previousTechnical
    : uploadedTechnicalStatus(playerInfo, previousTechnical);
  const savedTechnicalStatus = {
    ...(existing.technicalStatus || {}),
    [technicalStatusKey(gameCode)]: savedTechnical,
  };
  const groupDataRaw = (playerInfo.obj as any).groupdata;
  const groupData = $(groupDataRaw || {});
  const pdataRaw = groupDataRaw && groupDataRaw.pdata;
  const pdata = $(pdataRaw || {});
  const incomingPlayLogs = pdata.elements('play_log');
  const incomingEventLogs = pdata.elements('event_log');
  const playerCoopeRaw = groupDataRaw && groupDataRaw.player_coope;
  const playerCoope = $(playerCoopeRaw || {});
  const incomingCoopeScores = cooperationChallengeEnabled()
    ? playerCoope.elements('cooperation_challenge')
    : [];
  const selectedCoopeEventId = pdata.number(
    'coope_eventid',
    existing.communityCoopeEventIds[gameCode] === undefined
      ? existing.communityCoopeEventId
      : existing.communityCoopeEventIds[gameCode]
  );
  const selectedCoopeEvents = {
    ...existing.communityCoopeEventIds,
    [gameCode]: cooperationEventIds(gameCode).includes(selectedCoopeEventId)
      ? selectedCoopeEventId
      : 0,
  };
  const mergedCoopeScores = normalizeCooperationScores(existing.communityCoopeScores);
  const acceptedCoopeDeltas: { [eventId: string]: number } = {};
  if (!isDuplicate && cooperationChallengeEnabled()) {
    const highestIncomingScores: { [eventId: string]: number } = {};
    for (const challenge of incomingCoopeScores.slice(0, 26)) {
      const eventId = Number(challenge.attr().eventid || 0);
      if (!cooperationEventIds(gameCode).includes(eventId)) continue;
      const score = clampU32(challenge.number('score', 0));
      highestIncomingScores[String(eventId)] = Math.max(
        highestIncomingScores[String(eventId)] || 0,
        score
      );
    }
    // Merge duplicate event IDs before calculating the accepted delta.  This
    // keeps malformed/repeated slots from overwriting a real increase with 0.
    for (const eventIdText of Object.keys(highestIncomingScores)) {
      const eventId = Number(eventIdText);
      const score = highestIncomingScores[eventIdText];
      const oldIndex = mergedCoopeScores.findIndex(value =>
        value.gameCode === gameCode && value.eventId === eventId
      );
      const oldScore = oldIndex >= 0 ? mergedCoopeScores[oldIndex].score : 0;
      const savedScore = Math.max(oldScore, score);
      if (oldIndex >= 0) mergedCoopeScores[oldIndex].score = savedScore;
      else mergedCoopeScores.push({ gameCode, eventId, score: savedScore });
      acceptedCoopeDeltas[String(eventId)] = Math.max(0, savedScore - oldScore);
    }
  }
  let mergedPlayLogs = mergeCommunityLogs(
    existing.communityPlayLogs,
    incomingPlayLogs,
    MEMBER_PLAY_LOG_COUNT
  );
  let mergedEventLogs = mergeCommunityLogs(
    existing.communityEventLogs,
    incomingEventLogs,
    MEMBER_EVENT_LOG_COUNT
  );
  const uploadedLogNum = pdata.number('log_num', existing.communityLogNum);
  const incomingLivePoint = Math.max(
    0,
    playerInfo.number('live_point', existing.livePoint)
  );
  const earnedLivePoint = Math.max(0, playerInfo.number('get_live_point', 0));
  // Real K33 captures show that live_point normally already includes this
  // credit's get_live_point award (403 + 2200 -> 2603, 2603 + 300 -> 2903,
  // 2903 + 1200 -> 4103).  Do not blindly add both fields.  When a cabinet
  // uploads a stale/base live_point, existing + get_live_point is a safe
  // fallback; taking the maximum supports both forms without regression.
  const savedLivePoint = isDuplicate
    ? existing.livePoint
    : clampS32(Math.max(
        existing.livePoint,
        incomingLivePoint,
        clampS32(existing.livePoint + earnedLivePoint)
      ));
  const incomingTrophyList = playerInfo.numbers('trophy_list', []);
  const savedTrophyList = mergeTrophyList(existing.trophyList, incomingTrophyList);
  const plusLimit = xg2PlusLimit();
  const incomingPlusLivePoint = playerInfo.number(
    'plus_live_point',
    existing.plusLivePoint
  );
  const savedPlusLivePoint = plusLimit < 0
    ? existing.plusLivePoint
    : xg2PlusUnlockPolicy() === 'all_unlocked'
      ? plusLimit
      : Math.max(
          existing.plusLivePoint,
          Math.max(0, Math.min(plusLimit, incomingPlusLivePoint))
        );
  const infoState: PlayerInfoState = {
    mode: info.number('mode', existing.infoState.mode),
    boss: info.number('boss', existing.infoState.boss),
    addMusic: info.number('add_music', existing.infoState.addMusic),
    freeMusic: info.number('free_music', existing.infoState.freeMusic),
    freeSeq: info.number('free_seq', existing.infoState.freeSeq),
    indies: info.number('indies', existing.infoState.indies),
    jukebox: info.number('jukebox', existing.infoState.jukebox),
    trial: info.number('trial', existing.infoState.trial),
    topRanker: info.number('topranker', existing.infoState.topRanker),
    // The Community Log introduction is one-shot state.  Older cabinets can
    // upload a stale zero after it has completed, which must not replay the
    // tutorial or revoke its X-Plan reward.
    log: Math.max(existing.infoState.log, info.number('log', existing.infoState.log)),
    coopeChallenge: cooperationChallengeEnabled()
      ? existing.groupId
        ? Math.max(1, info.number('coope_challenge', existing.infoState.coopeChallenge))
        : info.number('coope_challenge', existing.infoState.coopeChallenge)
      : 0,
    customChallenge: info.number(
      'custom_challenge',
      existing.infoState.customChallenge
    ),
    groupCompe: info.number('group_compe', existing.infoState.groupCompe),
    groupTrial: info.number('group_trial', existing.infoState.groupTrial),
    group: info.number('group', existing.infoState.group),
    shopChamp: info.number('shopchamp', existing.infoState.shopChamp),
    groupLevel: info.number('group_lv', existing.infoState.groupLevel),
    livePoint: info.number('live_point', existing.infoState.livePoint),
    texture: info.number('texture', existing.infoState.texture),
    groupmemberRecruitment: info.number(
      'groupmember_recruitment',
      existing.infoState.groupmemberRecruitment
    ),
  };
  const savedPlaystyle = playstyles.length > 0
    ? normalizeNumbers(playstyles, XG_PLAYSTYLE_COUNT)
    : normalizeNumbers(existing.xgPlaystyle, XG_PLAYSTYLE_COUNT);
  savedPlaystyle[16] = Math.max(
    existing.xgPlaystyle[16] || 0,
    savedPlaystyle[16] || 0
  );

  let communityTutorialRewardVersion = Math.max(
    0,
    existing.communityTutorialRewardVersion || 0
  );
  let highestStoredLogIndex = mergedPlayLogs.concat(mergedEventLogs).reduce(
    (maximum, log) => Math.max(maximum, log.index),
    Math.max(existing.communityLogNum, uploadedLogNum)
  );
  const tutorialLogUploadedOrStored = hasXPlanTutorialLog(mergedEventLogs);
  const tutorialComplete =
    infoState.log > 0 || savedPlaystyle[16] >= 2 || tutorialLogUploadedOrStored;
  if (communityTutorialRewardVersion < COMMUNITY_TUTORIAL_REWARD_VERSION) {
    if (tutorialLogUploadedOrStored) {
      communityTutorialRewardVersion = COMMUNITY_TUTORIAL_REWARD_VERSION;
    } else if (tutorialComplete && !isDuplicate) {
      const index = ++highestStoredLogIndex;
      mergedEventLogs = normalizeCommunityLogs(
        mergedEventLogs.concat({
          index,
          logId: 1,
          attrib: 2,
          param: communityMusicParam(X_PLAN_MUSIC_ID, requestTime),
          ctime: strictProtocolTime(requestTime),
        }),
        MEMBER_EVENT_LOG_COUNT
      );
      communityTutorialRewardVersion = COMMUNITY_TUTORIAL_REWARD_VERSION;
    }
  }
  if (communityTutorialRewardVersion >= COMMUNITY_TUTORIAL_REWARD_VERSION) {
    savedPlaystyle[16] = Math.max(2, savedPlaystyle[16]);
  }

  // The recovered client creates one result log per stage.  Its precedence is
  // Excellent, SS, Full Combo, then S.  Generate these only when the cabinet
  // supplied no play-log records, preserving real client logs when available.
  if (!isDuplicate && incomingPlayLogs.length === 0) {
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      const stage = stages[index];
      const musicId = result.number(
        'musicid',
        stage ? stage.number('musicid', -1) : -1
      );
      const seqMode = result.number('seqmode', -1);
      const maximumSeqMode = playMode === 'classic' ? 9 : 8;
      const logId = resultCommunityLogId(result);
      if (
        playMode === 'unknown' ||
        musicId < 0 ||
        seqMode < 1 ||
        seqMode > maximumSeqMode ||
        logId <= 0
      ) continue;
      mergedPlayLogs = normalizeCommunityLogs(
        mergedPlayLogs.concat({
          index: ++highestStoredLogIndex,
          logId,
          attrib: 1,
          param: communityMusicParam(musicId, requestTime),
          ctime: strictProtocolTime(requestTime),
        }),
        MEMBER_PLAY_LOG_COUNT
      );
    }
  }
  const update: Partial<Profile> = {
    lastMode: modeNumber(playMode, existing.lastMode),
    modeEncodingVersion: 2,
    xgPlaystyle: savedPlaystyle,
    infoState,
    communityIcon: pdata.number('icon', existing.communityIcon),
    communityIconBack: pdata.number('icon_back', existing.communityIconBack),
    // log_num is an identity high-water mark, not a disposable UI value.  A
    // stale cabinet/request must never make it go backwards and reuse indexes.
    communityLogNum: Math.max(
      existing.communityLogNum,
      uploadedLogNum,
      highestStoredLogIndex
    ),
    communityCoopeEventId: cooperationChallengeEnabled()
      ? selectedCoopeEvents[gameCode] || 0
      : 0,
    communityCoopeEventIds: cooperationChallengeEnabled()
      ? selectedCoopeEvents
      : existing.communityCoopeEventIds,
    communityCoopeScores: mergedCoopeScores,
    communityPlayLogs: mergedPlayLogs,
    communityEventLogs: mergedEventLogs,
    communitySchemaVersion: COMMUNITY_SCHEMA_VERSION,
    communityTutorialRewardVersion,
    livePoint: savedLivePoint,
    plusLivePoint: savedPlusLivePoint,
    trophyList: savedTrophyList,
    technicalStatus: savedTechnicalStatus,
    customItems: savedCustomItems,
    gameendSession: playSession,
    lastGameendReceipt: isDuplicate
      ? existing.lastGameendReceipt
      : {
          session: playSession,
          fingerprint: requestFingerprint,
          processedAt: requestTime,
          playCount: responsePlayCount,
          nowTime: responseNowTime,
        },
    style: playerInfo.number('styles', playerInfo.number('style', existing.style)),
    style2: playerInfo.number(
      'styles_2',
      playerInfo.number('style_2', existing.style2)
    ),
    chara: incomingEmblem.length > 0
      ? clampInteger(incomingEmblem[0], 0, 0xff)
      : existing.chara,
    secretMusic: playerInfo.numbers(
      'v_secret_music',
      playerInfo.numbers('secret_music', existing.secretMusic)
    ),
    secretChara: playerInfo.number('secret_chara', existing.secretChara),
    syogo: playerInfo.numbers('syogo', existing.syogo),
    perfect: playerInfo.number('perfect', existing.perfect),
    great: playerInfo.number('great', existing.great),
    good: playerInfo.number('good', existing.good),
    poor: playerInfo.number('poor', existing.poor),
    miss: playerInfo.number('miss', existing.miss),
    shutter: customize.number('shutter', existing.shutter),
    infoLevel: playerInfo.number(
      'info_level',
      customize.number('info_level', existing.infoLevel)
    ),
    nameDisp: customize.number('name_disp', existing.nameDisp),
    auto: customize.number('auto', existing.auto),
    random: customize.number('random', existing.random),
    judgeLogo: customize.number('judge_logo', existing.judgeLogo),
    skin: customize.number('skin', existing.skin),
    movie: customize.number('movie', existing.movie),
    attackEffect: customize.number('attack_effect', existing.attackEffect),
    layout: customize.number('layout', existing.layout),
    targetSkill: customize.number('target_skill', existing.targetSkill),
    comparison: customize.number('comparison', existing.comparison),
    meterCustom: customize.numbers('meter_custom', existing.meterCustom),
  };
  if (refid && !isDuplicate) {
    await DB.Upsert<Profile>(
      refid,
      { collection: 'profile' },
      { $set: update, $inc: { playCount: 1 } }
    );
    if (existing.groupId) {
      const group = await findGroup(existing.groupId);
      if (group && cooperationChallengeEnabled()) {
        const cooperationScores = (group.cooperationScores || []).slice();
        for (const eventIdText of Object.keys(acceptedCoopeDeltas)) {
          const delta = acceptedCoopeDeltas[eventIdText];
          if (delta <= 0) continue;
          const eventId = Number(eventIdText);
          const scoreIndex = cooperationScores.findIndex(value =>
            value.gameCode === gameCode && value.eventId === eventId
          );
          if (scoreIndex >= 0) {
            cooperationScores[scoreIndex].totalScore = clampU32(
              cooperationScores[scoreIndex].totalScore + delta
            );
            cooperationScores[scoreIndex].validTime = ARCHIVE_EVENT_END;
          } else {
            cooperationScores.push({
              gameCode,
              eventId,
              totalScore: delta,
              validTime: ARCHIVE_EVENT_END,
            });
          }
        }
        await DB.Update<Group>(
          { collection: 'group', groupId: group.groupId },
          { $set: { cooperationScores } }
        );
      }
      if (cooperationChallengeEnabled()) {
        // This also repairs a profile/group partial write on the next request:
        // group totals may never be lower than the sum retained by its members.
        await reconcileGroupCooperationScores(existing.groupId, gameCode);
      }
      await recomputeGroupLivePoint(existing.groupId);
    }
  }

  for (let index = 0; index < results.length; index++) {
    if (!refid || isDuplicate) break;
    const result = results[index];
    const stage = stages[index];
    // playdata is the authoritative result record.  modedata.stage is only a
    // fallback: special flows can make the stage array and result array differ
    // in length/order, which previously attached a real result to another song.
    const musicId = result.number(
      'musicid',
      stage ? stage.number('musicid', -1) : -1
    );
    // music_type and seqmode are independent in real XG2 traffic (for
    // example music_type=1 with seqmode=3).  Guessing a missing seqmode from
    // music_type writes the result into another chart and recreates phantom E
    // ranks, so only an explicit canonical chart slot is accepted.
    const seqMode = result.number('seqmode', -1);
    const kind = result.number('kind', 0);
    const musicType = result.number('music_type', seqMode);
    const maximumSeqMode = playMode === 'classic' ? 9 : 8;
    if (
      playMode === 'unknown' ||
      musicId < 0 ||
      seqMode < 1 ||
      seqMode > maximumSeqMode
    ) continue;

    const incoming: Score = {
      collection: 'score',
      schemaVersion: SCORE_SCHEMA_VERSION,
      gameCode,
      playMode,
      kind,
      musicType,
      musicId,
      seqMode,
      score: clampU32(result.number('score', 0)),
      clear: result.number('clear', 0),
      autoClear: result.number('auto_clear', 0),
      flags: clampU32(result.number('flags', 0)),
      fullCombo: result.number('fullcombo', 0),
      excellent: result.number('excellent', 0),
      combo: clampU32(result.number('combo', 0)),
      skillPoint: result.number('skill_point', 0),
      skillPercent: normalizeAchievement(result.number('skill_perc', -1)),
      resultRank: normalizeResultRank(result.number('result_rank', 0)),
      difficulty: result.number('difficulty', 0),
      comboRate: result.number('combo_rate', 0),
      perfectRate: result.number('perfect_rate', 0),
      attempts: 1,
      updatedAt: Date.now(),
    };
    const previous = await DB.FindOne<Score>(refid, {
      collection: 'score',
      schemaVersion: SCORE_SCHEMA_VERSION,
      gameCode,
      playMode,
      kind,
      musicId,
      seqMode,
    });
    if (!previous) {
      await DB.Insert<Score>(refid, incoming);
    } else {
      const best = mergeBestScore(previous, incoming);
      await DB.Update<Score>(
        refid,
        {
          collection: 'score',
          schemaVersion: SCORE_SCHEMA_VERSION,
          gameCode,
          playMode,
          kind,
          musicId,
          seqMode,
        },
        { $set: best, $inc: { attempts: 1 } }
      );
    }
  }

  const savedScores = refid
    ? ((await DB.Find<Score>(refid, { collection: 'score' })) as Score[])
    : [];
  const responseProfile = {
    ...existing,
    ...update,
    trophyList: savedTrophyList,
  } as Profile;
  const progress = await hydrateProfileProgress(
    refid,
    responseProfile,
    gameCode,
    responseKind,
    savedScores
  );

  if (refid && !isDuplicate) {
    gameendReceipts[refid] = update.lastGameendReceipt!;
  }

  const mode = $(data).attr('gamemode').mode || '0';
  const responseEmblem = [
    update.chara === undefined ? existing.chara : update.chara,
    savedTechnical.abilityType,
    savedTechnical.abilityLevel,
  ];
  const responsePlayer: any = {
    event_mode: I('u8', 0),
    trophy_list: A('s32', progress.trophyList),
    emblem: A('u8', responseEmblem),
    xg_item: A('s32', XG2_SKIN_PACK_ITEMS),
    live_point: I('s32', savedLivePoint),
    plus_live_point: I('s32', plusLimit < 0 ? -1 : savedPlusLivePoint),
    xg_skill: skillResponse(progress.skills.xgSkill, progress.skills.xgAllSkill),
    v_skill: skillResponse(progress.skills.vSkill, progress.skills.vAllSkill),
    skill: playMode === 'classic'
      ? skillResponse(progress.skills.vSkill, progress.skills.vAllSkill)
      : skillResponse(progress.skills.xgSkill, progress.skills.xgAllSkill),
    registered_other_num: I('u32', 0),
    xg_play_cnt: I('u32', responsePlayCount),
    play_cnt: I('u32', responsePlayCount),
    sess_cnt: I('u32', responsePlayCount),
    encore_play: I('u32', 0),
    premium_play: I('u32', 0),
    now_time: I('str', responseNowTime),
    kikan_event: I('u32', 0),
    vip_rensyo: I('u16', 0),
    all_play_mode: I('u8', 0),
    play_shop_num: I('u8', 0),
    judge_perfect: I('u32', update.perfect || 0),
    is_v5_goodplayer: I('u8', 0),
    max_clear_difficulty: I('s8', 0),
    max_fullcombo_difficulty: I('s8', 0),
    max_excellent_difficulty: I('s8', 0),
    rival_data: {},
    battledata: battleData({ ...existing, ...update } as Profile),
    xg_recentdata: recentData(savedTechnical.xgRecent),
    v_recentdata: vRecentData(savedTechnical.vRecent),
    quest: {
      quest_rank: I('u8', 0),
      star: I('u32', 0),
      fan: I('u64', 0),
      qdata: A('u32', zeros(39)),
    },
    championship: { playable: A('s32', zeros(4)) },
  };
  await send.object({
    gamemode: K.ATTR({ mode: String(mode) }),
    player: K.ATTR(
      { card: $(data).attr('player').card || 'use', no: '1' },
      responsePlayer
    ),
  });
};

export const simpleSuccess: EPR = async (_info, _data, send) => {
  await send.success();
};

const groupLogNode = (saved?: GroupLog) =>
  K.ATTR(
    { index: String(saved ? saved.index : 0) },
    {
      did: I('s32', saved ? saved.did : 0),
      logid: I('s32', saved ? saved.logId : 0),
      param: I('str', saved ? saved.param : ''),
      ctime: I('str', saved ? saved.ctime : ''),
    }
  );

const memberLogNode = (saved?: CommunityLog) => {
  return K.ATTR(
    { index: String(saved ? saved.index : 0) },
    {
      logid: I('s32', saved ? saved.logId : 0),
      attrib: I('s32', saved ? saved.attrib : 0),
      param: I('str', saved ? saved.param : ''),
      ctime: I('str', saved ? saved.ctime : ''),
    }
  );
};

function paddedLogNodes<T>(
  values: T[] | undefined,
  count: number,
  render: (saved?: T) => any
): any[] {
  const nodes = (values || []).slice(-count).map(value => render(value));
  while (nodes.length < count) nodes.push(render());
  return nodes;
}

function selectedCooperationEvent(profile: Profile | null, gameCode: string): number {
  if (!profile || !cooperationChallengeEnabled()) return 0;
  const selected = profile.communityCoopeEventIds[gameCode];
  if (selected !== undefined) return selected;
  return gameCode === 'K33' ? profile.communityCoopeEventId || 0 : 0;
}

function playerCooperationNodes(profile: Profile | null, gameCode: string): any[] {
  if (!profile || !cooperationChallengeEnabled()) return [];
  const scores = normalizeCooperationScores(profile.communityCoopeScores).filter(
    value => value.gameCode === gameCode && value.score > 0
  );
  const selected = selectedCooperationEvent(profile, gameCode);
  if (selected > 0 && !scores.some(value => value.eventId === selected)) {
    scores.push({ gameCode, eventId: selected, score: 0 });
  }
  return scores.slice(0, 26).map(value =>
    K.ATTR(
      { eventid: String(value.eventId) },
      { score: I('u32', value.score) }
    )
  );
}

const customChallengeNode = (index: number) =>
  K.ATTR(
    { index: String(index) },
    {
      param: I('str', ''),
      ctime: I('str', ''),
      is_valid: I('bool', false),
    }
  );

const basicGroupMemberNode = (
  profile: Profile | null,
  refid = '',
  gameCode = 'K33',
  skill = 0
) =>
  K.ATTR(
    { did: String((profile && profile.did) || (refid ? didFromRefid(refid) : 0)) },
    {
      name: I('str', profile ? profile.name : ''),
      // Group/Community uses this single Skill value to select the colour of
      // the Ability emblem.  Returning zero leaves the right animal/level in
      // the wrong colour band.
      skill: I('s32', skill),
      emblem: A('u8', profileEmblem(profile, gameCode)),
      icon: I('s32', profile ? profile.communityIcon : 0),
      icon_back: I('s32', profile ? profile.communityIconBack : 0),
      mtime: I('str', protocolTime()),
    }
  );

const fullGroupMemberNode = (
  profile: Profile | null,
  refid = '',
  gameCode = 'K33',
  skill = 0
) =>
  K.ATTR(
    { did: String((profile && profile.did) || (refid ? didFromRefid(refid) : 0)) },
    {
      name: I('str', profile ? profile.name : ''),
      skill: I('s32', skill),
      live_point: I('s32', profile ? profile.livePoint : 0),
      emblem: A('u8', profileEmblem(profile, gameCode)),
      icon: I('s32', profile ? profile.communityIcon : 0),
      icon_back: I('s32', profile ? profile.communityIconBack : 0),
      log_num: I('s32', profile ? profile.communityLogNum : 0),
      coope_eventid: I('s32', selectedCooperationEvent(profile, gameCode)),
      mtime: I('str', protocolTime()),
      p_log_data: {
        log: paddedLogNodes(
          profile ? profile.communityPlayLogs : [],
          MEMBER_PLAY_LOG_COUNT,
          memberLogNode
        ),
      },
      e_log_data: {
        log: paddedLogNodes(
          profile ? profile.communityEventLogs : [],
          MEMBER_EVENT_LOG_COUNT,
          memberLogNode
        ),
      },
      customchallenge: {
        custom: Array(3).fill(0).map((_, index) => customChallengeNode(index)),
      },
      cooperation_challenge: playerCooperationNodes(profile, gameCode),
    }
  );

async function groupMembers(
  group: Group,
  full = false,
  gameCode = 'K33'
): Promise<any[]> {
  const nodes: any[] = [];
  for (const refid of group.memberRefids.slice(0, 10)) {
    const profile = await findProfile(refid);
    const progress = profile
      ? await hydrateProfileProgress(refid, profile, gameCode, 0)
      : null;
    const skill = progress ? progress.skills.xgSkill : 0;
    nodes.push(full
      ? fullGroupMemberNode(profile, refid, gameCode, skill)
      : basicGroupMemberNode(profile, refid, gameCode, skill));
  }
  while (nodes.length < 10) {
    nodes.push(full
      ? fullGroupMemberNode(null, '', gameCode)
      : basicGroupMemberNode(null, '', gameCode));
  }
  return nodes;
}

async function renderGroupSummary(group: Group, gameCode = 'K33'): Promise<any> {
  const members = await groupMembers(group, false, gameCode);
  const memberDids = group.memberRefids
    .slice(0, 10)
    .map(didFromRefid)
    .concat(zeros(10 - Math.min(group.memberRefids.length, 10)));
  return K.ATTR(
    { groupid: String(group.groupId) },
    {
      icon: I('s32', group.icon),
      name: I('str', group.name),
      member_did: A('s32', memberDids),
      member_nr: I('s32', Math.min(group.memberRefids.length, 10)),
      group_level: I('s32', groupLevel(group.livePoint || 0)),
      live_point: I('s32', group.livePoint || 0),
      limit_live_point: I('s32', livePointTerm() > 0 ? 389999 : 0),
      lower_live_point: I('s32', 0),
      secret_music_id: A('s32', negatives(5)),
      secret_music_seq: A('s32', zeros(5)),
      reward_music_id: A('s32', negatives(20)),
      reward_music_seq: A('s32', zeros(20)),
      member: { player: members },
    }
  );
}

function normalizedGroupLogs(values: GroupLog[] | undefined, capacity: number): GroupLog[] {
  const byIndex: { [index: string]: GroupLog } = {};
  for (const raw of values || []) {
    const index = Math.floor(Number(raw && raw.index) || 0);
    const logId = Math.floor(Number(raw && raw.logId) || 0);
    if (index <= 0 || logId <= 0) continue;
    byIndex[String(index)] = {
      index,
      did: Math.floor(Number(raw.did) || 0),
      logId,
      param: String(raw.param || '').slice(0, 128),
      ctime: String(raw.ctime || strictProtocolTime()),
    };
  }
  return Object.keys(byIndex)
    .map(key => byIndex[key])
    .sort((left, right) => left.index - right.index)
    .slice(-capacity);
}

function effectiveGroupPlayLogs(group: Group | null): GroupLog[] {
  if (!group) return [];
  const logs = normalizedGroupLogs(group.playLogs, GROUP_PLAY_LOG_COUNT);
  if (logs.length > 0) return logs;
  // Existing groups predate Community Log persistence.  Synthesize the one
  // historical fact we can prove from the stored group document so recovered
  // cards do not open an entirely blank Community Log.
  return [{
    index: 1,
    did: didFromRefid(group.ownerRefid),
    logId: 1,
    param: '',
    ctime: strictProtocolTime(group.createdAt || Date.now()),
  }];
}

function rootCooperationNodes(group: Group | null, gameCode: string): any[] {
  if (!group || !cooperationChallengeEnabled()) return [];
  const saved = (group.cooperationScores || []).filter(value =>
    value.gameCode === gameCode
  );
  // Once group_coope is present the game no longer falls back to its local
  // table, so return the complete 26-entry catalog in the original XML order.
  return cooperationEventIds(gameCode).map(eventId => {
    const state = saved.find(value => value.eventId === eventId);
    return K.ATTR(
      { eventid: String(eventId) },
      {
        total_score: I('u32', state ? clampU32(state.totalScore) : 0),
        valid_time: I(
          'str',
          state && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(state.validTime)
            ? state.validTime
            : ARCHIVE_EVENT_END
        ),
      }
    );
  });
}

async function renderGroupData(
  group: Group | null,
  gameCode = 'K33'
): Promise<any> {
  const memberRefids = group ? group.memberRefids : [];
  const members = group
    ? await groupMembers(group, true, gameCode)
    : Array(10).fill(0).map(() => fullGroupMemberNode(null, '', gameCode));
  const memberDids = memberRefids
    .slice(0, 10)
    .map(didFromRefid)
    .concat(zeros(10 - Math.min(memberRefids.length, 10)));
  return K.ATTR(
    { groupid: String(group ? group.groupId : 0), state: '0' },
    {
      icon: I('s32', group ? group.icon : 0),
      name: I('str', group ? group.name : ''),
      member_did: A('s32', memberDids),
      member_nr: I('s32', Math.min(memberRefids.length, 10)),
      group_level: I('s32', group ? groupLevel(group.livePoint || 0) : 0),
      live_point: I('s32', (group && group.livePoint) || 0),
      limit_live_point: I('s32', group && livePointTerm() > 0 ? 389999 : 0),
      lower_live_point: I('s32', 0),
      secret_music_id: A('s32', negatives(5)),
      secret_music_seq: A('s32', zeros(5)),
      reward_music_id: A('s32', negatives(20)),
      reward_music_seq: A('s32', zeros(20)),
      item: A('s32', zeros(26)),
      continue_live_point_bonus: I('s32', 0),
      is_recruitment: I('bool', group ? group.isRecruitment : false),
      p_group_log: {
        log: paddedLogNodes(
          effectiveGroupPlayLogs(group),
          GROUP_PLAY_LOG_COUNT,
          groupLogNode
        ),
      },
      e_group_log: {
        log: paddedLogNodes(
          group ? normalizedGroupLogs(group.eventLogs, GROUP_EVENT_LOG_COUNT) : [],
          GROUP_EVENT_LOG_COUNT,
          groupLogNode
        ),
      },
      member: { player: members },
      group_coope: cooperationChallengeEnabled()
        ? { cooperation_challenge: rootCooperationNodes(group, gameCode) }
        : {},
    }
  );
}

async function findGroup(groupId: number): Promise<Group | null> {
  await ensureSearchableGroupIds();
  if (groupId <= 0) return null;
  return (await DB.FindOne<Group>({ collection: 'group', groupId })) || null;
}

async function recomputeGroupLivePoint(groupId: number): Promise<Group | null> {
  const group = await findGroup(groupId);
  if (!group) return null;
  const profiles = await Promise.all(
    group.memberRefids.slice(0, 10).map(refid => findProfile(refid))
  );
  const livePoint = Math.min(
    389999,
    profiles.reduce(
      (sum, profile) => sum + (profile ? Math.max(0, profile.livePoint || 0) : 0),
      0
    )
  );
  if (livePoint !== (group.livePoint || 0)) {
    await DB.Update<Group>(
      { collection: 'group', groupId },
      { $set: { livePoint } }
    );
  }
  return { ...group, livePoint };
}

async function reconcileGroupCooperationScores(
  groupId: number,
  gameCode: string
): Promise<void> {
  const group = await findGroup(groupId);
  if (!group) return;
  const memberProfiles = await Promise.all(
    group.memberRefids.slice(0, 10).map(refid => findProfile(refid))
  );
  const scores = (group.cooperationScores || []).slice();
  let changed = false;
  for (const eventId of cooperationEventIds(gameCode)) {
    const retainedByMembers = memberProfiles.reduce((sum, profile) => {
      if (!profile) return sum;
      const state = normalizeCooperationScores(profile.communityCoopeScores).find(
        value => value.gameCode === gameCode && value.eventId === eventId
      );
      return clampU32(sum + (state ? state.score : 0));
    }, 0);
    const oldIndex = scores.findIndex(value =>
      value.gameCode === gameCode && value.eventId === eventId
    );
    if (oldIndex >= 0) {
      const repaired = Math.max(clampU32(scores[oldIndex].totalScore), retainedByMembers);
      if (
        repaired !== scores[oldIndex].totalScore ||
        scores[oldIndex].validTime !== ARCHIVE_EVENT_END
      ) {
        scores[oldIndex] = {
          ...scores[oldIndex],
          totalScore: repaired,
          validTime: ARCHIVE_EVENT_END,
        };
        changed = true;
      }
    } else if (retainedByMembers > 0) {
      scores.push({
        gameCode,
        eventId,
        totalScore: retainedByMembers,
        validTime: ARCHIVE_EVENT_END,
      });
      changed = true;
    }
  }
  if (changed) {
    await DB.Update<Group>(
      { collection: 'group', groupId },
      { $set: { cooperationScores: scores } }
    );
  }
}

async function detachFromOtherGroups(refid: string, keepGroupId = 0): Promise<void> {
  await ensureSearchableGroupIds();
  const groups = await DB.Find<Group>({ collection: 'group' });
  for (const group of groups) {
    if (group.groupId === keepGroupId || !group.memberRefids.includes(refid)) continue;
    const members = group.memberRefids.filter(value => value !== refid);
    if (members.length === 0) {
      await DB.Remove<Group>({ collection: 'group', groupId: group.groupId });
    } else {
      await DB.Update<Group>(
        { collection: 'group', groupId: group.groupId },
        {
          $set: {
            memberRefids: members,
            ownerRefid: group.ownerRefid === refid ? members[0] : group.ownerRefid,
          },
        }
      );
      await recomputeGroupLivePoint(group.groupId);
    }
  }
}

async function groupForRequest(data: any): Promise<Group | null> {
  let groupId = requestGroupId(data);
  if (!groupId) {
    const refid = requestRefid(data);
    const profile = refid ? await findProfile(refid) : null;
    groupId = (profile && profile.groupId) || 0;
    if (!groupId && refid) {
      const groups = await DB.Find<Group>({ collection: 'group' });
      const membership = groups.find(group => group.memberRefids.includes(refid));
      groupId = membership ? membership.groupId : 0;
    }
  }
  return findGroup(groupId);
}

export const groupEntryRegist: EPR = async (info, data, send) => {
  const refid = requestRefid(data);
  const group = await groupForRequest(data);
  if (
    !refid ||
    !group ||
    (!group.memberRefids.includes(refid) &&
      (!group.isRecruitment || group.memberRefids.length >= 10))
  ) {
    await send.object({
      groupdata: K.ATTR({ groupid: String(group ? group.groupId : 0), state: '1' }),
    });
    return;
  }
  if (!group.memberRefids.includes(refid)) {
    await detachFromOtherGroups(refid, group.groupId);
    group.memberRefids.push(refid);
    const joinLogs = effectiveGroupPlayLogs(group);
    const joinIndex = joinLogs.reduce(
      (maximum, log) => Math.max(maximum, log.index),
      0
    ) + 1;
    joinLogs.push({
      index: joinIndex,
      did: didFromRefid(refid),
      logId: 2,
      param: '',
      ctime: strictProtocolTime(),
    });
    await DB.Update<Group>(
      { collection: 'group', groupId: group.groupId },
      {
        $set: {
          memberRefids: group.memberRefids,
          playLogs: normalizedGroupLogs(joinLogs, GROUP_PLAY_LOG_COUNT),
        },
      }
    );
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      {
        $set: {
          groupId: group.groupId,
          infoState: {
            ...((await findProfile(refid)) || defaultProfile()).infoState,
            coopeChallenge: cooperationChallengeEnabled() ? 1 : 0,
          },
        },
      }
    );
  }
  const refreshed = await recomputeGroupLivePoint(group.groupId);
  await send.object({
    groupdata: await renderGroupData(refreshed || group, requestGameCode(info)),
  });
};

export const groupDataGet: EPR = async (info, data, send) => {
  const group = await groupForRequest(data);
  const refreshed = group ? await recomputeGroupLivePoint(group.groupId) : null;
  await send.object({
    groupdata: await renderGroupData(refreshed || group, requestGameCode(info)),
  });
};

export const groupDataRegist: EPR = async (_info, data, send) => {
  const group = await groupForRequest(data);
  // This endpoint uploads optional group/player comments.  Comment history is
  // deliberately omitted from the local minimal profile, but the request must
  // not be mistaken for a name/icon edit or it clears recruitment by accident.
  await send.object({ groupdata: { state: I('s32', group ? 0 : 1) } });
};

export const groupListGet: EPR = async (info, _data, send) => {
  await ensureSearchableGroupIds();
  const gameCode = requestGameCode(info);
  const stored = (await DB.Find<Group>({ collection: 'group' })).slice(0, 3);
  const output: any[] = [];
  for (const group of stored) {
    const refreshed = await recomputeGroupLivePoint(group.groupId);
    output.push(await renderGroupSummary(refreshed || group, gameCode));
  }
  while (output.length < 3) {
    output.push(
      K.ATTR(
        { groupid: '0' },
        {
          icon: I('s32', 0),
          name: I('str', ''),
          member_did: A('s32', zeros(10)),
          member_nr: I('s32', 0),
          group_level: I('s32', 0),
          live_point: I('s32', 0),
          limit_live_point: I('s32', 0),
          lower_live_point: I('s32', 0),
          secret_music_id: A('s32', negatives(5)),
          secret_music_seq: A('s32', zeros(5)),
          reward_music_id: A('s32', negatives(20)),
          reward_music_seq: A('s32', zeros(20)),
          member: {
            player: Array(10).fill(0).map(() => basicGroupMemberNode(null, '', gameCode)),
          },
        }
      )
    );
  }
  await send.object({ grouplist: { group: output } });
};

export const groupSearch: EPR = async (info, data, send) => {
  const group = await findGroup(requestGroupId(data));
  const refreshed = group ? await recomputeGroupLivePoint(group.groupId) : null;
  const output = refreshed || group;
  await send.object({
    groupsearch: K.ATTR(
      { state: output ? '0' : '1' },
      output ? { group: await renderGroupSummary(output, requestGameCode(info)) } : {}
    ),
  });
};

export const groupCreate: EPR = async (info, data, send) => {
  await ensureSearchableGroupIds();
  const request = $(data).element('group');
  const refid = requestRefid(data);
  const profile = refid ? await findProfile(refid) : null;
  if (!refid) {
    await send.object({ groupdata: K.ATTR({ groupid: '0', state: '1' }) });
    return;
  }
  let group = await DB.FindOne<Group>({ collection: 'group', ownerRefid: refid });
  if (group) await detachFromOtherGroups(refid, group.groupId);
  if (!group) {
    await detachFromOtherGroups(refid);
    const groups = await DB.Find<Group>({ collection: 'group' });
    const usedGroupIds = new Set<number>(
      groups.map(value => value.groupId).filter(isSearchableGroupId)
    );
    const highestGroupId = groups.reduce(
      (maximum, value) =>
        isSearchableGroupId(value.groupId)
          ? Math.max(maximum, value.groupId)
          : maximum,
      GROUP_ID_MIN - 1
    );
    const groupId = availableGroupId(usedGroupIds, highestGroupId + 1);
    group = await DB.Insert<Group>({
      collection: 'group',
      groupId,
      name: request.str('group_name', 'LOCAL GROUP').slice(0, 16),
      icon: request.number('icon', 0),
      ownerRefid: refid,
      memberRefids: [refid],
      isRecruitment: request.bool('is_recruitment'),
      livePoint: 0,
      createdAt: Date.now(),
      playLogs: [{
        index: 1,
        did: didFromRefid(refid),
        logId: 1,
        param: '',
        ctime: strictProtocolTime(),
      }],
      eventLogs: [],
      cooperationScores: [],
    });
  }
  if (profile) {
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      {
        $set: {
          groupId: group.groupId,
          infoState: {
            ...profile.infoState,
            coopeChallenge: cooperationChallengeEnabled() ? 1 : 0,
          },
        },
      }
    );
  }
  const refreshed = await recomputeGroupLivePoint(group.groupId);
  await send.object({
    groupdata: await renderGroupData(refreshed || group, requestGameCode(info)),
  });
};

export const groupWithdrawal: EPR = async (_info, data, send) => {
  const refid = requestRefid(data);
  const profile = refid ? await findProfile(refid) : null;
  let group = profile ? await findGroup(profile.groupId || 0) : null;
  if (!group && refid) {
    const groups = await DB.Find<Group>({ collection: 'group' });
    group = groups.find(value => value.memberRefids.includes(refid)) || null;
  }
  if (refid && profile) {
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      { $set: { groupId: 0 } }
    );
  }
  if (group && refid) {
    const members = group.memberRefids.filter(value => value !== refid);
    if (members.length === 0) {
      await DB.Remove<Group>({ collection: 'group', groupId: group.groupId });
    } else {
      await DB.Update<Group>(
        { collection: 'group', groupId: group.groupId },
        {
          $set: {
            memberRefids: members,
            ownerRefid: group.ownerRefid === refid ? members[0] : group.ownerRefid,
          },
        }
      );
      await recomputeGroupLivePoint(group.groupId);
    }
  }
  await send.object({ groupdata: K.ATTR({ groupid: '0', state: '0' }) });
};

export const myshopRegist: EPR = async (_info, data, send) => {
  const shopRequest = (data as any).shop ? $(data).element('shop') : $(data);
  const locationId = shopRequest.str('locationid', 'LOCAL');
  const cabid = shopRequest.number('cabid', 1);
  const refid = shopRequest.str('refid', requestRefid(data));
  const shop = await findShop(locationId, cabid);
  const shopName = shop ? shop.name : 'LOCAL SHOP';
  if (refid) {
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      {
        $set: {
          shopLocationId: shop ? shop.locationId : locationId,
          shopCabId: shop ? shop.cabid : cabid,
        },
      }
    );
  }
  const profiles = await DB.Find<Profile>(null, { collection: 'profile' });
  profiles.sort(
    (left, right) =>
      (right.livePoint || 0) - (left.livePoint || 0) ||
      (left.__refid || '').localeCompare(right.__refid || '')
  );
  const entries = profiles.slice(0, 10).map((profile, index) =>
    K.ATTR(
      { rank: String(index + 1) },
      {
        did: I(
          's32',
          profile.did || didFromRefid(profile.__refid || String(index + 1))
        ),
        name: I('str', profile.name),
        point: I('s32', profile.livePoint || 0),
      }
    )
  );
  const playerIndex = profiles.findIndex(profile => profile.__refid === refid);
  const playerPoint =
    playerIndex >= 0 ? profiles[playerIndex].livePoint || 0 : 0;
  const shopChamp = {
    locationid: I('str', locationId),
    shopname: I('str', shopName),
    live_point: I(
      's32',
      profiles.reduce((sum, profile) => sum + (profile.livePoint || 0), 0)
    ),
    rank: I('u32', 1),
    nr: I('u32', 1),
    representation: { data: entries },
  };
  const playerChamp = {
    locationid: I('str', locationId),
    shopname: I('str', shopName),
    live_point: I('s32', playerPoint),
    rank: I('u32', playerIndex >= 0 ? playerIndex + 1 : 0),
    nr: I('u32', profiles.length),
  };
  await send.object({
    shop: K.ATTR({ state: '0' }, { shopname: I('str', shopName) }),
    is_valid_shopchamp: I('bool', shopChampionshipTerm() > 0),
    shop_shopchampionship: {
      now_entry: {
        shopchamp: K.ATTR(
          { division: String(shopChampionshipTerm()) },
          shopChamp
        ),
      },
    },
    player_shopchampionship: {
      now_entry: {
        shopchamp: K.ATTR(
          { division: String(shopChampionshipTerm()) },
          playerChamp
        ),
      },
    },
  });
};

export const infoDataGet: EPR = async (_info, _data, send) => {
  await send.object({
    texture: K.ATTR(
      { size: '0' },
      {
        no: I('s32', -1),
        name: I('str', ''),
        sumtype: I('str', ''),
        sum: I('str', ''),
        image: A('u8', []),
      }
    ),
  });
};

export const collaboRegist: EPR = async (_info, data, send) => {
  const refid = requestRefid(data);
  const saveState = refid ? 1 : 0;
  if (refid) {
    const state: CollaboState = {
      collection: 'collabo_state',
      refid,
      gfdmRegistered: true,
      jubeatConfirmed: true,
      saveState,
      updatedAt: Date.now(),
    };
    await DB.Upsert<CollaboState>(
      { collection: 'collabo_state', refid },
      { $set: state }
    );
  }
  await send.object({ save_state: I('s32', saveState) });
};

export const collaboCheck: EPR = async (_info, data, send) => {
  const refid = requestRefid(data);
  const state = refid
    ? await DB.FindOne<CollaboState>({ collection: 'collabo_state', refid })
    : null;
  await send.object({
    j_gfdm: I('bool', Boolean(state && state.jubeatConfirmed)),
  });
};

function defaultShopTrial(): ShopTrial {
  const now = protocolTime();
  return {
    collection: 'shop_trial',
    cabid: 1,
    round: 0,
    title: 'LOCAL SHOP TRIAL',
    pref: 0,
    startDate: now,
    endDate: now,
    musicIds: negatives(3),
    isValid: false,
    updatedAt: 0,
  };
}

function normalizeShopTrialDate(value: string): string {
  const match = String(value || '').match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::(\d{2}))?/
  );
  return match ? `${match[1]} ${match[2]}:${match[3] || '00'}` : value;
}

function renderShopTrial(trial: ShopTrial): any {
  return {
    cabid: I('u32', trial.cabid),
    round: I('u32', trial.round),
    title: I('str', trial.title),
    pref: I('u32', trial.pref),
    start_date: I('str', normalizeShopTrialDate(trial.startDate)),
    end_date: I('str', normalizeShopTrialDate(trial.endDate)),
    musicid: A(
      's32',
      (trial.musicIds || []).slice(0, 3).concat(
        negatives(Math.max(0, 3 - (trial.musicIds || []).length))
      )
    ),
    is_valid: I('bool', trial.isValid),
  };
}

async function requestedShopTrial(data: any): Promise<ShopTrial> {
  const root = $(data);
  const shop = (data as any).shop ? root.element('shop') : root;
  const cabid = shop.number('cabid', 1);
  const hasRound = Boolean(
    (shop.obj as any).round && (shop.obj as any).round['@content'] !== undefined
  );
  if (hasRound) {
    const round = shop.number('round', 0);
    const exact = await DB.FindOne<ShopTrial>({
      collection: 'shop_trial',
      cabid,
      round,
    });
    if (exact) return exact;
  }
  const trials = (await DB.Find<ShopTrial>({
    collection: 'shop_trial',
    cabid,
  })) as ShopTrial[];
  trials.sort(
    (left, right) =>
      Number(Boolean(right.isValid)) - Number(Boolean(left.isValid)) ||
      (right.updatedAt || 0) - (left.updatedAt || 0) ||
      (right.round || 0) - (left.round || 0)
  );
  if (trials.length) return trials[0];
  return { ...defaultShopTrial(), cabid };
}

export const shopTrialGet: EPR = async (_info, data, send) => {
  if (!configBoolean('shop_trial_enabled', true)) {
    const disabled = await requestedShopTrial(data);
    await send.object(renderShopTrial({ ...disabled, isValid: false }));
    return;
  }
  await send.object(renderShopTrial(await requestedShopTrial(data)));
};

export const shopTrialRegist: EPR = async (_info, data, send) => {
  const root = $(data);
  const shop = (data as any).shop ? root.element('shop') : root;
  const cabid = shop.number('cabid', 1);
  const round = shop.number('round', 0);
  const musicIds = shop.numbers('musicid', negatives(3)).slice(0, 3);
  const trial: ShopTrial = {
    collection: 'shop_trial',
    cabid,
    round,
    title: shop.str('title', 'LOCAL SHOP TRIAL').slice(0, 64),
    pref: shop.number('pref', 0),
    startDate: normalizeShopTrialDate(shop.str('start_date', protocolTime())),
    endDate: normalizeShopTrialDate(shop.str('end_date', protocolTime())),
    musicIds: musicIds.concat(negatives(Math.max(0, 3 - musicIds.length))),
    isValid: configBoolean('shop_trial_enabled', true) && shop.bool('is_valid'),
    updatedAt: Date.now(),
  };
  await DB.Upsert<ShopTrial>(
    { collection: 'shop_trial', cabid, round },
    { $set: trial }
  );

  const entry = (data as any).player ? root.element('player') : null;
  const refid = entry ? refidFrom(entry.obj, 'refid') : '';
  const did = entry ? entry.number('did', refid ? didFromRefid(refid) : 0) : 0;
  const points = entry ? entry.numbers('point', []).slice(0, 3) : [];
  if (entry && did > 0 && points.length) {
    const seqmode = entry.numbers('seqmode', zeros(3)).slice(0, 3);
    const profile = refid ? await findProfile(refid) : null;
    const result: ShopTrialEntry = {
      collection: 'shop_trial_entry',
      cabid,
      round,
      did,
      refid,
      name: entry.str('name', profile ? profile.name : 'PLAYER').slice(0, 12),
      seqmode: seqmode.concat(zeros(Math.max(0, 3 - seqmode.length))),
      point: points.concat(zeros(Math.max(0, 3 - points.length))),
      totalPoint: entry.number(
        'total_point',
        points.reduce((sum, value) => sum + value, 0)
      ),
      result: entry.bool('result'),
      isValid: true,
      updatedAt: Date.now(),
    };
    await DB.Upsert<ShopTrialEntry>(
      { collection: 'shop_trial_entry', cabid, round, did },
      { $set: result }
    );
  }
  await send.object(renderShopTrial(trial));
};

export const shopTrialRankingGet: EPR = async (_info, data, send) => {
  const trial = await requestedShopTrial(data);
  const stored = await DB.Find<ShopTrialEntry>({
    collection: 'shop_trial_entry',
    cabid: trial.cabid,
    round: trial.round,
  });
  stored.sort(
    (left, right) =>
      right.totalPoint - left.totalPoint || left.updatedAt - right.updatedAt
  );
  const ranking = stored.slice(0, 200).map(entry => ({
    did: I('s32', entry.did),
    name: I('str', entry.name),
    seqmode: A('s32', entry.seqmode.slice(0, 3)),
    point: A('s32', entry.point.slice(0, 3)),
    total_point: I('s32', entry.totalPoint),
    result: I('bool', entry.result),
    is_valid: I('bool', entry.isValid),
  }));
  while (ranking.length < 200) {
    ranking.push({
      did: I('s32', 0),
      name: I('str', ''),
      seqmode: A('s32', zeros(3)),
      point: A('s32', zeros(3)),
      total_point: I('s32', 0),
      result: I('bool', false),
      is_valid: I('bool', false),
    });
  }
  await send.object({
    ...renderShopTrial({
      ...trial,
      isValid: configBoolean('shop_trial_enabled', true) && trial.isValid,
    }),
    shoptrial: { data: ranking },
  });
};

function localAttestId(refid: string, kind: number): string {
  const did = didFromRefid(refid);
  const bytes = [
    kind & 0xff,
    (did >>> 24) & 0xff,
    (did >>> 16) & 0xff,
    (did >>> 8) & 0xff,
    did & 0xff,
    (did >>> 12) & 0xff,
    (did >>> 4) & 0xff,
  ];
  return (
    bytes.map(value => value.toString(16).padStart(2, '0')).join('') +
    (Date.now() >>> 0).toString(16).padStart(8, '0')
  ).toUpperCase();
}

export const lobbyRequest: EPR = async (_info, data, send) => {
  const lobby = (data as any).lobbydata
    ? $(data).element('lobbydata')
    : null;
  if (!lobby) {
    await send.object({});
    return;
  }

  const refid = refidFrom(lobby.obj, 'player.refid');
  const ip = lobby.str('address.ip', '');
  const kind = lobby.number('requirement.kind', 0);
  const excludeNode = (lobby.obj as any).exclude
    ? lobby.element('exclude')
    : null;
  const excluded = excludeNode
    ? excludeNode.elements('refid').map(value => value.str('', ''))
    : [];
  const now = Date.now();

  await DB.Remove<LobbyEntry>({
    collection: 'lobby_entry',
    expiresAt: { $lt: now },
  });

  if (!refid || !ip) {
    await send.object({});
    return;
  }

  const candidates = await DB.Find<LobbyEntry>({
    collection: 'lobby_entry',
    expiresAt: { $gte: now },
  });
  const candidate = candidates
    .filter(entry => entry.refid !== refid)
    .filter(entry => !excluded.includes(entry.refid))
    .filter(entry => !(entry.excluded || []).includes(refid))
    .filter(entry => entry.kind === kind || entry.kind === 0 || kind === 0)
    .sort((left, right) => left.updatedAt - right.updatedAt)[0];

  const suppliedAttestId = lobby.str('check.attestid', '');
  const current: LobbyEntry = {
    collection: 'lobby_entry',
    refid,
    ip,
    attestId: suppliedAttestId || localAttestId(refid, kind),
    kind,
    excluded,
    expiresAt: now + 30000,
    updatedAt: now,
  };
  await DB.Upsert<LobbyEntry>(
    { collection: 'lobby_entry', refid },
    { $set: current }
  );

  if (!candidate) {
    await send.object({});
    return;
  }
  await send.object({
    lobbydata: {
      candidate: {
        address: { ip: I('str', candidate.ip) },
        check: { attestid: I('str', candidate.attestId) },
      },
    },
  });
};

export const gametopGetRival: EPR = async (info, data, send) => {
  const player = $(data).element('player');
  const callerRefid = refidFrom(player.obj, 'refid');
  const playerAttr = $(data).attr('player');
  const requestedRival = String(
    playerAttr.rival_id ||
    player.str('rival_id', '') ||
    $(data).str('rival_id', '')
  );

  let targetRefid = callerRefid;
  if (requestedRival && requestedRival !== '0') {
    const profiles = await DB.Find<Profile>(null, { collection: 'profile' });
    const target = profiles.find(profile =>
      profile.__refid === requestedRival ||
      String(profile.did || didFromRefid(profile.__refid || '')) === requestedRival
    );
    if (target && target.__refid) targetRefid = target.__refid;
  }

  const normalized: any = {
    ...data,
    player: {
      ...((data as any).player || {}),
      refid: I('str', targetRefid),
    },
  };
  await gametopGet(info, normalized, send);
};

export const logUnhandled: EPR = async (info, data, send) => {
  console.log(`[unhandled] ${info.module}.${info.method} ${JSON.stringify(data)}`);
  await send.success();
};
