# Minimize Others

GNOME Shell 50 extension that minimizes every normal window in the current workspace except the active one.

Default shortcut:

```text
Super+home
```

Open the extension preferences to change the shortcut. In GNOME shortcuts,
`Super` is the Windows key on most keyboards.

## Shortcuts

| Action | Default shortcut |
| --- | --- |
| Minimize every window in the current workspace except the active one | `Super+Home` |

To change it, open the extension preferences:

```bash
gnome-extensions prefs minimize-otherrs@mateus.local
```

In the shortcut editor:

- Press a new key combination to save it.
- Press `Backspace` to disable the shortcut.
- Press `Escape` to cancel without changing it.
- Use the reset button to restore `Super+Home`.

## Install locally

Install the extension:

```bash
make install
```

Restart GNOME Shell, then enable the extension:

```bash
make enable
```

On Wayland, log out and log back in instead of using `Alt+F2`, `r`.

Manual installation is also possible:

```bash
glib-compile-schemas schemas
mkdir -p ~/.local/share/gnome-shell/extensions/minimize-otherrs@mateus.local/schemas
install -m 0644 metadata.json extension.js prefs.js README.md ~/.local/share/gnome-shell/extensions/minimize-otherrs@mateus.local/
install -m 0644 schemas/org.gnome.shell.extensions.minimize-otherrs.gschema.xml schemas/gschemas.compiled ~/.local/share/gnome-shell/extensions/minimize-otherrs@mateus.local/schemas/
gnome-extensions enable minimize-otherrs@mateus.local
```

## Change the shortcut with gsettings

Set a different accelerator with `gsettings`:

```bash
gsettings --schemadir ~/.local/share/gnome-shell/extensions/minimize-otherrs@mateus.local/schemas \
  set org.gnome.shell.extensions.minimize-otherrs minimize-except-active "['<Super>home']"
```

Replace `'<Super>home'` with the shortcut you want.
