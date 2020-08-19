git add README.md
git commit -m "add $1"
sleep 3
git push
if git push
then
    echo "git push done"
    echo "git done" >> git.log
else
    git push
fi
