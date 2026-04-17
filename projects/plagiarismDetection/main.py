__author__ = 'Team: Josh & Nate'
# -*- coding: utf-8 -*-

import time

#Varables inFile and outFile need a text file path for the code to run.
def init():
    inFile = open("text1.txt")
    text = inFile.read()
    inFile.close()

    inFile = open("text2.txt")
    anothertext = inFile.read()
    inFile.close()

    text = wordGroupings(text, 8)
    anothertext = wordGroupings(anothertext, 8)
    outText = plagCheck(text, anothertext)
    outFile = open("outFile.txt", "w")
    for i in outText: outFile.write(str(i).replace("', ", " ").replace("'", "").strip("[").strip("]") + "\n")
    outFile.close()

# This function removes non-alphanumeric characters from text
# This function came from stackover flow.
def stripNonAlphaNum(text):
    import re
    return re.compile(r'\W+', re.UNICODE).split(text)

# This function actually splits a text in to word groupings
# This function came from stackover flow.
def getNGrams(wordlist, n):return [wordlist[i:i+n] for i in range(len(wordlist)-(n-1))]

# This function helps breaks text up into word groupings of
# size 3 to n words by calling getNGrams, converting all text to
# lowercase and specifies min and max word grouping length.
def wordGroupings(wordlist, n):
    wordlist = stripNonAlphaNum(wordlist)
    wordlist = [i.lower() for i in wordlist]
    text = []
    [text.extend(getNGrams(wordlist, i)) for i in range(3, n)]
    return text

# This function retruns the union of the two texts being passed in.
def plagCheck(text1, text2):
    plagList = []
    for i in text1:
        for j in text2:
            if set(i) == set(j) and set(i): plagList.append(i)
    plagList = reduce(plagList)
    return plagList

# This function reduces the list of words being passed in by removing redundant entries
def reduce(wordlist):
    seen = []
    temp = []
    for i in wordlist:
        for j in wordlist:
            if j not in seen:
                seen.append(j)
                temp.append(j)
    plaglist = temp
    i = 0
    while i < len(plaglist):
        for j in temp:
            if set(plaglist[i]).issubset(set(j)) and set(plaglist[i]) != set(j):
                plaglist.remove(plaglist[i])
                i = -1
        i = i+1
    return plaglist

init()
