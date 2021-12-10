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

class Wallet:
    def __init__(self, prikey=None, pubkey=None):
        self.private_key = prikey   # keys will be byte arrays
        self.public_key  = pubkey
        self.logger = pylog.get_logger(__name__)

    # Takes public key and calculates hash for this key
    # return hex-string using RIPEMD160 to calculate hash.
    def public_key_Hash(self, pubkey):  # input key will be in hex-string
        pubkey = bytes(pubkey, 'utf-8')  
        pubHash = hashlib.sha256(pubkey).digest() # it is of type bytes
        h = hashlib.new('ripemd160')
        h.update(pubHash)
        public_RipMD = h.hexdigest()  # it is of type hex-string 
        return public_RipMD

    def checksum(self, payload):  # input payload is of type hex-string
        payload = bytes(payload, 'utf-8')
        firstHash = hashlib.sha256(payload).digest() # will be of type string
        secondHash = hashlib.sha256(firstHash).hexdigest()
        # We need to return only the first 4 bytes = 8 characters in hex-string of the second hash.
        return secondHash[:CHECKSUM_LENGTH]

    # To generate an address to each wallet: we need pubkeyhash,version and checksum
    # 1. combine version and pubkeyhash = versionhash
    # 2. pass this to checksum
    # 3. finally add version + pubkeyhash + checksum
    # Note: It makes sense to apply checksum on the whole hash i.e. version + pubkeyhash
    def generate_wallet_address(self):
        pubkeyHash    =  self.public_key_Hash(self.public_key)
        versionedHash = VERSION + pubkeyHash  # combine the pubkey and version
        checksum      = self.checksum(versionedHash)
        fullHash      = versionedHash + checksum # version + pubkeyhash + checksum
        fullHash      = bytes.fromhex(fullHash)  # convert hex-string to bytes
        address       = utils.base58_encode(fullHash)
        self.logger.info("Pub Key:%s", self.public_key)
        self.logger.info("Pub Hash:%s", pubkeyHash)
        self.logger.info("Wallet Address:%s",address)
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



kp = key_pair()
w = kp.make_wallet()
w.generate_wallet_address()


