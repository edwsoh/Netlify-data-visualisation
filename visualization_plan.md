# Medical Charges Visualization Dashboard Plan

## Goal Description
Create a responsive web application to visualize the `medical-charges.csv` dataset. The dashboard will help users understand factors affecting medical charges such as smoking, BMI, and region.

## Technology Stack
- **Framework**: Vite (Vanilla JavaScript)
- **Visualization Library**: D3.js (v7)
- **Animation Library**: Anime.js
- **Styling**: Vanilla CSS (Modern, Responsive, Dark/Light mode capable)

## Proposed Changes

### 1. Project Scaffolding
- Initialize a Vite project in the current directory.
- Install dependencies: `d3`, `animejs`.
- Setup directory structure:
  - `src/assets/` (styles)
  - `src/components/` (chart modules)
  - `src/data/` (data processing)

### 2. Data Processing (`src/data/`)
- **`dataLoader.js`**:
  - Load `medical-charges.csv`.
  - Parse numbers (age, bmi, charges, children).
  - Clean/validate data.

### 3. Visualizations (`src/components/`)
We will implement three main interactive charts:

#### A. Scatter Plot: BMI vs. Charges
- **Purpose**: Analyze the correlation between body mass index and medical costs.
- **Dimensions**: X-axis (BMI), Y-axis (Charges).
- **Encoding**: Color points by `smoker` status (e.g., Red for smoker, Blue for non-smoker).
- **Interactivity**: Tooltip on hover with details (Age, Sex, Region).
- **Animation**: Anime.js points staggering in.

#### B. Grouped Bar Chart: Average Charges by Region & Sex
- **Purpose**: Compare costs across different geographical regions and genders.
- **Dimensions**: X-axis (Region), Y-axis (Average Charges).
- **Encoding**: Grouped bars for Male/Female.
- **Animation**: Bars grow from bottom up using Anime.js.

#### C. Histogram: Distribution of Charges
- **Purpose**: Understand the frequency distribution of medical costs.
- **Dimensions**: X-axis (Charge bins), Y-axis (Count).
- **Interactivity**: Brushing to filter other charts (optional/advanced).

### 4. Dashboard Layout (`index.html` & `style.css`)
- **Header**: specific dashboard title and summary metrics (Total Records, Avg Charge).
- **Grid Layout**: CSS Grid to arrange charts responsively.
  - Top: Key Metrics cards.
  - Middle: Scatter Plot (Main view).
  - Bottom: Bar Chart and Histogram side-by-side.
- **Aesthetics**: Glassmorphism effect, subtle gradients, and rounded corners.

## Verification Plan

1. **Data Loading**: Check browser console to verify 1338 records are loaded.
2. **Visual Checks**:
   - **Scatter Plot**: Verify distinct clusters for smokers vs non-smokers.
   - **Tooltip**: Hover over a point and verify the data matches the CSV line.
   - **Animations**: Refresh page and observe anime.js entrance animations.
   - **Responsiveness**: Resize window to mobile view and ensure charts stack correctly.
