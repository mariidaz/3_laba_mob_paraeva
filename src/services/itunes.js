const BASE_URL = 'https://itunes.apple.com/search';

// Літери, які існують у російському алфавіті, але відсутні в українському
const RUSSIAN_LETTERS_REGEX = /[ёъыэЁЪЫЭ]/;

// Відомі російські виконавці та гурти (латиницею та кирилицею)
const BLOCKED_ARTISTS = [
  'morgenshtern', 'моргенштерн',
  'instasamka', 'инстасамка',
  'macan', 'макан',
  'basta', 'баста', 'ноггано', 'gazgolder',
  'oxxxymiron', 'оксимирон',
  'miyagi', 'мияги', 'эндшпиль', 'andy panda', 'hajime',
  'big baby tape', 'kizaru', 'кизару',
  'pharaoh', 'фараон',
  'slava marlow', 'слава марлоу',
  'hammali', 'navai', 'хаммали', 'наваи',
  'jony', 'джони',
  'rauf & faik', 'рауф',
  'markul', 'маркул',
  'scally milano', 'og buda', 'mayot', 'soda luv', 'toxi$', 'friendly thug', 'saluki',
  'shadowraze', 'uglystephan', 'heronwater', 'kai angel', '9mice',
  'егор крид', 'egor kreed', 'тимати', 'timati', 'black star', 'джиган', 'мот', 'клава кока',
  'anna asti', 'анна асти', 'artik & asti', 'артик и асти',
  'shaman', 'шаман', 'любэ', 'газманов', 'лепс', 'григорий лепс', 'стас михайлов',
  'киркоров', 'басков', 'меладзе', 'валерий меладзе',
  'кино', 'виктор цой', 'цой', 'сплин', 'би-2', 'bi-2', 'король и шут', 'киш',
  'земфира', 'zemfira', 'мумий тролль', 'mumiy troll', 'ленинград', 'шнуров',
  'руки вверх', 'дискотека авария', 'иванушки', 'звери', 'градусы', 'винтаж',
  'серебро', 'serebro', 'тату', 't.a.t.u.', 'tatu',
  'ддт', 'шевчук', 'ария', 'сектор газа', 'гражданская оборона', 'летова',
  'каста', 'кровосток', 'хаски', 'монеточка', 'дора', 'dora', 'мэйби бэйби',
  'три дня дождя', 'полматери', 'дайте танк', 'буерак', 'buerak', 'электрофорез',
  'кишлак', 'папин олимпос', 'нексюша', 'платина', 'перемотка', 'маяк',
  'порез на собаке', 'ssshhhiiittt', 'shortparis', 'ic3peak', 'аигел', 'aigel',
  'gspd', 'dead blonde', 'мукка', 'алена швец', 'скриптонит', 'scriptonite',
  'пошлая молли', 'face', 'фэйс', 'noize mc', 'нойз', 'лсп', 'lsp',
];

function isRussianContent(artistName = '', albumTitle = '') {
  // 1. Перевірка на специфічні російські літери
  if (RUSSIAN_LETTERS_REGEX.test(artistName) || RUSSIAN_LETTERS_REGEX.test(albumTitle)) {
    return true;
  }

  // 2. Перевірка на список заблокованих російських виконавців
  const artistLower = artistName.trim().toLowerCase();
  const titleLower = albumTitle.trim().toLowerCase();

  for (const blocked of BLOCKED_ARTISTS) {
    if (artistLower.includes(blocked) || blocked === artistLower || titleLower.includes(blocked)) {
      return true;
    }
  }

  return false;
}

export async function searchAlbums(term, { limit = 30 } = {}) {
  const query = term.trim();
  if (!query) return [];

  // Запитуємо з запасом (до 60 результатів), щоб після фільтрації залишився повний список
  const fetchLimit = Math.min(Math.max(limit * 2, 40), 100);
  const url = `${BASE_URL}?term=${encodeURIComponent(query)}&entity=album&country=ua&limit=${fetchLimit}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати альбоми. Спробуй ще раз.');
  
  const payload = await response.json();
  const rawResults = payload.results || [];

  // Фільтруємо російських виконавців та треки
  const filtered = rawResults.filter((item) => {
    const artist = item.artistName || '';
    const title = item.collectionName || '';
    return !isRussianContent(artist, title);
  });

  return filtered.slice(0, limit).map((item) => ({
    id: String(item.collectionId),
    title: item.collectionName || 'Без назви',
    artist: item.artistName || 'Невідомий виконавець',
    artwork: (item.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
    genre: item.primaryGenreName || 'Музика',
    releaseDate: item.releaseDate || '',
    trackCount: item.trackCount || null,
    storeUrl: item.collectionViewUrl || '',
    country: item.country || 'Ukraine',
  }));
}
