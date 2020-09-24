# Split bash string by newline characters
# must \r\n
IFS=$'\r\n' read -rd '' -a title <<<"$1"

if [ -e kb_data/kb_data.kb.tar.gz ]
then
    echo yes | kb import kb_data/kb_data.kb.tar.gz
else
    echo 'no data'
fi

kb add -t "${title}" -b "$1" -c "$2"

if ! [ -e kb_data ]
then 
    mkdir kb_data
fi

kb export --file kb_data/kb_data
