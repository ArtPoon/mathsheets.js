

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function sumsOf() {
    /*
    Returns an array of math problems.
    For now let's just do addition.
     */
    max = $('#selectMax').val();
    nrows = $('#selectRows').val();
    ncols = $('#selectCols').val();

    nProbs = nrows*ncols;
    problems = {};
    for (i = 0; i < nProbs; i++) {
        problems[i] = {};
        n1 = getRandomInt(0,10);
        problems[i]['n1'] = n1;
        problems[i]['n2'] = getRandomInt(0, max-n1);
        problems[i]['op'] = '+';
    }
    console.log(problems);
    return problems;
}

function generateProblems() {
    mode = $('#selectMode').val();

}


function writeProblem (x, y, n1, n2, operator) {
    /*
    Write a problem at the given coordinates.
     */

}

function writePage () {
    /*
    Generate problems given current mode and layout.
     */
    problems = generateProblems();
}
