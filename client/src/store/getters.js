import getFilters from "../scripts/getFilters"

const getters = {
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
        req.filters = getFilters(state);
        req.searchText = state.searchText;
        req.searchField = state.searchField;

        return req;
    },
    paymentById(state, id){
        let payment = state.payments[id];

        return payment;
    }

}

export default getters;