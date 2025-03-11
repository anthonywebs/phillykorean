'use strict';
let DATA = [];
let filteredData = [];
let keyword = '';
let currInd = 0;
let increase = 20;

const renderBanner = async () => {
  await initBanner(0);
  getEl('js-main-img-1').classList.add('bw-opacity-trans');

  getEl('js-header').scrollIntoView();
  await typeText('js-type-01', `PhillyKorean`, 70);
  await elapseTime(300);
  await elapseTime(200);

  getEl('js-type-02').style.color = '#d2d2d2';
  await typeText('js-type-02', `qna`, 50);
  
  getEl('js-type-03').style.color = '#d2d2d2';
  await typeText('js-type-03', `news`, 50);
  getEl('js-type-04').style.color = '#d2d2d2';
  await typeText('js-type-04', `board`, 50);
  await elapseTime(1000);
  moveSwitch('js-switch-02');
  await expandSwitch(3);
  await elapseTime(500);
  getEl('js-type-02').classList.add('font-color-transition');
  getEl('js-main-img-2').classList.add('col-opacity-trans');
  await turnOnSwitch(20);

  await elapseTime(2000);
  getEl('js-main-img-3').classList.add('full-opacity-trans');
  getEl('js-type-01').style.color = '#FFF';
  getEl('js-switch-wr').remove();
  getEl('js-type-02').classList.add('hidden');
  getEl('js-type-03').classList.add('hidden');
  getEl('js-type-04').classList.add('hidden');

  getEl('js-link').classList.add('opacity-trans');
  getEl('js-link').style.opacity = 1;
  getEl('js-link-details').classList.add('flashing');

}

const gotoHome = () => {
  window.location.href = './';
}

const startEventListener = () => {
  startContactListener(); // start listener
}

const hideName = name => {
  const arr = name.split('/');
  const nick = `[${arr[0].slice(0,1)}*/${arr[1]?.slice(0,2) ?? '**'}*]`;
  return nick;
}

const fetchData = async () => {
  await fetch('./js/data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse JSON response
  })
  .then(data => {
    DATA = data.map(message => {
      const { question, name, category, answers } = message;
      // console.log("AK: ", name, hideName(name))
      let key = `${category} ${question} `;
      // answers.forEach(message => key = key + message.answer);
      const updatedAnswers = answers.map(message => {
        key = key + message.answer;
        return {
          ...message, replier: hideName(message.replier)
        };
      })
      key = key.toLowerCase();
      return {
        ...message, key, name: hideName(name), answers: updatedAnswers,
      }
    });

    DATA.sort((a, b) => b.id - a.id);

    filteredData = [...DATA];
    filteredData.sort((a, b) => Math.random() - 0.5);

    console.log(DATA); // Use the JSON data
  })
  .catch(error => console.error('Error loading JSON:', error));
}

const renderTable = () => {
  const table = getEl('js-table');
  const len = Math.min(filteredData.length, currInd + increase);



  for (let i = currInd; i < len; i++) {
    const { id, date, name, question, answers } = filteredData[i];
    table.innerHTML += `
        <div id="${id}" class='table-row'>
          <div class='table-bullet'>
            *
          </div>
          <div class='table-cell table-question'>
            ${question}
            <div class='q-desc'>Date: <span class='blue'>${date}</span> &nbsp; Post by <span class='id'>${name}</span></div>
            <div class='answer-wr'>
              ${
                answers.map(answer => (`
                      <div class='a-desc'><span class='blue'> &gt; &nbsp; </span><span class='id'>${answer.replier}</span>: ${answer.answer}</div>
                  `)
                ).join('')
              }
            </div>
          </div>
        </div>
    `;
  };
}

const runFilter = () => {
  if (keyword !== '') {
    filteredData = DATA.filter(message => {
      return message.key.includes(keyword)
    })
  } else {
    filteredData = [...DATA];
    filteredData.sort((a, b) => Math.random() - 0.5);
  }

  console.log("AK: cnt", filteredData.length)
  getEl('js-table').innerHTML = '';
  renderTable();
}

const handleKeyword = e => {
  keyword = e.value.toLowerCase();
  console.log(e.value);
  runFilter();
  // VELOCITY = parseInt(e.value, 10);
  // localStorage.setItem('VELOCITY', VELOCITY);
  // fetchData();
}


const main = async () => {
  await fetchData();
  await loadEnv();
  startEventListener();
  const param = window.location.search.split(/=/);
  const id = param.length === 2 ? param[1] : '';
  // if (loc !== conv(cn)) bd.innerHTML = '';

  if (!isMobile()) {
    getEl('js-main-img-1').src = './img/banner-bw.jpg';
    getEl('js-main-img-2').src = './img/banner-col.jpg';
    getEl('js-main-img-3').src = './img/banner-full.jpg';
  }
  await loadFont();

  renderBanner();
  renderTable();

  if (id === 'qna') {
    setTimeout(() =>
      handleScroll('js-content'), 100
    )
  }


}

main();