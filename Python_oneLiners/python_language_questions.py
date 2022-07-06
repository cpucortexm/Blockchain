#!/usr/bin/env python3
#
# @Filename:    python_language_questions.py
# @Author:      Yogesh K
# @Date:        30/06/2022

# Q What are Closures
'''
A closure is a function returning an internal function and having access to local 
variables of the outer function (ie. the state of the outer function).The returned 
function can be a regular function or a lambda function. Thus closure allows access
to state (variables) of the outer function even after its execution.
'''
# e.g. closure with regular function

def multiplier(x):
    def multiply(y):
        return x * y
    return multiply    # return the address of multiply
    
m1 = multiplier(1)
m2 = multiplier(2)
m3 = multiplier(3)

print(m1(10))
print(m2(10))
print(m3(10))


# prints 10, 20 ,30


#e.g. closure with lambda function
multipliers = [lambda y:x*y for x in range(1,4)]
print(multipliers[0](10))
print(multipliers[1](10))
print(multipliers[2](10))

# prints 30, 30 ,30

# multipliers is a list of closures (lambda funtions)
# python evaluates x when you call the multipliers(10), multipliers(10), and multipliers(10). At the moment the closures execute, x is 3.
# That’s why you see the same result 

# To solve this problem you can save the value of x for each closure, like below

def save_x(x):
	return lambda y: x*y

multipliers = [save_x(x) for x in range(1,4)]

print(multipliers[0](10))
print(multipliers[1](10))
print(multipliers[2](10))

# prints 10, 20 ,30

# Use case of closure
# 1. Lets say we want to multiply a value with other values in a  function.
# This can be done using global variables, but then avoid using global variables
# and use closure as it helps retain the state between function calls


# Q Iterators vs Generators
'''
Iterator is implemented using a class and has __iter__ and __next__ methods added.
Used when you want to add extra functionality to the class of iterator.
To create an iterator, it = iter(list), to get elements next(it)

Generators use yield method and are a simple way to implement iterators without any
classes. Suitablle when you dont need additional features like an Iterator class.

Note: iterators or generators can be used only once. After its usage it cannot be used 
again.
'''

# generator function with yield
def simpleGeneratorFun():
    yield 1
    yield 2
    yield 3

for value in simpleGeneratorFun(): 
    print(value)

# will print 1 2 3

# yield suspends function execution and returns back where it left as it keeps
# the state intact. Use yield when we want to iterate over a sequence, but don’t want 
# to store the entire sequence in memory.



# Q3 Decorators
# Are used to decorate a function and make use of closures.

# e,g, square_area(length) and square_perimeter(length) want to ensure that the 
# length must not be non zero.


def square_area(length):
    return length**2

def square_perimeter(length):
    return 4 * length

# in the above function, if we pass length = -1, then area will be -1 and perimeter
# will be -4

# We will add a decorator for this


def safe_check(func):   # safe_check is a decorator

    def is_safe(length):
        if length <=0:
            raise ValueError("length cannot be -ve or 0")

        return func(length)    # we need to return here, else the return of func(length) cannot
                        # be returned to the caller 

    return is_safe   # return a closure


# redefine the above area and perimeter functions
@safe_check
def square_area_with_decorator(length):
    return length**2

@safe_check
def square_perimeter_with_decorator(length):
    return 4 * length

print(square_area_with_decorator(3))
print(square_perimeter_with_decorator(3))
