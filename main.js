const privateContacts = document.querySelector(".private-contacts");
const loader = document.querySelector(".loader");
const myContact = document.querySelector(".my-contact");
const darkBtn = document.getElementById("darkmode");
const lightBtn = document.getElementById("lightmode");
let searchInput = document.querySelector(".search-box input")
const textInput = document.querySelector(".form-text-input")
const numberInput = document.querySelector(".form-number-input")
const addButton = document.querySelector(".add-contact-button")



const notyf = new Notyf({
  position: {
    x: 'right',
    y: 'top'
  }
});


async function getData() {
  loader.style.display = "inline-block";
  try {
    let res = await fetch(
      "https://68ce76ca6dc3f350777f0e06.mockapi.io/contacts/users"
    );
    let data = await res.json();
    console.log(data);
    renderData(data);
    searchInput.addEventListener("input", function () {
      let searchData = data.filter((item) => item.name.toLowerCase().trim().includes(searchInput.value.trim().toLowerCase()))
      if (searchData.legnth == 0) {
        myContact.innerHTML = 'CONTACT NOT FOUND'
      } else {
        myContact.innerHTML = null
        renderData(searchData)
      }
    })










  } catch (error) {
    console.log(error);
  } finally {
    loader.style.display = "none";
  }
}

darkBtn.addEventListener("click", () => {
  document.body.classList.add("dark");
});

lightBtn.addEventListener("click", () => {
  document.body.classList.remove("dark");
});

getData();

function renderData(data) {
  data.map((contact) => {
    myContact.innerHTML += `

      <div id="myContact">
      <div>
        <h4>${contact.name}</h4>
        <p>${contact.number}</p>
      </div>
      <div>
        <i onclick="updateData(${contact.id})"  class="fa-solid fa-pen"></i>
        <i onclick="deleteData(${contact.id})" class="fa-solid fa-trash"></i>
      </div>
      </div>

    `;
  });
}


async function deleteData(id) {
  try {
    let response = await fetch(`https://68ce76ca6dc3f350777f0e06.mockapi.io/contacts/users/${id}`, {
      method: 'DELETE'
    })
    if (response.ok === true) {
      myContact.innerHTML = null
      notyf.success('✅ Operatsiya muvaffaqiyatli');
      getData()
    } else {
      notyf.error('❌ Xatolik yuz berdi');
    }

  } catch (error) {
    console.log(error);
  }
}




async function updateData(id) {
  try {

    let newName = prompt("new name kiriting")
    let newNumber = +prompt("new number kiriting")

    let res = await fetch(`https://68ce76ca6dc3f350777f0e06.mockapi.io/contacts/users/${id}`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name: newName,
        number: newNumber
      })
    })

    if (res.ok == true) {
      notyf.success("contact edited")
      myContact.innerHTML = null
      getData()
    } else {
      notyf.error('❌ Xatolik yuz berdi');


    }



  } catch (error) {
    console.log(error);

  }
}





async function addDataToServer() {
  if (textInput.value === "" || numberInput.value === "") {
    notyf.error("Please enter any info")
  } else {
    let response = await fetch(`https://68ce76ca6dc3f350777f0e06.mockapi.io/contacts/users`, {
      method: 'POST',
      headers: {
        "Content-type": 'application/json'
      },
      body: JSON.stringify({
        name: textInput.value,
        number: numberInput.value
      })
    })
    if (response.ok == true) {
      notyf.success('✅ Contact addded');
      myContact.innerHTML = null
      getData()
      textInput.value = null
      numberInput.value = ""
    }
  }
}

addButton.addEventListener("click", addDataToServer)
