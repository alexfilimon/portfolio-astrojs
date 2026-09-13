import type { ImageMetadata } from 'astro';

const descriptions: Record<string, { ru: string; en: string }> = {
  'DSCF0208.jpeg': {
    ru: 'Силуэты городских зданий у реки на закате',
    en: 'City buildings silhouetted beside a river at sunset',
  },
  'DSCF0214.jpeg': {
    ru: 'Деревья и пальмы под высоким сводом стеклянной оранжереи',
    en: 'Trees and palms beneath the high arched roof of a glasshouse',
  },
  'DSCF0248.jpeg': {
    ru: 'Белый лебедь и серые птенцы идут по зелёному газону',
    en: 'A white swan and grey cygnets walking across a green lawn',
  },
  'DSCF0359.jpeg': {
    ru: 'Резной фасад и готические шпили Миланского собора на фоне синего неба',
    en: 'The ornate facade and Gothic spires of Milan Cathedral against a blue sky',
  },
  'DSCF0402.jpeg': {
    ru: 'Каменная лестница спускается между красно-оранжевыми стенами под белым сводом',
    en: 'A stone staircase descending between red-orange walls beneath a white vaulted ceiling',
  },
  'DSCF2324.jpeg': {
    ru: 'Белое колесо обозрения над листьями пальм на фоне голубого неба',
    en: 'A white Ferris wheel rising above palm fronds against a blue sky',
  },
  'DSCF2739.jpeg': {
    ru: 'Вид снизу на опоры, тросы и обод колеса обозрения',
    en: 'An upward view of the supports, cables and rim of a Ferris wheel',
  },
  'DSCF3340.jpeg': {
    ru: 'Панорама Лондона с изгибом Темзы, жилыми кварталами и небоскрёбами вдали',
    en: 'A panorama of London with a bend in the Thames, residential buildings and distant skyscrapers',
  },
  'DSCF3410.jpeg': {
    ru: 'Чёрно-белая сигнальная башня за песчаным холмом',
    en: 'A black-and-white beacon behind a sandy mound',
  },
  'DSCF3496.jpeg': {
    ru: 'Кресла цепочной карусели кружатся высоко в небе вокруг башни',
    en: 'Seats on a swing ride circling a tall tower high against the sky',
  },
  'DSCF3523.jpeg': {
    ru: 'Светящийся красно-синий знак лондонского метро на фоне ночного неба',
    en: 'An illuminated red-and-blue London Underground sign against the night sky',
  },
  'DSCF4380.jpeg': {
    ru: 'Пассажир держит раскрытую газету The Telegraph в вагоне поезда',
    en: 'A passenger holding an open copy of The Telegraph inside a train carriage',
  },
  'DSCF4683.jpeg': {
    ru: 'Узкий каменный мост с покрытыми мхом парапетами среди голых деревьев',
    en: 'A narrow stone bridge with moss-covered parapets among bare trees',
  },
  'DSCF5594.jpeg': {
    ru: 'Бетонный фасад здания PRYZM с рядами выступающих треугольных элементов',
    en: 'The concrete facade of the PRYZM building with rows of projecting triangular forms',
  },
  'DSCF5975.jpeg': {
    ru: 'Красный зал с рядами скамеек и экраном с логотипом Cup Noodles Museum',
    en: 'A red auditorium with rows of benches and a screen displaying the Cup Noodles Museum logo',
  },
  'DSCF8483.jpeg': {
    ru: 'Пушистая белая кошка с тёмными пятнами рядом с теннисной ракеткой и тремя мячами на диване',
    en: 'A fluffy white cat with dark patches beside a tennis racket and three balls on a sofa',
  },
  'DSCF9035.jpeg': {
    ru: 'Изогнутые белые формы современного здания на фоне тёмно-синего неба',
    en: 'Curving white forms of a modern building against a deep blue sky',
  },
  'DSCF9581.jpeg': {
    ru: 'Белый скоростной поезд с красной полосой среди путей и проводов, за столбом с наклейками',
    en: 'A white high-speed train with a red stripe among tracks and overhead wires, behind a sticker-covered pole',
  },
  'DSCF9697.jpeg': {
    ru: 'Ряд узких кирпичных домов с фигурными фронтонами у воды',
    en: 'A row of narrow brick houses with decorative gables beside the water',
  },
  'cornwell-80.jpeg': {
    ru: 'Белая башня маяка на фоне спокойного голубого моря',
    en: 'A white lighthouse tower against a calm blue sea',
  },
  'paris-13.jpeg': {
    ru: 'Каменный арочный мост через Сену, деревья и светлые здания на набережной',
    en: 'A stone arch bridge over the Seine, with trees and pale buildings along the embankment',
  },
  'paris-54.jpeg': {
    ru: 'Подсвеченная Эйфелева башня над Сеной в сумерках, огни отражаются в воде',
    en: 'The illuminated Eiffel Tower above the Seine at dusk, with lights reflected in the water',
  },
  'swiss-85.jpeg': {
    ru: 'Извилистая дорожка через зелёный луг к домикам у подножия скалистых гор',
    en: 'A winding path across a green meadow towards houses beneath rocky mountain peaks',
  },
};

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.jpeg', { eager: true });

export const photos = Object.entries(images).map(([path, image]) => {
  const id = path.split('/').pop()!;
  const description = descriptions[id];
  if (!description) {
    throw new Error(`Missing RU/EN photo descriptions for ${id}`);
  }
  return { src: image.default, ...description, id };
});
