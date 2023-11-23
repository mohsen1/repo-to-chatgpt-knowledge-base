# Repo to Knowledge Base

> Upload a Git repository to a OpenAI's ChatGPT knowledge base.

This Node.js script recursively walks through all files in a specified directory, respecting `.gitignore` files in each directory. It reads each file's content and compiles this information into a JSON file, excluding binary files.

## Features

- Recursively walks through a directory and its subdirectories.
- Respects `.gitignore` files in each directory.
- Ignores binary files.
- Outputs a JSON file with the path and content of each file.

## Prerequisites

Before running the script, ensure you have Node.js installed on your system. You will also need to install the following npm packages:

- `ignore`: For reading `.gitignore` files.
- `isbinaryfile`: For checking if a file is binary.

You can install these dependencies by running:

```bash
npm install
```