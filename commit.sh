#!/bin/bash


git fetch

if ! git pull; then
    echo "❌ Git pull failed or has merge conflicts."
    echo "Resolve conflicts first, then run the script again."
    exit 1
fi

read -p "Enter your commit message: " commitMessage

git add .

git commit -m "$commitMessage"

git push