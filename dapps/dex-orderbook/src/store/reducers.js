import { createReducer } from '@reduxjs/toolkit'

const providerInitialState = {
  // No need to maintain array here, as it will keep pushing to previous elements.
  // In case of array, as we keep pushing or updating, re-render does not happen because 
  // the object reference does not change.
  // We only need latest update for: provider, account, balance and network info to be stored
  // After update of any value, it results in re-render.
    provider:null,
    network:null,
    account:null,
    etherbalance:null
}
export const provider = createReducer(providerInitialState, (builder) => {
  builder
    .addCase('PROVIDER_LOADED', (state, action) => {
      state.provider = action.connection
    })
    .addCase('NETWORK_LOADED', (state, action) => {
      state.network = action.chainId
    })
    .addCase('ACCOUNT_LOADED', (state, action) => {
      state.account = action.account
    })
    .addCase('ETHER_BALANCE_LOADED', (state, action) => {
      state.etherbalance = action.balance
    })
    .addDefaultCase((state, action) => {})
})

const tokenInitialState = {
    loaded:false,
    contracts:[],
    symbols: []
}
export const tokens = createReducer(tokenInitialState, (builder) => {
  builder
    .addCase('TOKEN_1_LOADED', (state, action) => {
        state.loaded = true
        state.contracts = [...state.contracts,action.token]
        state.symbols = [...state.symbols,action.symbol]
    })
    .addCase('TOKEN_2_LOADED', (state, action) => {
        state.loaded = true
        state.contracts = [...state.contracts,action.token]
        state.symbols = [...state.symbols,action.symbol]
    })
    .addCase('TOKEN_3_LOADED', (state, action) => {
        state.loaded = true
        state.contracts = [...state.contracts,action.token]
        state.symbols = [...state.symbols,action.symbol]
    })
    .addDefaultCase((state, action) => {})
})

const exchangeInitialState = {
    loaded:false,
    contracts:[]
}
export const exchange = createReducer(exchangeInitialState, (builder) => {
  builder
    .addCase('EXCHANGE_LOADED', (state, action) => {
        state.loaded = true
        state.contracts = [...state.contracts,action.exchange]
    })
})