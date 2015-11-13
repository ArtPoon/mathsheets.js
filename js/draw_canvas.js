var problems = {};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomTuple(min, max, do_sort) {
    /*
    Return a labelled tuple of integers that sum to a random value
    from the interval [min, max].  If do_sort is true, then
    make sure that n1 > n2 (for subtraction with non-negative result).
     */
    var sum = getRandomInt(min, max+1);
    var n1 = getRandomInt(1, sum);
    var n2 = sum - n1;

    if (do_sort && n1 < n2) {
        var temp = n1;
        n1 = n2;
        n2 = temp;
    }
    return {n1: n1, n2: n2};
}


function generateGrid(nrows, ncols) {
    /*
    Returns an array of math problems.
    Make sure that adjacent problems are always different.
     */
    var mode = $('#selectMode').val();
    var max = parseInt($('#selectMax').val());
    var min = 0;

    if (max == 10) {
        min = 5;
    } else if (max == 20) {
        min = 10;
    } else if (max == 100) {
        min = 20;
    }

    var subtract = $('#checkSubtract')[0].checked;
    var i, j;
    var problems = {};

    for (i = 0; i < nrows; i++) {
        for (j = 0; j < ncols; j++) {
            tuple = null;
            while (tuple == null) {
                tuple = randomTuple(min, max, subtract);
                if (j > 0) {
                    // check if tuple matches to the left
                    if (problems[[i, j-1]].n1 == tuple.n1 && problems[[i, j-1]].n2 == tuple.n2) {
                        tuple = null;
                        continue;
                    }
                }
                if (i > 0) {
                    // check if tuple matches above
                    if (problems[[i-1, j]].n1 == tuple.n1 && problems[[i-1, j]].n2 == tuple.n2) {
                        tuple = null;
                    }
                }
            }
            problems[[i, j]] = tuple;
            problems[[i, j]].op = '+';
            if (subtract) {
                problems[[i, j]].op = '-';
            }
        }
    }

    return problems;
}


function writePreview () {
    /*
    Generate problems given current mode and layout as HTML5 Canvas
    Page dimensions are 850 * 1100
    Use margins of 50 px.
     */

    var canvas = $("#canvas")[0];
    canvas.width = canvas.width;  // clear canvas
    var context = canvas.getContext('2d');
    context.font = "48px 'Coming Soon'";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 2;

    var i, j; // counters
    var index;

    //var nProbs = Object.keys(problems).length;
    var nrows = parseInt($('#selectRows').val());
    var ncols = parseInt($('#selectCols').val());
    var problems = generateGrid(nrows, ncols);

    var margin = 0;
    var w = 850 - 2*margin;
    var wb = w / (ncols+1);  // block size, width
    var h = 1100 - 2*margin;
    var hb = h / (nrows+1);  // block size, height

    for (i = 0; i < nrows; i++) {
        for (j = 0; j < ncols; j++) {
            //index = i*ncols + j;
            n1 = problems[[i,j]]['n1'];
            n2 = problems[[i,j]]['n2'];
            op = problems[[i,j]]['op'];

            // locate centers
            cx = margin + wb * (j+1);
            cy = margin + hb * (i+1);

            context.fillText(n1, cx, cy-24);
            context.fillText(n2, cx, cy+24);
            context.fillText(op, cx-40, cy+24);

            context.moveTo(cx-48, cy+48);
            context.lineTo(cx+20, cy+48);
            context.stroke();
        }
    }

}

function printCanvas() {
    var img    = canvas.toDataURL("image/png");
    document.write('<img src="'+img+'"/>');
}
