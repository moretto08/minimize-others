import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const SHORTCUT_NAME = 'minimize-except-active';

export default class MinimizeOtherrsExtension extends Extension {
    enable() {
        this._settings = this.getSettings();

        Main.wm.addKeybinding(
            SHORTCUT_NAME,
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL,
            () => this._minimizeExceptActive()
        );
    }

    disable() {
        Main.wm.removeKeybinding(SHORTCUT_NAME);
        this._settings = null;
    }

    _minimizeExceptActive() {
        const activeWindow = global.display.get_focus_window();

        if (!activeWindow)
            return;

        const activeWorkspace = activeWindow.get_workspace();
        const windows = global.display.get_tab_list(Meta.TabList.NORMAL, activeWorkspace);

        for (const window of windows) {
            if (window === activeWindow)
                continue;

            if (window.minimized)
                continue;

            if (window.is_skip_taskbar())
                continue;

            if (!window.showing_on_its_workspace())
                continue;

            if (!window.can_minimize())
                continue;

            window.minimize();
        }
    }
}
