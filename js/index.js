'use strict';
let DATA = [];
let filteredData = [];
let keyword = '';
let category = '';
let currInd = 0;
let increase = 20;
let showAnswers = false;

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
  })
  .catch(error => console.error('Error loading JSON:', error));
}

const highlight = msg => {
  if (keyword === '') return msg;

  const ind = msg.toLowerCase().indexOf(keyword);
  if (ind === -1) return msg;

  const before = msg.slice(0, ind);
  const highlight = msg.slice(ind, ind + keyword.length);
  const after = msg.slice(ind + keyword.length);

  return `${before}<span class="hl">${highlight}</span>${after}`;

}

const renderTable = () => {
  const table = getEl('js-table');
  const len = Math.min(filteredData.length, currInd + increase);

  if (filteredData.length === 0) {
    table.innerHTML = `
          <div class='table-cell table-question'>
            <span class='no-data'>* 검색 결과가 없습니다.</span>
          </div>
      `;
    return;
  }

  for (let i = currInd; i < len; i++) {
    let { id, date, name, question, answers } = filteredData[i];

    question = highlight(question);

    table.innerHTML += `
        <div id="${id}" onclick='handleClickRow(this)' class='table-row'>
          <div class='table-bullet'>
            *
          </div>
          <div class='table-cell table-question'>
            ${question}
            <div class='q-desc'>Date: <span class='blue'>${date}</span> &nbsp; Posted by <span class='id'>${name}</span></div>
            <div class='answer-wr'>
              ${
                answers.map(answer => (`
                      <div class='a-desc'><span class='blue'> &gt; &nbsp; </span><span class='id'>${answer.replier}</span> ${highlight(answer.answer)}</div>
                  `)
                ).join('')
              }
            </div>
          </div>
        </div>
    `;
  };

  if (filteredData.length > len) {
    table.innerHTML += `
          <div id='js-load-link'>
            <div class='more-data blue' onclick='handleLoadNext()'> &gt;&gt; ${increase}개 더 보기</div>
          </div>
      `;
  }

  runToggle();


}

const runFilter = () => {
  currInd = 0;
  if (category !== '') {
    filteredData = DATA.filter(message => message.category === category);
  } else {
    filteredData = [...DATA];
  }


  if (keyword !== '') {
    filteredData = filteredData.filter(message => {
      return message.key.includes(keyword)
    })
  }

  getEl('js-table').innerHTML = '';
  renderTable();
}

const handleLoadNext = () => {
  getEl('js-load-link').remove();
  currInd += increase;
  renderTable();

}

const handleKeyword = e => {
  keyword = e.value.toLowerCase();
  if (keyword.length > 0) {
    if (toggleSwitch.checked === false) {  // Only trigger if it's currently checked
      toggleSwitch.checked = true;
      toggleSwitch.dispatchEvent(new Event('change')); // Fire the change event
    }
  }
  runFilter();
}

const handleCategory = e => {
  category = e?.value ?? '';
  runFilter();
}

const runToggle = () => {
  const answerEls = document.querySelectorAll('.answer-wr');
  for (let i = 0; i < answerEls.length; i++) {
    answerEls[i].style.display = showAnswers ? 'block' : 'none';
  }
}

const handleToggle = e => {
  showAnswers = !showAnswers;
  runToggle();
}

const handleRanking = () => {
  getEl('js-ranking-btn').style.display = 'none';
  getEl('js-loading').classList.remove('hidden');
  setTimeout(() => {
    getEl('js-loading').classList.add('hidden');
    getEl('js-ranking').classList.remove('hidden')
  }, 2000);
}

const handleClickRow = row => {
  const answerWrapper = row.querySelector('.answer-wr'); 
  if (answerWrapper) {
    const currentDisplay = window.getComputedStyle(answerWrapper).display; // Get actual computed display value

    // Toggle display based on computed style
    answerWrapper.style.display = (currentDisplay === 'none') ? 'block' : 'none';
  }
}

const renderRanking = () => {
  const table = getEl('js-ranking');
  ranking.forEach((row, rank) => {
    const { name, cnt } = row;
    // const progress = parseInt(issue.donePoint / updatedTotalPoint * 100, 10);
    const progress = parseInt(cnt/15,10) + 33;

    const statusElem = `<div class='status' style='background: linear-gradient(to right, lightblue ${progress}%, transparent ${progress}%);'><span class='status-text'>${cnt}</span></div>`;

    table.innerHTML += `
        <div id='js-ul' class='al_center' aria-live='polite'>
            <div class='li_main'>
              <div class='w w-ranking col-mid'>${rank + 1}</div>
              <div class='w w-name'>${name}</div>
              <div class='w w-score col-mid'>${statusElem}</div>
            </div>
          </div>
        </div>
    `;
  })


}

const main = async () => {
  await fetchData();
  await loadEnv();
  // startEventListener();
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
  renderRanking();

  if (id === 'qna') {
    setTimeout(() =>
      handleScroll('js-content'), 100
    )
  }


}

main();