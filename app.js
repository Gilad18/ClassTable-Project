const studentAPI = 'https://appleseed-wa.herokuapp.com/api/users/';
const weatherAPi = 'http://api.openweathermap.org/data/2.5/weather?q='
const weatherAPIappid = '&appid=7e8ebb0f6b5f27514ded7844e46b2832&units=metric'
const table = document.querySelector('table');
const search = document.querySelector('.search')
const searchBy = document.querySelector('select');


let myClass = [];

const getStudent = async () => {
    let myData = await fetch(studentAPI);
    let jsonData = await myData.json()
    for (let i = 0; i < jsonData.length; i++) {
        let myStudent = {
            id: jsonData[i].id,
            first: jsonData[i].firstName,
            last: jsonData[i].lastName,
            capsule : jsonData[i].capsule,
            age: await getMoreData(jsonData[i].id, 'age'),
            gender: await getMoreData(jsonData[i].id, 'gender'),
            city: await getMoreData(jsonData[i].id, 'city'),
            hobby: await getMoreData(jsonData[i].id, 'hobby'),
        }
        myClass.push(myStudent)
    }
    await createTable(myClass);
    await localStorage.setItem("clasList", JSON.stringify(myClass));
}

const getMoreData = async (id, prop) => {
    let moreData = await fetch(`${studentAPI}${id}`);
    let moreJsonData = await moreData.json()
    return moreJsonData[prop];
}

const getcityWeather = async (city) => {
    try{
        let myData = await fetch(`${weatherAPi}${city}${weatherAPIappid}`);
        let jsonData = await myData.json();
        return `${jsonData.main.temp} C , ${jsonData.weather[0].description}`
    }
    catch {
        return 'NA'
    }
    
}

const getTheCityWeatherFromArray = (city , arr) => {
  let theRequested = arr.find((item)=>{
      return item.name === city
  });
  return theRequested.temp;
}

const showWeather = (e) => {
    let thehovered = e.currentTarget.innerHTML
    let temp = getTheCityWeatherFromArray(thehovered ,citesWeather );
    e.currentTarget.style.backgroundColor = 'yellow'
    e.currentTarget.innerHTML = temp
}

const removeWeather = (e) => {
    e.currentTarget.style.backgroundColor = 'rgb(248, 246, 244)'
   let theID = parseInt(e.currentTarget.parentElement.firstChild.innerHTML);
   let theStudent = myClass.find((item)=> {
      return item.id === theID
   })
   e.currentTarget.innerHTML = theStudent.city
}

const deleteFromArray = (id) => {
    let requested = myClass.find((item) => {
        return item.id === id;
    });
    let position = myClass.indexOf(requested);
    myClass.splice(position, 1);
    localStorage.setItem("clasList", JSON.stringify(myClass));
}

const updateTheArray = (id, param, newText) => {
    let requested = myClass.find((item) => {
        return item.id === id;
    });
    if (param === 'age'||param==='capsule') {
        requested[param] = parseInt(newText);
    } else {
        requested[param] = newText;
    }
    localStorage.setItem("clasList", JSON.stringify(myClass));
}

const cancelEdit = () => {
    createTable(myClass);
}

const doneEdit = (e) => {
    let theRowOptions = e.currentTarget.parentElement;
    let theRow = theRowOptions.parentElement;
    let studentID = parseInt(theRow.firstChild.innerHTML)
    let editableTD = theRow.querySelectorAll('.editable');
    editableTD.forEach((item) => {
        let keepValue = item.firstChild.value;
        let data = item.getAttribute('data');
        updateTheArray(studentID, data, keepValue);
    })

    createTable(myClass)
}

const editRow = (e) => {
    let theRowOptions = e.currentTarget.parentElement;
    let editBTN = theRowOptions.firstChild;
    editBTN.removeEventListener('click', editRow);
    editBTN.innerHTML = '<i class="fas fa-check"></i>';
    editBTN.addEventListener('click', doneEdit);
    let deleteBTN = theRowOptions.lastChild;
    deleteBTN.removeEventListener('click', deleteRow);
    deleteBTN.innerHTML = '<i class="fas fa-times"></i>';
    deleteBTN.addEventListener('click', cancelEdit);
    let theRow = theRowOptions.parentElement;
    let editableTD = theRow.querySelectorAll('.editable');
    editableTD.forEach((item)=>{
        item.removeEventListener('mouseenter',showWeather)
        item.removeEventListener('mouseout',removeWeather)
    })
    editableTD.forEach((item) => {
        let keepValue = item.innerHTML;
        item.innerHTML = `<input type=text>`;
        item.firstElementChild.value = `${keepValue}`;
    })
}

const deleteRow = (e) => {
    let theRow = e.currentTarget.parentElement;
    let theID = parseInt(theRow.parentElement.firstElementChild.innerHTML);
    deleteFromArray(theID);
    theRow.parentElement.remove();
}

const addEventsListeners = () => {
    let myEditButtons = document.querySelectorAll('.edit');
    myEditButtons.forEach((item) => item.addEventListener('click', editRow));
    let myDeleteButtons = document.querySelectorAll('.delete');
    myDeleteButtons.forEach((item) => item.addEventListener('click', deleteRow));

}

const createTable = async (arr) => {
    table.innerHTML = `<tr>
    <th>ID</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Capsule</th>
    <th>Gender</th>
    <th>Age </i></th>
    <th>City</th>
    <th>Hobby</th>
    <th>Options</th>
  </tr>` ;

    for (let i = 0; i < arr.length; i++) {
        let newRow = document.createElement('tr');

        let idtd = document.createElement('td');
        idtd.textContent = arr[i].id;
        newRow.appendChild(idtd);

        let firsttd = document.createElement('td');
        firsttd.classList.add('editable');
        firsttd.setAttribute('data', 'first');
        firsttd.textContent = arr[i].first
        newRow.appendChild(firsttd);

        let lasttd = document.createElement('td');
        lasttd.classList.add('editable');
        lasttd.setAttribute('data', 'last');
        lasttd.textContent = arr[i].last
        newRow.appendChild(lasttd);

        let capstd = document.createElement('td');
        capstd.classList.add('editable');
        capstd.setAttribute('data', 'capsule');
        capstd.textContent = arr[i].capsule
        newRow.appendChild(capstd);

        let gendertd = document.createElement('td');
        gendertd.classList.add('editable');
        gendertd.setAttribute('data', 'gender');
        gendertd.textContent = arr[i].gender.toUpperCase()
        newRow.appendChild(gendertd);

        let agetd = document.createElement('td');
        agetd.classList.add('editable');
        agetd.setAttribute('data', 'age');
        agetd.textContent = arr[i].age
        newRow.appendChild(agetd);

        let citytd = document.createElement('td');
        citytd.classList.add('editable',);
        citytd.setAttribute('data', 'city');
        citytd.addEventListener('mouseenter',showWeather)
        citytd.addEventListener('mouseout',removeWeather)
        citytd.textContent = arr[i].city
        newRow.appendChild(citytd);

        let hobytd = document.createElement('td');
        hobytd.classList.add('editable');
        hobytd.setAttribute('data', 'hobby');
        hobytd.textContent = arr[i].hobby
        newRow.appendChild(hobytd);
        let options = document.createElement('td');
        options.innerHTML = `<button class="edit"><i class="fas fa-edit"></i></button><button class="delete"><i class="fas fa-trash-alt"></i></button>`
        newRow.appendChild(options);

        table.appendChild(newRow);

    }
    await addEventsListeners();
}

let myLocal = JSON.parse(localStorage.getItem("clasList"));

if (myLocal === null) {
    getStudent();
} else if (myLocal !== null) {
    myClass = myLocal;
    createTable(myClass)
}

let citesWeather = [];

const createCityWeatherObj = async () => {
    for(let i=0; i<myClass.length; i++) {
        let myObj = await {
            name : myClass[i].city,
            temp : await getcityWeather(myClass[i].city)
        }
        citesWeather.push(myObj);
    }
}

createCityWeatherObj();


const applySearch = (letter , prop) =>{
let requested = myClass.filter((item)=> {
    return item[prop].includes(letter);
})
createTable(requested)
}

const serachFun = ()=>{
    let theletter = search.value;
    let theProp = searchBy.value.toLowerCase();
    applySearch(theletter,theProp);
}

search.addEventListener('keyup' , serachFun)

