<template>
    <div class="vueDataTable">
        <table>
            <tr>
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
            <tr v-for="payment in payments" :key="payment._id">
                <td v-for="key in schema" :key="key">
                    <div v-if="payment.editing == false">{{payment[key]}}</div><img v-if="key == 'Description'"/>
                </td>
            </tr>
        </table>
        <div v-on:click="getMorePayments()">Get More</div>
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
            ...mapState(['payments','schema','sortDir','sortBy', 'pendingRequests', 'fetchingPayments'])

        },
        methods: {
            ...mapMutations({
                setPendingRequests: 'SET_PENDING_REQUESTS', 
            }),
            ...mapActions({
                getPayments: 'getPayments',
                getMorePayments: 'getMorePayments',
                toggleSortDir: 'toggleSortDirection',
                setSortBy: 'setSortBy'
            }),
            clickHeader: function(key){
                if(this.sortBy == key){
                    this.toggleSortDir();
                }
                else{
                    this.setSortBy(key);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

.vueDataTable{
    width:100%;
    overflow: hidden;
}

tr {
    max-width: 100%;
}

td, th {
    border-bottom: 1px #222 solid;
    resize: horizontal;
    text-align: left;
}

td div, th div {
    min-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-flex;
    text-align: left;
    padding-left: 5px;
}

tr:nth-child(even) {
    background-color: #DDD;
}

table {
    border-spacing: 0;
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
    border: 1px black solid;
}

th {
    position: relative;
    min-width: 15%;
    height:30px;
}

th div {
    width: 100%;
    &::before, &::after{
        position: absolute;
        right: 10px;
        top: 0px;
        opacity: 0.2;
    }
    &.sortDown::after, &.sortUp::before{
        opacity: 0.8;
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

</style>