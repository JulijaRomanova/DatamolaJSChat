extra = function () {
    const maxSumSubArr = (arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) => {
        let res = arr[0];
        let sum = 0;
        for (let el of arr) {
            sum += el;
            (sum > res) ? (res = sum) : res;
            (sum < 0) ? (sum = 0) : sum;
        }
        return res;
    };
    console.log(maxSumSubArr());
    return {
        maxSumSubArr
    }
}();
