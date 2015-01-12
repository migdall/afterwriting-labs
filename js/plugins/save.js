/* global define, Blob, window */
define(function (require) {

	var pm = require('utils/pluginmanager'),
		saveAs = require('saveAs'),
		preview = require('plugins/preview'),
		gd = require('utils/googledrive'),
		$ = require('jquery'),
		data = require('modules/data');

	require('impromptu');

	var plugin = pm.create_plugin('save', 'save');

	plugin.data = {
		filename: "screenplay"
	};

	plugin.save_as_fountain = function () {
		var blob = new Blob([data.script()], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, plugin.data.filename + '.fountain');
	};

	plugin.save_as_pdf = function () {
		var blob = preview.get_pdf(function (data) {
			saveAs(data.blob, plugin.data.filename + '.pdf');
		});
	};

	plugin.dropbox_fountain = function () {
		var encoded = window.btoa(data.script());
		var uri = 'data:text/plain;base64,' + encoded;
		Dropbox.save(uri, plugin.data.filename + '.fountain');
	};

	plugin.dropbox_pdf = function () {
		var uri = preview.get_pdf(function (data) {
			Dropbox.save(data.url, plugin.data.filename + '.pdf');
		});
	};

	plugin.google_drive_fountain = function () {
		google_drive_start();
		var blob = new Blob([data.script()], {
			type: "text/plain;charset=utf-8"
		});
		gd.save(blob, plugin.data.filename + '.fountain', google_drive_saved);
	};

	plugin.google_drive_pdf = function () {
		google_drive_start();
		var uri = preview.get_pdf(function (data) {
			gd.save(data.blob, plugin.data.filename + '.pdf', google_drive_saved);
		});
	};

	function google_drive_start() {
		$.prompt('Please wait', {
			title: 'Saving to Google Drive',
			buttons: []
		});
	}

	function google_drive_saved(data) {
		$.prompt.close();
		$.prompt('Saved as: ' + data.title, {
			title: 'File saved!',
			buttons: {
				'Open in Google Drive': true,
				'Close': false
			},
			submit: function (e, v, f, m) {
				if (v) {
					window.open(data.alternateLink, '_blank');
				}
			}
		});
	}

	plugin.is_dropbox_available = function () {
		return window.Dropbox !== undefined && Dropbox.isBrowserSupported() && window.location.protocol !== 'file:';
	};

	plugin.is_google_drive_available = function () {
		return window.gapi && window.location.protocol !== 'file:';
	};

	plugin.activate = function () {
		plugin.data.filename = 'screenplay';
		var title_token = data.get_title_page_token('title');
		if (title_token) {
			plugin.data.filename = title_token.text.replace(/[^a-zA-Z0-9]/g, ' ').split('\n').join(' ').replace(/\s+/g, ' ').trim();
		}
	};

	return plugin;
});