.PHONY: \
	clean \
	help-dialog \
	publish-tags

#
# All build steps that include repeatable processes based on dependencies
# should go here instead of scripts.
#

clean:
	rm help_dialog.html

help-dialog: help_dialog.html

help_dialog.html: Help.md assets/templates/help_dialog.html
	echo "$$(npx marked Help.md)" | sed -e '/%%%CONTENT%%%/{r /dev/stdin' -e 'd;}' \
		assets/templates/help_dialog.html > help_dialog.html

publish-tags:
	git push --tags origin
