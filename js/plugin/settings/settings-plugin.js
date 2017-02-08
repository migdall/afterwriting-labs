define(function(require) {

    var Protoplast = require('protoplast'),
        Plugin = require('core/plugin'),
        SettingsSection = require('plugin/settings/model/settings-section'),
        SettingsController = require('plugin/settings/controller/settings-controller'),
        SettingsWidgetsController = require('plugin/settings/controller/settings-widgets-controller'),
        SettingsWidgetModel = require('plugin/settings/model/settings-widget-model'),
        SettingsLoaderModel = require('plugin/settings/model/settings-loader-model'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller');

    var SettingsPlugin = Plugin.extend({
        
        scriptModel: {
            inject: 'script'
        },
 
        themeController: {
            inject: ThemeController
        },

        $create: function(context) {
            context.register(SettingsWidgetModel.create());
            context.register('settingsLoaderModel', SettingsLoaderModel.create());
            context.register(SettingsController.create());
            context.register(SettingsWidgetsController.create());
        },

        init: function() {
            var settingsSection = SettingsSection.create('settings');
            this.themeController.addSection(settingsSection);

            Protoplast.utils.bind(this.scriptModel, 'script', function(){
                settingsSection.isVisibleInMenu = true;
            });
        }

    });

    return SettingsPlugin;
});