<template>
    <div class="vueDataTable">
        <div class="dataTableHeader">
            <div class="alignLeft">
                <label for="itemsPerRequest">Results Per Page</label>
                <select id="itemsPerRequest" v-model="itemsPerRequest">
                    <option value=10>10</option>
                    <option value=25>25</option>
                    <option value=50>50</option>
                    <option value=100>100</option>
                </select>
            </div>
            <div class="tableHeaderRight">
                <div class="searchContainer">
                    <input :placeholder="'Search by '+ searchField" v-on:keydown="keySearch($event, inputText)" v-model="inputText"/>
                    <SVGIcon icon="search" v-on:click.native="clickSearch(inputText)"/>
                </div>
                <div class="filterContainer">
                    <label>Advanced Search Options</label>
                    <SVGIcon icon="filter" v-on:click.native="toggleFilter()"/>
                </div>
            </div>
        </div>
        <div v-show="showFilters" class="tableFilters">
            <div class="searchTypeContainer">
                <label>Search For </label>
                <select v-model="searchField">
                    <option value="Name">Name</option>
                    <option value="Description">Description</option>
                    <option value="ID">ID</option>
                </select>
            </div>
            <div class="amountRangeContainer">
                <label>Amount Range</label>
                <select v-model="minAmount">
                    <option value='' selected>Minimum Amount</option>
                    <option value=-1000>>= -$1000</option>
                    <option value=-100>>= -$100</option>
                    <option value=0>>= $0</option>
                    <option value=100>>= $100</option>
                    <option value=500>>= $500</option>
                    <option value=1000>>= $1000</option>
                </select>
                <select v-model="maxAmount">
                    <option value='' selected>Maximum Amount</option>
                    <option value=-1000>&lt;= -$1000</option>
                    <option value=-100>&lt;= -$100</option>
                    <option value=0>&lt;= $0</option>
                    <option value=100>&lt;= $100</option>
                    <option value=500>&lt;= $500</option>
                    <option value=1000>&lt;= $1000</option>
                </select>
            </div>
            <div class="dateRangeContainer">
                <label>Date Range</label>
                <input placeholder="After" v-model="afterDate" type="date">
                <input placeholder="Before" v-model="beforeDate" type="date">
            </div>
        </div>
        <table>
            <thead>
                <tr class="primaryRow">
                    <th v-for="key in schema" :key="key">
                        <div v-bind:class="{
                            'sortUp': sortBy == key && sortDir == 'asc',
                            'sortDown': sortBy == key && sortDir == 'desc',
                            'sortNone': sortBy != key
                        }" v-on:click="clickHeader(key)">
                            {{key}}
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="noPaymentMessage" v-if="paymentCount == 0"><td v-bind:colspan="screenSize > 786 ? 5 : 3">No records found</td></tr>
                <template v-for="payment in payments">
                    <tr class="primaryRow" :key="payment._id" v-on:click="clickPayment(payment)"  
                            v-bind:class="{'expand': payment.expand == 'true'}" >
                        <td v-for="key in schema" :key="key" v-on:click="editDescription(key,payment, $event)" >
                            <div v-if="(payment.editing == false || key != 'Description') && key != 'Date'">
                                {{payment[key]}}</div>
                            <time v-bind:datetime="payment[key]" v-if="key == 'Date'">{{payment[key]}}</time>
                            <textarea v-bind:ref="'input'+payment._id" v-on:blur="saveDescription(payment)" v-model="payment.Description"
                            v-show="payment.editing == true" v-if="key == 'Description'"/>
                        </td>
                    </tr>
                    <tr class="expandRow" :key="'expand'+payment._id" v-show="payment.expand == true">
                        <td colspan="3">
                            <div role="row">ID: {{payment.ID}}</div>
                            <div role="row">Description: {{payment.Description}}</div>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                 <tr class="primaryRow">
                    <th v-for="key in schema" :key="key">
                        <div>
                            {{key}}
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
        <div class="dataTableFooter"> 
            <div class="pageButtons">
                <ul>
                    <li v-bind:class="{'selected':selectedPage == button.value, 'dots':button.value=='...'}" 
                    v-for="button in pageButtons" v-bind:key="button.key"
                    v-on:click="clickPage(button.value)"
                    >{{button.value}}</li>
                </ul>
            </div>
            <div v-show="paymentCount > 0">
                Showing Results {{(selectedPage - 1) * itemsPerRequest + 1}} - {{selectedPage * itemsPerRequest}} / {{paymentCount}}
            </div>
        </div>
    </div>
</template>


<script>
    import { mapState, mapMutations, mapActions, mapGetters } from "vuex"

    export default {
        name: "DataTable",
        mounted() {
            this.getPayments();
            this.screenSize = screen.width;
            console.log(this.screenSize);

            window.addEventListener('resize', this.handleResize)
            this.handleResize();
        },
        props: {

        },

        data: function(){
            return {
                showFilters: false,
                screenSize: 0
            }
        },
        computed: {
            ...mapState(['payments','schema','sortDir','sortBy', 'pendingRequests', 
            'fetchingPayments', 'paymentCount', 'pageButtons', 'selectedPage', 'searchField']),
            ...mapGetters([]),
            inputText: {
                get() {
                    return this.$store.state.searchText;
                },
                set(value) {
                    this.$store.commit('SET_SEARCH_TEXT', value)
                }
            },
            itemsPerRequest: {
                get() {
                    return this.$store.state.itemsPerRequest;
                },
                set(value) {
                    this.$store.commit('SET_ITEMS_PER_REQUEST',value);
                    if(this.selectedPage > Math.ceil(this.paymentCount / value)){
                        this.$store.commit('SET_PAGE', Math.ceil(this.paymentCount / value));
                    }
                    this.getPayments(true);
                }
            },
            searchField: {
                get(){
                    return this.$store.state.searchField;
                },
                set(value) {
                    this.$store.commit('SET_SEARCH_FIELD', value);
                }
            },
            maxAmount: {
                get(){
                    return this.$store.state.maxAmount;
                },
                set(value){
                    this.$store.commit('SET_MAX_AMOUNT', value);
                }
            },
            minAmount: {
                get(){
                    return this.$store.state.minAmount;
                },
                set(value){
                    this.$store.commit('SET_MIN_AMOUNT', value);
                }
            },
            beforeDate: {
                get(){
                    return this.$store.state.beforeDate;
                },
                set(value){
                    this.$store.commit('SET_BEFORE_DATE',  value);
                }
            },
            afterDate: {
                get(){
                    return this.$store.state.afterDate;
                },
                set(value){
                    this.$store.commit('SET_AFTER_DATE', value);
                }
            }

        },
        methods: {
            ...mapMutations({
                setPendingRequests: 'SET_PENDING_REQUESTS', 
            }),
            ...mapActions({
                getPayments: 'getPayments',
                getMorePayments: 'getMorePayments',
                toggleSortDir: 'toggleSortDirection',
                setSortBy: 'setSortBy',
                clickSearch: 'clickSearch',
                clickPage: 'clickPage',
                saveDescription: 'saveDescription'
            }),
            clickHeader: function(key){
                if(this.fetchingPayments)
                    return;

                if(this.sortBy == key){
                    this.toggleSortDir();
                }
                else{
                    this.setSortBy(key);
                }
            },
            editDescription: function(key,payment, ev){
                if(key == 'Description'){
                    ev.stopPropagation();
                    payment.editing = true;
                    this.$nextTick(() => this.$refs['input'+payment._id][0].focus());
                }
            },
            clickPayment: function(payment){
                if(screen.width > 786)
                    return;
                if(payment.expand)
                    payment.expand = false;
                else
                    payment.expand = true;
            },
            keySearch: function(event, inputText){
                if(event.keyCode == 13){
                    this.clickSearch(inputText);
                }
            },
            toggleFilter: function(){
                this.showFilters = !this.showFilters;
            },
            handleResize: function(){
                this.screenSize = window.innerWidth;
            }
        }
    }
</script>

<style lang="scss" scoped>

.vueDataTable{
    width: 85%;
    margin: auto;
}

.dataTableHeader{
    display: flex;
    margin-bottom: 0.5em;
    padding-left: 15px;

    div {
        display: flex;
        align-items: center;
    }
}

.filterContainer{
    font-size: 11px;
}

.tableFilters{
    padding-left: 25%;
    display: grid;
    font-size: 12px;
    grid-template-columns: repeat(2, minmax(250px, 1fr));
    grid-template-rows: 1fr 1fr;

    grid-template-areas: 
    "search amount" 
    ". date";

    div {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 4em;
    }
}

.searchTypeContainer{
    grid-area: search;
}
.amountRangeContainer{
    grid-area: amount;
}
.dateRangeContainer{
    grid-area: date;
}

.tableHeaderRight {
    min-width: 30%;
    justify-content:space-between;
}

.dataTableFooter{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

ul {
    list-style-type: none;
    padding:0;
    margin: 0;
}

li{
    float: left;
    padding: 8px;

    cursor: pointer;
    border-left: 1px solid #DDD;
    border-right: 1px solid #DDD;
    border-bottom: 1px solid #DDD;
    border-collapse: collapse;

    &.selected {
        background-color: skyblue;
        color: white;
    }
    &.dots {
        cursor: default;
        border-left: none;
        border-right:none;
    }
}

tbody {
    font-size: 14px;
}
thead, tfoot{
    background-color: #14C;
    color: #EEE;
}
table {
    border-spacing: 0;
    width: 100%;
    margin: auto;
    border-collapse: collapse;
    table-layout: fixed;
    position: relative;
}

th {
    position: relative;
    min-width: 15%;
    height:30px;
}

tr.primaryRow td, th {
    text-align: left;
    padding: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;

    &:nth-child(1) {
        width: 24%;
    }

    &:nth-child(2) {
        width: 14%;
    }

    &:nth-child(3) {
        width: 18%;
    }

    &:nth-child(4) {
        width: 9%;
    }

    &:nth-child(5) {
        width: 25%;
    }
}

tr.expandRow {
    height: 80px;
}

.alignLeft{
    margin-right: auto;
    margin-top: auto;
}

td div, th div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    text-align: left;
}

tbody tr:nth-child(4n), tbody tr:nth-child(4n-1){
    background-color: #EEE;
}

tbody tr:nth-child(4n+1), tbody tr:nth-child(4n+2){
    background-color: #FFF;
}

thead tr th div {
    width: 100%;
    &::before, &::after{
        position: absolute;
        right: 5px;
        top: 15px;
        opacity: 0.4;
    }
    &.sortDown::after, &.sortUp::before{
        opacity: 0.9;
    }
    &::before{
        content: url('../assets/icon-arrow-up.svg');
    }
    &::after{
        content: url('../assets/icon-arrow-down.svg');
    }
    &:hover{
        cursor: pointer;
        &.sortNone::before, &.sortNone::after {
            opacity: 0.7;
        }
    }
}

tr:hover td:nth-child(5)::after{
    content: url('../assets/icon-edit.svg');
        position: absolute;
        right: 5px;
        top: 15px;
        opacity: 0.4;
}

td textarea {
    font-size: 14px;
    outline: none;
    width: 90%;
    height: 90%;
}

.noPaymentMessage {
    padding: 17px;
    font-size: 16px;
    text-align: center;
    width: 100%;
}

@media screen and (max-width: 786px){
    table{ 
        -webkit-user-select: none; /* Chrome/Safari */        
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+ */
    }

    tr.primaryRow td:nth-child(1),tr.primaryRow th:nth-child(1){
        display:none;
    }
    tr.primaryRow td:nth-child(5), tr.primaryRow th:nth-child(5){
        display:none;
    }
    .vueDataTable{
        width: 100%;
    }

}

</style>