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
  // The fields below this marker used to be shared between the K32 and K33
  // profiles of one card.  They are kept only as the migration source; all
  // reads and writes go through the per-game state in `games`.
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
  // Per-game profile state.  GF (K33) and DM (K32) are separate saves on the
  // original service, so Live Point, play count, unlocks, trophies, customize
  // state and gameend receipts are isolated per gameCode here.
  games: { [gameCode: string]: GameState };
};

type GameState = {
  playCount: number;
  livePoint: number;
  plusLivePoint: number;
  trophyList: number[];
  customItems: number[];
  secretMusic: number[];
  secretChara: number;
  xgPlaystyle: number[];
  style: number;
  style2: number;
  infoState: PlayerInfoState;
  perfect: number;
  great: number;
  good: number;
  poor: number;
  miss: number;
  syogo: number[];
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
  gameendSession: number;
  lastGameendReceipt?: GameendReceipt;
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
  actorName?: string;
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

import {
  chartDifficulty,
  isClassicNewMusic,
  musicMetadata,
} from './music_data';

// libshare-pj passes 11 as the destination capacity for the main player name
// and every Shop Championship representation name. Keep stored legacy values
// untouched, but never put a longer string on the cabinet wire.
const PROFILE_NAME_MAX_LENGTH = 11;
const PROFILE_REFID_PATTERN = /^[0-9A-F]{16}$/;

function profileNameForWire(value: any, fallback = ''): string {
  const text = String(value || fallback).normalize('NFC');
  return Array.from(text).slice(0, PROFILE_NAME_MAX_LENGTH).join('');
}

function webUIRefid(data: any, send?: WebUISend): string | null {
  const refid = String((data && data.refid) || '').trim().toUpperCase();
  if (!PROFILE_REFID_PATTERN.test(refid)) {
    if (send) send.error(400, 'Invalid profile reference ID.');
    return null;
  }
  return refid;
}

function strictWebUIInteger(
  data: any,
  key: string,
  minimum: number,
  maximum: number,
  send?: WebUISend
): number | null {
  const raw = String(data && data[key] !== undefined ? data[key] : '').trim();
  if (!/^-?\d+$/.test(raw)) {
    if (send) send.error(400, `${key} must be an integer.`);
    return null;
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    if (send) {
      send.error(400, `${key} must be between ${minimum} and ${maximum}.`);
    }
    return null;
  }
  return value;
}

function webUICustomSlot(items: number[], index: number, allowBlack = false) {
  const rawValue = clampInteger(items[index], -1, 0x7fffffff);
  const livePointMarker = rawValue === index + 1 ? rawValue : null;
  const validSelection =
    livePointMarker === null &&
    ((rawValue >= 0 && rawValue <= 11) || (allowBlack && rawValue === 98));
  return {
    selection: validSelection ? rawValue : null,
    rawValue,
    livePointMarker,
  };
}

export const changeProfileName = async (data: any, send?: WebUISend) => {
  const refid = webUIRefid(data, send);
  if (!refid) return;

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

export const changeProfileGameSettings = async (
  data: any,
  send?: WebUISend
) => {
  const refid = webUIRefid(data, send);
  if (!refid) return;
  const profile = await DB.FindOne<Profile>(refid, { collection: 'profile' });
  if (!profile) {
    if (send) send.error(404, 'XG2 profile not found.');
    return;
  }

  // lastMode is the only ordinary preference whose complete native enum and
  // protocol round-trip are confirmed.  Raw Custom slots deliberately remain
  // read-only here because they share storage with Live Point markers.
  const lastMode = strictWebUIInteger(data, 'lastMode', 0, 2, send);
  if (lastMode === null) return;
  await DB.Update<Profile>(
    refid,
    { collection: 'profile' },
    { $set: { lastMode, modeEncodingVersion: 2 } }
  );
  const updated = await DB.FindOne<Profile>(refid, { collection: 'profile' });
  if (
    (!updated ||
      updated.lastMode !== lastMode ||
      updated.modeEncodingVersion !== 2) &&
    send
  ) {
    send.error(409, 'Game settings were not updated.');
  }
};

export const changeGroupIcon = async (data: any, send?: WebUISend) => {
  const refid = webUIRefid(data, send);
  if (!refid) return;
  const profile = await DB.FindOne<Profile>(refid, { collection: 'profile' });
  if (!profile) {
    if (send) send.error(404, 'XG2 profile not found.');
    return;
  }

  const groupId = Math.floor(Number(profile.groupId) || 0);
  if (groupId <= 0) {
    if (send) send.error(404, 'This profile is not in a Group.');
    return;
  }
  const group = await DB.FindOne<Group>({ collection: 'group', groupId });
  if (!group) {
    if (send) send.error(404, 'Group not found.');
    return;
  }
  if (String(group.ownerRefid || '').toUpperCase() !== refid) {
    if (send) send.error(403, 'Only the Group owner can change its icon.');
    return;
  }

  const icon = strictWebUIInteger(data, 'icon', 0, 9, send);
  if (icon === null) return;
  await DB.Update<Group>(
    {
      collection: 'group',
      groupId,
      ownerRefid: group.ownerRefid,
    },
    { $set: { icon } }
  );
  const updated = await DB.FindOne<Group>({ collection: 'group', groupId });
  if ((!updated || updated.icon !== icon) && send) {
    send.error(409, 'Group icon was not updated.');
  }
};

const WEBUI_ABILITY_NAMES: { [abilityType: number]: string[] } = {
  // The spelling SWARROW is the original XG2 label documented by the
  // Technical Status screen, rather than a correction to "SWALLOW".
  1: ['SWARROW', 'OWL', 'HAWK'],
  2: ['FOX', 'WOLF', 'LION'],
  3: ['DOLPHIN', 'ORCA', 'WHALE'],
  4: ['UNICORN', 'GRIFFIN', 'DRAGON'],
};

const WEBUI_ABILITY_CATEGORIES: { [abilityType: number]: string } = {
  1: 'PERFECT',
  2: 'MISS',
  3: 'COMBO',
  4: 'BALANCE',
};

function webUIAbility(profile: Profile, gameCode: string) {
  const technical = profileTechnicalStatus(profile, gameCode);
  const names = WEBUI_ABILITY_NAMES[technical.abilityType];
  return {
    type: technical.abilityType,
    level: technical.abilityLevel,
    name: names ? names[technical.abilityLevel] : 'NONE',
    category: WEBUI_ABILITY_CATEGORIES[technical.abilityType] || 'NONE',
  };
}

export const getProfileData = async (data: any, send?: WebUISend) => {
  const refid = webUIRefid(data, send);
  if (!refid || !send) return;
  const profile = await DB.FindOne<Profile>(refid, { collection: 'profile' });
  if (!profile) {
    send.error(404, 'XG2 profile not found.');
    return;
  }

  const scores = (await DB.Find<Score>(
    refid,
    { collection: 'score', schemaVersion: SCORE_SCHEMA_VERSION }
  )) as Score[];
  const groupId = Math.floor(Number(profile.groupId) || 0);
  const group = groupId > 0
    ? await DB.FindOne<Group>({ collection: 'group', groupId })
    : null;
  const lastMode = normalizedProfileLastMode(profile);
  const gameSettings = ['K32', 'K33'].map(gameCode => {
    const state = gameStateOf(profile, gameCode);
    const items = normalizeCustomItems(state.customItems);
    return {
      gameCode,
      playCount: clampU32(state.playCount),
      livePoint: clampS32(state.livePoint),
      plusLivePoint: clampS32(state.plusLivePoint),
      ability: webUIAbility(profile, gameCode),
      custom: {
        shutter: webUICustomSlot(items, 31, true),
        attackEffect: webUICustomSlot(items, 39),
        judgeText: webUICustomSlot(items, 41),
        combo: webUICustomSlot(items, 42),
        notes: webUICustomSlot(items, 46),
      },
    };
  });
  const skills = ['K32', 'K33'].map(gameCode => {
    const relevant = scores.filter(
      score =>
        score.schemaVersion === SCORE_SCHEMA_VERSION &&
        String(score.gameCode || '').toUpperCase() === gameCode
    );
    return {
      gameCode,
      standard: modeSkillBreakdown(relevant, 'standard', gameCode),
      classic: modeSkillBreakdown(relevant, 'classic', gameCode),
    };
  });

  send.json({
    schemaVersion: 2,
    profile: {
      name: String(profile.name || ''),
      lastMode,
      groupId,
    },
    settings: {
      lastMode,
      games: gameSettings,
    },
    group: group
      ? {
          groupId: group.groupId,
          name: String(group.name || ''),
          icon: clampInteger(group.icon, 0, 9),
          memberCount: (group.memberRefids || []).length,
          isOwner: String(group.ownerRefid || '').toUpperCase() === refid,
        }
      : null,
    records: mergeProfileScoreRecords(scores),
    skills,
  });
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
  rankedAt?: number;
  updatedAt: number;
};

type ShopChampionshipEntry = {
  collection: 'shop_championship_entry';
  gameCode: string;
  division: number;
  locationId: string;
  did: number;
  refid: string;
  name: string;
  livePoint: number;
  rankedAt: number;
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
const shopTrialEntryQueues: { [key: string]: Promise<void> } = {};
const shopChampionshipEntryQueues: { [key: string]: Promise<void> } = {};
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
// gameend.xg_item is the 48-entry Live Point reward catalog consumed by the
// Result/Records screen.  Each value is a one-based catalog key: the client
// first matches it against the persisted item[48] milestone markers and then
// indexes its built-in icon type/resource tables with key - 1.  Skin pack
// ownership is a separate path rebuilt from groupdata.item[26].
const LIVE_POINT_REWARD_CATALOG = Array.from(
  { length: CUSTOM_ITEM_COUNT },
  (_value, index) => index + 1
);
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
// Completion goals recovered verbatim from data/product/xml/coop_data.xml.
// The client compares the group_coope total_score of each event against these
// goals to drive the Group Challenge progress display and its reward grant
// path (game.dll sub_10078DD0 -> sub_1011BAA0).
const COOPERATION_GOALS: { [gameCode: string]: { [eventId: number]: number } } = {
  K33: {
    1: 13000, 2: 50, 3: 50, 4: 50, 5: 21097, 16: 10000, 7: 18000, 8: 200,
    9: 30, 10: 2000, 11: 30, 12: 50, 13: 250, 14: 30, 15: 5000, 6: 30000,
    17: 50, 18: 200, 19: 80000, 20: 200, 21: 10000, 22: 50, 23: 1000,
    24: 2000, 25: 15000, 26: 300,
  },
  K32: {
    1: 25000, 2: 50, 3: 50, 4: 50, 5: 42195, 16: 20000, 7: 35000, 8: 200,
    9: 30, 10: 2000, 11: 30, 12: 50, 13: 250, 14: 30, 15: 5000, 6: 50000,
    17: 50, 27: 200, 19: 150000, 20: 200, 21: 20000, 22: 50, 23: 1000,
    24: 2000, 25: 30000, 26: 300,
  },
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

function profilePlusLivePoint(state: GameState): number {
  const limit = xg2PlusLimit();
  if (limit < 0) return -1;
  if (xg2PlusUnlockPolicy() === 'all_unlocked') return limit;
  return Math.max(0, Math.min(limit, state.plusLivePoint || 0));
}

function defaultGameState(): GameState {
  return {
    playCount: 0,
    livePoint: 0,
    plusLivePoint: 0,
    trophyList: negatives(TROPHY_COUNT),
    customItems: zeros(CUSTOM_ITEM_COUNT),
    secretMusic: zeros(32),
    secretChara: 0,
    xgPlaystyle: [2097152, 0].concat(zeros(48)),
    style: 2097152,
    style2: 0,
    infoState: defaultInfoState(),
    perfect: 0,
    great: 0,
    good: 0,
    poor: 0,
    miss: 0,
    syogo: [0, 0],
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
    gameendSession: 0,
  };
}

function gameStateOf(profile: Profile, gameCode: string): GameState {
  const code = gameCode.toUpperCase();
  const stored = profile.games && profile.games[code];
  return stored ? { ...defaultGameState(), ...stored } : defaultGameState();
}

function ensureGameState(profile: Profile, gameCode: string): GameState {
  const code = gameCode.toUpperCase();
  if (!profile.games) profile.games = {};
  if (!profile.games[code]) profile.games[code] = defaultGameState();
  return profile.games[code];
}

// The GROUP feature is cross-game: a group totals the Live Point its members
// earned on either cabinet, and a member node reports the same total.  The
// legacy shared total is included once so a pre-migration profile keeps its
// value until both games have earned their own state.
function profileTotalLivePoint(profile: Profile): number {
  const k33 = profile.games && profile.games.K33;
  const k32 = profile.games && profile.games.K32;
  if (k33 || k32) {
    return gameStateOf(profile, 'K33').livePoint + gameStateOf(profile, 'K32').livePoint;
  }
  return Math.max(0, profile.livePoint || 0);
}

function gameendSessionKey(refid: string, gameCode: string): string {
  return `${refid}:${gameCode.toUpperCase()}`;
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

function shopChampionshipTerm(): number {
  return configInteger('shop_championship_term', 0, 0, 4);
}

function shopChampionshipPhase(): 'active' | 'completed' {
  return configString('shop_championship_phase', 'active') === 'completed'
    ? 'completed'
    : 'active';
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

function shopChampionshipRankerInfoPayload(): any {
  const division = shopChampionshipTerm();
  const state = division > 0
    ? shopChampionshipPhase() === 'completed' ? 3 : 1
    : 0;
  const payload: any = {
    division: I('u8', division),
    // State 1 is the active now_entry phase and is required for game.dll to
    // submit is_shopchamp_play=1. State 3 is the completed Ranker announcement
    // phase; it can grant the gold INFOBOARD only when the matching Shop
    // representation also contains this player's DID.
    state: I('u8', state),
    trialid: I('s8', -1),
  };
  if (state === 1) {
    // K32 libshare-pj.dll sub_1001BDB0 and sub_10016080 both enter a fixed
    // ten-iteration loop when division != 0 and state == 1. Each iteration
    // dereferences a sibling ranking node before reading rank/name/point, and
    // the gameinfo receiver does not stop on a missing node. Keep these rows
    // response-only and neutral; real Shop Championship standings remain in
    // gametop's shop/player championship trees and in the persisted entries.
    payload.ranking = Array.from({ length: 10 }, (_value, index) => ({
      rank: I('u32', index + 1),
      name: I('str', ''),
      point: I('u32', 0),
    }));
    payload.is_another_ranker = I('bool', false);
  }
  return payload;
}

function inactiveShopChampionshipRankerInfoPayload(): any {
  return {
    division: I('u8', 0),
    state: I('u8', 0),
    trialid: I('s8', -1),
  };
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

// 'completed' mirrors the archived all-unlock policy used for skin packs and
// SECRET MUSIC: the group_coope totals are reported at each event's goal so
// the Group Challenge list shows every challenge cleared, which is the state
// the already-granted prizes belong to.  'progression' keeps only the real
// accumulated totals.
function cooperationCompletionArchived(): boolean {
  return configString('cooperation_challenge_completion', 'completed') === 'completed';
}

function cooperationEventIds(gameCode: string): number[] {
  return (COOPERATION_EVENT_IDS[gameCode] || COOPERATION_EVENT_IDS.K33).slice();
}

function groupPrizeRestorationState(
  group: Group | null,
  gameCode: string
): { groupLevel: number; item: number[] } {
  if (!group) {
    return { groupLevel: 0, item: zeros(26) };
  }
  // groupdata.get rebuilds the client's owned-prize cache from these local
  // Cooperation event IDs, and the catalog lookup is gated by group_level.
  // This server already grants the complete archived prize catalog, so expose
  // all 26 events at the catalog's maximum level without changing saved LP or
  // the independently rendered group_coope progression totals.
  return { groupLevel: 13, item: cooperationEventIds(gameCode) };
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

// Live Point milestones are recorded by the client in the shared 48-slot item
// array: crossing milestone m (threshold 2500/3750/5000/7500/8750/11250 and
// then +15000 per eight entries) writes the self-describing marker
// item[m - 1] = m alongside the Custom selection slots.  Real captures show
// uploads such as [1], [1,2], [1,2,3] that grow one credit at a time while a
// boot replays every reached milestone.  A boot that has not replayed them yet
// uploads fewer markers, so a plain overwrite would erase stored milestones
// and resurrect the unlock popup on later card-ins.
function mergeCustomItems(
  previous: number[] | undefined,
  incoming: number[] | undefined
): number[] {
  const stored = normalizeCustomItems(previous);
  const uploaded = incoming && incoming.length > 0
    ? normalizeCustomItems(incoming)
    : null;
  if (!uploaded) return stored;
  return stored.map((value, index) => {
    const marker = index + 1;
    // Never let a stale boot drop an already-recorded milestone marker.
    if (value === marker || uploaded[index] === marker) {
      return marker;
    }
    return uploaded[index];
  });
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
  const normalized = stableReplacer(data);
  const serialized = JSON.stringify(normalized);
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < serialized.length; index++) {
    const code = serialized.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193);
    second = Math.imul(second ^ code, 0x85ebca6b) + index | 0;
  }
  return `${serialized.length}:${(first >>> 0).toString(16)}:${(second >>> 0).toString(16)}`;
}

function stableReplacer(value: any, depth = 0): any {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (depth > 12) return value;

  if (Array.isArray(value)) {
    return value.map(item => stableReplacer(item, depth + 1));
  }

  const filteredEntries = Object.entries(value)
    .filter(([key]) => {
      const normalizedKey = String(key).toLowerCase();
      if (normalizedKey === 'status' || normalizedKey === 'request') return false;
      if (normalizedKey === 'now_time' || normalizedKey === 'nowtime') return false;
      if (normalizedKey === 'cardrefid') return false;
      if (
        normalizedKey === 'time' ||
        normalizedKey === 'date' ||
        normalizedKey.endsWith('_time') ||
        normalizedKey.endsWith('_date')
      ) {
        return false;
      }
      return true;
    })
    .sort((left, right) => (left[0] > right[0] ? 1 : left[0] < right[0] ? -1 : 0));

  const normalized: { [key: string]: any } = {};
  for (const [key, valueToReplace] of filteredEntries) {
    normalized[key] = stableReplacer(valueToReplace, depth + 1);
  }
  return normalized;
}

function emptySkillTotals(): SkillTotals {
  return { xgSkill: 0, xgAllSkill: 0, vSkill: 0, vAllSkill: 0 };
}

function skillStorageKey(gameCode: string, kind: number): string {
  return `${gameCode.toUpperCase()}:${Math.max(0, Math.floor(kind))}`;
}

function normalizedProfileLastMode(profile: Profile): number {
  const raw = Math.floor(Number(profile.lastMode) || 0);
  if (profile.modeEncodingVersion === 2) return clampInteger(raw, 0, 2);
  if (raw === 4) return 2;
  if (raw === 2) return 1;
  return 0;
}

function titleForMusic(musicId: number): string {
  const metadata = musicMetadata(musicId);
  return metadata ? metadata.titleName : `Music ${Math.max(0, Math.floor(musicId))}`;
}

function resolvedScoreDifficulty(score: Score): number {
  const stored = Math.max(0, Math.floor(Number(score.difficulty) || 0));
  if (stored > 0) return stored;
  if (score.playMode !== 'standard' && score.playMode !== 'classic') return 0;
  return chartDifficulty(
    score.musicId,
    score.gameCode,
    score.playMode,
    score.seqMode
  );
}

function modeSkillBreakdown(
  scores: Score[],
  playMode: Score['playMode'],
  gameCode: string
) {
  const perMusic: {
    [musicId: string]: {
      musicId: number;
      point: number;
      seqMode: number;
      achievement: number;
      difficulty: number;
    };
  } = {};
  for (const score of scores) {
    if (score.playMode !== playMode) continue;
    const rawMusicId = Number(score.musicId);
    if (!Number.isFinite(rawMusicId)) continue;
    const musicId = Math.floor(rawMusicId);
    if (musicId < 0) continue;
    const point = clampS32(score.skillPoint);
    const rawSeqMode = Number(score.seqMode);
    const seqMode = Number.isFinite(rawSeqMode)
      ? Math.max(0, Math.floor(rawSeqMode))
      : 0;
    const achievement = normalizeAchievement(score.skillPercent);
    const difficulty = resolvedScoreDifficulty(score);
    const previous = perMusic[String(musicId)];
    if (
      !previous ||
      point > previous.point ||
      (point === previous.point && seqMode < previous.seqMode) ||
      (point === previous.point &&
        seqMode === previous.seqMode &&
        achievement > previous.achievement) ||
      (point === previous.point &&
        seqMode === previous.seqMode &&
        achievement === previous.achievement &&
        difficulty > previous.difficulty)
    ) {
      perMusic[String(musicId)] = {
        musicId,
        point,
        seqMode,
        achievement,
        difficulty,
      };
    }
  }

  const entries = Object.keys(perMusic).map(musicId => {
    const entry = perMusic[musicId];
    const metadata = musicMetadata(entry.musicId);
    return {
      ...entry,
      titleName: titleForMusic(entry.musicId),
      isLong: !!(metadata && metadata.isLong),
      isClassicNew: isClassicNewMusic(entry.musicId, gameCode),
    };
  });
  const descending = (
    left: { musicId: number; point: number },
    right: { musicId: number; point: number }
  ) => right.point - left.point || left.musicId - right.musicId;
  // Standard uses new 25 + old 25, with XG2 songs identified as 1800..1873.
  // Classic uses new 14 + old 36 + LONG 3. Its new pool is the current V8
  // generation from MDB first_classic_ver (K33/GF=18, K32/DM=17), not the XG2
  // ID range. Classic LONG songs are excluded from both normal pools so one
  // song cannot be selected twice. all_point remains every stored song best.
  const newLimit = playMode === 'classic' ? 14 : 25;
  const oldLimit = playMode === 'classic' ? 36 : 25;
  const longLimit = playMode === 'classic' ? 3 : 0;
  const normalEntries = playMode === 'classic'
    ? entries.filter(value => !value.isLong)
    : entries;
  const newSongs = normalEntries
    .filter(value =>
      playMode === 'classic'
        ? value.isClassicNew
        : value.musicId >= 1800 && value.musicId <= 1873
    )
    .sort(descending)
    .map((value, index) => ({
      ...value,
      rank: index + 1,
      selected: index < newLimit,
    }));
  const oldSongs = normalEntries
    .filter(value =>
      playMode === 'classic'
        ? !value.isClassicNew
        : value.musicId < 1800 || value.musicId > 1873
    )
    .sort(descending)
    .map((value, index) => ({
      ...value,
      rank: index + 1,
      selected: index < oldLimit,
    }));
  const longSongs = playMode === 'classic'
    ? entries
        .filter(value => value.isLong)
        .sort(descending)
        .map((value, index) => ({
          ...value,
          rank: index + 1,
          selected: index < longLimit,
        }))
    : [];
  const newSkill = newSongs
    .slice(0, newLimit)
    .reduce((sum, value) => sum + value.point, 0);
  const oldSkill = oldSongs
    .slice(0, oldLimit)
    .reduce((sum, value) => sum + value.point, 0);
  const longSkill = longSongs
    .slice(0, longLimit)
    .reduce((sum, value) => sum + value.point, 0);
  const allSkill = entries.reduce((sum, value) => sum + value.point, 0);
  return {
    playMode,
    displayedSkill: clampS32(newSkill + oldSkill + longSkill),
    allPoint: clampS32(allSkill),
    newPoint: clampS32(newSkill),
    oldPoint: clampS32(oldSkill),
    longPoint: clampS32(longSkill),
    limits: {
      newSongs: newLimit,
      oldSongs: oldLimit,
      longSongs: longLimit,
    },
    newSongs,
    oldSongs,
    longSongs,
  };
}

function modeSkillTotals(
  scores: Score[],
  playMode: Score['playMode'],
  gameCode: string
): [number, number] {
  const breakdown = modeSkillBreakdown(scores, playMode, gameCode);
  return [breakdown.displayedSkill, breakdown.allPoint];
}

function mergeProfileScoreRecords(scores: Score[]) {
  type RecordRow = {
    gameCode: string;
    playMode: 'standard' | 'classic';
    musicId: number;
    titleName: string;
    seqMode: number;
    score: number;
    achievement: number;
    resultRank: number;
    combo: number;
    skillPoint: number;
    clear: number;
    fullCombo: number;
    excellent: number;
    difficulty: number;
    comboRate: number;
    perfectRate: number;
    attempts: number;
    updatedAt: number;
    kinds: number[];
  };
  const merged: { [key: string]: RecordRow } = {};
  for (const score of scores) {
    if (score.schemaVersion !== SCORE_SCHEMA_VERSION) continue;
    const gameCode = String(score.gameCode || '').toUpperCase();
    if (gameCode !== 'K32' && gameCode !== 'K33') continue;
    if (score.playMode !== 'standard' && score.playMode !== 'classic') continue;
    const musicId = Math.floor(Number(score.musicId));
    const seqMode = Math.floor(Number(score.seqMode));
    if (!Number.isFinite(musicId) || musicId < 0) continue;
    const maximumSeqMode = score.playMode === 'classic' ? 9 : 8;
    if (
      !Number.isFinite(seqMode) ||
      seqMode < 1 ||
      seqMode > maximumSeqMode
    ) continue;
    const kind = Math.max(0, Math.floor(Number(score.kind) || 0));
    const key = `${gameCode}:${score.playMode}:${musicId}:${seqMode}`;
    const incoming: RecordRow = {
      gameCode,
      playMode: score.playMode,
      musicId,
      titleName: titleForMusic(musicId),
      seqMode,
      score: clampU32(score.score),
      achievement: normalizeAchievement(score.skillPercent),
      resultRank: normalizeResultRank(score.resultRank),
      combo: clampU32(score.combo),
      skillPoint: clampS32(score.skillPoint),
      clear: Math.max(0, Math.floor(Number(score.clear) || 0)),
      fullCombo: Math.max(0, Math.floor(Number(score.fullCombo) || 0)),
      excellent: Math.max(0, Math.floor(Number(score.excellent) || 0)),
      difficulty: resolvedScoreDifficulty(score),
      comboRate: Math.max(0, Math.floor(Number(score.comboRate) || 0)),
      perfectRate: Math.max(0, Math.floor(Number(score.perfectRate) || 0)),
      attempts: Math.max(1, Math.floor(Number(score.attempts) || 0)),
      updatedAt: Math.max(0, Math.floor(Number(score.updatedAt) || 0)),
      kinds: [kind],
    };
    const previous = merged[key];
    if (!previous) {
      merged[key] = incoming;
      continue;
    }

    previous.score = Math.max(previous.score, incoming.score);
    previous.achievement = Math.max(previous.achievement, incoming.achievement);
    previous.resultRank = Math.max(previous.resultRank, incoming.resultRank);
    previous.combo = Math.max(previous.combo, incoming.combo);
    previous.skillPoint = Math.max(previous.skillPoint, incoming.skillPoint);
    previous.clear = Math.max(previous.clear, incoming.clear);
    previous.fullCombo = Math.max(previous.fullCombo, incoming.fullCombo);
    previous.excellent = Math.max(previous.excellent, incoming.excellent);
    previous.difficulty = Math.max(previous.difficulty, incoming.difficulty);
    previous.comboRate = Math.max(previous.comboRate, incoming.comboRate);
    previous.perfectRate = Math.max(previous.perfectRate, incoming.perfectRate);
    previous.attempts = clampU32(previous.attempts + incoming.attempts);
    previous.updatedAt = Math.max(previous.updatedAt, incoming.updatedAt);
    if (!previous.kinds.includes(kind)) previous.kinds.push(kind);
  }

  const modeOrder: { [mode: string]: number } = { standard: 0, classic: 1 };
  return Object.keys(merged)
    .map(key => ({
      ...merged[key],
      kinds: merged[key].kinds.sort((left, right) => left - right),
    }))
    .sort(
      (left, right) =>
        left.gameCode.localeCompare(right.gameCode) ||
        modeOrder[left.playMode] - modeOrder[right.playMode] ||
        left.musicId - right.musicId ||
        left.seqMode - right.seqMode
    );
}

function calculateSkillTotals(
  scores: Score[],
  gameCode: string,
  _kind: number
): SkillTotals {
  // The upload `kind` marks the credit's stage context (real captures show
  // kind=2 for EXTRA STAGE and kind=4 for CLIMAX STAGE plays of the same
  // chart).  It is not a records partition: bests merge across kinds exactly
  // as they do across duplicate documents.
  const relevant = scores.filter(score =>
    score.schemaVersion === SCORE_SCHEMA_VERSION &&
    score.gameCode === gameCode
  );
  const [xgSkill, xgAllSkill] = modeSkillTotals(relevant, 'standard', gameCode);
  const [vSkill, vAllSkill] = modeSkillTotals(relevant, 'classic', gameCode);
  return { xgSkill, xgAllSkill, vSkill, vAllSkill };
}

function recoverScoreTrophies(
  trophyList: number[] | undefined,
  scores: Score[],
  gameCode: string,
  _kind: number
): number[] {
  const recovered = normalizeTrophyList(trophyList);
  const relevant = scores.filter(score =>
    score.schemaVersion === SCORE_SCHEMA_VERSION &&
    score.gameCode === gameCode
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
  const state = ensureGameState(profile, gameCode);
  if (!refid) return { skills: emptySkillTotals(), trophyList: normalizeTrophyList(state.trophyList) };
  const scores = suppliedScores || await DB.Find<Score>(refid, { collection: 'score' }) as Score[];
  const skills = calculateSkillTotals(scores, gameCode, kind);
  const trophyList = recoverScoreTrophies(state.trophyList, scores, gameCode, kind);
  const key = skillStorageKey(gameCode, kind);
  const skillData = { ...(profile.skillData || {}), [key]: skills };
  if (!sameSkillTotals(profile.skillData && profile.skillData[key], skills) ||
      !sameNumbers(state.trophyList, trophyList)) {
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      { $set: { skillData, games: profile.games } }
    );
  }
  profile.skillData = skillData;
  state.trophyList = trophyList;
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

// Chart-availability bits inside a secret-music sequence mask, recovered from
// game.dll sub_10095B00/sub_100974D0: bit1=BASIC, bit2=ADVANCED, bit3=EXTREME,
// bit4=MASTER.  The runtime grant tiers are 2/6/14/30, so 0x1e is the full
// four-chart grant the client itself hands out on the ENCORE/CLIMAX unlock
// path (sub_1007A400 -> sub_1006F5C0).
const XG_CHART_TIER_FULL_MASK = 0x1e;

// Songs whose xg_diff_list carries a fourth chart slot (MASTER), generated
// from data/product/xml/mdb_xg_aou.xml.  xg_diff_list groups: [1..4]=Guitar,
// [6..9]=Drum, [11..14]=Bass; GF and DM tables happen to be identical here.
const MASTER_CHART_MUSIC: { [gameCode: string]: number[] } = {
  K33: [
    305, 403, 504, 602, 618, 619, 752, 839, 902, 905, 917, 920,
    1004, 1127, 1131, 1213, 1300, 1422, 1436, 1437, 1502, 1506, 1517, 1520,
    1524, 1548, 1600, 1603, 1612, 1613, 1621, 1630, 1649, 1701, 1704, 1705,
    1706, 1711, 1712, 1721, 1722, 1727, 1728, 1729, 1731, 1735, 1741, 1744,
    1745, 1801, 1802, 1805, 1811, 1814, 1823, 1826, 1831, 1838, 1852,
  ],
  K32: [
    305, 403, 504, 602, 618, 619, 752, 839, 902, 905, 917, 920,
    1004, 1127, 1131, 1213, 1300, 1422, 1436, 1437, 1502, 1506, 1517, 1520,
    1524, 1548, 1600, 1603, 1612, 1613, 1621, 1630, 1649, 1701, 1704, 1705,
    1706, 1711, 1712, 1721, 1722, 1727, 1728, 1729, 1731, 1735, 1741, 1744,
    1745, 1801, 1802, 1805, 1811, 1814, 1823, 1826, 1831, 1838, 1852,
  ],
};

function masterChartUnlockPolicy(): string {
  const value = configString('master_chart_unlock_policy', 'all_unlocked');
  return value === 'played' || value === 'off' ? value : 'all_unlocked';
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

function rivalIdPrefix(gameCode: string): string {
  return gameCode === 'K32' ? 'D103000' : 'G103000';
}

function emptyRivalId(gameCode: string): string {
  return `${rivalIdPrefix(gameCode)}0000000`;
}

function rivalIdFromProfile(
  profile: Profile,
  refid: string,
  gameCode: string
): string {
  // Original XG2 IDs use a game-specific seven-character prefix followed by
  // seven decimal digits.  GF and DM assigned independent IDs to the same
  // e-pass, so salt the persistent DID with the game code as well.  Keep zero
  // reserved for the unknown-profile placeholder.
  const did = clampInteger(profile.did || didFromRefid(refid), 1, 0x7fffffff);
  const gameDid = didFromRefid(`${gameCode}:${did}`);
  const suffix = ((gameDid - 1) % 9999999) + 1;
  return `${rivalIdPrefix(gameCode)}${String(suffix).padStart(7, '0')}`;
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
    name: profileNameForWire(name, 'PLAYER'),
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
    games: {},
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
    games: {},
  };
  // One-time split of the legacy shared profile state into per-game saves.
  // The game that actually owns the retained scores keeps the history; the
  // other game starts from a clean state, matching the original service where
  // GF and DM profiles were independent.
  if (!stored.games) {
    const storedScores = refid
      ? ((await DB.Find<Score>(refid, { collection: 'score' })) as Score[])
      : [];
    const k33Plays = storedScores.filter(score => score.gameCode === 'K33').length;
    const k32Plays = storedScores.filter(score => score.gameCode === 'K32').length;
    const owner = k32Plays > k33Plays ? 'K32' : 'K33';
    const legacyState: GameState = {
      playCount: profile.playCount,
      livePoint: profile.livePoint,
      plusLivePoint: profile.plusLivePoint,
      trophyList: normalizeTrophyList(stored.trophyList),
      customItems,
      secretMusic: profile.secretMusic,
      secretChara: profile.secretChara,
      xgPlaystyle: legacyPlaystyle,
      style: profile.style,
      style2: profile.style2,
      infoState: profile.infoState,
      perfect: profile.perfect,
      great: profile.great,
      good: profile.good,
      poor: profile.poor,
      miss: profile.miss,
      syogo: profile.syogo,
      shutter: profile.shutter,
      infoLevel: profile.infoLevel,
      nameDisp: profile.nameDisp,
      auto: profile.auto,
      random: profile.random,
      judgeLogo: profile.judgeLogo,
      skin: profile.skin,
      movie: profile.movie,
      attackEffect: profile.attackEffect,
      layout: profile.layout,
      targetSkill: profile.targetSkill,
      comparison: profile.comparison,
      meterCustom: profile.meterCustom,
      gameendSession: clampS32(stored.gameendSession),
      lastGameendReceipt: stored.lastGameendReceipt,
    };
    profile.games = {
      K33: owner === 'K33' ? legacyState : defaultGameState(),
      K32: owner === 'K32' ? legacyState : defaultGameState(),
    };
  } else {
    profile.games = stored.games;
  }
  if (tutorialMigrationChanged || customItemMigrationChanged || !stored.games) {
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
          games: profile.games,
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
  // K32 game.dll sub_10122C70 maps a Classic MDB secret code N to bit N-1
  // of this mask.  The recovered catalog uses codes through 31; the old
  // 0x0003ffff value stopped at code 18 and left the late V8 GDP songs hidden.
  const vFreeMusic = 0x7fffffff;
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
  // K32 libshare-pj.dll sub_1001BDB0 accumulates this checksum seed in a
  // signed 32-bit int before formatting it with "%d".  The all-unlocked V
  // mask crosses INT_MAX once the XG music IDs are added, so mirror that wrap
  // instead of hashing JavaScript's unbounded positive Number representation.
  const tagSeed = (vFreeMusic + ids.reduce((sum, value) => sum + value, 0)) | 0;
  const tag = crc8(String(tagSeed));
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
      // The first archived XG2 receiver treats AVS's positive property-read
      // success value as failure when it reaches is_another_ranker. Keep this
      // legacy slot inactive and advertise the real lifecycle through the
      // later info_ranker2 slot. Both receivers write the same runtime state,
      // so the second slot remains authoritative without a client patch.
      info_ranker: inactiveShopChampionshipRankerInfoPayload(),
      info_ranker2: shopChampionshipRankerInfoPayload(),
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
  // manager is created.  Keep the containers that the receiver parses
  // unconditionally, plus the completed Shop Championship Ranker notice.
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
      // The late receiver requires both fixed-size arrays even while Trial is
      // disabled.  They are Shop Trial fields, not a native Demo transport.
      musicid: A('s32', negatives(5)),
      grade_border: A('s32', zeros(15)),
    },
    plus: xg2PlusPayload(),
    info: {
      // Match gameinfo: bypass the first receiver's inverted success branch,
      // then let the correctly implemented second slot set the shared state.
      info_ranker: inactiveShopChampionshipRankerInfoPayload(),
      info_ranker2: shopChampionshipRankerInfoPayload(),
      // Once an info tree exists, these two nested nodes are mandatory in the
      // late K32/K33 receiver even though the other info children are optional.
      info_shopchamp: {
        shopchamp: shopChampionshipPayload(),
      },
      info_groupcompe: {
        groupcompetition: groupCompetitionPayload(),
      },
    },
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
      countryjname: I('str', '涓嶆槑'),
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
          configInteger('eapass_valid_days', 180, 1, 999)
        ),
      },
      eacoin: {
        notchamount: I('s32', 0),
        notchcount: I('s32', 0),
        supplylimit: I('s32', 100000),
      },
      url: {
        eapass: I('str', 'http://www.ea-pass.konami.jp'),
        arcadefan: I('str', 'http://www.konami.jp/am/'),
        konaminetdx: I('str', 'http://am.573.jp'),
        konamiid: I('str', 'http://id.konami.net'),
        eagate: I('str', 'http://eagate.573.jp'),
      },
    },
  });
};

export const cardutilCheck: EPR = async (info, data, send) => {
  const card = $(data).element('card');
  const cardNo = String(card.attr().no || '1');
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
    const state = ensureGameState(profile, gameCode);
    const session = nextGameendSession(state.gameendSession);
    state.gameendSession = session;
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      { $set: { games: profile.games } }
    );
    const sessionKey = gameendSessionKey(refid, gameCode);
    playSessions[sessionKey] = session;
    delete gameendReceipts[sessionKey];
    Object.assign(body, {
      name: I('str', profileNameForWire(profile.name)),
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
      { no: cardNo, state: profile ? '2' : '0' },
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

function battleData(state: GameState): any {
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
    perfect: I('u32', state.perfect),
    great: I('u32', state.great),
    good: I('u32', state.good),
    poor: I('u32', state.poor),
    miss: I('u32', state.miss),
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
  const playerNo = String(playerRequest.attr().no || '1');
  const refid = refidFrom(playerRequest.obj, 'refid');
  const storedProfile = await findProfile(refid);
  const profile = storedProfile || defaultProfile();
  const collaboState = refid
    ? await DB.FindOne<CollaboState>({ collection: 'collabo_state', refid })
    : null;
  const requestElement = playerRequest.element('request');
  const requestedKind = requestElement
    ? requestElement.number('kind', 0)
    : 0;
  const gameCode = requestGameCode(info);
  const state = gameStateOf(profile, gameCode);
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
  // The client's request kind selects its viewer page, not a record partition:
  // EXTRA STAGE (kind=2) and CLIMAX STAGE (kind=4) plays of the same chart
  // must still appear in the kind=0 records view, so every kind of this game
  // merges into the response.
  const currentScores = scores.filter(score =>
    score.schemaVersion === SCORE_SCHEMA_VERSION &&
    score.gameCode === gameCode
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
  const championship = await shopChampionshipResponse(
    gameCode,
    refid,
    // An unknown refid receives the ordinary parser-safe default profile, but
    // it must never qualify for active Championship membership.
    storedProfile,
    shop,
    shop ? shop.locationId : profile.shopLocationId || 'LOCAL'
  );
  const originalPlusProgression =
    xg2PlusTerm() > 0 && xg2PlusUnlockPolicy() === 'original_progression';
  const unlockedPlusIds = originalPlusProgression
    ? XG2_PLUS_MUSIC.filter(
        (_musicId, index) => profilePlusLivePoint(state) >= XG2_PLUS_BORDERS[index]
      )
    : XG2_PLUS_MUSIC;
  const masterPolicy = masterChartUnlockPolicy();
  const playedSongIds = masterPolicy === 'played'
    ? new Set(currentScores.map(score => score.musicId))
    : null;
  const masterGranted = (musicId: number): boolean =>
    masterPolicy === 'all_unlocked' ||
    (masterPolicy === 'played' && playedSongIds !== null && playedSongIds.has(musicId));
  // The secret-music table is also the carrier for per-song chart grants:
  // game.dll sub_101239D0 treats every entry as an unlocked-chart mask, and
  // bit4 (0x10) is the MASTER chart.  Grants cover both the archived SECRET
  // MUSIC catalog and the MASTER-capable songs from the local music database.
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
      if (masterGranted(value[0])) {
        sequenceMask |= XG_CHART_TIER_FULL_MASK;
      }
      return [value[0], sequenceMask] as [number, number];
    });
  if (masterPolicy !== 'off') {
    const presentIds = new Set(secretMusic.map(value => value[0]));
    for (const musicId of MASTER_CHART_MUSIC[gameCode] || MASTER_CHART_MUSIC.K33) {
      if (secretMusic.length >= 155) break;
      if (presentIds.has(musicId) || !masterGranted(musicId)) continue;
      secretMusic.push([musicId, XG_CHART_TIER_FULL_MASK]);
    }
  }
  const secretIds = secretMusic.map(value => value[0]).concat(
    negatives(155 - secretMusic.length)
  );
  const secretSequences = secretMusic.map(value => value[1]).concat(
    zeros(155 - secretMusic.length)
  );
  const xgPlaystyle = normalizeNumbers(
    state.xgPlaystyle,
    XG_PLAYSTYLE_COUNT
  );
  const vSecretSum = state.secretMusic.reduce(
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
    name: I('str', profileNameForWire(profile.name)),
    emblem: A('u8', [profile.chara, technical.abilityType, technical.abilityLevel]),
    xg_skill: I('s32', progress.skills.xgSkill),
    xg_all_skill: I('s32', progress.skills.xgAllSkill),
    v_skill: I('s32', progress.skills.vSkill),
    v_all_skill: I('s32', progress.skills.vAllSkill),
    live_point: I('s32', state.livePoint),
    plus_live_point: I('s32', profilePlusLivePoint(state)),
    my_rival_id: I(
      'str',
      storedProfile
        ? rivalIdFromProfile(storedProfile, refid, gameCode)
        : emptyRivalId(gameCode)
    ),
    play_cnt: I('u32', state.playCount),
    mode: I('u8', profile.lastMode),
    xg_favorite_music: A('s32', negatives(20)),
    xg_favorite_music_2: A('s32', negatives(20)),
    xg_favorite_music_3: A('s32', negatives(20)),
    xg_secret_music_id: A('s32', secretIds),
    xg_secret_music_seq: A('u16', secretSequences),
    v_favorite_music: A('s32', negatives(20)),
    v_favorite_music_2: A('s32', negatives(20)),
    v_favorite_music_3: A('s32', negatives(20)),
    v_secret_music: A('u16', state.secretMusic),
    xg_playstyle: A('s32', xgPlaystyle),
    info_level: I('u8', state.infoLevel),
    trophy_list: A('s32', progress.trophyList),
    rival_id_1: I('str', ''),
    rival_id_2: I('str', ''),
    rival_id_3: I('str', ''),
    mtime: I('str', protocolTime()),
    group_withdrawal_state: I('s32', 0),
    item: A('s32', normalizeCustomItems(state.customItems)),
    myshop: {
      locationid: I('str', shop ? shop.locationId : ''),
      shopname: I('str', shop ? shop.name : ''),
    },
    jubeat_collabo: {
      gfdm_j: I('bool', Boolean(collaboState && collaboState.gfdmRegistered)),
      j_gfdm: I('bool', Boolean(collaboState && collaboState.jubeatConfirmed)),
      save_state: I('s32', Number(collaboState ? collaboState.saveState || 0 : 0)),
    },
    syogo_list: A('s16', negatives(200)),
    badge_list: A('s16', negatives(200)),
    favorite_music: A('s16', negatives(20)),
    favorite_music_2: A('s16', negatives(20)),
    favorite_music_3: A('s16', negatives(20)),
    secret_music: A('u16', state.secretMusic),
    style: I('u32', state.style),
    style_2: I('u32', state.style2),
    shutter_list: I('u32', 0),
    judge_logo_list: I('u32', 0),
    skin_list: I('u32', 0),
    movie_list: I('u32', 0),
    attack_effect_list: I('u32', 0),
    idle_screen: I('u32', 0),
    chance_point: I('s32', 0),
    failed_cnt: I('s32', 0),
    secret_chara: I('u32', state.secretChara),
    mode_beginner: I('u16', 0),
    mode_standard: I('u16', 0),
    mode_battle_global: I('u16', 0),
    mode_battle_local: I('u16', 0),
    mode_quest: I('u16', 0),
    v3_skill: I('s32', -1),
    v4_skill: I('s32', -1),
    old_ver_skill: I('s32', -1),
    customize: {
      shutter: I('u8', state.shutter),
      info_level: I('u8', state.infoLevel),
      name_disp: I('u8', state.nameDisp),
      auto: I('u8', state.auto),
      random: I('u8', state.random),
      judge_logo: I('u32', state.judgeLogo),
      skin: I('u32', state.skin),
      movie: I('u32', state.movie),
      attack_effect: I('u32', state.attackEffect),
      layout: I('u8', state.layout),
      target_skill: I('u8', state.targetSkill),
      comparison: I('u8', state.comparison),
      meter_custom: A('u8', state.meterCustom),
    },
    tag: I('u8', tag),
    battledata: battleData(state),
    battle_aniv: {
      get: {
        category_ver: A('u16', zeros(11)),
        category_genre: A('u16', zeros(11)),
      },
    },
    info: {
      mode: I('u32', state.infoState.mode),
      boss: I('u32', state.infoState.boss),
      add_music: I('u32', state.infoState.addMusic),
      free_music: I('u32', state.infoState.freeMusic),
      free_seq: I('u32', state.infoState.freeSeq),
      indies: I('u32', state.infoState.indies),
      jukebox: I('u32', state.infoState.jukebox),
      trial: I('u32', state.infoState.trial),
      topranker: I('u32', state.infoState.topRanker),
      log: I('u32', state.infoState.log),
      coope_challenge: I(
        'u32',
        cooperationChallengeEnabled()
          ? profile.groupId
            ? Math.max(1, state.infoState.coopeChallenge)
            : state.infoState.coopeChallenge
          : 0
      ),
      custom_challenge: I('u32', state.infoState.customChallenge),
      group_compe: I('u32', state.infoState.groupCompe),
      group_trial: I('u32', state.infoState.groupTrial),
      group: I('u32', state.infoState.group),
      shopchamp: I('u32', state.infoState.shopChamp),
      group_lv: I('u32', state.infoState.groupLevel),
      live_point: I('u32', state.livePoint),
      texture: I('u32', state.infoState.texture),
      groupmember_recruitment: I(
        'u32',
        state.infoState.groupmemberRecruitment
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
    // libshare-pj sub_1001DEB0 resolves both Championship trees relative to
    // the gametop <player> node.  Keeping them at the module root produces a
    // valid-looking wire response that the native receiver cannot find, so
    // game.dll never establishes the active runtime used by gameend.
    shop_shopchampionship: championship.shopShopChampionship,
    player_shopchampionship: championship.playerShopChampionship,
  };
  await send.object({
    player: K.ATTR({ no: playerNo }, player),
  });
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

const gameendRegistPlayer = async (
  requestInfo: any,
  data: any,
  player: any,
  requestTime: number
): Promise<{ card: string; no: string; body: any }> => {
  const playerInfoElement = player.element('playerinfo');
  const playerInfo = $(playerInfoElement ? playerInfoElement.obj : {});
  const refid = refidFrom(playerInfo.obj, 'refid');
  const gameCode = requestGameCode(requestInfo);
  const storedProfile = refid ? await findProfile(refid) : null;
  const existing = storedProfile || defaultProfile();
  // GF (K33) and DM (K32) are separate saves: every profile-level gameend
  // field, receipt and play count belongs to the requesting game's state.
  const state = ensureGameState(existing, gameCode);
  // A two-player cabinet sends both profiles in one module request.  Receipt
  // identity must nevertheless follow the individual player: changing P2's
  // payload on a retry may not make an unchanged P1 award count twice.
  const requestFingerprint = compactRequestFingerprint({
    ...data,
    player: player.obj,
  });
  const sessionKey = gameendSessionKey(refid, gameCode);
  const playSession = refid
    ? playSessions[sessionKey] || clampS32(state.gameendSession)
    : 0;
  const previousReceipt = refid
    ? gameendReceipts[sessionKey] || state.lastGameendReceipt
    : undefined;
  const isDuplicate = !!(
    previousReceipt &&
    previousReceipt.session === playSession &&
    previousReceipt.fingerprint === requestFingerprint
  );
  const responsePlayCount = isDuplicate
    ? previousReceipt!.playCount
    : state.playCount + 1;
  const responseNowTime = isDuplicate
    ? previousReceipt!.nowTime
    : new Date(requestTime).toISOString();
  const customizeElement = playerInfo.element('customize');
  const customize = $(customizeElement ? customizeElement.obj : {});
  const incomingCustomItems = playerInfo.numbers('item', []);
  const savedCustomItems = mergeCustomItems(state.customItems, incomingCustomItems);
  const playstyles = playerInfo.numbers('playstyles', []);
  const infoElement = playerInfo.element('info');
  const info = $(infoElement ? infoElement.obj : {});
  const playMode = requestPlayMode(data);
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
    playerInfo.number('live_point', state.livePoint)
  );
  const earnedLivePoint = Math.max(0, playerInfo.number('get_live_point', 0));
  // Real K33 captures show that live_point normally already includes this
  // credit's get_live_point award (403 + 2200 -> 2603, 2603 + 300 -> 2903,
  // 2903 + 1200 -> 4103).  Do not blindly add both fields.  When a cabinet
  // uploads a stale/base live_point, existing + get_live_point is a safe
  // fallback; taking the maximum supports both forms without regression.
  const savedLivePoint = isDuplicate
    ? state.livePoint
    : clampS32(
        incomingLivePoint >= state.livePoint
          ? incomingLivePoint
          : Math.max(state.livePoint, state.livePoint + earnedLivePoint)
      );
  const incomingTrophyList = playerInfo.numbers('trophy_list', []);
  const savedTrophyList = mergeTrophyList(state.trophyList, incomingTrophyList);
  const plusLimit = xg2PlusLimit();
  const incomingPlusLivePoint = playerInfo.number(
    'plus_live_point',
    state.plusLivePoint
  );
  const savedPlusLivePoint = plusLimit < 0
    ? state.plusLivePoint
    : xg2PlusUnlockPolicy() === 'all_unlocked'
      ? plusLimit
      : Math.max(
          state.plusLivePoint,
          Math.max(0, Math.min(plusLimit, incomingPlusLivePoint))
        );
  const infoState: PlayerInfoState = {
    mode: info.number('mode', state.infoState.mode),
    boss: info.number('boss', state.infoState.boss),
    addMusic: info.number('add_music', state.infoState.addMusic),
    freeMusic: info.number('free_music', state.infoState.freeMusic),
    freeSeq: info.number('free_seq', state.infoState.freeSeq),
    indies: info.number('indies', state.infoState.indies),
    jukebox: info.number('jukebox', state.infoState.jukebox),
    trial: info.number('trial', state.infoState.trial),
    topRanker: info.number('topranker', state.infoState.topRanker),
    // The Community Log introduction is one-shot state.  Older cabinets can
    // upload a stale zero after it has completed, which must not replay the
    // tutorial or revoke its X-Plan reward.
    log: Math.max(state.infoState.log, info.number('log', state.infoState.log)),
    coopeChallenge: cooperationChallengeEnabled()
      ? existing.groupId
        ? Math.max(1, info.number('coope_challenge', state.infoState.coopeChallenge))
        : info.number('coope_challenge', state.infoState.coopeChallenge)
      : 0,
    customChallenge: info.number(
      'custom_challenge',
      state.infoState.customChallenge
    ),
    groupCompe: info.number('group_compe', state.infoState.groupCompe),
    groupTrial: info.number('group_trial', state.infoState.groupTrial),
    group: info.number('group', state.infoState.group),
    shopChamp: info.number('shopchamp', state.infoState.shopChamp),
    groupLevel: info.number('group_lv', state.infoState.groupLevel),
    livePoint: savedLivePoint,
    texture: info.number('texture', state.infoState.texture),
    groupmemberRecruitment: info.number(
      'groupmember_recruitment',
      state.infoState.groupmemberRecruitment
    ),
  };
  const savedPlaystyle = playstyles.length > 0
    ? normalizeNumbers(playstyles, XG_PLAYSTYLE_COUNT)
    : normalizeNumbers(state.xgPlaystyle, XG_PLAYSTYLE_COUNT);
  savedPlaystyle[16] = Math.max(
    state.xgPlaystyle[16] || 0,
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
  const updatedState: GameState = {
    ...state,
    // Keep the in-memory response profile identical to persisted state for a
    // duplicate.  hydrateProfileProgress can legitimately write recovered
    // Skill/Trophy data afterwards; an incremented temporary playCount would
    // otherwise leak through that independent write even though the main
    // receipt Upsert is correctly skipped.
    playCount: isDuplicate ? state.playCount : state.playCount + 1,
    livePoint: savedLivePoint,
    plusLivePoint: savedPlusLivePoint,
    trophyList: savedTrophyList,
    customItems: savedCustomItems,
    xgPlaystyle: savedPlaystyle,
    infoState,
    style: playerInfo.number('styles', playerInfo.number('style', state.style)),
    style2: playerInfo.number(
      'styles_2',
      playerInfo.number('style_2', state.style2)
    ),
    secretMusic: playerInfo.numbers(
      'v_secret_music',
      playerInfo.numbers('secret_music', state.secretMusic)
    ),
    secretChara: playerInfo.number('secret_chara', state.secretChara),
    syogo: playerInfo.numbers('syogo', state.syogo),
    perfect: playerInfo.number('perfect', state.perfect),
    great: playerInfo.number('great', state.great),
    good: playerInfo.number('good', state.good),
    poor: playerInfo.number('poor', state.poor),
    miss: playerInfo.number('miss', state.miss),
    shutter: customize.number('shutter', state.shutter),
    infoLevel: playerInfo.number(
      'info_level',
      customize.number('info_level', state.infoLevel)
    ),
    nameDisp: customize.number('name_disp', state.nameDisp),
    auto: customize.number('auto', state.auto),
    random: customize.number('random', state.random),
    judgeLogo: customize.number('judge_logo', state.judgeLogo),
    skin: customize.number('skin', state.skin),
    movie: customize.number('movie', state.movie),
    attackEffect: customize.number('attack_effect', state.attackEffect),
    layout: customize.number('layout', state.layout),
    targetSkill: customize.number('target_skill', state.targetSkill),
    comparison: customize.number('comparison', state.comparison),
    meterCustom: customize.numbers('meter_custom', state.meterCustom),
    gameendSession: playSession,
    lastGameendReceipt: isDuplicate
      ? state.lastGameendReceipt
      : {
          session: playSession,
          fingerprint: requestFingerprint,
          processedAt: requestTime,
          playCount: responsePlayCount,
          nowTime: responseNowTime,
        },
  };
  const update: Partial<Profile> = {
    lastMode: modeNumber(playMode, existing.lastMode),
    modeEncodingVersion: 2,
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
    technicalStatus: savedTechnicalStatus,
    chara: incomingEmblem.length > 0
      ? clampInteger(incomingEmblem[0], 0, 0xff)
      : existing.chara,
    games: { ...existing.games, [gameCode]: updatedState },
  };
  // A gameend is never a profile-registration endpoint.  In addition to
  // rejecting a forged Championship on its first request, keep the generic
  // profile receipt from creating that refid and making a changed retry look
  // registered on the next request.
  if (storedProfile && refid && !isDuplicate) {
    const shopChampionshipResult = (playerInfo.obj as any).shopchamp;
    if (
      storedProfile &&
      playerInfo.bool('is_shopchamp_play') &&
      shopChampionshipResult
    ) {
      // The native cabinet submits an absolute per-term Championship
      // live_point here.  Persist the highest value before the profile receipt
      // so a partial failure remains safely retryable.
      await upsertShopChampionshipEntry(shopChampionshipResult, {
        gameCode,
        refid,
        profile: existing,
      });
    }
    const shopTrialResult = (playerInfo.obj as any).shoptrial;
    if (shopTrialResult) {
      // The real cabinet submits Shop Trial scores inside gameend/playerinfo.
      // The outer is_trial_play/is_shopchamp_play flags and the nested result
      // flag stay false in captured valid submissions, so is_valid plus the
      // complete keyed result is the only reliable persistence gate.
      await upsertShopTrialEntry(shopTrialResult, {
        refid,
        profile: existing,
        requireValid: true,
      });
    }
    await DB.Upsert<Profile>(
      refid,
      { collection: 'profile' },
      { $set: update }
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
  } as Profile;
  const progress = await hydrateProfileProgress(
    refid,
    responseProfile,
    gameCode,
    responseKind,
    savedScores
  );

  if (refid && !isDuplicate) {
    gameendReceipts[sessionKey] = updatedState.lastGameendReceipt!;
  }

  const responseEmblem = [
    update.chara === undefined ? existing.chara : update.chara,
    savedTechnical.abilityType,
    savedTechnical.abilityLevel,
  ];
  const responsePlayer: any = {
    event_mode: I('u8', 0),
    trophy_list: A('s32', progress.trophyList),
    emblem: A('u8', responseEmblem),
    xg_item: A('s32', LIVE_POINT_REWARD_CATALOG),
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
    judge_perfect: I('u32', updatedState.perfect || 0),
    is_v5_goodplayer: I('u8', 0),
    max_clear_difficulty: I('s8', 0),
    max_fullcombo_difficulty: I('s8', 0),
    max_excellent_difficulty: I('s8', 0),
    rival_data: {},
    battledata: battleData(updatedState),
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
  const playerAttributes = player.attr();
  return {
    card: String(playerAttributes.card || 'use'),
    no: String(playerAttributes.no || '1'),
    body: responsePlayer,
  };
};

export const gameendRegist: EPR = async (requestInfo, data, send) => {
  const requestTime = Date.now();
  const responsePlayers: any[] = [];

  // Real local two-player play produces sibling <player no="1"> and
  // <player no="2"> nodes.  Process them sequentially so shared Group and
  // Championship aggregates see the first committed profile before applying
  // the second one, and return one response node for every cabinet slot.
  for (const player of $(data).elements('player')) {
    const response = await gameendRegistPlayer(
      requestInfo,
      data,
      player,
      requestTime
    );
    responsePlayers.push(
      K.ATTR({ card: response.card, no: response.no }, response.body)
    );
  }

  const mode = $(data).attr('gamemode').mode || '0';
  await send.object({
    gamemode: K.ATTR({ mode: String(mode) }),
    player: responsePlayers,
  });
};

export const simpleSuccess: EPR = async (_info, _data, send) => {
  await send.success();
};

function groupLogParamForWire(saved?: GroupLog): string {
  if (!saved) return '';
  const stored = String(saved.param || '').slice(0, 128);
  // group_data.xml log IDs 1 and 2 both start with %name.  K32's
  // sub_1011E1A0 replaces that token from the first comma-separated param;
  // DID/member lookup is only used for the surrounding activity metadata.
  // Older local records kept the actor snapshot separately and left param
  // empty, which made the client treat an invalid pointer as the name text.
  if (saved.logId === 1 || saved.logId === 2) {
    return profileNameForWire(saved.actorName || stored, 'PLAYER');
  }
  return stored;
}

const groupLogNode = (saved?: GroupLog) =>
  K.ATTR(
    { index: String(saved ? saved.index : 0) },
    {
      did: I('s32', saved ? saved.did : 0),
      logid: I('s32', saved ? saved.logId : 0),
      param: I('str', groupLogParamForWire(saved)),
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
    {
      did: String((profile && profile.did) || (refid ? didFromRefid(refid) : 0)),
    },
    {
      name: I(
        'str',
        profileNameForWire(profile ? profile.name : '', refid ? 'PLAYER' : '')
      ),
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
    {
      did: String((profile && profile.did) || (refid ? didFromRefid(refid) : 0)),
    },
    {
      name: I(
        'str',
        profileNameForWire(profile ? profile.name : '', refid ? 'PLAYER' : '')
      ),
      skill: I('s32', skill),
      live_point: I('s32', profile ? profileTotalLivePoint(profile) : 0),
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
    const actorName = profileNameForWire(raw.actorName);
    byIndex[String(index)] = {
      index,
      did: Math.floor(Number(raw.did) || 0),
      logId,
      ...(actorName ? { actorName } : {}),
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
  const goals = COOPERATION_GOALS[gameCode] || COOPERATION_GOALS.K33;
  const completed = cooperationChallengeEnabled() && cooperationCompletionArchived();
  // Once group_coope is present the game no longer falls back to its local
  // table, so return the complete 26-entry catalog in the original XML order.
  return cooperationEventIds(gameCode).map(eventId => {
    const state = saved.find(value => value.eventId === eventId);
    const goal = goals[eventId] || 0;
    const totalScore = completed && goal > 0
      ? Math.max(clampU32(state ? state.totalScore : 0), goal)
      : clampU32(state ? state.totalScore : 0);
    return K.ATTR(
      { eventid: String(eventId) },
      {
        total_score: I('u32', totalScore),
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
  const prizeRestoration = groupPrizeRestorationState(group, gameCode);
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
      group_level: I('s32', prizeRestoration.groupLevel),
      live_point: I('s32', (group && group.livePoint) || 0),
      limit_live_point: I('s32', group && livePointTerm() > 0 ? 389999 : 0),
      lower_live_point: I('s32', 0),
      secret_music_id: A('s32', negatives(5)),
      secret_music_seq: A('s32', zeros(5)),
      reward_music_id: A('s32', negatives(20)),
      reward_music_seq: A('s32', zeros(20)),
      item: A('s32', prizeRestoration.item),
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
      (sum, profile) => sum + (profile ? profileTotalLivePoint(profile) : 0),
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
    const joiningProfile = await findProfile(refid);
    const joiningActorName = profileNameForWire(
      joiningProfile ? joiningProfile.name : '',
      'PLAYER'
    );
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
      actorName: joiningActorName,
      param: joiningActorName,
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
            ...(joiningProfile || defaultProfile()).infoState,
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
    const creatorActorName = profileNameForWire(
      profile ? profile.name : '',
      'PLAYER'
    );
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
        actorName: creatorActorName,
        param: creatorActorName,
        ctime: strictProtocolTime(),
      }],
      eventLogs: [],
      cooperationScores: [],
    });
  }
  if (profile) {
    const joinState = ensureGameState(profile, requestGameCode(info));
    joinState.infoState = {
      ...joinState.infoState,
      coopeChallenge: cooperationChallengeEnabled() ? 1 : 0,
    };
    await DB.Update<Profile>(
      refid,
      { collection: 'profile' },
      {
        $set: {
          groupId: group.groupId,
          games: profile.games,
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

async function withShopChampionshipEntryLock(
  key: string,
  action: () => Promise<ShopChampionshipEntry>
): Promise<ShopChampionshipEntry> {
  const previous = shopChampionshipEntryQueues[key] || Promise.resolve();
  let release = () => {};
  const gate = new Promise<void>(resolve => { release = resolve; });
  const tail = previous.then(() => gate, () => gate);
  shopChampionshipEntryQueues[key] = tail;
  try {
    await previous.catch(() => undefined);
    return await action();
  } finally {
    release();
    if (shopChampionshipEntryQueues[key] === tail) {
      delete shopChampionshipEntryQueues[key];
    }
  }
}

function shopChampionshipEntryRankedAt(entry: ShopChampionshipEntry): number {
  const direct = Number(entry.rankedAt || entry.updatedAt || 0);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const parsed = Date.parse(String((entry as any).updatedAt || ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

async function upsertShopChampionshipEntry(
  raw: any,
  context: { gameCode: string; refid: string; profile: Profile }
): Promise<ShopChampionshipEntry | null> {
  if (!raw || !context.refid) return null;
  if (context.gameCode !== 'K32' && context.gameCode !== 'K33') return null;
  // Completed Ranker mode is read-only. Native active clients cannot produce
  // a valid submission there, and forged late uploads must not alter results.
  if (shopChampionshipPhase() !== 'active') return null;
  const entry = $(raw);
  const termText = String(entry.attr().term || '').trim();
  if (!/^[1-4]$/.test(termText)) return null;
  const division = Number(termText);
  // Only the advertised division may accept a score.  This rejects a forged
  // historical/future term without preventing a retry for the current event.
  if (division !== shopChampionshipTerm()) return null;

  const locationId = entry.str('locationid', '').trim();
  if (
    !locationId ||
    Array.from(locationId).length > 8 ||
    /[\u0000-\u001F\u007F<>&]/.test(locationId)
  ) return null;
  const registeredShop = await DB.FindOne<Shop>({
    collection: 'shop',
    locationId,
  });
  if (!registeredShop) return null;

  const livePoint = entry.number('live_point', -1);
  if (
    !Number.isFinite(livePoint) ||
    Math.floor(livePoint) !== livePoint ||
    livePoint < 0 ||
    livePoint > 0x7fffffff
  ) return null;
  const did = context.profile.did || didFromRefid(context.refid);
  if (!Number.isSafeInteger(did) || did <= 0 || did > 0x7fffffff) return null;

  const incoming: ShopChampionshipEntry = {
    collection: 'shop_championship_entry',
    gameCode: context.gameCode,
    division,
    locationId,
    did,
    refid: context.refid,
    name: profileNameForWire(context.profile.name, 'PLAYER'),
    livePoint,
    rankedAt: Date.now(),
    updatedAt: Date.now(),
  };
  const query = {
    collection: 'shop_championship_entry' as const,
    gameCode: context.gameCode,
    division,
    did,
  };
  return withShopChampionshipEntryLock(
    `${context.gameCode}:${division}:${did}`,
    async () => {
      const previous = await DB.FindOne<ShopChampionshipEntry>(query);
      const saved: ShopChampionshipEntry = previous && previous.livePoint >= livePoint
        ? {
            collection: 'shop_championship_entry',
            gameCode: context.gameCode,
            division,
            locationId: previous.locationId || locationId,
            did,
            refid: context.refid || previous.refid || '',
            name: incoming.name || previous.name || 'PLAYER',
            livePoint: clampS32(previous.livePoint),
            rankedAt: shopChampionshipEntryRankedAt(previous) || incoming.rankedAt,
            updatedAt: previous.updatedAt || incoming.updatedAt,
          }
        : incoming;
      // Do not spread a DB document into $set: NeDB adds an immutable _id.
      await DB.Upsert<ShopChampionshipEntry>(query, { $set: saved });
      return saved;
    }
  );
}

async function shopChampionshipResponse(
  gameCode: string,
  refid: string,
  profile: Profile | null,
  requestedShop: Shop | null,
  fallbackLocationId = 'LOCAL'
): Promise<{
  isValid: boolean;
  shopShopChampionship: any;
  playerShopChampionship: any;
}> {
  const division = shopChampionshipTerm();
  const stored = division > 0
    ? await DB.Find<ShopChampionshipEntry>({
        collection: 'shop_championship_entry',
        gameCode,
        division,
      })
    : [];

  // Upsert is serialized per DID, but also collapse any pre-existing/racing
  // duplicate documents deterministically while rendering the wire response.
  const byDid: { [did: string]: ShopChampionshipEntry } = {};
  for (const value of stored) {
    const livePoint = Number(value.livePoint);
    const did = Number(value.did);
    const locationId = String(value.locationId || '').trim();
    if (
      value.gameCode !== gameCode ||
      value.division !== division ||
      !Number.isSafeInteger(did) ||
      did <= 0 ||
      did > 0x7fffffff ||
      !Number.isSafeInteger(livePoint) ||
      livePoint < 0 ||
      livePoint > 0x7fffffff ||
      !locationId ||
      Array.from(locationId).length > 8
    ) continue;
    const normalized: ShopChampionshipEntry = {
      collection: 'shop_championship_entry',
      gameCode,
      division,
      locationId,
      did,
      refid: String(value.refid || ''),
      name: profileNameForWire(value.name, 'PLAYER'),
      livePoint,
      rankedAt: shopChampionshipEntryRankedAt(value),
      updatedAt: Number(value.updatedAt || 0),
    };
    const previous = byDid[String(did)];
    if (
      !previous ||
      normalized.livePoint > previous.livePoint ||
      (normalized.livePoint === previous.livePoint &&
        normalized.rankedAt < previous.rankedAt)
    ) byDid[String(did)] = normalized;
  }
  let entries = Object.keys(byDid).map(key => byDid[key]);
  const playerDid = profile && profile.did
    ? profile.did
    : refid
      ? didFromRefid(refid)
      : 0;

  // K32 game.dll sub_10124000 loads an active now_entry, then
  // sub_10124840 inserts the current DID locally when representation is empty.
  // With a server response of rank=0/nr=0 that produces a contradictory local
  // rank-0 participant while sub_10124910 raises only the participant count.
  // Seed a registered player as a zero-point rank-1 member on an entirely
  // empty active board so all three values are coherent. This row exists only
  // in the response; a native gameend must still pass the normal validation
  // before any Championship entry is persisted.
  if (
    division > 0 &&
    shopChampionshipPhase() === 'active' &&
    entries.length === 0 &&
    profile &&
    requestedShop &&
    Number.isSafeInteger(playerDid) &&
    playerDid > 0 &&
    playerDid <= 0x7fffffff
  ) {
    const bootstrapLocationId = String(requestedShop.locationId || '').trim();
    if (
      bootstrapLocationId &&
      Array.from(bootstrapLocationId).length <= 8 &&
      !/[\u0000-\u001F\u007F<>&]/.test(bootstrapLocationId)
    ) {
      entries = [{
        collection: 'shop_championship_entry',
        gameCode,
        division,
        locationId: bootstrapLocationId,
        did: playerDid,
        refid,
        name: profileNameForWire(profile.name, 'PLAYER'),
        livePoint: 0,
        rankedAt: 0,
        updatedAt: 0,
      }];
    }
  }
  const playerEntry = entries.find(value => value.did === playerDid) || null;

  const playersByLocation: { [locationId: string]: ShopChampionshipEntry[] } = {};
  for (const entry of entries) {
    (playersByLocation[entry.locationId] || (playersByLocation[entry.locationId] = []))
      .push(entry);
  }
  const playerOrdering = (
    left: ShopChampionshipEntry,
    right: ShopChampionshipEntry
  ) =>
    right.livePoint - left.livePoint ||
    shopChampionshipEntryRankedAt(left) - shopChampionshipEntryRankedAt(right) ||
    left.did - right.did;
  for (const locationId of Object.keys(playersByLocation)) {
    playersByLocation[locationId].sort(playerOrdering);
  }

  const shops = await DB.Find<Shop>({ collection: 'shop' });
  const shopNames: { [locationId: string]: string } = {};
  for (const shop of shops) shopNames[shop.locationId] = shop.name;
  const standings = Object.keys(playersByLocation).map(locationId => ({
    locationId,
    shopName: String(shopNames[locationId] || 'LOCAL SHOP').slice(0, 25),
    livePoint: playersByLocation[locationId].reduce(
      (sum, entry) => clampS32(sum + entry.livePoint),
      0
    ),
    players: playersByLocation[locationId],
  }));
  standings.sort(
    (left, right) =>
      right.livePoint - left.livePoint ||
      left.locationId.localeCompare(right.locationId)
  );

  const requestedLocationId = String(
    (playerEntry && playerEntry.locationId) ||
    (requestedShop && requestedShop.locationId) ||
    fallbackLocationId ||
    'LOCAL'
  ).slice(0, 8);
  const standingIndex = standings.findIndex(
    value => value.locationId === requestedLocationId
  );
  const standing = standingIndex >= 0
    ? standings[standingIndex]
    : {
        locationId: requestedLocationId,
        shopName: String(
          (requestedShop && requestedShop.name) ||
          shopNames[requestedLocationId] ||
          'LOCAL SHOP'
        ).slice(0, 25),
        livePoint: 0,
        players: [] as ShopChampionshipEntry[],
      };
  const playerIndex = standing.players.findIndex(value => value.did === playerDid);

  const shopRecord = () => K.ATTR(
    { division: String(division) },
    {
      locationid: I('str', standing.locationId),
      shopname: I('str', standing.shopName),
      live_point: I('s32', standing.livePoint),
      rank: I('u32', standingIndex >= 0 ? standingIndex + 1 : 0),
      nr: I('u32', standings.length),
      representation: {
        data: standing.players.slice(0, 10).map((entry, index) =>
          K.ATTR(
            { rank: String(index + 1) },
            {
              did: I('s32', entry.did),
              name: I('str', entry.name),
              point: I('s32', entry.livePoint),
            }
          )
        ),
      },
    }
  );
  const playerRecord = () => K.ATTR(
    { division: String(division) },
    {
      locationid: I('str', standing.locationId),
      shopname: I('str', standing.shopName),
      live_point: I('s32', playerIndex >= 0 ? standing.players[playerIndex].livePoint : 0),
      rank: I('u32', playerIndex >= 0 ? playerIndex + 1 : 0),
      nr: I('u32', standing.players.length),
    }
  );

  const phase = shopChampionshipPhase();
  const completedShopRecords = division > 0 && phase === 'completed'
    ? {
        history: { shopchamp: shopRecord() },
        result: { shopchamp: shopRecord() },
      }
    : {};
  const completedPlayerRecords = division > 0 && phase === 'completed'
    ? {
        history: { shopchamp: playerRecord() },
        result: { shopchamp: playerRecord() },
      }
    : {};
  // A division may be active or completed, never both. Sending the same
  // division as history/result/now_entry made the native state-1 consumer load
  // contradictory records and soft-lock immediately after card login.
  const activeShopRecords = division === 0 || phase === 'active'
    ? { now_entry: { shopchamp: shopRecord() } }
    : {};
  const activePlayerRecords = division === 0 || phase === 'active'
    ? { now_entry: { shopchamp: playerRecord() } }
    : {};
  return {
    isValid: division > 0,
    shopShopChampionship: {
      ...completedShopRecords,
      ...activeShopRecords,
    },
    playerShopChampionship: {
      ...completedPlayerRecords,
      ...activePlayerRecords,
    },
  };
}

export const myshopRegist: EPR = async (info, data, send) => {
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
  const profile = refid ? await findProfile(refid) : null;
  const gameCode = requestGameCode(info);
  const championship = await shopChampionshipResponse(
    gameCode,
    refid,
    profile,
    shop,
    shop ? shop.locationId : locationId
  );
  await send.object({
    shop: K.ATTR({ state: '0' }, { shopname: I('str', shopName) }),
    is_valid_shopchamp: I('bool', championship.isValid),
    shop_shopchampionship: championship.shopShopChampionship,
    player_shopchampionship: championship.playerShopChampionship,
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
    gfdm_j: I('bool', Boolean(state && state.gfdmRegistered)),
    j_gfdm: I('bool', Boolean(state && state.jubeatConfirmed)),
    save_state: I('s32', Number(state ? state.saveState || 0 : 0)),
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

type ShopTrialEntryContext = {
  cabid?: number;
  round?: number;
  refid?: string;
  profile?: Profile | null;
  requireValid?: boolean;
};

async function withShopTrialEntryLock(
  key: string,
  action: () => Promise<ShopTrialEntry>
): Promise<ShopTrialEntry> {
  const previous = shopTrialEntryQueues[key] || Promise.resolve();
  let release = () => {};
  const gate = new Promise<void>(resolve => { release = resolve; });
  const tail = previous.then(() => gate, () => gate);
  shopTrialEntryQueues[key] = tail;
  try {
    await previous.catch(() => undefined);
    return await action();
  } finally {
    release();
    if (shopTrialEntryQueues[key] === tail) delete shopTrialEntryQueues[key];
  }
}

function shopTrialEntryRankedAt(entry: ShopTrialEntry): number {
  const direct = Number(entry.rankedAt || entry.updatedAt || 0);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const parsed = Date.parse(String((entry as any).updatedAt || ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

async function upsertShopTrialEntry(
  raw: any,
  context: ShopTrialEntryContext = {}
): Promise<ShopTrialEntry | null> {
  if (!raw || !configBoolean('shop_trial_enabled', true)) return null;
  const entry = $(raw);
  if (context.requireValid && !entry.bool('is_valid')) return null;

  const cabid = entry.number('cabid', context.cabid || 0);
  const round = entry.number('round', context.round || 0);
  const fallbackRefid = context.refid || refidFrom(entry.obj, 'refid');
  const fallbackDid = context.profile && context.profile.did
    ? context.profile.did
    : fallbackRefid
      ? didFromRefid(fallbackRefid)
      : 0;
  const uploadedDid = entry.number('did', fallbackDid);
  if (fallbackDid > 0 && uploadedDid !== fallbackDid) return null;
  const did = fallbackDid > 0 ? fallbackDid : uploadedDid;
  const seqmode = entry.numbers('seqmode', []);
  const points = entry.numbers('point', []);
  if (
    cabid <= 0 ||
    round <= 0 ||
    did <= 0 ||
    seqmode.length !== 3 ||
    points.length !== 3 ||
    seqmode.some(
      value => !Number.isFinite(value) || Math.floor(value) !== value || value < 0 || value > 8
    ) ||
    points.some(
      value =>
        !Number.isFinite(value) ||
        Math.floor(value) !== value ||
        value < 0 ||
        value > 0x7fffffff
    )
  ) return null;

  const pointTotal = points.reduce((sum, value) => sum + value, 0);
  const uploadedTotal = entry.number('total_point', pointTotal);
  if (
    pointTotal > 0x7fffffff ||
    !Number.isFinite(uploadedTotal) ||
    Math.floor(uploadedTotal) !== uploadedTotal ||
    uploadedTotal !== pointTotal
  ) return null;

  // A result must target a configuration that the cabinet could actually
  // have loaded.  Never let a malformed gameend synthesize/overwrite the
  // separate Shop Trial configuration document.
  const trial = await DB.FindOne<ShopTrial>({
    collection: 'shop_trial',
    cabid,
    round,
  });
  if (!trial || !trial.isValid) return null;

  const incoming: ShopTrialEntry = {
    collection: 'shop_trial_entry',
    cabid,
    round,
    did,
    refid: fallbackRefid,
    name: profileNameForWire(entry.str(
      'name',
      context.profile ? context.profile.name : 'PLAYER'
    ), 'PLAYER'),
    seqmode: seqmode.slice(),
    point: points.slice(),
    totalPoint: pointTotal,
    result: entry.bool('result'),
    isValid: true,
    rankedAt: Date.now(),
    updatedAt: Date.now(),
  };
  const query = { collection: 'shop_trial_entry' as const, cabid, round, did };
  return withShopTrialEntryLock(`${cabid}:${round}:${did}`, async () => {
    const previous = await DB.FindOne<ShopTrialEntry>(query);
    const saved: ShopTrialEntry = previous && previous.totalPoint >= incoming.totalPoint
      ? {
          collection: 'shop_trial_entry',
          cabid,
          round,
          did,
          refid: incoming.refid || previous.refid || '',
          name: incoming.name || previous.name || 'PLAYER',
          seqmode: (previous.seqmode || incoming.seqmode).slice(0, 3),
          point: (previous.point || incoming.point).slice(0, 3),
          totalPoint: previous.totalPoint,
          result: previous.result,
          isValid: true,
          rankedAt: shopTrialEntryRankedAt(previous) || incoming.rankedAt,
          updatedAt: previous.updatedAt || incoming.updatedAt,
        }
      : incoming;
    // Build the retained document field-by-field. DB.FindOne returns a NeDB
    // document that also carries _id; spreading it into $set would attempt to
    // modify the immutable identifier on lower/equal-score submissions.
    await DB.Upsert<ShopTrialEntry>(query, { $set: saved });
    return saved;
  });
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
  if (entry) {
    const refid = refidFrom(entry.obj, 'refid');
    await upsertShopTrialEntry(entry.obj, {
      cabid,
      round,
      refid,
      profile: refid ? await findProfile(refid) : null,
      requireValid: true,
    });
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
      right.totalPoint - left.totalPoint ||
      shopTrialEntryRankedAt(left) - shopTrialEntryRankedAt(right) ||
      left.did - right.did
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
  // Keep the receiver-safe full payload for the currently supplied profile.
  // Rival registration/list/search is not restored yet; do not interpret the
  // displayed Rival ID as authorization to expose another profile.
  await gametopGet(info, data, send);
};

export const logUnhandled: EPR = async (info, data, send) => {
  console.log(`[unhandled] ${info.module}.${info.method} ${JSON.stringify(data)}`);
  await send.success();
};
