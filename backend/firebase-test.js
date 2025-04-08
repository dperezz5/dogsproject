require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "dogswipe-8994c",
  private_key_id: "d9f87ef3d961dfd2b78681d02c66af5ffe888f96",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD0/xkqTuDM4ODP\nDF/2VxGeg0j4eo7PuMKJV58cTJEgkssD2YwJtmfcAWn2BEatJN+sbM7jJSMlkYRk\nMHN8yr67kmvR6pY1fgPOMwJitxmCwooqG7QcSVRadg+xjd4WBXWdS8dwPMeFzgn+\nqkwUN1TmciGKJAQyDNK7nK2fSfHtWTyiOjGTSPQyhn/j8YH44/gLUGUua+MdodZB\nGTdbMbmchD8ebkh1Nes4DCg02cCM0pGyvzJrpB+6H/lp+DOpzcTxDFyGMgAi1zaY\nx5YMqmhzuova/Y72c4YloP/UE3NeS4z9/30BJaUcDsqGOnhyPHc04PZ+6TKjT2Ow\nNqGBFA5HAgMBAAECggEACaU6GZMlwOXWQ/XcmKdgj16OKBDfKtNp0/FqAg8LpFN9\n1abMyhxvJgISPg14tjFeSFIM/8lYWGQhvmC1SJj3fbgBMbBW0z/6U2BpEXeG9Bcc\n9xUZzVv1C7ixMSWA3wS+VtUtwr/0f6fsdyUU6LOC+VhN9LvVRHPXyhYcNHS7UcOe\nvpVgoCyAjcPZlKgoKQJRfX9JXydXyIeEMIa7w8JXpc/on4oS7UYBhujnnTfZP14Z\nfwqAso8cMvAqISDUK6I83epsNDEqHfXjip682YEK0BWbsiBadjdbPaEsm98E2hQy\nzS9LC6dh2p7yKoJsWrYNQ6uwZDQDOgjUvf07wCr8oQKBgQD/HMPuu3a42lN6Y29D\nZrUQj5/FCuldbfLzBZ4qnGbHmsPtlnPNsKyMPRvCbDQUbB7BMd+6fy5C03hJnYJR\n1L2n34xJSiPw40jb6CfSm8kh512uOoj2fXcrvxorbEO/+tS8HN3BaOBJu8oLnWpA\nmg4kdN/q9nl8ZVCH0eaYrd1s5wKBgQD12VKOB2q1OW9DKmFScqaDF6q38MV7/fhF\nXyQKGaZPVuh5q4/OfXhGkHfLlhDl1bmZY+J8y7iLjbxd9sw9GbK3RYc0/ZOxTyH9\ntHMJFbWBX0rYqLw9M4jNELYRLBos0nfNrtXO0Lu9gLMhfMFyt50R577kruBhnuje\n/r4xVR3HoQKBgQC/VNOeOPrRqOzy3aCU7HLf+Nfa8FQVvmB34768NpDfIzPO/Qfd\nPKQsiahIKN7mcjCetMkXFkub0v5kN72Fogib3w1X6kMKZ2w9geBcFHrE8sFP6pbO\nR0sZhDocVxZ45aanbv7iD8YnhrACBg2qZeA1d3J4xmJW6aV8N/C6kauAAQKBgEOJ\n1FgYSYRHpv04o0vXG09gLRIjHt2VQ6MrI+dybHHXWj4yl2sOpQAdqAtRyoqZUEeH\nXS0Tejs8UMcviaQvbx1SCHbSQsSvDJN6AzA3uokz+IfUswHNKoPLV3kYOIifuTHU\nGgCa7zh8JrnIYAx3zLqig5qnQBURZr/8E5vR2kCBAoGAVBt6Y5m9qaXqoNYobBAw\nIgMNeZQX+KQJxAzPL1Np5l+lLAf9gg/l7SJuPbyiBJUHtim/jLuS3YX4Jdb49KU+\nycBPORQx/3XQbx17oECTdg7puhiUPFMIWgI1cWW+OAsGtQfBvKLnn0O8/nqsG9VF\nkh3VsOBCIWSaK0rWTuu5MuA=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@dogswipe-8994c.iam.gserviceaccount.com",
  client_id: "101531064732528568748",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40dogswipe-8994c.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Test Firebase Admin SDK
const db = admin.firestore();

// Test connection
db.collection('test').doc('test').set({
  test: 'success'
})
.then(() => {
  console.log('Firebase connection successful!');
  process.exit(0);
})
.catch((error) => {
  console.error('Firebase connection failed:', error);
  process.exit(1);
}); 