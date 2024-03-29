
document.addEventListener("DOMContentLoaded", async function () {

  const titlesUl=document.getElementById("codeTitlesList")

  try {
    const questions = await fetch("https://codeblocks-production.up.railway.app/questions", {
      headers: {
        'Content-Type': "application/json"
      }
    }).then(res => res.json())
    
    questions.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
      <a href="codeblock.html?questionId=${item._id}">
      ${item.title}
      </a>
      `
    
      titlesUl.appendChild(li);
    });
  
  }catch(e) {
    console.log(e)
  }
 });

