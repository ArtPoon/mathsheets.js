var problems = {};

function getRandomInt(min, max) {
    /*
    Returns a random integer in range [min, max]
     */
    return Math.floor(Math.random() * (max+1 - min)) + min;
}

function randomTuple(min, max, do_sort) {
    /*
    Return a labelled tuple of integers that sum to a random value
    from the interval [min, max].  If do_sort is true, then
    make sure that n1 > n2 (for subtraction with non-negative result).
     */
    var sum = getRandomInt(min, max);
    var n1 = getRandomInt(1, sum-1);
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

    var subtractor = $('#subtractMode')[0];
    var mode2 = subtractor.value;
    if (mode == 'twenty') {
        subtractor.disabled = false;
    }
    else {
        subtractor.disabled = true;
        subtractor.value = 'off';
        mode2 = 'off';
    }

    var i, j;
    var subtract;
    var tuple;
    var problems = {};

    for (i = 0; i < nrows; i++) {
        for (j = 0; j < ncols; j++) {
            tuple = null;

            // determine if add or subtract
            if (mode2 == 'on') {
                subtract = true;
            } else if (mode2 == 'off') {
                subtract = false;
            } else {
                subtract = (getRandomInt(0,1) > 0);
            }

            while (tuple == null) {
                if (mode == 'twenty') {
                    tuple = randomTuple(10, 20, subtract);
                }
                else {
                    tuple = {n1: 0, n2: 0};
                    if (mode == 'making10s') {
                        tuple.n1 = getRandomInt(2, 8);
                        tuple.n2 = 10 - tuple.n1;
                        tuple.n1 += getRandomInt(-1, 1);
                    }
                    else if (mode == 'doubles') {
                        tuple.n1 = getRandomInt(2, 10);
                        tuple.n2 = tuple.n1 + getRandomInt(-1, 1);
                    }
                    else {
                        alert('ERROR: Unexpected mode in mathsheets.js:generateGrid()', mode)
                    }
                }

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
    setExplanation(mode);

    return problems;
}

function setExplanation(mode) {
    if (mode == 'twenty') {
        $('#explainDiv').text('Drilling. Random sums from 10 to 20.');
    } else if (mode == 'making10s') {
        $('#explainDiv').text('Conceptual exercise. Memorizing the ways to make 10, and learning how this makes ' +
            'other sums easier.');
    } else if (mode == 'doubles') {
        $('#explainDiv').text('Conceptual exercise. Memorizing sums of doubles, and learning how this makes ' +
            'sums of "near doubles" easier.');
    } else {
        alert('Error, unexpected mode in setExplanation()', mode);
    }
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
    context.font = "24px 'Coming Soon'";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 2;

    // write header
    context.fillText('mathsheets.js', 100, 40);
    var mode = $('#selectMode').val();
    if (mode == 'twenty') {
        context.fillText('Random sums!', 700, 40);
    } else if (mode == 'making10s') {
        context.fillText('Making tens!', 700, 40);
    } else if (mode == 'doubles') {
        context.fillText('Doubles!', 700, 40);
    }

    context.font = "48px 'Coming Soon'";

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
    var img = canvas.toDataURL("image/png");
    var w = window.open('');
    w.document.write('<img src="'+img+'"/>');
}
