// Your code here
const intializePage = () => {
  // create container
  const section = document.createElement("section");
  const container = document.createElement("div");
  container.className = "container";

  section.appendChild(container);
  document.body.appendChild(section);

  createMainContent();
  createScoreContainer();
  createCommentContainer();

  if (localStorage.url) {
    document.querySelector("img").src = localStorage.url;
    document.querySelector('.score').innerHTML = localStorage.score;

    if(localStorage.comments) {
      const commentBox = document.getElementById("comment-box");

      //  create a comment new date and container
      const comments = JSON.parse(localStorage.getItem("comments"));
      comments.forEach(([commentDateContent, commentContent]) => {
        const [comment, commentDate] = createCommentElements();

        comment.innerText = commentContent;
        commentDate.innerText = commentDateContent;
        commentBox.append(commentDate, comment);
      });

    }
  } else {
      fetchImage();
  }
}

const createMainContent = () => {
  // create h1
  const h1 = document.createElement("h1");
  h1.innerText = "Catstagram";

  // create new pic button
  const newPicButton = document.createElement("button");
  newPicButton.id = "new-pic";
  newPicButton.innerText = "New kitty 😺";

  // create img
  const img = document.createElement("img");
  img.className = "img-effect"


  const container = document.querySelector(".container");
  container.appendChild(h1);
  container.appendChild(img);
  container.appendChild(newPicButton);
}

const createScoreContainer = () => {
  // Create score container
  const scoreContainer = document.createElement("div");
  scoreContainer.className = "score-container";

  // Create score display
  const scoreDisplay = document.createElement("div");
  scoreDisplay.className = "score-display";

  const scoreTitle = document.createElement("span");
  scoreTitle.id = "score-title";
  scoreTitle.innerText = "Kitty Points: ";

  const score = document.createElement("span");
  score.className = "score";
  score.innerText = "0";

  scoreDisplay.appendChild(scoreTitle);
  scoreDisplay.appendChild(score);

  // create upvote/downvote buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.setAttribute("class", "button-container")

  const upvoteBtn = document.createElement("button");
  upvoteBtn.id = "upvote";
  upvoteBtn.innerText = "💕";

  const downvoteBtn = document.createElement("button");
  downvoteBtn.id = "downvote";
  downvoteBtn.innerText = "👎"

  buttonContainer.appendChild(upvoteBtn);
  buttonContainer.appendChild(downvoteBtn);

  scoreContainer.appendChild(scoreDisplay);
  scoreContainer.appendChild(buttonContainer);

  const container = document.querySelector(".container");
  container.appendChild(scoreContainer);
}

const createCommentContainer = () => {
  // create comments container
  const commentContainer = document.createElement("div")
  commentContainer.className = "comment-container";

  // add title for comment container
  const commentHeader = document.createElement("h2");
  commentHeader.innerText = "Comments"

  // create comments section
  const comments = document.createElement("div");
  comments.id = "comment-box";

  // create comments input
  const commentBox = document.createElement("form");
  commentBox.id = "input-form-container";

  // create input field
  const commentInputField = document.createElement("input");
  commentInputField.id = "comment-input";
  commentInputField.placeholder = "add comment here"

  // create submit button
  const submitButton = document.createElement("button");
  submitButton.id = "submit-button";
  submitButton.innerText = "Submit";



  // append everything
  const container = document.querySelector(".container");
  commentContainer.appendChild(commentHeader);
  commentContainer.appendChild(comments);
  commentContainer.appendChild(commentBox);
  commentBox.appendChild(commentInputField);
  commentBox.appendChild(submitButton);
  container.appendChild(commentContainer);

}

const fetchImage = async () => {
  // Fetch image from API and set img url
  try {
      const kittenResponse = await fetch("https://api.thecatapi.com/v1/images/search?size=small");
      // Converts to JSON
      const kittenData = await kittenResponse.json();

      localStorage.setItem("url", kittenData[0].url);
      localStorage.setItem("score", 0);
      localStorage.setItem("comments", JSON.stringify([]));

      document.querySelector("img").src = kittenData[0].url;
      document.querySelector('.score').innerHTML = 0;
      document.getElementById('comment-box').innerHTML = '';
  } catch (e) {
      console.log("Failed to fetch image", e);
  }
}

const vote = e => {
  if (e.target.id === "upvote") {
    localStorage.score = parseInt(localStorage.score) + 1;
  } else {
    localStorage.score = parseInt(localStorage.score) - 1;
  }
  document.querySelector('.score').innerHTML = localStorage.score;
}

// helper function for creating  comment elements
const createCommentElements = () => {
  //  create two elements, 1 for date and 1 for comment (date element is optional)
  const comment = document.createElement("span");
  comment.className = "comment-id";
  const commentDate = document.createElement("span");
  commentDate.className = "comment-date-id";

  // return the pair of created elements
  return [comment, commentDate];
};

const addComment = (inputValue) => {
  // select the comment box to append new comments
  if (inputValue.length === 0) return;
  const commentBox = document.getElementById("comment-box");

  //  create a comment new date and container
  const [comment, commentDate] = createCommentElements();

  const newInputDate = new Date().toLocaleTimeString();

  comment.innerText = inputValue;
  commentDate.innerText = newInputDate;

  let storageComments = JSON.parse(localStorage.getItem("comments"));

  // grouping  the comment date and comment value
  storageComments.push([newInputDate, inputValue]);
  // append comment to comment box after setting the newly added comment to local storage
  localStorage.setItem("comments", JSON.stringify(storageComments));
  commentBox.append(commentDate, comment);
};

const handleCommentSubmit = () => {
  // select the submit button to attach event listener
  const button = document.getElementById("submit-button");

  // listen for any click changes
  button.addEventListener("click", (e) => {
    // prevent default behavior since parent is a form element
    e.preventDefault();

    // select the comment input to get comment input value
    const commentInput = document.getElementById("comment-input");
    const inputValue = commentInput.value;

    // call helper function for handling comment and reset the value to
    // an empty string
    addComment(inputValue);
    commentInput.value = "";
  });
};

window.onload = () => {
  intializePage();

  // event handling functions are called but don't run the main code until an event is triggered
  handleCommentSubmit();
  document.getElementById("new-pic").addEventListener("click", fetchImage);
  document.getElementById("upvote").addEventListener("click", e => vote(e));
  document.getElementById("downvote").addEventListener("click", e => vote(e));
}
