<template>
    <div class="vueDataTable">
        <table>
            <thead>
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
            </thead>
            <tbody>
                <tr v-for="payment in payments" :key="payment._id">
                    <td v-for="key in schema" :key="key">
                        <div v-if="payment.editing == false">{{payment[key]}}</div><img v-if="key == 'Description'"/>
                    </td>
                </tr>
            </tbody>
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
    width: 100%;
}

tbody {
    font-size: 14px;
}
thead{
    background-color: #14C;
    color: #EEE;
}
table {
    border-spacing: 0;
    width: 85%;
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

td, th {
    text-align: left;
    padding: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

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

td div, th div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    text-align: left;
}

tr:nth-child(even) {
    background-color: #EEE;
}

th div {
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

@media screen and (max-width: 786px){
    table{ 
        width: 100%;
    }

    td:nth-child(1), th:nth-child(1){
        display:none;
    }
    td:nth-child(5), th:nth-child(5){
        display:none;
    }
}

</style>