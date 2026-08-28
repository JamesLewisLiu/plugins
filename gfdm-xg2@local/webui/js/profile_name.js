(function () {
  'use strict';

  var root = document.getElementById('xg2-profile-admin');
  if (!root) return;
  var refid = String(root.getAttribute('data-refid') || '').trim();
  var pageView = String(root.getAttribute('data-view') || 'profile');
  var profileData = null;
  var iconData = window.GFDM_XG2_ICON_DATA;

  function element(id) {
    return document.getElementById(id);
  }

  function setText(target, value) {
    var node = typeof target === 'string' ? element(target) : target;
    if (node) node.textContent = value === undefined || value === null ? '' : String(value);
  }

  function setStatus(message, level) {
    var node = element('xg2-admin-status');
    if (!node) return;
    node.textContent = String(message || '');
    if (node.parentNode) {
      node.parentNode.className = 'message is-' + (level || 'info');
    }
  }

  function clearNode(node) {
    if (node) node.textContent = '';
  }

  function embeddedIcon(collection, key) {
    var values = iconData && iconData[collection];
    var source = values && values[String(key)];
    if (typeof source !== 'string' || source.indexOf('data:image/png;base64,') !== 0) {
      throw new Error('Embedded icon is missing: ' + collection + '/' + key);
    }
    return source;
  }

  function renderGroupIconImages() {
    var images = document.querySelectorAll('img[data-xg2-group-icon]');
    Array.prototype.forEach.call(images, function (image) {
      image.src = embeddedIcon('group', image.getAttribute('data-xg2-group-icon'));
    });
  }

  function appendTextCell(row, value) {
    var cell = document.createElement('td');
    cell.textContent = value === undefined || value === null ? '' : String(value);
    row.appendChild(cell);
    return cell;
  }

  function addRow(body, values) {
    var row = document.createElement('tr');
    values.forEach(function (value) {
      appendTextCell(row, value);
    });
    body.appendChild(row);
  }

  function addEmptyRow(body, columns, message) {
    if (!body) return;
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.colSpan = columns;
    cell.textContent = message;
    row.appendChild(cell);
    body.appendChild(row);
  }

  function integerText(value) {
    var number = Number(value);
    return isFinite(number) ? Math.floor(number).toLocaleString() : '—';
  }

  function hundredths(value, suffix) {
    var number = Number(value);
    if (!isFinite(number) || number < 0) return '—';
    return (number / 100).toFixed(2) + (suffix || '');
  }

  function musicTitle(value) {
    var title = String(value || '').trim();
    return title || '(Unknown Song)';
  }

  function gameName(gameCode) {
    return gameCode === 'K33' ? 'GuitarFreaks' : 'DrumMania';
  }

  function chartLabel(gameCode, playMode, seqMode) {
    var seq = Math.floor(Number(seqMode));
    var levels = ['NOV', 'REG', 'EXP', 'MSTR'];
    if (playMode === 'standard') {
      if (gameCode === 'K33' && seq >= 1 && seq <= 8) {
        return (seq <= 4 ? 'G ' : 'B ') + levels[(seq - 1) % 4];
      }
      if (gameCode === 'K32' && seq >= 1 && seq <= 4) {
        return 'D ' + levels[seq - 1];
      }
    }
    if (playMode === 'classic') {
      if (gameCode === 'K33' && seq >= 1 && seq <= 9) {
        var part = seq <= 3 ? 'G ' : seq <= 6 ? 'B ' : 'O ';
        return part + levels[(seq - 1) % 3];
      }
      if (gameCode === 'K32' && seq >= 1 && seq <= 3) {
        return 'D ' + levels[seq - 1];
      }
    }
    return 'Slot ' + seq;
  }

  function difficultyText(playMode, value) {
    var difficulty = Number(value);
    if (!isFinite(difficulty) || difficulty <= 0) return '—';
    return playMode === 'classic'
      ? (difficulty / 10).toFixed(1)
      : (difficulty / 100).toFixed(2);
  }

  function chartWithDifficulty(gameCode, playMode, seqMode, difficulty) {
    return chartLabel(gameCode, playMode, seqMode) +
      ' · ' + difficultyText(playMode, difficulty);
  }

  function rankLabel(value) {
    var ranks = ['E', 'D', 'C', 'B', 'A', 'S', 'SS'];
    var rank = Math.floor(Number(value));
    return ranks[rank] || '—';
  }

  function clearLabel(record) {
    if (Number(record.excellent) > 0) return 'Excellent';
    if (Number(record.fullCombo) > 0) return 'Full Combo';
    if (Number(record.clear) > 0) return 'Clear';
    return 'Failed';
  }

  function skillForGame(gameCode, playMode) {
    var skills = Array.isArray(profileData.skills) ? profileData.skills : [];
    for (var index = 0; index < skills.length; index += 1) {
      if (skills[index].gameCode === gameCode) {
        return skills[index][playMode] || null;
      }
    }
    return null;
  }

  function renderGameSettings() {
    var settings = profileData.settings || {};
    var select = element('xg2-last-mode');
    if (select) select.value = String(settings.lastMode);
    var fieldset = element('xg2-settings-fields');
    if (fieldset) fieldset.disabled = false;
  }

  function abilityTextureKey(ability) {
    var type = Math.max(0, Math.min(4, Math.floor(Number(ability.type) || 0)));
    var level = type === 0
      ? 0
      : Math.max(0, Math.min(2, Math.floor(Number(ability.level) || 0)));
    return String(type) + String(level);
  }

  function abilitySkillColor(skillPoint) {
    // game.dll sub_100269D0 selects ABL_EMB<type><level><colour> from the
    // STANDARD Skill value stored in hundredths.
    var skill = Math.max(0, Math.floor(Number(skillPoint) || 0));
    if (skill < 700000) return 0;
    if (skill < 750000) return 1;
    if (skill < 800000) return 2;
    return 3;
  }

  function abilityEmblemSource(ability, skillPoint) {
    var key = abilityTextureKey(ability);
    var colour = key === '00' ? 0 : abilitySkillColor(skillPoint);
    return embeddedIcon('abilityEmblem', key + colour);
  }

  function abilityLabelSource(ability) {
    return embeddedIcon('abilityLabel', abilityTextureKey(ability));
  }

  function renderPersonalInformation() {
    var body = element('xg2-profile-body');
    if (!body) return;
    clearNode(body);
    var settings = profileData.settings || {};
    var games = Array.isArray(settings.games) ? settings.games : [];
    games.forEach(function (game) {
      var standard = skillForGame(game.gameCode, 'standard');
      var classic = skillForGame(game.gameCode, 'classic');
      var ability = game.ability || { type: 0, level: 0, name: 'NONE' };
      var type = Math.floor(Number(ability.type) || 0);
      var abilityName = String(ability.name || 'NONE');
      var abilityStandardSkill = standard ? standard.displayedSkill : 0;
      var abilityValue = type > 0 ? abilityName : 'NONE';
      var row = document.createElement('tr');
      appendTextCell(row, gameName(game.gameCode));
      appendTextCell(row, integerText(game.playCount));
      appendTextCell(row, integerText(game.livePoint));
      appendTextCell(row, standard ? hundredths(standard.displayedSkill) : '—');
      appendTextCell(row, classic ? hundredths(classic.displayedSkill) : '—');

      var abilityCell = document.createElement('td');
      var abilityDisplay = document.createElement('span');
      abilityDisplay.className = 'xg2-ability';
      var abilityText = document.createElement('span');
      abilityText.className = 'xg2-ability-value';
      abilityText.textContent = abilityValue;
      var abilityIcon = document.createElement('span');
      abilityIcon.className = 'xg2-ability-icon';
      var abilityEmblem = document.createElement('img');
      abilityEmblem.className = 'xg2-ability-emblem';
      abilityEmblem.src = abilityEmblemSource(ability, abilityStandardSkill);
      abilityEmblem.alt = abilityName + ' Ability emblem';
      var abilityLabel = document.createElement('img');
      abilityLabel.className = 'xg2-ability-label';
      abilityLabel.src = abilityLabelSource(ability);
      abilityLabel.alt = '';
      abilityIcon.appendChild(abilityEmblem);
      abilityIcon.appendChild(abilityLabel);
      abilityDisplay.appendChild(abilityText);
      abilityDisplay.appendChild(abilityIcon);
      abilityCell.appendChild(abilityDisplay);
      row.appendChild(abilityCell);
      body.appendChild(row);
    });
    if (!games.length) addEmptyRow(body, 6, 'No personal information is available.');
  }

  function renderGroup() {
    var summary = element('xg2-group-summary');
    if (!summary) return;
    var group = profileData.group;
    var fieldset = element('xg2-group-fields');
    var help = element('xg2-group-help');
    if (!group) {
      setText(summary, 'This profile has not joined a Group.');
      if (fieldset) fieldset.disabled = true;
      setText(help, 'Join a Group before changing its icon.');
      return;
    }

    setText(
      summary,
      group.name + ' / ID ' + group.groupId + ' / ' + group.memberCount + ' members'
    );
    var radios = document.querySelectorAll('.xg2-group-icon-radio');
    Array.prototype.forEach.call(radios, function (radio) {
      radio.checked = String(radio.value) === String(group.icon);
    });
    if (fieldset) fieldset.disabled = !group.isOwner;
    setText(
      help,
      group.isOwner
        ? 'Select one of the 10 native Group icons. The game loads the change with the next Group refresh.'
        : 'This profile is not the Group owner and can only view the selected icon.'
    );
  }

  function renderRecords() {
    var gameSelect = element('xg2-record-game');
    var modeSelect = element('xg2-record-mode');
    var body = element('xg2-records-body');
    if (!gameSelect || !modeSelect || !body) return;
    var gameCode = gameSelect.value;
    var playMode = modeSelect.value;
    var records = Array.isArray(profileData.records) ? profileData.records : [];
    var filtered = records.filter(function (record) {
      return record.gameCode === gameCode && record.playMode === playMode;
    });
    clearNode(body);
    filtered.forEach(function (record) {
      addRow(body, [
        record.musicId,
        musicTitle(record.titleName),
        chartWithDifficulty(
          record.gameCode,
          record.playMode,
          record.seqMode,
          record.difficulty
        ),
        integerText(record.score),
        hundredths(record.achievement, '%'),
        rankLabel(record.resultRank),
        integerText(record.combo),
        hundredths(record.skillPoint),
        clearLabel(record),
        integerText(record.attempts),
      ]);
    });
    if (!filtered.length) {
      addEmptyRow(body, 10, 'No records are available for this game and mode.');
    }
    setText('xg2-record-count', filtered.length + ' records');
  }

  function skillForSelection() {
    var gameSelect = element('xg2-skill-game');
    var modeSelect = element('xg2-skill-mode');
    if (!gameSelect || !modeSelect) {
      return { gameCode: 'K33', playMode: 'standard', breakdown: null };
    }
    return {
      gameCode: gameSelect.value,
      playMode: modeSelect.value,
      breakdown: skillForGame(gameSelect.value, modeSelect.value),
    };
  }

  function renderSkill() {
    var body = element('xg2-skill-body');
    var bucketSelect = element('xg2-skill-bucket');
    if (!body || !bucketSelect) return;
    var selected = skillForSelection();
    var breakdown = selected.breakdown;
    clearNode(body);
    var classic = selected.playMode === 'classic';
    var limits = breakdown && breakdown.limits ? breakdown.limits : {};
    var newLimit = Number(limits.newSongs);
    var oldLimit = Number(limits.oldSongs);
    var longLimit = Number(limits.longSongs);
    if (!isFinite(newLimit)) newLimit = classic ? 14 : 25;
    if (!isFinite(oldLimit)) oldLimit = classic ? 36 : 25;
    if (!isFinite(longLimit)) longLimit = classic ? 3 : 0;
    setText('xg2-skill-new-heading', 'HOT Top ' + Math.floor(newLimit));
    setText('xg2-skill-old-heading', 'OTHER Top ' + Math.floor(oldLimit));
    setText('xg2-skill-long-heading', 'LONG Top ' + Math.floor(longLimit));

    var longColumn = element('xg2-skill-long-column');
    if (longColumn) longColumn.hidden = !classic;
    var longOption = element('xg2-skill-long-option');
    if (longOption) {
      longOption.hidden = !classic;
      longOption.disabled = !classic;
    }
    if (!classic && bucketSelect.value === 'longSongs') {
      bucketSelect.value = 'newSongs';
    }
    var bucket = bucketSelect.value;
    var selectedLimit = Number(limits[bucket]);
    if (!isFinite(selectedLimit)) {
      selectedLimit = bucket === 'newSongs'
        ? newLimit
        : bucket === 'oldSongs' ? oldLimit : longLimit;
    }
    selectedLimit = Math.max(0, Math.floor(selectedLimit));
    setText('xg2-skill-selected-heading', 'Top ' + selectedLimit);

    if (!breakdown) {
      setText('xg2-skill-total', '—');
      setText('xg2-skill-new', '—');
      setText('xg2-skill-old', '—');
      setText('xg2-skill-long', '—');
      setText('xg2-skill-all', '—');
      addEmptyRow(body, 7, 'No Skill Data is available for this game and mode.');
      return;
    }

    setText('xg2-skill-total', hundredths(breakdown.displayedSkill));
    setText('xg2-skill-new', hundredths(breakdown.newPoint));
    setText('xg2-skill-old', hundredths(breakdown.oldPoint));
    setText('xg2-skill-long', hundredths(breakdown.longPoint));
    setText('xg2-skill-all', hundredths(breakdown.allPoint));
    var songs = Array.isArray(breakdown[bucket])
      ? breakdown[bucket].slice(0, selectedLimit)
      : [];
    songs.forEach(function (song) {
      addRow(body, [
        song.rank,
        song.musicId,
        musicTitle(song.titleName),
        chartWithDifficulty(
          selected.gameCode,
          selected.playMode,
          song.seqMode,
          song.difficulty
        ),
        hundredths(song.achievement, '%'),
        hundredths(song.point),
        song.selected ? 'Yes' : 'No',
      ]);
    });
    if (!songs.length) {
      addEmptyRow(body, 7, 'No Skill Data entries are available in this category.');
    }
  }

  function chooseInitialFilters() {
    var records = Array.isArray(profileData.records) ? profileData.records : [];
    var recordGame = element('xg2-record-game');
    var recordMode = element('xg2-record-mode');
    if (recordGame && recordMode) {
      var hasDefault = records.some(function (record) {
        return record.gameCode === recordGame.value && record.playMode === recordMode.value;
      });
      if (!hasDefault && records.length) {
        recordGame.value = records[0].gameCode;
        recordMode.value = records[0].playMode;
      }
    }

    var skillGame = element('xg2-skill-game');
    var skillMode = element('xg2-skill-mode');
    if (!skillGame || !skillMode) return;
    var skills = Array.isArray(profileData.skills) ? profileData.skills : [];
    var selectedHasSongs = skills.some(function (current) {
      if (current.gameCode !== skillGame.value || !current[skillMode.value]) {
        return false;
      }
      var selectedMode = current[skillMode.value];
      return selectedMode.newSongs.length + selectedMode.oldSongs.length +
        selectedMode.longSongs.length > 0;
    });
    if (selectedHasSongs) return;
    for (var index = 0; index < skills.length; index += 1) {
      var current = skills[index];
      var standardCount =
        current.standard.newSongs.length + current.standard.oldSongs.length;
      var classicCount =
        current.classic.newSongs.length + current.classic.oldSongs.length +
        current.classic.longSongs.length;
      if (standardCount || classicCount) {
        skillGame.value = current.gameCode;
        skillMode.value = standardCount ? 'standard' : 'classic';
        break;
      }
    }
  }

  function renderAll() {
    var nameInput = document.querySelector('#xg2-name-form input[name="name"]');
    if (nameInput && profileData.profile) nameInput.value = profileData.profile.name;
    renderGameSettings();
    renderPersonalInformation();
    renderGroup();
    chooseInitialFilters();
    ['xg2-record-game', 'xg2-record-mode', 'xg2-skill-game',
      'xg2-skill-mode', 'xg2-skill-bucket'].forEach(function (id) {
      var node = element(id);
      if (node) node.disabled = false;
    });
    renderRecords();
    renderSkill();
  }

  function errorMessage(error) {
    if (error && error.response && error.response.data) {
      var data = error.response.data;
      if (typeof data === 'string') return data;
      if (data.message) return String(data.message);
      if (data.error) return String(data.error);
    }
    return error && error.message ? String(error.message) : 'Unknown error';
  }

  function loadProfileData(successMessage) {
    if (typeof emit !== 'function') {
      setStatus('This WebUI does not provide emit(), so profile data cannot be loaded.', 'danger');
      return Promise.reject(new Error('emit() is unavailable'));
    }
    return emit('xg2-profile-data', { refid: refid }).then(function (response) {
      var data = response && response.data;
      if (!data || data.schemaVersion !== 2) {
        throw new Error('The server returned an unrecognized data format.');
      }
      profileData = data;
      renderAll();
      var loadedMessage = pageView === 'records'
        ? data.records.length + ' records loaded. Viewing Records does not modify saved data.'
        : 'Personal Information and Skill Data loaded. Viewing this page does not modify saved data.';
      setStatus(successMessage || loadedMessage, successMessage ? 'success' : 'info');
      return data;
    });
  }

  function formDataObject(form) {
    var values = {};
    new FormData(form).forEach(function (value, key) {
      values[key] = value;
    });
    return values;
  }

  function bindWriteForm(formId, eventName, successMessage) {
    var form = element(formId);
    if (!form) return;
    form.addEventListener('submit', function (event) {
      if (typeof emit !== 'function') return;
      event.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      setStatus('Saving…', 'info');
      emit(eventName, formDataObject(form))
        .then(function () {
          return loadProfileData(successMessage).catch(function (error) {
            setStatus(
              successMessage + ', but refresh failed: ' + errorMessage(error),
              'warning'
            );
          });
        }, function (error) {
          setStatus('Save failed: ' + errorMessage(error), 'danger');
        })
        .then(function () {
          if (button) button.disabled = false;
        });
    });
  }

  ['xg2-record-game', 'xg2-record-mode'].forEach(function (id) {
    var node = element(id);
    if (node) node.addEventListener('change', renderRecords);
  });
  ['xg2-skill-game', 'xg2-skill-mode', 'xg2-skill-bucket'].forEach(function (id) {
    var node = element(id);
    if (node) node.addEventListener('change', renderSkill);
  });

  bindWriteForm('xg2-name-form', 'xg2-change-name', 'Player name saved.');
  bindWriteForm(
    'xg2-settings-form',
    'xg2-change-game-settings',
    'Game settings saved.'
  );
  bindWriteForm(
    'xg2-group-form',
    'xg2-change-group-icon',
    'Group icon saved.'
  );

  try {
    renderGroupIconImages();
  } catch (error) {
    setStatus('Icon initialization failed: ' + errorMessage(error), 'danger');
    return;
  }

  loadProfileData().catch(function (error) {
    setStatus('Load failed: ' + errorMessage(error), 'danger');
  });
})();
