# Base58 encoding was designed to encode Bitcoin addresses. It has the following 
# characteristics:
# - its alphabet avoids similar looking letters (0,O, L, I)
# - it does not use non-alphanumeric characters
# These features help humans to make less errors and allows direct 
# inclusion in filenames and URLs.

import base58

def base58_encode(input):   # input must be in bytes
    encode = base58.b58encode(input).decode("utf-8")
    return encode     # will be in hex-string

def base58_decode(input):   # input must be in hex-string 
    decode = base58.b58decode(input)
    return decode    # will be in bytes
