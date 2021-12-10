# @Filename:    transaction.py
# @Author:      Yogesh K
# @Date:        08/11/2021

# In Bitcoin Tx handling is done using script language. Script allows you to program
# the bitcoin such as sending BTC from wallet, create multi user accounts etc.
# With script you can basically create smart contracts on Bitcoin, though with
# limited functionality compared to that of Ethereum.
# Here we will not use script, but define our own transactions

# The trustless system is because of the transactions. In trustless systems everyone
# can verify everything

# Transactions(Tx) represent activity. The more the transactions, the more the people
# are using the blockchain for projects, dapps, smart contracts.

# In Tx, inputs specify which outputs of previous tx to spend
# outputs specify where the money goes.



import hashlib
from pylogger import pylog

# Class representing transaction outputs
class TxOut:
    def __init__(self, _value, _pubkey):
        self.value = _value    # is an integer (value are mostly in tokens)

        # string (is also called public key hash PKH).This is needed to unlock the tokens in the value field
        # In bitcoin, the PublicKey is calculated using a language called script and is complicated.
        # In our implementation, we will use users address as the PublicKey.
        # e.g. if users address is "Jack" then PublicKey = "Jack" and using this we can unlock
        # the tokens in the value field
        self.PublicKey = _pubkey

    def __str__(self):
        return str(self.__dict__)


# Class representing transaction inputs
class TxIn:
        # The inputs specify which transaction outputs to spend.
        # Please read UTXO in blockchain file.
    def __init__(self, id, out, sig):
        # e.g. if the transaction(say x) has 30 outputs, and we want to reference 
        # only one of them,then the transaction x is represented by ID, and the output with index = Out
        self.ID = id     # list of bytes (hash value of type string), represents a transaction hash
        self.Out = out   # integer: Index to output (i.e previous output index), basically index to the PublicKey of the output

        # The inputs need to be signed. In bitcoin, this is again done using the language script.
        # The signing involves both public key and private key of the user. Public key is the output
        # public key (PKH) while private key is the one which is private to the user.
        # In our case as we will just use the PublicKey of the output (i.e.the user's address) as
        # our signature.
        self.Signature = sig   # string (same as PublicKey of output = users address)

    def __str__(self):
        return str(self.__dict__)


# Class representing a transaction
class Tx:
    def __init__(self, id, txins=[], txouts=[]):
        self.ID = id    # list of bytes (hash value of type string), represents a transaction hash of current transaction.
        self.TxIn = txins  # list of NSTxIn
        self.TxOut = txouts # list of NSTxOut

    def __str__(self):
        return str(self.__dict__)

    def SetID(self):
        complete_block = str(self.ID)  + str(self.TxIn) + str(self.TxOut)
        msg = bytes(complete_block, 'utf-8')
        self.ID = hashlib.sha256(msg).hexdigest()     # self.ID will be of string type
