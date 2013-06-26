#!/bin/bash

# Usage: WikiCrawler.sh <end point url> <depth> 

current_page=$1

# Download the end page
page_name=`echo $current_page | egrep '([^/]+$)' -o`
page_name="${page_name//+/_}"
backlinks="http://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/$page_name&limit=500"
curl -s -o "./cache/$page_name.html" $backlinks
path_list[0]="$page_name"

# Create the path
current_page=`./import.py "./cache/$page_name.html"`
for (( i=1; i<=$2; i++ ))
do
	page_name=`echo $current_page | egrep '([^=]+$)' -o`
	page_name="${page_name//+/_}"
	backlinks="http://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/$page_name&limit=500"
	curl -s -o "./cache/$page_name.html" $backlinks
	path_list[i]="$page_name"
	current_page=`./import.py "./cache/$page_name.html"`
done

for (( i=0; i<=$2; i++ ))
do
	path_urls[i]="http://en.wikipedia.org/wiki/${path_list[$i]}"
	echo "{\"goals\": [\"name\": \"${path_list[$i]}\", \"url\": \"${path_urls[$i]}\", \"points\": 5]}"
done

