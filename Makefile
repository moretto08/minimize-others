UUID = minimize-otherrs@mateus.local
EXTENSION_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

.PHONY: schemas install enable disable clean

schemas:
	glib-compile-schemas schemas

install: schemas
	mkdir -p "$(EXTENSION_DIR)/schemas"
	install -m 0644 metadata.json extension.js prefs.js README.md "$(EXTENSION_DIR)/"
	install -m 0644 schemas/org.gnome.shell.extensions.minimize-otherrs.gschema.xml schemas/gschemas.compiled "$(EXTENSION_DIR)/schemas/"

enable:
	gnome-extensions enable "$(UUID)"

disable:
	gnome-extensions disable "$(UUID)"

clean:
	rm -f schemas/gschemas.compiled

ZIP := $(UUID).zip

zip:
	rm -f $(ZIP)
	zip -r $(ZIP) . \
		-x "*.git*" \
		-x "schemas/gschemas.compiled" \
		-x "$(ZIP)"
