#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const ignore = require('ignore');
const { isBinaryFileSync } = require('isbinaryfile');

/**
 * Recursively walks through a directory and its subdirectories to find all files.
 * It respects .gitignore files in each directory and skips binary files.
 * @param {string} directoryPath - The starting directory path.
 * @param {string[]} ignorePatterns - Array of ignore patterns.
 * @returns {Promise<{filePath: string, fileContent: string}[]>} - Array of file objects.
 */
async function walkDirectory(directoryPath, ignorePatterns) {
    const directoryContents = fs.readdirSync(directoryPath, { withFileTypes: true });
    const gitignorePath = path.join(directoryPath, '.gitignore');
    let localIgnorePatterns = [...ignorePatterns];

    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        localIgnorePatterns = ignorePatterns.concat(gitignoreContent.split('\n'));
    }

    const ignoreFilter = ignore().add(localIgnorePatterns).add('.git');

    const files = await Promise.all(directoryContents.map(async (dirent) => {
        const fullPath = path.join(directoryPath, dirent.name);
        if (ignoreFilter.ignores(fullPath)) {
            return null;
        }

        if (dirent.isDirectory()) {
            return walkDirectory(fullPath, localIgnorePatterns);
        } else {
            if (!isBinaryFileSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                return { filePath: fullPath, fileContent: content };
            }
        }
    }));

    return files.flat().filter(Boolean);
}

/**
 * Main function to execute the script.
 * @param {string} startDirectory - The starting directory for the file walk.
 */
async function main(startDirectory) {
    try {
        const files = await walkDirectory(startDirectory, []);
        fs.writeFileSync('repo-knowledge.json', JSON.stringify(files, null, 2));
        console.log('Repository knowledge saved to repo-knowledge.json');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Getting the starting directory from the command line argument
const startDirectory = process.argv[2];
if (!startDirectory) {
    console.error('Please provide a starting directory.');
    process.exit(1);
}

main(startDirectory);
