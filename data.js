(function (root) {
  'use strict';

  const VERIFIED_AT = '2026-10-12';
  const youtubeCatalog = typeof module !== 'undefined' && module.exports
    ? require('./youtube-data.js')
    : root.SkillUnboundYouTube;
  const linkedResource = (title, creator, url, kind = 'Documentation') => ({
    title,
    creator,
    url,
    kind,
    duration: kind === 'Course' ? 'Self-paced course' : 'Self-paced reference',
    access: 'Free public access',
    attribution: `Linked to ${creator}; content is not republished by Skill Unbound.`,
    verifiedAt: VERIFIED_AT,
  });

  const r = linkedResource;
  const curatedSeeds = [
    ['ai-agents-engineering', 'AI Agents Engineering', 'AI & ML', 'Intermediate', ['Tool schemas and reliable outputs', 'Stateful agent workflows', 'Retrieval and memory boundaries', 'Evaluation, tracing, and guardrails'], 'Build a research agent that cites sources, exposes traces, and passes a written evaluation set.', [r('Model Context Protocol introduction', 'Model Context Protocol', 'https://modelcontextprotocol.io/docs/getting-started/intro'), r('OpenAI Agents SDK guide', 'OpenAI', 'https://openai.github.io/openai-agents-python/')]],
    ['generative-ai-senior', 'Generative AI Engineer — Senior Prep', 'AI & ML', 'Advanced', ['Transformer internals', 'Tokenization and pretraining', 'Parameter-efficient fine-tuning', 'Serving, evaluation, and system design'], 'Train or fine-tune a small language model and publish an evaluation-backed serving design.', [r('Neural Networks: Zero to Hero', 'Andrej Karpathy', 'https://karpathy.ai/zero-to-hero.html', 'Course'), r('Hugging Face LLM Course', 'Hugging Face', 'https://huggingface.co/learn/llm-course/chapter1/1', 'Course')]],
    ['mlops-llmops', 'MLOps & LLMOps Engineering', 'AI & ML', 'Advanced', ['Reproducible experiments', 'Model and prompt versioning', 'Evaluation pipelines', 'Monitoring and rollback'], 'Ship a versioned model service with an automated evaluation gate and documented rollback.', [r('MLflow documentation', 'MLflow', 'https://mlflow.org/docs/latest/ml/'), r('Kubernetes basics', 'Kubernetes', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', 'Course')]],
    ['agentic-coding', 'AI-Assisted / Agentic Coding', 'AI & ML', 'Intermediate', ['Context and task decomposition', 'Repository-aware prompting', 'Human review and test loops', 'Security and provenance'], 'Complete a repository change with an auditable agent plan, tests, and a human review checklist.', [r('GitHub Copilot documentation', 'GitHub', 'https://docs.github.com/en/copilot'), r('OWASP Top 10 for LLM Applications', 'OWASP', 'https://genai.owasp.org/llm-top-10/')]],
    ['django', 'Django', 'Backend', 'Beginner', ['Models and migrations', 'Views, templates, and forms', 'Authentication and permissions', 'Testing and deployment'], 'Build a tested community directory with accounts, moderation, and production settings.', [r('Django tutorial', 'Django Software Foundation', 'https://docs.djangoproject.com/en/stable/intro/tutorial01/'), r('Django deployment checklist', 'Django Software Foundation', 'https://docs.djangoproject.com/en/stable/howto/deployment/checklist/')]],
    ['express', 'Express', 'Backend', 'Beginner', ['Routing and middleware', 'Validation and error handling', 'Persistence and authentication', 'API tests and operations'], 'Build a documented booking API with validation, authorization, and integration tests.', [r('Express getting started', 'OpenJS Foundation', 'https://expressjs.com/en/starter/installing/'), r('Node.js test runner', 'OpenJS Foundation', 'https://nodejs.org/api/test.html')]],
    ['flask', 'Flask', 'Backend', 'Beginner', ['Application factories', 'Requests and templates', 'Data and authentication', 'Testing and deployment'], 'Build a small issue tracker with accounts, database migrations, and automated tests.', [r('Flask tutorial', 'Pallets', 'https://flask.palletsprojects.com/en/stable/tutorial/'), r('Flask testing guide', 'Pallets', 'https://flask.palletsprojects.com/en/stable/testing/')]],
    ['go', 'Go', 'Backend', 'Beginner', ['Go syntax and modules', 'Interfaces and error handling', 'HTTP services and concurrency', 'Testing and profiling'], 'Build a concurrent status-check API with cancellation, structured logs, and benchmarks.', [r('A Tour of Go', 'The Go Authors', 'https://go.dev/tour/', 'Course'), r('Developing a RESTful API with Go', 'The Go Authors', 'https://go.dev/doc/tutorial/web-service-gin')]],
    ['java', 'Java', 'Backend', 'Beginner', ['Language and collections', 'Object design and exceptions', 'Streams and concurrency', 'Testing and packaging'], 'Build a command-line inventory system with persistence, tests, and a documented domain model.', [r('Learn Java', 'Oracle and OpenJDK contributors', 'https://dev.java/learn/'), r('JUnit user guide', 'JUnit Team', 'https://docs.junit.org/6.1.3/overview.html')]],
    ['mongodb', 'MongoDB', 'Data', 'Beginner', ['Document modeling', 'Queries and aggregation', 'Indexes and transactions', 'Security and operations'], 'Design and test a catalog database with explain-plan evidence and a backup procedure.', [r('MongoDB manual tutorials', 'MongoDB', 'https://www.mongodb.com/docs/manual/tutorial/'), r('MongoDB data modeling', 'MongoDB', 'https://www.mongodb.com/docs/manual/data-modeling/')]],
    ['nodejs', 'Node.js', 'Backend', 'Beginner', ['Runtime and asynchronous I/O', 'Modules and package design', 'HTTP APIs and streams', 'Testing, security, and deployment'], 'Build a resilient file-processing API with streams, validation, tests, and operational notes.', [r('Introduction to Node.js', 'OpenJS Foundation', 'https://nodejs.org/learn/getting-started/introduction-to-nodejs'), r('Node.js streams', 'OpenJS Foundation', 'https://nodejs.org/api/stream.html')]],
    ['spring-boot', 'Spring Boot', 'Backend', 'Intermediate', ['Dependency injection', 'REST and validation', 'Persistence and transactions', 'Security, tests, and observability'], 'Build a production-shaped order service with database constraints, authorization, and health checks.', [r('Building an application with Spring Boot', 'VMware', 'https://spring.io/guides/gs/spring-boot/'), r('Testing the web layer', 'VMware', 'https://spring.io/guides/gs/testing-web/')]],
    ['git-open-source', 'Git & GitHub / Open Source', 'Foundations', 'Beginner', ['Commits and branching', 'Merging and conflict resolution', 'Issues and pull requests', 'Maintainer-ready contribution'], 'Contribute a tested documentation or code improvement through a reviewable pull request.', [r('Hello World with GitHub', 'GitHub', 'https://docs.github.com/en/get-started/using-github/hello-world'), r('Pro Git', 'Scott Chacon and Ben Straub', 'https://git-scm.com/book/en/v2', 'Book')]],
    ['ethereum-solidity', 'Ethereum & Solidity', 'Web3', 'Intermediate', ['Ethereum execution model', 'Solidity contracts', 'Testing and common attacks', 'Deployment and verification'], 'Build and test a minimal escrow contract with explicit threat modeling and deployment evidence.', [r('Introduction to smart contracts', 'Solidity contributors', 'https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html'), r('Ethereum developer tutorials', 'Ethereum Foundation', 'https://ethereum.org/developers/tutorials/')]],
    ['hyperledger-fabric', 'Hyperledger Fabric', 'Web3', 'Advanced', ['Permissioned-ledger concepts', 'Networks and identities', 'Chaincode lifecycle', 'Operations and governance'], 'Run a local network and demonstrate an audited asset-transfer workflow with organization policies.', [r('Fabric tutorials', 'Hyperledger Foundation', 'https://hyperledger-fabric.readthedocs.io/en/latest/tutorials.html'), r('Fabric test network', 'Hyperledger Foundation', 'https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html')]],
    ['llm-apis', 'Building with LLM APIs', 'AI & ML', 'Intermediate', ['Structured prompting', 'Tool calls and validation', 'Retrieval and citations', 'Evaluation, cost, and safety'], 'Ship a cited document assistant with schema-validated output, cost limits, and regression evaluations.', [r('OpenAI API quickstart', 'OpenAI', 'https://developers.openai.com/api/docs/quickstart'), r('OpenAI Cookbook', 'OpenAI', 'https://developers.openai.com/cookbook')]],
    ['aws', 'AWS', 'Cloud', 'Beginner', ['Identity and shared responsibility', 'Compute and storage', 'Networking and managed data', 'Deployment, cost, and monitoring'], 'Deploy a small web service with least-privilege access, monitoring, and a cost estimate.', [r('AWS getting started tutorials', 'Amazon Web Services', 'https://aws.amazon.com/getting-started/hands-on/'), r('AWS Well-Architected Framework', 'Amazon Web Services', 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html')]],
    ['devops-platform', 'DevOps & Platform Engineering', 'Cloud', 'Intermediate', ['Containers and reproducible builds', 'Continuous integration', 'Deployment strategies', 'Observability and incident learning'], 'Create a paved-road template that tests, scans, deploys, monitors, and rolls back a service.', [r('Docker get started', 'Docker', 'https://docs.docker.com/get-started/'), r('GitHub Actions documentation', 'GitHub', 'https://docs.github.com/en/actions')]],
    ['terraform', 'Terraform', 'Cloud', 'Intermediate', ['Providers and state', 'Modules and variables', 'Planning and policy checks', 'Remote state and safe delivery'], 'Provision a reviewable environment with reusable modules, policy checks, and teardown evidence.', [r('Terraform tutorials', 'HashiCorp', 'https://developer.hashicorp.com/terraform/tutorials'), r('Terraform language documentation', 'HashiCorp', 'https://developer.hashicorp.com/terraform/language')]],
    ['data-science', 'Data Science Foundations', 'Data', 'Beginner', ['Questions and data provenance', 'Cleaning and exploration', 'Statistics and visualization', 'Reproducible communication'], 'Publish a reproducible investigation that answers a scoped question and explains limitations.', [r('Pandas getting-started tutorials', 'Pandas contributors', 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html'), r('Seeing Theory', 'Brown University', 'https://seeing-theory.brown.edu/', 'Course')]],
    ['data-engineering', 'Data Engineering', 'Data', 'Intermediate', ['Data modeling', 'Batch and streaming pipelines', 'Orchestration and quality', 'Observability and governance'], 'Build an idempotent pipeline with data-quality gates, lineage notes, and a recovery runbook.', [r('Apache Airflow tutorial', 'Apache Software Foundation', 'https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html'), r('dbt documentation', 'dbt Labs', 'https://docs.getdbt.com/docs/introduction')]],
    ['excel', 'Excel', 'Data', 'Beginner', ['Tables and formulas', 'Lookup and cleaning', 'Pivot analysis', 'Auditable dashboards'], 'Build an accessible operations workbook with validation, pivots, documentation, and error checks.', [r('Excel help and learning', 'Microsoft', 'https://support.microsoft.com/en-us/excel/'), r('Create a PivotTable', 'Microsoft', 'https://support.microsoft.com/en-us/excel/get-started/create-a-pivottable-to-analyze-worksheet-data')]],
    ['power-bi', 'Power BI', 'Data', 'Beginner', ['Power Query', 'Dimensional modeling', 'DAX measures', 'Accessible reports and sharing'], 'Publish an evidence-backed dashboard with a star schema, documented measures, and accessibility checks.', [r('Power BI learning paths', 'Microsoft', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi'), r('Power BI guidance', 'Microsoft', 'https://learn.microsoft.com/en-us/power-bi/guidance/')]],
    ['python', 'Python', 'Foundations', 'Beginner', ['Syntax and data structures', 'Functions and modules', 'Files, APIs, and errors', 'Testing and packaging'], 'Build a tested command-line utility that consumes an API and exports a documented result.', [r('The Python tutorial', 'Python Software Foundation', 'https://docs.python.org/3/tutorial/'), r('Python packaging tutorial', 'Python Packaging Authority', 'https://packaging.python.org/en/latest/tutorials/packaging-projects/')]],
    ['r', 'R', 'Data', 'Beginner', ['Vectors and data frames', 'Transformation and visualization', 'Statistical modeling', 'Reproducible reports'], 'Publish a reproducible report with sourced data, tested transformations, and uncertainty notes.', [r('R manuals', 'R Core Team', 'https://cran.r-project.org/manuals.html'), r('R for Data Science', 'Hadley Wickham, Mine Çetinkaya-Rundel, and Garrett Grolemund', 'https://r4ds.hadley.nz/', 'Book')]],
    ['sql', 'SQL', 'Data', 'Beginner', ['Relational modeling', 'Filtering, joins, and grouping', 'Window functions and transactions', 'Indexes and query plans'], 'Design a small relational system and defend its constraints and indexes with query-plan evidence.', [r('PostgreSQL tutorial', 'PostgreSQL Global Development Group', 'https://www.postgresql.org/docs/current/tutorial.html'), r('Using EXPLAIN', 'PostgreSQL Global Development Group', 'https://www.postgresql.org/docs/current/using-explain.html')]],
    ['digital-marketing', 'Digital Marketing', 'Business', 'Beginner', ['Audience and positioning', 'Content and channel strategy', 'Measurement and experiments', 'Ethics, privacy, and reporting'], 'Run a small consent-aware campaign experiment and publish the hypothesis, assets, and results.', [r('Google Skillshop', 'Google', 'https://skillshop.withgoogle.com/', 'Course'), r('Google Analytics documentation', 'Google', 'https://developers.google.com/analytics')]],
    ['angular', 'Angular', 'Frontend', 'Intermediate', ['Components and templates', 'Signals and state', 'Routing and forms', 'Testing and performance'], 'Build an accessible project dashboard with typed forms, route guards, tests, and performance notes.', [r('Learn Angular', 'Google', 'https://angular.dev/tutorials/learn-angular', 'Course'), r('Angular testing guide', 'Google', 'https://angular.dev/guide/testing')]],
    ['typescript', 'TypeScript', 'Frontend', 'Beginner', ['Type inference and narrowing', 'Objects and generics', 'Modules and configuration', 'Runtime validation and testing'], 'Publish a typed SDK that validates external data and includes type-level and runtime tests.', [r('TypeScript handbook', 'Microsoft', 'https://www.typescriptlang.org/docs/handbook/intro.html'), r('TypeScript playground', 'Microsoft', 'https://www.typescriptlang.org/play')]],
    ['vue', 'Vue.js', 'Frontend', 'Beginner', ['Templates and reactivity', 'Components and composition', 'Routing and state', 'Testing and delivery'], 'Build an accessible habit dashboard with persisted state, tests, and responsive empty states.', [r('Vue tutorial', 'Vue.js contributors', 'https://vuejs.org/tutorial/', 'Course'), r('Vue testing guide', 'Vue.js contributors', 'https://vuejs.org/guide/scaling-up/testing.html')]],
    ['advanced-react', 'Advanced React & Testing', 'Frontend', 'Advanced', ['State architecture', 'Server and client boundaries', 'Integration and accessibility tests', 'Profiling and resilient delivery'], 'Refactor and test a data-heavy interface with performance evidence and failure-state coverage.', [r('React learn', 'Meta Open Source', 'https://react.dev/learn'), r('Testing Library guiding principles', 'Testing Library contributors', 'https://testing-library.com/docs/guiding-principles/')]],
    ['lamp', 'LAMP Stack', 'Full Stack', 'Intermediate', ['Linux and web-server basics', 'PHP application structure', 'MySQL modeling', 'Security and deployment'], 'Deploy a secure CRUD application with backups, server configuration, and integration tests.', [r('PHP language reference', 'PHP Group', 'https://www.php.net/manual/en/langref.php'), r('MySQL tutorial', 'Oracle', 'https://dev.mysql.com/doc/refman/8.4/en/tutorial.html')]],
    ['mean', 'MEAN Stack', 'Full Stack', 'Intermediate', ['MongoDB data design', 'Express APIs', 'Angular application state', 'Integration, auth, and deployment'], 'Ship a tested issue-tracking application with role-based access and operational documentation.', [r('Angular overview', 'Google', 'https://angular.dev/overview'), r('MongoDB Node.js driver quick start', 'MongoDB', 'https://www.mongodb.com/docs/drivers/node/current/get-started/')]],
    ['mern', 'MERN Stack', 'Full Stack', 'Intermediate', ['MongoDB and API contracts', 'Express service design', 'React data flows', 'Authentication, tests, and delivery'], 'Ship a collaborative planning app with clear API contracts, optimistic UI, and end-to-end tests.', [r('React learn', 'Meta Open Source', 'https://react.dev/learn'), r('Express routing', 'OpenJS Foundation', 'https://expressjs.com/en/guide/routing/')]],
    ['nextjs', 'Next.js', 'Frontend', 'Intermediate', ['App Router foundations', 'Server and client components', 'Data, caching, and mutations', 'Testing, metadata, and deployment'], 'Build a content application with resilient data states, metadata, accessibility, and measured performance.', [r('Next.js Learn', 'Vercel', 'https://nextjs.org/learn', 'Course'), r('Next.js App Router documentation', 'Vercel', 'https://nextjs.org/docs/app')]],
    ['coding-for-kids', 'Coding for Kids', 'Foundations', 'Beginner', ['Sequences and events', 'Loops and conditionals', 'Variables and messages', 'Design, testing, and sharing safely'], 'Create an original interactive story or game and explain how its logic works.', [r('Scratch ideas', 'MIT Scratch Team', 'https://scratch.mit.edu/ideas', 'Course'), r('Scratch educator guides', 'Scratch Foundation', 'https://www.scratchfoundation.org/learn/for-educators')]],
    ['flutter', 'Flutter', 'Mobile', 'Beginner', ['Dart and widgets', 'Layout and navigation', 'State and data', 'Testing and release readiness'], 'Build an offline-friendly mobile habit app with accessibility labels and widget tests.', [r('Flutter learning pathway', 'Google', 'https://docs.flutter.dev/learn/pathway', 'Course'), r('Flutter testing overview', 'Google', 'https://docs.flutter.dev/testing/overview')]],
    ['kotlin-android', 'Kotlin / Android', 'Mobile', 'Beginner', ['Kotlin essentials', 'Compose UI and state', 'Data and lifecycle', 'Testing and release readiness'], 'Build an offline-first Android notes app with adaptive UI and automated tests.', [r('Android Basics with Compose', 'Google', 'https://developer.android.com/courses/android-basics-compose/course', 'Course'), r('Kotlin language documentation', 'JetBrains', 'https://kotlinlang.org/docs/home.html')]],
    ['react-native', 'React Native', 'Mobile', 'Intermediate', ['Native components and layout', 'Navigation and state', 'Device APIs and offline data', 'Testing and release'], 'Build a cross-platform field log with offline persistence, accessible controls, and tests.', [r('React Native introduction', 'Meta Open Source', 'https://reactnative.dev/docs/getting-started'), r('React Native testing overview', 'Meta Open Source', 'https://reactnative.dev/docs/testing-overview')]],
    ['cybersecurity', 'Cybersecurity', 'Security', 'Beginner', ['Threat modeling', 'Web and identity risks', 'Secure configuration', 'Testing and incident response'], 'Perform a legal lab security review and publish prioritized findings with reproducible evidence.', [r('OWASP Web Security Testing Guide', 'OWASP', 'https://owasp.org/projects/web-security-testing-guide'), r('PortSwigger Web Security Academy', 'PortSwigger', 'https://portswigger.net/web-security', 'Course')]],
    ['data-science-python', 'Data Science with Python', 'Data', 'Intermediate', ['Numerical and tabular workflows', 'Feature preparation', 'Model evaluation', 'Reproducible delivery'], 'Build a reproducible predictive study with leakage checks, baseline comparison, and a model card.', [r('scikit-learn getting started', 'scikit-learn contributors', 'https://scikit-learn.org/stable/getting_started.html'), r('Pandas user guide', 'Pandas contributors', 'https://pandas.pydata.org/docs/user_guide/index.html')]],
    ['react', 'React', 'Frontend', 'Beginner', ['Components and rendering', 'State and effects', 'Data fetching and forms', 'Testing and accessible delivery'], 'Build a responsive task board with persisted state, keyboard support, and integration tests.', [r('React tutorial', 'Meta Open Source', 'https://react.dev/learn/tutorial-tic-tac-toe', 'Course'), r('React accessibility guidance', 'Meta Open Source', 'https://react.dev/reference/react-dom/components/common#accessibility-attributes')]],
  ];

  const originalSeeds = [
    ['web-accessibility', 'Accessible Web Interfaces', 'Frontend', 'Intermediate', ['Semantic structure', 'Keyboard interaction', 'Forms and announcements', 'Audit and remediation'], 'Audit and repair a small product flow against WCAG 2.2 AA.'],
    ['api-reliability', 'Reliable API Design', 'Backend', 'Intermediate', ['Contracts and validation', 'Idempotency and concurrency', 'Retries and observability', 'Load and failure testing'], 'Build a booking API that stays correct during retries and concurrent requests.'],
    ['applied-robotics', 'Applied Robotics Lab', 'Hardware', 'Beginner', ['Electronics safety', 'Sensors and motor control', 'Feedback loops', 'Field testing'], 'Build and document an obstacle-avoiding two-wheel robot.'],
    ['hardware-prototyping', 'Hardware Prototyping', 'Hardware', 'Beginner', ['Circuits and measurement', 'Microcontroller inputs', 'Outputs and enclosures', 'Testing and documentation'], 'Prototype a sensor-powered desk device with a wiring diagram and test log.'],
    ['data-visualization', 'Evidence-First Data Visualization', 'Data', 'Beginner', ['Question framing', 'Visual encodings', 'Accessible charts', 'Narrative and uncertainty'], 'Publish a concise interactive story that makes one defensible claim.'],
    ['privacy-engineering', 'Privacy Engineering Foundations', 'Security', 'Intermediate', ['Data inventories', 'Minimization and consent', 'Threat and abuse cases', 'Retention and verification'], 'Create and test a privacy design for a small account-based product.'],
    ['technical-writing', 'Technical Writing for Builders', 'Foundations', 'Beginner', ['Audience and structure', 'Procedures and examples', 'API and architecture docs', 'Review and maintenance'], 'Publish a tested quickstart and decision record for an open-source project.'],
    ['product-analytics', 'Responsible Product Analytics', 'Business', 'Intermediate', ['Outcome metrics', 'Event design', 'Experiment quality', 'Consent and decision-making'], 'Design a minimal analytics plan and analyze a synthetic experiment without dark patterns.'],
  ];

  function makeMilestones(seed) {
    return seed.topics.map((topic, index) => ({
      id: `${seed.id}-m${index + 1}`,
      week: index + 1,
      title: topic,
      outcome: `Explain and apply ${topic.toLowerCase()} in a small, reviewable implementation.`,
      deliverable: `Publish a working ${topic.toLowerCase()} exercise with a README, one test or verification step, and a short reflection.`,
      checkpoint: `Show the implementation, the verification result, and one trade-off you considered.`,
      hint: `Start with the smallest observable example of ${topic.toLowerCase()}, then add one failure case before expanding the solution.`,
      rubric: 'Correctness 40% · verification 25% · explanation 20% · accessibility and usability 15%',
      tests: [
        'The artifact runs from the documented setup instructions.',
        'At least one normal case and one failure or edge case are verified.',
        'The evidence explains what changed and what remains limited.',
      ],
      resourceIndexes: [
        index % seed.studyResourceCount,
        ...seed.resources
          .map((resource, resourceIndex) => ({ resource, resourceIndex }))
          .filter(({ resource }, videoIndex) => resource.kind === 'YouTube video'
            && videoIndex % seed.topics.length === index)
          .map(({ resourceIndex }) => resourceIndex),
      ],
    })).concat({
      id: `${seed.id}-capstone`,
      week: seed.topics.length + 1,
      title: 'Capstone: ship and explain',
      outcome: 'Integrate the path skills into a demonstrable project and defend the main decisions.',
      deliverable: seed.capstone,
      checkpoint: 'Submit a repository or public artifact, setup instructions, verification evidence, and a limitations note.',
      hint: 'Integrate the smallest complete workflow first, then use the rubric to prioritize the final iteration.',
      rubric: 'Correctness 35% · evidence 25% · usability 20% · explanation 20%; 70% is the completion threshold',
      tests: [
        'A reviewer can reproduce the primary workflow from the submitted instructions.',
        'Automated checks or a repeatable manual test cover the core behavior and one failure case.',
        'The self-assessment cites evidence for every rubric category and names at least one limitation.',
      ],
      resourceIndexes: Array.from({ length: seed.studyResourceCount }, (_, index) => index),
    });
  }

  const prerequisitePathMap = {
    'ai-agents-engineering': ['python', 'llm-apis'],
    'generative-ai-senior': ['python', 'data-science-python'],
    'mlops-llmops': ['python', 'devops-platform'],
    'agentic-coding': ['git-open-source'],
    'spring-boot': ['java'],
    'ethereum-solidity': ['git-open-source'],
    'hyperledger-fabric': ['go', 'git-open-source'],
    'llm-apis': ['python'],
    'devops-platform': ['git-open-source'],
    terraform: ['devops-platform'],
    'data-engineering': ['python', 'sql'],
    angular: ['typescript'],
    'advanced-react': ['react', 'typescript'],
    lamp: ['sql'],
    mean: ['nodejs', 'angular', 'mongodb'],
    mern: ['nodejs', 'react', 'mongodb'],
    nextjs: ['react', 'typescript'],
    'react-native': ['react'],
    'data-science-python': ['python', 'data-science'],
  };

  const referenceSlugs = {
    'generative-ai-senior': 'generative-ai-engineer-senior-prep',
    'mlops-llmops': 'mlops-and-llmops-engineering',
    'agentic-coding': 'vibe-coding',
    nodejs: 'node',
    'git-open-source': 'github',
    'ethereum-solidity': 'ethereum-eth',
    'hyperledger-fabric': 'hyperledger',
    'llm-apis': 'chatgpt',
    'devops-platform': 'devops-and-platform-engineering',
    'data-science': 'data-science-foundations',
    vue: 'vue-js',
    'advanced-react': 'advanced-react-and-testing',
    lamp: 'lamp-stack',
    mean: 'mean-stack',
    mern: 'mern-stack',
    nextjs: 'next-js-path',
    'kotlin-android': 'kotlin',
    'data-science-python': 'data-science-with-python',
  };

  const curatedPaths = curatedSeeds.map(([id, title, category, difficulty, topics, capstone, resources]) => {
    const referenceSlug = referenceSlugs[id] || id;
    const videoResources = youtubeCatalog.resourcesFor(referenceSlug);
    const seed = {
      id,
      title,
      category,
      difficulty,
      topics,
      capstone,
      resources: resources.concat(videoResources),
      studyResourceCount: resources.length,
    };
    return {
      ...seed,
      contentType: 'Curated path',
      weeks: topics.length + 1,
      hoursPerWeek: difficulty === 'Advanced' ? '8–12' : difficulty === 'Intermediate' ? '6–9' : '4–7',
      summary: `A build-first ${title} path with public source material, explicit evidence, and no completion-by-clicking.`,
      skills: topics,
      tags: [category.toLowerCase(), difficulty.toLowerCase(), 'project-based'],
      prerequisites: difficulty === 'Beginner' ? ['Comfort using a web browser and editing files'] : ['Basic programming and command-line confidence'],
      prerequisitePathIds: prerequisitePathMap[id] || [],
      referenceUrl: `https://learn.dropoutdeveloper.in/paths/${referenceSlug}`,
      referencePurpose: 'Existing public YouTube lessons were audited from this path. Skill Unbound adds original milestones, evidence gates, and interface design.',
      youtubeCount: videoResources.length,
      verifiedAt: VERIFIED_AT,
      milestones: makeMilestones(seed),
      assessment: 'Each milestone publishes its own rubric and verification checklist. Capstones require 70% or better by self-assessment, backed by submitted evidence.',
      completionRule: 'Every milestone needs a resource review and at least 20 characters of portfolio evidence. The capstone also needs a self-assessment.',
    };
  });

  const originalCourseResources = [
    r('MDN Learn Web Development', 'Mozilla', 'https://developer.mozilla.org/en-US/docs/Learn_web_development'),
    r('Web Content Accessibility Guidelines 2.2', 'W3C', 'https://www.w3.org/TR/WCAG22/'),
  ];

  const originalCourses = originalSeeds.map(([id, title, category, difficulty, topics, capstone]) => {
    const seed = { id, title, category, difficulty, topics, capstone, resources: originalCourseResources, studyResourceCount: originalCourseResources.length };
    return {
      ...seed,
      contentType: 'Original course',
      weeks: topics.length + 1,
      hoursPerWeek: difficulty === 'Intermediate' ? '6–9' : '4–7',
      summary: `An original Skill Unbound course for learning ${title.toLowerCase()} through verifiable work.`,
      skills: topics,
      tags: [category.toLowerCase(), difficulty.toLowerCase(), 'original-course'],
      prerequisites: difficulty === 'Beginner' ? ['No specialist experience required'] : ['One completed beginner software project'],
      prerequisitePathIds: [],
      referenceUrl: null,
      referencePurpose: 'Original Skill Unbound curriculum. External sources are linked for study and attribution only.',
      verifiedAt: VERIFIED_AT,
      milestones: makeMilestones(seed),
      assessment: 'Use the published rubric: correctness 35%, evidence 25%, usability 20%, explanation 20%. A score of 70% is required.',
      completionRule: 'Every milestone needs evidence; the capstone requires a rubric self-assessment and working artifact.',
    };
  });

  const tools = [
    { id: 'roadmap-generator', title: 'Developer Roadmap Generator', category: 'Planning', privacy: 'Runs entirely in this browser and stores plans locally.', description: 'Turn a goal, current level, time budget, and target date into a build-first plan.' },
    { id: 'dsa-tracker', title: 'DSA Sheet Tracker', category: 'Practice', privacy: 'Progress stays in local storage; no account or telemetry.', description: 'Track Blind 75 or NeetCode 150 practice with filters, notes, and export.' },
    { id: 'github-scorer', title: 'GitHub Profile Scorer', category: 'Career', privacy: 'Fetches public GitHub data only after you submit a username. Nothing is stored by Skill Unbound.', description: 'Score public profile signals with a transparent rubric and exportable SVG badge.' },
    { id: 'local-tts', title: 'Open-source Neural TTS Playground', category: 'Audio', privacy: 'Browser voices stay on-device when the OS supports them. An optional local Piper endpoint is never contacted unless you configure it.', description: 'Speak text with installed voices or connect a self-hosted Piper-compatible endpoint.' },
    { id: 'voiceover-builder', title: 'YouTube / Tutorial Voiceover Builder', category: 'Audio', privacy: 'Transcript processing and timing run locally. Skill Unbound does not download or upload YouTube media.', description: 'Turn a transcript into timed narration segments and rehearse them with a local voice.' },
  ];

  const blind75 = `Two Sum|Best Time to Buy and Sell Stock|Contains Duplicate|Product of Array Except Self|Maximum Subarray|Maximum Product Subarray|Find Minimum in Rotated Sorted Array|Search in Rotated Sorted Array|3Sum|Container With Most Water|Sum of Two Integers|Number of 1 Bits|Counting Bits|Missing Number|Reverse Bits|Climbing Stairs|Coin Change|Longest Increasing Subsequence|Longest Common Subsequence|Word Break|Combination Sum|House Robber|House Robber II|Decode Ways|Unique Paths|Jump Game|Clone Graph|Course Schedule|Pacific Atlantic Water Flow|Number of Islands|Longest Consecutive Sequence|Alien Dictionary|Graph Valid Tree|Number of Connected Components|Insert Interval|Merge Intervals|Non-overlapping Intervals|Meeting Rooms|Meeting Rooms II|Reverse a Linked List|Detect Cycle in a Linked List|Merge Two Sorted Lists|Merge K Sorted Lists|Remove Nth Node From End|Reorder List|Set Matrix Zeroes|Spiral Matrix|Rotate Image|Word Search|Longest Substring Without Repeating Characters|Longest Repeating Character Replacement|Minimum Window Substring|Valid Anagram|Group Anagrams|Valid Parentheses|Valid Palindrome|Longest Palindromic Substring|Palindromic Substrings|Encode and Decode Strings|Maximum Depth of Binary Tree|Same Tree|Invert Binary Tree|Binary Tree Maximum Path Sum|Binary Tree Level Order Traversal|Serialize and Deserialize Binary Tree|Subtree of Another Tree|Construct Binary Tree from Preorder and Inorder|Validate Binary Search Tree|Kth Smallest Element in a BST|Lowest Common Ancestor of BST|Implement Trie|Add and Search Word|Word Search II|Top K Frequent Elements|Find Median from Data Stream`.split('|');
  const neetcodeExtra = `Valid Sudoku|Longest Common Prefix|Remove Duplicates from Sorted Array|Move Zeroes|Majority Element|Rotate Array|Happy Number|Plus One|Pow(x,n)|Multiply Strings|Reverse Integer|Find the Duplicate Number|Daily Temperatures|Car Fleet|Largest Rectangle in Histogram|Min Stack|Evaluate Reverse Polish Notation|Generate Parentheses|Binary Search|Koko Eating Bananas|Time Based Key-Value Store|Median of Two Sorted Arrays|Copy List with Random Pointer|Add Two Numbers|LRU Cache|Reverse Nodes in K-Group|Merge Triplets to Form Target|Partition Labels|Gas Station|Hand of Straights|Valid Parenthesis String|Single Number|Reverse Polish Calculator|Task Scheduler|Design Twitter|K Closest Points to Origin|Kth Largest Element in Array|Last Stone Weight|Subsets|Permutations|Combination Sum II|Subsets II|Word Search Backtracking|Palindrome Partitioning|Letter Combinations of Phone Number|N Queens|Rotting Oranges|Walls and Gates|Network Delay Time|Cheapest Flights Within K Stops|Min Cost to Connect All Points|Swim in Rising Water|Reconstruct Itinerary|Min Cost Climbing Stairs|Partition Equal Subset Sum|Target Sum|Interleaving String|Distinct Subsequences|Edit Distance|Burst Balloons|Regular Expression Matching|Maximum Width of Binary Tree|Diameter of Binary Tree|Balanced Binary Tree|Right Side View|Count Good Nodes in Binary Tree|Kth Largest in a Stream|Design Add and Search Words|Find All Anagrams in a String|Basic Calculator|Random Pick with Weight|Spiral Matrix II|Interval List Intersections|Minimum Number of Arrows|Simplify Path`.split('|');
  const topicCycle = ['Arrays', 'Hashing', 'Two pointers', 'Stack', 'Binary search', 'Linked lists', 'Trees', 'Graphs', 'Dynamic programming', 'Intervals'];
  const toProblems = (names) => names.map((title, index) => ({ id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title, topic: topicCycle[Math.floor(index / 8) % topicCycle.length], difficulty: index % 5 === 0 ? 'Hard' : index % 2 === 0 ? 'Medium' : 'Easy' }));
  const dsaSets = {
    blind75: { title: 'Blind 75', source: 'https://www.techinterviewhandbook.org/best-practice-questions/', problems: toProblems(blind75) },
    neetcode150: { title: 'NeetCode 150', source: 'https://neetcode.io/practice', problems: toProblems(blind75.concat(neetcodeExtra)) },
  };

  const data = {
    verifiedAt: VERIFIED_AT,
    youtubeVideoCount: youtubeCatalog.totalVideos,
    paths: curatedPaths.concat(originalCourses),
    tools,
    dsaSets,
  };

  root.SkillUnboundData = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis));
