function average(arr) {
    var sum = 0.0;
    for(let i=0;i<arr.length ;i++) {
        sum += arr[i];
    }
    return sum/arr.length;

}

module.exports = average;