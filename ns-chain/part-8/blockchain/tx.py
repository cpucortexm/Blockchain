from transaction import TxIn, TxOut, Tx
import blockchain as blockchain
from pylogger import pylog
from wallet import Wallet
import wallets
import utils

logger = pylog.get_custom_logger(__name__)
# Called during Genesis block creation. The first tx is called Coinbase tx
# ToDo: Can be a class method as it creating a new object of type Tx
def CoinbaseTx(data, to):
    if not data:    # if data is empty string (i.e. data = "")
        data = 'Coins to {}'.format(to)
    # data must be the hex-string of the given string
    # first convert to bytes and then take hex to get ascii representation of string 
    txin  = TxIn([], -1, None, bytes(data, 'utf-8').hex()) # start with empty hash and -1 for coinbaseTx
    txout = new_TxOutput(100, to)
    tx    = Tx(None, [txin], [txout])

    tx.SetID()
    return tx

# Creating new transactions
def New_Transaction(bc, tx_from, tx_to, amount):
    inputs = []   # list of type class TxIn
    outputs = []  # list of type class TxOut

    ws = wallets.Wallets()
    wk = ws.get_wallet(tx_from)  # wk[0] = private key and wk[1] = public key
    pubKeyHash = Wallet.public_key_Hash(wk[1]) # wk[1] is wallet_keys[1] = is public_key

    acc, validOutputs = blockchain.Chain.find_SpendableOutputs(pubKeyHash, amount)
    if acc < amount:
        raise Exception("Error: not enough funds")

    for txID, outs in validOutputs.items():  # iterate through dict (key = string(ID), value = list(array) of int's)
        for out in outs:    # loop through the values (list(array) of int's)
            tx_input =  TxIn(txID, out, None, wk[1])
            inputs.append(tx_input)

    outputs.append(new_TxOutput(amount, tx_to))
    if acc > amount:  # if there is a leftover token of the senders account
        outputs.append(new_TxOutput(acc-amount, tx_from))

    tx = Tx(None,inputs,outputs)
    tx.ID = tx.tx_hash()
    bc.sign_transaction(tx, wk[0]) # wk[0] is private key
    return tx



# Sign a given transaction tx
def sign_Tx(tx, privkey, prevTxs):   # prevTxs is a map of key = ID(hash),value = Tx
    # for coinbase we just return as no signing needed for coinbase
    if is_Coinbase(tx):
        return
    # We must sign only if the prev transactions had a valid ID.
    for inTx in tx.TxIn:
        if prevTxs[inTx.ID].ID == None:  # prevTxs[inTx.ID] will be a Tx as key is ID(hex-string)
            raise Exception("Error: Previous transaction does not exist")

    txCopy = trimmed_tx_copy(tx)
    # Now we go through every Tx input of the TxCopy
    for idx, inTx in enumerate(txCopy.TxIn):
        prevTx = prevTxs[inTx.ID]
        txCopy.TxIn[idx].Signature = None
        txCopy.TxIn[idx].PubKey = prevTx.TxOut[inTx.Out].PublicKeyHash
        txCopy.SetID()   # calculate hash of the txcopy
        txCopy.TxIn[idx].PubKey = None

        # now sign the actual Tx (not the copy) using the private key. 
        # We sign the hash ID as it represents 
        # the whole Tx message, like sig = sk.sign(b"message")
        # sign message must be in bytes
        sk = Wallet.get_signing_key(privkey)
        signature = sk.sign(bytes.fromhex(txCopy.ID))
        tx.TxIn[idx].Signature = signature.hex()

# Return a bool if all the transactions are verified
def verify_Tx(tx, prevTxs):
    if is_Coinbase(tx):
        return True

    # We can verify only if the prev transactions had a valid ID.
    for inTx in tx.TxIn:
        if prevTxs[inTx.ID].ID == None:  # prevTxs[inTx.ID] will be a Tx as key is ID(hex-string)
            raise Exception("Error: Previous transaction does not exist")

    txCopy = trimmed_tx_copy(tx)

    # Now we go through every Tx input of the TxCopy
    for idx, inTx in enumerate(txCopy.TxIn):
        prevTx = prevTxs[inTx.ID]
        txCopy.TxIn[idx].Signature = None
        txCopy.TxIn[idx].PubKey = prevTx.TxOut[inTx.Out].PublicKeyHash
        txCopy.SetID()   # calculate hash of the txcopy
        txCopy.TxIn[idx].PubKey = None

        # Regenerate public key (verifying key) from the signature
        # Generates two public keys pk1, pk2 corresponding to x,y and x,-y on
        # elliptic curve.
        # VerifyingKey.from_public_key_recovery(signature,message, SECP256k1), where
        # signature is the actual tx.TxIn signature
        # message will be the txCopy.ID as we had signed this ID, see above
        # message and signature must be in bytes
        vklist = Wallet.get_verifying_key_list(  bytes.fromhex(tx.TxIn[idx].Signature), 
                                                 bytes.fromhex(txCopy.ID),
                                              )
        # vk0 and vk1 will be two public keys from the above list
        vk0 = vklist[0]   # x,y on ecc
        vk1 = vklist[1]   # x,-y on ecc

        # lets use the first one to verify the signature
        result = Wallet.verify_signature(  vk0,
                                           bytes.fromhex(tx.TxIn[idx].Signature),
                                           bytes.fromhex(txCopy.ID)
                                        )
        if result == False:
            return False

    return True   # all input signatures got verified

def trimmed_tx_copy(tx):
    txinputs = []
    txoutputs = []
    for txin in tx.TxIn:
        txinputs.append(TxIn(txin.ID, txin.Out, None, None))

    for txout in tx.TxOut:
        txoutputs.append(TxOut(txout.value,txout.PublicKeyHash))

    tx_Copy = Tx(tx.ID, txinputs, txoutputs)

    return tx_Copy

def is_Coinbase(tx):   # returns true or false
    if type(tx) is not Tx:
        raise Exception("Input must be of Tx type")
    return (len(tx.TxIn) == 1  and len(tx.TxIn[0].ID) == 0  and tx.TxIn[0].Out == -1)


# Function to lock the outputs
def new_TxOutput(value, address):
    txo = TxOut(value, None)
    lock(txo, address)
    return txo


def uses_key(txin, pubKeyHash):
    if type(txin) is not TxIn:
        raise Exception("Input must be of TxIn type")

    locking_Hash = Wallet.public_key_Hash(txin.PubKey)  # will be a hex-string
    return locking_Hash == pubKeyHash   # return true or false

# populate public key hash for txout
def lock(txout, address):
    if type(txout) is not TxOut:
        raise Exception("Output must be of TxOut type")
    pubkeyHash =  utils.base58_decode(address)   # will be in bytes
    pubkeyHash      = pubkeyHash.hex()
    pubkeyHash      = pubkeyHash[2 : len(pubkeyHash)-8]    
    txout.PublicKeyHash = pubkeyHash
    #Note: Another way to achieve the same as above
    #pubkeyHash = pubkeyHash[1:len(pubkeyHash) - 4] # remove Version Info and checksum
    #txout.PublicKeyHash = pubkeyHash.hex()   # convert to hex-string

def is_locked_with_key(txout, pubKeyHash):
    return txout.PublicKeyHash == pubKeyHash    # return true or false
