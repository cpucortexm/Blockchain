from transaction import TxIn, TxOut, Tx
import blockchain as blockchain
from pylogger import pylog

# Called during Genesis block creation. The first tx is called Coinbase tx
# ToDo: Can be a class method as it creating a new object of type Tx
def CoinbaseTx(data, to):
    if not data:    # if data is empty string (i.e. data = "")
        data = 'Coins to {}'.format(to)

    txin  = TxIn([], -1, data) # start with empty hash and -1 for coinbaseTx
    txout = TxOut(100, to)
    tx  = Tx(None, [txin], [txout])

    tx.SetID()
    return tx

# Creating new transactions
def New_Transaction(tx_from, tx_to, amount):
    inputs = []   # list of type class TxIn
    outputs = []  # list of type class TxOut
    logger = pylog.get_custom_logger(__name__)

    acc, validOutputs = blockchain.Chain.find_SpendableOutputs(tx_from, amount)
    if acc < amount:
        logger.error("Error: not enough funds")

    for txID, outs in validOutputs.items():  # iterate through dict (key = string(ID), value = list(array) of int's)
        for out in outs:    # loop through the values (list(array) of int's)
            tx_input =  TxIn(txID, out, tx_from)
            inputs.append(tx_input)

    outputs.append(TxOut(amount, tx_to))
    if acc > amount:  # if there is a leftover token of the senders account
        outputs.append(TxOut(acc-amount, tx_from))

    tx = Tx(None,inputs,outputs)
    tx.SetID()    # sets the hash of the transaction
    return tx


def IsCoinbase(tx):   # returns true or false
    if type(tx) is not Tx:
        raise Exception("Input must be of Tx type")
    return (len(tx.TxIn) == 1  and len(tx.TxIn[0].ID) == 0  and tx.TxIn[0].Out == -1)

def CanUnlock(data, txin): # returns true or false
    if type(txin) is not TxIn:
        raise Exception("Input must be of TxIn type")
    return txin.Signature == data

def CanBeUnlocked(data, txout): # returns true or false
    if type(txout) is not TxOut:
        raise Exception("Output must be of TxOut type")
    return txout.PublicKey == data
