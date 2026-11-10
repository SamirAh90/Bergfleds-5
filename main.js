const menu = document.querySelector('#menu');
const nav = document.querySelector('.site-nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '×' : '☰';
  });

  nav.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  });
}

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav a').forEach((link) => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

function getStockholmTime() {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return { weekday: values.weekday, minutes: Number(values.hour) * 60 + Number(values.minute) };
}

function updateOpeningStatus() {
  const { weekday, minutes } = getStockholmTime();
  const weekdayKey = weekday.replace('.', '').toLowerCase();
  const opening = { mån: [420, 960], tis: [420, 960], ons: [420, 960], tors: [420, 960], fre: [420, 780] };
  const hours = opening[weekdayKey];
  const open = Boolean(hours && minutes >= hours[0] && minutes < hours[1]);

  document.querySelectorAll('[data-opening-status]').forEach((status) => {
    status.classList.toggle('is-open', open);
    status.classList.toggle('is-closed', !open);
    const label = status.querySelector('span');
    if (label) label.textContent = open ? 'Öppet i butiken i dag' : 'Stängt just nu';
  });
}

updateOpeningStatus();

const quickForm = document.querySelector('#snabbforfragan');
if (quickForm) {
  let selectedArea = 'Industri';
  const areaButtons = quickForm.querySelectorAll('[data-area]');

  areaButtons.forEach((button) => {
    button.addEventListener('click', () => {
      areaButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      selectedArea = button.dataset.area;
    });
  });

  quickForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = quickForm.querySelector('#quick-message').value.trim();
    if (!message) return;
    const subject = encodeURIComponent(`Förfrågan – ${selectedArea}`);
    const body = encodeURIComponent(`Område: ${selectedArea}\n\nJag söker:\n${message}\n\nNamn/företag:\nTelefon:`);
    location.href = `mailto:order@bergfelds.se?subject=${subject}&body=${body}`;
  });
}

const suppliers = [
  { name: 'Milwaukee', image: 'assets/suppliers/milwaukee.png', category: 'verktyg' },
  { name: 'HiKOKI', image: 'assets/suppliers/hikoki.svg', category: 'verktyg' },
  { name: 'Bosch Professional', image: 'assets/suppliers/bosch.svg', category: 'verktyg' },
  { name: 'Kemppi', image: 'assets/suppliers/kemppi.svg', category: 'industri' },
  { name: 'Kärcher', image: 'assets/suppliers/karcher.svg', category: 'verktyg' },
  { name: 'Guide', image: 'assets/suppliers/guide.svg', category: 'skydd' },
  { name: 'Arbesko', image: 'assets/suppliers/arbesko.svg', category: 'skydd' },
  { name: 'Metabo', image: 'assets/suppliers/metabo.png', category: 'verktyg' },
  { name: 'Loctite', image: 'assets/suppliers/loctite.svg', category: 'industri' },
  { name: 'Fiskars', image: 'assets/suppliers/fiskars.png', category: 'verktyg' },
  { name: 'SKF', image: 'assets/suppliers/skf.svg', category: 'industri' },
  { name: 'Hultafors', image: 'assets/suppliers/hultafors.svg', category: 'verktyg' },
  { name: 'Cederroth', image: 'assets/suppliers/cederroth.svg', category: 'skydd' },
  { name: 'Luna', image: 'assets/suppliers/luna.png', category: 'verktyg' },
  { name: 'Hitachi Energy', image: 'assets/logos/hitachi-energy.png', category: 'industri' },
  { name: 'Nordic Iron', image: 'assets/logos/nordic-iron.svg', category: 'industri' },
  { name: 'Log Max', image: 'assets/logos/logmax.png', category: 'industri' },
  { name: 'Spendrups', image: 'assets/logos/spendrups.jpg', category: 'industri' },
  { name: 'Dala Takentreprenader', image: 'assets/logos/dalatak.png', category: 'industri', url: 'http://dalatak.se/' },
  { name: 'Elbolaget Montage AB', image: 'assets/logos/elbolaget.png', category: 'industri', url: 'https://elbolaget.se/' },
  { name: 'Byggbolaget i Bergslagen AB', image: 'assets/logos/byggbolaget.png', category: 'industri', url: 'https://bygg-bolaget.se/' },
  { name: 'Trio Perfekta', image: 'assets/logos/trio-perfekta.png', category: 'industri', url: 'https://www.trio-perfekta.se/' },
  { name: 'LG IT AB', image: 'assets/logos/lgit.png', category: 'industri', url: 'https://lgit.se/kontakt/' },
  { name: 'DALACC', image: 'assets/logos/dalacc.png', category: 'industri', url: 'https://www.dalacc.se/' },
  { name: 'AKETEK', image: 'assets/logos/aketek.webp', category: 'industri', url: 'https://www.aketek.com/sv-se/' }
];

const brandGrid = document.querySelector('[data-brand-grid]');
if (brandGrid) {
  suppliers.slice(0, 12).forEach((supplier) => {
    const tile = document.createElement('div');
    tile.className = 'brand-tile';
    tile.dataset.name = supplier.name.toLowerCase();
    tile.dataset.category = supplier.category;
    const image = document.createElement('img');
    image.src = supplier.image;
    image.alt = supplier.name;
    image.loading = 'lazy';
    tile.append(image);
    brandGrid.append(tile);
  });

  const search = document.querySelector('#brand-search');
  const filters = document.querySelectorAll('[data-filter]');
  let activeFilter = 'all';

  const filterBrands = () => {
    const query = (search?.value || '').trim().toLowerCase();
    brandGrid.querySelectorAll('.brand-tile').forEach((tile) => {
      const matchesText = tile.dataset.name.includes(query);
      const matchesFilter = activeFilter === 'all' || tile.dataset.category === activeFilter;
      tile.hidden = !(matchesText && matchesFilter);
    });
  };

  search?.addEventListener('input', filterBrands);
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.dataset.filter;
      filterBrands();
    });
  });
}

const directory = document.querySelector('.supplier-directory');
if (directory) {
  suppliers.forEach((supplier) => {
    const card = document.createElement(supplier.url ? 'a' : 'article');
    card.className = 'supplier-directory-card';
    if (supplier.url) {
      card.href = supplier.url;
      card.target = '_blank';
      card.rel = 'noreferrer';
    }
    const visual = document.createElement('div');
    visual.className = 'directory-logo';
    const image = document.createElement('img');
    image.src = supplier.image;
    image.alt = supplier.name;
    image.loading = 'lazy';
    visual.append(image);
    const title = document.createElement('h3');
    title.textContent = supplier.name;
    const text = document.createElement('p');
    text.textContent = 'Leverantör och varumärke i Bergfelds nätverk.';
    card.append(visual, title, text);
    directory.append(card);
  });
}
