# @Filename:    cli.py
# @Author:      Yogesh K
# @Date:        03/11/2021
"""
  This file is part of ns-chain.

    ns-chain is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ns-chain is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ns-chain.  If not, see <https://www.gnu.org/licenses/>.
 """

import argparse
import sys
from blockchain import Chain
from pylogger import pylog
import blockchain_test
import tx
import wallets
import utils
from wallet import Wallet

def print_blockchain():
    bc.print_nschain()

def create_blockchain(args):
    if not Wallet.validate_address(args.address):
        raise Exception("Address not valid!")

    logger.info("Adding address to the chain : %s", args.address)
    bc.init_blockchain(args.address)
    logger.info("Finished!")

def get_balance(args):
    # first validate the wallet address
    if not Wallet.validate_address(args.address):
      raise Exception("Address not valid!")

    chain = bc.continue_blockchain(args.address)  # to check if blockchain exists
    balance = 0
    pubKeyHash = utils.base58_decode(address)
    pubKeyHash = pubKeyHash.hex()
    pubKeyHash = pubKeyHash[1:len(pubKeyHash) - 4]
    UTXOs = Chain.find_UTXO(pubKeyHash)

    for out in UTXOs:
      balance += out.value

    logger.info("Balance of %s:%d", args.address, balance)

def send(args):
    if not Wallet.validate_address(args.fromaddr):
        raise Exception("From Address not valid!")

    if not Wallet.validate_address(args.toaddr):
        raise Exception("To Address not valid!")

    chain = bc.continue_blockchain(args.fromaddr) # to check if blockchain exists
    transaction = tx.New_Transaction(bc, args.fromaddr, args.toaddr, args.amount)
    bc.add_block(transaction)
    logger.info("Success!")


def list_wallet_addresses():
    ws = wallets.Wallets()
    addresses = ws.get_all_wallet_addresses()
    for addr in addresses:
      logger.info(addr)

def create_wallet():
    ws = wallets.Wallets()
    address = ws.add_wallet()
    ws.save_to_file()
    logger.info("New address is:%s", address)

def test_chain():
    # Set the static class variable of test file(=blockchain) to the blockchain(bc) to be tested
    # There can be other better methods like using parameterized constructors with pytest,
    # instead of using static class variables for writing tests.
    blockchain_test.TestNSChain.blockchain = bc
    blockchain_test.start_blockchain_tests()


if __name__ == '__main__':

    # variables here will be global
    bc = None  # Create blockchain
    # Use subparser if you want different arguments to be permitted
    # based on the command being run
    parser     = argparse.ArgumentParser()
    subparser  = parser.add_subparsers(dest='command')
    getbalance = subparser.add_parser('getbalance')
    createchain= subparser.add_parser('createblockchain')
    printchain = subparser.add_parser('printchain')
    transact   = subparser.add_parser('send')
    createwallet = subparser.add_parser('createwallet', help='Creates a new wallet')
    list_wallet_addr = subparser.add_parser('list_wallet_addr', help='List all wallet addresses')
    verifychain = subparser.add_parser('test')

    getbalance.add_argument('--address',type=str,required= True, help='get balance for the address')
    createchain.add_argument('--address',type=str,required= True, help='create blockchain for the address')
    transact.add_argument('--fromaddr',type=str,required= True, help='source wallet address')
    transact.add_argument('--toaddr',type=str,required= True, help='destination wallet address')
    transact.add_argument('--amount',type=int,required= True, help='amount to be sent')

    if len(sys.argv) < 2:
      parser.print_help()
      sys.exit()

    args = parser.parse_args()
    bc = Chain()  # Create blockchain object
    # args.command is either 'print' or 'add', see subparser above
    logger = pylog.get_logger(__name__)
    if args.command == 'printchain':   # print an existing blockchain
      print_blockchain()

    elif args.command == 'createblockchain':   # create a blockchain
      create_blockchain(args)

    elif args.command == 'getbalance':
      get_balance(args)

    elif args.command == 'send':
      send(args)

    elif args.command == 'createwallet':
      create_wallet()

    elif args.command  == 'list_wallet_addr':
      list_wallet_addresses()

    elif args.command == 'test': # verify the blockchain created is fine by performing unit tests 
      test_chain()
