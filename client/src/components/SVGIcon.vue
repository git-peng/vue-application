<template>  
    <span v-html="require(`!!html-loader!./../assets/icon-${icon}.svg`)"></span>
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

</style>