# Workbrand Premium

An enhanced version of the Workbrand Comparison Tool that offers advanced analytics and premium features for comparing company Workbrand scores.

## Features

- All features from the standard Workbrand Comparison Tool
- Premium analytics and insights
- Access to all comparison categories
- Enhanced data visualization
- Detailed competitor analysis
- Export capabilities for reports

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form with Zod validation
- Chart.js for data visualization
- OpenAI API for company analysis

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/workbrand-comparison-tool.git
cd workbrand-comparison-tool
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Copy the `.env.local.example` file to `.env.local` and add your OpenAI API key:

```bash
cp .env.local.example .env.local
```

Then edit the `.env.local` file and replace `your_openai_api_key_here` with your actual OpenAI API key.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. Enter your company name and email address
2. Select one of the three competitors (Google, Walmart, or HubSpot)
3. Click "Compare Companies" to see the analysis
4. View the comparison chart and detailed analysis in the tabs
5. Only the first two tabs are accessible, the rest are blurred with a CTA

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: React components
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions and data
- `public`: Static assets (SVG logos)

## Notes

- The application uses the OpenAI GPT-4o model to analyze companies
- Competitor data is hard-coded in the application
- The application is designed to capture leads with a CTA after one comparison

## License

MIT
