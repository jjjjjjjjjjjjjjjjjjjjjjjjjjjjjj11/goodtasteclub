const stage = document.querySelector('#stage');
const nodeTemplate = document.querySelector('#nodeTemplate');
const infoBoxTemplate = document.querySelector('#infoBoxTemplate');
const inspector = document.querySelector('#inspector');
const closeInspectorBtn = document.querySelector('#closeInspector');
const focusImage = document.querySelector('#focusImage');
const focusTitle = document.querySelector('#focusTitle');
const focusDesc = document.querySelector('#focusDesc');

const baseItems = [
  {
    id: 'otsuka-no8',
    kind: 'product',
    title: 'Otsuka Lotec No.8',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=720&q=80',
    review: '기계적 감성과 미니멀 디자인이 공존하는 시계.',
    description: '산업디자인 감성이 강한 독립 시계 브랜드. 독특한 시간 표시 방식이 매력 포인트.',
    seedTopics: [
      '제작자 인터뷰',
      '실구매자 후기',
      '동일 가격대 비교',
      '최저가 구매 가이드(관부가세 포함)',
      '숫자 폰트 역사',
      'Reddit/노트 동시 언급 키워드',
      '손목시계 역사',
      '스타일링 추천',
      '핵심 스펙 요약'
    ]
  },
  {
    id: 'human-curator-1',
    kind: 'human',
    title: '큐레이터 Mina',
    image: 'https://images.unsplash.com/photo-1494790108755-2616c6d3c4d5?auto=format&fit=crop&w=720&q=80',
    review: '브랜드의 태도까지 읽어내는 취향 큐레이터.',
    description: '소재, 가격, 스토리텔링을 함께 보며 제품을 추천하는 에디터.',
    seedTopics: ['최근 큐레이션', 'Mina의 추천 키워드', '브랜드 철학 분석']
  },
  {
    id: 'product-camera',
    kind: 'product',
    title: 'Rangefinder Camera',
    image: 'https://images.unsplash.com/photo-1519183071298-a2962be96cfd?auto=format&fit=crop&w=720&q=80',
    review: '빛과 질감을 아날로그로 기록하고 싶은 날.',
    description: '수동 조작의 즐거움을 주는 클래식 카메라.',
    seedTopics: ['필름 유형 비교', '사용자 촬영 후기', '예산별 대안 모델']
  },
  {
    id: 'human-stylist',
    kind: 'human',
    title: '스타일리스트 Joon',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80',
    review: '아이템 하나로 무드를 바꾸는 스타일 해석가.',
    description: '패션/테크/라이프스타일을 교차해 스타일 가이드를 제공.',
    seedTopics: ['오늘의 룩북', '아이템 믹스 가이드', '시즌별 추천']
  }
];

let activeNode = null;
let boxes = [];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function placeNode(node) {
  const x = randomBetween(-42, 42);
  const y = randomBetween(8, 72);
  const z = randomBetween(-460, 120);
  node.style.setProperty('--x', `${x}vw`);
  node.style.setProperty('--y', `${y}vh`);
  node.style.setProperty('--z', `${z}px`);
  node.style.setProperty('--drift', `${randomBetween(8, 15).toFixed(2)}s`);
}

function clearBoxes() {
  boxes.forEach((el) => el.remove());
  boxes = [];
}

function pseudoSummary(topic, originTitle) {
  const flavors = [
    '핵심만 짧게 보면,',
    'AI 요약 기준으로는',
    '실시간 피드 흐름을 보면',
    '커뮤니티 반응을 합치면'
  ];
  const endings = [
    '구매 전 체크포인트가 명확합니다.',
    '입문자와 수집가의 관점이 크게 갈립니다.',
    '가격 대비 만족도는 상위권으로 보입니다.',
    '스타일/기능 균형이 결정 포인트입니다.'
  ];

  return `${flavors[Math.floor(Math.random() * flavors.length)]} ${originTitle}의 "${topic}"은(는) ${endings[Math.floor(Math.random() * endings.length)]}`;
}

function createInfoBoxes(sourceItem) {
  clearBoxes();
  const total = Math.min(8, sourceItem.seedTopics.length);

  for (let i = 0; i < total; i += 1) {
    const info = infoBoxTemplate.content.firstElementChild.cloneNode(true);
    const theta = (Math.PI * 2 * i) / total;
    const radiusX = randomBetween(16, 28);
    const radiusY = randomBetween(9, 20);
    const ix = `${Math.cos(theta) * radiusX}vw`;
    const iy = `${Math.sin(theta) * radiusY + 45}vh`;

    info.style.setProperty('--ix', ix);
    info.style.setProperty('--iy', iy);

    const topic = sourceItem.seedTopics[i];
    info.querySelector('.info-thumb').src = sourceItem.image;
    info.querySelector('.info-thumb').alt = `${sourceItem.title} - ${topic}`;
    info.querySelector('.info-title').textContent = topic;
    info.querySelector('.info-summary').textContent = pseudoSummary(topic, sourceItem.title);

    const expand = () => {
      const nextNode = {
        ...sourceItem,
        title: `${sourceItem.title} · ${topic}`,
        description: pseudoSummary(topic, sourceItem.title),
        seedTopics: [
          `${topic}의 세부 근거`,
          `${topic} 관련 해외 반응`,
          `${topic} 대체 선택지`,
          `${topic} 기반 스타일/활용`
        ]
      };
      focusOnNode(nextNode, null);
    };

    info.addEventListener('click', expand);
    info.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        expand();
      }
    });

    stage.append(info);
    boxes.push(info);
  }
}

function focusOnNode(item, nodeEl) {
  if (activeNode) {
    activeNode.classList.remove('active');
  }

  if (nodeEl) {
    activeNode = nodeEl;
    activeNode.classList.add('active');
  }

  inspector.classList.remove('hidden');
  focusImage.src = item.image;
  focusTitle.textContent = item.title;
  focusDesc.textContent = item.description;

  createInfoBoxes(item);
}

function spawnNodes() {
  baseItems.forEach((item) => {
    const node = nodeTemplate.content.firstElementChild.cloneNode(true);
    const image = node.querySelector('.node-image');
    const bubble = node.querySelector('.bubble');

    image.src = item.image;
    image.alt = item.title;
    bubble.textContent = item.review;
    placeNode(node);

    node.addEventListener('click', () => focusOnNode(item, node));
    node.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        focusOnNode(item, node);
      }
    });

    stage.append(node);
  });
}

closeInspectorBtn.addEventListener('click', () => {
  inspector.classList.add('hidden');
  if (activeNode) {
    activeNode.classList.remove('active');
    activeNode = null;
  }
  clearBoxes();
});

spawnNodes();
