#!/usr/bin/env python3
#
# @Filename:    python_string_patterns.py
# @Author:      Yogesh K
# @Date:        14/09/2022

# 1. String count
# Instead of hash map, we can declare a list of 256
# (ascii is max 256). Use ascii val as index and 
# count as value

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
lower() # to lower
upper() # to upper

# 6 Technique to convert a number into digits
# e.g. n = 1024 will be [1,0,2,4]
n = 1024
digits = [int(d) for d in str(n)]

# -------------------------------------------------------------------#

# Other general techniques to problem solving leetcode/hackerank
# for string and arrays:

# 1. two pointer dynamic or static
# 2. use hash map - dict
# 3. stack - push pop
# 4. using set()
# 5. convert to list() and operate
# 6. regex
# 7. combination of set + list enumeration OR dict + listEnumeration
# 8. recursion
# 9. Start from last char of the string (i.e. operate from last to first)
# 10. For-while loop with proper conditions like -while(x and y)
# 11. binary search
# 12. sort() and then solve the problem
# 13. freq = [0]*26, for two strings, calculating count of chars


# -------------------------------------------------------------------#

# Remember these specific string patterns

# Problem 1: Make a super reduced string.
# In each operation, select a pair of adjacent letters that match, 
# and delete them. Delete as many characters as possible using this 
# method and return the resulting string
# e.g. s ='aab', return a
# e.g. s = 'abba', return Empty
# e.g. s = 'aaabccddd' return abd

# Approach:
# 1. Use stack approach. push() and pop(). Compare current
# char with top of stack to pop (chars which match), else push()
# 2. Convert str to list, index = 1 and start comparing index-1 
# with index. while loop with pop() and reset index= 1

# -------------------------------------------------------------------#

# Problem 2: Two characters
# Given a string, remove characters until the string is made up of 
# any two alternating characters. Determine the longest string possible
# that contains just two alternating letters.
# PS: When you choose a character to remove, all instances of that 
# character must be removed.
# e.g. s = 'beabeefeab', return 5 (babab)
# e.g. s = 'abaacdabd', return 4 (bdbd)

# Approach: 
# Uses a combination of set(), two for loops for the chars of the set 
# (c1,c2), list comprehension to check if the char in string is part of
# if(c1,c2), then add it to the list. Convert this list to a string
# and pass it to isAlternating() which checks if the given string is 
# alternating, else returns false. Based on this calculate the maxlen
# Note: This uses actually 3 for loops and a isAlternating() function

# -------------------------------------------------------------------#

# Problem 3: Encryption
# A given string (with length = L) is written in the format with rows and cols
# The encoded message is obtained by displaying the characters of each column,
# with a space between column texts. 
# e.g. s = chillout, rows = 3 and cols = 3
# chi
# llo
# ut
# encrypted = 'clu hlt io'

# Approach:
# Dont follow the regular approach of making the strings 'chi', 'llo' and 'ut'
# Instead we approach with a loop for cols (i) and directly access the chars from the string
# by using a variable called j and while loop. The while loop condition will be i + j < L
# and j keeps incrementing with j = j + col. Keep appending these chars to a list and convert
# this to a string after exit of while loop using ''.join(list)

