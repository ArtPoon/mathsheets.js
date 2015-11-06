var problems = {};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateProblems(n) {
    /*
    Returns an array of math problems.
    For now let's just do addition.
     */
    var mode = $('#selectMode').val();
    var max = parseInt($('#selectMax').val());
    var subtract = $('#checkSubtract')[0].checked;
    var i;
    var n1;


    for (i = 0; i < n; i++) {
        problems[i] = {};

        if (mode == 'default') {
            n1 = getRandomInt(0, max);
            problems[i]['n1'] = n1;
            problems[i]['n2'] = getRandomInt(0, max-n1); // make sure sum is below max
        } else if (mode == 'doubles') {
            problems[i]['n1'] = problems[i]['n2'] = getRandomInt(1, 1+max/2);
        } else if (mode == 'making10s') {
            n1 = getRandomInt(1, max);
            problems[i]['n1'] = n1;
            problems[i]['n2'] = getRandomInt(-1, 2) + max-n1;
        } else {
        }

        problems[i]['op'] = '+';
        if (subtract) {
            if (problems[i]['n1'] < problems[i]['n2']) {
                var temp = problems[i]['n1'];
                problems[i]['n1'] = problems[i]['n2'];
                problems[i]['n2'] = temp;
            }
            problems[i]['op'] = '-';
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
    canvas.width = canvas.width;
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
    var problems = generateProblems(nrows*ncols);

    var margin = 0;
    var w = 850 - 2*margin;
    var wb = w / (ncols+1);  // block size, width
    var h = 1100 - 2*margin;
    var hb = h / (nrows+1);  // block size, height

    for (i = 0; i < nrows; i++) {
        for (j = 0; j < ncols; j++) {
            index = i*ncols + j;
            n1 = problems[index]['n1'];
            n2 = problems[index]['n2'];
            op = problems[index]['op'];

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
