import {
  cardutilCheck,
  cardutilRegist,
  changeGroupIcon,
  changeProfileGameSettings,
  changeProfileName,
  customizeRegist,
  demodataGet,
  facilityGet,
  gameendRegist,
  gameinfoGet,
  gametopGet,
  gametopGetRival,
  groupCreate,
  groupDataGet,
  groupDataRegist,
  groupEntryRegist,
  groupListGet,
  groupSearch,
  groupWithdrawal,
  getProfileData,
  infoDataGet,
  lobbyRequest,
  logUnhandled,
  myshopRegist,
  shopRegist,
  shopTrialGet,
  shopTrialRegist,
  shopTrialRankingGet,
  simpleSuccess,
  collaboCheck,
  collaboRegist,
} from './handlers';

const traced = (name: string, handler: EPR): EPR => async (info, data, send) => {
  let payload = '';
  try {
    payload = JSON.stringify(data);
  } catch (_error) {
    payload = '[unserializable request]';
  }
  console.log(`[request] ${name} ${payload}`);
  await handler(info, data, send);
};

export function register() {
  R.GameCode('K32');
  R.GameCode('K33');
  R.Contributor('Local restoration project');

  R.Config('xg2_plus_enabled', {
    name: 'Enable XG2+',
    desc: 'Enable the 15-day XG2+ LivePoint song campaign.',
    type: 'boolean',
    default: true,
    needRestart: false,
  });
  R.Config('xg2_plus_term', {
    name: 'XG2+ campaign day',
    desc: 'Number of XG2+ daily unlocks currently available (0-15).',
    type: 'integer',
    default: 15,
    range: [0, 15],
    needRestart: false,
  });
  R.Config('xg2_plus_unlock_policy', {
    name: 'XG2+ unlock policy',
    desc: 'Use the original LP progression or keep the archive fully unlocked.',
    type: 'string',
    default: 'all_unlocked',
    options: ['all_unlocked', 'original_progression'],
    needRestart: false,
  });
  R.Config('xg_extra_rush_level', {
    name: 'XG EXTRA RUSH level',
    desc: 'XG2 EXTRA RUSH level advertised to the cabinet (0-15).',
    type: 'integer',
    default: 15,
    range: [0, 15],
    needRestart: false,
  });
  R.Config('live_point_term', {
    name: 'LivePoint term',
    desc: 'LivePoint season/division advertised to the cabinet (0-6).',
    type: 'integer',
    default: 6,
    range: [0, 6],
    needRestart: false,
  });
  R.Config('shop_trial_enabled', {
    name: 'Enable Shop Trial',
    desc: 'Enable each shop\'s three-song local event.',
    type: 'boolean',
    default: true,
    needRestart: false,
  });
  R.Config('shop_championship_term', {
    name: 'Shop Championship term',
    desc: 'Historical nationwide shop championship term; 0 keeps it disabled.',
    type: 'integer',
    default: 0,
    range: [0, 4],
    needRestart: false,
  });
  R.Config('group_competition_term', {
    name: 'Group Competition term',
    desc: 'Historical group competition term; 0 keeps it disabled.',
    type: 'integer',
    default: 0,
    range: [0, 4],
    needRestart: false,
  });
  R.Config('cooperation_challenge_enabled', {
    name: 'Enable Cooperation Challenge',
    desc: 'Enable the recovered 26-event catalog and persist player/group progress.',
    type: 'boolean',
    default: true,
    needRestart: false,
  });
  R.Config('cooperation_challenge_completion', {
    name: 'Cooperation Challenge completion',
    desc: 'completed reports each group challenge at its goal so the cleared state and already-granted prizes display; progression keeps real totals only.',
    type: 'string',
    default: 'completed',
    options: ['completed', 'progression'],
    needRestart: false,
  });
  R.Config('master_chart_unlock_policy', {
    name: 'MASTER chart unlock policy',
    desc: 'all_unlocked grants the full four-chart mask (incl. MASTER) for every MASTER-capable song through the secret-music table; played grants it only for songs this card already has scores on; off keeps charts locked.',
    type: 'string',
    default: 'all_unlocked',
    options: ['all_unlocked', 'played', 'off'],
    needRestart: false,
  });
  R.Config('append_festival_mode', {
    name: 'APPEND FESTIVAL state',
    desc: 'Archived event state; ended keeps its reward normally available.',
    type: 'string',
    default: 'ended',
    options: ['off', 'active', 'ended'],
    needRestart: false,
  });
  R.Config('eapass_valid_days', {
    name: 'Play-data validity (days)',
    desc: 'Number of days shown on the card-eject screen (1-999). The original archive target is 365.',
    type: 'integer',
    default: 365,
    range: [1, 999],
    needRestart: false,
  });
  R.Config('demo_music_id', {
    name: 'Demo music ID',
    desc: 'Music ID used by the server-configurable Demo patch.',
    type: 'integer',
    default: 1845,
    range: [0, 99999],
    needRestart: false,
  });
  R.Config('demo_sequence_mode', {
    name: 'Demo sequence mode',
    desc: 'Raw XG chart slot used by Demo; 1 is the stock REGULAR slot.',
    type: 'integer',
    default: 1,
    range: [0, 8],
    needRestart: false,
  });
  R.Config('demo_start_ms', {
    name: 'Demo chart start (ms)',
    desc: 'Chart playback start position in milliseconds.',
    type: 'integer',
    default: 58500,
    range: [0, 600000],
    needRestart: false,
  });
  R.Config('demo_duration_ms', {
    name: 'Demo chart duration (ms)',
    desc: 'Length of the playable Demo segment in milliseconds.',
    type: 'integer',
    default: 9800,
    range: [300, 120000],
    needRestart: false,
  });

  R.Route('facility.get', traced('facility.get', facilityGet));
  R.Route('shopinfo.regist', traced('shopinfo.regist', shopRegist));
  R.Route('gameinfo.get', traced('gameinfo.get', gameinfoGet));
  R.Route('demodata.get', traced('demodata.get', demodataGet));
  R.Route('cardutil.check', traced('cardutil.check', cardutilCheck));
  R.Route('cardutil.regist', traced('cardutil.regist', cardutilRegist));
  R.Route('gametop.get', traced('gametop.get', gametopGet));
  R.Route('gametop.get_rival', traced('gametop.get_rival', gametopGetRival));
  R.Route('gameend.regist', traced('gameend.regist', gameendRegist));
  R.Route('customize.regist', traced('customize.regist', customizeRegist));
  R.Route('groupentry.regist', traced('groupentry.regist', groupEntryRegist));
  R.Route('groupdata.get', traced('groupdata.get', groupDataGet));
  R.Route('groupdata.regist', traced('groupdata.regist', groupDataRegist));
  R.Route('grouplist.get', traced('grouplist.get', groupListGet));
  R.Route(
    'groupwithdrawal.regist',
    traced('groupwithdrawal.regist', groupWithdrawal)
  );
  R.Route(
    'groupsearch.groupid_search',
    traced('groupsearch.groupid_search', groupSearch)
  );
  R.Route('groupcreate.regist', traced('groupcreate.regist', groupCreate));
  R.Route('myshop.regist', traced('myshop.regist', myshopRegist));
  R.Route('infodata.get', traced('infodata.get', infoDataGet));
  R.Route(
    'jubeat_collabo.regist',
    traced('jubeat_collabo.regist', collaboRegist)
  );
  R.Route(
    'jubeat_collabo.check',
    traced('jubeat_collabo.check', collaboCheck)
  );
  R.Route('collabo.regist', traced('collabo.regist', collaboRegist));
  R.Route('collabo.check', traced('collabo.check', collaboCheck));
  R.Route('shoptrial.get', traced('shoptrial.get', shopTrialGet));
  R.Route('shoptrial.regist', traced('shoptrial.regist', shopTrialRegist));
  R.Route(
    'shoptrial.ranking_get',
    traced('shoptrial.ranking_get', shopTrialRankingGet)
  );
  R.Route('lobby.request', traced('lobby.request', lobbyRequest));
  R.Route(
    'assert_report.regist',
    traced('assert_report.regist', simpleSuccess)
  );
  R.Route('dlstatus.progress', traced('dlstatus.progress', simpleSuccess));
  R.WebUIEvent('xg2-change-name', changeProfileName);
  R.WebUIEvent('xg2-profile-data', getProfileData);
  R.WebUIEvent('xg2-change-game-settings', changeProfileGameSettings);
  R.WebUIEvent('xg2-change-group-icon', changeGroupIcon);
  R.Unhandled(logUnhandled);

  console.log('GFDM XG2 discovery plugin registered');
}
