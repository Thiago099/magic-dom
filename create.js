#!/usr/bin/env node

const gitClone = require('git-clone');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const repositoryUrl = 'https://github.com/example/repository.git'; // Replace with the URL of the repository you want to clone

const customName = process.argv[2];
if (!customName) {
  console.error('Please provide a custom name for the cloned repository.');
  process.exit(1);
}

const cloneDirectory = path.join(process.cwd(), customName);

gitClone(repositoryUrl, cloneDirectory, null, (err) => {
  if (err) {
    console.error('Error cloning repository:', err);
    process.exit(1);
  }

  fs.rmdirSync(path.join(cloneDirectory, '.git'), { recursive: true });

  console.log('Repository cloned successfully with custom name:', customName);
});