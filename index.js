const {JWT} = require('google-auth-library');
const keys = require('./credentials.json');
const {google} = require('googleapis');

async function authorize() {
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return client;
}

async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});

  let res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  let files = res.data.files;
  // console.log("Res : " + JSON.stringify(res));
  console.log("File Length: " + files.length);
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }
  console.log("NextPageToken: " + res.data.nextPageToken);
  console.log('Files:');
  await Promise.all(files.map(async (file) => { // Use Promise.all to await all promises
    if (!file.name.includes(".csv")) {
      console.log("skipping: " + file.name);
      return;
    }
    else {
      console.log("Not skipping: " + file.name);
    }
    console.log(`${file.name} (${file.id})`);
    var fileTest = await drive.files.get({fileId: file.id, alt: 'media'});

    // var fileTest = await drive.files.export({fileId: file.id, mimeType: 'text/plain'});
    console.log("Contents: " + JSON.stringify(fileTest));
    
    console.log("test");
  }));
  console.log("LOOPING");

  let nextPageToken = res.data.nextPageToken;
  while (nextPageToken) {
    res = await drive.files.list({
      pageSize: 10,
      pageToken: nextPageToken,
    fields: 'nextPageToken, files(id, name)',
    })
    nextPageToken = res.data.nextPageToken;
    
    let files = res.data.files;
    if (files.length === 0) {
      console.log('No files found.');
      return;
    }
    console.log("NextPageToken: " + res.data.nextPageToken);
    console.log('Files:');
    files.map((file) => {
      console.log(`${file.name} (${file.id})`);
      console.log("test");
      console.log("Props: " + JSON.stringify(file));
    });
  
  }
}

// main().catch(console.error);
authorize().then(listFiles).catch(console.error);