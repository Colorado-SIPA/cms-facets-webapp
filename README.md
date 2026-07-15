# Google Sheets Facets

This custom HTML element uses a Google Sheet as a database to create a faceted search interface capable of filtering the displayed results.

Built with TypeScript and Vite, the contents of this custom element are completely encapsulated using the [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM), meaning its styles will never conflict with the parent website. It is configured entirely through declarative HTML elements, with no JavaScript required by the end user.

See the [live demo](https://components.sf-prod-uat.colorado.gov/google-sheets-faceted-search) in action.

## 🚀 Features

- **Google Sheets as a CMS:** Uses a publicly viewable Google Sheet as a data source for the UI cards.
- **Declarative HTML Configuration:** Define your filter taxonomies and card layouts directly in your HTML markup.
- **Shadow DOM Encapsulation:** 100% protected CSS. The parent website's styles cannot break the app.
- **Optimized & Minified:** The entire app is 26kB (7.5 kB gzipped) of highly optimized JavaScript in one production ready bundle.

## ⚡ Quick Start

The app can be run in any environment that supports HTML/CSS/JS. 

Follow the steps below to configure the app:

### 1. 📊 Google Sheets Configuration

This app requires a Google Sheet as a backend data source.

- Ensure that the sheet is shared as public (i.e. *File > Share > Share with Others > Anyone with the Link*)
- Gather the following information, which will be needed when we create the custom HTML element:
    - The ID of your Google Sheet from the URL:
        - e.g. `https://docs.google.com/spreadsheets/d/[YOUR-ID-HERE]/edit?gid=0#gid=0`
    - Name of the sheet tab within the spreadsheet where your content will come from (e.g. "Sheet 1")
    - Column numbers (zero-indexed) for each data cell that you want to display in the cards

### 2. 💻 Script Installation

Simply add the script to any webpage:

```html
<script type="module" src="[https://cdn.jsdelivr.net/gh/Colorado-SIPA/cms-facets-webapp@v1.0.2/dist/js/sheets-facets.js](https://cdn.jsdelivr.net/gh/Colorado-SIPA/cms-facets-webapp@v1.0.2/dist/js/sheets-facets.js)" integrity="sha384-12csvaTP8LxEuEwa1BlfkEc/uVdo07HTOCivetSR6f1lDFZ8+/Me4SlDXTk1yOWP" crossorigin="anonymous"></script>
```

The script can appear before or after the HTML element (`<sheets-facets>`), but the best practice is to put it in the `<head>` or as close as possible.

### 3. 🏗️ The HTML Structure

After installing the script, you will need to create the custom HTML element with the correct child elements. This tells the app exactly how to map the Google Sheet columns to the UI.

```html
<sheets-facets sheet-id="YOUR_GOOGLE_SHEET_ID" sheet-name="Resources" items-per-page="20" hidden>
    <search-filters>
        <filter-group>
            <filter-title>Area of Work</filter-title>
            <filter-item>Adaptation</filter-item>
            <filter-item>Equitable Transition</filter-item>
            <filter-item>Mitigation</filter-item>
        </filter-group>
        <filter-group>
            <filter-title>Service Options</filter-title>
            <filter-item value="Yes">Service In Spanish</filter-item>
            <filter-item value="Yes">Serves Region 2</filter-item>
        </filter-group>
    </search-filters>

    <search-results>
        <!-- Card Layout Configuration -->
        <card-layout>
            <card-link column="1">
                <card-title column="0"></card-title>
            </card-link>
            <card-body>
                <card-content column="3" label="Area of Work" format="pills"></card-content>
                <card-content column="4" label="Website" link-type="web"></card-content>
            </card-body>
            <!-- Optional: Triggers a modal window -->
            <card-action trigger="modal">View Full Details</card-action>
        </card-layout>

        <!-- Optional: Modal Layout Configuration -->
        <modal-layout>
            <modal-header>
                <modal-title column="0"></modal-title>
            </modal-header>
            <modal-body>
                <modal-content column="3" label="Area of Work" format="pills"></modal-content>
                <modal-content column="4" label="Website" link-type="web"></modal-content>
                <modal-content column="5" label="Email" link-type="mailto"></modal-content>
                <modal-content column="6" label="Phone" link-type="tel"></modal-content>
            </modal-body>
        </modal-layout>
    </search-results>
</sheets-facets>
```

---

### Element API Reference

#### Main Structure:

##### `<sheets-facets>`
- **Description:** The wrapper for the entire app.
- **Attributes:**
    - `sheet-id`: (Required) The unique ID found in your Google Sheet's URL.
    - `sheet-name`: (Required) The exact name of the tab in the spreadsheet containing your data (e.g., `Resources`).
    - `items-per-page`: (Optional) The number of results to display before paginating. Defaults to `20`.
    - `hidden`: (Optional) Prevents the flash of unstyled content, which is common with custom elements.

---
#### Search Filters Section:

##### `<search-filters>`
- **Description:** The wrapper for the accordions that contain checkbox filters.
- **Attributes:** None

##### `<filter-group>`
- **Description:** Establishes an accordion with grouped checkbox inputs that function as filters on the content.
- **Attributes:**
    - `cols`: (Optional) Specifies the column numbers from the Google spreadsheet to search. Multiple comma separated values are allowed. Note that columns are zero indexed.

##### `<filter-title>`
- **Description:** Creates the title for the accordion group.
- **Attributes:** None

##### `<filter-item>`
- **Description:** A keyword or keyphrase that will be searched for. It will also be used to create the checkbox label on the filter.
- **Attributes:** 
    - `value`: (Optional) Defines the underlying value the search engine looks for in the spreadsheet (e.g., "Yes" or "True"). If omitted, the engine searches for the exact text inside the element.

---
#### Search Results Section and UI Cards:

##### `<search-results>` (required)
- **Description:** The wrapper for the card and modal layouts.
- **Attributes:** None

##### `<card-layout>` (required)
- **Description:** Defines the layout of each `div.card-body` element and the mappings to the Google Sheet columns where the data will come from.
- **Attributes:** None

##### `<card-link>` (optional)
- **Description:** Defines a column in the Google Sheet that contains a fully formed URL to be used for the linked title.
- **Attributes:**
    - `column`: (Required) The column number (zero-indexed) from the Google spreadsheet where the data will be pulled from.

##### `<card-title>` (required)
- **Description:** Defines a column in the Google Sheet that contains the text to use for the linked title.
- **Attributes:**
    - `column`: (Required) The column number (zero-indexed) from the Google spreadsheet where the data will be pulled from.

##### `<card-body>` (required)
- **Description:** The wrapper for the content section on the search results UI cards.
- **Attributes:** None

##### `<card-content>` (required)
- **Description:** Defines a content section to be fetched from a specific column in the Google Sheet. Multiple instances may be used to display values from different columns.
- **Attributes:**
    - `column`: (Required) The zero-indexed column number from the spreadsheet.
    - `label`: (Optional) If provided, this text will be displayed as bold text with a colon prior to the displaying of the content.
    - `link-type`: (Optional) Transforms the content into an actionable HTML link. Accepts `web`, `mailto`, or `tel`.
    - `format`: (Optional) Controls the visual formatting of the data. Accepts `pills` to parse comma-separated data into individual UI chips.

##### `<card-action>` (optional)
- **Description:** Creates a button at the bottom of the card used to interact with the entry.
- **Attributes:**
    - `trigger`: (Required) Determines the action of the button. Set to `modal` to open a dialog containing the full entry details.

---
#### Modal Window Configuration:

NOTE: The modal window is only available if the `<card-action>` element is placed within `<card-layout>`.

The use of a modal is completely optional but highly encouraged when the number of data fields exceeds what can reasonably be displayed on the cards.

##### `<modal-layout>` (optional)
- **Description:** The wrapper for defining the structure and content of the pop-up details dialog.
- **Attributes:** None

##### `<modal-header>` (optional)
- **Description:** Structural wrapper for the modal title, which will be announced to screen readers upon opening.
- **Attributes:** None

##### `<modal-title>` (optional)
- **Description:** Defines the column in the Google Sheet that contains the text to use for the primary modal heading (`<h2>`). If omitted, it will fall back to the `<card-title>` mapping.
- **Attributes:**
    - `column`: (Required) The zero-indexed column number from the spreadsheet.
- **Default Value:** If the `<modal-title>` is omitted, then the `<card-title>` element will be used to provide a title on the modal window.

##### `<modal-body>` (required)
- **Description:** Structural wrappers for the body content of the modal.
- **Attributes:** None

##### `<modal-content>` (required)
- **Description:** Defines a content section to be fetched from a specific column in the Google Sheet. Multiple instances may be used to display values from different columns.
- **Attributes:**
    - `column`: (Required) The zero-indexed column number from the spreadsheet.
    - `label`: (Optional) If provided, this text will be displayed as bold text with a colon prior to the displaying of the content.
    - `link-type`: (Optional) Transforms the content into an actionable HTML link. Accepts `web`, `mailto`, or `tel`.
    - `format`: (Optional) Controls the visual formatting of the data. Accepts `pills` to parse comma-separated data into individual UI chips.


---

### Project Architecture

#### Fetching Google Sheets Data

This app does not use the official Google Sheets API, allowing us to bypass using the heavy REST API, which would require an API key to be either served over a secure backend server or transmitted via JavaScript for all to see (and steal or abuse).

Instead, we are using the Google Visualization API. (e.g. `https://docs.google.com/spreadsheets/d/[SHEET-ID-HERE]/gviz/tq?tqx=out:csv`). The visualization API is an older, undocumented endpoint that Google uses internally to draw charts and graphs. By adding `tqx=out:csv` to the end of the URL, we are telling Google to format the output as a CSV.

The benefits of this approach include:

- Instant real time updates
- Targeting by sheet name
- A SQL like [query language](https://developers.google.com/chart/interactive/docs/querylanguage)
- High threshold for Google rate limiters

The tradeoff is that this endpoint is intended to specifically to power Google Charts. It is not an officially documented public REST API. While millions of web apps rely on it and Google is highly unlikely to turn it off without warning, **_there is no official SLA for enterprise apps_**.

#### Module Organization

- **`src/index.ts`:** The main Web Component class definition and Shadow DOM initialization.
- **`src/config.ts`:** Parses the declarative HTML tags into the internal state configuration.
- **`src/api/`:** Handles the zero-dependency fetching and CSV parsing from the Google `gviz/tq` endpoint.
- **`src/ui/`:** Contains the HTML template literals that render the UI (cards, filters, pagination).
- **`src/styles/`:** The modular CSS files. These are imported inline and injected directly into the Shadow DOM.

## 🛠️ Local Development

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