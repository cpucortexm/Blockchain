import { createReducer } from '@reduxjs/toolkit'

const providerInitialState = {
    provider:[],
    network:[],
    account:[],
    etherbalance:[]
}
export const provider = createReducer(providerInitialState, (builder) => {
  builder
    .addCase('PROVIDER_LOADED', (state, action) => {
      state.provider.push(action.connection)
    })
    .addCase('NETWORK_LOADED', (state, action) => {
      state.network.push(action.chainId)
    })
    .addCase('ACCOUNT_LOADED', (state, action) => {
      state.account.push(action.account)
    })
    .addCase('ETHER_BALANCE_LOADED', (state, action) => {
      state.etherbalance.push(action.balance)
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