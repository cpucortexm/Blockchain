# @Filename:    wallet.py
# @Author:      Yogesh K
# @Date:        26/11/2021
# visit https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses
# to know how to generate Bitcoin addresses

from ecdsa import SigningKey,VerifyingKey, SECP256k1
import hashlib    # supports ripemd160 hash algorithm (print(hashlib.algorithms_available))
import utils
from pylogger import pylog


CHECKSUM_LENGTH = 8   # means 4 bytes i.e. 4*2 (not 4 characters)
# creates a single byte starting with 00, this is responsible to generate
# bitcoin wallet address starting with '1'
VERSION  = '00'   
# Data format: VERSION:PUBKEYHASH:CHECKSUM

# As a general note:
# We generate private key of type class 'ecdsa.keys.SigningKey
# and public key of type class 'ecdsa.keys.VerifyingKey'
# This format is not human readable and hence we convert to hex-string
# Thus for actual sigining and verifying, we convert hex-string to
# class 'ecdsa.keys.SigningKey and 'ecdsa.keys.VerifyingKey

class Wallet:
    def __init__(self, prikey=None, pubkey=None):
        self.private_key = prikey   # keys will be hex-strings
        self.public_key  = pubkey
        self.wallet_keys = [self.private_key, self.public_key]  # store the keys as list
        self.logger = pylog.get_logger(__name__)

    # The private key is in hex-string
    # For signing it must be in original form - <class 'ecdsa.keys.SigningKey'> 
    @staticmethod
    def get_signing_key(privkey):
        sk = SigningKey.from_string(bytes.fromhex(privkey), curve=SECP256k1)
        return sk

    # The public key is in hex-string
    # For verifying it must be in original form - <class 'ecdsa.keys.VerifyingKey'> 
    @staticmethod
    def get_verifying_key(pubkey):
        vk = VerifyingKey.from_string(bytes.fromhex(pubkey, curve=SECP256k1))
        return vk

    @staticmethod
    def get_verifying_key_list(signature, message, hashfunc=SECP256k1):
        return VerifyingKey.from_public_key_recovery(signature, 
                                                     message,
                                                     hashfunc)
    @staticmethod
    def verify_signature(vk, signature, message):
        return vk.verify(signature, message)

    # Takes public key and calculates hash for this key
    # return hex-string using RIPEMD160 to calculate hash.
    @staticmethod
    def public_key_Hash(pubkey):  # input key will be in hex-string
        #pubkey = bytes(pubkey, 'utf-8')
        pubkey = bytes.fromhex(pubkey)
        pubHash = hashlib.sha256(pubkey).digest() # it is of type bytes
        h = hashlib.new('ripemd160')
        h.update(pubHash)
        public_RipMD = h.hexdigest()  # it is of type hex-string 
        return public_RipMD

    @staticmethod
    def checksum(payload):  # input payload is of type hex-string
        payload = bytes.fromhex(payload)
        firstHash = hashlib.sha256(payload).digest() # will be of type string
        secondHash = hashlib.sha256(firstHash).hexdigest()
        # We need to return only the first 4 bytes = 8 characters in hex-string of the second hash.
        return secondHash[:CHECKSUM_LENGTH]

    @staticmethod
    def validate_address(address):
        pubKeyHash      = utils.base58_decode(address)
        pubKeyHash      = pubKeyHash.hex()
        actual_checksum = pubKeyHash[len(pubKeyHash)-CHECKSUM_LENGTH:]
        version         = pubKeyHash[0:2]
        pubKeyHash      = pubKeyHash[2 : len(pubKeyHash)-CHECKSUM_LENGTH]
        target_checksum = Wallet.checksum(version + pubKeyHash)

        return target_checksum == actual_checksum

    # To generate an address to each wallet: we need pubkeyhash,version and checksum
    # 1. combine version and pubkeyhash = versionhash
    # 2. pass this to checksum
    # 3. finally add version + pubkeyhash + checksum
    # Note: It makes sense to apply checksum on the whole hash i.e. version + pubkeyhash
    def generate_wallet_address(self):
        pubkeyHash    =  Wallet.public_key_Hash(self.public_key)
        versionedHash = VERSION + pubkeyHash  # combine the pubkey and version
        checksum      = Wallet.checksum(versionedHash)
        fullHash      = versionedHash + checksum # version + pubkeyhash + checksum
        fullHash      = bytes.fromhex(fullHash)  # convert hex-string to bytes
        address       = utils.base58_encode(fullHash)
        #self.logger.info("Pub Key:%s", self.public_key)
        #self.logger.info("Pub Hash:%s", pubkeyHash)
        #self.logger.info("Wallet Address:%s",address)
        return address



class key_pair:    # generate new private and public keys for wallet
    def __init__(self):
        pass

    def new_key_pair(self):
        private_key = SigningKey.generate(curve=SECP256k1) # used in Bitcoin
        public_key  = private_key.get_verifying_key().to_string().hex() # string with exact hex value
        private_key = private_key.to_string().hex() # string with exact hex value
        return private_key, public_key

    def make_wallet(self):
        private,public = self.new_key_pair()
        wallet = Wallet(private, public)
        return wallet



#kp = key_pair()
#w = kp.make_wallet()

#addr = w.generate_wallet_address()

#print(w.validate_address(addr))



#sk = SigningKey.from_string(bytes.fromhex(w.private_key), curve=SECP256k1)
#signature = sk.sign(b"This is yogis message")
#print(sig.hex())
#vklist = VerifyingKey.from_public_key_recovery(signature, b'This is yogis message', SECP256k1)
#vk = VerifyingKey.from_string(bytes.fromhex(w.public_key), curve=SECP256k1)
#print(vk.verify(sig, b"This is yogis message")) # True

#vk0 = vklist[0]
#vk1 = vklist[1]

#print(vk0.pubkey)

#print(vk1.to_string().hex())
#print(vk0.verify(signature, b"This is yogis message"))

