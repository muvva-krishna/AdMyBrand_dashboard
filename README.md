# AdmyBrand Insights - AI-Powered Analytics Dashboard

This is a modern analytics dashboard for digital marketing agencies, providing real-time cryptocurrency market data and AI-powered insights.

## Features

* **Real-time Cryptocurrency Data:** Fetches and displays real-time data for various cryptocurrencies.
* **Interactive Charts:** Visualizes market data with interactive line, bar, and donut charts.
* **AI-Powered Insights:** Generates market insights and recommendations using the Groq API.
* **Sortable and Searchable Data Table:** Displays detailed cryptocurrency data in a table that can be sorted and searched.
* **Light/Dark Mode:** Supports both light and dark themes.
* **Responsive Design:** The dashboard is fully responsive and works on all screen sizes.

## Technologies Used

* **Framework:** [Next.js](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Charting:** [Recharts](https://recharts.org/)
* **AI Insights:** [Groq API](https://groq.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

* Node.js (v14 or later)
* npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/muvva-krishna/admybrand_dashboard.git](https://github.com/muvva-krishna/admybrand_dashboard.git)
    ```

2.  Navigate to the project directory:

    ```bash
    cd admybrand_dashboard/AdMyBrand-live-main
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

### Running the Development Server

1.  Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    NEXT_PUBLIC_COINRANKING_API_KEY=your_coinranking_api_key
    ```

2.  Start the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

Markdown

# AdmyBrand Insights - AI-Powered Analytics Dashboard

This is a modern analytics dashboard for digital marketing agencies, providing real-time cryptocurrency market data and AI-powered insights.

## Features

* **Real-time Cryptocurrency Data:** Fetches and displays real-time data for various cryptocurrencies.
* **Interactive Charts:** Visualizes market data with interactive line, bar, and donut charts.
* **AI-Powered Insights:** Generates market insights and recommendations using the Groq API.
* **Sortable and Searchable Data Table:** Displays detailed cryptocurrency data in a table that can be sorted and searched.
* **Light/Dark Mode:** Supports both light and dark themes.
* **Responsive Design:** The dashboard is fully responsive and works on all screen sizes.

## Technologies Used

* **Framework:** [Next.js](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Charting:** [Recharts](https://recharts.org/)
* **AI Insights:** [Groq API](https://groq.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

* Node.js (v14 or later)
* npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/muvva-krishna/admybrand_dashboard.git](https://github.com/muvva-krishna/admybrand_dashboard.git)
    ```

2.  Navigate to the project directory:

    ```bash
    cd admybrand_dashboard/AdMyBrand-live-main
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

### Running the Development Server

1.  Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    NEXT_PUBLIC_COINRANKING_API_KEY=your_coinranking_api_key
    ```

2.  Start the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

.
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── dashboard
│   │   ├── charts
│   │   │   ├── bar-chart.tsx
│   │   │   ├── donut-chart.tsx
│   │   │   └── line-chart.tsx
│   │   ├── data-table.tsx
│   │   ├── header.tsx
│   │   └── metric-card.tsx
│   ├── providers
│   │   └── theme-provider.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── ... (other shadcn/ui components)
├── hooks
│   └── use-toast.ts
├── lib
│   ├── api.ts
│   ├── groq.ts
│   └── utils.ts
├── public
│   └── ... (public assets)
├── README.md
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.ts


## Learn More

* [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
* [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
* [shadcn/ui Documentation](https://ui.shadcn.com/docs) - learn about shadcn/ui.
* [Recharts Documentation](https://recharts.org/en-US/guide) - learn about Recharts.
* [Groq Documentation](https://console.groq.com/docs) - learn about the Groq API.
