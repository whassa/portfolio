import { Draggable } from '@shopify/draggable';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

let initialMousePosition;
let dragRect;
let offsetX;

const thumbsDownHtml = '<svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 5.61V11.38C20 12.27 19.27 13 18.38 13H16.77V4H18.38C19.28 4 20 4.72 20 5.61ZM5.34001 5.24L4.02001 12.74C3.86001 13.66 4.56001 14.5 5.50001 14.5H10.28V18C10.28 19.1 11.18 20 12.27 20H12.36C12.76 20 13.12 19.76 13.28 19.39L16.01 13V4H6.81001C6.08001 4 5.46001 4.52 5.33001 5.24H5.34001Z" fill="#FC100D"/></svg>';
const thumbsUpHtml = '<svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.24001 11V20H5.63001C4.73001 20 4.01001 19.28 4.01001 18.39V12.62C4.01001 11.73 4.74001 11 5.63001 11H7.24001ZM18.5 9.5H13.72V6C13.72 4.9 12.82 4 11.73 4H11.64C11.24 4 10.88 4.24 10.72 4.61L7.99001 11V20H17.19C17.92 20 18.54 19.48 18.67 18.76L19.99 11.26C20.15 10.34 19.45 9.5 18.51 9.5H18.5Z" fill=" #28a745"/></svg>';


const draggable = new Draggable(document.querySelectorAll('.column'), {
  draggable: '.card-draggable',
  handle: '.drag-me',
  mirror: {
    constrainDimensions: true,
    yAxis: false,
  }
});

draggable.on('drag:start', (evt) => {
  initialMousePosition = {
    x: evt.sensorEvent.clientX,
  };
});

function votedSucessfully () {
  Toastify({
    text: "Voted sucessfully",
    duration: 2000,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    style: {
      background: "#28a745",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}

function votingError () {
  Toastify({
    text:"Error from our side, it will not be saved.",
    duration: 2000,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    style: {
      background: "#FC100D",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}

function sendVote(params) {
  const queryString = Object.keys(params)
  .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
  .join('&');

  const url ='/api/vote?' + queryString;

  fetch(url, {
    method: 'PUT',
  })
    .then(response => {
      if (!response.ok) {
        votingError();
        return;
      }
      votedSucessfully();
    })
    .catch(error => {
      votingError();
    });
}

draggable.on('drag:stop', (evt) => {
  if (offsetX >= 175) {
    requestAnimationFrame(() => {
      evt.originalSource.children[0].children[0].children[1].innerHTML = thumbsUpHtml;
    })
    sendVote({ workExperience: evt.originalSource.id ,vote: 1})
  } else if (offsetX <= -175) {
    requestAnimationFrame(() => {
      evt.originalSource.children[0].children[0].children[1].innerHTML = thumbsDownHtml;
    })
    sendVote({ workExperience: evt.originalSource.id ,vote: -1})
  }
});

draggable.on('mirror:created', (evt) => {
    dragRect = evt.source.getBoundingClientRect();
    requestAnimationFrame(() => {
        evt.source.style.visibility = 'hidden';
    })
});

draggable.on('mirror:move', (evt) => {  
  offsetX = evt.sensorEvent.clientX - initialMousePosition.x;
  const mirrorCoords = {
    top: dragRect.top,
    left: dragRect.left + offsetX,
  }
  requestAnimationFrame(() => {
    evt.mirror.style.visibility = 'visible';
    evt.mirror.style.transform  = `translate3d(${mirrorCoords.left}px, ${mirrorCoords.top}px, 0)`;
  });
});

draggable.on('mirror:destroy', (evt) => {
    requestAnimationFrame(() => {
        evt.source.style.visibility = 'visible';
    });
});