extra = function () {

    const maximumProfit = (prices = [7, 1, 5, 3, 6, 4]) => {
        let diff = 0;
        let n = prices.length;
        let buy = true;
        if (1 <= n && n <= 3 * Math.pow(10,4)) {
            for (let i = 0; i < n - 1; i++) {
                if( 0 <= prices[i] && prices[i] <= Math.pow(10,4)) {
                    if (buy) {
                        if (prices[i] < prices[i + 1]) {
                            diff -= prices[i];
                            buy = false;
                        }
                    } else {
                        if (prices[i] > prices[i + 1]) {
                            diff += prices[i];
                            buy = true;
                        }
                    }
                }
                else{
                    buy = true;
                    console.log('Constraint error in size of value in array!');
                    break;
                }
            }
            if (!buy) {
                ( 0 <= prices[n-1] && prices[n-1] <= Math.pow(10,4)) ? diff += prices[n - 1] : diff;
            }
            console.log('Maximum profit: ', diff);
        }
        else console.log('Constraint error in length of array!');
    };

    maximumProfit();
    maximumProfit([1,2,3,4,5]);
    maximumProfit([7,6,4,3,1]);
    maximumProfit([10, 9, 9, 8, 10, 12, 11, 5, 7, 7, 9, 10, 7]);

    return{
        maximumProfit
    }
}();
