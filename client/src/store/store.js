import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import {uri} from "../DataService";

Vue.use(Vuex);

const paymentFields = ["Name", "ID", "Description", "Date", "Amount"]

//Store for retrieving and storing payment information
export default new Vuex.Store({
    state: {
        pendingRequests: 0,
        fetchingPayments: false,
        payments: [],
        paymentCount: 0,
        itemsPerRequest: 10,
        sortBy: 'Date',
        sortDir: 'desc',
        lastRequest: null,
        filters: {},
        schema: ["ID","Name","Date","Amount", "Description"],
        refresh: true
    },
    actions: {

        //TODO: Create seperate service to handle api calls
        fetchPayments({state, commit},req) {
            if(state.fetchingPayments){
                return;
            }
            commit('REQUEST_STARTED');
            commit('START_FETCHING_PAYMENTS');
            axios.get(uri+'/api/payments',{params:req}).then((res) => {
                commit('REQUEST_COMPLETED');
                commit('FINISH_FETCHING_PAYMENTS');
                for(var i in res.data){
                    res.data[i].editing = false;
                }
                if(state.refresh)
                    commit('SET_PAYMENTS', res.data);
                else
                    commit('APPEND_PAYMENTS', res.data);
                commit('APPEND_TO_TABLE');
            });
        },
        toggleSortDirection({commit}) {
            commit('TOGGLE_SORT_DIRECTION');
            this.dispatch('getPayments');
        },
        setSortBy({commit}, key){
            commit('SET_SORT_BY', key);
            this.dispatch('getPayments');
        },
        getPayments({getters, commit}){
            let request = getters.firstRequest;
            this.dispatch('fetchPayments', request);
            commit('REFRESH_TABLE');
        },
        getMorePayments({commit, getters}){
            let request = getters.nextRequest;
            this.dispatch('fetchPayments', request);
            commit('APPEND_TO_TABLE');
        }
    },
    mutations: {
        SET_PENDING_REQUESTS(state,pendingRequests){
            state.pendingRequests = pendingRequests;
        },
        REQUEST_COMPLETED(state){
            state.pendingRequests--;
        },
        START_FETCHING_PAYMENTS(state){
            state.fetchingPayments = true;
        },
        FINISH_FETCHING_PAYMENTS(state){
            state.fetchingPayments = false;
        },
        REQUEST_STARTED(state){
            state.pendingRequests++;
        },
        TOGGLE_SORT_DIRECTION(state){
            if(state.sortDir == 'desc'){
                state.sortDir = 'asc';
            }
            else {
                state.sortDir = 'desc';
            }
        },
        SET_SORT_BY(state, sortBy){
            if(paymentFields.includes(sortBy)){
                state.sortBy = sortBy;
            }
        },
        SET_PAYMENTS(state, payments){
            console.log(state);
            state.payments = payments;
            console.log('set');
        },
        APPEND_PAYMENTS(state, payments){
            console.log(state);
            state.payments = state.payments.concat(payments);
            console.log('append');
        },
        REFRESH_TABLE(state){
            state.refresh = true;
        },
        APPEND_TO_TABLE(state){
            state.refresh = false;
        }
    },
    getters: {
        lastRequest(state){
            return state.lastRequest;
        },
        nextRequest(state){
            //get the next request when loading more payments (scrolling down)
            let req = {};
            req.skip = state.payments.length;
            req.limit = state.itemsPerRequest;
            req.sortBy = state.sortBy;
            req.sortDir = state.sortDir;
            req.filters = state.filters;
            return req;
        },
        firstRequest(state){
            //the request when refreshing the table
            let req = {};
            req.skip = 0;
            req.limit = state.itemsPerRequest;
            req.sortBy = state.sortBy;
            req.sortDir = state.sortDir;
            req.filters = state.filters;
            return req;
        },
        paymentById(state, id){
            let payment = state.payments[id];

            return payment;
        }
    }
});