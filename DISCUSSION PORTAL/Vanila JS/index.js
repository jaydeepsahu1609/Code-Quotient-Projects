// ----------------------------------------------------------------------------------------

var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");

var searchBoxNode = document.getElementById("search");
var questionListNode = document.getElementById("questionList");
var responseListNode = document.getElementById("responseList");

var formContainerNode = document.getElementById("formContainer");
var resFormContainerNode = document.getElementById("responseFormContainer");
var responseQuestionNode = document.getElementById("responseQuestion");

var questionCount = 0; /// no question initially
var questionList = []; //will store all the question objects


// // --------------------------QUESTION RELATED FUNCTIONS----------------------------------------------

function submitQuestion() {
    console.log("submitQuestion()")
    // User Story 2 : When the question form in the right pane is submitted, add a question to the left pane

    let qTitle = questionTitleNode.value.trim(" ");
    let qDesc = questionDescriptionNode.value.trim(" ");

    if(qTitle.length == 0 || qDesc.length == 0){
        return alert("Please fill all the required details before clicking submit.");
    }
    questionTitleNode.value = "";
    questionDescriptionNode.value = "";

    //create question object
    let question = {
        id: questionCount,
        title: qTitle,
        description: qDesc,
        responses: [],
        upvotes: 0,
        downvotes: 0,
        createdAt: Date.now(),
        favorite:false
    };
    // add question to questionList
    questionList.push(question);

    // add to the leftPane
    addQuestionInLeftPane(question);

    // add to local storage
    addQuestionsInLocalStorage();

    // 1 question added, so increment the count
    questionCount++;
}

function resolveQuestion(id) {
    // User Story 8: When the resolve button is clicked, remove the associated question from the question list.
    // Make the right pane display the new question form.

    // find index of questionObject in question list
    let index = getQuestionIndexById(id);

    // delete from list
    questionList.splice(index, 1);

    // reset the local storage
    addQuestionsInLocalStorage();

    // remove from left pane
    questionListNode.removeChild(
        document.getElementById("questionListItem-" + id)
    );

    // hide resolvePane and display rightPane
    displayLeftPane();
    displayQuestionPane();
}

function rateQuestion(id, upvote) {
    return () => {
        // console.log("rateQuestion(" + id + ", " + upvote +")")
        let index = getQuestionIndexById(id);
        let questionObject = questionList[index];
        // increment upvote count

        if (upvote)
            questionObject.upvotes++;
        else
            questionObject.downvotes--;

        // update object in list
        questionList[index] = questionObject;

        /// update the local storage
        addQuestionsInLocalStorage();

        // display updated upvote count
        resetQuestionNode();
        displayQuestion(questionObject);

        displayNewRatingInLeftPane(id, upvote);

        // displayLeftPane();
    }
}

function displayNewRatingInLeftPane(id, upvote)
{
    let listNode = document.getElementById('questionListItem-'+id).childNodes[2];
    let target = null;

    if(upvote){
        target = listNode.childNodes[0].childNodes[0];
        target.innerHTML = parseInt(target.innerText) + 1;
    }else{
        target = listNode.childNodes[1].childNodes[0];
        target.innerHTML = parseInt(target.innerText) - 1;
    }
}

// ----------------------------------------------------------------------------------------


function updateCreationTime(){
    /// single timer for all
    setInterval(() => {

        questionList.forEach((question) => {
            let now = Date.now();
            let created = new Date(question.createdAt).getTime();

            let diff = now - created;

            let sec = parseInt(diff / 1000);
            let min = parseInt(sec / 60);
            let hour = parseInt(min / 60);

            let result = '';

            if(hour > 24)
                result = parseInt(hour/24)+" days ago.";
            else if(hour > 0)
                result = hour+" hours ago.";
            else if(min > 0)
                result = min+" minutes ago.";
            else if(sec > 10)
                result = sec+" seconds ago.";
            else
                result = "few seconds ago.";

            document.getElementById("timer-"+question.id).innerHTML = result;
            })
    }, 1000);
}



// function updateCreationTime(target, date){
//     setInterval(() => {
//         let now = Date.now();
//         let created = new Date(date).getTime();

//         let diff = now - created;

//         let sec = parseInt(diff / 1000);
//         let min = parseInt(sec / 60);
//         let hour = parseInt(min / 60);

//         let result = '';

//         if(hour > 0)
//             result = hour+" hours ago.";
//         else if(min > 0)
//             result = min+" minutes ago.";
//         else if(sec > 30)
//             result = sec+" seconds ago.";
//         else
//             result = "few seconds ago.";

//         target.innerHTML = result;
//     }, 1000);
// }


function addQuestionInLeftPane(question){
    console.log("addQuestionInLeftPane("+ typeof question+")");

    let id = question.id;
    let title = question.title;
    let description = question.description;
    let date = question.createdAt;
    let upvotes = question.upvotes;
    let downvotes = question.downvotes;
    let fvrt = question.favorite;

    let li = document.createElement("li");
    li.setAttribute("id", "questionListItem-" + id);
    li.setAttribute("class", "questionListItem");
    li.addEventListener("click", displayResponsePane(id));

    let h1 = document.createElement("h6");
    h1.setAttribute("class", "subject");
    h1.innerText = title;


    let div1 = document.createElement("div");

    let p = document.createElement("p");
    p.setAttribute("class", "lead question");
    p.innerText = description.substring(0,55) + "....";


    let span3 = document.createElement("span");
    span3.setAttribute("class", "time");
    span3.setAttribute("id", "timer-"+id);

    div1.appendChild(p);
    div1.appendChild(span3);

    let div2 = document.createElement("div");

    let span4 = document.createElement("span");
    span4.setAttribute("class", "votes");
    let em41 = document.createElement("em"); 
    em41.innerText = upvotes;
    let em42 = document.createElement("em");
    em42.setAttribute("class", "far fa-thumbs-up");
    span4.appendChild(em41);
    span4.appendChild(em42);
    // span4.setAttribute("onclick", `rateQuestion(${id}, true)`);
    let span5 = document.createElement("span");
    span5.setAttribute("class", "votes");
    let em51 = document.createElement("em"); 
    em51.innerText = downvotes;
    let em52 = document.createElement("em");
    em52.setAttribute("class", "far fa-thumbs-down");
    span5.appendChild(em51);
    span5.appendChild(em52);
    // span5.setAttribute("onclick", `rateQuestion(${id}), false`);

    let em3 = document.createElement("em");
    if(fvrt)
        em3.setAttribute("class", " text-danger fas fa-heart");
    else
        em3.setAttribute("class", " text-danger far fa-heart");
    em3.addEventListener("click", addFavorite(id));
    span3.appendChild(em3);

    div2.appendChild(span4);
    div2.appendChild(span5);
    div2.appendChild(em3);

    li.appendChild(h1);
    li.appendChild(div1);
    li.appendChild(div2);

    questionListNode.append(li);
}

function addFavorite(id){
    return () => {
        console.log("addFavorite("+id+")");

        let index = getQuestionIndexById(id);
        let questionObject = questionList[index];

        questionObject.favorite = !questionObject.favorite;

        // console.log(questionObject);

        questionList[index] = questionObject;
        addQuestionsInLocalStorage();

        // displayFavoriteInLeftPane(id, questionObject.favorite);
        displayLeftPane();

    }
}

function displayFavoriteInLeftPane(id, favorite)
{
    console.log("displayFavoriteInLeftPane");

    let favNode = document.getElementById('questionListItem-'+id).childNodes[2].childNodes[2];
    // console.log(favNode);

    if(favorite)
        favNode.setAttribute("class", " text-danger fas fa-heart");
    else
        favNode.setAttribute("class", " text-dark far fa-heart");
    
}


function displayLeftPane() {
    console.log("displayLeftPane()");

    resetLeftPane();
    
    sortQuestionListByVote();

    questionList.forEach((question) => {
        addQuestionInLeftPane(question);
    })

    updateCreationTime();
}

function resetLeftPane() {// clears all the questions that are present in left pane
    console.log("resetLeftPane()")
    while (questionListNode.hasChildNodes) {
        let deleteNode = questionListNode.lastElementChild;
        if (deleteNode !== null)
            questionListNode.removeChild(questionListNode.lastElementChild);
        else
            break;
    }
}

//----------------------------------------------------------

function getQuestionIndexById(_id) {
    console.log("getQuestionIndexById("+_id+")")
    //returns index of object from uestion list

    questionList.sort((a,b) => {
        return (a.id - b.id);
    });

    //binary search to get object
    let left = 0,
        right = questionList.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midvalue = questionList[mid].id;
        if (midvalue == _id) return mid;
        else if (midvalue < _id) left = mid + 1;
        else right = mid - 1;
    }

    return left;
}

function sortQuestionListByVote(){

    questionList.sort((a,b) => {
        return ((b.upvotes + b.downvotes + 100*b.favorite) - (a.upvotes + a.downvotes + 100*a.favorite));
    }) 
}
// ----------------------------------------------------------------------------------------
// // ------------------------------ DETAILS DISPLAY RELATED FUNCTIONS---------------------------------------


function displayResponsePane(id) {
    return () => {
    console.log("displayResponsePane("+id+")");

        hideQuestionsPane();

        resetResponsePane();

        let index = getQuestionIndexById(id);
        let question = questionList[index];

        displayQuestion(question);

        displayResponses(question);

        displayResponseForm(id);
    };
}

function resetResponsePane() {
    // console.log("resetResponsePane()");
    // clears response pane so that new information can be loaded again
    resetQuestionNode();
    resetResponseListNode();
    resetResponseFormNode();
}

function hideQuestionsPane() {
    // console.log("hideQuestionsPane()");
    
    formContainerNode.style.display = "none";
    resFormContainerNode.style.display = "flex";
}

function displayQuestionPane() {
    // console.log("displayQuestionPane()");
    formContainerNode.style.display = "flex";
    resFormContainerNode.style.display = "none";
}

function resetQuestionNode() {
    // console.log("resetQuestionNode()");

    // delete question details
    while (
        responseQuestionNode.hasChildNodes &&
        responseQuestionNode.childElementCount >= 1
    ) {
        responseQuestionNode.removeChild(responseQuestionNode.lastElementChild);
    }
}

function resetResponseListNode() {
    // console.log("resetResponseListNode()");

    // delete response list
    while (
        responseListNode.hasChildNodes &&
        responseListNode.childElementCount >= 2
    ) {
        responseListNode.removeChild(responseListNode.lastElementChild);
    }
}

function resetResponseFormNode() {
    // console.log("resetResponseFormNode()");

    let responseFormNode = document.getElementById("responseForm");
    // delete response form
    while (
        responseFormNode.hasChildNodes &&
        responseFormNode.childElementCount >= 1
    ) {
        responseFormNode.removeChild(responseFormNode.lastElementChild);
    }
}

// --------------------------------------------------------


function displayQuestion(question) {
    console.log("displayQuestion(" + question + ")");

    let li = document.createElement("li");
    li.setAttribute("class", "header text-white");
    li.innerHTML = "Question";

    let div1 = document.createElement("div");
    div1.setAttribute("class", "highlight displayQuestion");

    let p1 = document.createElement("p");
    p1.innerHTML = question.title;

    let p2 = document.createElement("p");
    p2.innerHTML = question.description;

    let p3 = document.createElement("p");
    p3.setAttribute("class", "lead text-muted time")
    p3.innerHTML = Date(question.createdAt).toLocaleString();

    div1.appendChild(p1);
    div1.appendChild(p2);
    div1.appendChild(p3);

    let div2 = document.createElement("div");

    let btn = document.createElement("button");
    btn.setAttribute("class", "btn btn-sm btn-secondary");
    btn.innerText = "RESOLVE";
    btn.setAttribute("onclick", `resolveQuestion(${question.id})`);

    let upvoteBtn = document.createElement("button");
    upvoteBtn.innerText = question.upvotes;
    upvoteBtn.addEventListener("click", rateQuestion(question.id, true));

    let em1 = document.createElement("em");
    em1.setAttribute("class", "far fa-thumbs-up text-success");
    upvoteBtn.appendChild(em1);

    let downvoteBtn = document.createElement("button");
    downvoteBtn.innerText = question.downvotes;
    downvoteBtn.addEventListener("click", rateQuestion(question.id, false));

    let em2 = document.createElement("em");
    em2.setAttribute("class", " text-danger far fa-thumbs-down");
    downvoteBtn.appendChild(em2);

    div2.appendChild(btn);
    div2.appendChild(upvoteBtn);
    div2.appendChild(downvoteBtn);

    responseQuestionNode.appendChild(li);
    responseQuestionNode.appendChild(div1);
    responseQuestionNode.appendChild(div2);
}

function displayResponses(question) {
    console.log("displayResponses(" + question + ")");
    
    let allResponses = question.responses;
    const count = allResponses.length;

    for (let i = 0; i < count; i++) {
        let res = JSON.parse(allResponses[i]);

        let div = document.createElement("div");
        div.setAttribute("class", "highlight");

        let p1 = document.createElement("p");
        p1.innerHTML = res.name;

        let p2 = document.createElement("p");
        p2.innerHTML = res.response;

        div.appendChild(p1);
        div.appendChild(p2);

        let upvoteBtn = document.createElement("button");
        upvoteBtn.innerText = res.upvotes;

        upvoteBtn.addEventListener("click", rateResponse(question.id, res.id, true));

        let em1 = document.createElement("em");
        em1.setAttribute("class", "far fa-thumbs-up text-success");
        upvoteBtn.appendChild(em1);

        let downvoteBtn = document.createElement("button");
        downvoteBtn.innerText = res.downvotes;
        downvoteBtn.addEventListener(
            "click",
            rateResponse(question.id, res.id, false)
        );

        let em2 = document.createElement("em");
        em2.setAttribute("class", " text-danger far fa-thumbs-down");
        downvoteBtn.appendChild(em2);

        div.appendChild(upvoteBtn);
        div.appendChild(downvoteBtn);
        div.appendChild(document.createElement("hr"));
        responseListNode.appendChild(div);
    }
}

function displayResponseForm(id) {
    
    // console.log("displayResponseForm(" + id + ")");

    // show form to submit response for a question
    let responseFormNode = document.getElementById("responseForm");

    let h = document.createElement("h4");
    h.setAttribute("class", "header text-light");
    h.innerHTML = "Add Response";

    let name = document.createElement("input");
    name.setAttribute("type", "text");
    name.setAttribute("class", "w-25 mb-3");
    name.setAttribute("id", "response-name-" + id);
    name.setAttribute("placeholder", "Enter Name");
    name.required = true;

    let tarea = document.createElement("textarea");
    tarea.setAttribute("id", "response-" + id);
    tarea.setAttribute("placeholder", "Enter Comment");
    tarea.setAttribute("rows", "5");
    tarea.setAttribute("cols", "30");
    tarea.required = true;

    let div = document.createElement("div");
    div.setAttribute("class", "controls");

    let btn = document.createElement("button");
    btn.setAttribute("class", "btn btn-sm btn-primary");
    btn.addEventListener("click", submitResponse(id));
    btn.innerText = "Submit";

    div.appendChild(btn);
    responseFormNode.appendChild(h);
    responseFormNode.appendChild(name);
    responseFormNode.appendChild(tarea);
    responseFormNode.appendChild(div);
}



// // ------------------------------RESPONSE RELATED FUNCTIONS---------------------------------------

function submitResponse(id) {
    // saves response  to response feild of question-object
    return () => {
        let nameNode = document.getElementById("response-name-" + id);
        let resNode = document.getElementById("response-" + id);
        let name = nameNode.value.trim(" ");
        let res = resNode.value.trim(" ");

        nameNode.value = '';
        resNode.value = '';
        
        if(name.length == 0 || res.length == 0){
            return alert("Please fill all the required details before clicking submit.");
        }
        
        let index = getQuestionIndexById(id);
        let questionObject = questionList[index];

        let responseObject = {
            id: questionObject.responses.length,
            name: name,
            response: res,
            upvotes: 0,
            downvotes: 0,
        };
        
        // clear the text feilds
        name.value = "";
        res.value = "";

        // console.log(responseObject);

        // update object
        questionObject.responses.push(JSON.stringify(responseObject));

        // update question list
        questionList[index] = questionObject;

        // update local storage
        addQuestionsInLocalStorage();

        // show changes in response list
        resetResponseListNode();
        displayResponses(questionObject);
    }
}

function rateResponse(qid, rid, upvote) {
    return () => {
        let index = getQuestionIndexById(qid);

        let questionObject = questionList[index];
        let responses = questionObject.responses;

        for (let i = 0; i < responses.length; i++) { // find the target response
            let response = JSON.parse(responses[i]);
            if (response.id == rid) {
                if (upvote)
                    response.upvotes++;
                else
                    response.downvotes--;

                responses[i] = JSON.stringify(response);

                // update object in list
                questionList[index] = questionObject;

                /// update the local storage
                addQuestionsInLocalStorage();

                // display updated downvotes
                resetResponseListNode();
                displayResponses(questionObject);
                displayResponsePane(qid);
            }
        }
    }
}


// // -------------------------------- FILTER SEARCH RESULTS ----------------------------------------
searchBoxNode.addEventListener("keyup", function (event) {
    return filterResults(event.target.value);
});

function filterResults(query) {
    // console.log("filterResults(" + query + ")");

    // if query is None then reset the left Question Pane
    if (query.trim().length === 0) {
        resetLeftPane();
        displayLeftPane();
        return;
    }
    // clear the left Question Pane
    resetLeftPane();

    let filterResultCount = 0;

    questionList.forEach((question) => {
        // console.log(question)
        if (question.title.includes(query)) {
            addQuestionInLeftPane(question);
            filterResultCount++;
        }
    });

    if (filterResultCount == 0) {
        noMatchFound();
    }

}

function noMatchFound()
{
    resetLeftPane();
    let h4 = document.createElement("h6");
    h4.innerHTML = "No Match Found";
    h4.setAttribute("class", "text-danger")
    questionListNode.appendChild(h4);
}

// // ------------------------------LOCAL STORAGE RELATED ------------------------------


function loadQuestionsFromLocalStorage() {
    console.log("loadQuestionsFromLocalStorage()")

    questionList = []; // initially question list is empty
    questionCount = 0; // no question

    // get array of question objects from local storage
    let questionObjectsArray = JSON.parse(localStorage.getItem("discussions"));

    if (questionObjectsArray != null) {
        console.log(`${questionObjectsArray.length} question loaded from localStorage.`);

        // console.info(questionObjectsArray.length + " questions loaded");
        for (let i = 0; i < questionObjectsArray.length; i++) {
            // now parse the object and add it to left pane
            let questionObject = JSON.parse(questionObjectsArray[i]);
            // console.log(questionObject);
            questionObject.id = questionCount; //reset the id

            // addQuestionToLeftPane(questionObject);

            // push question object to question-list
            questionList.push(questionObject);

            // 1 question added, so increment the count
            questionCount++;
            
        }

        displayLeftPane();
    }
    else{
        console.log(`No question found in localStorage.`);
    }
}

function addQuestionsInLocalStorage(){
    console.log("addQuestionsInLocalStorage()")

    // stringify all questions
    let stringQuestionList = questionList.map((question) => {
        return JSON.stringify(question);
    })

    // update local storage
    localStorage.setItem("discussions", JSON.stringify(stringQuestionList));

    return;
}


// ----------------------------------------------------------------------------------------
// load all questions from local storage on start
window.addEventListener("load", loadQuestionsFromLocalStorage);
// ----------------------------------------------------------------------------------------
