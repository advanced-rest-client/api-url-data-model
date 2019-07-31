export const AmfLoader = {};
AmfLoader.load = async function(compact, fileName) {
  if (!fileName) {
    fileName = 'demo-api';
  }
  if (compact) {
    fileName += '-compact';
  }
  const file = `/${fileName}.json`;
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(data);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
