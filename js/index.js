'use strict';
let DATA = [];
let filteredData = [];
let keyword = '';
let category = '';
let currInd = 0;
let increase = 20;
let showAnswers = false;
let ranking = [];
let rankingMax = 30;


const ads = [
  {
    url: "https://the-brian-kang-team-blue-bell-pa.remax.com/",
    desc: "23년 경력의 필라델피아 한인 전문 리얼터"
    // desc: "필라델피아 한인들을 위한 23년 경력 리얼터"
  },
  {
    url: "https://www.hcmhomeservices.com/",
    desc: "HVAC전문 (난방, 에어컨, 보일러) 및 집 리모델링"
  },
  {
    url: "https://www.google.com/maps/place/Rock+%26+Symphony+Learning+Center/@40.2319445,-75.270661,16z/data=!3m1!4b1!4m6!3m5!1s0x89c6a3b3cd785d5b:0xc6fe3d01e87e976c!8m2!3d40.2319445!4d-75.2680861!16s%2Fg%2F11lfbcd9y4?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D",
    desc: "뮤직 레슨, 악기 세일/렌트 [North Wales]"
  },
  {
    url: "https://towerpa.com/",
    desc: "집수리, 리모델링, 플로어링, 페인트 [North Wales]"
  },
];

const renderAds = () => {
  const dt = new Date();
  // dt.setHours(dt.getHours() + 3); // test
  const hours = dt.getHours();
  const len =  ads.length;

  const left = hours % len;
  let right = (left + 1) % len;

  const adEl = getEl('js-ad');

  // for (let i = 0; i < ads.length; i++) {
  //   adEl.innerHTML += `
  //       <div class='ad-img-wr'>
  //         <a target='_blank' href='${ads[i].url}'><img class='ad-img' src='./img/b${i}.jpg' />
  //           <span class='ad-text'>${ads[i].desc}</span>
  //         </a>
  //       </div>
  //   `;
  // }

  adEl.innerHTML = `
          <div class='ad-img-wr'>
            <a target='_blank' href='${ads[left].url}'><img class='ad-img' src='./img/b${left}.jpg' />
              <span class='ad-text'>${ads[left].desc}</span>
            </a>
          </div>
          <div class='ad-img-wr'>
            <a target='_blank' href='${ads[right].url}'><img class='ad-img' src='./img/b${right}.jpg' />
              <span class='ad-text'>${ads[right].desc}</span>
            </a>
          </div>
  `;

}

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
          ...message, replier: hideName(message.replier), id: message.replier,
        };
      })
      key = key.toLowerCase();
      return {
        ...message, key, name: hideName(name), answers: updatedAnswers, id: name,
      }
    });

    // DATA.sort((a, b) => b.id - a.id);
    DATA.reverse();

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
  let len = Math.min(filteredData.length, currInd + increase);
  if (keyword === '' && category === '' && currInd === 0) {
    len = Math.min(10, len);
  }

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
            <div class='more-data blue' onclick='handleLoadNext()'> &gt;&gt; 다음 ${increase}개 열기</div>
          </div>
      `;
  }
// console.log("AK: len", filteredData.length)
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
  if (keyword === '' && category === '' && currInd === 0) {
    currInd += 10;
  } else {
    currInd += increase;
  }
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
  getEl('js-table').style.opacity = 0.2;
  
  setTimeout(() => {
    getEl('js-table').style.opacity = 1;
    runFilter();
  }, 500);
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
  }, 1000);
}

const handleClickRow = row => {
  const answerWrapper = row.querySelector('.answer-wr'); 
  if (answerWrapper) {
    const currentDisplay = window.getComputedStyle(answerWrapper).display; // Get actual computed display value

    // Toggle display based on computed style
    answerWrapper.style.display = (currentDisplay === 'none') ? 'block' : 'none';
  }
}

const runRanking = () => {
  const map = new Map();

  for (let i = 0; i < DATA.length; i++) {
    const { id, question, answers } = DATA[i];
    map.set(id, (map.get(id) || 0) + question.length);
    for (let j = 0; j < answers.length; j++) {
      const { id, answer } = answers[j];
      map.set(id, (map.get(id) || 0) + answer.length);
    }
  }

  for (const [id, score] of map) {
    ranking.push({
      name: id,
      cnt: score
    })
  }

  ranking.sort((a, b) => b.cnt - a.cnt);
  
}


const renderRanking = () => {
  runRanking();
  // ranking.sort((a, b) => a.name.localeCompare(b.name));
  // console.log(ranking);
  const table = getEl('js-ranking');
  const topScore = ranking[0].cnt;

  for (let i = 0; i < rankingMax; i++) {

    const { name, cnt } = ranking[i];
    // const progress = parseInt(issue.donePoint / updatedTotalPoint * 100, 10);
    const progress = parseInt(cnt/topScore * 100);

    const statusElem = `<div class='status' style='background: linear-gradient(to right, lightblue ${progress}%, transparent ${progress}%);'><span class='status-text'>${cnt}</span></div>`;

    table.innerHTML += `
        <div id='js-ul' class='al_center' aria-live='polite'>
            <div class='li_main'>
              <div class='w w-ranking col-mid'>${i + 1}</div>
              <div class='w w-name'>${name}</div>
              <div class='w w-score col-mid'>${statusElem}</div>
            </div>
          </div>
        </div>
    `;
  }
}

const main = async () => {
  await fetchData();
  await loadEnv();
  // startEventListener();
  const param = window.location.search.split(/=/);
  const id = param.length === 2 ? param[1] : '';

  if (!isMobile()) {
    getEl('js-main-img-1').src = './img/banner-bw.jpg';
    getEl('js-main-img-2').src = './img/banner-col.jpg';
    getEl('js-main-img-3').src = './img/banner-full.jpg';
  }
  await loadFont();

  renderBanner();
  renderTable();
  renderAds();
  renderRanking();

  if (id !== '') {
    if (id !== 'qna') {
      keyword = decodeURIComponent(id).toLowerCase();
      if (keyword.length > 0) {
        getEl('js-keyword').value = keyword;
        if (toggleSwitch.checked === false) {  // Only trigger if it's currently checked
          toggleSwitch.checked = true;
          toggleSwitch.dispatchEvent(new Event('change')); // Fire the change event
        }
      }
      runFilter();
    }

    setTimeout(() => handleScroll('js-content'), 100);

  }


}

main();