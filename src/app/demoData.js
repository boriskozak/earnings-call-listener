// Demo data for the earnings call listener app
// This simulates what would come from Benzinga / FMP APIs

export const COMPANIES = [
    { ticker: 'IBM', name: 'International Business Machines', sector: 'Technology', exchange: 'NYSE', logo: 'IBM' },
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ', logo: 'AAPL' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', exchange: 'NASDAQ', logo: 'MSFT' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', exchange: 'NASDAQ', logo: 'GOOG' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', exchange: 'NASDAQ', logo: 'AMZN' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', exchange: 'NASDAQ', logo: 'NVDA' },
    { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', exchange: 'NASDAQ', logo: 'META' },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', exchange: 'NASDAQ', logo: 'TSLA' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', exchange: 'NYSE', logo: 'JPM' },
    { ticker: 'V', name: 'Visa Inc.', sector: 'Financials', exchange: 'NYSE', logo: 'V' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', exchange: 'NYSE', logo: 'JNJ' },
    { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples', exchange: 'NYSE', logo: 'WMT' },
];

export const EARNINGS_CALENDAR = [
    { ticker: 'IBM', date: '2026-03-18', time: '17:00', quarter: 'Q1 2026', status: 'upcoming', estimate_eps: 2.45, estimate_revenue: '14.8B' },
    { ticker: 'NVDA', date: '2026-03-19', time: '16:30', quarter: 'Q1 2026', status: 'upcoming', estimate_eps: 5.82, estimate_revenue: '38.2B' },
    { ticker: 'AAPL', date: '2026-03-20', time: '17:00', quarter: 'Q2 2026', status: 'upcoming', estimate_eps: 1.62, estimate_revenue: '94.5B' },
    { ticker: 'MSFT', date: '2026-03-20', time: '16:00', quarter: 'Q3 2026', status: 'upcoming', estimate_eps: 3.15, estimate_revenue: '68.7B' },
    { ticker: 'META', date: '2026-03-24', time: '16:30', quarter: 'Q1 2026', status: 'upcoming', estimate_eps: 6.42, estimate_revenue: '45.1B' },
    { ticker: 'JPM', date: '2026-03-25', time: '08:30', quarter: 'Q1 2026', status: 'upcoming', estimate_eps: 4.88, estimate_revenue: '43.2B' },
    { ticker: 'GOOGL', date: '2026-03-26', time: '16:00', quarter: 'Q1 2026', status: 'upcoming', estimate_eps: 2.09, estimate_revenue: '92.4B' },
    { ticker: 'AMZN', date: '2026-03-27', time: '16:00', quarter: 'Q1 2026', status: 'upcoming', estimate_eps: 1.28, estimate_revenue: '175.3B' },
    { ticker: 'TSLA', date: '2026-04-02', time: '16:30', quarter: 'Q1 2026', status: 'upcoming', estimate_eps: 0.58, estimate_revenue: '25.6B' },
];

// Simulated live transcript for IBM earnings call
export const IBM_TRANSCRIPT = [
    { speaker: 'Operator', text: 'Good afternoon, ladies and gentlemen. Welcome to IBM\'s First Quarter 2026 Earnings Conference Call. At this time, all participants are in a listen-only mode.', time: '17:00:15' },
    { speaker: 'Operator', text: 'After the speakers\' presentation, there will be a question-and-answer session. I would now like to hand the conference over to your host today, the VP of Investor Relations.', time: '17:00:32' },
    { speaker: 'Patricia Murphy', role: 'VP Investor Relations', text: 'Thank you. Good afternoon and welcome to IBM\'s first quarter earnings presentation. I\'m joined today by Arvind Krishna, IBM\'s Chairman and CEO, and James Kavanaugh, our Senior Vice President and Chief Financial Officer.', time: '17:00:55' },
    { speaker: 'Patricia Murphy', role: 'VP Investor Relations', text: 'We\'ll post today\'s prepared remarks on the IBM investor website within a couple of hours, and a replay of the webcast will also be available. Some commentsmade during this call may be forward-looking.', time: '17:01:18' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Thank you Patricia. I\'m pleased with our first quarter results. Revenue of fifteen point two billion dollars was up seven percent year over year, reflecting strong demand across our software and infrastructure segments.', time: '17:02:00' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Our AI business continues to accelerate. We saw tremendous momentum in enterprise AI adoption, with our watsonx platform now serving over twelve thousand enterprise clients globally.', time: '17:02:28' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Let me highlight a few strategic priorities. First, our datacenter build and cloud infrastructure investments are paying significant dividends. We\'ve completed three new hyperscale datacenter facilities this quarter.', time: '17:03:05' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'The capital expenditure for our datacenter build program reached two point one billion dollars this quarter, and we expect to increase that to three billion in the second half of the year.', time: '17:03:35' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Second, our consulting business is seeing a significant shift toward AI-driven engagements. Approximately forty percent of new consulting signings this quarter involved some form of generative AI implementation.', time: '17:04:08' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Third, our supply chain optimization efforts have resulted in improved margins. We\'ve reduced component costs by eight percent through strategic supplier diversification.', time: '17:04:42' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'I\'m also excited to share that our quantum computing division has reached a major milestone. We now have commercial quantum systems deployed across fourteen client sites.', time: '17:05:15' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Looking ahead, we\'re increasing our guidance for the full year. We now expect revenue growth of eight to ten percent, driven by continued momentum in software and AI-related services.', time: '17:05:48' },
    { speaker: 'James Kavanaugh', role: 'CFO', text: 'Thank you Arvind. Let me walk you through the financial details. First quarter revenue of fifteen point two billion, up seven percent, was ahead of our expectations across all segments.', time: '17:06:25' },
    { speaker: 'James Kavanaugh', role: 'CFO', text: 'Software revenue was seven point four billion, up twelve percent. Infrastructure revenue was three point eight billion, up five percent. And consulting revenue was four billion, up two percent.', time: '17:06:58' },
    { speaker: 'James Kavanaugh', role: 'CFO', text: 'Gross profit margin expanded one hundred and fifty basis points to fifty-seven point three percent, driven by a favorable mix shift toward higher-margin software and improved supply chain efficiency.', time: '17:07:30' },
    { speaker: 'James Kavanaugh', role: 'CFO', text: 'Free cash flow for the quarter was two point six billion dollars, up twenty percent year over year. We returned one point five billion to shareholders through dividends and share repurchases.', time: '17:08:02' },
    { speaker: 'James Kavanaugh', role: 'CFO', text: 'Our capital allocation strategy remains consistent. We\'re investing aggressively in datacenter build and AI infrastructure while maintaining a strong balance sheet and returning capital to shareholders.', time: '17:08:35' },
    { speaker: 'James Kavanaugh', role: 'CFO', text: 'On the topic of tariffs and trade policy, we have taken proactive steps to mitigate potential impacts. Our diversified supply chain across twelve countries provides significant resilience.', time: '17:09:08' },
    { speaker: 'Analyst - Amit Daryanani', role: 'Evercore ISI', text: 'Thanks for taking the question. Arvind, can you provide more color on the datacenter build pipeline? How much of the CapEx increase in the second half is committed versus discretionary?', time: '17:12:00' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Great question Amit. The majority of our datacenter build commitments are already contracted. We have long-term agreements with three major cloud providers for co-location and hybrid cloud deployments.', time: '17:12:28' },
    { speaker: 'Analyst - Wamsi Mohan', role: 'Bank of America', text: 'Thank you. Jim, on the margin expansion, how sustainable is this level? And can you quantify the AI revenue contribution this quarter?', time: '17:13:15' },
    { speaker: 'James Kavanaugh', role: 'CFO', text: 'Wamsi, AI-related revenue reached approximately one point eight billion this quarter, growing over thirty percent year over year. As for margins, we see continued expansion opportunity as software mix increases.', time: '17:13:48' },
    { speaker: 'Analyst - Brian Essex', role: 'JP Morgan', text: 'Quick question on the competitive landscape. Are you seeing any pricing pressure from competitors in the enterprise AI space?', time: '17:15:00' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'Brian, actually the opposite. Our enterprise positioning and deep integration capabilities are allowing us to command premium pricing. Clients value our hybrid cloud approach and data security posture.', time: '17:15:30' },
    { speaker: 'Arvind Krishna', role: 'CEO', text: 'One more point on that — our customer retention rate hit ninety-eight percent this quarter. That speaks volumes about our product differentiation and the value we deliver.', time: '17:16:05' },
];

export const DEFAULT_KEYWORDS = [
    'datacenter build',
    'AI spending',
    'supply chain',
    'tariff',
    'capital expenditure',
    'guidance',
    'margin expansion',
    'quantum computing',
    'customer retention',
    'free cash flow',
];

export const DEFAULT_WATCHLIST = [
    { ticker: 'IBM', name: 'International Business Machines', keywords: ['datacenter build', 'AI spending', 'quantum computing', 'guidance'] },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', keywords: ['datacenter build', 'AI spending', 'supply chain', 'capital expenditure'] },
    { ticker: 'AAPL', name: 'Apple Inc.', keywords: ['supply chain', 'tariff', 'guidance', 'margin expansion'] },
    { ticker: 'MSFT', name: 'Microsoft Corporation', keywords: ['AI spending', 'datacenter build', 'capital expenditure', 'free cash flow'] },
];
