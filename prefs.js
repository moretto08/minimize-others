import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const SHORTCUT_NAME = 'minimize-except-active';

export default class MinimizeOtherrsPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        this._settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Shortcuts',
            icon_name: 'preferences-desktop-keyboard-shortcuts-symbolic',
        });

        const group = new Adw.PreferencesGroup({
            title: 'Window shortcuts',
            description: 'Use Super for the Windows key.',
        });

        const row = new Adw.ActionRow({
            title: 'Minimize others',
            subtitle: 'Minimize every window in the current workspace except the active one.',
        });

        this._shortcutLabel = new Gtk.ShortcutLabel({
            accelerator: this._getShortcut(),
            disabled_text: 'Disabled',
        });

        const editButton = new Gtk.Button({
            child: this._shortcutLabel,
            valign: Gtk.Align.CENTER,
        });
        editButton.add_css_class('flat');
        editButton.connect('clicked', () => this._showShortcutDialog(window));

        const resetButton = new Gtk.Button({
            icon_name: 'edit-undo-symbolic',
            tooltip_text: 'Reset shortcut',
            valign: Gtk.Align.CENTER,
        });
        resetButton.add_css_class('flat');
        resetButton.connect('clicked', () => {
            this._settings.reset(SHORTCUT_NAME);
            this._syncShortcutLabel();
        });

        row.add_suffix(editButton);
        row.add_suffix(resetButton);
        row.activatable_widget = editButton;

        group.add(row);
        page.add(group);
        window.add(page);
    }

    _getShortcut() {
        return this._settings.get_strv(SHORTCUT_NAME)[0] ?? '';
    }

    _setShortcut(accelerator) {
        this._settings.set_strv(SHORTCUT_NAME, accelerator ? [accelerator] : []);
        this._syncShortcutLabel();
    }

    _syncShortcutLabel() {
        this._shortcutLabel.accelerator = this._getShortcut();
    }

    _showShortcutDialog(parent) {
        const dialog = new Gtk.Window({
            title: 'Set shortcut',
            modal: true,
            transient_for: parent,
            default_width: 360,
            default_height: 160,
        });

        const box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 12,
            margin_top: 24,
            margin_bottom: 24,
            margin_start: 24,
            margin_end: 24,
        });

        box.append(new Gtk.Label({
            label: 'Press the new shortcut',
            css_classes: ['title-3'],
        }));

        box.append(new Gtk.Label({
            label: 'Press Backspace to disable it, or Escape to cancel.',
            wrap: true,
        }));

        const currentShortcut = this._getShortcut();
        const preview = new Gtk.ShortcutLabel({
            accelerator: currentShortcut,
            disabled_text: 'Disabled',
            halign: Gtk.Align.CENTER,
        });
        box.append(preview);

        const controller = new Gtk.EventControllerKey();
        controller.connect('key-pressed', (_controller, keyval, _keycode, state) => {
            if (keyval === Gdk.KEY_Escape) {
                dialog.close();
                return Gdk.EVENT_STOP;
            }

            if (keyval === Gdk.KEY_BackSpace) {
                this._setShortcut('');
                dialog.close();
                return Gdk.EVENT_STOP;
            }

            const mask = state & Gtk.accelerator_get_default_mod_mask();

            if (!Gtk.accelerator_valid(keyval, mask))
                return Gdk.EVENT_STOP;

            this._setShortcut(Gtk.accelerator_name(keyval, mask));
            dialog.close();
            return Gdk.EVENT_STOP;
        });

        dialog.add_controller(controller);
        dialog.set_child(box);
        dialog.present();
    }
}
