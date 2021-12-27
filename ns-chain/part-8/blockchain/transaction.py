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
import jsonpickle

logger = pylog.get_custom_logger(__name__)
# Class representing transaction outputs
class TxOut:
    def __init__(self, _value, _pubkey = []):
        self.value = _value    # is an integer (value are mostly in tokens)

        # string (is also called public key hash PKH).This is needed to unlock the tokens in the value field
        # In bitcoin, the PublicKey is calculated using a language called script and is complicated.
        # In our implementation, we will use users address as the PublicKey.
        # e.g. if users address is "Jack" then PublicKey = "Jack" and using this we can unlock
        # the tokens in the value field
        self.PublicKeyHash = _pubkey  # this is actually a hashed public key bytes

    def __str__(self):
        return str(self.__dict__)


# Class representing transaction inputs
class TxIn:
        # The inputs specify which transaction outputs to spend.
        # Please read UTXO in blockchain file.
    def __init__(self, id, out, sig = [], pubKey = []):
        # e.g. if the transaction(say x) has 30 outputs, and we want to reference 
        # only one of them,then the transaction x is represented by ID, and the output with index = Out
        self.ID = id     # list of bytes (hash value of type string), represents a transaction hash
        self.Out = out   # integer: Index to output (i.e previous output index), basically index to the PublicKey of the output

        # The inputs need to be signed. In bitcoin, this is again done using the language script.
        # The signing involves both public key and private key of the user. Public key is the output
        # public key (PKH) while private key is the one which is private to the user.
        # In our case as we will just use the PublicKey of the output (i.e.the user's address) as
        # our signature.
        self.Signature = sig   # bytes (same as PublicKey of output = users address)
        self.PubKey = pubKey  # bytes (public key but not hashed)

    def __str__(self):
        return str(self.__dict__)


# Class representing a transaction
class Tx:
    def __init__(self, id, txins=[], txouts=[]):
        self.ID = id    # list of bytes (hash value of type string), represents a transaction hash of current transaction.
        self.TxIn = txins  # list of TxIn
        self.TxOut = txouts # list of TxOut

    def __str__(self):
        return str(self.__dict__)

    def SetID(self):
        complete_block = str(self.ID)  + str(self.TxIn) + str(self.TxOut)
        msg = bytes(complete_block, 'utf-8')
        self.ID = hashlib.sha256(msg).hexdigest()     # self.ID will be of hex-string type

    def serialize(self):   # Serialize the transaction
        encoded = bytes(jsonpickle.encode(self), 'UTF-8')
        return encoded

    def tx_hash(self):
        hash    = []    # 32 byte hash
        tx_copy = self # create a copy
        tx_copy.ID = None   # set ID to None or empty
        hash    = hashlib.sha256(tx_copy.serialize()).hexdigest() # will be hex-string
        return hash

    def print_Tx(self):
        logger.info("---Transaction---:%s", self.ID)
        for i, txin in enumerate(self.TxIn):
            logger.info("    Input:    %d", i)
            logger.info("    TXID:     %s",txin.ID)
            logger.info("    Out:     %d",txin.Out)
            logger.info("    Signature:    %s",txin.Signature)
            logger.info("    Pubkey:    %s",txin.PubKey)

        for i, txout in enumerate(self.TxOut):
            logger.info("    Output:    %d", i)
            logger.info("    Value:    %d", txout.value)
            logger.info("    Script:    %s", txout.PublicKeyHash)