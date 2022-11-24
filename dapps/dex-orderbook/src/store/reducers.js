import { createReducer } from '@reduxjs/toolkit'

const providerInitialState = {
    provider:[],
    network:[],
    account:[],
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
    .addDefaultCase((state, action) => {})
})

const tokenInitialState = {
    loaded:false,
    contract:null,
    symbol: null
}
export const tokens = createReducer(tokenInitialState, (builder) => {
  builder
    .addCase('TOKEN_LOADED', (state, action) => {
        state.loaded = true
        state.contract= action.token
        state.symbol= action.symbol
    })
    .addDefaultCase((state, action) => {})
})