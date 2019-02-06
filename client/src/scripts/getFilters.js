const getFilters = ({maxAmount, minAmount, beforeDate, afterDate})=>{
    let filters = {};
    if(maxAmount){
        console.log('should not');
        filters['Amount'] = {};
        filters['Amount']['max'] = maxAmount;
    }
    if(minAmount){
        filters['Amount'] = filters['Amount'] || {};
        filters['Amount']['min'] = minAmount;
    }
    if(beforeDate){
        filters['Date'] = {};
        filters['Date']['before'] = beforeDate;
    }
    if(afterDate){
        filters['Date'] = filters['Date'] || {};
        filters['Date']['after'] = afterDate;
    }
    if(!filters['Amount'] && !filters['Date'])
        filters = null;
    return filters;
}

export default getFilters;