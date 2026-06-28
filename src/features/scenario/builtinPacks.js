export const FRACTURED_ORDER_PACK = {
    identity: {
        title: 'Fractured Order',
        domain: 'An Economic Statecraft Seminar Game',
        sessionCodePattern: 'Operator-issued session code',
        poster: {
            fileName: './src/img/fractured_order_poster.png',
            altText: 'Fractured Order - A Seminar Simulation',
            hasAsset: true
        },
        sponsor: {
            name: 'AidData / William & Mary',
            logo: { fileName: '', altText: 'Sponsoring institution logo' }
        },
        deliverer: {
            name: 'SSG',
            logo: { fileName: './src/img/Gold No Background.png', altText: '' }
        },
        dateLabel: '',
        venue: '',
        description: 'Fractured Order, a seminar simulation served on the Plenum platform for SSG.'
    },
    teams: [
        { id: 'blue', label: 'Blue Team', shortLabel: 'Blue', color: '#2f6fd0' },
        { id: 'red', label: 'Red Team', shortLabel: 'Red', color: '#c0392b' },
        { id: 'green', label: 'Green Team', shortLabel: 'Green', color: '#1f8a55' }
    ],
    roles: {
        facilitator: 1,
        scribe: 1,
        notetaker: 2,
        observer: 0,
        whiteCellLead: 1,
        whiteCellSupport: 1,
        gameMaster: 1
    },
    cadence: {
        moves: [
            { n: 1, label: 'Epoch 1 (2027-2030)' },
            { n: 2, label: 'Epoch 2 (2030-2032)' },
            { n: 3, label: 'Epoch 3 (2032-2034)' }
        ],
        phases: [
            { n: 1, label: 'Internal Deliberation' },
            { n: 2, label: 'Alliance Consultation' },
            { n: 3, label: 'Finalization' },
            { n: 4, label: 'Adjudication' },
            { n: 5, label: 'Results Brief' }
        ],
        timerSeconds: 5400
    },
    contracts: {
        blue: { summary: 'Strategic actions plus RFIs', fields: [] },
        green: { summary: 'Proposals plus RFIs', fields: [] },
        red: { summary: 'Move responses plus RFIs', fields: [] }
    },
    vocab: {
        sectors: [
            'biotechnology',
            'agriculture',
            'telecommunications',
            'semiconductors',
            'energy',
            'finance',
            'defense',
            'manufacturing',
            'technology',
            'healthcare'
        ],
        targets: [
            'PRC',
            'RUS',
            'EU-GER',
            'EU-FRA',
            'EU-NLD',
            'JPN',
            'KOR',
            'TWN',
            'AUS',
            'GBR',
            'CAN',
            'IND',
            'BRA',
            'MEX',
            'SGP',
            'ISR'
        ],
        mechanisms: [
            'sanctions',
            'export',
            'investment',
            'trade',
            'financial',
            'economic',
            'industrial',
            'infrastructure'
        ],
        rfiCategories: [
            'Economic Impact',
            'Political Feasibility',
            'Alliance Response',
            'Implementation Timeline',
            'Resource Requirements',
            'Legal Considerations',
            'Historical Precedent',
            'Other'
        ]
    },
    injects: [],
    publish: {
        routes: ['/master.html', '/whitecell.html', '/teams/blue/facilitator.html'],
        outputs: ['report.html', 'Research ZIP'],
        reportTone: 'Operator brief'
    },
    addons: {}
};

export default { FRACTURED_ORDER_PACK };
