<template>  
    <div v-html="require(`!!html-loader!./../assets/icon-${icon}.svg`)"></div>
</template>

<script>  
export default {  
    props: ['icon']
}
</script>  

<style scoped>
    div, svg{
        float: right;
    }
    div {
        cursor: pointer;
    }

</style>