# [NewsWave (RSS News Feed Application)](https://paulalexserban.github.io/prj--news-wave/)

> The application is designed to fetch, parse, and display news feeds from various RSS sources in an HTML format. The entire process is automated via GitHub Actions, enabling seamless updates and deployments.

![GitHub Actions Build Status](https://github.com/paulAlexSerban/prj--news-wave/actions/workflows/main.yml/badge.svg) ![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.17.1-brightgreen)

NewsWave is an automated RSS news feed aggregator that fetches, parses, and displays articles from various RSS feed sources. The application is built using Node.js, Axios, and RSS-Parser. It's designed to be completely automated via GitHub Actions, which fetch the latest articles and deploy them to GitHub Pages.

## Features

-   **Automated Fetching**: Fetches the latest articles from your specified RSS feed sources.
-   **GitHub Actions**: Automates the fetching, parsing, and HTML generation process.
-   **HTML Rendering**: Outputs the news feed in an HTML format, ready for viewing.
-   **Deployment**: Automatically deploys the generated HTML to GitHub Pages.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/paulAlexSerban/prj--news-wave.git
    ```

2. Install dependencies
    ```bash
    cd prj--news-wave
    npm install
    ```

## Usage

Run the locally (optional)

    ```bash
    npm run fetch
    npm run build
    ```
Push your changes to GitHub to trigger the GitHub Actions workflow.

## Acknowledgements

-   [RSS-Parser](https://github.com/rbren/rss-parser) for parsing RSS feeds.
-   [GitHub Actions](https://github.com/features/actions) for automating the entire process.
-   [GitHub Pages](https://pages.github.com/) for hosting the generated HTML.

---

For any questions or suggestions, feel free to open an issue or submit a pull request. Happy Coding!
