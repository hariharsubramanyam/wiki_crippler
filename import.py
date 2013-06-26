#!/usr/bin/python2.7

import re
import sys
from random import randint

links_here_re = r'/w/index\.php\?title=Special:WhatLinksHere&amp;target=(?:.*?)"'
prefix = r'en.wikipedia.org/'

valids = None
with open(sys.argv[1], 'r') as f:
	valids = [s.replace('amp;', '').strip('"') for s in re.findall(links_here_re, f.read()) if not (re.search(r'%3A', s) or re.search(r'redirect=', s))]

print 'en.wikipedia.org' + valids.pop(randint(0,len(valids)-1))
