import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import {uri} from "../DataService";
import generatePageRange from "../scripts/paginate";
import { isNumber } from "util";

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
        searchText: '',
        searchField: 'Name',
        schema: ["ID","Name","Date","Amount", "Description"],
        refresh: true,
        pageButtons: [1],
        selectedPage: 1
    },
    actions: {

        //TODO: Create seperate service to handle api calls
        fetchPayments({state, commit},req) {
            if(state.fetchingPayments){
                return;
            }
            commit('REQUEST_STARTED');
            commit('START_FETCHING_PAYMENTS');
            commit('SET_LAST_REQUEST');

            var promise = axios.get(uri+'payments',{params:req}).then((res) => {
                commit('REQUEST_COMPLETED');
                commit('FINISH_FETCHING_PAYMENTS');
                let data = res.data.data;
                let count = res.data.count;

                for(var i in data){
                    data[i].editing = false;
                    data[i].expand = false;
                }
                if(state.refresh){
                    commit('SET_PAYMENTS', data);
                    commit('SET_COUNT', count)
                }
                else
                    commit('APPEND_PAYMENTS', res.data);
                commit('APPEND_TO_TABLE');
                commit('CALCULATE_PAGE_BUTTONS');
                return res;
            }).catch((err) => {
                console.log(err);
            });
            return promise;
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
            commit('REFRESH_TABLE');
            return this.dispatch('fetchPayments', request);
        },
        getMorePayments({commit, getters}){
            let request = getters.nextRequest;
            commit('APPEND_TO_TABLE');
            this.dispatch('fetchPayments', request);
        },
        clickSearch({state,commit}, text){
            if(state.fetchingPayments)
                return;
            commit('SET_PAGE', 1);
            commit('SET_SEARCH_TEXT', text);
            this.dispatch('getPayments');
        },
        clickPage({commit}, page){
            if (isNumber(page)){
                commit('SET_PAGE', page);
                this.dispatch('getPayments');
            }
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
            state.payments = payments;
        },
        SET_COUNT(state, count){
            state.paymentCount = count;
        },
        APPEND_PAYMENTS(state, payments){
            state.payments = state.payments.concat(payments);
        },
        REFRESH_TABLE(state){
            state.refresh = true;
        },
        APPEND_TO_TABLE(state){
            state.refresh = false;
        },
        RESET_FILTERS(state){
            state.filters = {};
        },
        SET_FILTERS(state, filters){
            state.filters = filters;
        },
        ADD_FILTERS(state, filters){
            for(let key in filters){
                state.filters[key] = filters[key]
            }   
        },
        SET_SEARCH_TEXT(state, text){
            state.searchText = text;
        },
        SET_ITEMS_PER_REQUEST(state, itemsPerRequest){
            state.itemsPerRequest = itemsPerRequest;
        },
        SET_LAST_REQUEST(state, req){
            state.lastRequest = req;
        },
        CALCULATE_PAGE_BUTTONS(state){
            let lastPage = Math.ceil(state.paymentCount / state.itemsPerRequest);
            state.pageButtons = generatePageRange(state.selectedPage, lastPage);
        },
        SET_PAGE(state, page){
            state.selectedPage = page;
        }
    },
    getters: {
        lastRequest(state){
            return state.lastRequest;
        },
        nextRequest(state){
            //get the next request when loading more payments (scrolling down) NOTE: NOT IN USE
            let req = {};
            req.skip = state.payments.length;
            req.limit = state.itemsPerRequest;
            req.sortBy = state.sortBy;
            req.sortDir = state.sortDir;
            req.filters = state.filters;
            req.searchText = state.searchText;
            req.searchField = state.searchField;
            return req;
        },
        firstRequest(state){
            //the request when refreshing the table
            let req = {};
            req.skip = ((state.selectedPage - 1) * state.itemsPerRequest);
            req.limit = state.itemsPerRequest;
            req.sortBy = state.sortBy;
            req.sortDir = state.sortDir;
            req.filters = state.filters;
            req.searchText = state.searchText;
            req.searchField = state.searchField;
            return req;
        },
        paymentById(state, id){
            let payment = state.payments[id];

            return payment;
        }
    }
});