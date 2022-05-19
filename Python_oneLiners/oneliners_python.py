#!/usr/bin/env python3
#
# @Filename:    oneliners_python.py
# @Author:      Yogesh K
# @Date:        16/05/2022
# Description: One liners for python (compressed code mostly used)


# 1: Ternary Operator
###############################
#    var = x if c else y:
#    print(var)
###############################

var = 12 if 3<2 else 35
print(var)


# 2: List comprehension for creating a list
###################################################
# Use List comprehension, if the purpose of the loop is to create a list
# Instead of 
# squares =[]
#  for i in range(0,10):
#     squares.append(i*i)
###################################################
squares = [i**2 for i in range(10)]


# 3: List comprehension for creating a list with if condition
####################################################
# Instead of
# squares = []
# for i in range(10):
#    if i%2==0:
#        squares.append(i**2)
####################################################
even_squares = [i**2 for i in range(10) if i%2==0]


# 4: List comprehension to change multiline to single line
# Instead of 
# a = [1, 2, 3, 4]
# b = []
# for x in a:
#    b.append(x+1)
a = [1, 2, 3, 4]
b = [x+1 for x in a]

# 5: List comprehension for double "for loop" iteration
# Instead of
# for x in iter1:
#   for y in iter2:
#      print(x,y)
iter1= [1,2,3]
iter2 = ['a','b','c']
[print(x, y) for x in iter1 for y in iter2]



# 6: Using Ternary like Operator for Recursion

def fac(x): return 1 if x<=1 else x * fac(x-1)
print(fac(10))


# 7: Using Lambda function for Recursion
# Argument will be x (In lambda function we cannot use return statement)

fac = lambda x: 1 if x<=1 else x * fac(x-1)
print(fac(10))


# 8: One line Regex , match a pattern in a 
# 
import re; print(re.findall('F.*r', 'Learn Python with Finxter'))

# 9. String replace

x= "mystr".replace("yst", "zub")
print(x)



# 10: Lambda Function
###################################################
# f = lambda x: x+1 creates a function f that increments
# the argument x by one and returns the result: f(2) returns 3.
###################################################
f2 = lambda x: str(x * 3) + '!'
print(f2(1))
print(f2('python'))
##############################



# 11: Map, Filter and Reduce take 
# 1st param: lambda function
# 2nd param: Iterable such as list, tuples etc

# For map() and filter(), the output would be an object,
# you need to create a list or tuple from the object by
# using list(map())

items = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, items))
print(squared)


number_list = range(-5, 5)
less_than_zero = list(filter(lambda x: x < 0, number_list))
print(less_than_zero)

# Reduce applies a rolling computation to sequential pairs of values in a list.
# e.g 1*2=2, 2*3= 6, 6*4 = 24
from functools import reduce
product = reduce((lambda x, y: x * y), [1, 2, 3, 4])
print(product)
