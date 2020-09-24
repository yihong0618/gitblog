# Split bash string by newline characters
IFS=$'\n' read -rd '' -a title <<<"$1"

echo yes | kb import kb_data/kb_data.kb.tar.gz

kb add -t "${title}" -b "$1" -c "$2"
kb export --file kb_data/kb_data
