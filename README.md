# Google Sheets Facets

This custom HTML element uses a Google Sheet as a database to create a faceted search interface capable of filtering the displayed results.

Built with TypeScript and Vite, the contents of this custom element are completely encapsulated using the Shadow DOM, meaning its styles will never conflict with the parent website. It is configured entirely through declarative HTML elements, with no JavaScript required by the end user.


## ✨ Features

* **Google Sheets as a CMS:** Uses a public Google Sheet as a headless database. Editors can update content in real-time without touching code.
* **Declarative HTML Configuration:** Define your filter taxonomies and card layouts directly in your HTML markup.
* **Shadow DOM Encapsulation:** 100% protected CSS. The parent website's styles cannot break the widget, and the widget's styles cannot leak out.
* **Optimized & Minified:** The entire app is 18KB of highly optimized JavaScript in one file.


## 🚀 Quick Start

To use the widget on any website, import the bundled JavaScript file and drop the custom `<sheets-facets>` element into your HTML. 

### 1. 📊 Google Sheets Configuration
This app requires a Google Sheet as a backend data source. 

+ Ensure that the sheet is shared as public (i.e. File > Share > Share with Others > Anyone with the Link)
+ Get the ID of your Google Sheet from the URL: 
    + e.g. `https://docs.google.com/spreadsheets/d/[YOUR-ID-HERE]/edit?gid=0#gid=0`
+ Get the name of the sheet tab within the spreadsheet where your content will come from (e.g. "Sheet 1")
+ Get the column numbers (zero-indexed) for each data cell that you want to display in the cards

### 2. 💥 Script Installation
The app can be run in any environment that supports HTML/CSS/JS.

Simply add the script tag to the page, as shown in the example below:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/Colorado-SIPA/cms-facets-webapp@v1.0.0/dist/js/sheets-facets.js" integrity="sha512-jEaqcOdIu3bw/Gxgi3sAYxyTS0kmWSblPltippBa7jDCMgIFRezr/a8/guGDBhQIjGvf4dHJdPXxEt5rKSK1XQ==" crossorigin="anonymous"></script>
```

The script can appear before or after the HTML element (`<sheets-facets>`), but the best practice is to put it in the `<head>` or as close as possible.


### 3. 🚧 The HTML Structure
The widget is configured using semantic child tags. This tells the widget exactly how to map the Google Sheet columns to the UI.

```html
<sheets-facets sheet-id="YOUR_GOOGLE_SHEET_ID" sheet-name="Resources" items-per-page="20">
    
    <search-filters>
        <filter-group>
            <filter-title>Area of Work</filter-title>
            <filter-item>Adaptation</filter-item>
            <filter-item>Equitable Transition</filter-item>
            <filter-item>Mitigation</filter-item>
        </filter-group>
        <filter-group>
            <filter-title>Resource Type</filter-title>
            <filter-item>Case Studies and Frameworks</filter-item>
            <filter-item>Data and Maps</filter-item>
            <filter-item>Legislation</filter-item>
        </filter-group>
    </search-filters>

    <search-results>
        <card-layout>
            <card-link column="1">
                <card-title column="0"></card-title>
            </card-link>
            <card-body>
                <card-content column="3" label="Area of Work"></card-content>
                <card-content column="4" label="Resource Type"></card-content>
                <card-content column="5" label="Topic Area"></card-content>
                <card-content column="6" label="Who"></card-content>
            </card-body>
        </card-layout>
    </search-results>

</sheets-facets>
```

#### Required Attributes
The top-level `<sheets-facets>` tag requires the following attributes to function:
* `sheet-id`: The unique ID found in your Google Sheet's URL.
* `sheet-name`: The exact name of the tab in the spreadsheet containing your data (e.g., `Resources`).
* `items-per-page`: (Optional) The number of results to display before paginating. Defaults to `20`.


## 💻 Local Development

If you want to develop the project, you will need Node.js installed.

### Installation
Clone the repository and install the Vite dependencies:
```bash
npm install
```

### Running the Dev Server
Start the local Vite development server with hot-module replacement (HMR):
```bash
npm run dev
```

### Building for Production
Compile the TypeScript and minify the CSS/HTML into the `dist/` folder for deployment:
```bash
npm run build
```

### Project Architecture
* **`src/index.ts`:** The main Web Component class definition and Shadow DOM initialization.
* **`src/config.ts`:** Parses the declarative HTML tags into the internal state configuration.
* **`src/api/`:** Handles the zero-dependency fetching and CSV parsing from the Google `gviz/tq` endpoint.
* **`src/ui/`:** Contains the HTML template literals that render the UI (cards, filters, pagination).
* **`src/styles/`:** The modular CSS files. These are imported inline and injected directly into the Shadow DOM.