
document.addEventListener("DOMContentLoaded", async function () {
    let isMentor = false;
    const codeBlock = document.getElementById('codeInput');
    const btn = document.getElementById('saveButton');

    const urlParams = new URLSearchParams(window.location.search);
    
    const questionId = urlParams.get('questionId');
     if (!questionId) {
      console.error('questionId parameter not found');
      return;
    }

    // const question = await fetch(`https://localhost:3000/question/${questionId}`, { headers: {'Content-Type': 'application/json'}})
    const question = await fetch(`https://codeblocks-production.up.railway.app/question/${questionId}`, { headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    
    const webSocket = new WebSocket("wss://codeblocks-production.up.railway.app/")
   
    
    document.getElementById("title").textContent = question.title; 
    codeBlock.value = question.code;

    const codeDisplay = document.getElementById('codeDisplay');
    codeBlock.addEventListener('input', function() {
      const code = codeBlock.value;
      //using Highlight.js
      codeDisplay.innerHTML = hljs.highlightAuto(code).value;
    });

    webSocket.addEventListener('open', () => {
      webSocket.send(`JOIN_ROOM:${question._id}`)
    })
    webSocket.addEventListener('close', () => {
      webSocket.send(`LEAVE_ROOM:${question._id}`)
    })
    webSocket.addEventListener('message', message => {
        const [cmd, data] = message.data.split(':')
        console.log(`Command: ${cmd}, Data: ${data}`)
        switch(cmd) {
          case "USER_TYPE":
            codeBlock.disabled = isMentor = data === 'MENTOR';
            btn.disabled = isMentor = data === 'MENTOR';
            break;
          case "CODE_UPDATE":
              if(data !== question.solution) {
                alert("Student has wrong answer")
              }else {
                alert("Student has correct answer")
              }
              codeBlock.textContent = data.code;
              break;   
          case "STUDENT_LEAVE": // mentor receives
              break;  
          case "STUDENT_JOIN": // mentor receives
              break;  
          case "ROOM_FULL": 
              alert("This room is full")
              window.location.href = "/index.html"
              break;   
          case "CLOSE_ROOM":
              alert("Room closed")
              window.location.href = "/index.html"
              break;    
        }
     })


     let attempts = []
     // update btn
     btn.addEventListener('click',function(){
      if(isMentor) return;
      webSocket.send(`CODE_UPDATE:${codeBlock.value}`)
      
      if(codeBlock.value === question.solution) {
        document.getElementById("model").classList.add("open");
       } else {
         document.getElementById("model-try-again").classList.add("open");
         attempts.push(codeBlock.value)
      }
      question.code = codeBlock.value;

      const updateData = {
        question: questionId,
        solutionSet: attempts,
        finalSolution: question.solution
      }

      fetch(`https://codeblocks-production.up.railway.app/question`,{
        method:'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .catch(error => {
        console.error('There was a problem with the POST request:', error);
      });

     })

     //close model
      const closeBtn=document.getElementById("close-model");
      const closetryBtn=document.getElementById("close-model-try");

      closeBtn.addEventListener('click',function(){
        document.getElementById("model").classList.remove("open");
      })
      closetryBtn.addEventListener('click',function(){
        document.getElementById("model-try-again").classList.remove("open");
      })
  });
