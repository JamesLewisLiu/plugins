(function () {
  'use strict';

  var root = document.getElementById('xg2-profile-admin');
  if (!root) return;
  var refid = String(root.getAttribute('data-refid') || '').trim();
  var profileData = null;

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

  function addRow(body, values) {
    var row = document.createElement('tr');
    values.forEach(function (value) {
      var cell = document.createElement('td');
      cell.textContent = value === undefined || value === null ? '' : String(value);
      row.appendChild(cell);
    });
    body.appendChild(row);
  }

  function addEmptyRow(body, columns, message) {
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

  function customSlotText(slot) {
    if (typeof slot === 'number') return integerText(slot);
    if (!slot) return '—';
    if (slot.livePointMarker !== null && slot.livePointMarker !== undefined) {
      return 'LP marker ' + integerText(slot.livePointMarker);
    }
    if (slot.selection !== null && slot.selection !== undefined) {
      return integerText(slot.selection);
    }
    return 'Raw ' + integerText(slot.rawValue);
  }

  function chartLabel(gameCode, playMode, seqMode) {
    var seq = Math.floor(Number(seqMode));
    var fourLevels = ['BSC', 'ADV', 'EXT', 'MAS'];
    var threeLevels = ['BSC', 'ADV', 'EXT'];
    if (playMode === 'standard') {
      if (gameCode === 'K33' && seq >= 1 && seq <= 8) {
        return (seq <= 4 ? 'G ' : 'B ') + fourLevels[(seq - 1) % 4];
      }
      if (gameCode === 'K32' && seq >= 1 && seq <= 4) {
        return 'D ' + fourLevels[seq - 1];
      }
    }
    if (playMode === 'classic') {
      if (gameCode === 'K33' && seq >= 1 && seq <= 9) {
        var part = seq <= 3 ? 'G ' : seq <= 6 ? 'B ' : 'O ';
        return part + threeLevels[(seq - 1) % 3];
      }
      if (gameCode === 'K32' && seq >= 1 && seq <= 3) {
        return 'D ' + threeLevels[seq - 1];
      }
    }
    return 'Slot ' + seq;
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

  function renderSettings() {
    var settings = profileData.settings || {};
    var select = element('xg2-last-mode');
    if (select) select.value = String(settings.lastMode);
    var fieldset = element('xg2-settings-fields');
    if (fieldset) fieldset.disabled = false;

    var body = element('xg2-settings-body');
    clearNode(body);
    var games = Array.isArray(settings.games) ? settings.games : [];
    games.forEach(function (game) {
      var custom = game.custom || {};
      addRow(body, [
        game.gameCode === 'K33' ? 'K33 GuitarFreaks' : 'K32 DrumMania',
        integerText(game.playCount),
        integerText(game.livePoint),
        integerText(game.plusLivePoint),
        customSlotText(custom.shutter),
        customSlotText(custom.attackEffect),
        customSlotText(custom.judgeText),
        customSlotText(custom.combo),
        customSlotText(custom.notes),
      ]);
    });
    if (!games.length) addEmptyRow(body, 9, 'No saved settings.');
  }

  function renderGroup() {
    var group = profileData.group;
    var fieldset = element('xg2-group-fields');
    var help = element('xg2-group-help');
    if (!group) {
      setText('xg2-group-summary', 'This profile has not joined a Group.');
      if (fieldset) fieldset.disabled = true;
      setText(help, 'Join a Group before changing its icon.');
      return;
    }

    setText(
      'xg2-group-summary',
      group.name + ' / ID ' + group.groupId + ' / ' + group.memberCount + ' members'
    );
    var icon = element('xg2-group-icon');
    if (icon) icon.value = String(group.icon);
    if (fieldset) fieldset.disabled = !group.isOwner;
    setText(
      help,
      group.isOwner
        ? 'Native icon numbers range from 0 to 9. Changes take effect the next time the Group is loaded.'
        : 'This profile is not the Group owner and can only view the icon.'
    );
  }

  function renderRecords() {
    var gameSelect = element('xg2-record-game');
    var modeSelect = element('xg2-record-mode');
    if (!gameSelect || !modeSelect) return;
    var gameCode = gameSelect.value;
    var playMode = modeSelect.value;
    var records = Array.isArray(profileData.records) ? profileData.records : [];
    var filtered = records.filter(function (record) {
      return record.gameCode === gameCode && record.playMode === playMode;
    });
    var body = element('xg2-records-body');
    clearNode(body);
    filtered.forEach(function (record) {
      addRow(body, [
        record.musicId,
        musicTitle(record.titleName),
        chartLabel(record.gameCode, record.playMode, record.seqMode),
        integerText(record.score),
        hundredths(record.achievement, '%'),
        rankLabel(record.resultRank),
        integerText(record.combo),
        hundredths(record.skillPoint),
        clearLabel(record),
        integerText(record.attempts),
      ]);
    });
    if (!filtered.length) addEmptyRow(body, 10, 'No schema-2 records are available for this game and mode.');
    setText('xg2-record-count', filtered.length + ' records');
  }

  function skillForSelection() {
    var gameCode = element('xg2-skill-game').value;
    var playMode = element('xg2-skill-mode').value;
    var skills = Array.isArray(profileData.skills) ? profileData.skills : [];
    for (var index = 0; index < skills.length; index += 1) {
      if (skills[index].gameCode === gameCode) {
        return {
          gameCode: gameCode,
          playMode: playMode,
          breakdown: skills[index][playMode],
        };
      }
    }
    return { gameCode: gameCode, playMode: playMode, breakdown: null };
  }

  function renderSkill() {
    var selected = skillForSelection();
    var breakdown = selected.breakdown;
    var body = element('xg2-skill-body');
    clearNode(body);
    var classic = selected.playMode === 'classic';
    var limits = breakdown && breakdown.limits ? breakdown.limits : {};
    var newLimit = Number(limits.newSongs);
    var oldLimit = Number(limits.oldSongs);
    var longLimit = Number(limits.longSongs);
    if (!isFinite(newLimit)) newLimit = classic ? 14 : 25;
    if (!isFinite(oldLimit)) oldLimit = classic ? 36 : 25;
    if (!isFinite(longLimit)) longLimit = classic ? 3 : 0;
    setText('xg2-skill-new-heading', 'New Top ' + Math.floor(newLimit));
    setText('xg2-skill-old-heading', 'Old Top ' + Math.floor(oldLimit));
    setText('xg2-skill-long-heading', 'LONG Top ' + Math.floor(longLimit));

    var longColumn = element('xg2-skill-long-column');
    if (longColumn) longColumn.hidden = !classic;
    var longOption = element('xg2-skill-long-option');
    if (longOption) {
      longOption.hidden = !classic;
      longOption.disabled = !classic;
    }
    var bucketSelect = element('xg2-skill-bucket');
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
    setText('xg2-skill-selected-heading', 'Top ' + Math.floor(selectedLimit));

    if (!breakdown) {
      setText('xg2-skill-total', '—');
      setText('xg2-skill-new', '—');
      setText('xg2-skill-old', '—');
      setText('xg2-skill-long', '—');
      setText('xg2-skill-all', '—');
      addEmptyRow(body, 6, 'No Skill data is available for this game and mode.');
      return;
    }

    setText('xg2-skill-total', hundredths(breakdown.displayedSkill));
    setText('xg2-skill-new', hundredths(breakdown.newPoint));
    setText('xg2-skill-old', hundredths(breakdown.oldPoint));
    setText('xg2-skill-long', hundredths(breakdown.longPoint));
    setText('xg2-skill-all', hundredths(breakdown.allPoint));
    var songs = Array.isArray(breakdown[bucket]) ? breakdown[bucket] : [];
    songs.forEach(function (song) {
      addRow(body, [
        song.rank,
        song.musicId,
        musicTitle(song.titleName),
        chartLabel(selected.gameCode, selected.playMode, song.seqMode),
        hundredths(song.point),
        song.selected ? 'Yes' : 'No',
      ]);
    });
    if (!songs.length) addEmptyRow(body, 6, 'No Skill entries are available in this bucket.');
  }

  function chooseInitialFilters() {
    var records = Array.isArray(profileData.records) ? profileData.records : [];
    var recordGame = element('xg2-record-game');
    var recordMode = element('xg2-record-mode');
    var hasDefault = records.some(function (record) {
      return record.gameCode === recordGame.value && record.playMode === recordMode.value;
    });
    if (!hasDefault && records.length) {
      recordGame.value = records[0].gameCode;
      recordMode.value = records[0].playMode;
    }

    var skills = Array.isArray(profileData.skills) ? profileData.skills : [];
    var skillGame = element('xg2-skill-game');
    var skillMode = element('xg2-skill-mode');
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
    renderSettings();
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
      setStatus('This WebUI does not provide emit(), so extended data cannot be loaded.', 'danger');
      return Promise.reject(new Error('emit() is unavailable'));
    }
    return emit('xg2-profile-data', { refid: refid }).then(function (response) {
      var data = response && response.data;
      if (!data || data.schemaVersion !== 2) {
        throw new Error('The server returned an unrecognized data format.');
      }
      profileData = data;
      renderAll();
      setStatus(
        successMessage || (data.records.length + ' merged records loaded. Viewing records does not modify saved data.'),
        successMessage ? 'success' : 'info'
      );
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

  loadProfileData().catch(function (error) {
    setStatus('Load failed: ' + errorMessage(error), 'danger');
  });
})();
