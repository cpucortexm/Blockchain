#!/usr/bin/env python3
#
# @Filename:    python_string_patterns.py
# @Author:      Yogesh K
# @Date:        14/09/2022

# 1. String count
# Instead of hash map, we can declare a list of 256
# (ascii is max 256). Use ascii val as index and 
# count as value

from curses.ascii import isalnum, isalpha


count = [0]*256
s = "aaabb"

count[ord('a')] += 3
count[ord('b')] += 2



# 2. Use two pointers
# e.g. Find all substrings in string
# e.g. Reverse string



# 3. String Math
# e.g. ascii value of a = ord('a')
# e.g. weight of any char ch = ord('ch') - 96

# e.g. Prepare a set of all chars a-z
set(map(chr, range(ord('a'), ord('z') + 1)))

# e.g. Prepare a set of all string chars 0-9
set(map(chr, range(ord('0'), ord('9') + 1)))


# 4. String sliding windows ()
# Dynamic sliding windows. 
# e.g. Find the longest substring that doesn’t have
# any repeated characters.

# 5. String functions to be remembered
s ="  abcd  "
count() # Returns the number of times a specified value occurs in a string
find() # Searches the string for a specified value and returns the position of where it was found
index() # Searches the string for a specified value and returns the position of where it was found
isalnum() # Returns True if all characters in the string are alphanumeric
isalpha() # Returns True if all characters in the string are alphabets
replace() #Returns a string where a specified value is replaced with a specified value
split() #Splits the string at the specified separator, and returns a list
strip() #strip() method removes any leading (spaces at the beginning) and trailing (spaces at the end) characters
