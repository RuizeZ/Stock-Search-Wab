// function pressEnter(event){
//     checkInput(document.getElementById('query').value);
// }
function checkInput(query) {
    if(query === ''){
        console.log("1")
    }

    if (query === 'null') {
        document.getElementById("error-message").style.display="inherit";
    }
    else{
        document.getElementById("error-message").style.display="none";
    }
}