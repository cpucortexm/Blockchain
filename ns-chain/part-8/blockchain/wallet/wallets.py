import wallet
from wallet import key_pair
import jsonpickle
from pylogger import pylog
import os.path


class Wallets:
    def __init__(self):
        self.wallet_file_path = "wallets.data"
        wallet_file_exists = os.path.exists(self.wallet_file_path)
        if wallet_file_exists:
            self.wallets = self.create_wallets()
        else:
            self.wallets = {}   # mapping between wallet address and class Wallet-public/private key


    def __repr__(self):
        return (f'{self.__class__.__name__}')


    def create_wallets(self):
        return self.load_file()

    def add_wallet(self):
        kp = key_pair()
        w = kp.make_wallet()
        address = w.generate_wallet_address()
        self.wallets[address] = w.wallet_keys   # add only the wallet keys
        return address


    def get_wallet(self, address):  # From the given address, return wallet private/public keys
        return self.wallets[address]

    def get_all_wallet_addresses(self):
        addresses = []
        for addr in self.wallets.keys():
            addresses.append(addr)
        return addresses

    def save_to_file(self):
        if not self.wallets:    # check if dict is empty
            raise Exception("Wallets are empty!")

        encode = jsonpickle.encode(self.wallets)  # encode wallets dict (dict to string)
        # Writing to file
        with open(self.wallet_file_path, "w") as wf:  # we are writing hex-string
            # Writing data to a file
            wf.write(encode)

    def load_file(self):
        fileexists = os.path.exists(self.wallet_file_path)
        if not fileexists:
            raise Exception("Wallet File does not exist!")
        # Reading from file
        with open(self.wallet_file_path, "r") as rf:  # we are writing hex-string
            # Writing data to a file
            encoded_data = rf.read()

        wallets = jsonpickle.decode(encoded_data)   # Should give back the wallets dict (string to dict)
        return wallets

