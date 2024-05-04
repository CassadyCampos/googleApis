const {JWT} = require('google-auth-library');
const keys = require('./credentials.json');
const {google} = require('googleapis');

async function authorize() {
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
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
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }
  console.log("NextPageToken: " + res.data.nextPageToken);
  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });

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
    });
  
  }
}

// main().catch(console.error);
authorize().then(listFiles).catch(console.error);