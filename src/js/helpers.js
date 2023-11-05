//  TITLE: This file will contain functions that we reuse throughout our project.

import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}; //this returns a promise which will reject after a certain number of seconds.

// Function below is a refactored version of the 2 functions below it.
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', //format has to be exactly like this. Tells api our data will be in the json format.
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //awaits the promise (function stops here until promise is handled)

    const data = await res.json(); //converts response to json() which then returns another promise which we then await again which we will eventually store in a variable

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this data will become the resolved value of the promise from this async function.
  } catch (err) {
    throw err; //this sends the error to the model file where it is actually occurring. Now, the promise from getJSON will reject.
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', //format has to be exactly like this. Tells api our data will be in the json format.
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
