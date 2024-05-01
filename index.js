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
  // const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
  // const res = await client.request({url});
  // console.log(res.data);
}

async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}

// main().catch(console.error);
authorize().then(listFiles).catch(console.error);