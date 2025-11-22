const { useState, useEffect } = React;
const MotionLib = window.Motion || window.framerMotion || window.motion;

const fallbackMotion = new Proxy(
    {},
    {
        get: (_target, tag) => {
            const Comp = React.forwardRef((props, ref) => React.createElement(tag, { ...props, ref }));
            Comp.displayName = `motion.fallback(${String(tag)})`;
            return Comp;
        }
    }
);

const motion = MotionLib?.motion || fallbackMotion;
const html = window.htm.bind(React.createElement);

const CMS_DEFAULTS = {
    provider: 'contentful',
    spaceId: '',
    environment: 'master',
    token: '',
    blogContentType: 'blogPost',
    portfolioContentType: 'project'
};

const cmsConfig = { ...CMS_DEFAULTS, ...(window.CMS_CONFIG || {}) };
const hasContentfulCreds = cmsConfig.spaceId && cmsConfig.token;

const slugFromLink = (link) => {
    if (!link) return '';
    try {
        const url = new URL(link, window.location.origin);
        const parts = url.pathname.split('/').filter(Boolean);
        const idx = parts.indexOf('projects');
        if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
        return parts[parts.length - 1] || '';
    } catch (e) {
        const parts = link.split('/').filter(Boolean);
        return parts[parts.length - 1] || '';
    }
};

const getBasePathFromPath = (path) => {
    const segments = path.split('/').filter(Boolean);
    return segments[0] === 'personal' ? '/personal' : '';
};

const initialStoredPath = () => {
    const stored = sessionStorage.getItem('spaRedirectPath');
    if (stored) {
        sessionStorage.removeItem('spaRedirectPath');
        return stored;
    }
    return window.location.pathname + window.location.search + window.location.hash;
};

const fallbackProjects = [
    {
        title: 'Transport Demand Forecasting',
        description: 'An end-to-end ML pipeline to forecast global transport demand, deployed on Microsoft Fabric.',
        tags: ['PySpark', 'MS Fabric', 'Machine Learning'],
        link: '#',
        imageUrl: 'https://picsum.photos/seed/project1/400/300',
        slug: 'transport-demand-forecasting'
    },
    {
        title: 'AI-Powered Anomaly Detection',
        description: 'Real-time anomaly detection system for logistics data using Azure OpenAI and SynapseML.',
        tags: ['Azure OpenAI', 'SynapseML', 'Real-time'],
        link: '#',
        imageUrl: 'https://picsum.photos/seed/project2/400/300',
        slug: 'ai-powered-anomaly-detection'
    },
    {
        title: 'Logistics Control Tower Dashboard',
        description: 'A unified Power BI dashboard providing real-time visibility into global supply chain performance.',
        tags: ['Power BI', 'Data Visualization', 'SQL'],
        link: '#',
        imageUrl: 'https://picsum.photos/seed/project3/400/300',
        slug: 'logistics-control-tower-dashboard'
    }
];

const fallbackPosts = [
    {
        title: 'Leveraging Microsoft Fabric for Enterprise Data Solutions',
        date: 'October 25, 2025',
        excerpt: 'Exploration of how Microsoft Fabric unifies data engineering, data science, and real-time analytics into a single, cohesive platform.',
        link: '#'
    },
    {
        title: 'Implementing GenAI Agents in Transport Operations',
        date: 'September 12, 2025',
        excerpt: 'A case study on using Azure OpenAI to build autonomous agents for root cause analysis in logistics.',
        link: '#'
    },
    {
        title: 'Best Practices for PySpark on Large-Scale Datasets',
        date: 'August 5, 2025',
        excerpt: 'Tips and tricks for optimizing PySpark jobs for performance and cost-efficiency in a cloud environment.',
        link: '#'
    }
];

const ArrowRight = ({ className }) => html`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=${className}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
`;

const ChevronDown = ({ className }) => html`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=${className}>
        <path d="m6 9 6 6 6-6" />
    </svg>
`;

const SectionHeader = ({ title, number }) => html`
    <div className="flex items-baseline gap-4 mb-12 border-b border-gray-200 pb-4">
        <span className="font-grotesk text-sm md:text-lg font-bold text-blue-600">(0${number})</span>
        <h2 className="font-syne text-4xl md:text-6xl font-bold uppercase tracking-tighter text-black">${title}</h2>
    </div>
`;

const ExperienceItem = ({ role, company, period, location, bullets, isOpen, onClick }) => {
    const cardClasses = `mb-4 glass-panel p-6 rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden ${
        isOpen ? 'bg-white border-blue-500 shadow-md' : 'hover:bg-white/80 hover:shadow-sm'
    }`;

    return html`
        <${motion.div} layout onClick=${onClick} className=${cardClasses}>
            <${motion.div} layout className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                <div>
                    <h3 className="font-syne text-2xl font-bold text-black">${role}</h3>
                    <p className="font-grotesk text-lg text-gray-700 font-semibold">${company}</p>
                </div>
                <div className="text-right md:text-left mt-2 md:mt-0">
                    <p className="font-grotesk text-sm font-mono text-gray-600">${period}</p>
                    <p className="font-grotesk text-sm text-gray-500">${location}</p>
                </div>
            <//>

            ${isOpen
                ? html`
                      <${motion.div} initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} className="mt-6 font-grotesk text-gray-800 leading-relaxed">
                          <ul className="list-disc pl-5 space-y-2">
                              ${bullets.map(
                                  (bullet, idx) => html`<li key=${idx} className="pl-2">${bullet}</li>`
                              )}
                          </ul>
                      <//>
                  `
                : html`
                      <div className="flex justify-center mt-2">
                          <span className="text-xs font-mono uppercase tracking-widest opacity-50 text-gray-500">Click to expand</span>
                      </div>
                  `}
        <//>
    `;
};

const Marquee = ({ items }) => html`
    <div className="relative w-full overflow-hidden bg-black py-4 md:py-6 transform -rotate-1 border-y-4 border-blue-500 shadow-xl my-16">
        <div className="flex animate-marquee whitespace-nowrap">
            ${[...items, ...items, ...items].map(
                (item, idx) => html`
                    <span key=${idx} className="mx-8 text-2xl md:text-4xl font-syne font-bold text-white uppercase tracking-widest flex items-center">
                        ${item} <span className="text-blue-500 ml-8 text-sm">✦</span>
                    </span>
                `
            )}
        </div>
    </div>
`;

const PortfolioItem = ({ title, description, tags, imageUrl, link, slug, onNavigate, basePath }) => {
    const internalPath = slug ? `${basePath}/projects/${slug}` : null;
    const href = internalPath || link || '#';
    const handleClick = (e) => {
        if (internalPath && onNavigate) {
            e.preventDefault();
            onNavigate(internalPath);
        }
    };
    return html`
    <a href=${href} target=${internalPath ? '_self' : '_blank'} rel="noopener noreferrer" className="block group" onClick=${handleClick}>
        <${motion.div} whileHover=${{ y: -5 }} className="glass-panel p-4 rounded-2xl h-full flex flex-col transition-all duration-300 hover:border-blue-500 hover:shadow-md">
            <div className="h-48 mb-4 overflow-hidden rounded-xl bg-gray-100 relative">
                ${imageUrl
                    ? html`<img src=${imageUrl} alt=${title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />`
                    : html`
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-syne text-xl font-bold uppercase bg-gray-50">
                              Project Image
                          </div>
                      `}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5"></div>
            </div>
            <h3 className="font-syne text-2xl font-bold mb-2 text-black group-hover:text-blue-600 transition-colors">${title}</h3>
            <p className="font-grotesk text-gray-700 mb-4 flex-grow">${description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
                ${tags.map(
                    (tag, idx) => html`<span key=${idx} className="font-mono text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">${tag}</span>`
                )}
            </div>
        <//>
    </a>
`;
};

const PortfolioSection = ({ projects, onNavigate, basePath }) => html`
    <section id="portfolio" className="relative z-10 px-4 py-20 max-w-6xl mx-auto">
        <${SectionHeader} title="Portfolio" number="3" />
        <div className="grid md:grid-cols-3 gap-8">
            ${projects.map(
                (project, index) =>
                    html`<${PortfolioItem} key=${index} ...${project} onNavigate=${onNavigate} basePath=${basePath} />`
            )}
        </div>
    </section>
`;

const BlogItem = ({ title, date, excerpt, link }) => html`
    <a href=${link} className="block group mb-8">
        <${motion.div} whileHover=${{ x: 10 }} className="glass-panel p-6 rounded-2xl transition-all duration-300 hover:border-blue-500 hover:shadow-md">
            <p className="font-mono text-sm text-gray-500 mb-2">${date}</p>
            <h3 className="font-syne text-2xl font-bold mb-3 text-black group-hover:text-blue-600 transition-colors">${title}</h3>
            <p className="font-grotesk text-gray-700 leading-relaxed">${excerpt}</p>
            <div className="mt-4 font-mono text-sm text-blue-600 font-bold group-hover:underline flex items-center">
                Read more <${ArrowRight} className="ml-2 w-4 h-4" />
            </div>
        <//>
    </a>
`;

const BlogSection = ({ posts }) => html`
    <section id="blog" className="relative z-10 px-4 py-20 max-w-4xl mx-auto">
        <${SectionHeader} title="Latest Writing" number="4" />
        <div className="space-y-6">
            ${posts.map((post, index) => html`<${BlogItem} key=${index} ...${post} />`)}
        </div>
    </section>
`;

const ProjectDetail = ({ project }) => {
    if (!project) {
        return html`
            <section className="relative z-10 px-4 py-24 max-w-4xl mx-auto text-center">
                <p className="font-syne text-3xl font-bold mb-4 text-black">Project not found</p>
                <p className="font-grotesk text-gray-700">This project may have been moved or unpublished.</p>
            </section>
        `;
    }

    return html`
        <section className="relative z-10 px-4 py-16 max-w-5xl mx-auto">
            <p className="font-mono text-xs text-gray-500 mb-4 uppercase tracking-wide">Project</p>
            <h1 className="font-syne text-4xl md:text-6xl font-bold text-black mb-6">${project.title}</h1>
            <p className="font-grotesk text-lg md:text-xl text-gray-700 leading-relaxed mb-8">${project.description || ''}</p>
            ${project.imageUrl
                ? html`<img src=${project.imageUrl} alt=${project.title} className="w-full rounded-2xl mb-8 shadow-lg" />`
                : null}
            <div className="flex flex-wrap gap-2 mb-6">
                ${(project.tags || []).map((tag, idx) =>
                    html`<span key=${idx} className="font-mono text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">${tag}</span>`
                )}
            </div>
            ${project.link
                ? html`<a href=${project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-grotesk font-semibold text-blue-600 hover:underline">
                    Visit project <${ArrowRight} className="w-4 h-4" />
                </a>`
                : null}
        </section>
    `;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element with id "root" not found.');
}

const RootApp = () => {
    const [routePath, setRoutePath] = useState(initialStoredPath());
    const [projects, setProjects] = useState(fallbackProjects);
    const [posts, setPosts] = useState(fallbackPosts);
    const [activeExp, setActiveExp] = useState(0);
    const navOffset = 90;
    const basePath = getBasePathFromPath(window.location.pathname);

    const parseRoute = (path) => {
        let localPath = path;
        const base = getBasePathFromPath(path);
        if (base && localPath.startsWith(base)) {
            localPath = localPath.slice(base.length);
        }
        const segments = localPath.split('/').filter(Boolean);
        if (segments[0] === 'projects' && segments[1]) {
            return { type: 'project', slug: decodeURIComponent(segments[1]) };
        }
        return { type: 'home' };
    };

    const navigate = (to) => {
        window.history.pushState({}, '', to);
        setRoutePath(to);
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    useEffect(() => {
        const smoothLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter(
            (link) => link.getAttribute('href') !== '#'
        );

        const handleClick = (event) => {
            const href = event.currentTarget.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        };

        smoothLinks.forEach((link) => link.addEventListener('click', handleClick));
        return () => smoothLinks.forEach((link) => link.removeEventListener('click', handleClick));
    }, []);

    useEffect(() => {
        const onPopState = () =>
            setRoutePath(window.location.pathname + window.location.search + window.location.hash);
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        if (!hasContentfulCreds) {
            return;
        }

        const fetchContentful = async (contentType) => {
            const url = `https://cdn.contentful.com/spaces/${cmsConfig.spaceId}/environments/${cmsConfig.environment}/entries?content_type=${contentType}&include=1`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${cmsConfig.token}` }
            });
            if (!res.ok) throw new Error(`Contentful fetch failed (${res.status})`);
            return res.json();
        };

        const normalizeAssets = (includes) => {
            const assets = {};
            (includes?.Asset || []).forEach((asset) => {
                const id = asset?.sys?.id;
                const url = asset?.fields?.file?.url;
                if (id && url) assets[id] = url.startsWith('//') ? `https:${url}` : url;
            });
            return assets;
        };

        const load = async () => {
            try {
                const [portfolioJson, blogJson] = await Promise.all([
                    fetchContentful(cmsConfig.portfolioContentType),
                    fetchContentful(cmsConfig.blogContentType)
                ]);

                const assets = normalizeAssets(portfolioJson.includes || {});
                const portfolioItems = (portfolioJson.items || []).map((item) => {
                    const fields = item.fields || {};
                    const imageRef = fields.image?.sys?.id;
                    return {
                        title: fields.title || 'Untitled Project',
                        description: fields.description || '',
                        tags: fields.tags || [],
                        link: fields.link || '#',
                        imageUrl: (imageRef && assets[imageRef]) || '',
                        slug: fields.slug || slugFromLink(fields.link)
                    };
                });

                const blogAssets = normalizeAssets(blogJson.includes || {});
                const blogItems = (blogJson.items || []).map((item) => {
                    const fields = item.fields || {};
                    const imageRef = fields.image?.sys?.id;
                    return {
                        title: fields.title || 'Untitled Post',
                        date: fields.date || fields.publishedAt || '',
                        excerpt: fields.excerpt || '',
                        link: fields.link || '#',
                        imageUrl: (imageRef && blogAssets[imageRef]) || ''
                    };
                });

                if (portfolioItems.length) setProjects(portfolioItems);
                if (blogItems.length) setPosts(blogItems);
            } catch (err) {
                console.error('CMS fetch error:', err);
            }
        };

        load();
    }, []);

    const route = parseRoute(routePath);
    const projectForDetail =
        route.type === 'project' ? projects.find((p) => (p.slug || '') === route.slug) : null;

    const experiences = [
        {
            role: 'Worldwide Transportation Performance & Data Scientist',
            company: 'Kering',
            period: '05/2025 – Current',
            location: 'Italy',
            bullets: [
                'Designed and deployed end-to-end machine learning pipelines in Microsoft Fabric (Data Factory, Lakehouse, Synapse, Notebooks) using PySpark, scikit-learn, and SynapseML.',
                'Integrated GPT-based AI agents within Fabric notebooks for automated root cause deviation analyses via Azure OpenAI.',
                'Developed predictive Power BI dashboards connected to OneLake for real-time global performance monitoring.',
                'Implemented data quality monitoring and anomaly detection using Delta tables and Fabric Pipelines.'
            ]
        },
        {
            role: 'Worldwide Transportation Performance Analyst',
            company: 'Kering',
            period: '10/2023 – 05/2025',
            location: 'Italy',
            bullets: [
                'Built centralized Fabric Lakehouse architecture integrating Dataflows Gen2, Notebooks, and SQL Endpoints.',
                'Automated ETL processes in Python/PySpark ingesting 5M+ shipment rows/day.',
                'Implemented Python-based alerting scripts integrated with Azure Functions/Logic Apps, reducing manual monitoring by 70%.',
                'Partnered with Data Architecture teams to establish data governance.'
            ]
        },
        {
            role: 'Digital Business Analyst',
            company: 'ExxonMobil',
            period: '01/2023 – 07/2023',
            location: 'Global',
            bullets: [
                'Improved data quality through SAP-integrated Alteryx and Tableau solutions.',
                'Created Alteryx workflows cutting data prep time from days to hours.',
                'Delivered customized training to 100+ employees to support tool adoption.'
            ]
        },
        {
            role: 'Winshuttle Citizen Developer',
            company: 'ExxonMobil',
            period: '04/2021 – 01/2023',
            location: 'Brazil',
            bullets: [
                'Built automated workflows and SAP data transformations eliminating manual Excel operations.',
                'Created validation scripts increasing input accuracy and reducing rework by 40%.',
                'Provided global user support and governance.'
            ]
        },
        {
            role: 'Digital & Innovation Trainee',
            company: 'ExxonMobil',
            period: '01/2020 – 04/2021',
            location: 'Brazil',
            bullets: [
                'Executed process-improvement projects using VBA, Python, Tableau, and Power BI.',
                'Developed business cases for emerging technologies.'
            ]
        }
    ];

    const HomeView = html`
        <div className="relative min-h-screen bg-white">
            <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <a href="#" className="font-syne font-bold text-xl tracking-tighter text-black">Luca Deluca</a>
                <div className="hidden md:flex gap-8 font-grotesk text-sm font-semibold text-gray-700">
                    <a href="#profile" className="hover:text-blue-600 transition-colors">PROFILE</a>
                    <a href="#experience" className="hover:text-blue-600 transition-colors">EXPERIENCE</a>
                    <a href="#portfolio" className="hover:text-blue-600 transition-colors">PORTFOLIO</a>
                    <a href="#blog" className="hover:text-blue-600 transition-colors">BLOG</a>
                </div>
                <a href="mailto:lucagdeluca@gmail.com" className="font-grotesk text-sm border-2 border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors font-bold">
                    CONTACT
                </a>
            </nav>

            <section className="relative min-h-screen flex flex-col justify-center items-center p-4 pt-20 z-10">
                <div className="w-full max-w-[90vw]">
                    <${motion.h1}
                        initial=${{ y: 50, opacity: 0 }}
                        animate=${{ y: 0, opacity: 1 }}
                        transition=${{ duration: 0.8, ease: 'easeOut' }}
                        className="font-syne font-extrabold leading-[0.85] tracking-tighter text-center text-black"
                        style=${{ fontSize: 'clamp(3rem, 13vw, 14rem)' }}
                    >
                        LUCA
                    <//>
                    <${motion.h1}
                        initial=${{ y: 50, opacity: 0 }}
                        animate=${{ y: 0, opacity: 1 }}
                        transition=${{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className="font-syne font-extrabold leading-[0.85] tracking-tighter text-center text-transparent bg-clip-text bg-gradient-to-b from-black to-blue-800 pb-4"
                        style=${{ fontSize: 'clamp(3rem, 13vw, 14rem)' }}
                    >
                        DELUCA
                    <//>
                </div>

                <${motion.div}
                    initial=${{ opacity: 0 }}
                    animate=${{ opacity: 1 }}
                    transition=${{ delay: 0.6 }}
                    className="mt-8 md:mt-12 max-w-2xl text-center"
                >
                    <p className="font-grotesk text-xl md:text-2xl font-light tracking-wide bg-gray-100 inline-block px-6 py-3 rounded-full text-black">
                        Data Scientist <span className="mx-2 text-blue-500">•</span> AI Engineering <span className="mx-2 text-blue-500">•</span> Transport Ops
                    </p>
                <//>

                <${motion.div} animate=${{ y: [0, 10, 0] }} transition=${{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    <${ChevronDown} className="w-8 h-8 text-black opacity-50" />
                <//>
            </section>

            <section id="profile" className="relative z-10 px-4 py-20 max-w-6xl mx-auto">
                <${SectionHeader} title="Profile" number="1" />
                <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-4">
                        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between bg-white border-gray-200 shadow-sm">
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-2">LOCATION</p>
                                <p className="font-syne text-xl font-bold mb-6 text-black">Novara, Italy</p>

                                <p className="font-mono text-xs text-gray-500 mb-2">LANGUAGES</p>
                                <ul className="font-grotesk font-semibold space-y-1 text-gray-800">
                                    <li>Portuguese (Native)</li>
                                    <li>English (Fluent)</li>
                                    <li>Italian (Professional)</li>
                                </ul>
                            </div>
                            <div className="mt-8">
                                <p className="font-mono text-xs text-gray-500 mb-2">CONNECT</p>
                                <a href="mailto:lucagdeluca@gmail.com" className="font-grotesk truncate text-blue-600 hover:underline">lucagdeluca@gmail.com</a>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-8">
                        <p className="font-grotesk text-2xl md:text-4xl leading-tight font-light text-black">
                            Specialized in <span className="font-bold bg-yellow-200 px-1">AI-driven analytics</span> and large-scale data engineering. With over five years of experience transforming global transport operations through automation and <span className="font-bold text-blue-700">predictive insights</span>.
                        </p>
                        <p className="mt-8 font-grotesk text-lg text-gray-700 leading-relaxed">
                            Expert in Microsoft Fabric (Data Factory, Synapse, Lakehouse, Power BI), PySpark, SQL, and Azure OpenAI, I design end-to-end pipelines combining machine learning, GPT automation, and real-time dashboards.
                        </p>
                    </div>
                </div>
            </section>

            <${Marquee} items=${['PySpark', 'Microsoft Fabric', 'Azure OpenAI', 'Python', 'SQL', 'Power BI', 'Machine Learning', 'Data Factory', 'Synapse', 'React', 'Tableau']} />

            <section id="experience" className="relative z-10 px-4 py-20 max-w-5xl mx-auto">
                <${SectionHeader} title="Experience" number="2" />
                <div className="space-y-4">
                    ${experiences.map(
                        (exp, index) => html`
                            <${ExperienceItem}
                                key=${index}
                                ...${exp}
                                isOpen=${activeExp === index}
                                onClick=${() => setActiveExp(index === activeExp ? -1 : index)}
                            />
                        `
                    )}
                </div>
            </section>

            <${PortfolioSection} projects=${projects} onNavigate=${navigate} basePath=${basePath} />

            <${BlogSection} posts=${posts} />

            <section id="certifications" className="relative z-10 px-4 py-20 max-w-6xl mx-auto mb-20">
                <${SectionHeader} title="Certifications" number="5" />
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-panel p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-300 border-l-8 border-green-400 bg-white shadow-sm">
                        <h3 className="font-syne text-2xl font-bold mb-2 text-black">Google Data Analytics</h3>
                        <p className="font-mono text-sm mb-4 text-gray-600">Coursera • 06/2023</p>
                        <p className="font-grotesk text-gray-700">
                            Extensive six month job-ready training. Hands-on experience with data cleaning, visualization, and project management.
                        </p>
                    </div>
                    <div className="glass-panel p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-300 border-l-8 border-orange-400 bg-white shadow-sm">
                        <h3 className="font-syne text-2xl font-bold mb-2 text-black">AWS Certified Cloud Practitioner</h3>
                        <p className="font-mono text-sm mb-4 text-gray-600">Amazon Web Services • 09/2023</p>
                        <p className="font-grotesk text-gray-700">
                            Foundational understanding of AWS Cloud architectural principles, cost optimization, and security concepts.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 py-32 bg-black text-white overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-syne text-6xl md:text-9xl font-bold mb-8 tracking-tighter hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                        <a href="mailto:lucagdeluca@gmail.com">SAY HELLO</a>
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center gap-8 font-grotesk text-lg">
                        <a href="#" className="hover:underline hover:text-blue-400 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:underline hover:text-blue-400 transition-colors">GitHub</a>
                        <span>+39 333 418 5950</span>
                    </div>
                    <p className="mt-20 font-mono text-xs text-gray-500">
                        © 2025 Luca G Deluca. Built with React & Tailwind CSS.
                    </p>
                </div>

                <div
                    className="absolute inset-0 opacity-20"
                    style=${{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                ></div>
            </footer>
        </div>
    `;

    if (route.type === 'project') {
        return html`
            <div className="relative min-h-screen bg-white">
                <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <a href=${basePath || '/'} className="font-syne font-bold text-xl tracking-tighter text-black">Luca Deluca</a>
                    <a
                        href="#"
                        onClick=${(e) => {
                            e.preventDefault();
                            navigate(basePath || '/');
                        }}
                        className="font-grotesk text-sm border-2 border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors font-bold"
                    >
                        Back to Home
                    </a>
                </nav>
                <div className="pt-24">
                    <${ProjectDetail} project=${projectForDetail} />
                </div>
            </div>
        `;
    }

    return HomeView;
};

if (ReactDOM.createRoot) {
    ReactDOM.createRoot(rootElement).render(html`<${RootApp} />`);
} else {
    ReactDOM.render(html`<${RootApp} />`, rootElement);
}
