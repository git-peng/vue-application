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
            <div class="alignRight">
                <label>Search </label>
                <input v-on:keydown="keySearch($event, inputText)" v-model="inputText"/>
                <SVGIcon icon="search" v-on:click.native="clickSearch(inputText)"/>
                
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
                <tr class="noPaymentMessage" v-if="paymentCount == 0">No records found</tr>
                <template v-for="payment in payments">
                    <tr class="primaryRow" :key="payment._id" v-on:click="clickPayment(payment)"  
                            v-bind:class="{'expand': payment.expand == 'true'}" >
                        <td v-for="key in schema" :key="key" v-on:click="editDescription(key,payment, $event)" >
                            <div v-if="payment.editing == false || key != 'Description'">
                                {{payment[key]}}</div>
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
        <div class="pageButtons">
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </div>
</template>


<script>
    import { mapState, mapMutations, mapActions } from "vuex"

    export default {
        name: "DataTable",
        mounted() {
            this.getPayments();
        },
        props: {
        },
        computed: {
            ...mapState(['payments','schema','sortDir','sortBy', 'pendingRequests', 
            'fetchingPayments', 'paymentCount']),
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
                    this.getPayments();
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
                clickSearch: 'clickSearch'
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
            saveDescription: function(payment){
                payment.editing = false;
            },
            clickPayment: function(payment){
                //if(screen.width > 786)
                //    return;
                if(payment.expand)
                    payment.expand = false;
                else
                    payment.expand = true;
            },
            keySearch: function(event, inputText){
                if(event.keyCode == 13){
                    this.clickSearch(inputText);
                }
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
}

ul {
    list-style-type: none;
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