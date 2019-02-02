let generatePageRange = function(currentPage, lastPage) {
    const delta = 1;
    const size = 4;

    const range = [];
    let start = Math.max(2, (currentPage - delta));
    let distance = lastPage - currentPage;
    if(distance < size - 1){
        if(start > size){
            start = lastPage - (size - 1);
        }
    }

    if(lastPage < size + 2){
        for(let i = 1; i<=size && i<=lastPage; i++){
            range.push({value: i, key: i});
        }
        return range;
    }

    for (let i = start; i <= Math.min((lastPage - 1), Math.max(currentPage + delta, size)); i += 1) {
        range.push({value: i, key: i});
    }

    if ((currentPage - delta) > 2) {
        range.unshift({value: '...', key: 'first'});
    }
    if ((currentPage + delta) < (lastPage - 1)) {
        range.push({value:'...', key: 'last'});
    }

    range.unshift({value: 1, key: 1});
    if (lastPage !== 1) range.push({value: lastPage, key: lastPage});
    return range;
}

module.exports = generatePageRange;