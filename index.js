#!/usr/bin/env node

const readline = require('readline');
const axios = require('axios');
const { URL } = require('url');

// List of allowed domains (replace this with your whitelist)
const allowedDomains = ['example.com', 'api.example.com'];

// Create a readline interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// SSRFy banner
function showBanner() {
  console.log(`
  
  ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄   ▄▄▄▄▄▄▄ ▄▄   ▄▄ 
  █       █       █   ▄  █ █       █  █ █  █
  █  ▄▄▄▄▄█  ▄▄▄▄▄█  █ █ █ █    ▄▄▄█  █▄█  █
  █ █▄▄▄▄▄█ █▄▄▄▄▄█   █▄▄█▄█   █▄▄▄█       █
  █▄▄▄▄▄  █▄▄▄▄▄  █    ▄▄  █    ▄▄▄█▄     ▄█
   ▄▄▄▄▄█ █▄▄▄▄▄█ █   █  █ █   █     █   █  
  █▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄█  █▄█▄▄▄█     █▄▄▄█  
  
  
  Created by Sasikaran
  SSRF vulnerability scanner for allowed domains.
  Type 'exit' to quit.
  `);
}

async function checkForSSRF(url) {
  try {
    const parsedURL = new URL(url);

    // Check if the requested hostname is in the allowed domains list
    const isAllowedDomain = allowedDomains.some(domain => parsedURL.hostname.endsWith(domain));
    
    if (isAllowedDomain) {
      // URL is safe, send a request to check if it's reachable
      const response = await axios.get(url);
      console.log('URL is reachable:', url);
      console.log('Response Status Code:', response.status);
      console.log('Response Data:', response.data);
    } else {
      console.log(`
       ________________________________________________ 
      |  ____________________________________________  |
      | | Potential SSRF found - URL is not allowed: | |
      | |____________________________________________| |
      |________________________________________________|`, url);
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
}

function getUserInput() {
  rl.question('Enter the URL to check for SSRF vulnerability: ', (url) => {
    if (url.trim().toLowerCase() === 'exit') {
      rl.close();
    } else {
      checkForSSRF(url);
      rl.close();
    }
  });
}

function runSSRFy() {
  showBanner();
  getUserInput();
}

runSSRFy();

