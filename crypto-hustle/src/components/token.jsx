import React from 'react';



async function getAccessToken() {
  const url = 'https://api.petfinder.com/v2/oauth2/token';
  const clientId = 'OYEA1ikcMfuHggnmyow0Z2o8vEbNT9PTI046dGcUfe90bSbxJp';
  const clientSecret = 'LRCtT6NzAvlitJofjVGG2HFFOjTpDQVYOab53hQG';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });

    const data = await response.json();
    const accessToken = data.access_token;

    console.log(accessToken); // Logs the access token to the console
    return accessToken; // Returns the access token
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export default getAccessToken;