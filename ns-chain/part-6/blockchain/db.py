# @Filename:    db.py
# @Author:      Yogesh K
# @Date:        25/10/2021

# levelDB is a key-value database and it sorts the elements as per keys.
# The key-value are written in bytes datatype hence we use serializer and deserializer
# to pack and unpack data in bytes/dict format

import json
import jsonpickle
import plyvel
from pylogger import pylog
import transaction
from collections import namedtuple


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
class Db:
    def __init__(self):
        self.path = 'nschain.db'
        self.logger = pylog.get_logger(__name__)
        try:
            self.db = plyvel.DB(self.path, create_if_missing=True)
        except:
            self.logger.error("Failure to open database")

    def __del__(self):
        self.db.close() # closes the database needed for clean shutdown

    def __repr__(self):
        return (f'{self.__class__.__name__}')

    # Convert dict to bytes as needed by leveldb
    def write_block(self,block):
        try:
            key,value = self.serialize(block) # ToDo: hAndle error during write
            self.db.put(key,value)
        except:
            self.logger.error("Failure to write the block to database") 


    # We use json-pickle encode to serialise (convert dict to string)
    def serialize(self, block):
        key   = bytes(block['hash'], 'UTF-8')
        value = bytes(jsonpickle.encode(block), 'UTF-8')
        return key,value

    # We use json-pickle decode to deserialise (convert string to dict)
    def deserialize(self,data):
        return jsonpickle.decode(data)
   
    def read_block(self, key):   
        try:
            serialised_val = self.db.get(bytes(key,'UTF-8')) # given key must be in bytes
            block = self.deserialize(serialised_val)
            return block
        except:
            self.logger.error("Failure to read the block from database")
    
    def read_last_hash(self):
        lh =  self.db.get(bytes('lh', 'UTF-8'))
        return None if not lh else lh.decode() # convert bytes to string using decode

    def write_last_hash(self, block):
        try:
            key  = bytes(block['hash'],'UTF-8')  # ToDO : handle error during write
            self.db.put(bytes('lh', 'UTF-8'), key)   # write last hash to db
        except:
            self.logger.error("Failure to add hash to database")



if __name__ == '__main__': # test database file
    d = Db()

    block1 = {'hash': '0000b35bd06b847e3cee91d2ca6806e0c8041f93776faf48df37dea6eed3c692', 'data': 'NS-Genesis', 'prevHash': '', 'nonce': 10143345}
    d.write_block(block1)

    block2 = {'hash': '0000c35bd06b847e3cee91d2ca6806e0c8041f93776faf48df37dea6eed3c692', 'data': 'NS-Genesis', 'prevHash': '0000b35bd06b847e3cee91d2ca6806e0c8041f93776faf48df37dea6eed3c692', 'nonce': 10143345}
    d.write_block(block2)

    block3 = {'hash': '0000d35bd06b847e3cee91d2ca6806e0c8041f93776faf48df37dea6eed3c692', 'data': 'NS-Genesis', 'prevHash': '0000c35bd06b847e3cee91d2ca6806e0c8041f93776faf48df37dea6eed3c692', 'nonce': 10143345}
    d.write_block(block3)

    d.write_last_hash(block3)
    lh = d.read_last_hash()
    print(lh)
    
    nschain = []  # start with empty list
    while lh: # for genesis block, prev hash is empty=""
        currblock = d.read_block(lh) # read the last block
        print(currblock)
            # we use insert instead of append. We need to append in reverse direction
            # is an expensive operation because of shift involved. Use deque()
            # instead of list
        nschain.insert(0, currblock)
        lh = currblock['prevHash']



